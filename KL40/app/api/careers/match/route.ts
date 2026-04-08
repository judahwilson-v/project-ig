import { getHomeSnapshot } from "@/lib/data/repository";
import { buildCareerMatches } from "@/lib/logic/career";
import { mergeUserProfile, userProfileInputSchema } from "@/lib/logic/contracts";
import { analyzeSkillGap } from "@/lib/logic/skills";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = userProfileInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const snapshot = await getHomeSnapshot();
  const user = mergeUserProfile(parsed.data);
  const matches = buildCareerMatches(user, snapshot.careers, snapshot.migration, snapshot.jobTrends);
  const skillGap = analyzeSkillGap(user, matches, snapshot.jobTrends);

  return Response.json({ matches, skillGap, user });
}
