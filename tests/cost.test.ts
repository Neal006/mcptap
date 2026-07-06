import { describe, expect, it } from "vitest";
import { DEFAULT_MODEL, estimateCostUsd, estimateTokens, knownModels } from "../src/cost.js";

describe("estimateTokens", () => {
  it("uses the chars/4 heuristic on strings", () => {
    expect(estimateTokens("abcdefgh")).toBe(2);
    expect(estimateTokens("abc")).toBe(1);
    expect(estimateTokens("")).toBe(0);
  });

  it("serializes non-strings before counting", () => {
    expect(estimateTokens({ a: 1 })).toBe(Math.ceil('{"a":1}'.length / 4));
  });

  it("handles undefined without throwing", () => {
    expect(estimateTokens(undefined)).toBe(0);
  });
});

describe("estimateCostUsd", () => {
  it("prices tokens against the default model", () => {
    const cost = estimateCostUsd(1_000_000);
    expect(cost).toBeGreaterThan(0);
  });

  it("returns null for unknown models instead of guessing", () => {
    expect(estimateCostUsd(1000, "gpt-42-ultra")).toBeNull();
  });

  it("default model exists in the pricing table", () => {
    expect(knownModels()).toContain(DEFAULT_MODEL);
  });
});
