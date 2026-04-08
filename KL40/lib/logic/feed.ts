import type { Insight, UserProfile } from "@/lib/types/domain";

function hoursSince(dateString: string) {
  const now = Date.now();
  const timestamp = new Date(dateString).getTime();
  return Math.max(1, (now - timestamp) / 36e5);
}

export function buildRealityFeed(insightList: Insight[], user?: UserProfile) {
  const interests = new Set(
    [...(user?.skillProfile ?? []), ...(user?.careerInterest ?? [])].map((value) => value.toLowerCase())
  );

  return [...insightList].sort((left, right) => {
    const leftPersonal = [...interests].some((token) =>
      `${left.title} ${left.vectorSummary} ${left.region}`.toLowerCase().includes(token)
    )
      ? 15
      : 0;
    const rightPersonal = [...interests].some((token) =>
      `${right.title} ${right.vectorSummary} ${right.region}`.toLowerCase().includes(token)
    )
      ? 15
      : 0;

    const leftScore =
      left.trendingScore * 0.44 +
      left.confidenceScore * 100 * 0.26 +
      leftPersonal +
      100 / hoursSince(left.createdAt);

    const rightScore =
      right.trendingScore * 0.44 +
      right.confidenceScore * 100 * 0.26 +
      rightPersonal +
      100 / hoursSince(right.createdAt);

    return rightScore - leftScore;
  });
}
