import type {
  AlertSignal,
  CareerMatch,
  CrisisAssessment,
  MigrationLiveCounter,
  PoliticalTemperature
} from "@/lib/types/domain";

export function buildAlertSignals(
  crisis: CrisisAssessment,
  matches: CareerMatch[],
  migrationLive: MigrationLiveCounter,
  politics: PoliticalTemperature
): AlertSignal[] {
  const topCareer = matches[0];

  return [
    {
      id: "alert-career",
      title: `${topCareer.career.title} is the cleanest income jump now`,
      detail: `${topCareer.career.openingsCount.toLocaleString()} openings and ${topCareer.career.demandGrowthPct}% growth.`,
      severity: topCareer.fitScore > 82 ? "stable" : "caution",
      category: "jobs"
    },
    {
      id: "alert-migration",
      title: `${migrationLive.returneesThisMonth.toLocaleString()} returnees logged this month`,
      detail: `${migrationLive.currentAbroad.toLocaleString()} Keralites are still abroad while net flow is ${migrationLive.netMonthlyFlow.toLocaleString()}.`,
      severity: migrationLive.remittanceImpactIndex >= 70 ? "risk" : "caution",
      category: "migration"
    },
    {
      id: "alert-crisis",
      title: `Kerala crisis score is ${crisis.score}/100`,
      detail: crisis.predictiveWarning,
      severity: crisis.riskLevel,
      category: "economy"
    },
    {
      id: "alert-politics",
      title: `Political temperature is ${politics.score}/100`,
      detail: `${politics.leadingNarrative} Swing currently reads ${politics.swingDirection}.`,
      severity: politics.score >= 70 ? "risk" : "caution",
      category: "politics"
    }
  ];
}
