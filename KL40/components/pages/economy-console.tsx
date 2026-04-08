"use client";

import { useState } from "react";
import { CrisisMeter } from "@/components/crisis-meter";
import type {
  CrisisAssessment,
  EconomicMetric,
  MigrationSnapshot,
  RemittanceSimulationInput,
  RemittanceSimulationResult
} from "@/lib/types/domain";

export function EconomyConsole({
  metrics,
  crisis,
  migrationHistory,
  initialInput,
  initialResult
}: {
  metrics: EconomicMetric[];
  crisis: CrisisAssessment;
  migrationHistory: MigrationSnapshot[];
  initialInput: RemittanceSimulationInput;
  initialResult: RemittanceSimulationResult;
}) {
  const [input, setInput] = useState(initialInput);
  const [result, setResult] = useState(initialResult);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Running family remittance simulation...");

    const response = await fetch("/api/remittance/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)
    });

    const payload = await response.json();

    if (payload.result) {
      setResult(payload.result as RemittanceSimulationResult);
      setStatus("Simulation updated.");
      return;
    }

    setStatus("Could not run simulation.");
  }

  return (
    <main className="relative mx-auto max-w-[92rem] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <section className="section-shell">
        <p className="eyebrow">Economy Console</p>
        <h1 className="mt-3 text-[clamp(2.4rem,6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
          GSDP, debt, remittance pressure, and the family-level stress test.
        </h1>
      </section>

      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {metrics.map((metric) => (
          <div key={metric.id} className="section-shell">
            <p className="eyebrow mb-2">{metric.label}</p>
            <p className="text-2xl font-semibold text-white">{metric.displayValue}</p>
            <p className="mt-2 text-sm text-white/60">{metric.changePercentage >= 0 ? "+" : ""}{metric.changePercentage}%</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
        <CrisisMeter crisis={crisis} migrationHistory={migrationHistory} />

        <section className="section-shell">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Family Remittance Simulator</p>
              <h2 className="section-title">Estimate the cash shock on one household.</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm text-white/70">
              Monthly remittance
              <input
                type="number"
                value={input.monthlyRemittance}
                onChange={(event) => setInput((current) => ({ ...current, monthlyRemittance: Number(event.target.value) }))}
                className="mt-2 w-full rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="block text-sm text-white/70">
              Household dependence %
              <input
                type="number"
                value={input.dependenceRatio}
                onChange={(event) => setInput((current) => ({ ...current, dependenceRatio: Number(event.target.value) }))}
                className="mt-2 w-full rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="block text-sm text-white/70">
              Household members
              <input
                type="number"
                value={input.householdMembers}
                onChange={(event) => setInput((current) => ({ ...current, householdMembers: Number(event.target.value) }))}
                className="mt-2 w-full rounded-[1.2rem] border border-white/10 bg-black/20 px-4 py-3 text-white outline-none"
              />
            </label>
            <button type="submit" className="rounded-full bg-white px-4 py-3 text-sm font-medium text-slate-950">
              Simulate Impact
            </button>
          </form>

          {status ? (
            <div className="mt-4 rounded-[1.2rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/72">
              {status}
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Annual loss</p>
              <p className="text-2xl font-semibold text-white">₹{result.annualLoss.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Monthly gap</p>
              <p className="text-2xl font-semibold text-white">₹{result.projectedMonthlyGap.toLocaleString()}</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Inflation pressure</p>
              <p className="text-2xl font-semibold text-white">{result.inflationPressure}%</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-black/20 p-4">
              <p className="eyebrow mb-2">Risk level</p>
              <p className="text-2xl font-semibold text-white">{result.riskLevel}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
