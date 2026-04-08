import { getHomeSnapshot, recordExpressInterest } from "@/lib/data/repository";
import { buildCareerMatches } from "@/lib/logic/career";
import { expressInterestInputSchema, mergeUserProfile } from "@/lib/logic/contracts";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = expressInterestInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await recordExpressInterest(parsed.data.userId, parsed.data.careerId, parsed.data.note);

  const snapshot = await getHomeSnapshot(mergeUserProfile({ id: parsed.data.userId }));
  const matches = buildCareerMatches(snapshot.user, snapshot.careers, snapshot.migration, snapshot.jobTrends);

  return Response.json({
    ok: true,
    matches,
    updatedInterest: parsed.data.careerId
  });
}
