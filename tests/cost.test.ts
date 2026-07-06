import { describe, expect, it } from "vitest";
import { estimateTokens } from "../src/cost.js";

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
