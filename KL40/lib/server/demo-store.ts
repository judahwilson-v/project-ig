import type { ExplainerCache, UserInteractionRecord } from "@/lib/types/domain";

const interactionStore = new Map<string, UserInteractionRecord[]>();
const explainerStore = new Map<string, ExplainerCache>();

export function getDemoInteractions(userId: string) {
  return interactionStore.get(userId) ?? [];
}

export function recordDemoInteraction(userId: string, interaction: UserInteractionRecord) {
  const current = interactionStore.get(userId) ?? [];
  const next = [...current, interaction];
  interactionStore.set(userId, next);
  return next;
}

export function getCachedExplainer(sourceHash: string) {
  return explainerStore.get(sourceHash) ?? null;
}

export function setCachedExplainer(entry: ExplainerCache) {
  explainerStore.set(entry.sourceHash, entry);
  return entry;
}
