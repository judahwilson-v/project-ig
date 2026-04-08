import type { ExplainerResponse, Insight } from "@/lib/types/domain";

export function ExplainerPanel({
  insight,
  explanation
}: {
  insight: Insight;
  explanation: ExplainerResponse;
}) {
  return (
    <section className="section-shell relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.2),transparent_45%)]" />
      <div className="relative">
        <p className="eyebrow">AI Explainer Mode</p>
        <h2 className="section-title">{explanation.headline}</h2>
        <p className="mt-3 text-sm leading-6 text-white/72">{insight.fullSummary}</p>

        <div className="mt-6 space-y-3">
          {explanation.lines.map((line) => (
            <div key={line} className="rounded-[1.35rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/78">
              {line}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-cyan-300/15 bg-cyan-300/8 p-4 text-sm text-cyan-50">
          <p className="eyebrow mb-2 text-cyan-100/70">Visual Direction</p>
          <p>{explanation.visualHint}</p>
        </div>
      </div>
    </section>
  );
}
