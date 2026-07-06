import { join } from "node:path";
import { type ClientAdapter, userHome } from "./types.js";

export const cursor: ClientAdapter = {
  name: "cursor",
  candidates(cwd) {
    return [
      { path: join(cwd, ".cursor", "mcp.json"), serversKey: "mcpServers" },
      { path: join(userHome(), ".cursor", "mcp.json"), serversKey: "mcpServers" },
    ];
  },
};
