import { getHomeSnapshot } from "@/lib/data/repository";
import { buildRealityFeed } from "@/lib/logic/feed";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? 20);
  const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;

  const snapshot = await getHomeSnapshot();
  const feed = buildRealityFeed(snapshot.insights, snapshot.user)
    .filter((item) => (category ? item.category === category : true))
    .slice(0, limit);

  return Response.json({ feed });
}
