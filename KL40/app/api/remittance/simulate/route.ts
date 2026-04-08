import { getHomeSnapshot } from "@/lib/data/repository";
import { remittanceSimulationInputSchema } from "@/lib/logic/contracts";
import { simulateFamilyRemittance } from "@/lib/logic/remittance";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = remittanceSimulationInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const snapshot = await getHomeSnapshot();
  const result = simulateFamilyRemittance(parsed.data, snapshot.economicMetrics);

  return Response.json({ result });
}
