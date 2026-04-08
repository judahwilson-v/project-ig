import { getHomeSnapshot } from "@/lib/data/repository";
import { buildMigrationLiveCounter } from "@/lib/logic/migration-live";

export async function GET() {
  const snapshot = await getHomeSnapshot();
  const liveCounter = buildMigrationLiveCounter(snapshot.migration, snapshot.migrationCorridors);

  return Response.json({
    liveCounter,
    corridors: snapshot.migrationCorridors,
    history: snapshot.migration
  });
}
