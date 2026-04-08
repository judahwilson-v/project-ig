export type InsightCategory = "economy" | "politics" | "jobs" | "migration";
export type RiskLevel = "stable" | "caution" | "risk" | "critical";
export type MigrationRecommendation = "stay" | "leave" | "hybrid";
export type JobDemandLevel = "surging" | "hot" | "steady" | "cooling";
export type FlowDirection = "in" | "out";
export type PoliticalSwing = "LDF" | "UDF" | "mixed" | "volatile";

export interface Insight {
  id: string;
  category: InsightCategory;
  title: string;
  shortSummary: string;
  fullSummary: string;
  vectorSummary: string;
  whyItMatters: string;
  readMore: string;
  sourceUrl: string;
  sourceName: string;
  sourceTrace: string[];
  sourceHash: string;
  region: string;
  confidenceScore: number;
  trendingScore: number;
  createdAt: string;
  metricSnapshot: {
    label: string;
    value: string;
    delta: string;
  };
}

export interface Career {
  id: string;
  title: string;
  industry: string;
  companyType: string;
  locationHub: string;
  openingsCount: number;
  avgSalaryKerala: number;
  avgSalaryAbroad: number;
  salaryMinKerala: number;
  salaryMaxKerala: number;
  salaryMinAbroad: number;
  salaryMaxAbroad: number;
  demandGrowthPct: number;
  automationRiskScore: number;
  futureProofScore: number;
  skillTags: string[];
}

export interface JobTrend {
  id: string;
  sector: string;
  demandLevel: JobDemandLevel;
  avgSalary: number;
  locationHub: string;
  openingsCount: number;
  demandGrowthPct: number;
  companyType: string;
  sourceName: string;
  lastUpdated: string;
  focusSkills: string[];
}

export interface EconomicMetric {
  id: string;
  slug: string;
  category: "growth" | "risk" | "remittance" | "jobs" | "inflation";
  label: string;
  value: number;
  displayValue: string;
  unit: string;
  changePercentage: number;
  targetValue?: number;
  targetDisplayValue?: string;
  lastUpdated: string;
}

export interface MigrationSnapshot {
  id: string;
  month: string;
  gulfOutflow: number;
  euOutflow: number;
  indiaInflow: number;
  remittanceIndex: number;
  brainDrainScore: number;
  gulfDeclinePct: number;
  euGrowthPct: number;
}

export interface MigrationCorridor {
  id: string;
  country: string;
  region: string;
  corridorLabel: string;
  count: number;
  flowDirection: FlowDirection;
  changePct: number;
  opportunityScore: number;
  sourceName: string;
}

export interface SentimentPulse {
  id: string;
  region: string;
  youthMoodScore: number;
  unemploymentStress: number;
  topIssue: string;
  politicalSentiment: number;
}

export interface NewsSource {
  id: string;
  name: string;
  rssUrl: string;
  language: string;
  region: string;
  isActive: boolean;
}

export interface NewsItem {
  id: string;
  sourceId: string;
  headline: string;
  summary: string;
  region: string;
  topic: string;
  sentimentScore: number;
  publishedAt: string;
  sourceHash: string;
  url: string;
}

export interface UserInteractionRecord {
  targetId: string;
  kind: "interested" | "ignored" | "saved" | "shared" | "explained";
  createdAt?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  skillProfile: string[];
  preferredCountries: string[];
  careerInterest: string[];
  interactionHistory: UserInteractionRecord[];
}

export interface CareerMatch {
  career: Career;
  fitScore: number;
  skillMatchScore: number;
  futureScore: number;
  salaryLeverage: number;
  preferredCountryBoost: number;
  demandMomentum: number;
  gapSkills: string[];
  narrative: string;
}

export interface CrisisInput {
  gdpGapPct: number;
  remittanceDropPct: number;
  youthUnemploymentPct: number;
  debtRatioPct: number;
}

export interface CrisisAssessment {
  score: number;
  riskLevel: RiskLevel;
  predictiveWarning: string;
  displayLabel: string;
  drivers: Array<{
    label: string;
    score: number;
    value: string;
  }>;
}

export interface MigrationAdvice {
  recommendation: MigrationRecommendation;
  confidence: number;
  summary: string;
  bestDestinations: string[];
  reasoning: string[];
}

export interface MigrationLiveCounter {
  currentAbroad: number;
  returneesThisMonth: number;
  netMonthlyFlow: number;
  remittanceImpactIndex: number;
  trendLabel: string;
}

export interface AlertSignal {
  id: string;
  title: string;
  detail: string;
  severity: RiskLevel;
  category: InsightCategory | "personal";
}

export interface ExplainerResponse {
  headline: string;
  lines: [string, string, string];
  visualHint: string;
}

export interface RemittanceSimulationInput {
  monthlyRemittance: number;
  dependenceRatio: number;
  householdMembers: number;
}

export interface RemittanceSimulationResult {
  annualLoss: number;
  projectedMonthlyGap: number;
  inflationPressure: number;
  budgetStress: number;
  riskLevel: RiskLevel;
  recommendations: string[];
}

export interface SkillGapReport {
  topCareer: CareerMatch;
  bridgeSkills: string[];
  salaryDeltaEstimate: number;
  readinessScore: number;
  narrative: string;
  matchingRoles: string[];
}

export interface PoliticalTemperature {
  score: number;
  swingDirection: PoliticalSwing;
  electionCountdown: number;
  leadingNarrative: string;
  heatmap: SentimentPulse[];
  headlines: NewsItem[];
}

export interface ExplainerCache {
  key: string;
  headline: string;
  lines: [string, string, string];
  visualHint: string;
  sourceHash: string;
  createdAt: string;
}
