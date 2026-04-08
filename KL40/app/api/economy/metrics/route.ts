import { getHomeSnapshot } from "@/lib/data/repository";
import { calculateCrisisScore } from "@/lib/logic/crisis";
import { deriveCrisisInput } from "@/lib/logic/system";

export async function GET() {
  const snapshot = await getHomeSnapshot();
  const crisis = calculateCrisisScore(
    deriveCrisisInput(snapshot.economicMetrics, snapshot.migration, snapshot.sentiment)
  );

  return Response.json({ metrics: snapshot.economicMetrics, crisis });
}
