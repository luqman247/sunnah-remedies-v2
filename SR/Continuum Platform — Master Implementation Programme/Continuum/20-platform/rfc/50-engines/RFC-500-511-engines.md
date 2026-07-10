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
