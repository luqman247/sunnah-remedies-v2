# Continuum — Constitutional Specification Programme

**Status of the fifteen numbered specifications commissioned by `000-platform-constitution.md`.**
This document exists because the platform constitution declares fifteen children, of which two are authored. The prior export contained a folder scaffold with all fifteen files present but **empty** (see `DECISION_LOG.md` D-004); empty files were not carried. This programme is the honest record of what exists and the dependency order for authoring the remainder.

Source material for every pending specification already exists in `../rfc/` (the 34-RFC set). Authoring is therefore consolidation into the constitutional format, not invention.

---

## Status board

| Nº | Specification | Status | Primary RFC sources |
|---|---|---|---|
| 000 | Platform Constitution | **Authored** — ratifiable draft 0.1.0 | RFC-000, architecture doc |
| 001 | Runtime Specification | Pending | RFC-200–204 |
| 002 | Context Graph Specification | Pending | RFC-300–305 |
| 003 | Engine Contracts | Pending | RFC-500–511, RFC-100–110 |
| 004 | Plugin System | Pending | RFC-600–703 (plugin half) |
| 005 | Project Schema | Pending | RFC-100–101 |
| 006 | Verification Protocol | Pending | RFC-400–405 |
| 007 | CLI Specification | Pending | RFC-600–703 (surface half) |
| 008 | API Specification | Pending | RFC-102–110 |
| 009 | SDK Specification | Pending | RFC-600–703 |
| 010 | Storage Specification | Pending | RFC-200 (event log), RFC-900s |
| 011 | Security Model | **Authored** | RFC-900–1101 (security sections) |
| 012 | Upgrade Model | Pending | RFC-800–802 |
| 013 | State Machine | Pending | RFC-204 |
| 014 | Event Model | Pending | RFC-111 |
| 015 | Query Language | Pending | RFC-300s (query surface) |

## Authoring order (dependency-driven)

```
014 event model ─▶ 013 state machine ─▶ 001 runtime ─▶ 010 storage
005 project schema ─▶ 002 context graph ─▶ 015 query language
003 engine contracts ─▶ 006 verification ─▶ 004 plugins
008 api ─▶ 007 cli ─▶ 009 sdk
012 upgrade model (last — depends on all state-bearing specs)
```

Rationale: the constitution's own invariants make the event envelope (014) load-bearing for everything; runtime and storage depend on it; the developer surfaces (007–009) merely expose contracts defined earlier; upgrade (012) must know every persistent shape it migrates.

## Rules for authoring

1. Each specification uses the constitutional front-matter of 000 and 011 (`document`, `classification`, `derives_from`, `children`).
2. Nothing may contradict 000; conflicts void the downstream text until amended.
3. Every normative statement must trace to an RFC or a new decision recorded in the repository `DECISION_LOG.md`.
4. On completion of each spec, update this board and the repository `CHANGELOG.md`.
