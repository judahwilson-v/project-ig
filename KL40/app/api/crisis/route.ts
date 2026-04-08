import { getHomeSnapshot } from "@/lib/data/repository";
import { calculateCrisisScore } from "@/lib/logic/crisis";
import { deriveCrisisInput } from "@/lib/logic/system";

export async function GET() {
  const snapshot = await getHomeSnapshot();
  const input = deriveCrisisInput(snapshot.economicMetrics, snapshot.migration, snapshot.sentiment);
  const crisis = calculateCrisisScore(input);

  return Response.json({ crisis, input });
}
