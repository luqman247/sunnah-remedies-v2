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
