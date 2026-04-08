import type { NewsItem, PoliticalTemperature, SentimentPulse, PoliticalSwing } from "@/lib/types/domain";
import { getElectionCountdown } from "@/lib/logic/system";

function averageScore(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);
}

export function deriveSwingDirection(heatmap: SentimentPulse[]): PoliticalSwing {
  const averageMood = averageScore(heatmap.map((item) => item.youthMoodScore));
  const averagePolitical = averageScore(heatmap.map((item) => item.politicalSentiment));

  if (Math.abs(averageMood - averagePolitical) < 4) return "mixed";
  if (averageMood < 52 && averagePolitical < 52) return "volatile";
  if (averagePolitical >= averageMood) return "LDF";
  return "UDF";
}

export function buildPoliticalTemperature(
  heatmap: SentimentPulse[],
  headlines: NewsItem[]
): PoliticalTemperature {
  const score = Math.round(
    averageScore(heatmap.map((item) => item.unemploymentStress * 0.45 + item.politicalSentiment * 0.55))
  );
  const leadingNarrative =
    headlines[0]?.summary ??
    "Jobs, prices, and migration viability are driving most of the digital political conversation.";

  return {
    score,
    swingDirection: deriveSwingDirection(heatmap),
    electionCountdown: getElectionCountdown("2026-04-09"),
    leadingNarrative,
    heatmap,
    headlines
  };
}
