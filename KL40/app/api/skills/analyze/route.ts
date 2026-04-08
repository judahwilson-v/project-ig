import { getHomeSnapshot } from "@/lib/data/repository";
import { buildCareerMatches } from "@/lib/logic/career";
import { mergeUserProfile, skillsAnalyzeInputSchema } from "@/lib/logic/contracts";
import { analyzeSkillGap } from "@/lib/logic/skills";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = skillsAnalyzeInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const snapshot = await getHomeSnapshot();
  const user = mergeUserProfile(parsed.data.user);
  const matches = buildCareerMatches(user, snapshot.careers, snapshot.migration, snapshot.jobTrends);
  const report = analyzeSkillGap(user, matches, snapshot.jobTrends, parsed.data.targetSector);

  return Response.json({ report, matches: matches.slice(0, 5) });
}
