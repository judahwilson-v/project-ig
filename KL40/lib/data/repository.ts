import {
  careers as mockCareers,
  defaultUser,
  economicMetrics as mockEconomicMetrics,
  insights as mockInsights,
  jobTrends as mockJobTrends,
  migrationCorridors as mockMigrationCorridors,
  migrationTracker as mockMigrationTracker,
  newsItems as mockNewsItems,
  newsSources as mockNewsSources,
  sentimentPulse as mockSentimentPulse
} from "@/lib/data/mock-data";
import { getCachedExplainer, getDemoInteractions, recordDemoInteraction, setCachedExplainer } from "@/lib/server/demo-store";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  Career,
  EconomicMetric,
  ExplainerCache,
  Insight,
  JobTrend,
  MigrationCorridor,
  MigrationSnapshot,
  NewsItem,
  NewsSource,
  SentimentPulse,
  UserInteractionRecord,
  UserProfile
} from "@/lib/types/domain";

function mapInsightRow(row: Record<string, unknown>): Insight {
  return {
    id: String(row.id),
    category: row.category as Insight["category"],
    title: String(row.title),
    shortSummary: String(row.short_summary),
    fullSummary: String(row.full_summary),
    vectorSummary: String(row.vector_summary ?? row.short_summary ?? ""),
    whyItMatters: String(row.why_it_matters ?? ""),
    readMore: String(row.read_more ?? ""),
    sourceUrl: String(row.source_url),
    sourceName: String(row.source_name ?? "Verified source"),
    sourceTrace: Array.isArray(row.source_trace) ? row.source_trace.map(String) : [],
    sourceHash: String(row.source_hash ?? row.id),
    region: String(row.region ?? "Kerala"),
    confidenceScore: Number(row.confidence_score ?? 0),
    trendingScore: Number(row.trending_score ?? 0),
    createdAt: String(row.created_at),
    metricSnapshot: {
      label: String((row.metric_snapshot as Record<string, unknown> | null)?.label ?? "Signal"),
      value: String((row.metric_snapshot as Record<string, unknown> | null)?.value ?? "-"),
      delta: String((row.metric_snapshot as Record<string, unknown> | null)?.delta ?? "-")
    }
  };
}

function mapCareerRow(row: Record<string, unknown>): Career {
  const avgSalaryKerala = Number(row.avg_salary_kerala ?? row.salary_max_kerala ?? 0);
  const avgSalaryAbroad = Number(row.avg_salary_abroad ?? row.salary_max_abroad ?? 0);

  return {
    id: String(row.id),
    title: String(row.title),
    industry: String(row.industry),
    companyType: String(row.company_type ?? "Kerala employer"),
    locationHub: String(row.location_hub ?? "Kerala"),
    openingsCount: Number(row.openings_count ?? 0),
    avgSalaryKerala,
    avgSalaryAbroad,
    salaryMinKerala: Number(row.salary_min_kerala ?? avgSalaryKerala),
    salaryMaxKerala: Number(row.salary_max_kerala ?? avgSalaryKerala),
    salaryMinAbroad: Number(row.salary_min_abroad ?? avgSalaryAbroad),
    salaryMaxAbroad: Number(row.salary_max_abroad ?? avgSalaryAbroad),
    demandGrowthPct: Number(row.demand_growth_pct),
    automationRiskScore: Number(row.automation_risk_score),
    futureProofScore: Number(row.future_proof_score),
    skillTags: Array.isArray(row.skill_tags) ? row.skill_tags.map(String) : []
  };
}

function mapMetricRow(row: Record<string, unknown>): EconomicMetric {
  return {
    id: String(row.id),
    slug: String(row.slug),
    category: row.category as EconomicMetric["category"],
    label: String(row.label),
    value: Number(row.value),
    displayValue: String(row.display_value),
    unit: String(row.unit),
    changePercentage: Number(row.change_percentage ?? 0),
    targetValue: row.target_value ? Number(row.target_value) : undefined,
    targetDisplayValue: row.target_display_value ? String(row.target_display_value) : undefined,
    lastUpdated: String(row.last_updated)
  };
}

function mapJobTrendRow(row: Record<string, unknown>): JobTrend {
  return {
    id: String(row.id),
    sector: String(row.sector),
    demandLevel: row.demand_level as JobTrend["demandLevel"],
    avgSalary: Number(row.avg_salary ?? 0),
    locationHub: String(row.location_hub ?? "Kerala"),
    openingsCount: Number(row.openings_count ?? 0),
    demandGrowthPct: Number(row.demand_growth_pct ?? 0),
    companyType: String(row.company_type ?? ""),
    sourceName: String(row.source_name ?? ""),
    lastUpdated: String(row.last_updated),
    focusSkills: Array.isArray(row.focus_skills) ? row.focus_skills.map(String) : []
  };
}

function mapMigrationRow(row: Record<string, unknown>): MigrationSnapshot {
  return {
    id: String(row.id),
    month: String(row.month),
    gulfOutflow: Number(row.gulf_outflow),
    euOutflow: Number(row.eu_outflow),
    indiaInflow: Number(row.india_inflow),
    remittanceIndex: Number(row.remittance_index),
    brainDrainScore: Number(row.brain_drain_score),
    gulfDeclinePct: Number(row.gulf_decline_pct ?? 0),
    euGrowthPct: Number(row.eu_growth_pct ?? 0)
  };
}

function mapCorridorRow(row: Record<string, unknown>): MigrationCorridor {
  return {
    id: String(row.id),
    country: String(row.country),
    region: String(row.region),
    corridorLabel: String(row.corridor_label),
    count: Number(row.count),
    flowDirection: row.flow_direction as MigrationCorridor["flowDirection"],
    changePct: Number(row.change_pct ?? 0),
    opportunityScore: Number(row.opportunity_score ?? 0),
    sourceName: String(row.source_name ?? "")
  };
}

function mapSentimentRow(row: Record<string, unknown>): SentimentPulse {
  return {
    id: String(row.id),
    region: String(row.region),
    youthMoodScore: Number(row.youth_mood_score),
    unemploymentStress: Number(row.unemployment_stress),
    topIssue: String(row.top_issue),
    politicalSentiment: Number(row.political_sentiment)
  };
}

function mapNewsSourceRow(row: Record<string, unknown>): NewsSource {
  return {
    id: String(row.id),
    name: String(row.name),
    rssUrl: String(row.rss_url),
    language: String(row.language),
    region: String(row.region),
    isActive: Boolean(row.is_active)
  };
}

function mapNewsItemRow(row: Record<string, unknown>): NewsItem {
  return {
    id: String(row.id),
    sourceId: String(row.source_id),
    headline: String(row.headline),
    summary: String(row.summary),
    region: String(row.region),
    topic: String(row.topic),
    sentimentScore: Number(row.sentiment_score ?? 0),
    publishedAt: String(row.published_at),
    sourceHash: String(row.source_hash),
    url: String(row.url)
  };
}

function mergeUserInteractions(user: UserProfile) {
  const demoInteractions = getDemoInteractions(user.id);

  return {
    ...user,
    interactionHistory: [...user.interactionHistory, ...demoInteractions]
  };
}

export async function getInsights() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockInsights;
  }

  const { data, error } = await supabase.from("insights").select("*").eq("is_published", true).limit(40);

  if (error || !data || data.length === 0) {
    return mockInsights;
  }

  return data.map((row) => mapInsightRow(row as Record<string, unknown>));
}

export async function getCareers() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockCareers;
  }

  const { data, error } = await supabase.from("careers").select("*").eq("is_active", true).limit(40);

  if (error || !data || data.length === 0) {
    return mockCareers;
  }

  return data.map((row) => mapCareerRow(row as Record<string, unknown>));
}

export async function getEconomicMetrics() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockEconomicMetrics;
  }

  const { data, error } = await supabase.from("economic_metrics").select("*").order("last_updated", { ascending: false });

  if (error || !data || data.length === 0) {
    return mockEconomicMetrics;
  }

  return data.map((row) => mapMetricRow(row as Record<string, unknown>));
}

export async function getJobTrends() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockJobTrends;
  }

  const { data, error } = await supabase.from("job_trends").select("*").order("demand_growth_pct", { ascending: false });

  if (error || !data || data.length === 0) {
    return mockJobTrends;
  }

  return data.map((row) => mapJobTrendRow(row as Record<string, unknown>));
}

export async function getMigrationHistory() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockMigrationTracker;
  }

  const { data, error } = await supabase.from("migration_tracker").select("*").order("month", { ascending: true });

  if (error || !data || data.length === 0) {
    return mockMigrationTracker;
  }

  return data.map((row) => mapMigrationRow(row as Record<string, unknown>));
}

export async function getMigrationCorridors() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockMigrationCorridors;
  }

  const { data, error } = await supabase
    .from("migration_corridors")
    .select("*")
    .order("count", { ascending: false });

  if (error || !data || data.length === 0) {
    return mockMigrationCorridors;
  }

  return data.map((row) => mapCorridorRow(row as Record<string, unknown>));
}

export async function getSentimentPulse() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockSentimentPulse;
  }

  const { data, error } = await supabase.from("sentiment_pulse").select("*").order("region");

  if (error || !data || data.length === 0) {
    return mockSentimentPulse;
  }

  return data.map((row) => mapSentimentRow(row as Record<string, unknown>));
}

export async function getNewsSources() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockNewsSources;
  }

  const { data, error } = await supabase.from("news_sources").select("*").eq("is_active", true).order("name");

  if (error || !data || data.length === 0) {
    return mockNewsSources;
  }

  return data.map((row) => mapNewsSourceRow(row as Record<string, unknown>));
}

export async function getNewsItems() {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return mockNewsItems;
  }

  const { data, error } = await supabase.from("news_items").select("*").order("published_at", { ascending: false }).limit(20);

  if (error || !data || data.length === 0) {
    return mockNewsItems;
  }

  return data.map((row) => mapNewsItemRow(row as Record<string, unknown>));
}

export async function recordExpressInterest(userId: string, careerId: string, note?: string) {
  const interaction: UserInteractionRecord = {
    targetId: careerId,
    kind: "interested",
    createdAt: new Date().toISOString()
  };
  const admin = createSupabaseAdminClient();

  if (admin) {
    await admin.from("user_interactions").insert({
      user_id: userId,
      career_id: careerId,
      kind: "interested",
      metadata: note ? { note } : {}
    });
  }

  return recordDemoInteraction(userId, interaction);
}

export async function getExplainerCache(sourceHash: string) {
  return getCachedExplainer(sourceHash);
}

export async function saveExplainerCache(entry: ExplainerCache) {
  return setCachedExplainer(entry);
}

export async function getHomeSnapshot(user: UserProfile = defaultUser) {
  const [insightRows, careerRows, metricRows, jobTrendRows, migrationRows, corridorRows, sentimentRows, newsRows] =
    await Promise.all([
      getInsights(),
      getCareers(),
      getEconomicMetrics(),
      getJobTrends(),
      getMigrationHistory(),
      getMigrationCorridors(),
      getSentimentPulse(),
      getNewsItems()
    ]);

  return {
    insights: insightRows,
    careers: careerRows,
    economicMetrics: metricRows,
    jobTrends: jobTrendRows,
    migration: migrationRows,
    migrationCorridors: corridorRows,
    sentiment: sentimentRows,
    newsItems: newsRows,
    user: mergeUserInteractions(user)
  };
}
