import { MigrationRadar } from "@/components/migration-radar";
import type { MigrationAdvice, MigrationCorridor, MigrationLiveCounter, MigrationSnapshot } from "@/lib/types/domain";

export function MigrationConsole({
  history,
  liveCounter,
  corridors,
  advice
}: {
  history: MigrationSnapshot[];
  liveCounter: MigrationLiveCounter;
  corridors: MigrationCorridor[];
  advice: MigrationAdvice;
}) {
  return (
    <main className="relative mx-auto max-w-[92rem] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="section-shell">
        <p className="eyebrow">Migration Flow Live Counter</p>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
          Watch Kerala’s abroad count, returnees, and corridor shifts in one surface.
        </h1>
      </section>

      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <div className="section-shell">
          <p className="eyebrow mb-2">Current abroad</p>
          <p className="text-3xl font-semibold text-white">{liveCounter.currentAbroad.toLocaleString()}</p>
        </div>
        <div className="section-shell">
          <p className="eyebrow mb-2">Returnees this month</p>
          <p className="text-3xl font-semibold text-white">{liveCounter.returneesThisMonth.toLocaleString()}</p>
        </div>
        <div className="section-shell">
          <p className="eyebrow mb-2">Net monthly flow</p>
          <p className="text-3xl font-semibold text-white">{liveCounter.netMonthlyFlow.toLocaleString()}</p>
        </div>
        <div className="section-shell">
          <p className="eyebrow mb-2">Impact index</p>
          <p className="text-3xl font-semibold text-white">{liveCounter.remittanceImpactIndex}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <MigrationRadar migrationHistory={history} advice={advice} />
        <section className="section-shell">
          <p className="eyebrow">Corridor Breakdown</p>
          <h2 className="section-title mt-2">Where Malayali movement is accelerating and where it is cooling.</h2>
          <div className="mt-5 space-y-3">
            {corridors.map((corridor) => (
              <div key={corridor.id} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{corridor.corridorLabel}</p>
                  <span className="text-xs uppercase tracking-[0.24em] text-white/45">{corridor.flowDirection}</span>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1rem] border border-white/10 px-3 py-3 text-sm text-white/70">
                    Count: {corridor.count.toLocaleString()}
                  </div>
                  <div className="rounded-[1rem] border border-white/10 px-3 py-3 text-sm text-white/70">
                    Change: {corridor.changePct >= 0 ? "+" : ""}{corridor.changePct}%
                  </div>
                  <div className="rounded-[1rem] border border-white/10 px-3 py-3 text-sm text-white/70">
                    Opportunity: {corridor.opportunityScore}/100
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
