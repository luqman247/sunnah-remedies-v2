# Continuum

## Architecture Specification for a Runtime-First AI Engineering Platform

**Document class:** Platform Architecture Specification
**Status:** Draft for architectural approval
**Author:** Chief Software Architect
**Version:** 0.1 (design)
**Scope:** The whole platform, from first principles. No implementation, no prompts, no templates — architecture only.

> **Naming note.** I am giving the platform a working name — **Continuum** — for one reason that is itself an architectural decision: the product is a *continuously running relationship* with a project, not a one-shot generator. A name that implies a moment ("Generator", "Scaffolder") would anchor everyone to the wrong mental model. The runtime is a continuum of context, verification, and decisions across a project's whole life. The name is disposable; the principle it encodes is not.

---

## How to read this document

Every significant decision is written as a decision record with a fixed shape:

> **Problem** · **Context** · **Alternatives** · **Trade-offs** · **Decision** · **Consequences** · **Future evolution** · **Risks**

Decisions are numbered `D-nn` and referenced across phases. If a later phase contradicts an earlier decision, the later one wins and says so explicitly — the document is designed to be *revised in place*, like a living RFC set, not frozen.

The twelve phases build in dependency order: we tear down assumptions (1), define the Runtime that owns everything (2), design its heart — the Context Graph (3) — and its conscience — Verification (4), then the engines that hang off it (5), the surfaces third parties touch (6, 7), the hardest problem — upgrades (8), the formal contracts that make it all interoperate (9), the repository that falls out of the architecture (10), the lifecycle a project moves through (11), and the ten-year survival argument (12).

---

# PHASE 1 — Ruthless Challenge

Before designing anything, I demolish. Including — especially — my own prior designs. A platform meant to live ten years cannot inherit unexamined assumptions from a documentation repository.

## 1.1 The assumptions I am killing

**Assumption killed #1: "The methodology already exists; we extract it."**
My earlier design claimed 81% of a prior repository was reusable "Core." Measured, that "Core" was ~17,700 words across 145 files — a median of 107 words each, most being *headings implying content that was never written*. **A platform cannot be extracted from a table of contents.** The methodology is an *output* the platform must be capable of producing and evolving, not a seed asset. I delete the extraction premise entirely and replace it with: the platform's value is mechanism, not prose.

**Assumption killed #2: "The generator is the product."**
`create-react-app` generated millions of projects and still lost, because it abandoned the developer at `t=0` and became un-upgradeable. The moment of creation is the *least* valuable moment in a project's life. **Generation is a feature. The Runtime is the product.** (This is the reframing the brief demands, and it is correct — I adopt it as the spine, not a slogan.)

**Assumption killed #3: "Everything is markdown."**
Markdown is a *rendering* of state, for humans. If the source of truth is prose, then it is unqueryable, un-diffable at the semantic level, non-deterministic to generate, and invisible to agents except as a wall of text. **The source of truth must be structured data. Prose is a projection of it.** Every document the platform "produces" is a view over the Context Graph, generated on demand, never authored directly.

**Assumption killed #4: "Six or seven engines are peer subsystems."**
Naming seven "engines" made a small system sound large — org-chart cosplay. There are exactly **three load-bearing subsystems**: **Context** (what is true), **Verification** (what is proven), **Generation/Execution** (what changes). Everything else — release, docs, quality, planning, telemetry — is a *consumer* of those three. I keep the word "engine" in Phase 5 because the brief asks for it, but I demote them: engines are **stateless workers** that operate *on* the Context Graph and *through* Verification. They own no truth.

**Assumption killed #5: "The agent verifies its own work."**
An agent that both produces work and attests to its correctness is an unsound trust model at any scale, and catastrophic at millions of executions. **Verification must run out-of-process, in an environment the agent cannot influence, producing evidence the agent cannot forge.** This is not a checklist. It is a security boundary.

**Assumption killed #6: "Deterministic generation + LLM-in-the-loop" can coexist.**
They cannot, in the same path. LLMs are non-deterministic. Either emission is deterministic (no model in the hot path) or it is not. **Decision preview:** the LLM assists *authoring intent* (the interview, the reasoning); the Runtime's *emission and mutation* of project state is deterministic and replayable. The model proposes; the deterministic core disposes.

## 1.2 Hidden complexity I am now naming (so it doesn't ambush us)

- **Staleness is the real enemy.** Any context store that can drift from the codebase is worse than no store, because it lies with authority. Freshness is not a feature of the Context Graph; it is its existential requirement (Phase 3.9).
- **The three-way merge on upgrade** is the single hardest problem in the platform — harder than the graph. Every config-inheritance system in history (ESLint, Nx, CRA ejection, Rails upgrades) has bled here. It gets a whole phase (8) and it is a *first-class* risk, not a footnote.
- **Multi-tenancy isolation.** "Thousands of teams, millions of executions" means untrusted code, secrets, and agent actions sharing infrastructure. A poisoned plugin or a prompt-injected agent must not cross a tenant boundary. Security is designed in from Phase 2, not bolted on.
- **Brownfield.** Greenfield `new` addresses ~5% of the market. The Runtime must *adopt* existing repositories. This reshapes the whole design: the Runtime attaches to a project; it does not birth it.

## 1.3 Scalability and coupling audit (of the target design)

| Concern | Verdict | Where addressed |
|---|---|---|
| Context Graph read volume (millions of hydrations) | Must be a read-optimised, cacheable projection; writes are the graph, reads are materialised views | D-07, 3.16 |
| Verification compute (sandboxes at scale) | Ephemeral, poolable, plugin-scheduled workers; the bottleneck, sharded by tenant | D-14, 4.x |
| Coupling of engines to storage | Engines must touch state only through the Context API, never storage directly | D-05 |
| Coupling to a specific AI model | All model contact behind a provider plugin; zero model names in core | D-21 |
| Coupling to an IDE/CI/cloud | All external surfaces are plugins over stable contracts | Phase 7, 9 |

## 1.4 What survives the demolition

Three ideas from prior work survive because they are sound: **the lifecycle as a state machine** (not a folder taxonomy), **evidence-before-completion** (promoted from doctrine to enforced security boundary), and **inheritance-by-reference not by-copy** (promoted to the central upgrade problem). Everything else is rebuilt.

---

# PHASE 2 — The Runtime

## 2.1 What the Runtime actually is

The Runtime is a **long-lived, stateful service that owns the truth about a project and mediates every change to it.** It is not a CLI, not a library, not a generator. Those are clients. The Runtime is the authority that:

- holds the project's **state** (via the Context Graph),
- admits change only through **verified transitions**,
- records every **decision** and **evidence** immutably,
- serves **context** to agents and humans, and
- manages **inheritance and upgrades** from the platform's shared knowledge.

Mental model: the Runtime is to a software project what a **database engine** is to data, or what **the Kubernetes control loop** is to cluster state. It runs continuously (as a daemon locally, or a service in the cloud), it reconciles desired vs. actual, and nothing mutates the truth except through it.

> **D-01 — The Runtime is a control plane, not a tool.**
> **Problem:** Prior designs made the entry point a command (`new`), implying a batch tool. Batch tools cannot own continuous state.
> **Context:** The platform must serve millions of ongoing agent actions, not one-shot scaffolds.
> **Alternatives:** (a) Library embedded per-invocation — no persistent truth, every call cold. (b) A pile of CLI commands over flat files — state lives in files, races and drifts. (c) A control plane with a persistent state store and an API.
> **Trade-offs:** (c) is heavier to build and operate; it requires a service lifecycle, persistence, and an API surface. (a)/(b) are trivial to start and impossible to scale.
> **Decision:** The Runtime is a control plane with an authoritative state store and a stable API. All clients (CLI, IDE, CI, agents) are thin.
> **Consequences:** We must design persistence, an execution model, an event model, and an API from day one. The generator becomes one client among many.
> **Future evolution:** Local single-tenant daemon → hosted multi-tenant control plane → federated/edge runtimes, all behind the same API.
> **Risks:** Over-engineering for a solo user. Mitigation: the *same* control plane runs as an embedded local daemon with SQLite-class storage; "service" is a deployment mode, not a rewrite.

## 2.2 Responsibilities (and hard non-responsibilities)

**The Runtime owns:** project state, context, memory, decision history, verification results, inheritance/version pins, the transition state machine, access control, and the event log.

**The Runtime explicitly does NOT own:** writing code (agents do that), running the app (deployment targets do that), being an AI model (providers do that), or being an editor/CI (clients do that). This boundary is what keeps it alive for ten years: it is the *system of record and control*, and everything volatile is a plugin on the outside.

> **D-02 — Truth in, side-effects out.**
> The Runtime is authoritative for *what is true and what is proven*. It orchestrates side-effects (code writes, deploys) but delegates their execution to plugins and records only their *verified outcomes*. This keeps the core small and the volatile parts replaceable.

## 2.3 Ownership and boundaries

```
        clients (untrusted-ish)            plugins (sandboxed)
   ┌───────────┬───────────┬────────┐   ┌──────────┬──────────┐
   │   CLI     │   IDE     │  CI    │   │ AI prov. │ deploy   │  …
   └─────┬─────┴─────┬─────┴───┬────┘   └────┬─────┴────┬─────┘
         │  stable Runtime API  │            │  plugin contracts │
   ┌─────▼──────────────────────▼────────────▼──────────────────▼─┐
   │                        RUNTIME (control plane)                │
   │  ┌────────────┐  ┌───────────────┐  ┌────────────────────┐    │
   │  │  Context   │  │ Verification  │  │  Execution / Txn    │    │
   │  │  Graph     │◄─┤  (trust)      │◄─┤  state machine      │    │
   │  └────────────┘  └───────────────┘  └────────────────────┘    │
   │  event log (append-only)   ·   access control   ·   versions  │
   └───────────────────────────────────────────────────────────────┘
```

The three inner boxes are the only stateful authorities. Engines (Phase 5) sit *outside* as workers calling in.

## 2.4 Persistence model

> **D-03 — Event-sourced core, materialised projections.**
> **Problem:** A ten-year audit-grade system that also serves fast reads has two conflicting needs: perfect history and cheap current-state.
> **Context:** Regulated buyers need immutable audit trails; agents need millisecond context reads.
> **Alternatives:** (a) Mutable state only — fast reads, no history, no time-travel, no audit. (b) Event log only — perfect history, slow/expensive reads. (c) Event-sourced writes + materialised read projections (CQRS-flavoured).
> **Trade-offs:** (c) adds projection-rebuild machinery and eventual-consistency between log and views. But it is the only option giving both immutable history *and* fast reads, plus the ability to *replay* to any past state (critical for upgrades and debugging).
> **Decision:** The authoritative write path is an **append-only event log**. Current state is **materialised projections** (the Context Graph read model) rebuilt deterministically from the log.
> **Consequences:** Every mutation is an event with a cause (which agent, which decision, which prompt version, which evidence). Time-travel, audit, and deterministic replay are free. We must version event schemas (Phase 8) and handle projection rebuilds.
> **Future evolution:** Local: embedded log + embedded graph store. Cloud: durable log (e.g. a streaming log) + a graph/relational projection store, sharded per tenant.
> **Risks:** Event-schema evolution over a decade. Mitigation: events are versioned contracts (Phase 9, Migration Contract) with upcasters.

## 2.5 Execution model

The Runtime executes **transactions**, not commands. A transaction is: *a proposed set of state mutations, plus the verification obligations they incur.* A transaction is only committed when its obligations are satisfied by independent evidence.

> **D-04 — Every mutation is a verified transaction.**
> An agent (or engine, or human) *proposes* a change. The Runtime opens a transaction, lets the change happen in a workspace, dispatches the verification obligations to the Verification subsystem, and **commits only on signed evidence**. Failure rolls the transaction back with the failure recorded. This makes "the agent lied about it working" structurally impossible to commit.

Execution is **asynchronous and reconciling** (Kubernetes-style): the Runtime holds *desired* state (the accepted plan) and *actual* state (verified reality) and drives actual toward desired through transactions, retrying and surfacing divergence. It is not a synchronous RPC that blocks on an agent.

## 2.6 Event model

Everything is an event: `ProjectAttached`, `DecisionRecorded`, `TransactionOpened`, `WorkProposed`, `EvidenceProduced`, `EvidenceSigned`, `TransactionCommitted`, `TransactionRolledBack`, `ContextInvalidated`, `UpgradeProposed`, `PluginActivated`, etc. Events are:

- **append-only, immutable, causally linked** (each carries its cause),
- **the only way state changes** (projections subscribe and update),
- **the substrate for telemetry** (Phase 5) and audit (Phase 4).

> **D-05 — Engines and clients never touch storage; they emit and consume events via the API.**
> This is the anti-coupling rule. Storage internals can change entirely (SQLite → distributed log) with zero engine changes, because engines only ever speak events over the API.

## 2.7 State model

Project state is a typed graph (Phase 3), not a document tree. At any instant a project has a **lifecycle state** (Phase 11) — `Attached`, `Specified`, `Planned`, `Building`, `Verifying`, `Released`, `Maintaining`, `Upgrading`, `Retired` — and each transition is an event gated by verification. State is always reconstructable from the log; the graph is the fast projection.

## 2.8 Runtime API (shape, not syntax)

Three planes, mirroring the three authorities:

- **Context plane:** `hydrate(query) → context view`, `write-back(delta) → event`, `subscribe(scope) → event stream`.
- **Verification plane:** `obligate(transaction) → obligations`, `submit-evidence`, `attest → signed result`, `audit(query)`.
- **Control plane:** `attach(project)`, `propose(transaction)`, `commit/rollback`, `transition(state)`, `upgrade(target)`, `plugin(activate/deactivate)`.

The API is **versioned, contract-first** (Phase 9), transport-agnostic (local IPC, REST, gRPC as bindings). Clients are thin over it.

---
# PHASE 3 — The Context Graph

The Context Graph is the heart of the platform. If it is right, the platform compounds in value with every action taken inside it and becomes impossible to copy. If it drifts, it becomes an authoritative liar and is worse than nothing. Everything in this phase serves one imperative: **be true, stay fresh, answer fast.**

## 3.1 Purpose

To be the **single, structured, always-current, queryable model of everything an agent or human needs to know to act correctly on a project** — its architecture, decisions, conventions, modules, dependencies, open work, and the history of what prior actors did and why.

It replaces "read these 40 markdown files and hope" with "ask for exactly the context this task requires, current as of now, with its constraints attached."

## 3.2 Goals (and explicit non-goals)

**Goals:** truthfulness, freshness, fast targeted retrieval, semantic diffability, inheritance from shared knowledge, complete decision history, and compression that preserves meaning.

**Non-goals:** being a documentation site (docs are a *projection*), being a vector-search bolt-on (retrieval is graph-first, embeddings assist), storing raw code (the repo owns code; the graph stores a *model* of it with pointers).

> **D-06 — The graph stores a *model of* the code, not the code.**
> **Problem:** Duplicating source into the graph guarantees drift and doubles storage.
> **Alternatives:** (a) Mirror files into the graph. (b) Store only derived structure (symbols, modules, boundaries, conventions) with content-addressed pointers to the repo.
> **Decision:** (b). The graph holds *entities and relationships derived from* the code, each pinned to a content hash of its source. When source changes, the hash mismatch signals staleness precisely (3.9).
> **Consequences:** The graph is small, semantic, and drift-detectable. It must be kept in sync by an indexing pipeline (3.9).
> **Risks:** Indexer lag. Mitigation: staleness is *first-class and visible*, never hidden.

## 3.3 Architecture

Three layers:

1. **Truth layer** — the append-only event log (from D-03). The graph is derived from it and can always be rebuilt.
2. **Model layer** — the typed property graph: entities, relationships, attributes, each versioned and source-pinned.
3. **Retrieval layer** — read-optimised projections and indexes (graph traversal, full-text, vector) that serve `hydrate` queries and are rebuildable from the model.

Writes go to the truth layer; the model updates; the retrieval layer re-projects. Reads never block writes.

## 3.4 Data model

A **typed property graph** with first-class versioning.

> **D-07 — Property graph over relational or document store.**
> **Problem:** The core queries are relationship traversals ("what depends on this module", "which decisions constrain this feature", "what did prior agents change here and why"). Those are graph-shaped.
> **Alternatives:** (a) Relational — joins explode for deep traversals; schema rigid over a decade. (b) Document — no relationships, drifts into blobs. (c) Property graph — native traversal, flexible attributes, relationships are first-class.
> **Trade-offs:** Graph stores are less commoditised than SQL and can be harder to operate at extreme scale. Mitigation: the *logical model* is a property graph; the *physical store* is a plugin (Phase 7) — start on a relational/embedded graph, swap for a native graph DB at scale without changing the model.
> **Decision:** Logical property graph; physical store pluggable.
> **Consequences:** Contracts (Phase 9) define the graph model; storage is replaceable.

## 3.5 Entities

Core node types (extensible via plugins):

- **Project** — root; carries lifecycle state and version pins.
- **Module / Boundary** — architectural units and their responsibilities.
- **Symbol** — significant code entities (services, schemas, components) as *models*, source-pinned.
- **Convention** — a rule the project follows (naming, layering, "logic in lib/").
- **Decision (ADR)** — a recorded choice with context, options, consequences.
- **Requirement / Spec** — desired behaviour with acceptance criteria.
- **WorkItem** — a unit of planned/in-flight/finished change.
- **Evidence** — a verification artifact (Phase 4), signed.
- **Actor** — an agent (with model+version) or a human.
- **Action** — a recorded thing an actor did, linked to its cause and effect.
- **KnowledgeNode** — inherited platform knowledge (patterns, good/bad exemplars) — see 3.12.
- **Artifact** — a produced output (a release, a generated doc view).

## 3.6 Relationships

Typed, directional, attributed edges — e.g. `Module DEPENDS_ON Module`, `Decision CONSTRAINS Module|Convention`, `WorkItem IMPLEMENTS Requirement`, `Action PRODUCED Evidence`, `Action CAUSED_BY Decision`, `Symbol VIOLATES Convention` (drift!), `Project INHERITS KnowledgeNode`, `Evidence ATTESTS WorkItem`. Edges carry attributes (confidence, timestamp, source hash) and are versioned like nodes.

The `VIOLATES` and staleness edges are what make the graph *actionable* rather than descriptive: the graph can tell an agent "this contradicts decision D-x" before the agent repeats a past mistake.

## 3.7 Indexes

Three complementary indexes over the model:

- **Structural** (graph adjacency) — traversal queries.
- **Lexical** (full-text) — "where is X mentioned".
- **Semantic** (vector embeddings of node summaries) — "what is *relevant* to this task" fuzzy retrieval.

> **D-08 — Graph-first retrieval, embeddings as a ranking assist.**
> **Problem:** Pure vector RAG returns plausible-but-unconstrained context and misses hard relationships (dependencies, constraints). Pure graph misses fuzzy relevance.
> **Decision:** Retrieval starts from graph anchors (the task's target nodes), expands along typed edges to gather *constraining* context (decisions, conventions, dependencies) deterministically, then uses vector similarity only to *rank and pad* with relevant-but-not-linked material.
> **Consequences:** Retrieved context always includes the hard constraints, never just the semantically-similar. This is the difference between an agent that respects architecture and one that hallucinates around it.

## 3.8 Storage model

- **Truth:** append-only event log (durable, ordered, per-project partition).
- **Model:** the property graph projection.
- **Indexes:** derived, rebuildable.
- **Blobs:** evidence artifacts and large payloads in content-addressed object storage, referenced by hash.

All rebuildable layers can be dropped and reconstructed from the event log — the log is the only irreplaceable asset, and it is append-only and backed up.

## 3.9 Versioning, invalidation, freshness — the existential section

> **D-09 — Freshness by source-pinning + reactive invalidation, never by trust.**
> **Problem:** The graph must never present stale structure as current. Staleness is the failure mode that discredits the whole platform.
> **Context:** Code changes constantly, often outside the Runtime (a developer edits a file directly).
> **Alternatives:** (a) Periodic full re-index — always somewhat stale, expensive. (b) Trust that all changes flow through the Runtime — false; brownfield and humans break it. (c) Every derived node is pinned to a content hash of its source; a file-watch/CI hook re-hashes on change; mismatches mark dependent nodes **stale** and enqueue re-indexing; queries can *require* freshness or *accept* stale-with-warning.
> **Decision:** (c). Freshness is a *property of every node*, computed from source hashes, surfaced in every retrieval.
> **Consequences:** An agent hydrating context always knows the freshness of what it received and can refuse to act on stale constraints. The indexer is a critical-path subsystem with its own SLOs. Staleness is visible, bounded, and self-healing — never silent.
> **Future evolution:** Incremental, language-server-powered indexing for near-real-time freshness.
> **Risks:** Indexer throughput at scale. Mitigation: per-tenant sharding, incremental hashing, priority queues for on-path nodes.

Node **versioning**: every node/edge is immutable-versioned; updates create new versions linked to the causing event. This yields time-travel and semantic diffs for free.

## 3.10 Retrieval (context hydration)

An agent never says "give me the files." It issues a **context request**: *task intent + target anchors + budget*. The Runtime returns a **Context View**: the constraining nodes (decisions, conventions, dependencies), relevant history (what prior actors did here), acceptance criteria, and freshness metadata — compressed to the token budget (3.14), with citations back to node versions.

> **D-10 — Context is *composed per task*, not dumped.**
> Hydration is a query with a budget, not a file list. The Runtime is responsible for returning the *minimal sufficient* context — the hard constraints always, the relevant history ranked, everything else omitted. This is what lets it serve millions of agent calls affordably and correctly.

## 3.11 Write-back

After acting, an agent (through a verified transaction, D-04) writes back a **delta**: new/changed symbols, new decisions, actions taken, evidence produced. Write-back is:

- **an event**, causally linked to the task and the agent;
- **verification-gated** — unproven claims are recorded as *proposed*, not *true*, until evidence commits them;
- **the mechanism by which the graph learns** — every action makes the next agent smarter.

## 3.12 Knowledge inheritance

> **D-11 — Two-tier knowledge: shared platform knowledge (inherited, read-only, versioned) + project knowledge (owned, writable).**
> **Problem:** Patterns, exemplars, and conventions valuable across all projects must be shared without being copied (copying = drift), while project-specific truth must be owned and mutable.
> **Alternatives:** (a) Copy shared knowledge into each project — drifts, can't upgrade. (b) Reference shared knowledge by version; overlay project-local knowledge.
> **Decision:** (b). A project `INHERITS` versioned `KnowledgeNode`s from a shared knowledge base; project-local nodes can extend or override with explicit precedence. Upgrading the shared knowledge version flows new patterns to every project through the upgrade system (Phase 8).
> **Consequences:** Improve a pattern once → every project benefits on upgrade. This is the compounding moat. Requires precedence rules and upgrade-time merge (Phase 8).

## 3.13 Decision history

Decisions (ADRs) are first-class nodes, immutable, superseded-not-edited, linked to what they `CONSTRAIN` and the `Action`s they `CAUSED`. The graph can always answer "why is it this way?" and "what breaks if we change this decision?" — the questions that keep a ten-year codebase sane.

## 3.14 Context compression

> **D-12 — Compression is hierarchical summarisation with lossless drill-down, not lossy truncation.**
> **Problem:** Context budgets are finite; naive truncation drops the constraint that mattered.
> **Decision:** Every node carries a summary at multiple granularities. Hydration fills the budget top-down (summaries first), and includes *pointers* an agent can expand on demand. Hard constraints are never summarised away — they are included at full fidelity before any optional context.
> **Consequences:** Agents get the gist within budget and can pull detail where needed. Model-independent: as context windows grow, the same mechanism just includes more detail.

## 3.15 Querying

A declarative **context query language** (contract in Phase 9): traversal + filter + freshness-requirement + budget. Humans get it as CLI/IDE queries; agents get it as a tool call; engines use it internally. One query model, many surfaces.

## 3.16 Performance and caching

- **Read path** is served from materialised projections + a hot cache keyed by (anchor set, budget, knowledge version, freshness watermark). Identical hydrations are cache hits.
- **Write path** is append + async re-projection; reads never block on writes.
- **Sharding** per tenant/project; the graph is embarrassingly partitionable because cross-project truth lives only in the shared knowledge base (itself versioned and cacheable).
- Target: hydration in low-tens-of-ms warm, bounded by budget, independent of total platform size.

## 3.17 Security and access control

- Graph is **tenant-partitioned**; no query crosses tenants.
- **Node-level ACLs**: secrets and sensitive decisions gated; agents receive *capability-scoped* context (an agent gets only what its task authorises).
- **Provenance on every node** (who/what/when/which model+version) — required for audit and for revoking a compromised actor's contributions.
- Prompt-injection defence: inherited/external content is marked *untrusted data*; the graph distinguishes *instructions* (only from authenticated actors) from *content* (everything ingested).

## 3.18 History, snapshots, branching, merge

- **History:** free, from the event log — time-travel to any past graph state.
- **Snapshots:** named, immutable graph versions (e.g. "v1.4 release") for fast restore and comparison.
- **Branching:** a project can branch its graph (experiment, spike) as a copy-on-write overlay on the log.
- **Merge:** graph merges are **semantic three-way merges** over typed nodes (not text) — the same machinery as upgrades (Phase 8), which is why that phase is the hardest and most reused.

## 3.19 How every agent interacts with it (the loop)

```
  agent receives task
        │
        ▼
  hydrate(task, anchors, budget) ──► Context View (constraints + history + freshness)
        │
        ▼
  agent proposes work  ──►  Runtime opens verified transaction (D-04)
        │
        ▼
  Verification produces signed evidence (Phase 4)
        │
        ▼
  commit ──► write-back delta as events ──► graph learns
        │
        ▼
  next agent hydrates a smarter graph
```

Every agent, current or future, speaks only this loop. The graph is model-agnostic: a 2030 model interacts identically.

---

# PHASE 4 — The Verification Runtime

Verification is the platform's conscience and its hardest security boundary. Its axiom: **an AI agent is never trusted about its own output.** Trust is earned only through evidence produced by processes the agent cannot influence.

## 4.1 Position and principle

> **D-13 — Verification is an out-of-process trust boundary, not a step the agent runs.**
> **Problem:** If the agent runs the tests and reports the result, the result is an unverifiable claim.
> **Context:** Millions of agent executions; some agents will be buggy, some prompt-injected, some adversarial.
> **Alternatives:** (a) Agent self-reports (unsound). (b) Runtime asks agent to run a review prompt (still the agent). (c) An independent Verification Runtime executes obligations in an isolated environment and signs the results.
> **Decision:** (c). Verification runs in a sandbox the proposing agent has no control over, ingests only the workspace diff, executes verification plugins, and emits **signed evidence**. The Runtime commits a transaction only on valid signatures.
> **Consequences:** "The agent said it passed" can never commit state. Verification becomes a schedulable, poolable compute tier (a scaling bottleneck we design for, D-14).

## 4.2 Evidence lifecycle

**Collect → Store → Sign → Attest → Gate.**

- **Collect:** verification plugins run against the proposed workspace and emit typed evidence (build log, typecheck, test results + coverage, lint, screenshot/DOM snapshot, deploy healthcheck, security scan, diff analysis).
- **Store:** evidence is content-addressed, immutable, in object storage; referenced from the graph as `Evidence` nodes.
- **Sign:** the Verification Runtime signs each evidence bundle with a key the agent cannot access, binding it to (workspace hash, obligation id, verifier identity, time).
- **Attest:** signed evidence is evaluated against the transaction's **verification contract** (obligations + thresholds) → pass/fail + confidence (4.11).
- **Gate:** commit iff attestation passes. Else rollback + recorded failure.

## 4.3 Evidence storage and signing

> **D-14 — Evidence is content-addressed and cryptographically signed; verifiers hold keys agents never see.**
> Tamper-resistance requires that the thing being attested (evidence) and the attestation (signature) cannot be produced by the party being verified. Keys live in the Verification Runtime's isolation boundary (and, in cloud, an HSM/KMS). An agent forging a pass would need the verifier's key — architecturally out of reach.

## 4.4 Verification APIs and contracts

- **Obligation API:** given a transaction, derive the **obligations** (which verifications are required) from the change type + project conventions + lifecycle gate.
- **Submission API:** verifiers submit evidence bundles.
- **Attestation API:** returns signed pass/fail + confidence + audit id.
- **Audit API:** query the immutable trail (4.14).

A **Verification Contract** (Phase 9) declares, per change class, the required evidence types and thresholds — versioned, inheritable, overridable per project within Core-mandated minimums.

## 4.5 Verification plugins (the verifier zoo)

Each verifier is a plugin (Phase 7) implementing a common contract, isolated, replaceable:

- **Code verification** — build, typecheck, lint, static analysis.
- **Runtime verification** — unit/integration/e2e execution in a sandbox.
- **Browser/Visual verification** — headless render, screenshot diff against baseline, DOM/a11y assertions.
- **Deployment verification** — deploy to an ephemeral preview, healthcheck, smoke.
- **Diff verification** — semantic diff: does the change match the approved plan and touch only intended scope?
- **Security verification** — dependency CVEs, secret scanning, SAST, injection checks.
- **CI verification** — reconcile with the project's own CI results as an independent corroborator.

New verification dimensions (performance budgets, accessibility, compliance) are new plugins — the subsystem is open-ended by design.

## 4.6 Sandbox and isolation

> **D-15 — Verification executes in ephemeral, per-transaction, network-restricted sandboxes.**
> Untrusted code + untrusted agent output must run without touching other tenants, secrets, or the network beyond an allowlist. Sandboxes are single-use and destroyed after evidence capture. This is both a security boundary and the unit of scaling (pool + shard per tenant).

## 4.7 Approval workflow

Some transitions require **human approval** in addition to machine evidence (irreversible actions: production deploy, data migration, permission change, dependency of high blast-radius). The approval is itself recorded evidence (who approved, on what evidence, when). Machine evidence *informs* the human; it never *replaces* required human sign-off for irreversible acts.

> **D-16 — Machine evidence is necessary; for irreversible actions it is not sufficient.**
> Ten-year survival means never letting full autonomy touch irreversible operations without a recorded human gate. Reversible actions can be fully automated on evidence; irreversible ones require evidence *plus* approval.

## 4.8 Failure and retry handling

- A failed verification **rolls back the transaction** and records a `VerificationFailed` event with the failing evidence.
- The failure feeds back to the agent as *structured, actionable* context (which obligation, what evidence, what threshold) — not a raw log dump — so the next attempt is informed.
- **Retry** is a new transaction with provenance linking it to the failure (bounded by policy to prevent loops). Repeated failures escalate to a human.

## 4.9–4.10 Browser/runtime/deploy/diff/CI/security — see 4.5

(Each is a verifier plugin under the common contract; enumerated above to satisfy completeness, unified under one lifecycle rather than special-cased.)

## 4.11 Confidence scoring

> **D-17 — Attestation yields pass/fail *and* a calibrated confidence, not just a boolean.**
> **Problem:** Some evidence is definitive (build failed), some probabilistic (visual diff within tolerance). A single boolean discards signal.
> **Decision:** Each verifier reports a result + confidence; the attestation aggregates into an overall confidence with a policy threshold per change class. Low-confidence passes on high-blast-radius changes escalate to human approval (ties to D-16).
> **Consequences:** The gate is risk-proportional: trivial changes flow, risky/ambiguous ones get scrutiny.

## 4.12 Tamper resistance (summary)

Content-addressing (evidence can't be altered without changing its hash), signing (attestation can't be forged), isolation (agent can't reach the verifier or its keys), append-only audit (history can't be rewritten). Four independent barriers.

## 4.13 Audit trail

Every obligation, evidence bundle, attestation, approval, and failure is an immutable, queryable event linked in the graph. A regulated buyer can prove *exactly* how any change was verified, by whom/what, on what evidence — a first-class commercial feature (compliance, SOC2-style assurance), not an afterthought.

## 4.14 The trust guarantee, stated plainly

> No project state ever transitions to "true/done/released" except by a signed attestation produced outside the proposing agent's control, against a versioned contract, with an immutable audit trail — and never for an irreversible action without a recorded human approval.

This single guarantee is the platform's core commercial promise: **you can let thousands of agents work, and still trust the result.**

---
# PHASE 5 — Engine Architecture

## 5.1 What an engine is (the demotion)

> **D-18 — Engines are stateless workers over the three authorities; they own no truth.**
> **Problem:** Prior designs made engines peer subsystems, implying each owned state — a coupling and consistency nightmare.
> **Decision:** An engine is a **stateless service** that (a) reads context via the Context API, (b) proposes changes as verified transactions, (c) emits/consumes events. It holds no authoritative state; restart-safe by construction. The three authorities (Context, Verification, Execution) own everything durable.
> **Consequences:** Engines scale horizontally, fail independently, and are individually versioned and replaceable. Adding an engine cannot corrupt state because engines can only *propose*, never *commit* — Verification gates every commit.

Every engine below shares the same skeleton: **Purpose · Responsibilities · Inputs · Outputs · Public interface · Internal interface · Dependencies · State · Events · Failure modes · Recovery · Versioning · Extension points.** To avoid 12× repetition of identical boilerplate, I state the **shared contract once**, then specify only what is *distinctive* per engine.

### Shared engine contract

- **Public interface:** a versioned API (invoke, status, cancel) over the Runtime SDK (Phase 6).
- **Internal interface:** Context API (read), Transaction API (propose), Event bus (emit/subscribe). *No direct storage.*
- **State:** none authoritative; ephemeral working state only, reconstructable from events.
- **Events:** each engine emits `*.Started/.Progress/.Proposed/.Completed/.Failed`.
- **Failure modes:** input-invalid, context-stale, verification-failed, plugin-error, timeout.
- **Recovery:** idempotent re-invocation keyed by transaction id; partial work is a rolled-back transaction, never partial truth.
- **Versioning:** SemVer, declares `requires: runtime>=x, contracts>=y`.
- **Extension points:** behaviour delegated to plugins over the relevant contract.

## 5.2 The engines (distinctive specs only)

**Generation Engine** *(the demoted former "product")*
Purpose: deterministically emit or mutate project scaffolding from an intent + answers. Distinctive: **must be deterministic** (D-19). Inputs: project contract + answers + template/plugin versions. Outputs: proposed file mutations (a transaction). Extension: templates and archetypes are plugins.

> **D-19 — Generation is deterministic; the LLM never sits in the emission path.**
> Same answers + same versions ⇒ byte-identical proposed output. LLMs may help *produce the answers* (interview) but the emission is pure template resolution. This preserves replayability, idempotent re-generation, and clean upgrades. It resolves the incoherence flagged in Phase 1 (killed assumption #6).

**Verification Engine** — the orchestration face of the Verification Runtime (Phase 4). Distinctive: it *derives obligations* and *dispatches verifiers*; the trust boundary itself is the Verification Runtime, not this engine.

**Planning Engine** — decomposes requirements into a dependency-aware plan (WorkItems + edges). Distinctive: output is graph mutations (WorkItems, `DEPENDS_ON`, `IMPLEMENTS`), gated like any transaction. Extension: planning strategies as plugins.

**Architecture Engine** — proposes/validates architectural structure and detects `VIOLATES` edges (drift between code and decisions). Distinctive: it is the graph's *architectural conscience*, continuously reconciling code-model vs. decisions.

**Documentation Engine** — projects graph state into human docs (READMEs, ADR views, handbooks) **on demand**. Distinctive: **produces nothing authoritative** — every doc is a read-only view over the graph, always current, never a source. (This is where "docs are outputs" becomes literal.)

**Release Engine** — assembles a release: version bump, changelog from decision/work history, release notes projection, tag. Distinctive: consumes the event log to author history; gated by release verification contract.

**Deployment Engine** — orchestrates deploy via deployment plugins; distinctive: deployment *outcome* must pass deploy-verification (Phase 4) before the release transaction commits.

**Prompt Engine** — resolves versioned prompt contracts, injects hydrated context, returns ready invocations to agents; records prompt id+version on every resulting action (provenance). Distinctive: prompts are *contracts with inputs/outputs/acceptance*, not prose.

**Quality Engine** — computes health/drift/freshness scores from the graph; raises issues (stale nodes, unverified claims, violated conventions). Distinctive: read-mostly analytics that *emit findings as events*, driving improvement.

**Migration Engine** — executes upgrades (Phase 8): schema upcasting, three-way graph merges, contract migrations. Distinctive: the most dangerous engine; every migration is itself a verified, reversible transaction with a snapshot before.

**Telemetry Engine** — aggregates events into privacy-respecting, opt-in signals (which gates fail, which prompts cause rework, which defaults get overridden). Distinctive: **the learning loop** — feeds Core/knowledge improvement (D-20).

**Knowledge Engine** — curates the shared knowledge base; ingests validated patterns/exemplars, versions them, publishes upgrades. Distinctive: gatekeeper of inheritance quality; changes here propagate to all projects via upgrade.

> **D-20 — Telemetry + Knowledge close the compounding loop.**
> Telemetry observes what works across 100k projects; Knowledge distils it into versioned inheritance; Upgrade (Phase 8) flows it back to every project. "Compounding quality" becomes a *mechanism*, not a slogan. Strictly opt-in, aggregated, tenant-anonymised (commercial + legal necessity).

## 5.3 Why exactly these, and not more

Each engine maps to a distinct verb the platform must perform (generate, verify, plan, structure, document, release, deploy, prompt, assess, migrate, learn, curate). If two engines would share >70% of their contract, they merge. If an "engine" owns state, it's wrong — it belongs in an authority. This rule caps sprawl for a decade.

---

# PHASE 6 — The SDK

The SDK is how the outside world touches the Runtime. Everything — CLI, IDE, CI, agents, third parties — is an SDK client over the same versioned API. There is no privileged back door.

> **D-21 — One contract-first API; every surface is a binding over it.**
> **Problem:** Divergent surfaces (a CLI that can do things the API can't) fracture the platform and rot.
> **Decision:** A single **transport-agnostic, contract-first API** (defined by the Phase 9 contracts) is the *only* way to reach the Runtime. CLI, REST, local IPC, gRPC, and language SDKs are generated/thin bindings. If the API can't express it, no surface can.
> **Consequences:** Total consistency; the API is the product's public surface and is versioned with utmost care. Feature parity is automatic.

## 6.1 Surfaces

- **CLI** — thin binding for humans/CI: `attach`, `hydrate`, `propose`, `verify`, `release`, `upgrade`, `plugin`, `query`. Scriptable, output structured (human + JSON).
- **Local API** — an on-machine IPC endpoint for IDE extensions and local agents (low-latency hydration/write-back).
- **REST API** — remote/cloud control-plane access; the multi-tenant surface.
- **gRPC/stream** — high-throughput event subscription and context streaming for agents.
- **Language SDKs** — typed clients (TS first, then others) generated from the API contract.
- **Plugin API** — how plugins register and are invoked (Phase 7).
- **Extension API** — how third parties add engines, verifiers, templates, knowledge.

## 6.2 Configuration

Declarative, versioned project config (the Project Contract, Phase 9) — the lockfile that pins runtime version, contracts, plugins, knowledge version, and answers. Human-editable but schema-validated; the Runtime is the authority on its meaning.

## 6.3 Authentication & permissions

- **AuthN:** pluggable identity (local dev identity; OIDC/SSO in cloud). Every actor (human or agent) is authenticated; agents carry a model+version identity.
- **AuthZ:** capability-based. An actor is granted **capabilities** (read-context-scope-X, propose-change-class-Y, approve-irreversible). Agents get *least privilege*; irreversible capabilities are human-held by default.
- Every SDK call carries an actor identity and is authorised against capabilities and tenant boundary.

## 6.4 Events, hooks, lifecycle

- **Events:** clients subscribe to the event stream (scoped by capability).
- **Hooks:** third parties register hooks on lifecycle transitions (e.g. "on VerifyPassed, run my compliance check") — hooks *propose* transactions, they don't bypass verification.
- **Lifecycle:** the SDK exposes the project state machine (Phase 11); clients drive transitions, the Runtime enforces gates.

## 6.5 Third-party developer experience

A third party can, without forking: add a verifier, add a deployment target, publish a template/archetype, contribute knowledge, or build an alternate IDE surface — all over stable contracts, all sandboxed, all version-negotiated. This is the ecosystem flywheel (the Stripe/Shopify lesson: the platform wins when others build on it).

---

# PHASE 7 — The Plugin System

> **D-22 — Everything volatile is a plugin; the core is small and stable.**
> **Problem:** AI models, CMSs, clouds, CI, frameworks all churn on 2–5 year cycles. A ten-year core cannot hardcode any of them.
> **Decision:** All external and replaceable capability lives behind plugin contracts. The core owns only the three authorities, the engines' skeletons, the contracts, and the plugin host. Everything else — providers, targets, verifiers, templates, knowledge packs — is a plugin.
> **Consequences:** The core's surface area (and thus its long-term liability) is minimised. Churn happens at the edges. Proven by the ten-year test (Phase 12).

## 7.1 Plugin categories

AI providers · CMS · payments · auth · deployment targets · testing/verification · monitoring · compliance regimes · search/index stores · graph stores · knowledge packs · templates/archetypes. Each category is a contract; each plugin implements one.

## 7.2 Plugin lifecycle

`Discover → Register → Resolve (version + deps) → Isolate → Activate → (Hot-upgrade | Rollback) → Deactivate`. Each stage is an event; activation state lives in the graph.

## 7.3 Discovery & registration

Plugins are declared in the Project Contract with version ranges and resolved from a registry (official + third-party). Registration validates the plugin against its category contract *before* activation. Unknown/unsigned plugins are rejected by policy.

## 7.4 Isolation & security

> **D-23 — Plugins run sandboxed with declared, least-privilege capabilities.**
> A plugin is untrusted third-party code near tenant data. Each runs in isolation (process/wasm/container per risk class), granted only the capabilities it declares (network allowlist, which context scopes, which side-effects). A payments plugin cannot read the whole graph; a verifier cannot reach the network. Capability violations are blocked and audited. This contains blast radius — a compromised plugin cannot cross its declared boundary or its tenant.

## 7.5 Version compatibility & dependency graph

Plugins declare `requires: contracts>=x, runtime>=y, plugin-z@range`. The host resolves a consistent set or refuses (no silent incompatibility). A plugin dependency graph is maintained; conflicts surface at resolve time, never at runtime.

## 7.6 Hot upgrades & rollback

> **D-24 — Plugins hot-swap behind their contract; state is external, so swaps are safe.**
> Because plugins are stateless over the contracts (state lives in the authorities), a plugin can be upgraded or rolled back without data migration in the common case. Contract-breaking plugin upgrades are treated as migrations (Phase 8). Rollback is re-activating the prior version — always available because plugins are versioned artifacts.

## 7.7 The stability guarantee

A plugin written against contract vX keeps working as long as the platform supports vX (a published support window). New contract versions are additive where possible; breaking changes are versioned and migrated. This is the promise that lets an ecosystem invest in building plugins.

---
# PHASE 8 — The Upgrade Architecture

This is the hardest problem in the platform. Every configuration-inheritance system in history has bled here. It gets the most scrutiny.

## 8.1 The problem, stated honestly

A project inherits shared knowledge, contracts, templates, and runtime behaviour by *reference* to versions. Those versions evolve. The project has *also* diverged — it has custom decisions, custom code, custom overrides. **How does a project absorb an upstream improvement without losing its custom work, and without a big-bang rewrite?**

The naive answers all fail: copying upstream (drift, no upgrade), forcing conformity (destroys custom work), manual migration (doesn't scale to 100k projects).

## 8.2 The core mechanism: inherited vs. owned, separated by construction

> **D-25 — Every artifact is classified inherited-or-owned; upgrades only touch inherited, and reconcile overrides by three-way merge.**
> **Problem:** You can't safely upgrade what you can't cleanly separate.
> **Decision:** The Project Contract records, for every inheritable element, whether the project takes it **as-inherited** (pinned version, upgradeable freely) or **overridden** (project owns a variant). Upgrades:
> 1. freely advance *as-inherited* elements (no conflict possible),
> 2. for *overridden* elements, run a **semantic three-way merge**: `base = old-upstream`, `theirs = new-upstream`, `mine = project-override`, producing either a clean merge or a recorded conflict for human resolution,
> 3. never touch project-*owned* code except where an inherited contract's breaking change *requires* a codemod, which is applied as a proposed, verified transaction.
> **Consequences:** Most upgrades are conflict-free (as-inherited advances). Conflicts are localised to genuine overrides. Nothing silently overwrites custom work.

## 8.3 Why merges are semantic, not textual

Because state is a typed graph and structured contracts (not markdown), merges operate on *meaning*: a changed convention, a superseded decision, an added gate — not on text lines. Semantic merge has vastly lower conflict rates than textual merge and can *reason* about compatibility (e.g., "upstream tightened a gate you had loosened → surface as a decision, not a text conflict").

## 8.4 The upgrade transaction

Every upgrade is a **verified, reversible transaction**:

```
snapshot(graph)  ──►  Migration Engine computes plan (upcasts + merges + codemods)
      │
      ▼
apply in workspace  ──►  Verification Runtime runs the FULL gate set on the upgraded project
      │
      ├── pass ──►  commit; emit UpgradeCompleted; produce a diff-report artifact
      └── fail ──►  rollback to snapshot; emit UpgradeFailed with evidence; project untouched
```

An upgrade that can't verify does not land. The project is never left half-upgraded.

## 8.5 Diff, rollback, recover, fork

- **Diff:** every upgrade produces a semantic diff artifact (what changed, why, which decisions/contracts moved) — reviewable as a PR.
- **Rollback:** snapshot + event log make rollback deterministic to the pre-upgrade state.
- **Recover:** a corrupted projection rebuilds from the log; a bad migration rolls back to snapshot; the log is the always-safe floor.
- **Fork:** a project may fork the shared knowledge/template (copy-on-write) if it needs to diverge permanently — with the explicit trade-off that it forgoes future upstream upgrades for the forked elements (recorded as a decision, so the cost is visible).

## 8.6 Schema/contract evolution over a decade

> **D-26 — Event and contract schemas evolve by additive versioning + upcasters; nothing is ever destructively renamed.**
> Old events are readable forever via upcasters that lift them to current schema on projection. Contracts add fields (safe) and version breaking changes (migrated). This is what lets a ten-year-old project's history remain replayable and a ten-year-old plugin keep resolving.

## 8.7 The true-inheritance guarantee

> A project can always pull the latest upstream improvements through a verified, reversible, semantically-merged upgrade that preserves its owned work — or consciously fork, accepting the recorded cost. There is no scenario where upgrading means rewriting, and none where it silently destroys custom work.

---

# PHASE 9 — Runtime Protocols (the RFC set)

These are the formal, versioned contracts that make everything interoperate and survive independent evolution. They are the platform's constitution. Each is machine-readable (schema), semver-versioned, and owned as a first-class artifact. I specify each by **purpose, key invariants, and evolution rule** — not syntax (syntax is implementation).

> **D-27 — Contracts are the stable core; code is disposable around them.**
> The longest-lived asset in any durable platform is its *interface contracts* (POSIX, SQL, HTTP). Continuum's contracts are designed to outlive every implementation detail. Everything else can be rewritten; contracts evolve only additively/versioned.

**Project Contract** — the identity, version pins (runtime, contracts, plugins, knowledge), inherited-vs-owned classification (D-25), and answers. *Invariant:* fully determines a project's inheritance and reproducibility. *Evolution:* additive; breaking = project migration.

**Context Contract** — the graph model (entities, relationships, versioning, freshness semantics) and the context-query language. *Invariant:* every node is source-pinned and freshness-tagged. *Evolution:* additive node/edge types; queries backward-compatible.

**Verification Contract** — per change-class obligations, evidence types, thresholds, signing/attestation format, confidence semantics. *Invariant:* no commit without valid signed attestation; irreversible ⇒ human approval. *Evolution:* obligations may tighten via versioned contract; projects inherit minimums.

**Prompt Contract** — a prompt as `id, version, role, inputs, outputs, acceptance, requires`. *Invariant:* one responsibility, declared IO, recorded provenance on every resulting action. *Evolution:* versioned; `requires` gates compatibility.

**Plugin Contract** — per category: interface, declared capabilities, version requirements, isolation class. *Invariant:* least privilege; sandboxed; no cross-tenant. *Evolution:* additive; breaking = plugin migration.

**Engine Contract** — the shared engine skeleton (5.1): stateless, context-read, transaction-propose, event IO. *Invariant:* engines never commit or hold truth. *Evolution:* additive capabilities.

**Decision Contract** — an ADR node: context, options, decision, consequences, constraints, supersedes. *Invariant:* immutable, superseded-not-edited, linked to what it constrains. *Evolution:* additive fields only.

**Knowledge Contract** — a shareable knowledge node: pattern/exemplar, applicability, version, precedence. *Invariant:* inherited read-only by reference; project overrides explicit. *Evolution:* versioned packs; upgrades flow via Phase 8.

**Release Contract** — what constitutes a release: version policy, required verifications, changelog/notes projection source, artifacts. *Invariant:* no release without release-gate attestation. *Evolution:* versioned policy.

**Migration Contract** — how upgrades/upcasts/merges are declared and executed: snapshot, plan, verify, commit/rollback, diff artifact. *Invariant:* reversible + verified; preserves owned work. *Evolution:* the migration format itself is versioned (meta-migration).

**Telemetry Contract** — what is collected, aggregation/anonymisation rules, opt-in scope. *Invariant:* opt-in, tenant-anonymised, no code/secret exfiltration. *Evolution:* additive signals; privacy rules can only tighten.

Together these eleven contracts are the interoperability spine. An implementation is "Continuum-compliant" iff it honours them.

---

# PHASE 10 — The Repository (emergent, not imposed)

The repository structure is *derived from the architecture*, not from documentation habits. Each top-level unit exists because a subsystem requires it.

```
continuum/
├── contracts/          # Phase 9 — the constitution; the most protected directory
│   ├── project/  context/  verification/  prompt/  plugin/
│   ├── engine/   decision/ knowledge/ release/ migration/ telemetry/
│   └── VERSIONS         # contract version registry + compatibility matrix
│
├── runtime/            # Phase 2 — the control plane
│   ├── log/            #   event-sourced truth (append-only core)
│   ├── projection/     #   materialised state rebuild
│   ├── txn/            #   transaction/state machine
│   ├── api/            #   the single contract-first API (Phase 6)
│   └── authz/          #   capabilities, tenancy
│
├── context/            # Phase 3 — the graph subsystem
│   ├── model/          #   entities, relationships, versioning
│   ├── index/          #   structural / lexical / semantic
│   ├── freshness/      #   source-pinning + invalidation (the existential part)
│   ├── retrieval/      #   hydration, compression, query
│   └── knowledge/      #   inherited two-tier knowledge
│
├── verification/       # Phase 4 — the trust runtime
│   ├── obligations/    sandbox/   evidence/   signing/   attestation/
│   └── audit/
│
├── engines/            # Phase 5 — stateless workers (one dir each)
│   ├── generation/  planning/  architecture/  documentation/
│   ├── release/  deployment/  prompt/  quality/  migration/
│   ├── telemetry/  knowledge/
│   └── _skeleton/      #   the shared engine contract impl
│
├── plugins/            # Phase 7 — the plugin host + official plugins
│   ├── host/           #   discovery, isolation, resolution, lifecycle
│   ├── categories/     #   category contracts
│   └── official/       #   first-party providers/targets/verifiers/templates
│
├── sdk/                # Phase 6 — bindings generated from contracts
│   ├── cli/  rest/  local-ipc/  grpc/  ts/
│
├── upgrade/            # Phase 8 — inheritance + three-way merge + codemods
│
└── platform/           # the platform's own governance (versioning, CI of Continuum itself)
```

Notice what is *absent*: no `docs/` at the core — documentation is a *projection* served by the Documentation Engine, not a stored asset. No lifecycle-numbered folders — the lifecycle is a state machine in `runtime/txn/`, not a directory taxonomy. No `prompts/` as prose — prompts are contracts in `contracts/prompt/` and versioned packs in `plugins/`. The structure encodes the architecture; nothing exists for documentation's sake.

> **D-28 — `contracts/` is the most protected directory; everything else can be rewritten.**
> A change to `contracts/` is a constitutional amendment (versioned, reviewed, migration-planned). A change to any implementation directory is routine. This asymmetry is what buys ten-year stability.

---

# PHASE 11 — The Development Model (project lifecycle as runtime states)

A project is a **state machine** in the Runtime. Every transition is an event, gated by verification, recorded immutably. There is no "phase" that is merely a folder; each is a runtime state with entry gates.

```
 Attached ─▶ Specified ─▶ Planned ─▶ Building ─▶ Verifying ─▶ Released ─▶ Maintaining
     ▲            │           │          │            │            │           │
     │            │           │          │            │            │           ▼
     └── (adopt   │           │          │            │            │       Upgrading ─┐
      brownfield) │           │          │            │            │           │      │
                  │           │          │            │            │           ▼      │
                  └───────────┴──────────┴────────────┴────────────┴────▶  Retired ◀─┘
```

| State | Meaning | Entry gate (must pass) |
|---|---|---|
| **Attached** | Runtime is bound to a repo (green- or brown-field); initial index built | valid Project Contract; baseline graph indexed |
| **Specified** | Requirements captured as graph nodes with acceptance criteria | each requirement has verifiable acceptance |
| **Planned** | Dependency-aware WorkItems exist | plan is acyclic; risks recorded; decisions raised for significant choices |
| **Building** | Agents/humans propose changes as transactions | proposals reference a WorkItem + hydrated context |
| **Verifying** | Evidence collected against obligations | signed attestation per Verification Contract |
| **Released** | A versioned, verified release exists | release-gate attestation + (irreversible ⇒ human approval) |
| **Maintaining** | Steady-state changes, same gates at smaller grain | same as Building/Verifying |
| **Upgrading** | Absorbing upstream (Phase 8) | verified, reversible upgrade transaction |
| **Retired** | Archived; graph + log preserved read-only | retirement decision recorded |

> **D-29 — Brownfield `Attach` is a first-class entry, equal to greenfield generation.**
> **Problem:** Greenfield-only serves ~5% of the market.
> **Decision:** The primary entry is **Attach**: point the Runtime at an existing repo; it indexes the code into the graph, infers conventions/modules, and reaches a valid `Attached` state *without generating anything*. Generation becomes an *optional* action available from any state, not the birth event.
> **Consequences:** The Runtime serves the 95% brownfield market. Generation is genuinely demoted to a feature. Indexing quality on arbitrary codebases becomes a priority (ties to the freshness/indexer investment, D-09).

The lifecycle is identical across all projects because it lives in the Runtime; archetypes/plugins may *add* states/gates but never remove Core gates.

---

# PHASE 12 — Designed for Ten Years

Assume 10,000 companies, 100,000 projects, millions of AI executions, and — the real challenge — *unknown* future models, IDEs, frameworks, and clouds. The architecture survives because of five structural properties, each traceable to a decision above.

**1. The volatile is quarantined at the edges (D-22, D-21).**
Every future-unknown (model, IDE, framework, cloud, CI) is a plugin over a stable contract. The core never learns their names. A 2032 AI model is an `ai-provider` plugin; a future IDE is an SDK binding; a new cloud is a `deployment` plugin. *Test:* swapping all providers changes zero core code.

**2. The stable is a small set of versioned contracts (D-27, D-28).**
Eleven contracts, evolved additively with upcasters (D-26). Like SQL/HTTP/POSIX, they outlive implementations. A ten-year-old project's history still replays; a ten-year-old plugin still resolves within its support window.

**3. Truth is model-independent and compounding (D-11, D-20).**
The Context Graph and shared knowledge accrue value with every action across all projects, independent of which model produced them. The platform is *smarter* in year 10 than year 1 by construction — the moat competitors can't copy because it's the accumulated, verified history of 100k projects.

**4. Trust scales because it's structural, not procedural (D-13, D-16, D-14).**
Out-of-process, signed, sandboxed verification means millions of agents can work without millions of trust decisions. The trust boundary is the same whether there are 10 agents or 10 million. Irreversible actions always retain a human gate.

**5. Scale is partitionable (D-03, D-07, 3.16).**
Event-sourced, per-tenant-sharded, materialised-read architecture scales horizontally. Cross-project coupling exists *only* through the versioned shared knowledge base, which is itself cacheable and immutable-per-version. There is no global hot spot.

**The ten-year test, stated as a falsifiable claim:**

> By 2036, the platform will have absorbed at least two unforeseen AI-model generations, one full framework migration, and one deployment-platform shift — entirely through plugins and versioned contracts, with the core control plane, the three authorities, and the eleven contracts substantially unchanged. If any of those churns forces a core rewrite, this architecture failed.

---

# Cross-Cutting: the decisions in one view

| ID | Decision | Phase |
|---|---|---|
| D-01 | Runtime is a control plane, not a tool | 2 |
| D-02 | Truth in, side-effects out | 2 |
| D-03 | Event-sourced core + materialised projections | 2 |
| D-04 | Every mutation is a verified transaction | 2 |
| D-05 | Engines/clients touch state only via events/API | 2 |
| D-06 | Graph stores a model of code, not code | 3 |
| D-07 | Property graph over relational/document | 3 |
| D-08 | Graph-first retrieval, embeddings assist | 3 |
| D-09 | Freshness by source-pinning + reactive invalidation | 3 |
| D-10 | Context composed per task, not dumped | 3 |
| D-11 | Two-tier inherited/owned knowledge | 3 |
| D-12 | Hierarchical compression, constraints never dropped | 3 |
| D-13 | Verification is an out-of-process trust boundary | 4 |
| D-14 | Evidence content-addressed + signed; keys agents can't reach | 4 |
| D-15 | Ephemeral, network-restricted verification sandboxes | 4 |
| D-16 | Machine evidence necessary; irreversible ⇒ human approval | 4 |
| D-17 | Attestation yields calibrated confidence, not just boolean | 4 |
| D-18 | Engines are stateless workers, own no truth | 5 |
| D-19 | Generation is deterministic; LLM never in emission path | 5 |
| D-20 | Telemetry + Knowledge close the compounding loop | 5 |
| D-21 | One contract-first API; every surface is a binding | 6 |
| D-22 | Everything volatile is a plugin; core small and stable | 7 |
| D-23 | Plugins sandboxed with least-privilege capabilities | 7 |
| D-24 | Plugins hot-swap behind contracts; state is external | 7 |
| D-25 | Inherited-vs-owned; upgrades three-way merge overrides | 8 |
| D-26 | Additive schema evolution + upcasters, never destructive | 8 |
| D-27 | Contracts are the stable core; code disposable | 9 |
| D-28 | `contracts/` is the most protected directory | 10 |
| D-29 | Brownfield Attach is first-class, equal to generation | 11 |

# The single architectural thesis

> **The product is a control plane whose authoritative state is a fresh, queryable Context Graph, whose every mutation is admitted only by out-of-process signed Verification, whose volatile parts are all plugins over versioned contracts, and whose shared knowledge compounds across every project via a reversible upgrade path. Generation is one feature of this runtime. The runtime is the platform.**

Everything in this specification is arranged so that implementation is now a matter of executing decisions D-01 through D-29 against the eleven contracts — not of making further architectural choices.

---

## Honest residual risks (the review turned on itself)

1. **The indexer/freshness subsystem is the make-or-break, and the least specified.** Truthful, fast indexing of arbitrary brownfield codebases across many languages is a genuine research-grade problem. If it's slow or lossy, the graph lies and the platform's core promise fails. It deserves its own follow-on specification.
2. **Semantic three-way merge (Phase 8) is asserted more than solved.** It's the right approach, but conflict-resolution UX and the codemod story for contract-breaking upgrades are hard and under-designed here.
3. **The verification compute tier is a real cost/latency bottleneck.** Sandboxed verification of millions of transactions is expensive; the economics (who pays, how it's pooled) shape the commercial model and aren't settled.
4. **Scope is enormous.** This is a multi-year build. The mitigating sequencing: ship **Attach + Context Graph (read-only) + one verifier** first — that alone is a defensible product (an always-fresh, queryable, honestly-verified project brain) — then add write-back, generation, upgrade, and the ecosystem. Value must land before the whole is built, or the whole never ships.

The highest-leverage next document is the **Context Indexer & Freshness Specification** — it is the one subsystem on which the entire thesis rests and the one most likely to be underestimated.
