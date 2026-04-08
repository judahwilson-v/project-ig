"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { JobSwipeDeck } from "@/components/job-swipe-deck";
import type { CareerMatch, JobTrend, SkillGapReport, UserProfile } from "@/lib/types/domain";

function sectorMatches(sector: string, match: CareerMatch) {
  const haystack = `${match.career.industry} ${match.career.title}`.toLowerCase();
  return sector === "All" ? true : haystack.includes(sector.toLowerCase());
}

export function JobsConsole({
  user,
  initialMatches,
  jobTrends,
  initialSkillGap
}: {
  user: UserProfile;
  initialMatches: CareerMatch[];
  jobTrends: JobTrend[];
  initialSkillGap: SkillGapReport;
}) {
  const sectors = ["All", ...jobTrends.map((trend) => trend.sector)];
  const [activeSector, setActiveSector] = useState("All");
  const [matches, setMatches] = useState(initialMatches);
  const [skillGap, setSkillGap] = useState(initialSkillGap);
  const [skillsText, setSkillsText] = useState(user.skillProfile.join(", "));
  const [status, setStatus] = useState<string | null>(null);
  const deferredSector = useDeferredValue(activeSector);

  const filteredMatches = matches.filter((match) => sectorMatches(deferredSector, match));
  const filteredTrends =
    deferredSector === "All"
      ? jobTrends
      : jobTrends.filter((trend) => trend.sector.toLowerCase().includes(deferredSector.toLowerCase()));

  async function handleExpressInterest(match: CareerMatch) {
    setStatus(`Saving interest in ${match.career.title}...`);

    const response = await fetch("/api/jobs/express-interest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user.id,
        careerId: match.career.id
      })
    });

    const payload = await response.json();

    if (payload.matches) {
      startTransition(() => {
        setMatches(payload.matches as CareerMatch[]);
      });
      setStatus(`Expressed interest in ${match.career.title}. Ranking updated.`);
      return;
    }

    setStatus("Could not save interest.");
  }

  async function handleAnalyze(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedSkills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);
    setStatus("Rebuilding your bridge plan...");

    const response = await fetch("/api/skills/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: {
          ...user,
          skillProfile: parsedSkills
        },
        targetSector: activeSector === "All" ? undefined : activeSector
      })
    });

    const payload = await response.json();

    if (payload.report) {
      setSkillGap(payload.report as SkillGapReport);
      setStatus("Bridge plan updated.");
      return;
    }

    setStatus("Could not analyze skills.");
  }

  return (
    <main className="relative mx-auto max-w-[92rem] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="section-shell">
        <p className="eyebrow">Swipe-to-Apply Job Engine</p>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
          Kerala’s high-demand lanes, ranked for your next move.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-white/72">
          Filter by sector, swipe through matched roles, express interest in one tap, and rebuild your bridge plan from user-inputted skills.
        </p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {sectors.map((sector) => (
          <button
            key={sector}
            type="button"
            onClick={() => setActiveSector(sector)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              activeSector === sector ? "bg-white text-slate-950" : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      {status ? (
        <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75">
          {status}
        </div>
      ) : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <JobSwipeDeck matches={filteredMatches.length > 0 ? filteredMatches : matches} onInterest={handleExpressInterest} />

        <section className="section-shell">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Skill-Gap Analyzer</p>
              <h2 className="section-title">Tell the engine your skills. It will give you the next 3 to learn.</h2>
            </div>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <label className="block text-sm text-white/70">
              Current skills
              <textarea
                value={skillsText}
                onChange={(event) => setSkillsText(event.target.value)}
                rows={4}
                className="mt-2 w-full rounded-[1.3rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </label>
            <button type="submit" className="rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950">
              Rebuild Bridge Plan
            </button>
          </form>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-black/20 p-4">
            <p className="eyebrow mb-2">Top career</p>
            <p className="text-xl font-semibold text-white">{skillGap.topCareer.career.title}</p>
            <p className="mt-2 text-sm text-white/70">{skillGap.narrative}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skillGap.bridgeSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-white/10 px-3 py-3 text-sm text-white/70">
                Salary delta estimate: ₹{Math.round(skillGap.salaryDeltaEstimate / 100000)}L
              </div>
              <div className="rounded-[1.2rem] border border-white/10 px-3 py-3 text-sm text-white/70">
                Readiness score: {skillGap.readinessScore}/100
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="section-shell mt-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Demand Tracker</p>
            <h2 className="section-title">High-demand 2026 sectors with actual openings and salary pressure.</h2>
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {filteredTrends.map((trend) => (
            <div key={trend.id} className="rounded-[1.4rem] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold text-white">{trend.sector}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/65">
                  {trend.demandLevel}
                </span>
              </div>
              <p className="mt-2 text-sm text-white/65">{trend.locationHub} / {trend.companyType}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1rem] border border-white/10 px-3 py-3 text-sm text-white/70">
                  Openings: {trend.openingsCount.toLocaleString()}
                </div>
                <div className="rounded-[1rem] border border-white/10 px-3 py-3 text-sm text-white/70">
                  Avg salary: ₹{Math.round(trend.avgSalary / 100000)}L
                </div>
                <div className="rounded-[1rem] border border-white/10 px-3 py-3 text-sm text-emerald-200">
                  +{trend.demandGrowthPct}% growth
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
