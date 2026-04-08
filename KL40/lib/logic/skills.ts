import type { CareerMatch, JobTrend, SkillGapReport, UserProfile } from "@/lib/types/domain";

function uniqueStrings(values: string[]) {
  return [...new Set(values.map((value) => value.toLowerCase()))];
}

export function analyzeSkillGap(
  user: UserProfile,
  matches: CareerMatch[],
  jobTrends: JobTrend[],
  targetSector?: string
): SkillGapReport {
  const relevantMatches = targetSector
    ? matches.filter((match) =>
        `${match.career.industry} ${match.career.title}`.toLowerCase().includes(targetSector.toLowerCase())
      )
    : matches;
  const topCareer = relevantMatches[0] ?? matches[0];
  const matchedTrend =
    jobTrends.find((trend) =>
      `${trend.sector} ${topCareer.career.industry}`.toLowerCase().includes(topCareer.career.industry.toLowerCase())
    ) ?? jobTrends[0];
  const ownedSkills = uniqueStrings(user.skillProfile);
  const missingSkills = matchedTrend.focusSkills.filter((skill) => !ownedSkills.includes(skill.toLowerCase()));
  const bridgeSkills = [...topCareer.gapSkills, ...missingSkills]
    .filter((skill, index, array) => array.findIndex((value) => value.toLowerCase() === skill.toLowerCase()) === index)
    .slice(0, 3);
  const salaryDeltaEstimate = Math.max(0, topCareer.career.avgSalaryKerala - 420000);
  const readinessScore = Math.min(96, Math.round(topCareer.skillMatchScore * 0.68 + topCareer.futureScore * 0.32));

  return {
    topCareer,
    bridgeSkills,
    salaryDeltaEstimate,
    readinessScore,
    narrative: `Build ${bridgeSkills.join(", ")} next to move toward ${topCareer.career.title} and materially increase salary leverage.`,
    matchingRoles: relevantMatches.slice(0, 3).map((match) => match.career.title)
  };
}
