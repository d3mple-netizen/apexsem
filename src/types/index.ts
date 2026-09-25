export type AuthorityTier = 'Tier 3 (Emerging)' | 'Tier 2 (Contender)' | 'Tier 1 (Market Leader)';

export interface ScoreBreakdown {
  overall: number; // 0-100
  tier: AuthorityTier;
  technicalHealth: number; // 0-100
  semReadiness: number; // 0-100
  topicalAuthority: number; // 0-100
  aiSearchVisibility: number; // 0-100 (GEO / Perplexity / ChatGPT / Google SGE)
  highIntentCoverage: number; // 0-100
}

export interface KeywordOpportunity {
  id: string;
  keyword: string;
  intent: 'Transactional' | 'Commercial' | 'Informational' | 'Competitor Conquest';
  monthlyVolume: number;
  cpc: number;
  competition: 'Low' | 'Medium' | 'High';
  difficulty: number; // 0-100
  matchType: 'Exact' | 'Phrase' | 'Broad';
  projectedClicks: number;
  projectedCost: number;
  opportunityScore: number; // 0-100
  recommendedAction: string;
}

export interface AdCopyVariant {
  id: string;
  campaignType: 'Bottom-of-Funnel (BOFU)' | 'Competitor Conquest' | 'Problem-Solution' | 'Brand Defense';
  headlines: string[]; // max 30 chars each
  descriptions: string[]; // max 90 chars each
  displayPath: string; // e.g. /Free-Trial/Enterprise
  sitelinks: { title: string; desc: string }[];
  callouts: string[];
  cta: string;
  targetAudience: string;
}

export interface CompetitorIntel {
  name: string;
  domain: string;
  monthlyPaidSpend: number;
  topPaidKeywords: string[];
  vulnerabilities: string[];
  marketSharePercentage: number;
}

export interface TopicalCluster {
  id: string;
  pillarTitle: string;
  targetKeyword: string;
  searchVolume: number;
  intent: string;
  clusterSubtopics: {
    title: string;
    targetKeyword: string;
    format: 'Comparison' | 'How-to Guide' | 'Template' | 'ROI Calculator' | 'Alternative Page';
    difficulty: number;
  }[];
}

export interface GeoSignal {
  platform: 'ChatGPT Search' | 'Perplexity AI' | 'Google AI Overviews' | 'Claude';
  status: 'Cited' | 'Partial Citation' | 'Invisible';
  recommendation: string;
  entityScore: number;
}

export interface BacklinkPlaybook {
  strategy: string;
  targetDomainType: string;
  estimatedDR: number;
  playbookAngle: string;
  difficulty: 'Easy' | 'Medium' | 'High';
  impact: 'High' | 'Transformational';
}

export interface RoadmapItem {
  id: string;
  phase: 'Phase 1: 0-30 Days (Quick SEM Wins)' | 'Phase 2: 30-60 Days (Authority Acceleration)' | 'Phase 3: 60-90 Days (T1 Market Dominance)';
  title: string;
  description: string;
  category: 'SEM' | 'SEO/T1' | 'CRO' | 'GEO/AI';
  impact: 'Critical' | 'High' | 'Medium';
  effort: 'Low' | 'Medium' | 'High';
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TrafficLeakQuery {
  id: string;
  query: string;
  stolenByDomain: string;
  stolenByName: string;
  monthlyVolume: number;
  estimatedLostVisits: number;
  estimatedLostValue: number;
  leakReason: string;
  fixStrategy: string;
  status: 'leaking' | 'fixed';
}

export interface TrafficDistribution {
  clientVisits: number;
  clientSharePercent: number;
  competitorVisits: {
    name: string;
    domain: string;
    visits: number;
    sharePercent: number;
    color: string;
  }[];
  totalMarketSearches: number;
  totalLostVisits: number;
  totalLostRevenue: number;
  leakedQueries: TrafficLeakQuery[];
  isAutoFixed: boolean;
}

/**
 * Where an analysis came from:
 * - sample: bundled demo report shown before the first run
 * - crawl: live homepage crawl + heuristics
 * - crawl+ai: live crawl enriched by Claude
 * - ai: site could not be crawled, Claude inferred from the domain
 * - estimate: nothing could be fetched; modeled from the domain name only
 */
export type AnalysisSource = 'sample' | 'crawl' | 'crawl+ai' | 'ai' | 'estimate';

/** Facts observed on the live homepage. */
export interface SiteSnapshot {
  domain: string;
  status: number;
  responseMs: number;
  https: boolean;
  title: string;
  description: string;
  ogTitle: string;
  siteName: string;
  h1: string[];
  h2: string[];
  lang?: string;
  canonical: boolean;
  viewport: boolean;
  robotsNoindex: boolean;
  jsonLdTypes: string[];
  wordCount: number;
  imgCount: number;
  imgMissingAlt: number;
}

export interface DomainAnalysis {
  domain: string;
  url: string;
  analyzedAt: string;
  niche: string;
  tagline: string;
  targetAudience: string;
  score: ScoreBreakdown;
  metrics: {
    monthlyPaidValue: number;
    potentialMonthlyRevenue: number;
    currentTrafficEst: number;
    targetT1TrafficEst: number;
    averageCpcInNiche: number;
    wastedSpendPrevented: number;
  };
  keywords: KeywordOpportunity[];
  campaigns: AdCopyVariant[];
  competitors: CompetitorIntel[];
  topicalClusters: TopicalCluster[];
  geoSignals: GeoSignal[];
  backlinkPlays: BacklinkPlaybook[];
  negativeKeywords: string[];
  croAudit: {
    headlineScore: number;
    messageMatchScore: number;
    frictionScore: number;
    findings: { issue: string; solution: string; severity: 'high' | 'medium' | 'low' }[];
    recommendedHeroHeadline: string;
    recommendedHeroSubhead: string;
    recommendedCTA: string;
  };
  roadmap: RoadmapItem[];
  trafficDistribution: TrafficDistribution;
  source?: AnalysisSource;
  fetchError?: string;
  site?: SiteSnapshot;
}
