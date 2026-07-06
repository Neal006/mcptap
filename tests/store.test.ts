import { mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mcptapHome, SessionWriter, sessionsRoot } from "../src/store.js";

let home: string;

beforeEach(() => {
  home = mkdtempSync(join(tmpdir(), "mcptap-test-"));
  process.env.MCPTAP_HOME = home;
});

afterEach(() => {
  delete process.env.MCPTAP_HOME;
  rmSync(home, { recursive: true, force: true });
});

const meta = { server: "github", command: ["npx", "gh-mcp"], startedAt: 1751760000000, pid: 42 };
const metaDate = new Date(meta.startedAt).toISOString().slice(0, 10);

describe("SessionWriter", () => {
  it("respects MCPTAP_HOME override", () => {
    expect(mcptapHome()).toBe(home);
    expect(sessionsRoot()).toBe(join(home, "sessions"));
  });

  it("writes a meta line on creation under a date directory", () => {
    const w = new SessionWriter(meta);
    expect(w.file).toContain(metaDate);
    const lines = readFileSync(w.file, "utf8").trim().split("\n");
    expect(JSON.parse(lines[0] as string)).toEqual({ type: "meta", ...meta });
  });

  it("appends events as JSONL", () => {
    const w = new SessionWriter(meta);
    w.write({ ts: 1, dir: "c2s", frame: { kind: "json", msg: { id: 1, method: "tools/list" } } });
    w.write({ ts: 2, dir: "s2c", frame: { kind: "raw", raw: "junk" } });
    const lines = readFileSync(w.file, "utf8").trim().split("\n");
    expect(lines).toHaveLength(3);
    expect(JSON.parse(lines[1] as string).dir).toBe("c2s");
    expect(JSON.parse(lines[2] as string).frame.raw).toBe("junk");
  });

  it("sanitizes hostile server names so files stay inside the session dir", () => {
    const w = new SessionWriter({ ...meta, server: "../../etc passwd" });
    const files = readdirSync(join(sessionsRoot(), metaDate));
    expect(files).toHaveLength(1);
    expect(files[0]).toMatch(/^[a-zA-Z0-9._-]+\.jsonl$/);
    expect(dirname(resolve(w.file))).toBe(resolve(join(sessionsRoot(), metaDate)));
  });

  it("disables itself instead of throwing when the disk path is unwritable", () => {
    process.env.MCPTAP_HOME = join(home, "\0invalid");
    expect(() => {
      const w = new SessionWriter(meta);
      w.write({ ts: 1, dir: "c2s", frame: { kind: "blank" } });
    }).not.toThrow();
  });
});
