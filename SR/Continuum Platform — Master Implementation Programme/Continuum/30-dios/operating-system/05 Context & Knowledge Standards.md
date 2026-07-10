# 05 · Context & Knowledge Standards

**Implements:** DIOS‑§1.8 (model is truth), §3.2 (model primacy), §3.3 (traceability),
§3.11 (content is content), §4.2 (audit before modifying), §5.3 (single canonical model).
**Layer:** L2 Model. **Depends on:** `00`, `03`, `13`.

> The knowledge model is the heart of the institution. If it is true and fresh, every
> product compounds in value with every action taken inside it. If it drifts, it becomes an
> authoritative liar and is worse than nothing. Everything here serves one imperative:
> **be true, stay fresh, answer fast.**

## 1. Knowledge invariants

- **CTX‑INV‑1 — Single source of truth.** There is exactly one canonical model of each
  entity. No layer holds a second authoritative copy (§5.3). Duplicated schemas are defects.
- **CTX‑INV‑2 — Freshness is never faked.** The system MAY serve stale‑marked data with a
  warning; it MUST NEVER serve stale data marked as fresh. A false claim of freshness is the
  one unacceptable failure.
- **CTX‑INV‑3 — Content/CMS boundary.** Business content lives in the content model and is
  editable by non‑engineers (§3.11). Code renders content; it never owns it.
- **CTX‑INV‑4 — Provenance on everything.** Every node carries who/what/when and its source,
  for audit and for revoking a compromised contributor's work (§3.3).

## 2. The model

The model stores a **structured representation of truth** — entities, relationships,
decisions, conventions, and history — not a wall of prose. Prose (docs, pages) is a
projection over it (§1.8). For content products this is the CMS schema layer; for
platform‑class products it is a typed context graph. Both obey the same invariants.

Entities relate through typed, attributed relationships (a product *contains* an ingredient,
a decision *constrains* a module, a course *requires* a prerequisite). Relationships are
first‑class, which is what lets the model answer *"what depends on this?"* and *"what breaks
if we change it?"* before a change is made (§4.2).

## 3. Freshness & staleness

Every derived node is pinned to a source; when the source changes, dependent nodes are marked
**stale** and re‑indexed. Retrieval always reports freshness so a reader or agent can refuse
to act on stale constraints. Freshness is a property of every node, computed from sources,
surfaced in every read — bounded, visible and self‑healing, never silent.

## 4. Retrieval & compression

Truth is **composed per task, not dumped.** A request is *intent + anchors + budget*; the
response is the minimal sufficient context: the hard constraints (decisions, conventions,
dependencies) always included at full fidelity, relevant history ranked, everything else
omitted, with freshness metadata and citations back to the model. Compression is hierarchical
summarisation with drill‑down — constraints are never summarised away.

## 5. Knowledge inheritance (the compounding moat)

Two tiers: **shared institution knowledge** (patterns, exemplars, conventions — inherited by
reference, read‑only, versioned) and **product knowledge** (owned, writable). Improve a
pattern once, and every product benefits on upgrade (Document 11). Shared knowledge is never
copied into products (copying causes drift); it is referenced by version, with explicit,
recorded overrides where a product must diverge.

## 6. Write‑back & learning

After acting, a Participant writes back a delta — new entities, decisions, actions, evidence
— as an immutable, causally‑linked record, verification‑gated so unproven claims are recorded
as *proposed*, not *true*, until evidence commits them. Every action makes the next
Participant's context smarter. This is how the institution is more capable in year ten than
year one, by construction.

### Related documents
`03` (schema/context contracts), `04` (documentation as projection), `09` (query &
discoverability), `10` (how agents hydrate and write back), `13` (node‑level access control).

*Version 1.0.0.*
