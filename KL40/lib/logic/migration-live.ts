import type { MigrationCorridor, MigrationLiveCounter, MigrationSnapshot } from "@/lib/types/domain";

export function buildMigrationLiveCounter(
  history: MigrationSnapshot[],
  corridors: MigrationCorridor[]
): MigrationLiveCounter {
  const latest = history[history.length - 1];
  const currentAbroad = corridors
    .filter((corridor) => corridor.flowDirection === "out")
    .reduce((sum, corridor) => sum + corridor.count, 0);
  const returneesThisMonth =
    corridors.find((corridor) => corridor.flowDirection === "in" && corridor.country === "Kerala Returnees")?.count ??
    latest.indiaInflow;
  const netMonthlyFlow = latest.gulfOutflow + latest.euOutflow - returneesThisMonth;

  return {
    currentAbroad,
    returneesThisMonth,
    netMonthlyFlow,
    remittanceImpactIndex: Math.round(Math.max(0, 100 - latest.remittanceIndex + latest.brainDrainScore * 0.55)),
    trendLabel:
      netMonthlyFlow > 10000
        ? "Outflow still dominates"
        : netMonthlyFlow > 0
          ? "Outflow slowing"
          : "Returnees rising faster than exits"
  };
}
