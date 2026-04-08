import type { CrisisInput, EconomicMetric, MigrationSnapshot, SentimentPulse } from "@/lib/types/domain";

function metricValue(metrics: EconomicMetric[], slug: string, fallback: number) {
  return metrics.find((metric) => metric.slug === slug)?.value ?? fallback;
}

export function deriveCrisisInput(
  economicMetrics: EconomicMetric[],
  migrationHistory: MigrationSnapshot[],
  sentiment: SentimentPulse[]
): CrisisInput {
  const latestMigration = migrationHistory[migrationHistory.length - 1];
  const averageStress =
    sentiment.reduce((total, item) => total + item.unemploymentStress, 0) / Math.max(sentiment.length, 1);

  return {
    gdpGapPct: Math.max(0, metricValue(economicMetrics, "gsdp-target", 16.29) * 0.38),
    remittanceDropPct: metricValue(economicMetrics, "remittance-drop", Math.abs(latestMigration.gulfDeclinePct)),
    youthUnemploymentPct: metricValue(economicMetrics, "youth-unemployment", Math.max(18, averageStress * 0.39)),
    debtRatioPct: metricValue(economicMetrics, "debt-ratio", 38.6)
  };
}

export function getElectionCountdown(targetDate = "2026-04-09") {
  const now = new Date();
  const target = new Date(targetDate);
  const difference = target.getTime() - now.getTime();

  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
}
