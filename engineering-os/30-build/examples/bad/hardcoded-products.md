# Bad Example — Hardcoded Products

## Anti-Pattern

Product information is stored directly inside React components instead of being managed through Sanity CMS.

---

## Example

```tsx

const products = [

  {

    name: "Premium Black Seed Oil",

    price: 24.99,

    description: "Cold-pressed Nigella Sativa oil.",

    image: "/black-seed.jpg",

  },

  {

    name: "Herat Saffron",

    price: 19.99,

    description: "Premium Grade A saffron.",

    image: "/saffron.jpg",

  }

];

```

---

# Problems

❌ Editors cannot update products.

❌ Developers must redeploy for every product change.

❌ Duplicate product data across components.

❌ Difficult to support multilingual content.

❌ Poor scalability.

❌ High maintenance cost.

❌ Increased risk of inconsistent data.

---

# Violated Engineering Principles

- Single Source of Truth
- CMS-First Architecture
- Separation of Concerns
- Editorial Independence
- Maintainability

---

# Better Approach

Products should live in Sanity.

React components should only display data retrieved from ProductService.

Flow:

Sanity

↓

ProductService

↓

Page

↓

ProductCard

---

# Lessons Learned

Business content belongs in the CMS.

Never hardcode products, prices, descriptions, testimonials, or marketing content.


---

# Do This Instead

See the correct approach in `examples/good/hijama-booking-flow.md` — CMS-driven content with server-side logic.

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
