import { join } from "node:path";
import { type ClientAdapter, userHome } from "./types.js";

export const claudeCode: ClientAdapter = {
  name: "claude-code",
  candidates(cwd) {
    return [
      { path: join(cwd, ".mcp.json"), serversKey: "mcpServers" },
      { path: join(userHome(), ".claude.json"), serversKey: "mcpServers" },
    ];
  },
};
