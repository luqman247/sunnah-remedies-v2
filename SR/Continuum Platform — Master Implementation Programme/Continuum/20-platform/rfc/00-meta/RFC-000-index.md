# Continuum — Technical Specification v1.0

## RFC-000: Specification Master Index & Conventions

**Status:** Approved for implementation
**Version:** 1.0.0
**Class:** Meta / Normative
**Supersedes:** Continuum Platform Architecture (design doc) — this set is the implementable descent from it.

---

## 1. What this document set is

This is the complete technical specification for **Continuum**, a runtime-first AI engineering platform. It is written to the standard of an RFC set: an independent engineering team must be able to implement any subsystem from its specification alone, given the contracts it depends on.

The design rationale (why these decisions) lives in the architecture document and is referenced by decision id (`D-01`…`D-29`). This set specifies **what to build and how it must behave**, not why.

## 2. How the set is organised

```
spec/
├── 00-meta/        RFC-000 (this), RFC-001 system overview, RFC-002 glossary, RFC-003 conformance
├── 10-contracts/   RFC-100..111  the eleven wire/data contracts (the constitution)
├── 20-runtime/     RFC-200..204  control plane, event log, projections, txn state machine, API
├── 30-context/     RFC-300..305  graph model, indexer/freshness, retrieval, knowledge, query lang
├── 40-verification/RFC-400..404  obligations, sandbox, evidence+signing, attestation, audit
├── 50-engines/     RFC-500 skeleton + RFC-501..511 the eleven engines
├── 60-sdk/         RFC-600..603  API binding model, CLI, auth/permissions, events/hooks
├── 70-plugins/     RFC-700..703  host, isolation, resolution, category contracts
├── 80-upgrade/     RFC-800..802  inheritance, three-way merge, schema evolution
└── 90-cross-cutting/ RFC-900..904 security, tenancy, observability, DR, performance SLOs
```

## 3. Normative language

Per RFC 2119: **MUST / MUST NOT / REQUIRED / SHALL** are absolute; **SHOULD / RECOMMENDED** admit justified exceptions; **MAY / OPTIONAL** are discretionary. Any deviation from a MUST is a conformance failure (RFC-003).

## 4. Specification conventions

- **Data shapes** are given as typed field tables (name · type · required · constraint · description). Wire encoding is JSON by default; binary transports (gRPC/protobuf) are generated from the same field definitions and MUST preserve field semantics and numbering.
- **Identifiers**: all entity ids are ULIDs (lexicographically sortable, time-ordered) unless stated. Content hashes are SHA-256, lowercase hex, prefixed `sha256:`.
- **Time**: RFC 3339 UTC, millisecond precision. Monotonic ordering within a partition is by event sequence number, never wall-clock.
- **Versioning**: every contract and subsystem is SemVer. Breaking = major. Wire contracts additive within a major (§ RFC-800).
- **Errors**: every API defines a typed error set; errors carry `code` (stable string), `retriable` (bool), `cause` chain. No untyped/string-only errors across a boundary.
- **State machines** are given as explicit `(state, event) → state'` transition tables with guards; any transition not listed is illegal and MUST be rejected.
- **Invariants** are numbered `INV-<subsystem>-nn` and MUST hold at every observable boundary; each subsystem lists the tests that assert them.

## 5. The eleven contracts (the stable spine)

Everything interoperates through these. An implementation is *Continuum-conformant* iff it honours them (RFC-003).

| RFC | Contract | Governs |
|---|---|---|
| 100 | Project | identity, version pins, inherited/owned classification |
| 101 | Context | graph model + query language + freshness semantics |
| 102 | Verification | obligations, evidence, signing, attestation |
| 103 | Prompt | prompt-as-contract (id, io, acceptance) |
| 104 | Plugin | per-category interface + capabilities + isolation |
| 105 | Engine | stateless worker skeleton |
| 106 | Decision | ADR node semantics |
| 107 | Knowledge | shareable inherited knowledge |
| 108 | Release | what constitutes a release |
| 109 | Migration | how upgrades/upcasts/merges declare + run |
| 110 | Telemetry | collection, aggregation, privacy |
| 111 | Event | the append-only event envelope (foundational) |

## 6. Dependency order for implementation

The set is a DAG. Recommended build order (each layer depends only on those above):

```
RFC-111 Event  ─┬─▶ RFC-100..110 contracts
                └─▶ RFC-200 Runtime core (log, projections)
                        └─▶ RFC-300 Context Graph
                                └─▶ RFC-400 Verification
                                        └─▶ RFC-204 Transaction machine (ties them)
                                                └─▶ RFC-500 Engines
                                                        └─▶ RFC-600 SDK / RFC-700 Plugins
                                                                └─▶ RFC-800 Upgrade
                                                                        └─▶ RFC-900 cross-cutting hardening
```

A minimally useful product (the "defensible first slice" from the architecture) is: **RFC-111 + 200 + 300 (read-only, Attach + index) + one verifier under 400** — an always-fresh, queryable, honestly-verified project brain, before write-back and generation exist.

## 7. Global invariants (hold across the whole platform)

- **INV-G-01** No project state transitions to a "committed/true" value except via a transaction whose verification attestation is valid (RFC-102, RFC-204).
- **INV-G-02** All authoritative mutation is an appended event (RFC-111); projections are derived and rebuildable.
- **INV-G-03** No query, event, or side-effect crosses a tenant boundary (RFC-901).
- **INV-G-04** Every node/edge/evidence bundle carries provenance (actor identity + model/version + cause) (RFC-101, RFC-102).
- **INV-G-05** No content originating outside an authenticated actor is ever treated as instructions (prompt-injection defence) (RFC-901).
- **INV-G-06** Contracts evolve additively within a major version; consumers pinned to a major never break (RFC-800).

## 8. Reading order for reviewers

Read RFC-001 (system overview) then RFC-111 and RFC-101 (the two most load-bearing contracts). Those three give the mental model; the rest is detail.
