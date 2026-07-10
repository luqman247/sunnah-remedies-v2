# Bad Example — Inconsistent Naming

## Anti-Pattern

Different names are used for the same concept across the project.

---

# Example

Folder 1

Shop

Folder 2

Store

Folder 3

Products

Folder 4

Apothecary

All four describe the same feature.

---

# Problems

❌ Confusing navigation.

❌ Difficult onboarding.

❌ Inconsistent documentation.

❌ AI generates conflicting names.

❌ Duplicate terminology.

---

# Another Example

ProductCard.tsx

ItemCard.tsx

ShopCard.tsx

MedicineCard.tsx

All perform the same responsibility.

---

# Violated Engineering Principles

- Naming Conventions
- Controlled Vocabulary
- Consistency
- Discoverability

---

# Better Naming

Always use the approved terminology.

Preferred:

✓ Apothecary

✓ Product

✓ Collection

✓ Ingredient

✓ Academy

✓ Clinic

✓ Practitioner

Avoid:

✗ Shop

✗ Store

✗ Item

✗ Thing

✗ Stuff

✗ MedicineCard

---

# Controlled Vocabulary

The Engineering Glossary is authoritative.

When terminology conflicts:

Engineering Handbook

↓

Glossary

↓

Controlled Vocabulary

↓

Repository

---

# Lessons Learned

Good naming reduces documentation.

Good naming reduces bugs.

Good naming improves AI output.

Consistency is more valuable than personal preference.


---

# Do This Instead

See the correct approach in `examples/../../90-reference/glossary/ai-terms.md` — consistent, shared terminology and naming.

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
