# Bad Example — Duplicate Schemas

## Anti-Pattern

The same business information is repeated across multiple schemas.

---

# Example

Product Schema

Ingredient Name

Ingredient Description

Ingredient Image

---

Course Schema

Ingredient Name

Ingredient Description

Ingredient Image

---

Protocol Schema

Ingredient Name

Ingredient Description

Ingredient Image

---

# Problems

❌ Massive duplication.

❌ Editors repeat work.

❌ Data becomes inconsistent.

❌ Updates require editing dozens of documents.

❌ Difficult to maintain.

---

# Violated Engineering Principles

- Single Source of Truth
- Normalisation
- Reusability
- Scalability

---

# Better Architecture

Ingredient Document

↓

Referenced by

↓

Products

↓

Courses

↓

Protocols

↓

Research Articles

---

# Benefits

✓ One edit updates every relationship.

✓ Cleaner CMS.

✓ Better search.

✓ Better multilingual support.

✓ Easier maintenance.

---

# Lessons Learned

If information exists more than once, it probably deserves its own schema.


---

# Do This Instead

See the correct approach in `examples/good/search-and-filter-system.md` — one shared engine instead of duplicated schemas.

---

## Document Metadata

**Document Type:** Example (Bad)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual

## Change History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Release | Migrated and standardised into the Engineering Operating System |
