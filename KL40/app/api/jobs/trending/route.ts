import { getHomeSnapshot } from "@/lib/data/repository";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const sector = request.nextUrl.searchParams.get("sector");
  const snapshot = await getHomeSnapshot();
  const trends = snapshot.jobTrends.filter((trend) =>
    sector ? trend.sector.toLowerCase().includes(sector.toLowerCase()) : true
  );

  return Response.json({ trends });
}
