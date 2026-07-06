import type { Call } from "./api.js";

export function callLabel(call: Call): string {
  return call.toolName ?? call.method;
}

export function filterTimelineCalls(calls: Call[], query: string, errorsOnly: boolean): Call[] {
  const normalizedQuery = query.trim().toLowerCase();
  return calls.filter((call) => {
    if (errorsOnly && !call.isError) {
      return false;
    }
    if (!normalizedQuery) {
      return true;
    }
    return callLabel(call).toLowerCase().includes(normalizedQuery);
  });
}
