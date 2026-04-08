import type { CareerMatch, MigrationAdvice, MigrationSnapshot, UserProfile } from "@/lib/types/domain";

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function buildMigrationAdvice(
  user: UserProfile,
  matches: CareerMatch[],
  migrationHistory: MigrationSnapshot[]
): MigrationAdvice {
  const latest = migrationHistory[migrationHistory.length - 1];
  const topCareer = matches[0];
  const stayScore = clamp(topCareer.futureScore * 0.56 + topCareer.career.avgSalaryKerala / 18000);
  const leaveScore = clamp(
    topCareer.futureScore * 0.38 +
      topCareer.salaryLeverage * 0.28 +
      topCareer.preferredCountryBoost * 0.22 +
      latest.euGrowthPct * 1.9
  );

  const recommendation =
    leaveScore - stayScore > 12 ? "leave" : stayScore - leaveScore > 9 ? "stay" : "hybrid";

  const destinations =
    recommendation === "stay"
      ? ["Kochi", "Trivandrum", "Calicut"]
      : user.preferredCountries.slice(0, 3);

  const summary =
    recommendation === "leave"
      ? `Your strongest leverage is outside Kerala: ${topCareer.career.title} is compounding faster abroad than local salary growth can match.`
      : recommendation === "stay"
        ? `Your current opportunity curve is still strongest inside Kerala, especially if you use the next 6-9 months to deepen specialization.`
        : `Run a split strategy: build one strong local cycle first, while making yourself migration-ready for ${topCareer.career.title}.`;

  return {
    recommendation,
    confidence: Math.round(clamp(Math.abs(leaveScore - stayScore) + topCareer.fitScore * 0.36, 54, 95)),
    summary,
    bestDestinations: destinations,
    reasoning: [
      `Best current lane: ${topCareer.career.title} with a ${topCareer.fitScore} fit score.`,
      `EU growth is ${latest.euGrowthPct.toFixed(1)}% while Gulf demand is down ${Math.abs(latest.gulfDeclinePct).toFixed(1)}%.`,
      `Your biggest missing edge is ${topCareer.gapSkills.join(", ") || "small enough to close quickly"}.`
    ]
  };
}
