import { PoliticsConsole } from "@/components/pages/politics-console";
import { getHomeSnapshot } from "@/lib/data/repository";
import { buildPoliticalTemperature } from "@/lib/logic/politics";

export default async function PoliticsPage() {
  const snapshot = await getHomeSnapshot();
  const temperature = buildPoliticalTemperature(snapshot.sentiment, snapshot.newsItems);

  return <PoliticsConsole temperature={temperature} />;
}
