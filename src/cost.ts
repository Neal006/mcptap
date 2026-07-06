/** chars/4 heuristic — always labeled "estimated" in the UI. */
// ponytail: chars/4, wire up a real tokenizer adapter if anyone needs exactness
export function estimateTokens(value: unknown): number {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return Math.ceil((text?.length ?? 0) / 4);
}
