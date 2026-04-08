import { getHomeSnapshot } from "@/lib/data/repository";
import { buildAlertSignals } from "@/lib/logic/alerts";
import { buildCareerMatches } from "@/lib/logic/career";
import { calculateCrisisScore } from "@/lib/logic/crisis";
import { buildMigrationLiveCounter } from "@/lib/logic/migration-live";
import { buildPoliticalTemperature } from "@/lib/logic/politics";
import { deriveCrisisInput } from "@/lib/logic/system";

export async function GET() {
  const snapshot = await getHomeSnapshot();
  const matches = buildCareerMatches(snapshot.user, snapshot.careers, snapshot.migration, snapshot.jobTrends);
  const crisis = calculateCrisisScore(
    deriveCrisisInput(snapshot.economicMetrics, snapshot.migration, snapshot.sentiment)
  );
  const migrationLive = buildMigrationLiveCounter(snapshot.migration, snapshot.migrationCorridors);
  const politics = buildPoliticalTemperature(snapshot.sentiment, snapshot.newsItems);
  const alerts = buildAlertSignals(crisis, matches, migrationLive, politics);

  return Response.json({ alerts });
}
