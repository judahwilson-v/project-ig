import { EconomyConsole } from "@/components/pages/economy-console";
import { getHomeSnapshot } from "@/lib/data/repository";
import { calculateCrisisScore } from "@/lib/logic/crisis";
import { buildDefaultRemittanceInput } from "@/lib/logic/contracts";
import { simulateFamilyRemittance } from "@/lib/logic/remittance";
import { deriveCrisisInput } from "@/lib/logic/system";

export default async function EconomyPage() {
  const snapshot = await getHomeSnapshot();
  const crisis = calculateCrisisScore(
    deriveCrisisInput(snapshot.economicMetrics, snapshot.migration, snapshot.sentiment)
  );
  const initialInput = buildDefaultRemittanceInput();
  const initialResult = simulateFamilyRemittance(initialInput, snapshot.economicMetrics);

  return (
    <EconomyConsole
      metrics={snapshot.economicMetrics}
      crisis={crisis}
      migrationHistory={snapshot.migration}
      initialInput={initialInput}
      initialResult={initialResult}
    />
  );
}
