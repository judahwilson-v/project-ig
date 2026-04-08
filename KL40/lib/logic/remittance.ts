import type {
  EconomicMetric,
  RemittanceSimulationInput,
  RemittanceSimulationResult,
  RiskLevel
} from "@/lib/types/domain";

function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 78) return "critical";
  if (score >= 60) return "risk";
  if (score >= 40) return "caution";
  return "stable";
}

export function simulateFamilyRemittance(
  input: RemittanceSimulationInput,
  economicMetrics: EconomicMetric[]
): RemittanceSimulationResult {
  const remittanceDrop = economicMetrics.find((metric) => metric.slug === "remittance-drop")?.value ?? 20;
  const inflationPressureBase =
    economicMetrics.find((metric) => metric.slug === "household-inflation-pressure")?.value ?? 6.2;
  const annualLoss = Math.round(input.monthlyRemittance * 12 * (remittanceDrop / 100));
  const projectedMonthlyGap = Math.round(annualLoss / 12);
  const inflationPressure = Number((inflationPressureBase + input.dependenceRatio * 0.035).toFixed(1));
  const budgetStress = Math.round(projectedMonthlyGap * (input.dependenceRatio / 100) + input.householdMembers * 600);
  const riskScore = Math.round(projectedMonthlyGap / 1200 + input.dependenceRatio * 0.7 + input.householdMembers * 2);

  return {
    annualLoss,
    projectedMonthlyGap,
    inflationPressure,
    budgetStress,
    riskLevel: riskLevelFromScore(riskScore),
    recommendations: [
      "Move one household expense into a non-remittance income stream within 60 days.",
      "Prioritise sectors with local salary lift before taking on new debt exposure.",
      "Use the skill-gap analyzer to build one backup income path inside Kerala."
    ]
  };
}
