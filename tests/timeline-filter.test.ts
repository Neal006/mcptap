import { describe, expect, it } from "vitest";
import type { Call } from "../ui/src/api.js";
import { filterTimelineCalls } from "../ui/src/timeline-filter.js";

const call = (overrides: Partial<Call>): Call => ({
  id: overrides.id ?? "1",
  method: overrides.method ?? "tools/call",
  request: overrides.request ?? {},
  isError: overrides.isError ?? false,
  startTs: overrides.startTs ?? 1,
  requestTokens: overrides.requestTokens ?? 0,
  responseTokens: overrides.responseTokens ?? 0,
  ...overrides,
});

describe("filterTimelineCalls", () => {
  const calls = [
    call({ id: "1", toolName: "github_search", method: "tools/call" }),
    call({ id: "2", method: "resources/read", isError: true }),
    call({ id: "3", toolName: "filesystem_write", method: "tools/call", isError: true }),
  ];

  it("matches tool or method names case-insensitively", () => {
    expect(filterTimelineCalls(calls, "GITHUB", false).map((entry) => entry.id)).toEqual(["1"]);
    expect(filterTimelineCalls(calls, "resources", false).map((entry) => entry.id)).toEqual(["2"]);
  });

  it("can show only errored calls", () => {
    expect(filterTimelineCalls(calls, "", true).map((entry) => entry.id)).toEqual(["2", "3"]);
  });

  it("combines search and errors-only filters", () => {
    expect(filterTimelineCalls(calls, "filesystem", true).map((entry) => entry.id)).toEqual(["3"]);
  });
});
