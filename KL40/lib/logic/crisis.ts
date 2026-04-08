import type { CrisisAssessment, CrisisInput, RiskLevel } from "@/lib/types/domain";

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function scoreToRiskLevel(score: number): RiskLevel {
  if (score >= 78) return "critical";
  if (score >= 60) return "risk";
  if (score >= 42) return "caution";
  return "stable";
}

export function calculateCrisisScore(input: CrisisInput): CrisisAssessment {
  const gdpPressure = clamp(input.gdpGapPct * 7.5);
  const remittancePressure = clamp(input.remittanceDropPct * 6.6);
  const unemploymentPressure = clamp(input.youthUnemploymentPct * 2.4);
  const debtPressure = clamp((input.debtRatioPct - 20) * 3.8);

  const rawScore =
    gdpPressure * 0.22 +
    remittancePressure * 0.23 +
    unemploymentPressure * 0.32 +
    debtPressure * 0.23;

  const score = Math.round(rawScore);
  const riskLevel = scoreToRiskLevel(score);
  const monthsToRiskWindow = Math.max(2, Math.round((90 - score) / 8));

  return {
    score,
    riskLevel,
    displayLabel:
      riskLevel === "critical"
        ? "System heat elevated"
        : riskLevel === "risk"
          ? "Risk zone forming"
          : riskLevel === "caution"
            ? "Watch closely"
            : "Stable for now",
    predictiveWarning:
      riskLevel === "stable"
        ? "Kerala is stable now, but remittance and debt pressures can flip the state in under 12 months."
        : `Kerala could enter a sharper risk zone in about ${monthsToRiskWindow} months if labour absorption does not improve.`,
    drivers: [
      { label: "GSDP gap", score: Math.round(gdpPressure), value: `${input.gdpGapPct.toFixed(1)}%` },
      {
        label: "Remittance drop",
        score: Math.round(remittancePressure),
        value: `${input.remittanceDropPct.toFixed(1)}%`
      },
      {
        label: "Youth unemployment",
        score: Math.round(unemploymentPressure),
        value: `${input.youthUnemploymentPct.toFixed(1)}%`
      },
      { label: "Debt ratio", score: Math.round(debtPressure), value: `${input.debtRatioPct.toFixed(1)}%` }
    ].sort((left, right) => right.score - left.score)
  };
}
