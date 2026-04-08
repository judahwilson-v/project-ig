import type { Career, CareerMatch, JobTrend, MigrationSnapshot, UserProfile } from "@/lib/types/domain";

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function sharedSkillRatio(userSkills: string[], roleSkills: string[]) {
  const userSet = new Set(userSkills.map((skill) => skill.toLowerCase()));
  const hits = roleSkills.filter((skill) => userSet.has(skill.toLowerCase())).length;
  return roleSkills.length === 0 ? 0 : hits / roleSkills.length;
}

function inferCountryBoost(industry: string, preferredCountries: string[], latestMigration: MigrationSnapshot) {
  const europeWeighted = preferredCountries.some((country) =>
    ["germany", "ireland", "canada", "netherlands"].includes(country.toLowerCase())
  );
  const gulfWeighted = preferredCountries.some((country) =>
    ["uae", "qatar", "oman", "saudi arabia"].includes(country.toLowerCase())
  );

  if (industry === "healthcare" && europeWeighted) {
    return clamp(64 + latestMigration.euGrowthPct * 1.9);
  }

  if (industry === "analytics" || industry === "fintech" || industry === "technology") {
    return clamp(58 + latestMigration.euGrowthPct * 1.4);
  }

  if (industry === "clean-energy") {
    return europeWeighted ? 72 : 57;
  }

  if (gulfWeighted) {
    return clamp(40 + Math.abs(latestMigration.gulfDeclinePct) * 0.9);
  }

  return 50;
}

function interactionBoost(user: UserProfile, careerId: string) {
  return user.interactionHistory.reduce((score, interaction) => {
    if (interaction.targetId !== careerId) {
      return score;
    }

    if (interaction.kind === "interested") return score + 12;
    if (interaction.kind === "saved") return score + 7;
    if (interaction.kind === "ignored") return score - 14;
    return score;
  }, 0);
}

function trendScore(career: Career, jobTrends: JobTrend[]) {
  const trend = jobTrends.find(
    (item) =>
      item.sector.toLowerCase().includes(career.industry.toLowerCase()) ||
      career.title.toLowerCase().includes(item.sector.toLowerCase())
  );

  if (!trend) {
    return clamp(career.demandGrowthPct * 0.32 + career.openingsCount / 80);
  }

  return clamp(trend.demandGrowthPct * 0.18 + trend.openingsCount / 120 + career.openingsCount / 120);
}

export function buildCareerMatches(
  user: UserProfile,
  careerList: Career[],
  migrationHistory: MigrationSnapshot[],
  jobTrends: JobTrend[] = []
): CareerMatch[] {
  const latestMigration = migrationHistory[migrationHistory.length - 1];

  return careerList
    .map((career) => {
      const skillMatchScore = sharedSkillRatio(user.skillProfile, career.skillTags) * 100;
      const salaryLeverage = clamp((career.avgSalaryAbroad / Math.max(career.avgSalaryKerala, 1)) * 25, 0, 100);
      const countryBoost = inferCountryBoost(career.industry, user.preferredCountries, latestMigration);
      const demandMomentum = trendScore(career, jobTrends);
      const automationPenalty = career.automationRiskScore * 0.42;
      const preferenceBoost = user.careerInterest.some((interest) =>
        `${career.industry} ${career.title}`.toLowerCase().includes(interest.toLowerCase())
      )
        ? 10
        : 0;
      const userSignal = interactionBoost(user, career.id);

      const futureScore = Math.round(
        clamp(
          skillMatchScore * 0.28 +
            career.futureProofScore * 0.28 +
            demandMomentum * 0.2 +
            countryBoost * 0.14 +
            preferenceBoost +
            userSignal -
            automationPenalty
        )
      );

      const gapSkills = career.skillTags.filter(
        (skill) => !user.skillProfile.map((value) => value.toLowerCase()).includes(skill.toLowerCase())
      );

      const fitScore = Math.round(
        clamp((futureScore + skillMatchScore * 0.55 + demandMomentum * 0.3 + userSignal) / 1.85)
      );

      return {
        career,
        fitScore,
        skillMatchScore: Math.round(skillMatchScore),
        futureScore,
        salaryLeverage: Math.round(salaryLeverage),
        preferredCountryBoost: Math.round(countryBoost),
        demandMomentum: Math.round(demandMomentum),
        gapSkills: gapSkills.slice(0, 3),
        narrative:
          fitScore >= 84
            ? `${career.title} is the fastest high-confidence route for your current profile.`
            : fitScore >= 68
              ? `${career.title} is strong, but it becomes much more powerful after one bridge skill sprint.`
              : `${career.title} is promising, but you need a clearer skill bridge before it becomes worth chasing hard.`
      };
    })
    .sort((left, right) => right.fitScore - left.fitScore);
}
