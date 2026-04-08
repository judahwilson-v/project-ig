"use client";

import { startTransition, useState } from "react";
import type { CareerMatch } from "@/lib/types/domain";

export function JobSwipeDeck({
  matches,
  onInterest
}: {
  matches: CareerMatch[];
  onInterest?: (match: CareerMatch) => void;
}) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [pointerId, setPointerId] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [lastAction, setLastAction] = useState<"Interested" | "Ignored" | null>(null);

  if (matches.length === 0) {
    return (
      <section className="section-shell">
        <p className="eyebrow">Job Intelligence</p>
        <h2 className="section-title mt-2">No roles match this filter yet.</h2>
      </section>
    );
  }

  const active = matches[index % matches.length];
  const upcoming = matches[(index + 1) % matches.length];

  function finishSwipe(action: "Interested" | "Ignored") {
    const selected = matches[index % matches.length];
    setLastAction(action);
    startTransition(() => {
      setIndex((value) => (value + 1) % matches.length);
    });
    if (action === "Interested" && selected) {
      onInterest?.(selected);
    }
    setDragX(0);
    setPointerId(null);
  }

  return (
    <section className="section-shell">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Job Intelligence</p>
          <h2 className="section-title">Swipe careers like decisions, not listings.</h2>
        </div>
        <div className="text-right text-xs uppercase tracking-[0.24em] text-white/50">
          <p>Future-proof score</p>
          <p className="mt-1 text-lg font-semibold text-white">{active.futureScore}</p>
        </div>
      </div>

      <div className="relative h-[31rem] overflow-hidden rounded-[2rem]">
        <div className="absolute inset-x-8 top-7 h-full rounded-[2rem] border border-white/10 bg-white/[0.03] opacity-40" />
        <div className="absolute inset-x-4 top-4 h-full rounded-[2rem] border border-white/10 bg-white/[0.04] opacity-60" />

        <article
          className="absolute inset-0 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(6,9,18,0.92))] p-6 shadow-pulse backdrop-blur-2xl transition-transform duration-200"
          style={{
            transform: `translateX(${dragX}px) rotate(${dragX * 0.035}deg)`,
            touchAction: "pan-y"
          }}
          onPointerDown={(event) => {
            setPointerId(event.pointerId);
            setStartX(event.clientX);
          }}
          onPointerMove={(event) => {
            if (pointerId !== event.pointerId) return;
            setDragX(event.clientX - startX);
          }}
          onPointerUp={(event) => {
            if (pointerId !== event.pointerId) return;
            if (dragX > 90) {
              finishSwipe("Interested");
              return;
            }
            if (dragX < -90) {
              finishSwipe("Ignored");
              return;
            }
            setDragX(0);
            setPointerId(null);
          }}
          onPointerCancel={() => {
            setDragX(0);
            setPointerId(null);
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-full border border-emerald-300/15 bg-emerald-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-emerald-100">
              {active.career.industry}
            </span>
            <span className="text-xs uppercase tracking-[0.24em] text-white/45">
              {lastAction ? `last: ${lastAction}` : "drag or tap"}
            </span>
          </div>

          <div className="mt-8">
            <h3 className="max-w-sm text-[2rem] font-semibold leading-tight text-white">{active.career.title}</h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">{active.narrative}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/45">
              {active.career.companyType} / {active.career.locationHub} / {active.career.openingsCount.toLocaleString()} openings
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Fit</p>
              <p className="text-2xl font-semibold text-white">{active.fitScore}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Kerala Salary</p>
              <p className="text-2xl font-semibold text-white">
                ₹{Math.round(active.career.avgSalaryKerala / 100000)}L
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Abroad Salary</p>
              <p className="text-2xl font-semibold text-white">
                ₹{Math.round(active.career.avgSalaryAbroad / 100000)}L
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-3">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Skill match</span>
              <span>{active.skillMatchScore}%</span>
            </div>
            <div className="meter-bar">
              <span style={{ width: `${active.skillMatchScore}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Migration leverage</span>
              <span>{active.preferredCountryBoost}%</span>
            </div>
            <div className="meter-bar">
              <span style={{ width: `${active.preferredCountryBoost}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Demand momentum</span>
              <span>{active.demandMomentum}%</span>
            </div>
            <div className="meter-bar">
              <span style={{ width: `${active.demandMomentum}%` }} />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            {active.gapSkills.map((skill) => (
              <span key={skill} className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
                Add {skill}
              </span>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => finishSwipe("Ignored")}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/10"
            >
              Ignore
            </button>
            <button
              type="button"
              onClick={() => finishSwipe("Interested")}
              className="rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:scale-[1.02]"
            >
              Interested
            </button>
          </div>
        </article>
      </div>

      <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/68">
        Next up: {upcoming.career.title} with {upcoming.fitScore} fit.
      </div>
    </section>
  );
}
