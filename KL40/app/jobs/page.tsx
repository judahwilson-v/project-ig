import { JobsConsole } from "@/components/pages/jobs-console";
import { getHomeSnapshot } from "@/lib/data/repository";
import { buildCareerMatches } from "@/lib/logic/career";
import { analyzeSkillGap } from "@/lib/logic/skills";

export default async function JobsPage() {
  const snapshot = await getHomeSnapshot();
  const matches = buildCareerMatches(snapshot.user, snapshot.careers, snapshot.migration, snapshot.jobTrends);
  const skillGap = analyzeSkillGap(snapshot.user, matches, snapshot.jobTrends);

  return (
    <JobsConsole
      user={snapshot.user}
      initialMatches={matches}
      jobTrends={snapshot.jobTrends}
      initialSkillGap={skillGap}
    />
  );
}
