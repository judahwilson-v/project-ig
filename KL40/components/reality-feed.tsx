import type { Insight } from "@/lib/types/domain";
import { cn } from "@/lib/utils";

const categoryStyle = {
  economy: "bg-cyan-400/12 text-cyan-100",
  politics: "bg-fuchsia-400/12 text-fuchsia-100",
  jobs: "bg-emerald-400/12 text-emerald-100",
  migration: "bg-amber-300/12 text-amber-100"
} as const;

export function RealityFeed({
  feed,
  selectedInsightId,
  onExplain
}: {
  feed: Insight[];
  selectedInsightId: string;
  onExplain: (insight: Insight) => void;
}) {
  return (
    <section className="section-shell overflow-hidden">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Reality Feed</p>
          <h2 className="section-title">Swipe the signals that will actually change your next move.</h2>
        </div>
        <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 md:block">
          Live traceability on every card
        </div>
      </div>

      <div className="feed-column h-[34rem] snap-y snap-mandatory overflow-y-auto pr-1 md:h-[42rem]">
        {feed.map((item, index) => (
          <article
            key={item.id}
            className={cn(
              "feed-card snap-start rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition duration-300",
              selectedInsightId === item.id
                ? "border-white/25 bg-white/[0.09] shadow-pulse"
                : "hover:border-white/20 hover:bg-white/[0.07]"
            )}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.24em]",
                  categoryStyle[item.category]
                )}
              >
                {item.category}
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.24em] text-white/45">
                confidence {Math.round(item.confidenceScore * 100)}%
              </span>
            </div>

            <h3 className="max-w-xl text-[1.45rem] font-semibold leading-tight text-white">{item.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">{item.shortSummary}</p>

            <div className="mt-6 grid gap-3 text-sm text-white/70 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="eyebrow mb-2">Signal</p>
                <p className="text-lg font-semibold text-white">{item.metricSnapshot.value}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">{item.metricSnapshot.label}</p>
                <p className="mt-3 text-sm text-emerald-200">{item.metricSnapshot.delta}</p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="eyebrow mb-2">Why It Matters To You</p>
                <p className="text-sm leading-6 text-white/76">{item.whyItMatters}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-white/55">
              <span>{item.sourceName}</span>
              <span className="h-1 w-1 rounded-full bg-white/20" />
              <span>Trace: {item.sourceTrace.join(" / ")}</span>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onExplain(item)}
                className="rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
              >
                Explain this stat
              </button>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
                <span>trend</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">
                  {item.trendingScore}/100
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
