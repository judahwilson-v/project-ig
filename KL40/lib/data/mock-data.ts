import type {
  Career,
  EconomicMetric,
  Insight,
  JobTrend,
  MigrationCorridor,
  MigrationSnapshot,
  NewsItem,
  NewsSource,
  SentimentPulse,
  UserProfile
} from "@/lib/types/domain";

export const defaultUser: UserProfile = {
  id: "user-demo-kerala",
  name: "Akhil",
  skillProfile: ["sql", "excel", "english", "patient-care", "data-analysis", "presentation"],
  preferredCountries: ["Germany", "Ireland", "Canada", "UAE"],
  careerInterest: ["analytics", "fintech", "health-tech"],
  interactionHistory: [
    { targetId: "career-data-analyst", kind: "interested", createdAt: "2026-04-08T08:10:00.000Z" },
    { targetId: "career-healthtech-ops", kind: "saved", createdAt: "2026-04-08T08:15:00.000Z" },
    { targetId: "insight-remittance", kind: "shared", createdAt: "2026-04-08T08:18:00.000Z" }
  ]
};

export const insights: Insight[] = [
  {
    id: "insight-remittance",
    category: "economy",
    title: "Kerala is pricing in a 20% Gulf remittance shock faster than families expected.",
    shortSummary: "District consumption is slowing as Gulf inflows cool and return migration rises.",
    fullSummary:
      "The West Asian slowdown is no longer abstract. Liquidity-sensitive households are already reacting through lower discretionary spending, slower housing upgrades, and tighter education budgets.",
    vectorSummary: "Remittance softness is now a household confidence issue, not just a macro statistic.",
    whyItMatters:
      "If your family depends on overseas income, your monthly cushion is getting hit before local salaries can catch up.",
    readMore:
      "Track remittance impact beside inflation and job demand before deciding whether to stay in Kerala, switch sectors, or prepare for migration.",
    sourceUrl: "https://www.rbi.org.in",
    sourceName: "Reserve Bank of India",
    sourceTrace: ["RBI remittance series", "District spending model", "Kerala finance snapshot"],
    sourceHash: "hash-remittance-2026-04",
    region: "Kerala",
    confidenceScore: 0.91,
    trendingScore: 96,
    createdAt: "2026-04-08T08:00:00.000Z",
    metricSnapshot: {
      label: "Remittance drop",
      value: "20%",
      delta: "+4.1 pts vs Jan"
    }
  },
  {
    id: "insight-gsdp",
    category: "economy",
    title: "The ₹16.29 lakh crore GSDP target now defines whether Kerala feels opportunity or drift.",
    shortSummary: "Budget ambition is high, but execution pressure is landing on jobs and debt capacity.",
    fullSummary:
      "The state can still hit a growth narrative, but labour absorption and private investment need to move with it. Otherwise, the target becomes political theatre rather than lived improvement.",
    vectorSummary: "GSDP target strength matters only if it translates into visible local opportunity.",
    whyItMatters:
      "If job creation lags while the target stays aspirational, youth unemployment and migration pressure stay elevated.",
    readMore:
      "Compare target performance with unemployment, debt stress, and remittance softness to see whether growth is broad-based or cosmetic.",
    sourceUrl: "https://www.kerala.gov.in",
    sourceName: "Kerala Budget",
    sourceTrace: ["2026-27 budget note", "Debt tracker", "Private investment monitor"],
    sourceHash: "hash-gsdp-2026-04",
    region: "Kerala",
    confidenceScore: 0.84,
    trendingScore: 88,
    createdAt: "2026-04-08T06:20:00.000Z",
    metricSnapshot: {
      label: "GSDP target",
      value: "₹16.29L Cr",
      delta: "+6.7% YoY ambition"
    }
  },
  {
    id: "insight-data",
    category: "jobs",
    title: "Data Analytics openings in Kochi and Trivandrum are still the cleanest salary jump in the state.",
    shortSummary: "Demand is up 340% while execution talent remains scarce.",
    fullSummary:
      "Infopark and Technopark hiring is favouring analytics operators who can combine SQL, dashboards, stakeholder communication, and AI-assisted workflow design.",
    vectorSummary: "Analytics is the most scalable upskill path for Kerala graduates who need fast salary lift.",
    whyItMatters:
      "Three practical skills can move you into a role cluster that pays materially better than saturated generalist office jobs.",
    readMore:
      "Use the skill-gap analyzer to see which bridge skills move you from general aptitude to interview-ready demand.",
    sourceUrl: "https://infopark.in",
    sourceName: "Infopark demand desk",
    sourceTrace: ["Hiring pulse", "Mid-level salary sample", "Role cluster analysis"],
    sourceHash: "hash-data-2026-04",
    region: "Kochi/TVM",
    confidenceScore: 0.93,
    trendingScore: 94,
    createdAt: "2026-04-08T05:30:00.000Z",
    metricSnapshot: {
      label: "Demand surge",
      value: "+340%",
      delta: "analytics cluster"
    }
  },
  {
    id: "insight-healthcare",
    category: "jobs",
    title: "Healthcare and health-tech are moving faster than many engineering-adjacent local sectors.",
    shortSummary: "Nursing, care coordination, and hospital analytics are absorbing talent quickly.",
    fullSummary:
      "Healthcare demand is splitting into two lanes: clinical migration routes and technology-enabled hospital operations inside Kerala.",
    vectorSummary: "Healthcare remains one of the best dual-path sectors: local resilience plus migration leverage.",
    whyItMatters:
      "If you want lower downside risk, healthcare gives both local viability and a strong abroad option.",
    readMore:
      "Compare health-tech operations with nursing pathways to see whether local growth or migration gives the better time-to-income outcome.",
    sourceUrl: "https://www.norkaroots.org",
    sourceName: "NORKA Roots",
    sourceTrace: ["Placement updates", "Hospital demand logs", "Visa pipeline trends"],
    sourceHash: "hash-health-2026-04",
    region: "Kerala",
    confidenceScore: 0.89,
    trendingScore: 87,
    createdAt: "2026-04-07T22:10:00.000Z",
    metricSnapshot: {
      label: "Healthcare demand",
      value: "+23%",
      delta: "placement acceleration"
    }
  },
  {
    id: "insight-return",
    category: "migration",
    title: "Return migration is now a startup and survival story at the same time.",
    shortSummary: "Pravasi returnees are coming back with both capital and pressure.",
    fullSummary:
      "Some returnees are launching businesses, but many are also re-entering a local job market that is not ready to absorb them at the same income level.",
    vectorSummary: "Return migration creates inspiration and competition simultaneously.",
    whyItMatters:
      "Your local opportunity is now influenced by both overseas exits and skilled returnees entering the same talent pool.",
    readMore:
      "Monitor live abroad and returnee counters together to understand whether Kerala is exporting skill, importing experience, or doing both unevenly.",
    sourceUrl: "https://www.norkaroots.org",
    sourceName: "NORKA Roots",
    sourceTrace: ["Returnee registry", "Pravasi startup notes", "Monthly inflow model"],
    sourceHash: "hash-return-2026-04",
    region: "Kerala",
    confidenceScore: 0.82,
    trendingScore: 83,
    createdAt: "2026-04-07T18:30:00.000Z",
    metricSnapshot: {
      label: "Returnees this month",
      value: "12,840",
      delta: "+9.4%"
    }
  },
  {
    id: "insight-politics",
    category: "politics",
    title: "Urban middle-class cost anxiety is now one of the strongest swing forces before the Assembly cycle.",
    shortSummary: "Jobs, prices, and migration viability are reshaping the conversation faster than party slogans.",
    fullSummary:
      "Sentiment is increasingly issue-led across Kochi, Trivandrum, and Malabar clusters. Young voters are evaluating who can actually change work, wages, and mobility.",
    vectorSummary: "Political temperature is being driven by livelihood pressure more than identity alone.",
    whyItMatters:
      "Policy around jobs, debt, and investor confidence can change your real options faster than campaign noise suggests.",
    readMore:
      "Use the politics route to track heat by region, top issue shifts, and the election countdown in one place.",
    sourceUrl: "https://dashboard.kerala.gov.in",
    sourceName: "Kerala Open Data",
    sourceTrace: ["Open issue monitor", "Regional sentiment blend", "Urban voter pulse"],
    sourceHash: "hash-politics-2026-04",
    region: "Kerala",
    confidenceScore: 0.78,
    trendingScore: 80,
    createdAt: "2026-04-07T16:45:00.000Z",
    metricSnapshot: {
      label: "Political temperature",
      value: "64/100",
      delta: "issue-led swing"
    }
  }
];

export const careers: Career[] = [
  {
    id: "career-data-analyst",
    title: "Data Analytics Operator",
    industry: "analytics",
    companyType: "Infopark scale-up",
    locationHub: "Kochi",
    openingsCount: 6200,
    avgSalaryKerala: 1200000,
    avgSalaryAbroad: 2200000,
    salaryMinKerala: 700000,
    salaryMaxKerala: 1400000,
    salaryMinAbroad: 1600000,
    salaryMaxAbroad: 2600000,
    demandGrowthPct: 340,
    automationRiskScore: 34,
    futureProofScore: 90,
    skillTags: ["sql", "data-analysis", "dashboarding", "excel", "storytelling"]
  },
  {
    id: "career-fintech-ops",
    title: "Fintech Operations Analyst",
    industry: "fintech",
    companyType: "Product company",
    locationHub: "Trivandrum",
    openingsCount: 2100,
    avgSalaryKerala: 1380000,
    avgSalaryAbroad: 2450000,
    salaryMinKerala: 900000,
    salaryMaxKerala: 1600000,
    salaryMinAbroad: 1800000,
    salaryMaxAbroad: 2800000,
    demandGrowthPct: 140,
    automationRiskScore: 28,
    futureProofScore: 88,
    skillTags: ["sql", "excel", "risk-analysis", "payments", "communication"]
  },
  {
    id: "career-healthtech-ops",
    title: "Health-Tech Operations Lead",
    industry: "health-tech",
    companyType: "Care platform",
    locationHub: "Kochi",
    openingsCount: 1800,
    avgSalaryKerala: 980000,
    avgSalaryAbroad: 1700000,
    salaryMinKerala: 650000,
    salaryMaxKerala: 1200000,
    salaryMinAbroad: 1300000,
    salaryMaxAbroad: 2100000,
    demandGrowthPct: 76,
    automationRiskScore: 18,
    futureProofScore: 86,
    skillTags: ["patient-care", "coordination", "reporting", "english", "workflow-design"]
  },
  {
    id: "career-nursing-eu",
    title: "EU Nursing Pathway Specialist",
    industry: "healthcare",
    companyType: "International healthcare",
    locationHub: "Germany",
    openingsCount: 4200,
    avgSalaryKerala: 420000,
    avgSalaryAbroad: 1620000,
    salaryMinKerala: 320000,
    salaryMaxKerala: 540000,
    salaryMinAbroad: 1200000,
    salaryMaxAbroad: 1900000,
    demandGrowthPct: 23,
    automationRiskScore: 14,
    futureProofScore: 92,
    skillTags: ["nursing", "patient-care", "german", "english", "critical-care"]
  },
  {
    id: "career-clean-energy",
    title: "Clean Energy Field Specialist",
    industry: "clean-energy",
    companyType: "Infrastructure operator",
    locationHub: "Kozhikode",
    openingsCount: 1200,
    avgSalaryKerala: 560000,
    avgSalaryAbroad: 1050000,
    salaryMinKerala: 360000,
    salaryMaxKerala: 720000,
    salaryMinAbroad: 780000,
    salaryMaxAbroad: 1300000,
    demandGrowthPct: 48,
    automationRiskScore: 21,
    futureProofScore: 81,
    skillTags: ["electrical", "diagnostics", "installation", "safety", "field-service"]
  }
];

export const economicMetrics: EconomicMetric[] = [
  {
    id: "metric-gsdp",
    slug: "gsdp-target",
    category: "growth",
    label: "GSDP target",
    value: 16.29,
    displayValue: "₹16.29L Cr",
    unit: "lakh crore",
    changePercentage: 6.7,
    targetValue: 16.29,
    targetDisplayValue: "₹16.29L Cr",
    lastUpdated: "2026-04-08T08:00:00.000Z"
  },
  {
    id: "metric-remittance",
    slug: "remittance-drop",
    category: "remittance",
    label: "Gulf remittance drop",
    value: 20,
    displayValue: "20%",
    unit: "percent",
    changePercentage: 4.1,
    lastUpdated: "2026-04-08T08:00:00.000Z"
  },
  {
    id: "metric-debt",
    slug: "debt-ratio",
    category: "risk",
    label: "Debt ratio",
    value: 38.6,
    displayValue: "38.6%",
    unit: "percent",
    changePercentage: 2.8,
    lastUpdated: "2026-04-08T08:00:00.000Z"
  },
  {
    id: "metric-unemployment",
    slug: "youth-unemployment",
    category: "jobs",
    label: "Youth unemployment",
    value: 27.4,
    displayValue: "27.4%",
    unit: "percent",
    changePercentage: 1.7,
    lastUpdated: "2026-04-08T08:00:00.000Z"
  },
  {
    id: "metric-inflation",
    slug: "household-inflation-pressure",
    category: "inflation",
    label: "Household inflation pressure",
    value: 6.2,
    displayValue: "6.2%",
    unit: "percent",
    changePercentage: 0.9,
    lastUpdated: "2026-04-08T08:00:00.000Z"
  }
];

export const jobTrends: JobTrend[] = [
  {
    id: "jobtrend-analytics",
    sector: "Data Analytics",
    demandLevel: "surging",
    avgSalary: 1200000,
    locationHub: "Kochi / Trivandrum",
    openingsCount: 15000,
    demandGrowthPct: 340,
    companyType: "Infopark / Technopark",
    sourceName: "2026 labour pulse",
    lastUpdated: "2026-04-08T08:00:00.000Z",
    focusSkills: ["sql", "python", "dashboarding", "storytelling", "ai-ops"]
  },
  {
    id: "jobtrend-fintech",
    sector: "Fintech",
    demandLevel: "hot",
    avgSalary: 1380000,
    locationHub: "Trivandrum",
    openingsCount: 4300,
    demandGrowthPct: 140,
    companyType: "Payments / risk",
    sourceName: "Urban hiring desk",
    lastUpdated: "2026-04-08T08:00:00.000Z",
    focusSkills: ["sql", "risk-analysis", "payments", "ops", "compliance"]
  },
  {
    id: "jobtrend-healthtech",
    sector: "Health-Tech",
    demandLevel: "hot",
    avgSalary: 980000,
    locationHub: "Kochi",
    openingsCount: 3200,
    demandGrowthPct: 76,
    companyType: "Care platforms",
    sourceName: "Healthcare demand watch",
    lastUpdated: "2026-04-08T08:00:00.000Z",
    focusSkills: ["coordination", "reporting", "patient-care", "english", "workflow-design"]
  },
  {
    id: "jobtrend-nursing",
    sector: "Nursing",
    demandLevel: "hot",
    avgSalary: 1620000,
    locationHub: "Germany / Ireland",
    openingsCount: 8700,
    demandGrowthPct: 23,
    companyType: "International healthcare",
    sourceName: "Migration placement board",
    lastUpdated: "2026-04-08T08:00:00.000Z",
    focusSkills: ["nursing", "critical-care", "german", "english", "patient-care"]
  }
];

export const migrationTracker: MigrationSnapshot[] = [
  {
    id: "migration-2025-11",
    month: "2025-11-01",
    gulfOutflow: 9200,
    euOutflow: 4600,
    indiaInflow: 1800,
    remittanceIndex: 88.4,
    brainDrainScore: 57,
    gulfDeclinePct: -2.8,
    euGrowthPct: 7.2
  },
  {
    id: "migration-2025-12",
    month: "2025-12-01",
    gulfOutflow: 8840,
    euOutflow: 4980,
    indiaInflow: 1760,
    remittanceIndex: 87.1,
    brainDrainScore: 59,
    gulfDeclinePct: -3.9,
    euGrowthPct: 8.6
  },
  {
    id: "migration-2026-01",
    month: "2026-01-01",
    gulfOutflow: 8420,
    euOutflow: 5360,
    indiaInflow: 1710,
    remittanceIndex: 85.2,
    brainDrainScore: 62,
    gulfDeclinePct: -5.5,
    euGrowthPct: 10.1
  },
  {
    id: "migration-2026-02",
    month: "2026-02-01",
    gulfOutflow: 8040,
    euOutflow: 5890,
    indiaInflow: 1650,
    remittanceIndex: 84.6,
    brainDrainScore: 64,
    gulfDeclinePct: -7.8,
    euGrowthPct: 12.8
  },
  {
    id: "migration-2026-03",
    month: "2026-03-01",
    gulfOutflow: 7720,
    euOutflow: 6180,
    indiaInflow: 1580,
    remittanceIndex: 82.8,
    brainDrainScore: 66,
    gulfDeclinePct: -11.2,
    euGrowthPct: 15.6
  },
  {
    id: "migration-2026-04",
    month: "2026-04-01",
    gulfOutflow: 7480,
    euOutflow: 6520,
    indiaInflow: 1520,
    remittanceIndex: 80.0,
    brainDrainScore: 69,
    gulfDeclinePct: -20.0,
    euGrowthPct: 17.8
  }
];

export const migrationCorridors: MigrationCorridor[] = [
  {
    id: "corridor-uae",
    country: "UAE",
    region: "West Asia",
    corridorLabel: "Kerala → UAE",
    count: 640000,
    flowDirection: "out",
    changePct: -12.4,
    opportunityScore: 48,
    sourceName: "NORKA corridor watch"
  },
  {
    id: "corridor-saudi",
    country: "Saudi Arabia",
    region: "West Asia",
    corridorLabel: "Kerala → Saudi",
    count: 290000,
    flowDirection: "out",
    changePct: -10.8,
    opportunityScore: 46,
    sourceName: "NORKA corridor watch"
  },
  {
    id: "corridor-germany",
    country: "Germany",
    region: "Europe",
    corridorLabel: "Kerala → Germany",
    count: 96000,
    flowDirection: "out",
    changePct: 18.2,
    opportunityScore: 88,
    sourceName: "Migration placement desk"
  },
  {
    id: "corridor-ireland",
    country: "Ireland",
    region: "Europe",
    corridorLabel: "Kerala → Ireland",
    count: 42000,
    flowDirection: "out",
    changePct: 14.7,
    opportunityScore: 81,
    sourceName: "Migration placement desk"
  },
  {
    id: "corridor-canada",
    country: "Canada",
    region: "North America",
    corridorLabel: "Kerala → Canada",
    count: 76000,
    flowDirection: "out",
    changePct: 11.9,
    opportunityScore: 74,
    sourceName: "Migration placement desk"
  },
  {
    id: "corridor-returnees",
    country: "Kerala Returnees",
    region: "Inflow",
    corridorLabel: "Abroad → Kerala",
    count: 12840,
    flowDirection: "in",
    changePct: 9.4,
    opportunityScore: 58,
    sourceName: "Return migration desk"
  }
];

export const sentimentPulse: SentimentPulse[] = [
  {
    id: "pulse-malabar",
    region: "Malabar",
    youthMoodScore: 48,
    unemploymentStress: 71,
    topIssue: "migration viability",
    politicalSentiment: 45
  },
  {
    id: "pulse-central",
    region: "Central Kerala",
    youthMoodScore: 55,
    unemploymentStress: 62,
    topIssue: "cost of living",
    politicalSentiment: 51
  },
  {
    id: "pulse-south",
    region: "South Kerala",
    youthMoodScore: 58,
    unemploymentStress: 57,
    topIssue: "private-sector wages",
    politicalSentiment: 54
  }
];

export const newsSources: NewsSource[] = [
  {
    id: "source-mathrubhumi",
    name: "Mathrubhumi",
    rssUrl: "https://example.com/mathrubhumi-rss.xml",
    language: "Malayalam",
    region: "Kerala",
    isActive: true
  },
  {
    id: "source-manorama",
    name: "Malayala Manorama",
    rssUrl: "https://example.com/manorama-rss.xml",
    language: "Malayalam",
    region: "Kerala",
    isActive: true
  },
  {
    id: "source-hindu",
    name: "The Hindu Kerala",
    rssUrl: "https://example.com/thehindu-kerala-rss.xml",
    language: "English",
    region: "Kerala",
    isActive: true
  }
];

export const newsItems: NewsItem[] = [
  {
    id: "news-1",
    sourceId: "source-mathrubhumi",
    headline: "Urban household costs dominate political conversation in Kochi",
    summary: "Digital mentions are clustering around rent, food inflation, and quality private jobs.",
    region: "Central Kerala",
    topic: "cost of living",
    sentimentScore: 0.64,
    publishedAt: "2026-04-08T07:00:00.000Z",
    sourceHash: "news-hash-1",
    url: "https://example.com/news-1"
  },
  {
    id: "news-2",
    sourceId: "source-manorama",
    headline: "Return migration pressure rises in Malabar job market",
    summary: "Returnees are intensifying local competition for stable roles.",
    region: "Malabar",
    topic: "migration",
    sentimentScore: 0.69,
    publishedAt: "2026-04-08T06:20:00.000Z",
    sourceHash: "news-hash-2",
    url: "https://example.com/news-2"
  },
  {
    id: "news-3",
    sourceId: "source-hindu",
    headline: "Assembly countdown sharpens focus on youth employment promises",
    summary: "Issue-led swing is concentrated around jobs and middle-class pressure.",
    region: "South Kerala",
    topic: "election",
    sentimentScore: 0.58,
    publishedAt: "2026-04-08T05:50:00.000Z",
    sourceHash: "news-hash-3",
    url: "https://example.com/news-3"
  }
];
