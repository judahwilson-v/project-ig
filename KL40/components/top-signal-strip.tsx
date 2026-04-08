import type { EconomicMetric, JobTrend, MigrationLiveCounter, PoliticalTemperature } from "@/lib/types/domain";

export function TopSignalStrip({
  metrics,
  migrationLive,
  topTrend,
  politics
}: {
  metrics: EconomicMetric[];
  migrationLive: MigrationLiveCounter;
  topTrend: JobTrend;
  politics: PoliticalTemperature;
}) {
  const featuredMetrics = metrics.slice(0, 3);

  return (
    <div className="grid gap-3 lg:grid-cols-5">
      {featuredMetrics.map((metric) => (
        <div key={metric.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
          <p className="eyebrow mb-2">{metric.label}</p>
          <p className="text-2xl font-semibold text-white">{metric.displayValue}</p>
          <p className="mt-2 text-sm text-white/60">{metric.changePercentage >= 0 ? "+" : ""}{metric.changePercentage}%</p>
        </div>
      ))}
      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
        <p className="eyebrow mb-2">Migration Live</p>
        <p className="text-2xl font-semibold text-white">{migrationLive.returneesThisMonth.toLocaleString()}</p>
        <p className="mt-2 text-sm text-white/60">{migrationLive.trendLabel}</p>
      </div>
      <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
        <p className="eyebrow mb-2">Top Demand / Politics</p>
        <p className="text-base font-semibold text-white">{topTrend.sector}</p>
        <p className="mt-1 text-sm text-white/60">{topTrend.openingsCount.toLocaleString()} openings</p>
        <p className="mt-3 text-sm text-white/70">Political temp {politics.score}/100</p>
      </div>
    </div>
  );
}
