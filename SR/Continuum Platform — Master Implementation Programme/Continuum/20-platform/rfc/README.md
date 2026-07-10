# Continuum — Technical Specification v1.0

**The complete RFC set for a runtime-first AI engineering platform.**
Everything an engineering team needs to implement any subsystem independently, before a line of production code is written.

---

## What this is

A set of **34 RFCs** across 10 subsystem groups, descending from the approved platform architecture into implementable specification: data models, APIs, state machines, invariants, failure modes, and conformance tests. Design rationale lives in the architecture document; this set specifies *what to build and how it must behave*.

## Start here

1. **`00-meta/RFC-000-index.md`** — master index, conventions, global invariants, build order.
2. **`00-meta/RFC-001-002-003.md`** — system overview, glossary, conformance.
3. **`10-contracts/RFC-111-event.md`** and **`RFC-100-101-...`** — the three most load-bearing contracts.
4. **`00-meta/RFC-005-traceability.md`** — proof that every architectural decision is covered.

## The set

| Group | RFCs | Covers |
|---|---|---|
| `00-meta` | 000, 001, 002, 003, 005 | index, overview, glossary, conformance, traceability |
| `10-contracts` | 100–111 | the eleven contracts + event envelope (the constitution) |
| `20-runtime` | 200–204 | event log, projections, access, lifecycle modes, **transaction state machine** |
| `30-context` | 300–305 | graph subsystem, **indexer/freshness (critical)**, indexes, retrieval, knowledge, query language |
| `40-verification` | 400–405 | obligations, **sandbox**, evidence+signing, attestation, audit |
| `50-engines` | 500–511 | stateless-worker skeleton + the eleven engines |
| `60-sdk` | 600–603 (+700–703) | one contract-first API, CLI, auth/caps, hooks; plugin host & isolation |
| `70-plugins` | 700–703 | (in the 60-sdk doc) host, isolation, resolution, category contracts |
| `80-upgrade` | 800–802 | versioning, **three-way semantic merge**, snapshots/branching |
| `90-cross-cutting` | 900–904, 1101 | security, tenancy, observability, DR, SLOs, **project lifecycle** |

## The core guarantee

> No project state ever becomes "true / done / released" except through a transaction whose verification attestation is signed, out-of-process, against a versioned contract, with an immutable audit trail — and never for an irreversible action without recorded human approval.

This single guarantee (INV-G-01, enforced by RFC-204 + RFC-400) is why thousands of teams and millions of agents can work in the platform and still trust the result.

## Build order (dependency DAG)

```
RFC-111 Event → contracts → RFC-200 log/projections → RFC-300 context
→ RFC-400 verification → RFC-204 transaction → RFC-500 engines
→ RFC-600 SDK / RFC-700 plugins → RFC-800 upgrade → RFC-900 hardening
```

**Minimum viable slice:** RFC-111 + 200 + 300 (read-only Attach + index) + one verifier under 400 — an always-fresh, queryable, honestly-verified project brain, shippable before write-back and generation exist.

## Conformance

An implementation is *Continuum-conformant* iff it honours the eleven contracts and passes the Conformance Test Suite (RFC-003) for its class. Every `INV-*` invariant in this set is an assertable test.

## Honest open debts

Four subsystems are specified enough to *start* but need a dedicated deep-dive to *complete*: the per-language indexer analyzers (RFC-301), semantic-merge conflict UX + codemods (RFC-801), sandbox economics (RFC-402), and confidence calibration (RFC-404). See RFC-005 §5. None block the build order; each blocks completing its own subsystem.
