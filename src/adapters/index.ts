import { claudeCode } from "./claude-code.js";
import { cursor } from "./cursor.js";
import type { ClientAdapter } from "./types.js";
import { vscode } from "./vscode.js";

export const adapters: ClientAdapter[] = [claudeCode, cursor, vscode];
export type { ClientAdapter, ConfigCandidate } from "./types.js";
