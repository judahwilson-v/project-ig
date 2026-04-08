import { getHomeSnapshot } from "@/lib/data/repository";
import { buildPoliticalTemperature } from "@/lib/logic/politics";

export async function GET() {
  const snapshot = await getHomeSnapshot();
  const temperature = buildPoliticalTemperature(snapshot.sentiment, snapshot.newsItems);

  return Response.json({ temperature });
}
