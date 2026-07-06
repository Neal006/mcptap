import pricing from "./pricing.json" with { type: "json" };

export const DEFAULT_MODEL = pricing.defaultModel;

export function knownModels(): string[] {
  return Object.keys(pricing.models);
}

/** chars/4 heuristic — always labeled "estimated" in the UI. */
// ponytail: chars/4, wire up a real tokenizer adapter if anyone needs exactness
export function estimateTokens(value: unknown): number {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return Math.ceil((text?.length ?? 0) / 4);
}

/** Estimated USD cost of feeding `tokens` into `model` as input context. */
export function estimateCostUsd(tokens: number, model: string = DEFAULT_MODEL): number | null {
  const entry = (pricing.models as Record<string, { inputPerMTok: number }>)[model];
  if (!entry) return null;
  return (tokens / 1_000_000) * entry.inputPerMTok;
}
