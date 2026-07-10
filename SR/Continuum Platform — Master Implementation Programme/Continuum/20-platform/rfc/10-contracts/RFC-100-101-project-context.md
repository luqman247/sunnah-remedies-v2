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
