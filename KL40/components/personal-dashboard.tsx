import type { CareerMatch, MigrationAdvice, UserProfile } from "@/lib/types/domain";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PersonalDashboard({
  user,
  matches,
  advice
}: {
  user: UserProfile;
  matches: CareerMatch[];
  advice: MigrationAdvice;
}) {
  const salaryData = matches.slice(0, 4).map((item) => ({
    title: item.career.title.split(" ")[0],
    Kerala: Math.round(item.career.avgSalaryKerala / 100000),
    Abroad: Math.round(item.career.avgSalaryAbroad / 100000)
  }));

  return (
    <section className="section-shell">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Personal Life Dashboard</p>
          <h2 className="section-title">What the system thinks you should do next.</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60">
          confidence {advice.confidence}%
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-4">
          <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
            <p className="eyebrow mb-2">Profile edge</p>
            <h3 className="text-[1.4rem] font-semibold text-white">{user.name}, your best move is {advice.recommendation}.</h3>
            <p className="mt-3 text-sm leading-6 text-white/72">{advice.summary}</p>
          </div>
          <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-5">
            <p className="eyebrow mb-3">Skill heatmap</p>
            <div className="flex flex-wrap gap-2">
              {matches[0].career.skillTags.map((skill) => {
                const owned = user.skillProfile.map((item) => item.toLowerCase()).includes(skill.toLowerCase());
                return (
                  <span
                    key={skill}
                    className={`rounded-full px-3 py-1 text-xs ${
                      owned ? "bg-emerald-300/12 text-emerald-100" : "bg-white/7 text-white/68"
                    }`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="rounded-[1.8rem] border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-white/45">
            <span>Salary leverage</span>
            <span>in lakhs INR</span>
          </div>
          <div className="h-[18rem]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} margin={{ top: 16, right: 0, left: -24, bottom: 0 }}>
                <XAxis dataKey="title" tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.45)" />
                <YAxis tickLine={false} axisLine={false} stroke="rgba(255,255,255,0.25)" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(6, 10, 20, 0.94)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px"
                  }}
                />
                <Bar dataKey="Kerala" radius={[12, 12, 0, 0]} fill="rgba(255,255,255,0.22)" />
                <Bar dataKey="Abroad" radius={[12, 12, 0, 0]} fill="var(--signal-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {advice.reasoning.map((reason) => (
              <div key={reason} className="rounded-[1.35rem] border border-white/10 px-3 py-3 text-sm text-white/72">
                {reason}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
