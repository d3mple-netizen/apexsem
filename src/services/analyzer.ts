import { DomainAnalysis, KeywordOpportunity, AdCopyVariant, CompetitorIntel, TopicalCluster, GeoSignal, BacklinkPlaybook, RoadmapItem, AuthorityTier, TrafficDistribution, TrafficLeakQuery } from '../types';

export const SAMPLE_DOMAINS: Record<string, Partial<DomainAnalysis>> = {
  'linear.app': {
    domain: 'linear.app',
    url: 'https://linear.app',
    niche: 'B2B Issue Tracking & Software Project Management',
    tagline: 'Linear is a purpose-built tool for modern product development.',
    targetAudience: 'Engineering Leaders, Product Managers, Fast-growing Tech Teams'
  },
  'supabase.com': {
    domain: 'supabase.com',
    url: 'https://supabase.com',
    niche: 'Developer Tools & Cloud Backend as a Service (BaaS)',
    tagline: 'The open source Firebase alternative with Postgres database.',
    targetAudience: 'Full-stack Developers, CTOs, Enterprise Architects'
  },
  'ramp.com': {
    domain: 'ramp.com',
    url: 'https://ramp.com',
    niche: 'Corporate Finance & Spend Management Automation',
    tagline: 'The ultimate platform for modern finance teams to control spend.',
    targetAudience: 'CFOs, Finance Directors, Operations Leaders'
  }
};

export function cleanDomain(input: string): string {
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^(https?:\/\/)?(www\.)?/, '');
  cleaned = cleaned.split('/')[0];
  cleaned = cleaned.split('?')[0];
  return cleaned || 'example.com';
}

function detectNiche(domain: string): { niche: string; audience: string; tagline: string; avgCpc: number } {
  const d = domain.toLowerCase();

  if (d.includes('pay') || d.includes('bank') || d.includes('fin') || d.includes('card') || d.includes('ramp') || d.includes('stripe') || d.includes('bill')) {
    return {
      niche: 'FinTech & B2B Spend Automation',
      audience: 'CFOs, VP of Finance, Accounting Leaders, Controllers',
      tagline: 'Intelligent spend management and automated corporate financial workflows.',
      avgCpc: 14.85
    };
  }
  if (d.includes('dev') || d.includes('api') || d.includes('base') || d.includes('db') || d.includes('code') || d.includes('cloud') || d.includes('git') || d.includes('dock') || d.includes('infra')) {
    return {
      niche: 'Developer Infrastructure & Cloud Platforms',
      audience: 'Engineering Leaders, CTOs, DevOps Directors, Fullstack Developers',
      tagline: 'High-performance cloud infrastructure and developer velocity engine.',
      avgCpc: 9.40
    };
  }
  if (d.includes('crm') || d.includes('sales') || d.includes('lead') || d.includes('rev') || d.includes('close') || d.includes('pipeline')) {
    return {
      niche: 'B2B Sales Intelligence & CRM Automation',
      audience: 'VP of Sales, CROs, Revenue Operations, Account Executives',
      tagline: 'AI-driven revenue engine for modern enterprise sales teams.',
      avgCpc: 18.20
    };
  }
  if (d.includes('ai') || d.includes('agent') || d.includes('bot') || d.includes('llm') || d.includes('neural') || d.includes('gpt')) {
    return {
      niche: 'Autonomous AI & Generative Intelligence SaaS',
      audience: 'Founders, Product Leaders, Operations Directors, AI Engineers',
      tagline: 'Next-generation AI agents automating complex enterprise operations.',
      avgCpc: 11.60
    };
  }
  if (d.includes('hr') || d.includes('talent') || d.includes('hire') || d.includes('work') || d.includes('people') || d.includes('recruit')) {
    return {
      niche: 'HRTech & Global Talent Operations',
      audience: 'Chief People Officers, HR Directors, Talent Acquisition Leads',
      tagline: 'Global payroll, onboarding, and compliance automated for modern teams.',
      avgCpc: 12.30
    };
  }
  if (d.includes('sec') || d.includes('guard') || d.includes('shield') || d.includes('auth') || d.includes('trust') || d.includes('audit')) {
    return {
      niche: 'Enterprise Cybersecurity & Compliance',
      audience: 'CISOs, InfoSec Directors, Compliance Officers, VP of Engineering',
      tagline: 'Continuous security posture management and automated compliance framework.',
      avgCpc: 22.50
    };
  }

  // Default B2B SaaS
  const brandName = domain.split('.')[0];
  const capitalized = brandName.charAt(0).toUpperCase() + brandName.slice(1);
  return {
    niche: `${capitalized} B2B SaaS Solutions`,
    audience: 'Enterprise Decision Makers, VP of Operations, Growth Teams',
    tagline: `Streamlined platform engineered for scalable business workflows.`,
    avgCpc: 8.75
  };
}

export function generateDomainAnalysis(rawDomain: string): DomainAnalysis {
  const domain = cleanDomain(rawDomain);
  const nicheInfo = detectNiche(domain);
  const brandName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
  const rootDomain = domain.split('.')[0];

  // Deterministic seed generation based on domain string
  const hash = domain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseScore = 52 + (hash % 34); // between 52 and 86
  const tier: AuthorityTier = baseScore >= 80 ? 'Tier 1 (Market Leader)' : baseScore >= 65 ? 'Tier 2 (Contender)' : 'Tier 3 (Emerging)';

  const technicalHealth = Math.min(98, 65 + (hash % 30));
  const semReadiness = Math.min(95, 55 + ((hash * 3) % 40));
  const topicalAuthority = Math.min(96, 50 + ((hash * 7) % 45));
  const aiSearchVisibility = Math.min(94, 45 + ((hash * 5) % 45));
  const highIntentCoverage = Math.min(92, 58 + ((hash * 2) % 36));

  const monthlyPaidValue = Math.round((28000 + (hash * 420) % 95000) / 100) * 100;
  const potentialMonthlyRevenue = Math.round(monthlyPaidValue * 3.8);
  const currentTrafficEst = Math.round((12000 + (hash * 310) % 85000));
  const targetT1TrafficEst = Math.round(currentTrafficEst * 3.4);
  const wastedSpendPrevented = Math.round((4200 + (hash * 95) % 18000) / 10) * 10;

  // High-Intent SEM Keywords
  const keywords: KeywordOpportunity[] = [
    {
      id: 'kw-1',
      keyword: `best ${rootDomain} alternatives enterprise`,
      intent: 'Competitor Conquest',
      monthlyVolume: 4200 + (hash % 2000),
      cpc: Number((nicheInfo.avgCpc * 1.25).toFixed(2)),
      competition: 'High',
      difficulty: 68,
      matchType: 'Phrase',
      projectedClicks: 680,
      projectedCost: Math.round(680 * nicheInfo.avgCpc * 1.25),
      opportunityScore: 94,
      recommendedAction: 'Deploy dedicated comparison landing page with interactive feature matrix.'
    },
    {
      id: 'kw-2',
      keyword: `${nicheInfo.niche.split('&')[0].trim().toLowerCase()} software pricing`,
      intent: 'Transactional',
      monthlyVolume: 6800 + (hash % 4500),
      cpc: Number((nicheInfo.avgCpc * 1.4).toFixed(2)),
      competition: 'High',
      difficulty: 74,
      matchType: 'Exact',
      projectedClicks: 1140,
      projectedCost: Math.round(1140 * nicheInfo.avgCpc * 1.4),
      opportunityScore: 98,
      recommendedAction: 'Bid with exact match; send directly to transparent ROI calculator page.'
    },
    {
      id: 'kw-3',
      keyword: `automated ${nicheInfo.niche.split(' ')[0].toLowerCase()} tools for teams`,
      intent: 'Commercial',
      monthlyVolume: 3100 + (hash % 1500),
      cpc: Number((nicheInfo.avgCpc * 0.95).toFixed(2)),
      competition: 'Medium',
      difficulty: 52,
      matchType: 'Phrase',
      projectedClicks: 490,
      projectedCost: Math.round(490 * nicheInfo.avgCpc * 0.95),
      opportunityScore: 89,
      recommendedAction: 'Target with high-CTR value-focused Responsive Search Ad.'
    },
    {
      id: 'kw-4',
      keyword: `${domain} review vs competitors`,
      intent: 'Commercial',
      monthlyVolume: 1950 + (hash % 1200),
      cpc: Number((nicheInfo.avgCpc * 0.8).toFixed(2)),
      competition: 'Medium',
      difficulty: 44,
      matchType: 'Exact',
      projectedClicks: 420,
      projectedCost: Math.round(420 * nicheInfo.avgCpc * 0.8),
      opportunityScore: 92,
      recommendedAction: 'Protect brand search real estate with #1 ad position.'
    },
    {
      id: 'kw-5',
      keyword: `enterprise ${nicheInfo.niche.split(' ')[0].toLowerCase()} migration guide`,
      intent: 'Transactional',
      monthlyVolume: 1600 + (hash % 900),
      cpc: Number((nicheInfo.avgCpc * 1.6).toFixed(2)),
      competition: 'Medium',
      difficulty: 59,
      matchType: 'Phrase',
      projectedClicks: 310,
      projectedCost: Math.round(310 * nicheInfo.avgCpc * 1.6),
      opportunityScore: 88,
      recommendedAction: 'Hook high-ACV enterprise switchers with concierge onboarding offer.'
    },
    {
      id: 'kw-6',
      keyword: `how to automate ${nicheInfo.niche.split(' ')[0].toLowerCase()} workflows`,
      intent: 'Informational',
      monthlyVolume: 8900 + (hash % 3000),
      cpc: Number((nicheInfo.avgCpc * 0.45).toFixed(2)),
      competition: 'Low',
      difficulty: 38,
      matchType: 'Phrase',
      projectedClicks: 820,
      projectedCost: Math.round(820 * nicheInfo.avgCpc * 0.45),
      opportunityScore: 78,
      recommendedAction: 'Use for remarketing list building and educational lead magnet.'
    }
  ];

  // Ad Copy Campaigns
  const campaigns: AdCopyVariant[] = [
    {
      id: 'camp-1',
      campaignType: 'Bottom-of-Funnel (BOFU)',
      targetAudience: nicheInfo.audience,
      headlines: [
        `#1 ${brandName} Platform`,
        `Modern ${nicheInfo.niche.split(' ')[0]} Tool`,
        `Start Free Trial Today`,
        `Switch to ${brandName} in 5 Min`,
        `Rated 4.9/5 by 2,000+ Teams`
      ],
      descriptions: [
        `Tired of legacy complexity? Experience the fastest ${nicheInfo.niche.split(' ')[0]} engine built for modern scale.`,
        `Automate repetitive tasks, reduce friction, and boost team velocity. Get instant demo access.`
      ],
      displayPath: `${domain}/Enterprise/FreeTrial`,
      sitelinks: [
        { title: 'Interactive Product Demo', desc: 'See full capability live without waiting for sales' },
        { title: 'Transparent Pricing', desc: 'No hidden setup fees. Flexible monthly or annual plans' },
        { title: 'Enterprise Security & SOC2', desc: 'Bank-grade encryption and ISO-certified infrastructure' },
        { title: 'Customer Case Studies', desc: 'How high-growth tech leaders increased efficiency by 4x' }
      ],
      callouts: ['SOC 2 Type II Certified', '99.99% Uptime SLA', 'Dedicated Success Team', 'Instant 1-Click Migration'],
      cta: 'Start Free 14-Day Trial'
    },
    {
      id: 'camp-2',
      campaignType: 'Competitor Conquest',
      targetAudience: 'Users searching for legacy or bloated alternatives',
      headlines: [
        `Looking for Alternatives?`,
        `Why Teams Switch to ${brandName}`,
        `Modern, Lightning Fast UI`,
        `Save 40% on Enterprise Cost`,
        `Zero Lag. Pure Speed.`
      ],
      descriptions: [
        `Don't get trapped in clunky legacy software. See why top tier teams are migrating to ${brandName}.`,
        `Compare feature-by-feature. Migrate your entire workspace data in under 10 minutes seamlessly.`
      ],
      displayPath: `${domain}/Compare/Better-Alternative`,
      sitelinks: [
        { title: 'Competitor Comparison Guide', desc: 'Unbiased side-by-side feature and pricing analysis' },
        { title: 'Migration Concierge Service', desc: 'Our engineers migrate all your data for free' }
      ],
      callouts: ['No Long-Term Lock-in', '10x Faster Load Times', 'Modern API & Webhooks', 'Loved by Product Teams'],
      cta: 'View Head-to-Head Comparison'
    },
    {
      id: 'camp-3',
      campaignType: 'Brand Defense',
      targetAudience: 'Direct prospects searching for brand name',
      headlines: [
        `Official ${brandName} Site`,
        `The Leading ${nicheInfo.niche.split(' ')[0]} System`,
        `Get Started in 60 Seconds`
      ],
      descriptions: [
        `Welcome to ${brandName}. The modern standard for ${nicheInfo.niche.toLowerCase()}.`,
        `Join thousands of top companies scaling their core operations with ${brandName}.`
      ],
      displayPath: `${domain}/Official`,
      sitelinks: [
        { title: 'Start Free Trial', desc: 'Instant access. No credit card required' },
        { title: 'Schedule Executive Walkthrough', desc: 'Custom tailored consultation with our product team' }
      ],
      callouts: ['Official Website', 'Instant Onboarding', '24/7 Priority Support'],
      cta: 'Sign Up Free'
    }
  ];

  // Competitor Intel
  const competitors: CompetitorIntel[] = [
    {
      name: `LegacyCorp ${nicheInfo.niche.split(' ')[0]}`,
      domain: `legacy${rootDomain}.com`,
      monthlyPaidSpend: 45000,
      topPaidKeywords: [`${nicheInfo.niche.split(' ')[0].toLowerCase()} software`, `enterprise ${rootDomain}`, `best ${rootDomain} tools`],
      vulnerabilities: ['Outdated UI/UX', 'Slow release cycle', 'Bloated pricing and mandatory multi-year contract'],
      marketSharePercentage: 38
    },
    {
      name: `FastScale Cloud`,
      domain: `fastscale-app.io`,
      monthlyPaidSpend: 28000,
      topPaidKeywords: [`cheap ${rootDomain} alternatives`, `cloud ${nicheInfo.niche.split(' ')[0].toLowerCase()}`],
      vulnerabilities: ['Poor customer support', 'Missing enterprise RBAC and audit logs', 'Unreliable uptime'],
      marketSharePercentage: 24
    },
    {
      name: `${brandName} (Your Domain)`,
      domain: domain,
      monthlyPaidSpend: Math.round(monthlyPaidValue * 0.4),
      topPaidKeywords: [`${domain}`, `${nicheInfo.niche.split(' ')[0].toLowerCase()} solution`],
      vulnerabilities: ['Untapped competitor conquest terms', 'Missing negative keyword shield', 'AI search unoptimized'],
      marketSharePercentage: 14
    }
  ];

  // Topical Authority Clusters (Pillars & Clusters for T1 Organic Dominance)
  const topicalClusters: TopicalCluster[] = [
    {
      id: 'cluster-1',
      pillarTitle: `The Definitive Guide to ${nicheInfo.niche} in 2026`,
      targetKeyword: `what is ${nicheInfo.niche.split(' ')[0].toLowerCase()} architecture`,
      searchVolume: 12500,
      intent: 'Informational Pillar',
      clusterSubtopics: [
        { title: `Top 10 Enterprise Pitfalls in ${nicheInfo.niche.split(' ')[0]} & How to Avoid Them`, targetKeyword: `${nicheInfo.niche.split(' ')[0].toLowerCase()} mistakes`, format: 'How-to Guide', difficulty: 32 },
        { title: `${brandName} vs Top 5 Legacy Competitors: Detailed 2026 Benchmark`, targetKeyword: `best ${rootDomain} software comparison`, format: 'Comparison', difficulty: 48 },
        { title: `B2B ROI Calculator: Calculating the Value of Modern ${nicheInfo.niche.split(' ')[0]}`, targetKeyword: `${nicheInfo.niche.split(' ')[0].toLowerCase()} roi calculator`, format: 'ROI Calculator', difficulty: 28 },
        { title: `The Executive Security & Compliance Checklist for ${nicheInfo.niche.split(' ')[0]}`, targetKeyword: `${nicheInfo.niche.split(' ')[0].toLowerCase()} soc2 compliance`, format: 'Template', difficulty: 39 }
      ]
    },
    {
      id: 'cluster-2',
      pillarTitle: `Modern Automation Playbook: Scaling from Seed to Public Company`,
      targetKeyword: `how to scale ${nicheInfo.niche.split(' ')[0].toLowerCase()} infrastructure`,
      searchVolume: 8400,
      intent: 'Commercial Pillar',
      clusterSubtopics: [
        { title: `Migrating from Spreadsheets & Legacy Tools to Automated ${brandName}`, targetKeyword: `migrate to modern ${rootDomain}`, format: 'How-to Guide', difficulty: 26 },
        { title: `API Integration Matrix: Connecting ${brandName} to Your Existing Tech Stack`, targetKeyword: `${rootDomain} webhook integrations`, format: 'Template', difficulty: 34 },
        { title: `Free Download: The 2026 Industry Benchmark Report for ${nicheInfo.niche.split('&')[0].trim()}`, targetKeyword: `${nicheInfo.niche.split(' ')[0].toLowerCase()} industry benchmark`, format: 'ROI Calculator', difficulty: 41 }
      ]
    }
  ];

  // Generative Engine Optimization (GEO) & AI Search Signals
  const geoSignals: GeoSignal[] = [
    {
      platform: 'ChatGPT Search',
      status: baseScore > 75 ? 'Cited' : 'Partial Citation',
      recommendation: `Publish schema-backed technical comparison pages and clear pricing tables so OpenAI's web crawler indexes ${domain} as the authoritative solution.`,
      entityScore: 78
    },
    {
      platform: 'Perplexity AI',
      status: baseScore > 70 ? 'Cited' : 'Invisible',
      recommendation: `Seed authoritative markdown documentation and third-party Reddit/Hacker News discussions to establish strong community entity signals.`,
      entityScore: 68
    },
    {
      platform: 'Google AI Overviews',
      status: 'Partial Citation',
      recommendation: `Structure H2 and bulleted answers directly targeting "How does ${brandName} compare to legacy tools?" to capture AI Overview summary cards.`,
      entityScore: 72
    },
    {
      platform: 'Claude',
      status: baseScore > 78 ? 'Cited' : 'Invisible',
      recommendation: `Enhance Wikipedia-style entity presence, GitHub integrations, and open API documentation to be recognized as a standard category entity.`,
      entityScore: 64
    }
  ];

  // T1 Backlink Plays
  const backlinkPlays: BacklinkPlaybook[] = [
    {
      strategy: 'Proprietary Industry Data Index',
      targetDomainType: 'Tech News & Tier 1 Publications (TechCrunch, Forbes, VentureBeat, WSJ Tech)',
      estimatedDR: 91,
      playbookAngle: `Analyze anonymized user trend metrics across ${nicheInfo.niche} to publish an annual benchmark report that journalists cite as primary source.`,
      difficulty: 'Medium',
      impact: 'Transformational'
    },
    {
      strategy: 'Interactive Free Developer / Ops Utility Tool',
      targetDomainType: 'Developer Blogs, Resource Aggregators, Product Hunt, GitHub Awesome Lists',
      estimatedDR: 84,
      playbookAngle: `Ship a fast, standalone free calculation tool (e.g. "${brandName} Config Generator" or "Audit Tool") that attracts passive recurring backlinks.`,
      difficulty: 'Easy',
      impact: 'High'
    },
    {
      strategy: 'Ecosystem Partner Co-Marketing & Integration Directories',
      targetDomainType: 'SaaS Partner App Stores (Slack, Zapier, HubSpot, AWS Marketplace)',
      estimatedDR: 88,
      playbookAngle: `Build verified app directory listings with bidirectional high-DR dofollow links pointing to your solution pages.`,
      difficulty: 'Easy',
      impact: 'High'
    },
    {
      strategy: 'Digital PR & Founder Thought Leadership Stunts',
      targetDomainType: 'Industry Podcasts, Tier 1 Executive Publications, Substack Publications',
      estimatedDR: 79,
      playbookAngle: `Release a controversial perspective on "Why Legacy ${nicheInfo.niche.split(' ')[0]} Is Dying" with concrete benchmarks and case studies.`,
      difficulty: 'Medium',
      impact: 'High'
    }
  ];

  // Negative Keywords Shield
  const negativeKeywords = [
    'free', 'crack', 'torrent', 'keygen', 'login', 'portal', 'jobs', 'careers',
    'salary', 'internship', 'resume', 'pdf download', 'youtube', 'reddit', 'quora',
    'wikipedia', 'open source github', 'course', 'tutorial for beginners', 'certification',
    'cheap', 'discount code', 'coupon', 'promo', 'customer service phone number',
    'refund', 'scam', 'complaints', 'class action', 'hacked', 'api key leaked',
    'diy', 'homemade', 'unblocked', 'nulled', 'template free doc'
  ];

  // CRO Audit
  const croAudit = {
    headlineScore: Math.min(95, 62 + (hash % 30)),
    messageMatchScore: Math.min(92, 58 + ((hash * 2) % 35)),
    frictionScore: 38, // lower friction is better, 38/100 friction
    findings: [
      {
        issue: 'Hero headline is vague ("A better way to build") rather than explicitly addressing buyer pain point.',
        solution: `Test high-converting outcome-focused headline: "The Modern ${nicheInfo.niche.split(' ')[0]} Engine That Cuts Cycle Time in Half."`,
        severity: 'high' as const
      },
      {
        issue: 'PPC traffic lands on generic homepage instead of hyper-targeted intent landing page.',
        solution: 'Direct paid search ads to customized landing pages matching exact ad copy headline and keyword intent.',
        severity: 'high' as const
      },
      {
        issue: 'Signup form asks for 6 fields including phone number before showing the product.',
        solution: 'Remove phone number and company size from initial step; offer 1-click Google/GitHub Auth to double conversion rate.',
        severity: 'medium' as const
      },
      {
        issue: 'Missing real-time social proof logos above the fold.',
        solution: 'Display 5 prominent customer logos with quotes from recognized VP-level buyers directly under primary CTA.',
        severity: 'medium' as const
      }
    ],
    recommendedHeroHeadline: `The #1 Modern Platform for ${nicheInfo.niche.split('&')[0].trim()}`,
    recommendedHeroSubhead: `Automate manual operations, eliminate bottlenecks, and give your team unfair velocity. Start free in 60 seconds.`,
    recommendedCTA: 'Get Started Free — No Credit Card Needed'
  };

  // 30-60-90 Day T1 Domination Roadmap
  const roadmap: RoadmapItem[] = [
    {
      id: 'road-1',
      phase: 'Phase 1: 0-30 Days (Quick SEM Wins)',
      title: 'Deploy Negative Keyword Shield & Fix Wasted Ad Spend',
      description: `Implement the 35+ negative keyword master list in Google Ads to immediately stop leaking \$${wastedSpendPrevented.toLocaleString()} in wasted budget.`,
      category: 'SEM',
      impact: 'Critical',
      effort: 'Low',
      status: 'pending'
    },
    {
      id: 'road-2',
      phase: 'Phase 1: 0-30 Days (Quick SEM Wins)',
      title: 'Launch High-Intent BOFU & Competitor Conquest Ad Campaigns',
      description: `Activate 3 Responsive Search Ads targeting bottom-of-funnel decision makers and prospects searching for legacy competitors.`,
      category: 'SEM',
      impact: 'Critical',
      effort: 'Medium',
      status: 'in_progress'
    },
    {
      id: 'road-3',
      phase: 'Phase 1: 0-30 Days (Quick SEM Wins)',
      title: 'Align Landing Page Message-Match for Ad Quality Score 10/10',
      description: `Update landing page hero headline and subhead to mirror PPC ad copy, boosting Google Ads Quality Score and dropping CPC by 25-40%.`,
      category: 'CRO',
      impact: 'High',
      effort: 'Low',
      status: 'completed'
    },
    {
      id: 'road-4',
      phase: 'Phase 2: 30-60 Days (Authority Acceleration)',
      title: 'Publish 2 Foundational Topical Pillar Pages with Schema Markup',
      description: `Deploy comprehensive 3,500+ word category guides with SoftwareApplication, FAQ, and Breadcrumb JSON-LD schema to initiate search engine knowledge graph entry.`,
      category: 'SEO/T1',
      impact: 'Critical',
      effort: 'Medium',
      status: 'pending'
    },
    {
      id: 'road-5',
      phase: 'Phase 2: 30-60 Days (Authority Acceleration)',
      title: 'Engineer Generative AI Citation Footprint (GEO Optimization)',
      description: `Structure content for direct LLM synthesis (Perplexity AI, ChatGPT Search, Claude) to become the primary cited vendor in conversational search.`,
      category: 'GEO/AI',
      impact: 'High',
      effort: 'Medium',
      status: 'pending'
    },
    {
      id: 'road-6',
      phase: 'Phase 2: 30-60 Days (Authority Acceleration)',
      title: 'Launch Free Interactive B2B Utility / ROI Calculator',
      description: `Build a standalone client-side calculator on ${domain}/calculator that naturally earns 50+ DR 70+ organic backlinks from industry bloggers.`,
      category: 'SEO/T1',
      impact: 'High',
      effort: 'Medium',
      status: 'pending'
    },
    {
      id: 'road-7',
      phase: 'Phase 3: 60-90 Days (T1 Market Dominance)',
      title: 'Execute Digital PR Data Study to Secure Tier 1 Press Mentions',
      description: `Distribute proprietary industry benchmark data to journalists at TechCrunch, Forbes, and business publications for permanent Tier-1 backlink equity.`,
      category: 'SEO/T1',
      impact: 'Critical',
      effort: 'High',
      status: 'pending'
    },
    {
      id: 'road-8',
      phase: 'Phase 3: 60-90 Days (T1 Market Dominance)',
      title: 'Deploy Automated Smart Bidding & Target CPA / ROAS Scaling',
      description: `Transition high-performing campaigns to Value-Based Bidding once conversion pixel records 50+ monthly qualified enterprise pipeline opportunities.`,
      category: 'SEM',
      impact: 'Critical',
      effort: 'Medium',
      status: 'pending'
    }
  ];

  // Traffic Distribution & Competitor Interception Data
  const clientVisits = Math.round(14500 + ((hash * 210) % 24000));
  const comp1Visits = Math.round(48200 + ((hash * 430) % 35000));
  const comp2Visits = Math.round(29400 + ((hash * 320) % 22000));
  const totalMarketSearches = clientVisits + comp1Visits + comp2Visits;
  const clientSharePercent = Math.round((clientVisits / totalMarketSearches) * 100);
  const comp1SharePercent = Math.round((comp1Visits / totalMarketSearches) * 100);
  const comp2SharePercent = 100 - clientSharePercent - comp1SharePercent;
  const totalLostVisits = comp1Visits + comp2Visits;
  const totalLostRevenue = Math.round(totalLostVisits * nicheInfo.avgCpc * 2.4);

  const leakedQueries: TrafficLeakQuery[] = [
    {
      id: 'leak-1',
      query: `best ${nicheInfo.niche.split('&')[0].trim().toLowerCase()} software`,
      stolenByDomain: `legacy${rootDomain}.com`,
      stolenByName: `LegacyCorp ${nicheInfo.niche.split(' ')[0]}`,
      monthlyVolume: 12400,
      estimatedLostVisits: 5800,
      estimatedLostValue: Math.round(5800 * nicheInfo.avgCpc * 2.2),
      leakReason: 'Competitor runs $14/click exact match Google Ads capturing 62% of top-of-page clicks.',
      fixStrategy: 'Deploy High-Intent BOFU RSA campaign with +15% bid modifier targeting competitor search terms.',
      status: 'leaking'
    },
    {
      id: 'leak-2',
      query: `legacy${rootDomain} pricing & alternatives`,
      stolenByDomain: `legacy${rootDomain}.com`,
      stolenByName: `LegacyCorp ${nicheInfo.niche.split(' ')[0]}`,
      monthlyVolume: 8600,
      estimatedLostVisits: 4200,
      estimatedLostValue: Math.round(4200 * nicheInfo.avgCpc * 2.5),
      leakReason: 'Competitor defends brand query with site links while your domain has no comparison page.',
      fixStrategy: 'Publish dedicated comparison page (domain.com/vs/legacy) with interactive feature checklist & transparent pricing.',
      status: 'leaking'
    },
    {
      id: 'leak-3',
      query: `modern ${nicheInfo.niche.split(' ')[0].toLowerCase()} tool for fast teams`,
      stolenByDomain: `fastscale-app.io`,
      stolenByName: `FastScale Cloud`,
      monthlyVolume: 7100,
      estimatedLostVisits: 3100,
      estimatedLostValue: Math.round(3100 * nicheInfo.avgCpc * 1.8),
      leakReason: 'Competitor ranks #1 organically due to dense topical cluster and SoftwareApplication schema.',
      fixStrategy: 'Deploy 4-part topical cluster and embed JSON-LD Knowledge Graph schema to outrank competitor.',
      status: 'leaking'
    },
    {
      id: 'leak-4',
      query: `what is the best ${nicheInfo.niche.split('&')[0].trim().toLowerCase()} in 2026`,
      stolenByDomain: `legacy${rootDomain}.com`,
      stolenByName: `LegacyCorp ${nicheInfo.niche.split(' ')[0]}`,
      monthlyVolume: 9800,
      estimatedLostVisits: 3900,
      estimatedLostValue: Math.round(3900 * nicheInfo.avgCpc * 2.0),
      leakReason: 'Perplexity AI and ChatGPT Search cite competitor because competitor has Reddit/GitHub entity consensus.',
      fixStrategy: 'Implement Generative Engine Optimization (GEO) direct-answer formatting and publish markdown documentation.',
      status: 'leaking'
    },
    {
      id: 'leak-5',
      query: `enterprise ${nicheInfo.niche.split(' ')[0].toLowerCase()} migration guide`,
      stolenByDomain: `fastscale-app.io`,
      stolenByName: `FastScale Cloud`,
      monthlyVolume: 4300,
      estimatedLostVisits: 1950,
      estimatedLostValue: Math.round(1950 * nicheInfo.avgCpc * 3.1),
      leakReason: 'Competitor offers a 1-click migration concierge which captures ready-to-switch buyers.',
      fixStrategy: 'Add "Free White-Glove Migration in 24 Hours" hero banner and 1-field booking form.',
      status: 'leaking'
    }
  ];

  const trafficDistribution: TrafficDistribution = {
    clientVisits,
    clientSharePercent,
    competitorVisits: [
      {
        name: `LegacyCorp ${nicheInfo.niche.split(' ')[0]}`,
        domain: `legacy${rootDomain}.com`,
        visits: comp1Visits,
        sharePercent: comp1SharePercent,
        color: 'rose'
      },
      {
        name: `FastScale Cloud`,
        domain: `fastscale-app.io`,
        visits: comp2Visits,
        sharePercent: comp2SharePercent,
        color: 'amber'
      }
    ],
    totalMarketSearches,
    totalLostVisits,
    totalLostRevenue,
    leakedQueries,
    isAutoFixed: false
  };

  return {
    domain,
    url: `https://${domain}`,
    analyzedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    niche: nicheInfo.niche,
    tagline: nicheInfo.tagline,
    targetAudience: nicheInfo.audience,
    score: {
      overall: baseScore,
      tier,
      technicalHealth,
      semReadiness,
      topicalAuthority,
      aiSearchVisibility,
      highIntentCoverage
    },
    metrics: {
      monthlyPaidValue,
      potentialMonthlyRevenue,
      currentTrafficEst,
      targetT1TrafficEst,
      averageCpcInNiche: nicheInfo.avgCpc,
      wastedSpendPrevented
    },
    keywords,
    campaigns,
    competitors,
    topicalClusters,
    geoSignals,
    backlinkPlays,
    negativeKeywords,
    croAudit,
    roadmap,
    trafficDistribution
  };
}
