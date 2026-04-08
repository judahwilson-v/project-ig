import { KPulseShell } from "@/components/kpulse-shell";
import { getHomeSnapshot } from "@/lib/data/repository";
import { buildAlertSignals } from "@/lib/logic/alerts";
import { buildCareerMatches } from "@/lib/logic/career";
import { calculateCrisisScore } from "@/lib/logic/crisis";
import { buildRealityFeed } from "@/lib/logic/feed";
import { buildMigrationAdvice } from "@/lib/logic/migration";
import { buildMigrationLiveCounter } from "@/lib/logic/migration-live";
import { buildPoliticalTemperature } from "@/lib/logic/politics";
import { analyzeSkillGap } from "@/lib/logic/skills";
import { deriveCrisisInput } from "@/lib/logic/system";

export default async function Page() {
  const snapshot = await getHomeSnapshot();
  const feed = buildRealityFeed(snapshot.insights, snapshot.user);
  const matches = buildCareerMatches(snapshot.user, snapshot.careers, snapshot.migration, snapshot.jobTrends);
  const crisis = calculateCrisisScore(
    deriveCrisisInput(snapshot.economicMetrics, snapshot.migration, snapshot.sentiment)
  );
  const migrationAdvice = buildMigrationAdvice(snapshot.user, matches, snapshot.migration);
  const migrationLive = buildMigrationLiveCounter(snapshot.migration, snapshot.migrationCorridors);
  const politics = buildPoliticalTemperature(snapshot.sentiment, snapshot.newsItems);
  const alerts = buildAlertSignals(crisis, matches, migrationLive, politics);
  const skillGap = analyzeSkillGap(snapshot.user, matches, snapshot.jobTrends);

  return (
    <KPulseShell
      user={snapshot.user}
      feed={feed}
      matches={matches}
      crisis={crisis}
      migrationHistory={snapshot.migration}
      migrationLive={migrationLive}
      sentiment={snapshot.sentiment}
      alerts={alerts}
      migrationAdvice={migrationAdvice}
      politicalTemperature={politics}
      jobTrends={snapshot.jobTrends}
      economicMetrics={snapshot.economicMetrics}
      skillGap={skillGap}
    />
  );
}
