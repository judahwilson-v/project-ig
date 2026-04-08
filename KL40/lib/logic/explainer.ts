import type { ExplainerResponse } from "@/lib/types/domain";

export function buildExplainerMode(label: string, value: string, context?: string): ExplainerResponse {
  const normalized = label.toLowerCase();

  if (normalized.includes("remittance")) {
    return {
      headline: "Why the remittance shock matters",
      lines: [
        "A 20% drop in Gulf flows hits household cash before local wages adjust.",
        "That squeezes spending, borrowing confidence, and migration planning at the same time.",
        context ?? `Current reading: ${value}. Families with high dependence feel the impact first.`
      ],
      visualHint: "Show a falling Gulf-to-Kerala cash stream with household pressure rings."
    };
  }

  if (normalized.includes("gsdp")) {
    return {
      headline: "Why the GSDP target matters",
      lines: [
        "A big target only matters if it produces visible jobs and private investment on the ground.",
        "If growth stays abstract, youth unemployment and migration pressure remain elevated.",
        context ?? `Current reading: ${value}. The system treats this as a credibility signal, not a headline.`
      ],
      visualHint: "Use a target bar versus realised opportunity line."
    };
  }

  if (normalized.includes("demand")) {
    return {
      headline: "Why this demand spike matters",
      lines: [
        "Demand spikes tell you where employers are desperate enough to hire quickly.",
        "That usually means better salary leverage and a shorter path to placement.",
        context ?? `Current value: ${value}. This is strong enough to change timing for a career move.`
      ],
      visualHint: "Render a fast-rising sparkline breaking through a threshold."
    };
  }

  return {
    headline: `Why ${label} matters`,
    lines: [
      `${label} is a live decision signal, not a passive statistic.`,
      "When it moves, your options in jobs, migration, and risk change with it.",
      context ?? `Current reading is ${value}, so the platform is treating it as a real watchpoint.`
    ],
    visualHint: "Pair the metric with a short consequence strip and a directional trend line."
  };
}
