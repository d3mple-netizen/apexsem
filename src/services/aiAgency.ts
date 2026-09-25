import { DomainAnalysis } from '../types';

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

export function generateAgencyResponse(userQuery: string, analysis: DomainAnalysis): ChatMessage {
  const query = userQuery.toLowerCase();
  const brandName = analysis.domain.split('.')[0].toUpperCase();
  const niche = analysis.niche;

  let responseText = "";
  let actionSnippet: ChatMessage['actionSnippet'] = undefined;

  if (query.includes('cpc') || query.includes('cost') || query.includes('expensive') || query.includes('budget')) {
    responseText = `To immediately reduce your CPC on ${analysis.domain} by 30-45%:\n\n1. **Improve Quality Score to 9/10**: Google discounts ad auctions heavily when your Landing Page Experience + Ad Relevance are rated "Above Average". We observed your current landing page message match could be tightened.\n2. **Isolate Exact Match Ad Groups (SKAGs / STAGs)**: Do not lump generic terms with exact keywords. Put your high-intent keyword \`${analysis.keywords[0]?.keyword || 'core intent'}\` into its own ad group.\n3. **Deploy the Negative Keyword Shield**: Prevent low-intent queries like "free", "login", or "jobs" from triggering clicks. This preserves budget for buyers with \$10k+ purchase intent.`;
    actionSnippet = {
      type: 'code',
      content: `Target CPA Strategy Formula:\nTarget CPA = (Average Contract Value * Target Close Rate) * 0.15\nFor ${analysis.domain} (~$12,000 ACV @ 4% close rate): Recommended Target CPA is $72.00`
    };
  } else if (query.includes('copy') || query.includes('headline') || query.includes('ad') || query.includes('text')) {
    responseText = `Here are 3 high-converting Responsive Search Ad (RSA) headline sets customized for ${brandName} against legacy competitors:\n\nSet 1 (Pain-Agitation-Solution):\n• "Tired of Bloated Legacy Tools?" (29 chars)\n• "Switch to ${brandName} in Minutes" (26 chars)\n• "10x Faster Team Velocity" (24 chars)\n\nSet 2 (Social Proof & Risk Reversal):\n• "Rated 4.9/5 by 2,000+ Teams" (27 chars)\n• "No Credit Card Required" (23 chars)\n• "SOC-2 Enterprise Security" (25 chars)\n\nSet 3 (Economic Buyer / CFO Angle):\n• "Cut Software Spend by 40%" (25 chars)\n• "Automate Manual Workflows" (25 chars)\n• "Calculate Your ROI Instantly" (28 chars)`;
    actionSnippet = {
      type: 'copy',
      content: `Headline: Why Teams Are Leaving Legacy Tools For ${brandName}\nDescription: Experience the modern speed standard in ${niche}. Zero lag, seamless API integrations, and instant 1-click team setup. Get demo access today.`
    };
  } else if (query.includes('t1') || query.includes('tier 1') || query.includes('rank') || query.includes('seo') || query.includes('google')) {
    responseText = `To establish **Tier 1 (T1) Domain Authority** in Google search for ${analysis.domain}:\n\n1. **Topical Completeness (Entities over Keywords)**: Search engines no longer rank standalone blog posts. You need a semantic cluster with 1 master Pillar Page and 4-6 specialized sub-topic pages interlinked with contextual anchor text.\n2. **Entity Knowledge Graph Registration**: Implement structured schema markup (\`SoftwareApplication\`, \`Organization\`, \`Speakable\`, \`FAQPage\`) so Google identifies ${brandName} as a named brand entity rather than an arbitrary website.\n3. **High-DR Linkable Utility Asset**: Launch a free tool (such as an interactive ROI calculator or config generator) to passively acquire dofollow backlinks from DR 75+ tech portals.`;
    actionSnippet = {
      type: 'code',
      content: `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "${brandName}",\n  "operatingSystem": "Web-based SaaS",\n  "applicationCategory": "BusinessApplication",\n  "aggregateRating": {\n    "@type": "AggregateRating",\n    "ratingValue": "4.9",\n    "reviewCount": "1240"\n  }\n}\n</script>`
    };
  } else if (query.includes('chatgpt') || query.includes('perplexity') || query.includes('ai') || query.includes('geo')) {
    responseText = `**Generative Engine Optimization (GEO)** is the frontier of T1 Search. When users ask Perplexity AI or ChatGPT "What is the best ${niche}?", here is how to guarantee ${analysis.domain} is recommended:\n\n1. **Direct Answer Formatting**: LLMs crawl and extract definitions. Your pages should have direct H2 headers: *"What makes ${brandName} the leading ${niche}?"* followed by a concise 45-word definition.\n2. **Third-Party Consensus Seeding**: Perplexity heavily weights Reddit, GitHub discussions, and independent comparison articles. We recommend publishing verified reviews and engaging in relevant community threads.\n3. **Clear Machine-Readable Comparison Tables**: LLMs love clean Markdown or HTML tables with clear checkmarks comparing features, pricing, and integrations.`;
  } else {
    responseText = `I've analyzed ${analysis.domain}'s current SEM and search posture. With an overall T1 Authority Index of **${analysis.score.overall}/100**, the fastest lever for immediate ARR growth is deploying our Bottom-of-Funnel (BOFU) Google Ads campaigns while simultaneously activating the Negative Keyword Shield to eliminate \$${analysis.metrics.wastedSpendPrevented.toLocaleString()} in wasted spend.\n\nWhat would you like to drill into next? I can generate customized ad copy, reveal competitor keyword conquest vulnerabilities, or produce a JSON-LD schema snippet for your engineering team.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'ai',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actionSnippet
  };
}
