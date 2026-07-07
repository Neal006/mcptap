import type { Call } from "./api.js";

const hasText = (value: string | undefined): value is string => Boolean(value?.trim());

export function callLabel(call: Call): string {
  return hasText(call.toolName) ? call.toolName : call.method;
}

function callSearchText(call: Call): string {
  return [call.toolName, call.method].filter(hasText).join(" ").toLowerCase();
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
    return callSearchText(call).includes(normalizedQuery);
  });
}
