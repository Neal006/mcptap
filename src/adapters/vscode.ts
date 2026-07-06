import { join } from "node:path";
import type { ClientAdapter } from "./types.js";

export const vscode: ClientAdapter = {
  name: "vscode",
  candidates(cwd) {
    return [{ path: join(cwd, ".vscode", "mcp.json"), serversKey: "servers" }];
  },
};
