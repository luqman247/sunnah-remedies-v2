# Bad Example — Folder Structure

## Anti-Pattern

A repository with inconsistent, duplicated, or disorganised folders.

---

# Example

```

src/

components/

components2/

new-components/

old/

temp/

backup/

copy/

misc/

helpers/

utils/

stuff/

random/

final/

new-final/

```

---

# Problems

❌ Impossible to navigate.

❌ Duplicate components.

❌ Duplicate services.

❌ Temporary files committed.

❌ Unknown ownership.

❌ Difficult onboarding.

❌ AI becomes confused.

❌ High maintenance cost.

❌ Increased technical debt.

---

# Another Example

```

ProductCard.tsx

ProductCard2.tsx

ProductCardNew.tsx

ProductCardFinal.tsx

ProductCardFinal2.tsx

```

Nobody knows which file should be used.

---

# Violated Engineering Principles

- Repository Structure
- Naming Conventions
- Single Source of Truth
- Maintainability
- Discoverability

---

# Better Repository Structure

```

app/

components/

modules/

services/

hooks/

types/

lib/

sanity/

public/

styles/

docs/

tests/

```

Every directory has one clear responsibility.

---

# Better Component Organisation

```

components/

ProductCard.tsx

ProductGallery.tsx

ProductCarousel.tsx

ProductFilters.tsx

```

Each file has one responsibility.

No duplicate versions.

---

# Repository Rules

Never commit:

temp/

backup/

copy/

old/

new/

misc/

test-copy/

final-final/

---

# Folder Naming Rules

Use:

Lowercase

Hyphens where appropriate

Feature-based organisation

Predictable locations

Avoid:

Random folders

Developer-specific folders

Personal naming conventions

Temporary directories

---

# Lessons Learned

Good folder structures reduce development time.

Good folder structures improve AI accuracy.

Good folder structures improve maintainability.

A clean repository is easier to understand, easier to scale, and easier to maintain.


---

# Do This Instead

See the correct approach in `examples/../../10-design/architecture/04-folder-structure.md` — the canonical folder structure.

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
