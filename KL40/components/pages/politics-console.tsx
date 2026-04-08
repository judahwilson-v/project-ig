import { PoliticalAwareness } from "@/components/political-awareness";
import type { PoliticalTemperature } from "@/lib/types/domain";

export function PoliticsConsole({ temperature }: { temperature: PoliticalTemperature }) {
  return (
    <main className="relative mx-auto max-w-[92rem] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="section-shell">
        <p className="eyebrow">Sentiment Heatmap</p>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
          April 2026 political temperature, issue swing, and regional heat.
        </h1>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="section-shell">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Temperature</p>
              <p className="text-4xl font-semibold text-white">{temperature.score}/100</p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Swing</p>
              <p className="text-4xl font-semibold text-white">{temperature.swingDirection}</p>
            </div>
          </div>
          <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/72">
            {temperature.leadingNarrative}
          </div>
          <div className="mt-4 space-y-3">
            {temperature.headlines.map((headline) => (
              <div key={headline.id} className="rounded-[1.3rem] border border-white/10 px-4 py-3 text-sm text-white/72">
                <p className="font-medium text-white">{headline.headline}</p>
                <p className="mt-1">{headline.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <PoliticalAwareness sentiment={temperature.heatmap} electionCountdown={temperature.electionCountdown} />
      </div>
    </main>
  );
}
