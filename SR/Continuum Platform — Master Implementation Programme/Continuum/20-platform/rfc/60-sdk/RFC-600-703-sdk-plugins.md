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
