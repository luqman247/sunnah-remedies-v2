# 04 · Documentation & Editorial Standards

**Implements:** DIOS‑§1.2 (docs are projections), §1.6 (truth is derived), §1.8 (model is
truth), §3.3 (traceability), §4.4 (explicit), §4.10 (observability).
**Layer:** L5 Experience. **Depends on:** `00`, `05`, `09`.

> Documentation is a **projection of the model, never a second source of truth.** Editorial
> voice carries the institution's character; citation carries its integrity. For an
> institution rooted in Prophetic medicine and Islamic scholarship, accuracy of reference is
> not a stylistic preference — it is a matter of trust and *amānah*.

## 1. Editorial invariants

- **ED‑INV‑1 — Docs are views.** Every README, ADR view, handbook and changelog is generated
  from the model and is always current; it is never a hand‑maintained parallel truth (§1.8,
  §3.2). Where a doc and the model disagree, the model governs and the doc is the defect.
- **ED‑INV‑2 — No unsourced claim.** A factual, clinical, scholarly or historical claim
  carries its source. Convenient sourcing never substitutes for authentic sourcing.
- **ED‑INV‑3 — Traceable change.** Every significant document change is recorded, attributed
  and reversible (§3.3, §3.7).

## 2. Voice & tone

Clear, calm, precise and unembellished. Sentences are as short as the meaning allows.
Reading level is accessible without being condescending. The institution never overclaims;
it states what is known, marks what is uncertain, and distinguishes the two. Marketing copy
never migrates into clinical or scholarly claims.

## 3. Islamic & scholarly references

- **Qur'an** — cited by sūrah name and āyah number; Arabic rendered in the designated script
  face (Document 01) with accurate harakāt; translations attributed to a named translator.
- **Hadith** — cited with collection, book/number, and where relevant an authenticity grade
  (ṣaḥīḥ, ḥasan, ḍaʿīf) from a named authority. Attributions are verified before publication;
  a doubtful attribution is either verified, qualified, or omitted — never asserted.
- **Arabic formatting** — right‑to‑left handling, correct glyph shaping and no alteration of
  source text (no glyph or harakah changes) are required; readability improvements never
  change the text itself.
- **Academic & medical references** — cited to primary sources; claims that touch health
  carry appropriate clinical disclaimers and never present tradition as clinical proof or
  vice versa.

## 4. Citation & translation standards

Every citation is specific enough to be independently checked. Translations declare source
and translator. Where scholarly opinion differs, the institution presents the range fairly
rather than flattening it. Intellectual honesty over convenient sourcing is a standing rule
(§1.6).

## 5. Documentation practice

- ADRs use the institution's ADR template; they are immutable and superseded‑not‑edited
  (§7.3).
- Module READMEs, API docs, schema docs, release notes and the engineering handbook are
  generated projections kept current with the model.
- Knowledge articles (apothecary, academy, clinical) follow the same sourcing discipline as
  scholarly references and are structured for both human readers and AI retrieval (Document
  09).

### Related documents
`05` (content/knowledge model), `09` (discoverability & structured data), `01` (Arabic and
script typography), `10` (how agents must handle sourcing and refuse to invent citations).

*Version 1.0.0.*
