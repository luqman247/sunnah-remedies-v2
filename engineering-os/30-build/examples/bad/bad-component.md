# Bad Example — ProductCard

## Responsibilities

Displays UI.

Fetches products.

Handles checkout.

Processes payments.

Updates user profile.

Manages authentication.

Runs search.

Creates reviews.

Handles analytics.

---

## Problems

❌ Multiple responsibilities.

❌ Difficult to test.

❌ Difficult to reuse.

❌ Large component.

❌ Tight coupling.

❌ Hidden business logic.

---

## Violated Principles

Single Responsibility Principle.

Separation of Concerns.

Reusable Components.

Maintainability.

---

## Better Solution

Split into:

ProductCard

ProductService

CartService

CheckoutService

ReviewService


---

# Do This Instead

See the correct approach in `examples/good/good-component.md` — a small, composed, single-purpose component.

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
