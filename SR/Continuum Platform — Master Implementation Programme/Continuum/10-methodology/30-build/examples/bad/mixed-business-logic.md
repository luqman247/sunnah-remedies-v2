# Bad Example — Mixed Business Logic

## Anti-Pattern

Business rules are embedded directly inside UI components.

---

# Example

```tsx

if ([user.country](http://user.country) === "UK" && product.stock > 0) {

  if (user.membership === "Gold") {

    price = price * 0.85;

  }

}

```

---

# Problems

❌ Business rules hidden inside UI.

❌ Impossible to reuse.

❌ Difficult to test.

❌ Pricing duplicated across pages.

❌ High maintenance cost.

---

# Violated Engineering Principles

- Separation of Concerns
- Reusable Services
- Business Logic Layer
- Maintainability

---

# Better Architecture

ProductCard

↓

PricingService

↓

MembershipService

↓

TaxService

↓

DiscountService

↓

CheckoutService

UI should display.

Services should calculate.

---

# Benefits

✓ Reusable.

✓ Testable.

✓ Centralised.

✓ Easy to modify.

✓ Easier debugging.

---

# Lessons Learned

Business logic belongs in services, not components.


---

# Do This Instead

See the correct approach in `examples/good/hijama-booking-flow.md` — business logic in lib/, presentation in components/.

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
