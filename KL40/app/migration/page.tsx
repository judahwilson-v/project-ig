import { MigrationConsole } from "@/components/pages/migration-console";
import { getHomeSnapshot } from "@/lib/data/repository";
import { buildCareerMatches } from "@/lib/logic/career";
import { buildMigrationAdvice } from "@/lib/logic/migration";
import { buildMigrationLiveCounter } from "@/lib/logic/migration-live";

export default async function MigrationPage() {
  const snapshot = await getHomeSnapshot();
  const matches = buildCareerMatches(snapshot.user, snapshot.careers, snapshot.migration, snapshot.jobTrends);
  const advice = buildMigrationAdvice(snapshot.user, matches, snapshot.migration);
  const liveCounter = buildMigrationLiveCounter(snapshot.migration, snapshot.migrationCorridors);

  return (
    <MigrationConsole
      history={snapshot.migration}
      liveCounter={liveCounter}
      corridors={snapshot.migrationCorridors}
      advice={advice}
    />
  );
}
