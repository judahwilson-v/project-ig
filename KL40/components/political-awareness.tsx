import type { SentimentPulse } from "@/lib/types/domain";

export function PoliticalAwareness({
  sentiment,
  electionCountdown
}: {
  sentiment: SentimentPulse[];
  electionCountdown: number;
}) {
  return (
    <section className="section-shell">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Political Awareness Engine</p>
          <h2 className="section-title">Policy only matters if it changes your options.</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
          {electionCountdown} days to next state watch window
        </div>
      </div>

      <div className="space-y-3">
        {sentiment.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-[1.7rem] border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-sm font-medium text-white">{item.region}</p>
              <p className="mt-1 text-sm text-white/62">
                Top issue: {item.topIssue}. Political sentiment at {item.politicalSentiment}/100.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:w-[16rem]">
              <div>
                <p className="eyebrow mb-2">Mood</p>
                <div className="meter-bar">
                  <span style={{ width: `${item.youthMoodScore}%` }} />
                </div>
              </div>
              <div>
                <p className="eyebrow mb-2">Stress</p>
                <div className="meter-bar">
                  <span style={{ width: `${item.unemploymentStress}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-[1.7rem] border border-fuchsia-300/15 bg-fuchsia-300/8 p-4 text-sm leading-6 text-fuchsia-50">
        What changed in your life because of policy?
        Public hiring timelines slowed, private-skill premiums widened, and migration readiness became a bigger determinant of income stability than party identity.
      </div>
    </section>
  );
}
