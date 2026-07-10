# Architecture 03 — Content Model

## Purpose

Defines how knowledge, commerce, and practice are modelled as content, and enshrines authenticity as a first-class attribute.

## Scope

All Sanity document types and their relationships.

---

# Core Document Types

- **Ingredient** — a remedy substance, with properties and provenance.
- **Product** — a purchasable item, referencing ingredients.
- **Remedy / Practice** — a Prophetic Medicine practice (e.g. Hijama), with source references.
- **Course / Lesson** — Academy educational content.
- **Practitioner** — a therapy provider.
- **Article** — editorial and research content.
- **Source Reference** — a citation with authenticity grading.

---

# Authenticity as First-Class Data

Any claim rooted in a narration carries a **Source Reference** with an explicit authenticity grade. Grading is modelled data, queryable and displayable — never an informal editorial note.

```ts
// sanity/schemas/sourceReference.ts (illustrative)
export default {
  name: 'sourceReference',
  type: 'object',
  fields: [
    { name: 'text', type: 'text' },
    { name: 'collection', type: 'string' },     // e.g. Sahih al-Bukhari
    { name: 'grade', type: 'string' },           // e.g. sahih / hasan / da'if
    { name: 'gradedBy', type: 'string' },        // scholarly authority
  ],
}
```

This is the Integrity Ledger expressed in the schema: authenticity is structural, and the platform cannot present a claim without carrying its provenance.

---

# Relationship Discipline

References are modelled explicitly (a Product references Ingredients; a Remedy references Source References). Data is never denormalised into free text where a relationship belongs.

---

# Related Documents

- 01 Vision (Two Ledgers doctrine)
- 02 System Architecture
- Example — Ingredient Relationship

## Document Metadata

**Document Type:** Architecture
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Every 6 months
