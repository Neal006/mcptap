import { describe, expect, it } from "vitest";
import { LineSplitter, parseFrame } from "../src/frames.js";

const buf = (s: string) => Buffer.from(s, "utf8");

describe("LineSplitter", () => {
  it("emits a single complete line", () => {
    const s = new LineSplitter();
    expect(s.push(buf('{"a":1}\n'))).toEqual(['{"a":1}']);
  });

  it("emits multiple lines from one chunk", () => {
    const s = new LineSplitter();
    expect(s.push(buf("one\ntwo\nthree\n"))).toEqual(["one", "two", "three"]);
  });

  it("buffers a partial line across chunks", () => {
    const s = new LineSplitter();
    expect(s.push(buf('{"a"'))).toEqual([]);
    expect(s.push(buf(':1}\n{"b"'))).toEqual(['{"a":1}']);
    expect(s.push(buf(":2}\n"))).toEqual(['{"b":2}']);
  });

  it("reassembles a multi-byte utf8 character split across chunks", () => {
    const s = new LineSplitter();
    const bytes = buf("héllo\n");
    expect(s.push(bytes.subarray(0, 2))).toEqual([]); // splits é in half
    expect(s.push(bytes.subarray(2))).toEqual(["héllo"]);
  });

  it("flush returns the trailing partial line", () => {
    const s = new LineSplitter();
    s.push(buf("complete\npartial"));
    expect(s.flush()).toBe("partial");
    expect(s.flush()).toBeNull();
  });

  it("emits an empty string for consecutive newlines", () => {
    const s = new LineSplitter();
    expect(s.push(buf("a\n\nb\n"))).toEqual(["a", "", "b"]);
  });

  it("handles a 1MB line split into small chunks", () => {
    const s = new LineSplitter();
    const big = JSON.stringify({ data: "x".repeat(1024 * 1024) });
    const bytes = buf(`${big}\n`);
    const out: string[] = [];
    for (let i = 0; i < bytes.length; i += 4096) {
      out.push(...s.push(bytes.subarray(i, i + 4096)));
    }
    expect(out).toEqual([big]);
  });
});

describe("parseFrame", () => {
  it("parses a JSON-RPC message", () => {
    expect(parseFrame('{"jsonrpc":"2.0","id":1,"method":"tools/list"}')).toEqual({
      kind: "json",
      msg: { jsonrpc: "2.0", id: 1, method: "tools/list" },
    });
  });

  it("strips a trailing CR before parsing", () => {
    expect(parseFrame('{"a":1}\r')).toEqual({ kind: "json", msg: { a: 1 } });
  });

  it("preserves non-JSON output as a raw frame", () => {
    expect(parseFrame("Server started on port 3000")).toEqual({
      kind: "raw",
      raw: "Server started on port 3000",
    });
  });

  it("treats JSON primitives and arrays as raw frames", () => {
    expect(parseFrame("42")).toEqual({ kind: "raw", raw: "42" });
    expect(parseFrame("[1,2]")).toEqual({ kind: "raw", raw: "[1,2]" });
    expect(parseFrame("null")).toEqual({ kind: "raw", raw: "null" });
  });

  it("classifies whitespace-only lines as blank", () => {
    expect(parseFrame("")).toEqual({ kind: "blank" });
    expect(parseFrame("  \r")).toEqual({ kind: "blank" });
  });

  it("survives truncated JSON as raw", () => {
    expect(parseFrame('{"jsonrpc":"2.0","id":')).toEqual({
      kind: "raw",
      raw: '{"jsonrpc":"2.0","id":',
    });
  });
});
