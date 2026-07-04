# Sunnah Remedies — Commerce Implementation Specification

**A specification for Cursor.** Phase 4: Institutional Commerce.
Integrate world-class commerce **beneath** the existing headless frontend (Phases 1–3) — without redesigning anything.

> **No application code in this spec. It is architecture, contracts, and checklists.** Cursor implements against it.
> **Do not** alter typography, layout, or components. The frontend already is the institution's identity.

---

## The philosophy in one line
Sunnah Remedies is an educational institution with curated products, not an ecommerce site. **Commerce should feel almost invisible** — Apple Store / Aesop / Monocle, never Amazon. Every purchase feels like acquiring a carefully documented artefact. The presentation layer always belongs to Sunnah Remedies; Shopify and Stripe simply power the mechanics beneath it.

## The one architectural decision to read first
**ADR-001 (Spec 00 §0.5):** two distinct transaction paths —
- **Catalog → Shopify Checkout** (branded, hosted; Shopify Payments/wallets; native tax, shipping, discounts, fraud, abandoned-recovery).
- **Institutional flows → Stripe direct** (donations, memberships, subscriptions, instalments, invoices, course access).

This resolves the brief's Shopify-Checkout-*and*-Stripe tension by splitting on transaction *type* rather than forcing one contradictory flow. Rationale and the rejected alternative are documented in Spec 00.

---

## The document set

| Spec | Title | Read it for |
|------|-------|-------------|
| **00** | Master Architecture Specification | Philosophy, the four sources of truth, ADR-001 (checkout/payments), system + data-flow diagrams, environments, feature flags, non-negotiables. **Start here.** |
| **01** | Data Model, Sanity↔Shopify Sync, Collections & Inventory | The join key, field-ownership matrix, sync strategy, collections, real-time honest inventory. |
| **02** | API Architecture, Data Flow, Caching, Rate Limiting & Errors | Storefront/Admin APIs, GraphQL discipline, editorial-first streaming, caching, cost-aware rate limiting, error/resilience, Hydrogen-readiness. |
| **03** | Cart & Checkout | Institutional cart on SR components (Cart API state), drawer + full page, capabilities, branded Shopify checkout handoff. |
| **04** | Stripe — Institutional Payment Infrastructure | Payment Intents, wallets, receipts/refunds, failed-payment recovery, entitlements, future subs/donations/instalments/invoices. |
| **05** | Webhooks, Orders, Customers, Fulfilment, Shipping, Taxes & Discounts | The event backbone, reconciliation, order lifecycle, accounts, physical + digital fulfilment, VAT, discounts, abandoned recovery. |
| **06** | Folder Structure & Component Responsibilities | Where the commerce layer lives, module responsibilities, composition contracts — design components untouched. |
| **07** | Security & Performance | PCI/SAQ A, webhook verification, secrets, fraud, logging/monitoring; caching, optimistic UI, prefetch, streaming, CWV. |
| **08** | Testing, Migration, Production Readiness, Deployment & Acceptance | Staged migration, all checklists, master acceptance criteria, and the `[VERIFY]` register. |

---

## How the brief maps to these specs

| Brief section | Spec |
|---------------|------|
| Commerce philosophy | 00 |
| Shopify architecture (Storefront/Admin, GraphQL, caching, errors, rate limiting) | 02 |
| Products, data fields, collections, inventory | 01 |
| Cart | 03 |
| Checkout | 03 (+ ADR-001 in 00) |
| Customers, orders, shipping, taxes, discounts | 05 |
| Future commerce (subs, memberships, wholesale, practitioner, affiliate…) | 00 (flags) + 04 (Stripe flows) + 05 |
| Stripe (payments, wallets, refunds, webhooks, recovery, future) | 04 |
| Security | 07 (+ 08 checklist) |
| Performance | 07 (+ 08 checklist) |
| Editorial integration | 01, 02 (editorial-first streaming) |
| Sanity integration (source-of-truth split) | 00 §0.3, 01 |
| Architecture deliverables (diagrams, folder structure, webhooks, migration, all checklists) | 00, 02, 05, 06, 08 |

---

## Working with this spec in Cursor
- Point Cursor at **Spec 00** first for the mental model, then the spec matching the module you're building.
- `[VERIFY]` tags mark version- or plan-sensitive details to confirm against current Shopify/Stripe docs (collected in **Spec 08 §8.8**).
- The **non-negotiables** (Spec 00 §0.10) and **master acceptance criteria** (Spec 08 §8.7) are the definition of done.

*This spec assumes continuity with the institution's operating standards (integrity-first, honest inventory/pricing, artefact-quality confirmations, privacy by construction) established in earlier phases.*
