import type { MigrationAdvice, MigrationSnapshot } from "@/lib/types/domain";

export function MigrationRadar({
  migrationHistory,
  advice
}: {
  migrationHistory: MigrationSnapshot[];
  advice: MigrationAdvice;
}) {
  const latest = migrationHistory[migrationHistory.length - 1];
  const previous = migrationHistory[migrationHistory.length - 2];

  return (
    <section className="section-shell overflow-hidden">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Migration Radar</p>
          <h2 className="section-title">Kerala is no longer moving in one direction.</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
          {advice.recommendation.toUpperCase()} MODE
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/20 p-4">
        <svg viewBox="0 0 640 360" className="w-full">
          <defs>
            <linearGradient id="flowA" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7ce6a2" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="flowB" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f4c25f" />
              <stop offset="100%" stopColor="#ff6f6f" />
            </linearGradient>
          </defs>
          <circle cx="110" cy="190" r="12" fill="#ffffff" />
          <text x="86" y="224" fill="rgba(255,255,255,0.72)" fontSize="15">
            Kerala
          </text>
          <circle cx="290" cy="110" r="10" fill="#7dd3fc" />
          <text x="262" y="84" fill="rgba(255,255,255,0.72)" fontSize="14">
            Gulf
          </text>
          <circle cx="480" cy="90" r="10" fill="#7ce6a2" />
          <text x="455" y="64" fill="rgba(255,255,255,0.72)" fontSize="14">
            EU
          </text>
          <circle cx="550" cy="220" r="10" fill="#f4c25f" />
          <text x="510" y="255" fill="rgba(255,255,255,0.72)" fontSize="14">
            Canada
          </text>
          <path
            d="M122 182C182 120 212 112 280 112"
            fill="none"
            stroke="url(#flowB)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="10 8"
          />
          <path
            d="M122 196C214 180 340 118 468 94"
            fill="none"
            stroke="url(#flowA)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M120 202C242 242 390 258 538 226"
            fill="none"
            stroke="url(#flowA)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="9 10"
          />
        </svg>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.45rem] border border-white/10 bg-black/20 p-4">
          <p className="eyebrow mb-2">Gulf shift</p>
          <p className="text-2xl font-semibold text-white">{latest.gulfDeclinePct.toFixed(1)}%</p>
          <p className="mt-2 text-sm text-white/62">was {previous.gulfDeclinePct.toFixed(1)}% last month</p>
        </div>
        <div className="rounded-[1.45rem] border border-white/10 bg-black/20 p-4">
          <p className="eyebrow mb-2">EU growth</p>
          <p className="text-2xl font-semibold text-white">+{latest.euGrowthPct.toFixed(1)}%</p>
          <p className="mt-2 text-sm text-white/62">qualification-led growth</p>
        </div>
        <div className="rounded-[1.45rem] border border-white/10 bg-black/20 p-4">
          <p className="eyebrow mb-2">Brain drain</p>
          <p className="text-2xl font-semibold text-white">{latest.brainDrainScore}</p>
          <p className="mt-2 text-sm text-white/62">skill-selective outflow</p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/20 p-4">
        <p className="eyebrow mb-2">Recommended arc</p>
        <p className="text-sm leading-6 text-white/76">{advice.summary}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {advice.bestDestinations.map((destination) => (
            <span key={destination} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
              {destination}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
