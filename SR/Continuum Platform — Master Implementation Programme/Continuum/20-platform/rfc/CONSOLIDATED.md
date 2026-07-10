<!-- CONSOLIDATED TECHNICAL SPECIFICATION — generated from the structured RFC set -->

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
-e 

---


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
-e 

---


# RFC-001: System Overview

**Status:** Approved · **Version:** 1.0.0 · **Class:** Informative

## 1. One-paragraph model

Continuum is a **control plane** that owns the authoritative state of software projects. Its truth is an append-only **event log**; its fast-read state is a materialised **Context Graph**. Every change is a **transaction** that commits only when an out-of-process **Verification Runtime** produces signed evidence satisfying a versioned contract. Stateless **engines** propose changes and project views; everything volatile (AI models, CMSs, clouds, verifiers) is a sandboxed **plugin** over versioned **contracts**. Projects **inherit** shared knowledge and contracts by version and **upgrade** through reversible, semantically-merged transactions.

## 2. Component map

```
        ┌──────────── SDK bindings (RFC-600) ───────────┐
        │   CLI      IDE/local     REST      gRPC/stream  │
        └───────────────────┬────────────────────────────┘
                            │  single contract-first API (RFC-204/600)
   ┌────────────────────────▼─────────────────────────────────────┐
   │                     RUNTIME control plane                      │
   │                                                                │
   │  Event Log (RFC-200) ──derives──▶ Projections/Context (RFC-300)│
   │        ▲                                   │                   │
   │        │ append                            │ hydrate/query     │
   │  Transaction State Machine (RFC-204) ◀─────┘                   │
   │        │ obligations                                           │
   │        ▼                                                       │
   │  Verification Runtime (RFC-400) ── signed evidence ──▶ commit  │
   │                                                                │
   │  AuthZ/Tenancy (RFC-901)   ·   Plugin Host (RFC-700)           │
   └───────────────────────────────────────────────────────────────┘
        │ propose (never commit)            │ sandboxed calls
   ┌────▼───────────────────────┐    ┌──────▼───────────────────────┐
   │ Engines (RFC-500..511)     │    │ Plugins (RFC-700..703)        │
   │ stateless workers          │    │ providers/targets/verifiers   │
   └────────────────────────────┘    └───────────────────────────────┘
```

## 3. The canonical request path (an agent doing work)

1. Agent authenticates (RFC-602), receives capability-scoped session.
2. Agent calls `context.hydrate(task, anchors, budget)` (RFC-303) → **Context View** (constraints + history + freshness).
3. Agent produces a proposed change; calls `txn.propose(...)` (RFC-204) → **transaction opened** in a workspace.
4. Runtime derives **obligations** (RFC-401) from change class + contract; dispatches to **Verification** (RFC-400).
5. Verifiers run in **sandboxes** (RFC-402), emit **evidence** (RFC-403), Runtime **attests** (RFC-404).
6. On valid signed attestation → **commit**: append events (RFC-111), update graph (RFC-300), write-back delta (RFC-304).
7. Telemetry (RFC-510) records outcome; next hydration sees a smarter graph.

Every future agent, model, or tool follows this exact path.

## 4. What is authoritative vs derived vs external

| Class | Examples | Rebuildable? |
|---|---|---|
| **Authoritative** | event log, signed evidence blobs, snapshots | No — backed up; the floor of truth |
| **Derived** | Context Graph, indexes, doc views, changelogs | Yes — from the log |
| **External** | code in the repo, running deployments, model outputs | Owned by repo/plugins; modelled, not stored |

---

# RFC-002: Glossary (Normative Definitions)

Terms are normative: implementations MUST use them with these meanings.

- **Actor** — an authenticated human or agent; carries identity + (for agents) model+version.
- **Attestation** — a signed pass/fail+confidence verdict over evidence against obligations.
- **Authority** — one of the three stateful owners of truth: Context, Verification, Execution.
- **Budget** — token/size limit on a Context View.
- **Capability** — a granted permission (scope of read / class of propose / approve-irreversible).
- **Context View** — the composed, budget-bounded result of a hydration.
- **Contract** — a versioned, machine-readable interface spec (RFC-100..111).
- **Decision (ADR)** — an immutable recorded architectural choice node.
- **Engine** — a stateless worker that proposes transactions and projects views.
- **Event** — an immutable, append-only record of a state change (RFC-111).
- **Evidence** — a content-addressed, signed verification artifact.
- **Freshness** — the currency of a node relative to its pinned source hash.
- **Hydration** — composing a Context View for a task.
- **Inherited / Owned** — an artifact taken by-reference from upstream vs. owned/overridden by the project.
- **KnowledgeNode** — a shareable, versioned, inherited pattern/exemplar.
- **Obligation** — a required verification for a change class.
- **Plugin** — sandboxed external capability behind a category contract.
- **Projection** — a derived read model rebuilt from the log.
- **Snapshot** — a named immutable graph version.
- **Transaction** — a proposed set of mutations plus its verification obligations.
- **Tenant** — an isolation boundary (typically a company/org).
- **Write-back** — the post-verification delta an actor commits to the graph.

---

# RFC-003: Conformance

**Status:** Approved · **Version:** 1.0.0 · **Class:** Normative

## 1. Conformance classes

- **Core-conformant Runtime:** implements RFC-111, 100–110, 200–204, 300–305, 400–404, 800–802, and enforces all global invariants (RFC-000 §7).
- **Conformant Engine:** implements RFC-105 and its specific RFC-50x; owns no authoritative state.
- **Conformant Plugin:** implements RFC-104 + its category contract; passes isolation tests (RFC-701).
- **Conformant Client:** speaks only the RFC-600 API; holds no privileged path.

## 2. Conformance test suite (CTS)

The platform ships an executable CTS. A component is conformant iff it passes the CTS subset for its class. The CTS asserts every `INV-*` invariant and every state-machine transition table. Vendors/plugins MUST publish CTS results.

## 3. Versioned conformance

Conformance is stated against a spec major version, e.g. "Core-conformant, Continuum 1.x". A component MUST declare its supported contract version ranges (RFC-800). The Runtime MUST refuse to load a component outside its supported ranges.

## 4. Non-conformance handling

Loading a non-conformant plugin/engine MUST fail closed (reject, do not degrade silently). A Runtime that cannot satisfy a MUST at runtime MUST halt the affected transaction, never commit partial truth.
-e 

---


# RFC-005: Traceability & Coverage Matrix

**Status:** Approved · **Version:** 1.0.0 · **Class:** Normative (completeness proof)

## 1. Purpose

Proves every architectural decision (D-01..D-29) descends into an implementable RFC, and every RFC traces to a decision. No decision is left un-specified; no RFC is unmotivated.

## 2. Decision → RFC coverage

| Decision | Specified by |
|---|---|
| D-01 Runtime is a control plane | RFC-200, 203, 204 |
| D-02 Truth in, side-effects out | RFC-001 §4, 204, 505/507 |
| D-03 Event-sourced + projections | RFC-111, 200, 201 |
| D-04 Verified transaction per mutation | RFC-204, 102, 400 |
| D-05 Engines/clients via events/API only | RFC-105, 500, INV-ENG-01 |
| D-06 Model of code, not code | RFC-101 §5, 301 |
| D-07 Property graph | RFC-101, 300 |
| D-08 Graph-first retrieval | RFC-302, 303 |
| D-09 Freshness by source-pinning | RFC-301 (critical), 101 §6 |
| D-10 Context composed per task | RFC-303 |
| D-11 Two-tier inherited/owned knowledge | RFC-107, 304 |
| D-12 Hierarchical compression | RFC-101 summaries, 303 |
| D-13 Out-of-process verification | RFC-400, 402 |
| D-14 Signed, content-addressed evidence | RFC-403, 102 |
| D-15 Ephemeral sandboxes | RFC-402 |
| D-16 Irreversible ⇒ human approval | RFC-404, 401, 602 |
| D-17 Confidence scoring | RFC-404, 102 |
| D-18 Stateless engines | RFC-500, 105 |
| D-19 Deterministic generation | RFC-501, 100 §5 |
| D-20 Telemetry+Knowledge loop | RFC-510, 511, 110, 107 |
| D-21 One contract-first API | RFC-600, 601 |
| D-22 Everything volatile is a plugin | RFC-700, 703, 800 |
| D-23 Sandboxed least-privilege plugins | RFC-701 |
| D-24 Hot-swap plugins | RFC-702 |
| D-25 Inherited/owned + three-way merge | RFC-801, 100 §3 |
| D-26 Additive evolution + upcasters | RFC-800, 111 §6 |
| D-27 Contracts are the stable core | RFC-100..111, 800 |
| D-28 contracts/ most protected | RFC-000 §5, repo layout |
| D-29 Brownfield Attach first-class | RFC-1101, 301 §5 |

**Every decision is covered.** No orphans.

## 3. Global invariant → enforcing RFC

| Invariant | Enforced in |
|---|---|
| INV-G-01 no commit without attestation | RFC-204 (INV-TXN-01), 404 |
| INV-G-02 all mutation is an event | RFC-111, 200 |
| INV-G-03 tenant isolation | RFC-901, 202, 111 |
| INV-G-04 provenance everywhere | RFC-101, 102, 602 |
| INV-G-05 injected content ≠ instructions | RFC-101 §7, 900 |
| INV-G-06 additive contract evolution | RFC-800 |

## 4. Subsystem completeness checklist

| Subsystem | Data model | API | State machine | Invariants | Failure modes | Test criteria |
|---|:--:|:--:|:--:|:--:|:--:|:--:|
| Event/Log (111,200) | ✔ | ✔ | — | ✔ | ✔ | ✔ |
| Projections (201) | ✔ | ✔ | — | ✔ | ✔ | ✔ |
| Transaction (204) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Context Graph (101,300) | ✔ | ✔ | ✔(freshness) | ✔ | ✔ | ✔ |
| Indexer (301) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Retrieval (303) | ✔ | ✔ | — | ✔ | ✔ | ✔ |
| Verification (400-405) | ✔ | ✔ | ✔(txn) | ✔ | ✔ | ✔ |
| Engines (500-511) | ✔ | ✔ | ✔(shared) | ✔ | ✔ | ✔ |
| SDK (600-603) | ✔ | ✔ | — | ✔ | ✔ | ✔ |
| Plugins (700-703) | ✔ | ✔ | ✔(lifecycle) | ✔ | ✔ | ✔ |
| Upgrade (800-802) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| Lifecycle (1101) | ✔ | ✔ | ✔ | ✔ | — | ✔ |
| Cross-cutting (900-904) | — | — | — | ✔ | ✔ | ✔ |

Every implementable subsystem carries: a data model, an interface, invariants, failure modes, and test criteria — the RFC-000 §4 completeness bar.

## 5. Open specification debts (honest)

These are specified enough to *begin*, but each warrants a dedicated deep-dive before its own implementation sprint:

1. **RFC-301 Indexer** — analyzer coverage strategy per language, identity-stability heuristics, and the reconciliation scan cadence are specified in shape; the per-language analyzer contracts need individual specs (one per language plugin).
2. **RFC-801 semantic merge** — the six merge cases are defined; the *conflict-resolution UX* and the codemod authoring format need their own spec.
3. **RFC-402 sandbox economics** — isolation classes and scaling are defined; capacity planning and cost-attribution (who pays for verification compute) intersect the commercial model and need a business+infra spec.
4. **RFC-404 confidence calibration** — the aggregation policy is defined; the *calibration methodology* (how each verifier's confidence is made trustworthy) needs a statistical spec.

None block starting the dependency-ordered build (RFC-000 §6); each blocks *completing* its subsystem.
-e 

---


# RFC-111: Event Contract

**Status:** Approved · **Version:** 1.0.0 · **Class:** Normative (foundational) · **Implements:** D-03, D-05
**Depended on by:** everything.

## 1. Purpose

Defines the append-only event envelope that is the sole authoritative write mechanism of the platform (INV-G-02). All state changes, everywhere, are events conforming to this contract.

## 2. Event envelope

| Field | Type | Req | Constraint | Description |
|---|---|---|---|---|
| `event_id` | ULID | ✔ | unique, time-ordered | Global identity |
| `seq` | uint64 | ✔ | monotonic **per partition** | Ordering authority; assigned by log on append |
| `partition` | string | ✔ | `tenant/{tid}/project/{pid}` | Isolation + ordering scope |
| `type` | string | ✔ | `Domain.PastTenseVerb` e.g. `Txn.Committed` | Event type; namespaced |
| `schema_version` | semver | ✔ | | Version of this event type's payload |
| `time` | rfc3339 | ✔ | UTC ms | Wall-clock (informational; ordering is `seq`) |
| `actor` | ActorRef | ✔ | | Who caused it (RFC-002) |
| `cause` | EventId? | ✔? | null only for genesis | Causal parent — the event/command that led here |
| `correlation_id` | ULID | ✔ | | Groups all events of one transaction/operation |
| `payload` | object | ✔ | matches `type`+`schema_version` | Type-specific body |
| `payload_hash` | sha256 | ✔ | over canonical payload | Integrity |
| `tenant_sig` | sig? | ✖ | | Optional tenant-scoped signature for high-assurance mode |

`ActorRef` = `{ kind: "human"|"agent", id, model?, model_version?, session_id }`.

## 3. Invariants

- **INV-EVT-01** Events are immutable. No update or delete operation exists. Correction is a new compensating event.
- **INV-EVT-02** `seq` is gap-free and strictly increasing within a partition; the log assigns it atomically on append.
- **INV-EVT-03** Every non-genesis event has a resolvable `cause`; the causal graph is acyclic.
- **INV-EVT-04** `payload_hash` MUST validate; a mismatched event is rejected at append and quarantined.
- **INV-EVT-05** An event's `partition` MUST match the caller's authorised tenant (INV-G-03).

## 4. Append semantics

`append(partition, expected_seq, event) → {seq}`:
- **Optimistic concurrency:** `expected_seq` is the caller's last-seen `seq` for the partition. If the current head ≠ `expected_seq`, append fails with `CONFLICT` (retriable after re-read). This gives serialisable ordering without global locks.
- Append is atomic and durable before ack (fsync/quorum per deployment).
- Batch append is all-or-nothing within a partition.

## 5. Canonical encoding (for hashing/signing)

Payloads MUST be canonicalised (sorted keys, no insignificant whitespace, normalised numbers, UTF-8 NFC) before hashing/signing so hashes are stable across implementations. The canonicalisation algorithm is specified in Appendix 111-A (deterministic JSON canonical form).

## 6. Event type registry

Event types are registered in `contracts/event/registry` with `{ type, schema_version, payload_schema, upcasters[] }`. Unregistered types are rejected. New payload fields MUST be additive within a major (RFC-800); breaking changes bump the type's major and add an upcaster.

## 7. Partitioning & ordering rationale

Ordering is per-partition (per project) because cross-project ordering is never required (cross-project truth flows only through versioned KnowledgeNodes, RFC-107). This makes the log embarrassingly shardable (INV-G-03, RFC-901) with no global sequencer bottleneck.

## 8. Failure modes

| Mode | Behaviour |
|---|---|
| append conflict | `CONFLICT`, retriable; caller re-reads head |
| hash mismatch | `INTEGRITY`, non-retriable; event quarantined; alert |
| partition unauthorised | `FORBIDDEN`, non-retriable |
| storage unavailable | `UNAVAILABLE`, retriable with backoff |

## 9. Test criteria

CTS asserts: immutability (no mutate API), gap-free monotonic `seq` under concurrent appenders, conflict on stale `expected_seq`, hash validation, causal acyclicity, and cross-tenant append rejection.
-e 

---


# RFC-100: Project Contract

**Status:** Approved · **Version:** 1.0.0 · **Class:** Normative · **Implements:** D-25, D-27
**Depends on:** RFC-104 (plugin refs), RFC-107 (knowledge refs).

## 1. Purpose

The Project Contract is the lockfile and identity of a project. It fully determines the project's inheritance, reproducibility, and inherited-vs-owned classification (INV-PROJ-01). It is the single human-editable, schema-validated source of a project's configuration; the Runtime is authoritative on its meaning.

## 2. Document shape

| Field | Type | Req | Description |
|---|---|---|---|
| `continuum` | semver-range | ✔ | Runtime version range this project targets |
| `project` | ProjectIdentity | ✔ | id (ULID), name, slug, tenant |
| `contracts` | map<name,semver> | ✔ | pinned versions of each RFC-10x contract in use |
| `plugins` | list<PluginPin> | ✔ | `{ category, name, version-range, config-ref }` |
| `knowledge` | list<KnowledgePin> | ✔ | `{ pack, version }` inherited packs (RFC-107) |
| `inheritance` | map<path,mode> | ✔ | per inheritable element: `inherited`\|`overridden`\|`owned` (D-25) |
| `answers` | object | ✖ | interview answers (for reproducible generation, RFC-501) |
| `answers_hash` | sha256 | ✔ if answers | integrity of answers |
| `capabilities_default` | CapPolicy | ✔ | default capability grants for actors (RFC-602) |

`PluginPin.config-ref` points to a config node in the graph, never inline secrets (RFC-901).

## 3. Inheritance classification (the upgrade foundation)

Each inheritable element is exactly one of:
- **inherited** — taken by-reference at a pinned upstream version; upgrades advance it freely.
- **overridden** — project owns a variant *derived from* an upstream base; upgrades three-way-merge it (RFC-801).
- **owned** — project-authored, no upstream; upgrades never touch it except via required codemod (RFC-801 §6).

**INV-PROJ-01** Every inheritable element has exactly one mode. Unclassified elements MUST be rejected at load. This is what makes upgrade safety decidable.

## 4. Resolution

On `attach`/load, the Runtime resolves `contracts` + `plugins` + `knowledge` into a consistent set (RFC-702 resolution). Inconsistency (unsatisfiable version ranges, missing plugin) MUST fail closed with a resolution report; the project does not reach `Attached` until resolvable.

## 5. Reproducibility

Given identical `{contracts, plugins, knowledge, answers}` versions+hashes, deterministic generation (RFC-501) MUST produce byte-identical output (D-19). The contract is the reproducibility key.

## 6. Evolution

Additive fields within 1.x. A breaking contract change is a project migration (RFC-109) with a codemod that rewrites the Project Contract, applied as a verified transaction.

---

# RFC-101: Context Contract

**Status:** Approved · **Version:** 1.0.0 · **Class:** Normative · **Implements:** D-06..D-12
**Depends on:** RFC-111, RFC-106, RFC-107. **Depended on by:** RFC-300, all engines, all agents.

## 1. Purpose

Defines the Context Graph's logical model: node/edge types, versioning, freshness semantics, provenance, and the identity rules that make the graph queryable, diffable, and drift-detectable. The physical store is a plugin (RFC-704); this contract is store-independent.

## 2. Graph primitives

**Node**

| Field | Type | Req | Description |
|---|---|---|---|
| `node_id` | ULID | ✔ | stable across versions |
| `kind` | enum | ✔ | see §3 |
| `version` | uint | ✔ | monotonic per node_id |
| `attrs` | object | ✔ | kind-specific, schema-validated |
| `summaries` | map<level,text> | ✔ | multi-granularity (D-12): `oneline`\|`short`\|`full` |
| `source_ref` | SourceRef? | ✖ | for derived nodes: `{ repo_path, content_hash, lang, span }` |
| `freshness` | enum | ✔ | `fresh`\|`stale`\|`unknown` (D-09) |
| `provenance` | Provenance | ✔ | actor+cause+time+event_id (INV-G-04) |
| `acl` | AclRef | ✔ | node-level access (RFC-901) |

**Edge**

| Field | Type | Req | Description |
|---|---|---|---|
| `edge_id` | ULID | ✔ | |
| `type` | enum | ✔ | see §4 |
| `from` / `to` | NodeRef | ✔ | `node_id@version` or `node_id@latest` |
| `attrs` | object | ✔ | `{ confidence?, source_hash?, since }` |
| `version` / `provenance` / `freshness` | | ✔ | as Node |

**INV-CTX-01** Nodes and edges are immutable-versioned: a change creates a new `version` linked to the causing event; prior versions are retained (time-travel, D-09/3.18).
**INV-CTX-02** Every derived node/edge carries a `source_ref`; its `freshness` is a pure function of whether `source_ref.content_hash` matches current repo state (RFC-301).
**INV-CTX-03** Every node/edge carries provenance resolving to an event in the log.

## 3. Node kinds (v1.0 registry)

`Project · Module · Boundary · Symbol · Convention · Decision · Requirement · WorkItem · Evidence · Actor · Action · KnowledgeNode · Artifact · Config`.

Each kind has a registered `attrs` schema in `contracts/context/kinds/`. Plugins MAY register new kinds (additive; RFC-800). Removing/renaming a kind is breaking.

## 4. Edge types (v1.0 registry)

`DEPENDS_ON · CONTAINS · IMPLEMENTS · CONSTRAINS · CAUSED_BY · PRODUCED · ATTESTS · VIOLATES · INHERITS · SUPERSEDES · REFERENCES · OWNS`.

Semantics (selected, normative):
- `Symbol VIOLATES Convention|Decision` — a detected drift; MUST be produced by the Architecture Engine (RFC-503) when code contradicts a recorded rule. This edge is what makes the graph *actionable*.
- `Decision CONSTRAINS X` — X may not change in ways contradicting the decision without a `SUPERSEDES`.
- `Evidence ATTESTS WorkItem` — links proof to work (RFC-102).
- `Project INHERITS KnowledgeNode` — versioned inheritance (RFC-107).

## 5. Identity & addressing

A node is addressed `node_id[@version]`; omitting version means `@latest`. Cross-references in `attrs` MUST use NodeRefs, never inline copies (prevents drift). External code is referenced by `source_ref`, never embedded (D-06).

## 6. Freshness state machine

```
(fresh)   --source hash changes-->        (stale)
(stale)   --reindexed, hash matches-->     (fresh)
(unknown) --indexed-->                     (fresh|stale)
(*)       --source deleted-->              (stale, tombstone candidate)
```
`unknown` is the initial state before first index. Queries MAY require `fresh` (RFC-305); a query requiring freshness over a `stale` anchor MUST either block on reindex (bounded) or return with an explicit staleness warning per query policy.

## 7. Provenance & trust classification

Every node carries a `trust` tag in provenance: `authored` (by an authenticated actor) vs `ingested` (from external/inherited content). **INV-CTX-04 / INV-G-05:** `ingested` content MUST NOT be interpreted as instructions by any consumer; only `authored` actor input carries instruction authority. This is the graph-level prompt-injection defence.

## 8. Versioning & evolution

Node/edge kinds and attrs schemas are additive within 1.x. The query language (RFC-305) is backward-compatible within a major. Breaking changes migrate via RFC-109.

## 9. Test criteria

CTS asserts: immutable-versioning, freshness-as-pure-function of source hash, provenance resolvability, `ingested`-never-instruction enforcement at the retrieval boundary, and NodeRef-not-copy for cross-references.
-e 

---


# RFC-102: Verification Contract

**Status:** Approved · **Version:** 1.0.0 · **Class:** Normative · **Implements:** D-13..D-17
**Depended on by:** RFC-204, RFC-400, RFC-502.

## 1. Purpose

Defines obligations, evidence, signing, and attestation formats — the machine-checkable trust boundary. No project state commits without an attestation conforming to this contract (INV-G-01).

## 2. Obligation

| Field | Type | Req | Description |
|---|---|---|---|
| `obligation_id` | ULID | ✔ | |
| `change_class` | enum | ✔ | `docs`\|`code`\|`schema`\|`api`\|`deploy`\|`config`\|`dependency`\|... |
| `required_evidence` | list<EvidenceReq> | ✔ | each: `{ type, verifier_category, threshold, blocking }` |
| `human_approval` | ApprovalReq? | ✖ | required for irreversible classes (D-16) |
| `confidence_threshold` | float 0..1 | ✔ | min aggregate confidence to pass (D-17) |
| `contract_version` | semver | ✔ | which Verification Contract version derived this |

**INV-VER-01** Obligations are derived deterministically from `(change_class, project conventions, lifecycle gate, contract_version)` — the same inputs MUST yield the same obligations.

## 3. Evidence

| Field | Type | Req | Description |
|---|---|---|---|
| `evidence_id` | ULID | ✔ | |
| `type` | enum | ✔ | `build`\|`typecheck`\|`test`\|`lint`\|`visual`\|`deploy_health`\|`security`\|`diff`\|`ci` |
| `verifier` | VerifierRef | ✔ | plugin identity+version that produced it |
| `workspace_hash` | sha256 | ✔ | exact state verified (tamper-binding) |
| `result` | enum | ✔ | `pass`\|`fail`\|`inconclusive` |
| `confidence` | float 0..1 | ✔ | verifier's calibrated confidence |
| `artifacts` | list<BlobRef> | ✔ | content-addressed logs/screenshots/reports |
| `produced_at` | rfc3339 | ✔ | |
| `signature` | Sig | ✔ | over canonical evidence by verifier key (D-14) |

**INV-VER-02** Evidence is content-addressed and immutable; `evidence_id`'s canonical hash MUST match its content.
**INV-VER-03** `signature` MUST verify against a key held by the Verification Runtime, not accessible to the proposing actor (tamper resistance).

## 4. Attestation

| Field | Type | Req | Description |
|---|---|---|---|
| `attestation_id` | ULID | ✔ | |
| `transaction_id` | ULID | ✔ | what it gates |
| `obligation_id` | ULID | ✔ | what it satisfies |
| `verdict` | enum | ✔ | `pass`\|`fail` |
| `aggregate_confidence` | float | ✔ | combined per policy |
| `evidence` | list<EvidenceRef> | ✔ | all bundles considered |
| `approvals` | list<ApprovalRef> | ✖ | human approvals if required |
| `signature` | Sig | ✔ | by the attestation authority |

**INV-VER-04** `verdict=pass` REQUIRES: every `blocking` evidence req satisfied with `result=pass`, `aggregate_confidence ≥ threshold`, and all required human approvals present. Otherwise `fail`.
**INV-VER-05** A transaction MUST NOT commit without a `pass` attestation whose `workspace_hash`es match the committed workspace.

## 5. Evolution

Evidence types and verifier categories are additive. Thresholds may only *tighten* via a new contract version; a project inherits Core-mandated minimums and MAY tighten but not loosen below them.

---

# RFC-103: Prompt Contract

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-19 (provenance), Prompt Engine RFC-508.

## 1. Purpose

A prompt is a **versioned contract with declared IO and acceptance**, not prose. Enables retrieval, composition, provenance, and compatibility gating.

| Field | Type | Req | Description |
|---|---|---|---|
| `prompt_id` | string | ✔ | namespaced e.g. `build.feature` |
| `version` | semver | ✔ | |
| `role` | enum | ✔ | `architect`\|`implementer`\|`reviewer`\|`planner`\|... |
| `inputs` | list<InputSpec> | ✔ | each `{ name, source: context-query\|literal, required }` |
| `outputs` | list<OutputSpec> | ✔ | expected produced node kinds / change class |
| `acceptance` | list<Criterion> | ✔ | machine-referatable acceptance criteria |
| `requires` | Requires | ✔ | `{ runtime, contracts, knowledge }` version ranges |
| `body_ref` | BlobRef | ✔ | the template body (rendered with injected context) |

**INV-PRM-01** Every Action produced under a prompt MUST record `(prompt_id, version)` in provenance. **INV-PRM-02** A prompt whose `requires` is unsatisfied MUST NOT be resolved (fail closed).

Prompts are packaged and versioned as plugins (RFC-704 knowledge/prompt packs).

---

# RFC-104: Plugin Contract

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-22, D-23, D-24. **See:** RFC-700..703.

## 1. Purpose

The base contract every plugin implements, plus the per-category interface it also implements.

| Field | Type | Req | Description |
|---|---|---|---|
| `name` / `version` | string/semver | ✔ | plugin identity |
| `category` | enum | ✔ | `ai-provider`\|`cms`\|`payments`\|`auth`\|`deploy`\|`verifier`\|`monitoring`\|`compliance`\|`search`\|`graph-store`\|`knowledge-pack`\|`template` |
| `capabilities` | list<Capability> | ✔ | declared least-privilege needs (network allowlist, context scopes, side-effect classes) |
| `isolation_class` | enum | ✔ | `in-proc-wasm`\|`process`\|`container` (risk-based) |
| `requires` | Requires | ✔ | runtime + contract + plugin-dep ranges |
| `entrypoints` | map | ✔ | category-contract method bindings |
| `signature` | Sig | ✔ | publisher signature (RFC-701) |

**INV-PLG-01** A plugin MUST NOT exercise any capability it did not declare; violations are blocked and audited. **INV-PLG-02** A plugin holds no authoritative state; all state via Runtime API (RFC-702). **INV-PLG-03** Category-contract conformance is validated before activation; failure = reject.

Category contracts (each a sub-spec): define the exact methods, e.g. `ai-provider: { complete, embed, stream }`; `verifier: { verify(workspace, req) → evidence }`; `deploy: { deploy(artifact, env) → handle, health(handle) }`. Enumerated in RFC-703.

---

# RFC-105: Engine Contract

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-18. **See:** RFC-500.

Defines the stateless-worker skeleton all engines implement.

| Method | Description |
|---|---|
| `invoke(request) → job_id` | start a unit of work (async) |
| `status(job_id) → JobStatus` | progress/result/error |
| `cancel(job_id)` | idempotent cancel |

**INV-ENG-01** Engines read state only via Context API (RFC-303), mutate only via Transaction API (RFC-204) — never storage directly (INV-G-02). **INV-ENG-02** Engines hold no authoritative state; a restarted engine reconstructs from events. **INV-ENG-03** `invoke` is idempotent keyed by `(engine, correlation_id)` — safe to retry. Engines emit `Engine.*` events (Started/Progress/Proposed/Completed/Failed).

---

# RFC-106: Decision Contract

**Status:** Approved · **Version:** 1.0.0. A Decision (ADR) node's normative shape.

| Field | Type | Req | Description |
|---|---|---|---|
| `title` / `status` | string/enum | ✔ | `proposed`\|`accepted`\|`superseded` |
| `context` / `problem` | text | ✔ | |
| `options` | list<Option> | ✔ | each with trade-offs |
| `decision` / `consequences` | text | ✔ | |
| `constrains` | list<NodeRef> | ✔ | edges to CONSTRAINED nodes |
| `supersedes` | DecisionRef? | ✖ | |

**INV-DEC-01** Decisions are immutable; change = new decision with `SUPERSEDES`. **INV-DEC-02** A change that contradicts an `accepted` decision without superseding it MUST raise a `VIOLATES` edge (drift) and MAY block per gate policy.

---

# RFC-107: Knowledge Contract

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-11, D-20.

| Field | Type | Req | Description |
|---|---|---|---|
| `pack` / `version` | string/semver | ✔ | inheritance unit |
| `nodes` | list<KnowledgeNode> | ✔ | patterns/exemplars/conventions |
| `applicability` | Selector | ✔ | which projects/archetypes it applies to |
| `precedence` | int | ✔ | override ordering vs project-local |

**INV-KNW-01** Inherited knowledge is read-only and referenced by version (never copied). **INV-KNW-02** Project-local nodes override inherited by `precedence`, recorded explicitly. Upgrades flow new pack versions via RFC-800.

---

# RFC-108: Release Contract

**Status:** Approved · **Version:** 1.0.0.

| Field | Type | Req | Description |
|---|---|---|---|
| `version` | semver | ✔ | release version per project policy |
| `required_verifications` | list<change_class> | ✔ | gate set (RFC-102) |
| `changelog_source` | enum | ✔ | derived from event log range |
| `artifacts` | list<ArtifactRef> | ✔ | |
| `rollback_ref` | SnapshotRef | ✔ | pre-release snapshot (RFC-802) |

**INV-REL-01** No release event without a passing release-gate attestation. **INV-REL-02** Every release records a rollback reference.

---

# RFC-109: Migration Contract

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-25, D-26. **See:** RFC-800.

| Field | Type | Req | Description |
|---|---|---|---|
| `migration_id` / `version` | ULID/semver | ✔ | |
| `from` / `to` | version | ✔ | contract/knowledge/plugin range being migrated |
| `steps` | list<Step> | ✔ | `upcast`\|`merge`\|`codemod` with declared reversibility |
| `snapshot_before` | bool | ✔ (MUST true) | |
| `verification` | ObligationRef | ✔ | full gate re-run post-apply |

**INV-MIG-01** Every migration is a verified, reversible transaction (snapshot → apply → verify → commit|rollback). **INV-MIG-02** A migration that fails verification rolls back to snapshot; the project is never left partial. **INV-MIG-03** Owned work is preserved; only inherited/overridden elements are touched (RFC-801).

---

# RFC-110: Telemetry Contract

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-20.

| Field | Type | Req | Description |
|---|---|---|---|
| `signal` | enum | ✔ | `gate_outcome`\|`prompt_rework`\|`default_override`\|`agent_stuck`\|... |
| `aggregation` | enum | ✔ | how it's rolled up before leaving tenant |
| `anonymisation` | enum | ✔ | tenant-anonymised MUST for cross-tenant |
| `opt_in` | bool | ✔ (default false) | |

**INV-TEL-01** Telemetry is opt-in; default collects nothing cross-tenant. **INV-TEL-02** No code, secrets, or PII leave a tenant; only aggregated, anonymised signals (INV-G-03). **INV-TEL-03** Privacy rules may only tighten across versions.
-e 

---


# RFC-200: Event Log & Storage

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-03 · **Depends:** RFC-111.

## 1. Responsibilities

Durable, ordered, partitioned append-only storage of events; the only authoritative write path. Serves reads for projection building and replay.

## 2. Interface

- `append(partition, expected_seq, events[]) → {head_seq}` — atomic, optimistic-concurrency (RFC-111 §4).
- `read(partition, from_seq, limit) → events[]` — ordered replay.
- `subscribe(partition|tenant, from_seq) → stream` — live tail for projections/clients.
- `snapshot_marker(partition, seq)` — record a snapshot boundary (RFC-802).

## 3. Storage model

- **Local mode:** embedded ordered log (e.g. an embedded LSM/SQLite-class store) — single-tenant daemon.
- **Cloud mode:** partitioned durable log (per-tenant/project partition) with quorum durability; object storage for evidence blobs.
- The *interface* is identical across modes; the store is a plugin (RFC-704 `graph-store`/`log-store` categories). Engines/clients never see the difference.

## 4. Durability & consistency

- Append is durable before ack (INV-EVT: fsync or quorum).
- Within a partition: **serialisable** via `expected_seq`.
- Across partitions: **no ordering guarantee** (none required, RFC-111 §7).
- **INV-LOG-01** The log is the sole source of truth; all else is rebuildable from it.

## 5. Retention & compaction

Events are retained indefinitely by default (audit). Compaction is *snapshot-based*: a snapshot (RFC-802) lets old events be archived to cold storage while the snapshot serves as the replay floor. Compaction MUST NOT lose the ability to reproduce any named snapshot or satisfy the retention/audit policy.

## 6. Failure & recovery

Corrupted projection → rebuild from log. Lost projection store → rebuild. Lost log → restore from backup (the log is the only backed-up-critical asset). Partial append → atomic, so either fully applied or not.

---

# RFC-201: Projections (Read Models)

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-03, CQRS.

## 1. Responsibilities

Derive fast-read state (Context Graph RFC-300, and specialised read models: changelog, health, audit views) by subscribing to the log. Projections are disposable and rebuildable.

## 2. Model

Each projection = `{ name, version, subscribed_types[], apply(event, state)→state, checkpoint_seq }`.
- Projections consume events in `seq` order per partition.
- `checkpoint_seq` records progress; on restart, resume from checkpoint.
- **INV-PRJ-01** Projections are pure functions of the event stream: rebuilding from `seq=0` MUST yield identical state (deterministic replay). This forbids wall-clock or external reads inside `apply`.

## 3. Consistency

Projections are **eventually consistent** with the log (bounded lag). Reads expose a `watermark` (last applied `seq`) so a client can require read-your-writes by waiting for `watermark ≥ its last append seq`. The Context API (RFC-303) exposes this.

## 4. Rebuild & versioning

A projection schema change bumps its version and triggers a background rebuild into a new store, atomically swapped when caught up (zero-downtime). Rebuild cost is bounded by snapshotting (RFC-802).

---

# RFC-202: Access Control & Tenancy (Runtime side)

**Status:** Approved · **Version:** 1.0.0 · **Implements:** INV-G-03. **See:** RFC-901.

## 1. Model

- Every request carries an **actor session** with a **capability set** (RFC-602).
- Every operation declares required capabilities + target partition.
- The Runtime enforces: `authorised = caps ⊇ required ∧ session.tenant == target.tenant`.
- **INV-AC-01** No operation executes without capability + tenant match; failure = `FORBIDDEN`, audited.
- Capabilities are **least-privilege**; irreversible-action capabilities are human-held by default (D-16).

## 2. Node-level ACL

Sensitive nodes (secrets, restricted decisions) carry `acl` (RFC-101). Hydration filters nodes the actor's capabilities don't permit — an agent receives capability-scoped context (INV-CTX ACL).

---

# RFC-203: Runtime Lifecycle & Deployment Modes

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-01.

## 1. Modes

- **Embedded daemon** (local, single-tenant): the full control plane in-process/on-machine; embedded log+graph; local IPC API (RFC-601).
- **Hosted control plane** (multi-tenant): partitioned durable storage; REST+gRPC API; sandbox pool for verification (RFC-402).

Same code, same contracts, deployment-mode config only (D-01 risk mitigation). Migration local→cloud is an export/import of the event log (the only critical asset).

## 2. Runtime lifecycle

`Boot → LoadContracts → ResolvePlugins → StartProjections(catch-up) → Ready → Serving → Draining → Stopped`. Not `Ready` until projections are caught up to head and plugins resolved. Draining finishes in-flight transactions or rolls them back cleanly.

---

# RFC-204: Transaction State Machine

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-04 · **Depends:** RFC-102, RFC-400.
The single most important behavioural spec: how change is admitted.

## 1. Transaction shape

`{ txn_id, correlation_id, actor, change_class, workspace_ref, proposed_delta, obligations[], attestations[], state }`.

## 2. States & transitions

| State | Meaning |
|---|---|
| `Proposed` | actor submitted a change; workspace created |
| `Obligated` | obligations derived (RFC-401) |
| `Verifying` | verifiers dispatched to sandboxes |
| `Attested` | signed attestation received |
| `Committed` | events appended, graph updated (terminal, success) |
| `RolledBack` | reverted; failure recorded (terminal) |
| `Approving` | awaiting required human approval |

Transition table (guards in brackets):

```
Proposed   --derive-->                 Obligated
Obligated  --dispatch-->               Verifying
Verifying  --attestation.pass [no human req]--> Attested
Verifying  --attestation.pass [human req]-->    Approving
Verifying  --attestation.fail-->               RolledBack
Approving  --approved-->                        Attested
Approving  --rejected|timeout-->               RolledBack
Attested   --commit [workspace_hash matches]--> Committed
Attested   --commit [hash mismatch]-->          RolledBack   (guard failure = tamper/stale)
any        --error|cancel-->                    RolledBack
```

**INV-TXN-01** No path reaches `Committed` except through a `pass` attestation whose evidence `workspace_hash` matches the workspace being committed (INV-G-01, INV-VER-05).
**INV-TXN-02** `Committed` and `RolledBack` are terminal; a transaction is single-use.
**INV-TXN-03** Commit is atomic: all events of the transaction append under one `correlation_id`, all-or-nothing.
**INV-TXN-04** Every terminal state emits an event (`Txn.Committed`/`Txn.RolledBack`) with the deciding attestation/failure referenced.

## 3. Commit protocol

1. Validate attestation signature + `workspace_hash` match (guard).
2. Append transaction's events atomically (`Txn.Committed`, plus domain events + write-back deltas) with optimistic concurrency on each affected partition.
3. On append `CONFLICT` (concurrent commit moved head): re-validate the delta against new head; if still valid, retry; if the delta now conflicts semantically, roll back with `CONFLICT` surfaced to actor.
4. Projections apply asynchronously; the txn API returns `Committed` with the `watermark` needed for read-your-writes.

## 4. Concurrency & isolation

Transactions on the same partition serialise at commit via `expected_seq`. Concurrent transactions on disjoint nodes proceed in parallel and both commit if their appends don't conflict. Conflicting concurrent commits: first wins, second re-validates or rolls back (optimistic, no locks).

## 5. Reconciliation (Kubernetes-style)

The Runtime holds `desired` (accepted plan/WorkItems) and `actual` (committed reality). A reconciliation loop surfaces divergence (planned-but-unbuilt, built-but-unverified) as findings (Quality Engine RFC-509), driving `actual → desired` via new transactions. This makes execution asynchronous and self-healing rather than a blocking RPC.

## 6. Failure modes & recovery

| Mode | Behaviour |
|---|---|
| verifier crash | obligation `inconclusive` → treated as fail (fail closed); retriable txn |
| sandbox timeout | fail; recorded; retriable |
| commit conflict | re-validate/retry or roll back with `CONFLICT` |
| runtime crash mid-commit | append is atomic → on restart, txn is either Committed (append landed) or not (safe to roll back); no partial truth |
| approval timeout | RolledBack |

## 7. Test criteria

CTS asserts INV-TXN-01..04 under: concurrent conflicting commits, injected tamper (mismatched workspace_hash → must roll back), verifier crash (fail closed), and crash-during-commit (recovery yields consistent terminal state).
-e 

---


# RFC-300: Context Graph Subsystem

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-06..D-12 · **Depends:** RFC-101, RFC-201.

## 1. Responsibilities

Materialise and serve the property graph (RFC-101) as a projection of the event log; own indexes, retrieval, freshness, knowledge inheritance, and the query language. It is a **derived** subsystem (rebuildable) except for its dependency on the log.

## 2. Composition

```
Context Graph
├── model store        (nodes/edges projection — RFC-201, physical store = plugin RFC-704)
├── indexer            (RFC-301 — source-pinning + freshness; the critical subsystem)
├── indexes            (structural / lexical / semantic — RFC-302)
├── retrieval          (RFC-303 — hydration, compression)
├── knowledge          (RFC-304 — inherited/owned two-tier)
└── query engine       (RFC-305 — the context query language)
```

## 3. Build & rebuild

The graph is built by applying context-relevant events (from write-backs, indexer output, engine proposals) via projection `apply` (RFC-201). Full rebuild from log MUST reproduce identical graph state (INV-PRJ-01). Rebuild is bounded by snapshots (RFC-802).

---

# RFC-301: Indexer & Freshness (CRITICAL SUBSYSTEM)

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-09 · **Risk:** highest in platform.

> This is the subsystem the whole thesis rests on: if it is slow or lossy, the graph lies with authority. It is specified in the most detail and carries its own SLOs.

## 1. Responsibilities

Keep derived nodes (Modules, Symbols, Boundaries, Conventions) accurate to the repository, and mark freshness precisely and reactively (INV-CTX-02). Serve both greenfield and **arbitrary brownfield** codebases (D-29).

## 2. Pipeline

```
repo change event / attach
        │
        ▼
[1] Change detection ── file-watch (local) | VCS hook/CI (cloud) | full scan (attach)
        │  emits: changed_paths[] with new content hashes
        ▼
[2] Language routing ── per-path language → language-analyzer plugin (RFC-704 `analyzer`)
        │
        ▼
[3] Extraction ── analyzer produces derived facts: symbols, imports/deps, module boundaries,
        │          detected conventions, with spans + source content hashes
        ▼
[4] Diff & reconcile ── compare new facts to existing nodes by stable identity (§4)
        │          → create/version/tombstone nodes+edges as events
        ▼
[5] Freshness update ── mark affected nodes fresh; mark dependents stale if their
        │          source hash no longer matches (transitive, bounded)
        ▼
[6] Re-project + reindex (RFC-302)
```

## 3. Freshness algorithm (normative)

- Each derived node stores `source_ref.content_hash`.
- On change detection, for each changed path: recompute hash; for every node whose `source_ref.repo_path` intersects the change, set `freshness=stale` and enqueue re-extraction.
- After re-extraction, if the node's new content hash matches, set `fresh`; if the source vanished, `tombstone candidate`.
- **INV-IDX-01** `freshness` is a *pure function* of (node.source_ref.content_hash == current repo hash for that span). It is never set by trust or heuristic. A stale node is *always* detectably stale.
- **INV-IDX-02** Freshness propagation is bounded: only nodes whose `source_ref` intersects a change are affected (no global re-mark), keeping incremental cost proportional to change size.

## 4. Stable identity across edits (the hard part)

Nodes must survive refactors (rename, move) without losing history. Identity resolution order:
1. **Explicit anchor** (a stable symbol id if the language/analyzer provides one).
2. **Structural fingerprint** (normalised signature + containing module path).
3. **Similarity match** (embedding/name similarity above threshold) → *proposed* identity, confirmed by verification or human, never silently.
- **INV-IDX-03** Identity resolution is deterministic given the same inputs; ambiguous matches produce a *proposed* re-link (confidence-scored), not a silent merge, preventing false history joins.

## 5. Brownfield attach

On `attach` to an existing repo: full scan → language routing → extraction → build initial graph with all nodes `fresh`. Attach MUST succeed (reach `Attached`, RFC-203) even with partial analyzer coverage: unanalyzed paths become coarse `Module` nodes with `freshness=unknown` and a coverage report. **INV-IDX-04** Attach never fails due to unknown languages; it degrades to coarser granularity with explicit coverage metrics.

## 6. Analyzer plugin contract

`analyze(path, content) → { symbols[], deps[], boundaries[], conventions[] }` with spans + hashes. Analyzers are plugins (RFC-704) per language/framework. New languages = new analyzers, no core change (D-22). Analyzer quality is measured by coverage % and identity-stability, reported to Quality Engine.

## 7. SLOs

| Metric | Target |
|---|---|
| Incremental index latency (single file change) | p95 < 2s to freshness-correct |
| Staleness window (change → dependents marked stale) | p99 < 1s |
| Attach throughput | ≥ X KLOC/min per worker (deployment-tuned) |
| False-fresh rate (stale served as fresh) | **0** (INV-IDX-01 makes it structurally impossible) |

**INV-IDX-05** The system may serve *stale-marked* data (with warning); it MUST NEVER serve stale data marked fresh. False-negatives on freshness are the one unacceptable failure.

## 8. Failure modes

| Mode | Behaviour |
|---|---|
| analyzer crash on a file | node → `unknown` freshness + error recorded; never silently `fresh` |
| watcher misses a change (local) | periodic reconciliation scan catches divergence; hash mismatch re-marks stale |
| huge change burst | queue with priority (on-path nodes first); freshness marked immediately, extraction catches up |

## 9. Test criteria

CTS asserts: no-false-fresh under adversarial edits, identity stability across rename/move, bounded propagation, attach on a repo with unknown languages, and reconciliation recovery after a missed watch event.

---

# RFC-302: Indexes

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-08.

Three indexes over the model, all rebuildable:
- **Structural:** adjacency/traversal index for typed-edge queries. Primary.
- **Lexical:** inverted full-text over node summaries+attrs.
- **Semantic:** vector index over node `summaries.short` embeddings (embedding via `ai-provider` plugin).

**INV-IDX2-01** Retrieval MUST start structural (hard constraints) and use semantic only to rank/pad (D-08); a retrieval that returns semantically-similar nodes while omitting graph-linked hard constraints is a conformance failure.

Indexes carry the model's `watermark`; a query requiring freshness checks index currency.

---

# RFC-303: Retrieval & Hydration

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-10, D-12.

## 1. Interface

`hydrate(request) → ContextView` where `request = { intent, anchors[], budget, freshness_policy, capabilities }`.

## 2. Algorithm (normative)

```
1. Resolve anchors (target nodes of the task).
2. Structural expansion: traverse CONSTRAINS, DEPENDS_ON, VIOLATES, IMPLEMENTS,
   SUPERSEDES from anchors → the mandatory constraint set (decisions, conventions,
   dependencies, prior actions here). These are ALWAYS included at full fidelity.
3. ACL filter: drop nodes the capabilities don't permit (RFC-202).
4. Freshness: per freshness_policy, either (a) require fresh (block on bounded reindex)
   or (b) include with staleness warnings.
5. Budget fill: include mandatory set first (full detail). If budget remains, add
   semantically-ranked relevant nodes as summaries (D-12 hierarchical), with expand pointers.
6. Compose ContextView: constraints + history + acceptance criteria + freshness map +
   citations (node_id@version) + watermark.
```

**INV-RET-01** The mandatory constraint set is never dropped for budget; if it alone exceeds budget, hydration returns it in full and flags budget-exceeded rather than silently truncating constraints.
**INV-RET-02** Every item in a ContextView cites its `node_id@version` and freshness (traceability).
**INV-RET-03** `ingested`-trust content (RFC-101 §7) is labelled as data, never presented as instruction.

## 3. Caching

Cache key = `(anchor-set, budget, freshness_policy, knowledge_version, watermark)`. Identical hydrations hit cache. Invalidated when watermark advances past a cached anchor's version. Target: warm hydration p95 < 50ms.

## 4. Write-back

`write_back(delta)` is only callable within a committed transaction (RFC-204). Delta = new/changed nodes+edges as events, provenance-stamped, verification-gated (unproven claims recorded `proposed`, promoted to `authored` on attestation).

---

# RFC-304: Knowledge Inheritance

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-11.

Two tiers: **inherited** (versioned KnowledgeNodes referenced from packs, read-only) and **owned** (project-local, writable). Retrieval merges both by `precedence` (RFC-107). Inherited nodes appear in hydration as constraints/patterns with their pack version cited. Upgrading a pack version (RFC-800) flows new/changed knowledge to the project through a verified migration. **INV-KNW-01/02** enforced at the retrieval boundary: inherited content is never mutated in place.

---

# RFC-305: Context Query Language (CQL)

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-15/3.15.

A declarative query over the graph. Grammar (abstract):

```
QUERY   := ANCHOR EXPAND* FILTER* FRESHNESS? BUDGET? PROJECT?
ANCHOR  := node ids | kind+attr match | lexical | semantic(intent)
EXPAND  := ALONG <edge-type> [depth n] [direction in|out|both]
FILTER  := WHERE attr op value | kind in (...) | trust = authored
FRESHNESS := REQUIRE fresh | ALLOW stale
BUDGET  := LIMIT tokens n  (hierarchical fill, D-12)
PROJECT := RETURN summaries(level) | full | ids
```

**INV-CQL-01** CQL is deterministic: same query + same graph version (watermark) = same result. **INV-CQL-02** CQL is backward-compatible within a major (RFC-800). Humans use CQL via CLI/IDE; agents via a tool binding; engines internally — one language, all surfaces.
-e 

---


# RFC-400: Verification Runtime Subsystem

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-13..D-17 · **Depends:** RFC-102, RFC-204.

## 1. Responsibilities

Independently prove or refute proposed changes, producing signed evidence and attestations that gate transaction commits. Runs **out-of-process** relative to the proposing actor (INV-G-01). The trust boundary of the entire platform.

## 2. Composition

```
Verification Runtime
├── obligation deriver   (RFC-401)
├── sandbox pool         (RFC-402 — isolated execution)
├── evidence store+signer(RFC-403 — content-address + sign)
├── attestation authority(RFC-404 — verdict + confidence + signature)
└── audit projection     (RFC-405/audit — immutable trail)
```

## 3. Flow (normative)

`Obligated → dispatch verifiers to sandboxes → collect evidence → sign → attest → return`. Called by the Transaction machine (RFC-204 §2). The Verification Runtime never mutates project state; it only produces attestations the Runtime acts on.

**INV-VRT-01** The Verification Runtime holds signing keys the proposing actor cannot access (D-14). **INV-VRT-02** Verifiers receive only the workspace diff + declared inputs — never the ability to write project state or reach the attestation signer.

---

# RFC-401: Obligation Derivation

**Status:** Approved · **Version:** 1.0.0.

## 1. Interface

`derive(transaction, project_conventions, lifecycle_gate, contract_version) → Obligation` (RFC-102 §2).

## 2. Rules

Obligations are computed by a deterministic rule set keyed on `change_class`:

| change_class | required (blocking) | additional | human approval |
|---|---|---|---|
| `docs` | — (doc views are projections; validated for link/ref integrity) | — | no |
| `code` | build, typecheck, lint, test | diff, security | no |
| `schema` | build, typecheck, test, **migration-safety** | diff | if data-affecting |
| `api` | build, test, **contract-compat** | diff, security | if breaking |
| `deploy` | deploy_health, smoke | security | **yes** (irreversible, D-16) |
| `dependency` | build, test, **security(CVE)** | — | if high blast-radius |
| `config` | schema-validate, dry-run | — | if security/permission-affecting |

**INV-OBL-01** Derivation is deterministic (INV-VER-01). **INV-OBL-02** A project MAY add obligations or tighten thresholds but MUST NOT drop Core-mandated blocking evidence below the contract minimum (RFC-102 §5).

## 3. Extensibility

New change classes and evidence requirements are additive via a new Verification Contract version; obligations reference the contract version that derived them for auditability.

---

# RFC-402: Sandbox & Isolation

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-15, D-23.

## 1. Model

Each verification runs in an **ephemeral, single-use, network-restricted sandbox**:
- fresh environment per obligation; destroyed after evidence capture.
- filesystem = the proposed workspace (diff applied over a base snapshot), read-mostly.
- network = deny-by-default; allowlist only what the verifier plugin declared (RFC-104 capabilities).
- no access to: other tenants, secrets beyond declared scope, the attestation signer, the event log write path.

**INV-SBX-01** A sandbox cannot mutate project state or reach the signer (isolation is the tamper barrier). **INV-SBX-02** Sandboxes are single-use; reuse across transactions is forbidden (no state bleed). **INV-SBX-03** Sandbox network egress is default-deny; undeclared egress is blocked and audited.

## 2. Scaling

Sandboxes are the platform's primary compute cost and bottleneck. Design:
- **Pooled + warm** base images per (language, toolchain) to amortise startup.
- **Sharded per tenant**; a tenant's verification load cannot starve another's (fair scheduling).
- **Poolable & preemptible**; long verifications (e2e, deploy) scheduled separately from fast ones (build/lint) so quick gates aren't blocked.

## 3. Isolation classes

Risk-tiered: `container` (default for arbitrary code execution), `microvm` (untrusted/high-assurance), `wasm` (pure analyzers). The class is chosen by the verifier's declared risk (RFC-104 `isolation_class`).

## 4. Failure modes

Sandbox crash/timeout → evidence `inconclusive` → obligation fails closed (RFC-204). Resource-exhaustion → fair-scheduler backpressure, retriable. Escape attempt (undeclared syscall/egress) → kill + audit + quarantine plugin.

---

# RFC-403: Evidence Store & Signing

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-14.

## 1. Storage

Evidence artifacts (logs, screenshots, reports) are **content-addressed** blobs in object storage; the Evidence node (RFC-102 §3) references them by `sha256`. Immutable; identical artifacts dedupe.

## 2. Signing

On evidence capture, the Verification Runtime canonicalises the evidence record (RFC-111 §5 canonical form) and signs it with a **verifier key** held inside the isolation boundary (cloud: HSM/KMS; local: OS keystore). The signature binds `(workspace_hash, obligation_id, verifier_identity+version, produced_at, artifact_hashes)`.

**INV-EVD-01** An evidence record whose signature or content hash fails validation is rejected (never attested). **INV-EVD-02** The signing key is unreachable from sandboxes and proposing actors (INV-VRT-01). **INV-EVD-03** `workspace_hash` in evidence MUST equal the workspace being verified; mismatch = reject (prevents replaying old evidence).

## 3. Key management & rotation

Verifier keys rotate on a schedule; attestations record the key id used; old keys retained for audit verification. Compromise → revoke key id, invalidate attestations signed by it in the affected window (audit trail supports scoped revocation).

---

# RFC-404: Attestation Authority

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-16, D-17.

## 1. Interface

`attest(transaction_id, obligation, evidence[]) → Attestation` (RFC-102 §4).

## 2. Aggregation (normative)

```
1. Verify each evidence signature + content hash + workspace_hash match. Reject any invalid.
2. For each blocking EvidenceReq: require a matching evidence with result=pass.
   Missing/failed blocking → verdict=fail.
3. aggregate_confidence = policy_combine(evidence.confidence...)  (e.g. min of blocking,
   weighted by req). Compare to obligation.confidence_threshold.
4. If human_approval required (D-16): verdict cannot be `pass` until approval(s) present.
5. Sign the attestation with the attestation key.
```

**INV-ATT-01** `pass` requires: all blocking evidence pass, aggregate_confidence ≥ threshold, all required approvals present (INV-VER-04). **INV-ATT-02** Attestation is signed; the Transaction machine validates the signature before commit (INV-TXN-01). **INV-ATT-03** Low-confidence pass on high-blast-radius change escalates to human approval (D-17 ↔ D-16 linkage).

## 3. Approval workflow

An approval is itself signed evidence: `{ approver_identity, on_evidence[], decision, time, signature }`. Recorded as an `Approval` node linked to the attestation (RFC-102). **INV-ATT-04** Irreversible change classes cannot `pass` on machine evidence alone.

## 4. Retry & failure feedback

A `fail` attestation returns **structured** feedback: which obligation, which evidence failed, what threshold, with artifact refs — consumable by the agent for an informed retry (RFC-204 §6). Retries are new transactions linked to the failure; bounded by policy to prevent loops; repeated failure escalates to human.

---

# RFC-405: Audit Trail

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-13/4.13.

Every obligation, evidence bundle, attestation, approval, and failure is an immutable event, projected into a queryable **audit view** linked in the graph. Query: "show the complete verification provenance of change X" → obligations → evidence (with artifacts) → attestation → approvals, all signed, all time-ordered.

**INV-AUD-01** The audit trail is append-only and complete: no committed change lacks a full verification provenance chain. **INV-AUD-02** Audit queries are tenant-scoped (INV-G-03). This is a first-class commercial/compliance feature (SOC2/regulated-domain assurance), not an add-on.
-e 

---


# RFC-500: Engine Skeleton

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-18 · **Depends:** RFC-105, RFC-303, RFC-204.

## 1. What every engine is

A **stateless worker** that reads context, proposes transactions, and emits/consumes events. It owns no authoritative state (INV-ENG-02). Engines are horizontally scalable, independently versioned, individually deployable, and restart-safe.

## 2. Shared lifecycle

```
invoke(request)
  → hydrate needed context (RFC-303)
  → compute proposed change (engine-specific logic; may call a plugin, e.g. ai-provider)
  → txn.propose(change) (RFC-204)     [engines can only PROPOSE; verification gates commit]
  → emit Engine.Proposed
  → on commit/rollback (observed via events) → emit Engine.Completed|Failed
```

## 3. Shared interface (RFC-105)

`invoke(request) → job_id` · `status(job_id)` · `cancel(job_id)`. Async, idempotent by `(engine, correlation_id)`.

## 4. Shared invariants

- **INV-ENG-01** state only via Context API; mutate only via Transaction API; never storage.
- **INV-ENG-02** no authoritative state; reconstruct from events on restart.
- **INV-ENG-03** `invoke` idempotent; retries safe.
- **INV-ENG-04** an engine cannot commit; all commits go through Verification (RFC-204). This makes a buggy/compromised engine unable to corrupt truth — it can only propose things that fail verification.

## 5. Shared failure modes

`input-invalid` · `context-stale` (required fresh context isn't) · `plugin-error` · `verification-failed` (its proposal didn't pass — normal, not an engine bug) · `timeout`. All emit `Engine.Failed` with typed cause; none leave partial state (proposals that don't commit are rolled-back workspaces).

## 6. Shared extension model

Engine-specific behaviour delegated to plugins over the relevant contract (e.g. generation→templates, verification→verifiers, planning→strategies). Adding capability = adding a plugin, not editing the engine.

---

# RFC-501..511: The Eleven Engines

Each spec below states only what is **distinctive** beyond RFC-500. All share §2–6 above.

## RFC-501: Generation Engine
- **Implements:** D-19 (determinism).
- **Purpose:** emit/mutate project scaffolding from intent + answers.
- **Inputs:** Project Contract + answers + resolved template/plugin versions.
- **Outputs:** a proposed transaction of file mutations + initial graph nodes (Decision "adopt EOS core vX", Modules, Conventions).
- **Distinctive invariant — INV-GEN-01:** emission is deterministic — identical `{answers, versions}` ⇒ byte-identical proposed output. **No LLM in the emission path** (LLM may produce answers upstream, RFC-508 interview).
- **Extension:** templates/archetypes are plugins (RFC-704 `template`).
- **Failure:** non-deterministic output detected by golden-hash test → hard fail (regression guard).

## RFC-502: Verification Engine
- **Purpose:** the orchestration face over the Verification Runtime (RFC-400).
- **Distinctive:** derives obligations (RFC-401), dispatches verifiers, collects attestations. The *trust boundary* is RFC-400, not this engine; this engine is a coordinator and MUST NOT itself sign or attest.

## RFC-503: Architecture Engine
- **Purpose:** propose/validate architecture; **detect drift** (`VIOLATES` edges, RFC-101 §4).
- **Inputs:** graph (modules, decisions, conventions, symbols).
- **Outputs:** proposed structure changes; drift findings as events.
- **Distinctive — INV-ARC-01:** on each relevant commit, reconcile code-model vs. decisions/conventions; any contradiction MUST produce a `VIOLATES` edge (the graph's architectural conscience). Feeds Quality Engine.

## RFC-504: Planning Engine
- **Purpose:** decompose Requirements → dependency-aware WorkItems.
- **Outputs:** proposed WorkItem nodes + `DEPENDS_ON`/`IMPLEMENTS` edges.
- **Distinctive — INV-PLN-01:** the produced plan graph MUST be acyclic; a cyclic plan is rejected at propose. Risks surfaced as nodes. Strategies are plugins.

## RFC-505: Documentation Engine
- **Purpose:** project graph state into human docs on demand.
- **Distinctive — INV-DOC-01:** produces **nothing authoritative** — every doc (README, ADR view, handbook, API ref) is a read-only projection over the graph, always current, never a source. Docs are outputs (the platform's core "no prose source of truth" principle made literal). Link/reference integrity is validated as the doc change-class obligation.

## RFC-506: Release Engine
- **Purpose:** assemble a release (RFC-108).
- **Inputs:** event-log range since last release.
- **Outputs:** version bump, changelog + release-notes projection, tag, pre-release snapshot.
- **Distinctive — INV-REL-01:** no release proposal commits without the release-gate attestation; changelog is *derived* from decision/work/commit events, never hand-authored.

## RFC-507: Deployment Engine
- **Purpose:** orchestrate deploy via `deploy` plugins (RFC-703).
- **Distinctive — INV-DEP-01:** deployment outcome MUST pass deploy-verification (health/smoke, RFC-401) before the release transaction commits; irreversible → human approval (D-16). The engine orchestrates; the plugin executes; verification gates.

## RFC-508: Prompt Engine
- **Purpose:** resolve Prompt Contracts (RFC-103), inject hydrated context, return ready invocations; power the AI-assisted interview.
- **Distinctive — INV-PRM-01:** records `(prompt_id, version)` on every resulting Action (provenance). Resolves `requires` (INV-PRM-02, fail closed). Prompts are versioned plugin packs.

## RFC-509: Quality Engine
- **Purpose:** compute health/drift/freshness/coverage scores; raise findings.
- **Inputs:** graph (freshness, VIOLATES edges, unverified/`proposed` nodes, plan reconciliation gaps).
- **Outputs:** findings as events (not mutations — read-mostly analytics).
- **Distinctive — INV-QLY-01:** every finding cites the graph nodes evidencing it (traceable, not opaque scores). Findings drive the reconciliation loop (RFC-204 §5).

## RFC-510: Telemetry Engine
- **Purpose:** aggregate events into opt-in, anonymised signals (RFC-110).
- **Distinctive — INV-TEL-01/02/03:** opt-in default-off; no code/secrets/PII leave a tenant; aggregation+anonymisation before any cross-tenant emission. Feeds the Knowledge Engine's improvement loop (D-20).

## RFC-511: Knowledge & Migration Engines
*(paired: they close and apply the inheritance loop)*
- **Knowledge Engine — Purpose:** curate the shared knowledge base; ingest validated patterns (informed by Telemetry), version them, publish packs. **INV-KNW-E-01:** published knowledge is versioned and applicability-scoped; publishing never mutates existing versions (immutable packs).
- **Migration Engine — Purpose:** execute upgrades (RFC-800). **INV-MIG-01/02/03** (RFC-109): every migration is a verified, reversible transaction with a pre-snapshot; preserves owned work; rolls back on verification failure. The most dangerous engine — every action is itself gated by the full verification suite.

## Engine set closure (why exactly eleven)

Each engine = one distinct platform verb (generate, verify, structure, plan, document, release, deploy, prompt, assess, learn/curate, migrate). Merge rule: if two would share >70% contract, merge. State rule: if an "engine" needs authoritative state, it's misplaced (belongs in an authority). These rules cap the set for a decade; new *capabilities* arrive as plugins, not new engines.
-e 

---


# RFC-600: API & SDK Binding Model

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-21 · **Depends:** RFC-204, RFC-303, RFC-400.

## 1. Principle

There is exactly **one** contract-first API. Every surface (CLI, IDE, REST, gRPC, language SDKs) is a thin binding over it. If the API can't express it, no surface can (INV-SDK-01). The API is defined by an interface description (the source of truth) from which bindings are generated.

## 2. API planes

- **Context plane:** `hydrate`, `query` (CQL, RFC-305), `write_back` (txn-scoped), `subscribe`.
- **Control plane:** `attach`, `propose`, `commit_status`, `transition` (lifecycle RFC-1101), `upgrade`, `plugin.activate/deactivate`, `snapshot`.
- **Verification plane:** `obligations`, `submit_evidence` (verifiers), `attest`, `approve`, `audit`.

## 3. Properties

- **Versioned:** API version = contract set version; clients negotiate (RFC-800). **INV-SDK-02:** a client pinned to API major N keeps working across N.x.
- **Transport-agnostic:** same operations over local IPC, REST, gRPC. Streaming ops (subscribe, context stream) use gRPC/SSE.
- **Auth on every call:** actor session + capabilities (RFC-602).
- **Structured errors:** typed error set per operation (RFC-000 §4).

## 4. Idempotency

Mutating operations accept an idempotency key (`correlation_id`); replays are safe (return prior result). Aligns with transaction idempotency (RFC-204).

---

# RFC-601: CLI & Local API

**Status:** Approved · **Version:** 1.0.0.

## 1. CLI

Thin binding for humans/CI. Command families mirror API planes: `ctx` (hydrate/query), `txn` (propose/status), `verify`, `release`, `upgrade`, `plugin`, `attach`, `project`. Output is dual: human-readable + `--json` structured (for scripting/CI). Exit codes map to typed error classes. The CLI holds no logic beyond binding — parity with API is automatic.

## 2. Local API

On-machine IPC (unix socket/named pipe) for IDE extensions and local agents needing low-latency hydration/write-back. Same operations, same auth (local actor identity), sub-10ms overhead target for warm hydration. The embedded daemon (RFC-203) exposes this.

---

# RFC-602: Authentication & Permissions

**Status:** Approved · **Version:** 1.0.0 · **Implements:** RFC-202, D-16.

## 1. Authentication

Pluggable identity (RFC-703 `auth`): local dev identity (embedded mode); OIDC/SSO (hosted). Every actor authenticates and receives a session. Agents authenticate with a service identity carrying `model` + `model_version` (recorded in provenance, INV-G-04).

## 2. Authorisation — capability model

- Capabilities are fine-grained: `context.read:{scope}`, `txn.propose:{change_class}`, `verify.submit`, `approve.irreversible`, `plugin.manage`, `upgrade.run`.
- Actors are granted least-privilege capability sets (default policy in Project Contract, RFC-100).
- **INV-AUTHZ-01:** agents do not hold `approve.irreversible` by default (D-16). **INV-AUTHZ-02:** every operation checks capabilities + tenant (RFC-202); failure = `FORBIDDEN`, audited.

## 3. Secrets

Secrets are never in the Project Contract or graph attrs; they are referenced by handle and resolved by a secrets plugin at point-of-use inside a sandbox scope. **INV-SEC-01:** secrets never enter events, context views, or logs (RFC-901).

---

# RFC-603: Events, Hooks & Lifecycle (client-facing)

**Status:** Approved · **Version:** 1.0.0.

- **Event subscription:** clients subscribe to scoped event streams (capability-filtered).
- **Hooks:** third parties register hooks on lifecycle transitions (RFC-1101) or event types. **INV-HOOK-01:** hooks may only *propose* transactions or emit their own events; they cannot bypass verification or commit directly. A hook that fails does not block core transitions (fail-open for hooks, fail-closed for gates — opposite policies, deliberately).
- **Lifecycle exposure:** the project state machine (RFC-1101) is queryable and drivable via `transition`, gates enforced by Runtime.

---

# RFC-700: Plugin Host

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-22 · **Depends:** RFC-104.

## 1. Responsibilities

Discover, register, resolve, isolate, activate, upgrade, and roll back plugins. The host is the only component that loads third-party code; it is a security-critical boundary.

## 2. Plugin lifecycle state machine

```
Discovered --register [contract-conformant]--> Registered
Registered --resolve [versions+deps satisfiable]--> Resolved
Resolved   --activate [isolation established]--> Active
Active     --upgrade--> Resolved(new version) --activate--> Active
Active     --deactivate--> Inactive
any        --conformance/isolation failure--> Rejected (fail closed)
```

**INV-HOST-01:** a plugin reaches `Active` only after contract-conformance (RFC-003) AND isolation establishment (RFC-701). **INV-HOST-02:** activation state is an event (auditable). **INV-HOST-03:** unknown/unsigned plugins are `Rejected` by policy.

---

# RFC-701: Plugin Isolation & Security

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-23.

## 1. Isolation

Each plugin runs in its declared `isolation_class` (RFC-104): `wasm` (pure/analyzers), `process` (moderate), `container`/`microvm` (arbitrary code / high risk). Granted only declared capabilities (network allowlist, context scopes, side-effect classes).

**INV-ISO-01:** a plugin cannot exercise undeclared capabilities (blocked + audited). **INV-ISO-02:** a plugin cannot cross its tenant boundary (INV-G-03). **INV-ISO-03:** blast radius of a compromised plugin is bounded to its declared capabilities + its tenant.

## 2. Signing & trust

Plugins are signed by publishers; the host verifies signatures against a trust policy (official registry keys + tenant-approved third parties). Supply-chain: plugin dependency graph is resolved and pinned; unpinned/unsigned transitive deps are rejected.

---

# RFC-702: Plugin Resolution & Compatibility

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-24.

## 1. Resolution

Given Project Contract pins (RFC-100) + each plugin's `requires` (RFC-104), the host computes a consistent version set or **fails closed** with a resolution report. **INV-RES-01:** no silent incompatibility — either a satisfiable set is found or the project doesn't load.

## 2. Version compatibility

Plugins declare `requires: {contracts, runtime, plugin-deps}` ranges. Contract majors define support windows (RFC-800). A plugin outside the running contract's support window is rejected.

## 3. Hot upgrade & rollback

Because plugins hold no authoritative state (INV-PLG-02), a same-contract-major upgrade hot-swaps behind the contract with no data migration (D-24). A contract-breaking plugin upgrade is a migration (RFC-800). Rollback = reactivate prior versioned artifact — always available.

---

# RFC-703: Category Contracts

**Status:** Approved · **Version:** 1.0.0.

Each plugin category defines the exact interface it implements (all also implement RFC-104 base). Selected normative interfaces:

| Category | Interface (abstract) |
|---|---|
| `ai-provider` | `complete(msgs, params)`, `embed(text)`, `stream(...)` |
| `verifier` | `verify(workspace, evidence_req) → evidence` (sandboxed, RFC-402) |
| `deploy` | `deploy(artifact, env) → handle`, `health(handle)`, `rollback(handle)` |
| `cms` | `read(query)`, `write(delta)` (content is external state) |
| `auth` | `authenticate(credential) → actor`, `capabilities(actor)` |
| `payments` | `charge`, `refund`, `status` (declared network scope only) |
| `compliance` | `assess(change) → obligations[]` (adds lifecycle gates) |
| `analyzer` | `analyze(path, content) → facts` (RFC-301) |
| `graph-store` / `log-store` | the physical persistence for RFC-200/300 |
| `template` | `resolve(answers, versions) → files` (deterministic, RFC-501) |
| `knowledge-pack` / `prompt-pack` | versioned inheritable content (RFC-107/103) |
| `monitoring` / `search` | `emit(signal)` / `index+query` |

**INV-CAT-01:** category contracts are additive within a major; a new category is additive; changing a category interface's semantics is breaking (migrated). New external technologies enter as new plugins in existing or new categories — **never** as core changes (D-22, the ten-year survival mechanism).

---

# RFC-704: Official Plugin Catalog & Store/Analyzer/Template Plugins

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-22 · **Extends:** RFC-703.

## 1. Purpose

Formalises the plugins referenced throughout the spec that back *core-adjacent* capabilities — physical persistence, code analysis, and generation templates — as first-party plugins under the RFC-703 category contracts. These are "official" (published + signed by the platform) but architecturally identical to third-party plugins: **the core depends on their contracts, never their implementations** (D-22).

## 2. Store plugins (`graph-store`, `log-store`)

Back RFC-200 (log) and RFC-300 (graph projection) physical storage. Interface = the append/read/subscribe (log) and node/edge CRUD+traverse (graph) operations those RFCs specify. **INV-704-01:** swapping a store plugin (embedded → distributed) changes zero core code and preserves all invariants (the deployment-mode mechanism, RFC-203).

## 3. Analyzer plugins (`analyzer`)

Back the indexer (RFC-301 §6). One per language/framework: `analyze(path, content) → facts`. **INV-704-02:** the core indexer is language-agnostic; all language knowledge lives in analyzer plugins. Unknown languages degrade to coarse nodes (INV-IDX-04), never fail.

## 4. Template plugins (`template`)

Back deterministic generation (RFC-501): `resolve(answers, versions) → files`. **INV-704-03:** template resolution is deterministic (no LLM in path, INV-GEN-01); archetypes are template plugins, added without core change.

## 5. Prompt/Knowledge packs (`prompt-pack`, `knowledge-pack`)

Versioned inheritable content backing RFC-103/107. Immutable per version; upgrades flow via RFC-800.

## 6. Catalog governance

Official plugins are versioned and CTS-tested like any plugin (RFC-003). Their "official" status is a *trust/signing* property (RFC-701), not an architectural privilege — they hold no back door the core grants no plugin.
-e 

---


# RFC-800: Versioning & Compatibility

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-26, D-27 · **Depends:** RFC-109.

## 1. Three versioned axes

- **Contracts** (RFC-100..111): the constitution.
- **Runtime**: the control-plane implementation.
- **Plugins / Knowledge packs / Templates**: the ecosystem.

All SemVer. A project pins all three (RFC-100). Compatibility is declared, resolved, and enforced (RFC-702).

## 2. Additive-within-major rule

**INV-VER-G-01:** within a contract major, changes are additive — new fields, new node/edge kinds, new event types, new evidence types. A consumer pinned to major N never breaks on N.x. Breaking changes bump major and REQUIRE a migration (RFC-109).

## 3. Upcasters (schema evolution over a decade)

Every event/contract type registers upcasters that lift older payloads to the current schema at projection time (RFC-111 §6). **INV-VER-G-02:** any historical event, however old, is readable via its upcaster chain — ten-year-old history stays replayable. Upcasters are pure, tested functions; the chain is versioned.

## 4. Support windows

Each contract major declares a support window (e.g. current + previous major). Components outside the window are rejected at load (fail closed). This bounds the compatibility matrix so it can't grow without limit over a decade.

---

# RFC-801: Inheritance & Three-Way Merge

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-25 · **THE HARDEST SUBSYSTEM.**

> Every config-inheritance system in history bleeds here. Specified with maximum rigor.

## 1. The classification foundation (recap of RFC-100 §3)

Every inheritable element is `inherited` | `overridden` | `owned`. Upgrade behaviour is decided *by classification*, which is why classification is mandatory and validated (INV-PROJ-01).

## 2. Upgrade algorithm (normative)

Given a project at upstream versions `V_old` upgrading to `V_new`:

```
1. SNAPSHOT the project graph (RFC-802). (INV-MIG-01)
2. Compute upstream delta: what changed between V_old and V_new (per element).
3. Partition elements by classification:
   a. inherited  → apply V_new directly (no conflict possible — project didn't diverge).
   b. owned      → do not touch, EXCEPT required codemods for contract-breaking changes (§6).
   c. overridden → THREE-WAY MERGE (§3).
4. Apply all changes into a WORKSPACE (not committed).
5. Run the FULL verification gate set on the upgraded workspace (RFC-401 all classes).
6. pass → commit as one migration transaction; emit UpgradeCompleted + semantic diff artifact.
   fail → rollback to snapshot; emit UpgradeFailed with evidence; project UNTOUCHED.
```

**INV-UPG-01:** an upgrade that fails verification leaves the project byte-identical to pre-upgrade (snapshot restore). No partial upgrades.

## 3. Three-way semantic merge (for `overridden` elements)

Inputs: `base` = V_old upstream element, `theirs` = V_new upstream element, `mine` = project override.

Because elements are **typed graph nodes / structured contracts**, not text, the merge is **semantic**, per element type:

- **Conventions/Decisions/Config:** field-level merge. If `theirs` changed a field `mine` didn't touch → take `theirs`. If both changed the same field → **conflict** (surface to human as a decision, with both values + rationale). If `mine` changed, `theirs` didn't → keep `mine`.
- **Structural (modules/boundaries):** merge by stable node identity (RFC-301 §4); additions from `theirs` added; `mine` removals respected; genuine structural conflicts surfaced.
- **Gates/thresholds:** if `theirs` *tightened* a gate `mine` had loosened → surface as a decision (upstream raised the bar); Core minimums always win (RFC-401 INV-OBL-02).

**INV-UPG-02:** semantic merge produces either a clean result or an explicit, typed conflict — never a silent overwrite of `mine`. **INV-UPG-03:** conflict rate is strictly lower than textual merge would produce (semantic equivalence recognised).

## 4. Conflict resolution

Unresolved conflicts halt the upgrade in a `conflicts-pending` state; each conflict is presented as a structured decision (what upstream wants, what you have, why they differ). Resolution is recorded as a Decision node (RFC-106) — so the *reasoning* is captured, not just the outcome. Only when all conflicts resolve does the upgrade proceed to verification (§2.5).

## 5. Diff artifact

Every upgrade produces a **semantic diff**: which decisions/contracts/conventions/gates changed and why, reviewable as a PR-like artifact before acceptance. This is how a human approves an upgrade with understanding, not blind trust.

## 6. Codemods (contract-breaking changes to `owned` code)

When a contract major bump requires changes to project-owned code (e.g. an API contract renamed a required field), the migration ships a **codemod**: a deterministic transformation applied to owned code as a *proposed, verified* transaction. **INV-UPG-04:** codemods are proposals gated by full verification like any change — a codemod that breaks the build fails and rolls back. Codemods never silently rewrite owned code without verification.

## 7. Fork (the escape hatch)

A project may convert an `inherited`/`overridden` element to `owned` (fork), permanently diverging. **INV-UPG-05:** forking is an explicit recorded Decision documenting the forgone-upgrade cost. Forked elements no longer receive upstream changes; the cost is visible, not hidden.

## 8. Test criteria

CTS asserts: clean upgrade of pure-inherited (no conflicts), correct three-way merge outcomes (all six cases in §3), no-silent-overwrite of overrides, failed-verification full rollback (INV-UPG-01), codemod-under-verification, and fork cost recording.

---

# RFC-802: Snapshots, History, Branching

**Status:** Approved · **Version:** 1.0.0 · **Implements:** 3.18.

## 1. Snapshots

A snapshot is a named, immutable marker at a log `seq` + a materialised graph state, enabling O(1)-restore and bounded projection rebuild. Created before every upgrade/release (INV-MIG-01, INV-REL-02) and on demand.

**INV-SNAP-01:** a snapshot is fully reproducible from the log up to its `seq` (consistency); restore is deterministic.

## 2. History & time-travel

The event log gives free time-travel: reconstruct the graph at any past `seq`. Node/edge versioning (RFC-101) gives per-entity history. Queries can target a historical watermark (RFC-305).

## 3. Branching & merge

A project may branch its graph (spike/experiment) as a copy-on-write overlay on the log from a snapshot. Branch merges reuse the RFC-801 semantic three-way merge machinery (base = branch point). **INV-BR-01:** branching never mutates the parent; merge back is a verified transaction. This is why RFC-801's merge engine is the most-reused component in the platform (upgrades AND branch merges AND graph merges share it).

## 4. Recovery

- corrupted projection → rebuild from log (bounded by nearest snapshot).
- bad migration → rollback to pre-migration snapshot (INV-UPG-01).
- catastrophic → restore log from backup (the only backed-up-critical asset), rebuild all derived state.
-e 

---


# RFC-900: Cross-Cutting — Security Model

**Status:** Approved · **Version:** 1.0.0 · **Implements:** INV-G-03, INV-G-05.

## 1. Threat model

Adversaries: a compromised/prompt-injected **agent**; a malicious **plugin**; a malicious **tenant** attempting cross-tenant access; a tampering **actor** trying to forge verification. The architecture defends each structurally, not procedurally.

## 2. Defences (each maps to an invariant)

| Threat | Structural defence | Invariant |
|---|---|---|
| Agent forges "it works" | out-of-process signed verification; keys unreachable | INV-VER-03, INV-ATT-01 |
| Agent takes injected instruction | `ingested` content never treated as instruction | INV-CTX-04 / INV-G-05 |
| Agent does irreversible harm | irreversible ⇒ human approval; least-privilege caps | INV-ATT-04, INV-AUTHZ-01 |
| Malicious plugin | sandbox + declared capabilities + signing | INV-ISO-01..03 |
| Cross-tenant access | partitioned log/graph; tenant check on every op | INV-G-03, INV-AC-01 |
| Tamper with evidence/history | content-addressing + signing + append-only | INV-EVD-01, INV-EVT-01 |
| Secret leakage | secrets by-handle, never in events/context/logs | INV-SEC-01 |

**INV-SECU-01:** every defence is structural (a boundary the adversary cannot cross), not a policy the adversary could be trusted to follow.

---

# RFC-901: Multi-Tenancy & Isolation

**Status:** Approved · **Version:** 1.0.0 · **Implements:** INV-G-03.

- **Partitioning:** the event log, graph, indexes, and evidence store are partitioned per tenant (`tenant/{tid}/...`). No cross-partition query.
- **Enforcement:** every operation carries a tenant-scoped session; the Runtime rejects any op whose target partition ≠ session tenant (INV-AC-01).
- **Shared knowledge exception:** the *only* cross-tenant data is the shared knowledge base (RFC-107), which is versioned, immutable-per-version, and public-to-inheritors — it contains no tenant data (curated patterns only, INV-TEL-02 guarantees no tenant data reaches it).
- **Noisy-neighbour:** per-tenant fair scheduling for verification sandboxes (RFC-402) and indexer queues (RFC-301); one tenant's load cannot starve another.
- **INV-TEN-01:** a tenant compromise is contained to that tenant's partition; blast radius never crosses.

---

# RFC-902: Observability

**Status:** Approved · **Version:** 1.0.0.

- **Metrics:** each subsystem exposes SLO metrics (RFC-904). Golden signals: hydration latency, index freshness lag, verification throughput/latency, transaction commit rate, upgrade success rate.
- **Tracing:** `correlation_id` threads a transaction across engines/verifiers/log for end-to-end traces.
- **Logging:** structured, tenant-tagged, secret-scrubbed (INV-SEC-01). Operational logs are distinct from the event log (which is truth, not telemetry).
- **INV-OBS-01:** every committed transaction is traceable end-to-end via its `correlation_id`.

---

# RFC-903: Disaster Recovery & Durability

**Status:** Approved · **Version:** 1.0.0.

- **The only critical asset is the event log** (+ evidence blobs). Everything else is rebuildable (INV-LOG-01).
- **Backup:** continuous log backup + periodic snapshots to independent storage.
- **RPO/RTO:** RPO bounded by log-backup lag (target near-zero via streaming replication); RTO bounded by projection rebuild from nearest snapshot.
- **Recovery drills:** the CTS includes a "rebuild-all-derived-state-from-log" test that MUST pass — proving derived stores are truly disposable.
- **INV-DR-01:** from the log + evidence blobs alone, the entire platform state (graph, indexes, audit) is reconstructable.

---

# RFC-904: Performance & Scale SLOs

**Status:** Approved · **Version:** 1.0.0.

Targets for the 10k-company / 100k-project / millions-of-executions scale (D-12/Phase 12):

| Metric | Target | Mechanism |
|---|---|---|
| Warm hydration | p95 < 50ms | cached projections, budget-bounded (RFC-303) |
| Cold hydration | p95 < 300ms | structural-first retrieval |
| Incremental index → fresh | p95 < 2s | incremental hashing (RFC-301) |
| Staleness window | p99 < 1s | reactive invalidation |
| False-fresh rate | **0** | source-pinning (INV-IDX-01) |
| Fast-gate verification (build/lint/type) | p95 < 60s | warm sandbox pools (RFC-402) |
| Transaction commit (post-attest) | p95 < 100ms | atomic append + async projection |
| Cross-partition scaling | linear | per-tenant sharding (INV-G-03) |

**INV-PERF-01:** hydration latency is independent of total platform size (bounded by budget + local graph neighbourhood, not global scale) — the property that makes 100k projects viable.

---

# RFC-1101: Project Lifecycle State Machine

**Status:** Approved · **Version:** 1.0.0 · **Implements:** D-29, Phase 11 · **Depends:** RFC-204.

## 1. States & entry gates

| State | Entry gate (MUST pass to enter) |
|---|---|
| `Attached` | valid Project Contract (RFC-100); baseline graph indexed (RFC-301) |
| `Specified` | every Requirement has verifiable acceptance criteria |
| `Planned` | plan graph acyclic (INV-PLN-01); risks recorded; significant decisions raised |
| `Building` | proposals reference a WorkItem + hydrated context |
| `Verifying` | signed attestation per obligation (RFC-102) |
| `Released` | release-gate attestation + required human approval (RFC-108, D-16) |
| `Maintaining` | same gates as Building/Verifying at maintenance grain |
| `Upgrading` | verified reversible upgrade transaction (RFC-801) |
| `Retired` | retirement Decision recorded |

## 2. Transition table (guards bracketed)

```
∅         --attach [valid contract + indexed]-->  Attached
Attached  --specify-->                            Specified
Attached  --(direct build for adopted repos)-->   Building
Specified --plan [acyclic]-->                      Planned
Planned   --build-->                               Building
Building  --submit-->                              Verifying
Verifying --pass-->                                Building (next work) | Released (if release txn)
Verifying --fail-->                                Building (with feedback)
Building  --release [release gate]-->              Released
Released  --maintain-->                            Maintaining
Maintaining --upgrade-->                           Upgrading
Upgrading --pass-->                                Maintaining
Upgrading --fail-->                                Maintaining (rolled back, INV-UPG-01)
any       --retire [decision]-->                   Retired
```

**INV-LC-01:** every transition is an event, gated, immutable. **INV-LC-02:** `Attach` is a first-class entry equal to greenfield generation (D-29) — the primary entry for the 95% brownfield market; generation is an *action available from any state*, not the birth event. **INV-LC-03:** archetypes/plugins may add states/gates but MUST NOT remove Core gates.

## 3. Why lifecycle is a state machine, not folders

The lifecycle lives in `runtime/txn` as enforced states, identical across all projects, because consistency of *process* is as important as consistency of *structure*. There is no lifecycle folder taxonomy anywhere in the system (the architecture's explicit rejection of documentation-as-structure).
