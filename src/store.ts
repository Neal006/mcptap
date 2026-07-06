import { appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Frame } from "./frames.js";

export interface SessionMeta {
  type: "meta";
  server: string;
  command: string[];
  startedAt: number;
  pid: number;
}

export interface TapEvent {
  ts: number;
  dir: "c2s" | "s2c";
  frame: Frame;
}

export function mcptapHome(): string {
  return process.env.MCPTAP_HOME ?? join(homedir(), ".mcptap");
}

export function sessionsRoot(): string {
  return join(mcptapHome(), "sessions");
}

function dateDir(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

/**
 * Append-only JSONL session log. Every write is wrapped: a failing disk must
 * never take down the proxied session, so the writer disables itself on the
 * first error and warns once on stderr.
 */
export class SessionWriter {
  readonly file: string;
  private broken = false;

  constructor(meta: Omit<SessionMeta, "type">) {
    const dir = join(sessionsRoot(), dateDir(meta.startedAt));
    const name = `${sanitize(meta.server)}-${meta.startedAt}-${meta.pid}.jsonl`;
    this.file = join(dir, name);
    try {
      mkdirSync(dir, { recursive: true });
      appendFileSync(this.file, `${JSON.stringify({ type: "meta", ...meta })}\n`);
    } catch (err) {
      this.disable(err);
    }
  }

  write(event: TapEvent): void {
    if (this.broken) return;
    try {
      // ponytail: sync append after traffic is already forwarded (~µs per line,
      // crash-safe); switch to batched async writes if a chatty server measures slow
      appendFileSync(this.file, `${JSON.stringify(event)}\n`);
    } catch (err) {
      this.disable(err);
    }
  }

  private disable(err: unknown): void {
    if (this.broken) return;
    this.broken = true;
    process.stderr.write(`[mcptap] recording disabled: ${String(err)}\n`);
  }
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_") || "server";
}
