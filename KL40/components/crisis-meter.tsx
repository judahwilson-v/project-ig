import type { CrisisAssessment, MigrationSnapshot } from "@/lib/types/domain";
import {
  Area,
  AreaChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis
} from "recharts";

export function CrisisMeter({
  crisis,
  migrationHistory
}: {
  crisis: CrisisAssessment;
  migrationHistory: MigrationSnapshot[];
}) {
  const radialData = [{ name: "Crisis Score", value: crisis.score, fill: "var(--signal-accent)" }];
  const trend = migrationHistory.map((item) => ({
    month: item.month.slice(5, 7),
    remittance: item.remittanceIndex,
    brainDrain: item.brainDrainScore
  }));

  return (
    <section className="section-shell">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Crisis Intelligence</p>
          <h2 className="section-title">Risk is visible before it turns into panic.</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/65">
          {crisis.displayLabel}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="68%"
                outerRadius="100%"
                data={radialData}
                startAngle={210}
                endAngle={-30}
                barSize={16}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background dataKey="value" cornerRadius={999} />
                <text x="50%" y="46%" textAnchor="middle" className="fill-white text-[14px] uppercase tracking-[0.3em]">
                  Crisis
                </text>
                <text x="50%" y="60%" textAnchor="middle" className="fill-white text-[42px] font-semibold">
                  {crisis.score}
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm leading-6 text-white/70">{crisis.predictiveWarning}</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-4">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/45">
              <span>Pressure trend</span>
              <span>remittance vs brain drain</span>
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 4, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="brainDrainGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--signal-accent)" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="var(--signal-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.45)" />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(6, 10, 20, 0.94)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="brainDrain"
                    stroke="var(--signal-accent)"
                    strokeWidth={2}
                    fill="url(#brainDrainGradient)"
                  />
                  <Area type="monotone" dataKey="remittance" stroke="#93c5fd" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {crisis.drivers.map((driver) => (
              <div key={driver.label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                <p className="eyebrow mb-2">{driver.label}</p>
                <div className="flex items-end justify-between gap-3">
                  <span className="text-2xl font-semibold text-white">{driver.score}</span>
                  <span className="text-sm text-white/60">{driver.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
