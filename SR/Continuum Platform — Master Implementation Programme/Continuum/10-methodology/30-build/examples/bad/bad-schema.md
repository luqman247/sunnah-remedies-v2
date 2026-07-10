# Bad Example — Product Schema

Fields

Ingredient1

Ingredient2

Ingredient3

Ingredient4

Ingredient5

CategoryName

CategoryImage

CategoryDescription

BrandName

BrandCountry

BrandDescription

---

## Problems

Duplicated information.

No references.

No relationships.

Hard to maintain.

Editors repeat data.

Updates require changing hundreds of documents.

---

## Violated Principles

Single Source of Truth.

Normalisation.

Reusability.

Maintainability.

Scalability.

---

## Better Solution

Use References

Product

↓

Ingredient

↓

Category

↓

Brand

Each document should exist once.

Relationships should use references.


---

# Do This Instead

See the correct approach in `examples/good/good-schema.md` — a normalised, relationship-aware schema.

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
