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
