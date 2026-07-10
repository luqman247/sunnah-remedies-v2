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
