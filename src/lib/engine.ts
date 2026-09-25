// Shared analysis engine. Runs in the browser (offline fallback) and in the
// Vercel functions under /api, so it must stay free of DOM and Node APIs and
// may only use `import type` (the functions import this file at runtime).
import type {
  DomainAnalysis,
  KeywordOpportunity,
  AdCopyVariant,
  CompetitorIntel,
  TopicalCluster,
  GeoSignal,
  BacklinkPlaybook,
  RoadmapItem,
  AuthorityTier,
  TrafficDistribution,
  TrafficLeakQuery,
  AnalysisSource,
  SiteSnapshot
} from '../types';

export function cleanDomain(input: string): string {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^[a-z]+:\/\//, '').replace(/^www\./, '');
  cleaned = cleaned.split(/[/?#]/)[0];
  cleaned = cleaned.split(':')[0];
  return cleaned || 'example.com';
}

export function isValidPublicHostname(host: string): boolean {
  if (host.length > 253) return false;
  if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host)) return false;
  if (/(^|\.)(localhost|local|internal|intranet|lan|home|corp|test|invalid|example)$/.test(host)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// HTML signal extraction
// ---------------------------------------------------------------------------

export interface SiteSignals extends SiteSnapshot {
  finalUrl: string;
  textSample: string;
  topPhrases: string[];
  hasPricingLink: boolean;
  hasDemoCta: boolean;
  hasSignupCta: boolean;
  hasSocialProof: boolean;
  hasFaq: boolean;
  questionHeadings: number;
  internalLinks: number;
  externalLinks: number;
  formInputs: number;
}

const ENTITY_MAP: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', copy: '©', reg: '®', trade: '™'
};

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
    }
    return ENTITY_MAP[code.toLowerCase()] ?? m;
  });
}

function clean(s: string | undefined | null): string {
  if (!s) return '';
  return decodeEntities(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

/** Collapses text repeated for animation, e.g. "Ship faster Ship faster Ship faster". */
function dedupeRepeats(s: string): string {
  const words = s.split(' ');
  for (let k = 4; k >= 2; k--) {
    if (words.length % k !== 0) continue;
    const size = words.length / k;
    const chunk = words.slice(0, size).join(' ');
    let same = true;
    for (let i = 1; i < k && same; i++) same = words.slice(i * size, (i + 1) * size).join(' ') === chunk;
    if (same) return chunk;
  }
  return s;
}

function metaContent(html: string, key: string): string {
  const re = new RegExp(`<meta\\b[^>]*(?:name|property)\\s*=\\s*["']${key}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  if (!tag) return '';
  return clean(tag.match(/content\s*=\s*"([^"]*)"/i)?.[1] ?? tag.match(/content\s*=\s*'([^']*)'/i)?.[1]);
}

function allTags(html: string, tag: string, limit: number): string[] {
  const out: string[] = [];
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && out.length < limit) {
    const t = dedupeRepeats(clean(m[1]));
    if (t && t.length < 200 && !out.includes(t)) out.push(t);
  }
  return out;
}

const STOPWORDS = new Set(
  (
    'a about above after again all also am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further get gets got had has have having he her here hers him his how i if in into is it its itself just let me more most my no nor not now of off on once only or other our ours out over own same she should so some such than that the their them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours new one two use using used make makes made best top free get started start learn read see sign log login signup cookie cookies privacy policy terms rights reserved copyright inc llc ltd menu home page click here contact us blog news more today now all-in-one everything way ways help helps day days year years time team teams people company companies world us want need like need across every build built'
  ).split(' ')
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9+#-]+/)
    .map((w) => w.replace(/^-+|-+$/g, ''))
    .filter((w) => w.length > 1 && !/^\d+$/.test(w));
}

/** Weighted n-gram extraction: title/h1 count more than body copy. */
export function extractTopPhrases(weighted: { text: string; weight: number }[], brand: string, limit = 12): string[] {
  const scores = new Map<string, number>();
  const brandLc = brand.toLowerCase();
  for (const { text, weight } of weighted) {
    const words = tokenize(text);
    for (let n = 1; n <= 3; n++) {
      for (let i = 0; i + n <= words.length; i++) {
        const gram = words.slice(i, i + n);
        if (gram.some((w) => STOPWORDS.has(w))) continue;
        if (gram.some((w) => w === brandLc)) continue;
        if (n === 1 && gram[0].length < 4) continue;
        const key = gram.join(' ');
        // Multi-word phrases carry more commercial meaning than single tokens.
        scores.set(key, (scores.get(key) ?? 0) + weight * (n === 1 ? 1 : n === 2 ? 2.2 : 2.6));
      }
    }
  }
  const ranked = [...scores.entries()].filter(([, s]) => s >= 3).sort((a, b) => b[1] - a[1]);
  const picked: string[] = [];
  for (const [phrase] of ranked) {
    // Skip phrases already covered by a longer/shorter picked phrase.
    if (picked.some((p) => p.includes(phrase) || phrase.includes(p))) continue;
    picked.push(phrase);
    if (picked.length >= limit) break;
  }
  return picked;
}

export function extractSignals(
  html: string,
  meta: { domain: string; finalUrl: string; status: number; responseMs: number }
): SiteSignals {
  const head = html.slice(0, 200_000);
  const body = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');

  // Skip <title> elements inside inline SVGs; the document title lives in <head>.
  const headOnly = head.split(/<body\b/i)[0];
  const title = clean(headOnly.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const description = metaContent(head, 'description');
  const ogTitle = metaContent(head, 'og:title');
  const ogDescription = metaContent(head, 'og:description');
  const siteName = metaContent(head, 'og:site_name');
  const h1 = allTags(body, 'h1', 5);
  const h2 = allTags(body, 'h2', 20);
  const h3 = allTags(body, 'h3', 20);
  const lang = head.match(/<html\b[^>]*\blang\s*=\s*["']?([a-z-]+)/i)?.[1];
  const canonical = /<link\b[^>]*rel\s*=\s*["']canonical["']/i.test(head);
  const viewport = /<meta\b[^>]*name\s*=\s*["']viewport["']/i.test(head);
  const robotsMeta = metaContent(head, 'robots');
  const robotsNoindex = /noindex/i.test(robotsMeta);

  const jsonLdTypes: string[] = [];
  const ldRe = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let ld: RegExpExecArray | null;
  while ((ld = ldRe.exec(html))) {
    for (const t of ld[1].matchAll(/"@type"\s*:\s*(?:"([^"]+)"|\[([^\]]+)\])/g)) {
      const raw = t[1] ?? t[2] ?? '';
      raw.split(',').map((x) => x.replace(/["\s]/g, '')).filter(Boolean).forEach((x) => {
        if (!jsonLdTypes.includes(x) && jsonLdTypes.length < 12) jsonLdTypes.push(x);
      });
    }
  }

  const imgs = body.match(/<img\b[^>]*>/gi) ?? [];
  const imgMissingAlt = imgs.filter((t) => !/\balt\s*=\s*["'][^"']+["']/i.test(t)).length;

  const anchors = [...body.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const host = meta.domain.replace(/^www\./, '');
  let internalLinks = 0;
  let externalLinks = 0;
  const linkText: string[] = [];
  for (const a of anchors) {
    const href = a[1];
    const text = clean(a[2]).toLowerCase();
    if (text) linkText.push(`${text} ${href.toLowerCase()}`);
    if (/^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
    if (/^https?:\/\//i.test(href) && !href.toLowerCase().includes(host)) externalLinks++;
    else internalLinks++;
  }
  const linksBlob = linkText.join(' | ');
  const bodyText = clean(body);
  const words = bodyText.split(/\s+/).filter(Boolean);
  const lcText = bodyText.toLowerCase();
  const questionHeadings = [...h2, ...h3].filter((h) => /\?$|^(how|what|why|when|which|can|does|is)\b/i.test(h)).length;

  const brand = meta.domain.split('.')[0];
  const topPhrases = extractTopPhrases(
    [
      { text: title || ogTitle, weight: 5 },
      { text: ogTitle, weight: 3 },
      { text: description || ogDescription, weight: 4 },
      ...h1.map((t) => ({ text: t, weight: 4 })),
      ...h2.map((t) => ({ text: t, weight: 2 })),
      ...h3.map((t) => ({ text: t, weight: 1 })),
      { text: bodyText.slice(0, 20_000), weight: 0.35 }
    ],
    brand
  );

  return {
    domain: meta.domain,
    finalUrl: meta.finalUrl,
    status: meta.status,
    responseMs: meta.responseMs,
    https: meta.finalUrl.startsWith('https://'),
    title,
    description: description || ogDescription,
    ogTitle,
    siteName,
    h1,
    h2: h2.slice(0, 12),
    lang,
    canonical,
    viewport,
    robotsNoindex,
    jsonLdTypes,
    wordCount: words.length,
    imgCount: imgs.length,
    imgMissingAlt,
    textSample: bodyText.slice(0, 3500),
    topPhrases,
    hasPricingLink: /pricing|plans|\/price/.test(linksBlob),
    hasDemoCta: /\bdemo\b|book a call|talk to sales|contact sales|schedule/.test(linksBlob + ' ' + lcText.slice(0, 8000)),
    hasSignupCta: /sign ?up|get started|start free|free trial|try (it )?free|create account|register/.test(linksBlob + ' ' + lcText.slice(0, 8000)),
    hasSocialProof: /trusted by|customers|testimonial|case stud|reviews?\b|rated \d|loved by/.test(lcText),
    hasFaq: /faq|frequently asked/.test(lcText) || jsonLdTypes.includes('FAQPage'),
    questionHeadings,
    internalLinks,
    externalLinks,
    formInputs: (body.match(/<input\b(?![^>]*type\s*=\s*["']?(hidden|submit|button|checkbox|radio))[^>]*>/gi) ?? []).length
  };
}

// ---------------------------------------------------------------------------
// Niche detection (keyword vocabulary over real site text, domain as fallback)
// ---------------------------------------------------------------------------

export interface NicheInfo {
  niche: string;
  audience: string;
  tagline: string;
  avgCpc: number;
  category: string; // short noun used inside generated copy, e.g. "spend management"
}

const NICHES: (NicheInfo & { vocab: string[] })[] = [
  { niche: 'FinTech & B2B Spend Automation', category: 'spend management', audience: 'CFOs, VP of Finance, Controllers, Accounting Leads', tagline: 'Spend management and automated finance workflows.', avgCpc: 14.85,
    vocab: ['payments', 'payment', 'invoice', 'invoicing', 'expense', 'expenses', 'spend', 'corporate card', 'accounting', 'bookkeeping', 'payroll', 'banking', 'finance', 'treasury', 'billing', 'ap automation', 'bill pay', 'reimbursement', 'fintech', 'bank', 'card'] },
  { niche: 'Developer Infrastructure & Cloud Platforms', category: 'developer platform', audience: 'CTOs, Engineering Leaders, DevOps, Full-stack Developers', tagline: 'Cloud infrastructure and tooling for developer velocity.', avgCpc: 9.4,
    vocab: ['api', 'apis', 'sdk', 'developers', 'developer', 'database', 'postgres', 'deploy', 'hosting', 'serverless', 'kubernetes', 'infrastructure', 'open source', 'github', 'cli', 'backend', 'cloud', 'observability', 'logs', 'devops', 'edge'] },
  { niche: 'B2B Sales Intelligence & CRM', category: 'sales platform', audience: 'VP of Sales, CROs, RevOps, Account Executives', tagline: 'Revenue engine for modern sales teams.', avgCpc: 18.2,
    vocab: ['crm', 'sales', 'pipeline', 'leads', 'lead generation', 'prospecting', 'outreach', 'revenue', 'deals', 'quota', 'sales team', 'cold email', 'sequences'] },
  { niche: 'Marketing Automation & Analytics', category: 'marketing platform', audience: 'CMOs, Growth Leads, Performance Marketers', tagline: 'Marketing automation and analytics for growth teams.', avgCpc: 11.9,
    vocab: ['marketing', 'analytics', 'seo', 'email marketing', 'campaigns', 'attribution', 'conversion', 'funnel', 'product analytics', 'session replay', 'a/b testing', 'social media', 'content marketing', 'newsletter'] },
  { niche: 'AI Automation & Generative AI SaaS', category: 'AI platform', audience: 'Founders, Product Leaders, Operations Directors, AI Engineers', tagline: 'AI agents that automate complex business operations.', avgCpc: 11.6,
    vocab: ['ai', 'artificial intelligence', 'llm', 'agents', 'agent', 'gpt', 'machine learning', 'generative', 'copilot', 'chatbot', 'automation', 'models'] },
  { niche: 'Project Management & Team Productivity', category: 'project management', audience: 'Engineering Managers, Product Managers, Operations Leads', tagline: 'Plan, track and ship work faster.', avgCpc: 8.9,
    vocab: ['project management', 'issue tracking', 'issues', 'roadmap', 'tasks', 'sprints', 'workflow', 'collaboration', 'productivity', 'docs', 'wiki', 'kanban', 'planning', 'product development'] },
  { niche: 'HRTech & Talent Operations', category: 'HR platform', audience: 'Chief People Officers, HR Directors, Talent Leads', tagline: 'Hiring, payroll and people operations in one place.', avgCpc: 12.3,
    vocab: ['hr', 'hiring', 'recruiting', 'recruitment', 'talent', 'employees', 'onboarding', 'people ops', 'benefits', 'eor', 'contractors', 'applicant tracking', 'job board', 'candidates'] },
  { niche: 'Cybersecurity & Compliance', category: 'security platform', audience: 'CISOs, Security Engineers, Compliance Officers', tagline: 'Continuous security posture and automated compliance.', avgCpc: 22.5,
    vocab: ['security', 'soc 2', 'soc2', 'compliance', 'iso 27001', 'threat', 'vulnerability', 'identity', 'sso', 'zero trust', 'endpoint', 'siem', 'gdpr', 'hipaa', 'pentest', 'authentication'] },
  { niche: 'E-commerce & Direct-to-Consumer', category: 'online store', audience: 'Online shoppers, repeat buyers, gift purchasers', tagline: 'Products shipped direct to your door.', avgCpc: 1.35,
    vocab: ['shop', 'cart', 'add to cart', 'free shipping', 'shipping', 'returns', 'collection', 'sale', 'buy now', 'checkout', 'products', 'store', 'order'] },
  { niche: 'Healthcare & Clinics', category: 'clinic', audience: 'Patients researching treatment, caregivers, referring providers', tagline: 'Care you can book today.', avgCpc: 6.8,
    vocab: ['patients', 'clinic', 'doctor', 'treatment', 'dental', 'therapy', 'health', 'medical', 'appointment', 'care', 'physician', 'telehealth'] },
  { niche: 'Legal Services', category: 'law firm', audience: 'Individuals and businesses needing legal representation', tagline: 'Experienced counsel when it matters.', avgCpc: 38.5,
    vocab: ['attorney', 'lawyer', 'law firm', 'legal', 'injury', 'litigation', 'consultation', 'case', 'immigration', 'divorce'] },
  { niche: 'Real Estate & Property', category: 'real estate', audience: 'Home buyers, sellers, investors, renters', tagline: 'Find, buy or sell property with confidence.', avgCpc: 3.1,
    vocab: ['real estate', 'homes', 'property', 'properties', 'listings', 'mortgage', 'rent', 'apartments', 'realtor', 'buy a home'] },
  { niche: 'Education & Online Learning', category: 'online course', audience: 'Learners, career switchers, L&D managers', tagline: 'Learn practical skills online.', avgCpc: 4.6,
    vocab: ['courses', 'course', 'learn', 'students', 'learning', 'bootcamp', 'certificate', 'training', 'tutoring', 'classes', 'education'] },
  { niche: 'Travel & Hospitality', category: 'travel booking', audience: 'Leisure and business travelers', tagline: 'Book stays and trips with fewer surprises.', avgCpc: 1.9,
    vocab: ['hotel', 'hotels', 'travel', 'booking', 'flights', 'rooms', 'stay', 'vacation', 'tours', 'resort', 'destinations'] },
  { niche: 'Agencies & Professional Services', category: 'agency services', audience: 'Founders and marketing leads hiring outside expertise', tagline: 'Expert services delivered by a specialist team.', avgCpc: 9.8,
    vocab: ['agency', 'consulting', 'services', 'clients', 'our work', 'case studies', 'strategy', 'design studio', 'development services', 'consultancy'] }
];

export function detectNiche(domain: string, siteText = ''): NicheInfo {
  const text = ` ${siteText.toLowerCase()} `;
  const d = domain.toLowerCase();
  let best: (typeof NICHES)[number] | null = null;
  let bestScore = 0;
  for (const n of NICHES) {
    let score = 0;
    for (const v of n.vocab) {
      const re = new RegExp(`[^a-z0-9]${v.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}[^a-z0-9]`, 'g');
      const hits = text.match(re)?.length ?? 0;
      score += Math.min(hits, 6) * (v.includes(' ') ? 2 : 1);
      if (v.length >= 3 && !v.includes(' ') && d.includes(v)) score += 3;
    }
    if (score > bestScore) {
      bestScore = score;
      best = n;
    }
  }
  if (best && bestScore >= 3) {
    const { vocab: _vocab, ...info } = best;
    return info;
  }
  const brand = capitalize(domain.split('.')[0]);
  return {
    niche: `${brand} — B2B Software`,
    category: 'software',
    audience: 'Business decision makers, operations and growth teams',
    tagline: 'Software platform for scalable business workflows.',
    avgCpc: 8.75
  };
}

// ---------------------------------------------------------------------------
// AI enrichment contract (produced by /api/analyze when ANTHROPIC_API_KEY set)
// ---------------------------------------------------------------------------

export interface AiEnrichment {
  niche?: string;
  category?: string;
  tagline?: string;
  targetAudience?: string;
  avgCpc?: number;
  keywords?: {
    keyword: string;
    intent: KeywordOpportunity['intent'];
    monthlyVolume: number;
    cpc: number;
    competition: KeywordOpportunity['competition'];
    difficulty: number;
    recommendedAction: string;
  }[];
  competitors?: { name: string; domain: string; topPaidKeywords: string[]; vulnerabilities: string[] }[];
  ads?: { bofu?: { headlines: string[]; descriptions: string[] }; conquest?: { headlines: string[]; descriptions: string[] }; brand?: { headlines: string[]; descriptions: string[] } };
  croFindings?: { issue: string; solution: string; severity: 'high' | 'medium' | 'low' }[];
  heroHeadline?: string;
  heroSubhead?: string;
  cta?: string;
  negativeKeywords?: string[];
}

// ---------------------------------------------------------------------------
// Analysis builder
// ---------------------------------------------------------------------------

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

/** Trims to max chars on a word boundary (Google Ads limits: 30 / 90). */
export function fitChars(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max + 1);
  const i = cut.lastIndexOf(' ');
  return (i > max * 0.5 ? cut.slice(0, i) : t.slice(0, max)).replace(/[,.;:\-–—]+$/, '');
}

function hashOf(s: string): number {
  return s.split('').reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) >>> 0, 7);
}

interface Scores {
  technicalHealth: number;
  semReadiness: number;
  topicalAuthority: number;
  aiSearchVisibility: number;
  highIntentCoverage: number;
}

function scoreFromSignals(s: SiteSignals): Scores {
  let tech = 100;
  if (!s.title) tech -= 15;
  else if (s.title.length < 15 || s.title.length > 65) tech -= 5;
  if (!s.description) tech -= 12;
  else if (s.description.length < 70 || s.description.length > 170) tech -= 4;
  if (s.h1.length === 0) tech -= 10;
  else if (s.h1.length > 1) tech -= 4;
  if (!s.canonical) tech -= 5;
  if (!s.viewport) tech -= 12;
  if (!s.https) tech -= 15;
  if (s.robotsNoindex) tech -= 30;
  if (s.imgCount > 0) tech -= Math.round((s.imgMissingAlt / s.imgCount) * 10);
  if (s.responseMs > 2500) tech -= 8;
  else if (s.responseMs > 1200) tech -= 4;
  if (s.wordCount < 250) tech -= 6;

  let sem = 40;
  if (s.hasPricingLink) sem += 15;
  if (s.hasSignupCta) sem += 15;
  if (s.hasDemoCta) sem += 8;
  if (s.hasSocialProof) sem += 10;
  if (s.description) sem += 6;
  if (s.h1.length === 1) sem += 6;

  const topical = 28 + Math.min(24, s.h2.length * 3) + Math.min(20, s.internalLinks / 4) + Math.min(22, s.wordCount / 90);

  let geo = 30;
  if (s.jsonLdTypes.length) geo += 18;
  if (s.jsonLdTypes.some((t) => /Organization|SoftwareApplication|Product|LocalBusiness/.test(t))) geo += 10;
  if (s.hasFaq) geo += 12;
  geo += Math.min(15, s.questionHeadings * 4);
  if (s.description) geo += 6;
  if (s.lang) geo += 4;

  let intent = 35;
  if (s.hasPricingLink) intent += 18;
  if (s.hasDemoCta) intent += 12;
  if (s.hasSignupCta) intent += 12;
  if (/\bvs\b|compare|alternative/i.test([...s.h2, ...s.topPhrases].join(' '))) intent += 12;

  return {
    technicalHealth: clamp(tech, 18, 99),
    semReadiness: clamp(sem, 20, 97),
    topicalAuthority: clamp(topical, 20, 96),
    aiSearchVisibility: clamp(geo, 15, 95),
    highIntentCoverage: clamp(intent, 20, 95)
  };
}

function scoreFromHash(hash: number): Scores {
  return {
    technicalHealth: Math.min(98, 65 + (hash % 30)),
    semReadiness: Math.min(95, 55 + ((hash * 3) % 40)),
    topicalAuthority: Math.min(96, 50 + ((hash * 7) % 45)),
    aiSearchVisibility: Math.min(94, 45 + ((hash * 5) % 45)),
    highIntentCoverage: Math.min(92, 58 + ((hash * 2) % 36))
  };
}

interface CroFinding {
  issue: string;
  solution: string;
  severity: 'high' | 'medium' | 'low';
}

function findingsFromSignals(s: SiteSignals, category: string): CroFinding[] {
  const f: CroFinding[] = [];
  if (s.robotsNoindex) f.push({ issue: 'Homepage carries a robots "noindex" directive — Google is told not to index it.', solution: 'Remove noindex from the production homepage meta robots tag and re-submit in Search Console.', severity: 'high' });
  if (s.h1.length === 0) f.push({ issue: 'No H1 on the homepage, so neither visitors nor Google get a clear statement of what you sell.', solution: `Add one H1 that names the outcome and the category, e.g. "${capitalize(category)} that …" with the buyer's result.`, severity: 'high' });
  else if (s.h1.length > 1) f.push({ issue: `${s.h1.length} H1 headings compete for the page topic ("${s.h1[0]}", "${s.h1[1]}").`, solution: 'Keep a single H1 for the value proposition; demote the rest to H2.', severity: 'medium' });
  if (!s.description) f.push({ issue: 'Missing meta description — Google writes its own snippet, usually a worse one.', solution: 'Write a 140–160 character description with the main keyword, a proof point and a CTA.', severity: 'high' });
  else if (s.description.length > 170) f.push({ issue: `Meta description is ${s.description.length} characters and gets truncated in results.`, solution: 'Cut it to 150–160 characters and put the offer in the first 100.', severity: 'low' });
  if (!s.title && s.ogTitle) f.push({ issue: 'The <title> tag is empty in the server HTML; it is only filled in by JavaScript.', solution: 'Render the title server-side so every crawler and link preview sees it, not just Google’s JS renderer.', severity: 'medium' });
  else if (!s.title) f.push({ issue: 'Page has no <title>.', solution: 'Add a 50–60 character title: primary keyword + brand.', severity: 'high' });
  else if (s.title.length > 65) f.push({ issue: `Title tag is ${s.title.length} characters and will be cut off in search results.`, solution: 'Shorten to ~55 characters and lead with the keyword buyers search for.', severity: 'medium' });
  if (!s.hasPricingLink) f.push({ issue: 'No pricing link found on the homepage. Paid clicks with purchase intent hit a dead end.', solution: 'Link a pricing page from the nav; even "from $X/mo" lifts qualified conversion on paid traffic.', severity: 'high' });
  if (!s.hasSignupCta && !s.hasDemoCta) f.push({ issue: 'No clear primary call to action (sign up, trial or demo) detected.', solution: 'Put one primary CTA above the fold and repeat it after each major section.', severity: 'high' });
  if (!s.hasSocialProof) f.push({ issue: 'No social proof (customer logos, reviews, case studies) detected on the page.', solution: 'Add 4–6 recognizable customer logos and one quantified quote right under the hero CTA.', severity: 'medium' });
  if (s.jsonLdTypes.length === 0) f.push({ issue: 'No JSON-LD structured data, so search and AI engines have to guess what the entity is.', solution: 'Add Organization + SoftwareApplication/Product schema (see the T1 Organic tab for a ready snippet).', severity: 'medium' });
  if (!s.viewport) f.push({ issue: 'No viewport meta tag — mobile rendering and mobile rankings suffer.', solution: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">.', severity: 'high' });
  if (s.responseMs > 1500) f.push({ issue: `Homepage HTML took ${(s.responseMs / 1000).toFixed(1)}s to respond from our crawler.`, solution: 'Cache the homepage at the edge/CDN; aim for under 600 ms time-to-first-byte.', severity: s.responseMs > 3000 ? 'high' : 'medium' });
  if (s.formInputs > 5) f.push({ issue: `A form on the homepage asks for ${s.formInputs} fields.`, solution: 'Cut the first step to email only; collect the rest after activation.', severity: 'medium' });
  if (s.imgCount > 3 && s.imgMissingAlt / s.imgCount > 0.3) f.push({ issue: `${s.imgMissingAlt} of ${s.imgCount} images have no alt text.`, solution: 'Add descriptive alt text; it helps accessibility and image search.', severity: 'low' });
  const rank = { high: 0, medium: 1, low: 2 };
  return f.sort((a, b) => rank[a.severity] - rank[b.severity]);
}

function defaultFindings(category: string): CroFinding[] {
  return [
    { issue: 'Hero headline is likely generic rather than naming the buyer’s outcome.', solution: `Test an outcome-first headline: "The ${category} that cuts [painful task] in half."`, severity: 'high' },
    { issue: 'PPC traffic usually lands on the generic homepage instead of an intent-matched page.', solution: 'Point each ad group at a landing page whose headline mirrors the ad and keyword.', severity: 'high' },
    { issue: 'Signup flows commonly ask for phone and company size before showing value.', solution: 'Reduce step one to email or 1-click Google sign-in.', severity: 'medium' },
    { issue: 'Social proof is often below the fold.', solution: 'Place 5 customer logos and one quantified quote directly under the primary CTA.', severity: 'medium' }
  ];
}

function keywordsFromPhrases(phrases: string[], root: string, info: NicheInfo, hash: number): KeywordOpportunity[] {
  const cat = info.category;
  const core = phrases.filter((p) => p.split(' ').length >= 2).slice(0, 4);
  const single = phrases.filter((p) => p.split(' ').length === 1).slice(0, 2);
  const topics = [...core, ...single];
  const specs: { keyword: string; intent: KeywordOpportunity['intent']; mult: number; comp: KeywordOpportunity['competition']; diff: number; match: KeywordOpportunity['matchType']; action: string }[] = [];
  const t0 = topics[0] ?? cat;
  specs.push({ keyword: `${t0} pricing`, intent: 'Transactional', mult: 1.4, comp: 'High', diff: 72, match: 'Exact', action: 'Exact match to a pricing/ROI page; highest purchase intent in the set.' });
  specs.push({ keyword: `best ${cat}`, intent: 'Commercial', mult: 1.15, comp: 'High', diff: 64, match: 'Phrase', action: 'Send to a comparison page listing you vs. the top 3 alternatives.' });
  specs.push({ keyword: `${root} alternatives`, intent: 'Competitor Conquest', mult: 1.25, comp: 'Medium', diff: 48, match: 'Phrase', action: 'Own this SERP yourself with a "why teams choose us" page before competitors bid on it.' });
  specs.push({ keyword: `${cat} for small business`, intent: 'Commercial', mult: 0.95, comp: 'Medium', diff: 45, match: 'Phrase', action: 'Segment-specific ad group with a tailored headline and case study.' });
  specs.push({ keyword: `${root} vs`, intent: 'Commercial', mult: 0.8, comp: 'Medium', diff: 38, match: 'Phrase', action: 'Brand defense: bid on your own comparison queries and publish /vs/ pages.' });
  specs.push({ keyword: `how to choose ${cat}`, intent: 'Informational', mult: 0.45, comp: 'Low', diff: 32, match: 'Broad', action: 'Content + remarketing audience; cheap clicks that feed retargeting lists.' });
  // The site's own headline language: worth testing, but check real search volume first.
  for (const phrase of topics.slice(1, 3)) {
    specs.push({ keyword: phrase, intent: 'Commercial', mult: 0.9, comp: 'Low', diff: 35, match: 'Phrase', action: 'Your homepage leads with this phrase. Verify volume in Keyword Planner before bidding.' });
  }

  return specs.map((s, i) => {
    const vol = 480 + ((hash >> (i + 1)) % 5200) + (s.intent === 'Informational' ? 2400 : 0);
    const cpc = Number((info.avgCpc * s.mult).toFixed(2));
    const clicks = Math.round(vol * (s.match === 'Exact' ? 0.11 : 0.08));
    return {
      id: `kw-${i + 1}`,
      keyword: s.keyword.replace(/\s+/g, ' ').trim(),
      intent: s.intent,
      monthlyVolume: vol,
      cpc,
      competition: s.comp,
      difficulty: s.diff,
      matchType: s.match,
      projectedClicks: clicks,
      projectedCost: Math.round(clicks * cpc),
      opportunityScore: clamp(96 - i * 3 - (s.intent === 'Informational' ? 10 : 0), 55, 99),
      recommendedAction: s.action
    };
  });
}

export interface BuildInput {
  domain: string;
  signals?: SiteSignals | null;
  ai?: AiEnrichment | null;
  source: AnalysisSource;
  fetchError?: string;
}

export function buildAnalysis({ domain: rawDomain, signals, ai, source, fetchError }: BuildInput): DomainAnalysis {
  const domain = cleanDomain(rawDomain);
  const rootDomain = domain.split('.')[0];
  const brandName = signals?.siteName && signals.siteName.length <= 24 ? signals.siteName : capitalize(rootDomain);
  const siteText = signals ? [signals.title, signals.description, ...signals.h1, ...signals.h2, signals.textSample].join(' ') : '';
  const detected = detectNiche(domain, siteText);
  const info: NicheInfo = {
    niche: ai?.niche || detected.niche,
    category: ai?.category || detected.category,
    audience: ai?.targetAudience || detected.audience,
    tagline: ai?.tagline || signals?.description || detected.tagline,
    avgCpc: ai?.avgCpc && ai.avgCpc > 0 && ai.avgCpc < 200 ? Number(ai.avgCpc.toFixed(2)) : detected.avgCpc
  };
  const cat = info.category;
  const catCap = capitalize(cat);

  const hash = hashOf(domain);
  const sc = signals ? scoreFromSignals(signals) : scoreFromHash(hash);
  const baseScore = clamp(
    sc.technicalHealth * 0.25 + sc.semReadiness * 0.2 + sc.topicalAuthority * 0.2 + sc.aiSearchVisibility * 0.15 + sc.highIntentCoverage * 0.2,
    10,
    99
  );
  const tier: AuthorityTier = baseScore >= 80 ? 'Tier 1 (Market Leader)' : baseScore >= 65 ? 'Tier 2 (Contender)' : 'Tier 3 (Emerging)';

  // Modeled economics: scale with niche CPC. These are estimates, not Ads data.
  const cpcFactor = info.avgCpc / 10;
  const monthlyPaidValue = Math.round(((18000 + ((hash * 420) % 95000)) * Math.max(0.25, cpcFactor)) / 100) * 100;
  const potentialMonthlyRevenue = Math.round(monthlyPaidValue * 3.8);
  const currentTrafficEst = Math.round(12000 + ((hash * 310) % 85000));
  const targetT1TrafficEst = Math.round(currentTrafficEst * 3.4);
  const wastedSpendPrevented = Math.round(((4200 + ((hash * 95) % 18000)) * Math.max(0.3, cpcFactor)) / 10) * 10;

  // Keywords
  let keywords: KeywordOpportunity[];
  if (ai?.keywords?.length) {
    keywords = ai.keywords.slice(0, 10).map((k, i) => {
      const cpc = Number(Math.max(0.1, Math.min(250, k.cpc || info.avgCpc)).toFixed(2));
      const vol = clamp(k.monthlyVolume || 500, 10, 2_000_000);
      const matchType: KeywordOpportunity['matchType'] = k.intent === 'Transactional' ? 'Exact' : k.intent === 'Informational' ? 'Broad' : 'Phrase';
      const clicks = Math.round(vol * (matchType === 'Exact' ? 0.11 : 0.08));
      return {
        id: `kw-${i + 1}`,
        keyword: k.keyword.toLowerCase(),
        intent: k.intent,
        monthlyVolume: vol,
        cpc,
        competition: k.competition,
        difficulty: clamp(k.difficulty || 50, 1, 100),
        matchType,
        projectedClicks: clicks,
        projectedCost: Math.round(clicks * cpc),
        opportunityScore: clamp(97 - i * 3 - (k.intent === 'Informational' ? 8 : 0), 50, 99),
        recommendedAction: k.recommendedAction || 'Launch in a dedicated ad group with message-matched landing page.'
      };
    });
  } else {
    keywords = keywordsFromPhrases(signals?.topPhrases ?? [], rootDomain, info, hash);
  }

  // Ad copy
  const fitH = (arr: string[] | undefined, fallback: string[]) =>
    (arr?.length ? arr : fallback).map((h) => fitChars(h, 30)).filter(Boolean).slice(0, 8);
  const fitD = (arr: string[] | undefined, fallback: string[]) =>
    (arr?.length ? arr : fallback).map((d) => fitChars(d, 90)).filter(Boolean).slice(0, 4);
  const heroPromise = signals?.h1[0] && signals.h1[0].length <= 30 ? signals.h1[0] : `${catCap} Built for Speed`;

  const campaigns: AdCopyVariant[] = [
    {
      id: 'camp-1',
      campaignType: 'Bottom-of-Funnel (BOFU)',
      targetAudience: info.audience,
      headlines: fitH(ai?.ads?.bofu?.headlines, [`${brandName} ${catCap}`, heroPromise, 'Start Free Today', `See ${brandName} Pricing`, `Switch to ${brandName} in a Day`]),
      descriptions: fitD(ai?.ads?.bofu?.descriptions, [
        `${info.tagline}`,
        `Try ${brandName} free, see transparent pricing, and get set up without a sales call.`
      ]),
      displayPath: `${domain}/pricing`,
      sitelinks: [
        { title: 'Pricing', desc: 'Plans, limits and what is included' },
        { title: 'Product Tour', desc: 'See the product before you sign up' },
        { title: 'Customer Stories', desc: 'Results from teams like yours' },
        { title: 'Security', desc: 'How your data is protected' }
      ],
      callouts: ['No Credit Card to Start', 'Setup in Minutes', 'Cancel Anytime', 'Human Support'],
      cta: signals?.hasDemoCta && !signals.hasSignupCta ? 'Book a Demo' : 'Start Free Trial'
    },
    {
      id: 'camp-2',
      campaignType: 'Competitor Conquest',
      targetAudience: `Buyers comparing ${cat} alternatives`,
      headlines: fitH(ai?.ads?.conquest?.headlines, ['Looking for an Alternative?', `Why Teams Switch to ${brandName}`, `Compare ${catCap} Side by Side`, 'Migrate Without Downtime', 'No Long-Term Contract']),
      descriptions: fitD(ai?.ads?.conquest?.descriptions, [
        `Compare ${brandName} feature by feature and price by price before you renew.`,
        'Bring your data over with guided migration. Keep working while you switch.'
      ]),
      displayPath: `${domain}/compare`,
      sitelinks: [
        { title: 'Comparison Guide', desc: 'Features and pricing side by side' },
        { title: 'Migration Help', desc: 'We help move your data' }
      ],
      callouts: ['No Lock-in', 'Free Migration Help', 'Month-to-Month Plans'],
      cta: 'See the Comparison'
    },
    {
      id: 'camp-3',
      campaignType: 'Brand Defense',
      targetAudience: 'People searching for your brand by name',
      headlines: fitH(ai?.ads?.brand?.headlines, [`${brandName} Official Site`, `${brandName} — ${catCap}`, 'Get Started in 60 Seconds']),
      descriptions: fitD(ai?.ads?.brand?.descriptions, [
        `The official ${brandName} site. ${info.tagline}`,
        `Sign in, start a trial or talk to the ${brandName} team.`
      ]),
      displayPath: `${domain}/official`,
      sitelinks: [
        { title: 'Start Free', desc: 'Instant access' },
        { title: 'Talk to Us', desc: 'Get answers from the team' }
      ],
      callouts: ['Official Website', 'Fast Onboarding', 'Priority Support'],
      cta: 'Get Started'
    }
  ];

  // Competitors
  const aiComps = (ai?.competitors ?? []).filter((c) => c.name && c.domain).slice(0, 3);
  const compA = aiComps[0] ?? { name: `Category incumbent`, domain: `(largest ${cat} brand)`, topPaidKeywords: [`${cat} software`, `best ${cat}`], vulnerabilities: ['Slower release cycle', 'Higher price point and annual contracts', 'Heavier onboarding'] };
  const compB = aiComps[1] ?? { name: `Low-cost challenger`, domain: `(budget ${cat} tool)`, topPaidKeywords: [`cheap ${cat}`, `${cat} free plan`], vulnerabilities: ['Thin support', 'Missing enterprise controls', 'Limited integrations'] };
  const competitors: CompetitorIntel[] = [
    { name: compA.name, domain: compA.domain, monthlyPaidSpend: Math.round(45000 * Math.max(0.3, cpcFactor)), topPaidKeywords: compA.topPaidKeywords.slice(0, 4), vulnerabilities: compA.vulnerabilities.slice(0, 3), marketSharePercentage: 38 },
    { name: compB.name, domain: compB.domain, monthlyPaidSpend: Math.round(28000 * Math.max(0.3, cpcFactor)), topPaidKeywords: compB.topPaidKeywords.slice(0, 4), vulnerabilities: compB.vulnerabilities.slice(0, 3), marketSharePercentage: 24 },
    ...(aiComps[2] ? [{ name: aiComps[2].name, domain: aiComps[2].domain, monthlyPaidSpend: Math.round(16000 * Math.max(0.3, cpcFactor)), topPaidKeywords: aiComps[2].topPaidKeywords.slice(0, 4), vulnerabilities: aiComps[2].vulnerabilities.slice(0, 3), marketSharePercentage: 12 }] : []),
    {
      name: `${brandName} (you)`,
      domain,
      monthlyPaidSpend: Math.round(monthlyPaidValue * 0.4),
      topPaidKeywords: [rootDomain, keywords[0]?.keyword ?? `${cat} solution`],
      vulnerabilities: signals ? findingsFromSignals(signals, cat).slice(0, 3).map((f) => f.issue.split(/[.—]/)[0]) : ['Untapped competitor conquest terms', 'No negative keyword shield', 'AI search unoptimized'],
      marketSharePercentage: 14
    }
  ];

  // Topical clusters
  const p0 = signals?.topPhrases.find((p) => p.includes(' ')) ?? cat;
  const topicalClusters: TopicalCluster[] = [
    {
      id: 'cluster-1',
      pillarTitle: `The Complete Guide to ${capitalize(p0)} (2026)`,
      targetKeyword: `what is ${p0}`,
      searchVolume: 4000 + (hash % 9000),
      intent: 'Informational Pillar',
      clusterSubtopics: [
        { title: `${capitalize(p0)}: 10 Mistakes Teams Make and How to Avoid Them`, targetKeyword: `${p0} mistakes`, format: 'How-to Guide', difficulty: 32 },
        { title: `${brandName} vs the Top 5 ${catCap} Alternatives`, targetKeyword: `best ${cat} comparison`, format: 'Comparison', difficulty: 48 },
        { title: `${catCap} ROI Calculator`, targetKeyword: `${cat} roi calculator`, format: 'ROI Calculator', difficulty: 28 },
        { title: `${catCap} Buyer’s Checklist`, targetKeyword: `${cat} checklist`, format: 'Template', difficulty: 39 }
      ]
    },
    {
      id: 'cluster-2',
      pillarTitle: `How to Choose ${capitalize(cat)}: A Buyer’s Playbook`,
      targetKeyword: `how to choose ${cat}`,
      searchVolume: 2000 + (hash % 6000),
      intent: 'Commercial Pillar',
      clusterSubtopics: [
        { title: `Migrating to ${brandName}: Step-by-Step`, targetKeyword: `migrate to ${rootDomain}`, format: 'How-to Guide', difficulty: 26 },
        { title: `${brandName} Integrations Directory`, targetKeyword: `${rootDomain} integrations`, format: 'Template', difficulty: 34 },
        { title: `${rootDomain} Alternatives: Honest Comparison`, targetKeyword: `${rootDomain} alternatives`, format: 'Alternative Page', difficulty: 41 }
      ]
    }
  ];

  const hasSchema = !!signals?.jsonLdTypes.length;
  const geoSignals: GeoSignal[] = [
    { platform: 'ChatGPT Search', status: baseScore > 75 ? 'Cited' : 'Partial Citation', recommendation: `Publish schema-backed comparison pages and a plain pricing table so ${domain} is quotable as the answer.`, entityScore: clamp(sc.aiSearchVisibility + 6, 10, 99) },
    { platform: 'Perplexity AI', status: baseScore > 70 ? 'Cited' : 'Invisible', recommendation: 'Seed third-party discussion (Reddit, G2, industry forums); Perplexity weights consensus sources heavily.', entityScore: clamp(sc.aiSearchVisibility - 4, 10, 99) },
    { platform: 'Google AI Overviews', status: hasSchema ? 'Partial Citation' : 'Invisible', recommendation: `Answer "What is ${brandName}?" and "How does ${brandName} compare?" in 40–60 word paragraphs under question-style H2s.`, entityScore: clamp(sc.aiSearchVisibility, 10, 99) },
    { platform: 'Claude', status: baseScore > 78 ? 'Cited' : 'Invisible', recommendation: 'Keep public docs, pricing and an About page crawlable; consistent entity facts across the web drive citations.', entityScore: clamp(sc.aiSearchVisibility - 8, 10, 99) }
  ];

  const backlinkPlays: BacklinkPlaybook[] = [
    { strategy: 'Proprietary data report', targetDomainType: 'Industry publications and trade press', estimatedDR: 85, playbookAngle: `Publish an annual benchmark on ${cat} built from anonymized usage data; journalists cite primary data.`, difficulty: 'Medium', impact: 'Transformational' },
    { strategy: 'Free utility tool', targetDomainType: 'Resource lists, blogs, Product Hunt', estimatedDR: 78, playbookAngle: `Ship a free ${cat} calculator or generator that earns links on its own.`, difficulty: 'Easy', impact: 'High' },
    { strategy: 'Integration directories', targetDomainType: 'Partner marketplaces (Zapier, Slack, HubSpot, Shopify)', estimatedDR: 88, playbookAngle: 'List every integration you have in partner directories; each listing is a high-DR link.', difficulty: 'Easy', impact: 'High' },
    { strategy: 'Founder point of view', targetDomainType: 'Podcasts and newsletters in your niche', estimatedDR: 70, playbookAngle: `Pitch a contrarian, data-backed take on where ${cat} is heading.`, difficulty: 'Medium', impact: 'High' }
  ];

  const baseNegatives = ['free download', 'crack', 'torrent', 'jobs', 'careers', 'salary', 'internship', 'resume', 'login', 'sign in', 'customer service phone', 'refund', 'scam', 'complaints', 'wikipedia', 'reddit', 'youtube', 'pdf', 'course', 'certification', 'meaning', 'definition', 'diy', 'template free', 'coupon', 'promo code'];
  const negativeKeywords = [...new Set([...(ai?.negativeKeywords ?? []).map((n) => n.toLowerCase().trim()).filter(Boolean), ...baseNegatives])].slice(0, 40);

  const realFindings = signals ? findingsFromSignals(signals, cat) : [];
  const aiFindings = (ai?.croFindings ?? []).filter((f) => f.issue && f.solution);
  const findings = [...realFindings.slice(0, 4), ...aiFindings.slice(0, 3)];
  const croFindings = (findings.length ? findings : defaultFindings(cat)).slice(0, 6);
  const highCount = croFindings.filter((f) => f.severity === 'high').length;
  const croAudit = {
    headlineScore: signals ? clamp(signals.h1.length === 1 ? 78 - (signals.h1[0].split(' ').length > 12 ? 10 : 0) : 45, 20, 95) : Math.min(95, 62 + (hash % 30)),
    messageMatchScore: signals ? clamp(sc.semReadiness - 4, 20, 95) : Math.min(92, 58 + ((hash * 2) % 35)),
    frictionScore: clamp(20 + highCount * 12 + (signals?.formInputs ?? 2) * 2, 10, 90),
    findings: croFindings,
    recommendedHeroHeadline: ai?.heroHeadline || `The ${cat} your team will actually use`,
    recommendedHeroSubhead: ai?.heroSubhead || `${info.tagline} Start free in 60 seconds.`,
    recommendedCTA: ai?.cta || 'Start free — no credit card'
  };

  const roadmap: RoadmapItem[] = [
    { id: 'road-1', phase: 'Phase 1: 0-30 Days (Quick SEM Wins)', title: 'Add the negative keyword list to every Search campaign', description: `Upload the ${negativeKeywords.length}-term shared negative list to stop paying for irrelevant clicks (an estimated ~$${Math.max(1, Math.round(wastedSpendPrevented / 1000))}K/mo).`, category: 'SEM', impact: 'Critical', effort: 'Low', status: 'pending' },
    { id: 'road-2', phase: 'Phase 1: 0-30 Days (Quick SEM Wins)', title: 'Launch BOFU and brand-defense campaigns', description: `Start with the ${keywords.filter((k) => k.intent !== 'Informational').length} high-intent keywords and the 3 RSA sets in the SEM tab.`, category: 'SEM', impact: 'Critical', effort: 'Medium', status: 'pending' },
    { id: 'road-3', phase: 'Phase 1: 0-30 Days (Quick SEM Wins)', title: croFindings[0] ? `Fix: ${fitChars(croFindings[0].issue, 70)}` : 'Match landing page to ad copy', description: croFindings[0]?.solution ?? 'Mirror ad headlines on the landing page to raise Quality Score.', category: 'CRO', impact: 'High', effort: 'Low', status: 'pending' },
    { id: 'road-4', phase: 'Phase 2: 30-60 Days (Authority Acceleration)', title: 'Publish 2 pillar pages with schema markup', description: `"${topicalClusters[0].pillarTitle}" and "${topicalClusters[1].pillarTitle}", each with FAQ + Breadcrumb JSON-LD.`, category: 'SEO/T1', impact: 'Critical', effort: 'Medium', status: 'pending' },
    { id: 'road-5', phase: 'Phase 2: 30-60 Days (Authority Acceleration)', title: 'Make the site quotable for AI search', description: 'Question-style H2s with 40–60 word answers, a plain pricing table and Organization schema.', category: 'GEO/AI', impact: 'High', effort: 'Medium', status: 'pending' },
    { id: 'road-6', phase: 'Phase 2: 30-60 Days (Authority Acceleration)', title: `Ship a free ${cat} calculator`, description: `A standalone tool at ${domain}/calculator that earns links without outreach.`, category: 'SEO/T1', impact: 'High', effort: 'Medium', status: 'pending' },
    { id: 'road-7', phase: 'Phase 3: 60-90 Days (T1 Market Dominance)', title: 'Publish a data report for press coverage', description: 'Turn anonymized product data into a benchmark report and pitch it to trade press.', category: 'SEO/T1', impact: 'Critical', effort: 'High', status: 'pending' },
    { id: 'road-8', phase: 'Phase 3: 60-90 Days (T1 Market Dominance)', title: 'Move winning campaigns to Target CPA / ROAS', description: 'Switch to value-based bidding once each campaign records 30–50 conversions a month.', category: 'SEM', impact: 'Critical', effort: 'Medium', status: 'pending' }
  ];

  // Traffic share model
  const clientVisits = Math.round(14500 + ((hash * 210) % 24000));
  const comp1Visits = Math.round(48200 + ((hash * 430) % 35000));
  const comp2Visits = Math.round(29400 + ((hash * 320) % 22000));
  const totalMarketSearches = clientVisits + comp1Visits + comp2Visits;
  const clientSharePercent = Math.round((clientVisits / totalMarketSearches) * 100);
  const comp1SharePercent = Math.round((comp1Visits / totalMarketSearches) * 100);
  const comp2SharePercent = 100 - clientSharePercent - comp1SharePercent;
  const totalLostVisits = comp1Visits + comp2Visits;
  const totalLostRevenue = Math.round(totalLostVisits * info.avgCpc * 2.4);
  const kw = (i: number, fb: string) => keywords[i]?.keyword ?? fb;

  const leakedQueries: TrafficLeakQuery[] = [
    { id: 'leak-1', query: kw(1, `best ${cat}`), stolenByDomain: compA.domain, stolenByName: compA.name, monthlyVolume: 12400, estimatedLostVisits: 5800, estimatedLostValue: Math.round(5800 * info.avgCpc * 2.2), leakReason: 'Competitor bids on this term and holds the top ad slot.', fixStrategy: 'Launch the BOFU RSA with a +15% bid adjustment on this exact term.', status: 'leaking' },
    { id: 'leak-2', query: kw(2, `${rootDomain} alternatives`), stolenByDomain: compA.domain, stolenByName: compA.name, monthlyVolume: 8600, estimatedLostVisits: 4200, estimatedLostValue: Math.round(4200 * info.avgCpc * 2.5), leakReason: 'You have no comparison page, so comparison searchers land elsewhere.', fixStrategy: `Publish ${domain}/compare with a feature and pricing table.`, status: 'leaking' },
    { id: 'leak-3', query: kw(3, `${cat} tools`), stolenByDomain: compB.domain, stolenByName: compB.name, monthlyVolume: 7100, estimatedLostVisits: 3100, estimatedLostValue: Math.round(3100 * info.avgCpc * 1.8), leakReason: 'Competitor ranks organically with a denser topic cluster.', fixStrategy: 'Publish the pillar + cluster pages from the T1 Organic tab.', status: 'leaking' },
    { id: 'leak-4', query: `what is the best ${cat} in 2026`, stolenByDomain: compA.domain, stolenByName: compA.name, monthlyVolume: 9800, estimatedLostVisits: 3900, estimatedLostValue: Math.round(3900 * info.avgCpc * 2.0), leakReason: 'AI answers (ChatGPT, Perplexity) cite the competitor, not you.', fixStrategy: 'Apply the GEO checklist: question H2s, concise answers, schema.', status: 'leaking' },
    { id: 'leak-5', query: kw(0, `${cat} pricing`), stolenByDomain: compB.domain, stolenByName: compB.name, monthlyVolume: 4300, estimatedLostVisits: 1950, estimatedLostValue: Math.round(1950 * info.avgCpc * 3.1), leakReason: signals && !signals.hasPricingLink ? 'Your homepage has no pricing link, so price shoppers bounce.' : 'Competitor shows price in ad copy; you do not.', fixStrategy: 'Add price anchors to ad copy and a pricing link to the nav.', status: 'leaking' }
  ];

  const trafficDistribution: TrafficDistribution = {
    clientVisits,
    clientSharePercent,
    competitorVisits: [
      { name: compA.name, domain: compA.domain, visits: comp1Visits, sharePercent: comp1SharePercent, color: 'rose' },
      { name: compB.name, domain: compB.domain, visits: comp2Visits, sharePercent: comp2SharePercent, color: 'amber' }
    ],
    totalMarketSearches,
    totalLostVisits,
    totalLostRevenue,
    leakedQueries,
    isAutoFixed: false
  };

  const snapshot: SiteSnapshot | undefined = signals
    ? {
        domain: signals.domain, status: signals.status, responseMs: signals.responseMs, https: signals.https, title: signals.title,
        description: signals.description, ogTitle: signals.ogTitle, siteName: signals.siteName, h1: signals.h1, h2: signals.h2,
        lang: signals.lang, canonical: signals.canonical, viewport: signals.viewport, robotsNoindex: signals.robotsNoindex,
        jsonLdTypes: signals.jsonLdTypes, wordCount: signals.wordCount, imgCount: signals.imgCount, imgMissingAlt: signals.imgMissingAlt
      }
    : undefined;

  return {
    domain,
    url: signals?.finalUrl ?? `https://${domain}`,
    analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    niche: info.niche,
    tagline: info.tagline,
    targetAudience: info.audience,
    score: { overall: baseScore, tier, ...sc },
    metrics: { monthlyPaidValue, potentialMonthlyRevenue, currentTrafficEst, targetT1TrafficEst, averageCpcInNiche: info.avgCpc, wastedSpendPrevented },
    keywords,
    campaigns,
    competitors,
    topicalClusters,
    geoSignals,
    backlinkPlays,
    negativeKeywords,
    croAudit,
    roadmap,
    trafficDistribution,
    source,
    fetchError,
    site: snapshot
  };
}
