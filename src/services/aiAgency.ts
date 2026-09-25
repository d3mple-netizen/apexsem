import { DomainAnalysis } from '../types';
import { isMeasured, approx } from '../lib/honest';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionSnippet?: {
    type: 'copy' | 'keyword' | 'code' | 'roadmap';
    content: string;
  };
}

/**
 * Offline fallback when no LLM is reachable. Fixed English templates: they
 * must not invent facts about the user's business, so anything that needs
 * real proof is a [bracketed placeholder].
 */
export function generateAgencyResponse(userQuery: string, analysis: DomainAnalysis): ChatMessage {
  const query = userQuery.toLowerCase();
  // Letter-aware word start, so Russian stems match too.
  const has = (...words: string[]) => words.some((w) => new RegExp(`(^|[^\\p{L}\\p{N}])${w}`, 'u').test(query));
  const brandName = analysis.domain.split('.')[0].toUpperCase();
  const niche = analysis.niche;
  const headline = (h: string) => `• "${h}" (${h.length} chars)`;

  let responseText = '';
  let actionSnippet: ChatMessage['actionSnippet'] = undefined;

  if (has('cpc', 'cost', 'expensive', 'budget', 'bid', 'цен', 'ставк', 'бюджет', 'дорог', 'клик')) {
    responseText = `To bring CPC down on ${analysis.domain}:\n\n1. **Raise Quality Score**: Google charges less when Landing Page Experience and Ad Relevance are rated "Above average". Mirror your ad headline on the landing page.\n2. **Give exact match its own ad group**: Do not lump generic terms with exact keywords. Put your high-intent keyword \`${analysis.keywords[0]?.keyword || 'core intent'}\` into its own ad group.\n3. **Add a shared negative list**: Block low-intent queries like "free", "login" or "jobs" so budget goes to buyers.`;
    actionSnippet = {
      type: 'code',
      content: `Target CPA = Average contract value x Close rate x 0.15\n\nExample with assumed numbers, not your data:\nACV $12,000 x 4% close rate x 0.15 = Target CPA $72\n\nReplace ACV and close rate with your own figures.`
    };
  } else if (has('copy', 'headline', 'ads?\\b', 'text', 'rsa', 'заголов', 'объявлен', 'текст', 'креатив')) {
    responseText = `Three Responsive Search Ad headline sets for ${brandName}. Brackets are placeholders: fill them only with facts you can prove, or drop the line.\n\nSet 1 (Pain and switch):\n${headline('Tired of Bloated Legacy Tools?')}\n${headline(`Switch to ${brandName}`)}\n${headline('Less Busywork for Your Team')}\n\nSet 2 (Proof and risk reversal):\n${headline('Rated [Your G2 Rating] on G2')}\n${headline('[Your Free Trial Offer]')}\n${headline('[Your Security Certification]')}\n\nSet 3 (Economic buyer):\n${headline('Cut Software Spend by [X]%')}\n${headline('Automate Manual Workflows')}\n${headline('See Pricing and ROI')}`;
    actionSnippet = {
      type: 'copy',
      content: `Headline: Switch to ${brandName}\nDescription: [One concrete outcome] for ${niche} teams. [A proof point you can back up]. Book a demo.`
    };
  } else if (has('t1', 'tier 1', 'rank', 'seo', 'schema', 'json-ld', 'разметк', 'позиц', 'органик')) {
    responseText = `To build topical authority for ${analysis.domain} in Google:\n\n1. **Cover the topic, not single keywords**: One pillar page and 4-6 supporting pages, linked to each other with descriptive anchor text.\n2. **Mark up the brand entity**: Add \`SoftwareApplication\`, \`Organization\` and \`FAQPage\` schema so Google reads ${brandName} as a named brand, not just a website.\n3. **Ship a linkable free tool**: An ROI calculator or config generator earns links from high-authority sites without outreach.`;
    actionSnippet = {
      type: 'code',
      content: `<!-- Replace YOUR_... values. Add aggregateRating only if real reviews are visible on the page. -->\n<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "${brandName}",\n  "url": "https://${analysis.domain}",\n  "operatingSystem": "Web",\n  "applicationCategory": "BusinessApplication",\n  "offers": { "@type": "Offer", "price": "YOUR_PRICE", "priceCurrency": "USD" }\n}\n</script>`
    };
  } else if (has('chatgpt', 'perplexity', 'ai\\b', 'geo', 'llm', 'нейросет', 'ии(?!\\p{L})')) {
    responseText = `**Generative Engine Optimization (GEO)** means being the source AI assistants quote. When someone asks Perplexity or ChatGPT "What is the best ${niche}?", these moves raise the odds that ${analysis.domain} comes up:\n\n1. **Answer directly**: Use question-style H2s such as *"What is ${brandName}?"* followed by a plain 40-60 word answer.\n2. **Earn third-party mentions**: Perplexity leans on Reddit, GitHub and independent comparison articles. Real reviews and useful community answers count.\n3. **Publish clean comparison tables**: Features, pricing and integrations in a simple HTML table are easy for a model to lift.`;
  } else {
    const measured = isMeasured(analysis);
    const score = measured ? `an authority score of **${analysis.score.overall}/100**` : `a modeled authority score of about **${Math.round(analysis.score.overall / 5) * 5}/100** (estimate, not measured)`;
    responseText = `${analysis.domain} has ${score}. The fastest lever is usually bottom-of-funnel Google Ads campaigns plus a shared negative keyword list, which could save roughly ${approx(analysis.metrics.wastedSpendPrevented, { money: true })}/mo in irrelevant clicks (modeled, check it against your account).\n\nWhat next? I can draft ad copy, look at competitor keywords, or write a JSON-LD snippet for your developers.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actionSnippet
  };
}
