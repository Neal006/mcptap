# Roadmap

v0.2 ships the core loop: tap → record → inspect → replay, stdio-only,
three clients. Everything below is up for grabs — comment on the linked
issue before starting so work doesn't collide.

## Next (v0.3)

- [ ] Streamable HTTP / SSE transport capture ([#18](https://github.com/Neal006/mcptail/issues/18))
- [ ] Windsurf ([#6](https://github.com/Neal006/mcptail/issues/6)), Zed ([#7](https://github.com/Neal006/mcptail/issues/7)), and Cline ([#8](https://github.com/Neal006/mcptail/issues/8)) client adapters
- [ ] Search & filter in the dashboard timeline ([#10](https://github.com/Neal006/mcptail/issues/10))
- [ ] Session pruning: `mcptail clear` ([#12](https://github.com/Neal006/mcptail/issues/12)) + size rotation ([#13](https://github.com/Neal006/mcptail/issues/13))

## Later

- [ ] Export a captured call as a regression test ([#20](https://github.com/Neal006/mcptail/issues/20))
- [ ] HAR export for sharing sessions ([#14](https://github.com/Neal006/mcptail/issues/14))
- [ ] OpenTelemetry exporter ([#19](https://github.com/Neal006/mcptail/issues/19))
- [ ] Exact tokenizer adapters (opt-in) instead of chars/4
- [ ] Session diffing — compare two runs of the same server ([#21](https://github.com/Neal006/mcptail/issues/21))
- [ ] Homebrew tap
- [ ] Light theme ([#11](https://github.com/Neal006/mcptail/issues/11)) and keyboard navigation ([#15](https://github.com/Neal006/mcptail/issues/15)) in the dashboard

## Non-goals

- Cloud anything. mcptail stays local-first with no account.
- Modifying traffic. It's a tap, not a middleware framework.
- Dollar-cost estimates. Token counts answer "what's eating my context";
  chars/4 numbers dressed up as money were removed in v0.2.0.
