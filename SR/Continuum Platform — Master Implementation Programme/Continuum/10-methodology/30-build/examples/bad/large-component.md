# Bad Example — Large Component

## Anti-Pattern

One React component performs multiple unrelated responsibilities.

---

# Example

ProductPage.tsx

Responsibilities:

- Fetches products.
- Handles filtering.
- Manages search.
- Updates cart.
- Handles checkout.
- Displays UI.
- Makes API requests.
- Sends analytics.
- Opens modals.
- Handles authentication.

---

# Problems

❌ Difficult to understand.

❌ Difficult to test.

❌ Difficult to reuse.

❌ High coupling.

❌ Frequent merge conflicts.

❌ Slow development.

---

# Violated Engineering Principles

- Single Responsibility Principle
- Separation of Concerns
- Reusability
- Maintainability

---

# Better Architecture

ProductPage

↓

ProductGrid

↓

ProductCard

↓

ProductService

↓

CartService

↓

CheckoutService

↓

AnalyticsService

Each component should have one responsibility.

---

# Lessons Learned

Large components become technical debt.

Small focused components remain maintainable.


---

# Do This Instead

See the correct approach in `examples/good/good-component.md` — small primitives composed upward.

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
