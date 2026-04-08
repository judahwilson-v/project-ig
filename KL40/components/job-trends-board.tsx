import type { JobTrend } from "@/lib/types/domain";

export function JobTrendsBoard({ trends }: { trends: JobTrend[] }) {
  return (
    <section className="section-shell">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Job Pulse</p>
          <h2 className="section-title">High-velocity demand lanes right now.</h2>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {trends.map((trend) => (
          <div key={trend.id} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <p className="text-sm font-semibold text-white">{trend.sector}</p>
            <p className="mt-2 text-2xl font-semibold text-white">₹{Math.round(trend.avgSalary / 100000)}L</p>
            <p className="mt-1 text-sm text-white/60">{trend.locationHub}</p>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/45">{trend.demandLevel}</p>
            <p className="mt-1 text-sm text-emerald-200">+{trend.demandGrowthPct}% demand</p>
          </div>
        ))}
      </div>
    </section>
  );
}
