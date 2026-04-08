import { getExplainerCache, saveExplainerCache } from "@/lib/data/repository";
import { buildExplainerMode } from "@/lib/logic/explainer";
import { explainerInputSchema } from "@/lib/logic/contracts";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const parsed = explainerInputSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.sourceHash) {
    const cached = await getExplainerCache(parsed.data.sourceHash);

    if (cached) {
      return Response.json({ explanation: cached, cached: true });
    }
  }

  const explanation = buildExplainerMode(parsed.data.label, parsed.data.value, parsed.data.context);

  if (parsed.data.sourceHash) {
    await saveExplainerCache({
      key: parsed.data.sourceHash,
      sourceHash: parsed.data.sourceHash,
      createdAt: new Date().toISOString(),
      ...explanation
    });
  }

  return Response.json({ explanation, cached: false });
}
