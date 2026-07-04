# Phase 4 Part 2 — Commerce Architecture: Implementation Record

## What Was Implemented

### Milestone 1: Foundations
- **`src/lib/commerce/config/index.ts`** — Pinned Shopify API version (`2024-10`), cache TTLs, rate limits, feature flags with env override support
- **`src/lib/commerce/config/env.ts`** — Typed environment schema with fail-fast validation in production, graceful warnings in development
- **`src/lib/commerce/shopify/storefront-client.ts`** — Cost-aware GraphQL client with retry/exponential backoff/circuit breaker
- **`src/lib/commerce/shopify/admin-client.ts`** — Server-only Admin API client with identical resilience patterns
- **`src/lib/commerce/shopify/types.ts`** — Complete TypeScript types for Money, Product, Variant, Cart, Collection, Inventory
- **`src/lib/commerce/shopify/queries/`** — GraphQL queries: fragments, products, collections, cart mutations
- **`src/lib/commerce/stripe/client.ts`** — Stripe server instance (API version `2026-06-24.dahlia`)
- **`src/lib/commerce/stripe/types.ts`** — Institutional payment types (9 purpose categories)
- **`src/lib/commerce/stripe/service.ts`** — Payment Intent creation, refunds, retrieval

### Milestone 2: Sanity Schema Extensions
- **`commerceReference`** — Join key to Shopify (GID-validated, read-only sync fields)
- **`variantReference`** — Maps editorial labels to Shopify variant GIDs
- **`traditionLayers`** — Four-layer honesty framework (Established/Interpreted/Traditional/Ours)
- **`sourceReference`** — Citations with hadith grading, Qur'an refs, verification status
- **`productClinicalNote`** — Clinical notes with review workflow (draft → in-review → approved)
- **`provenanceNote`** — Editorial provenance narrative (distinct from Shopify country-of-origin)
- **`seasonWindow`** — Time-bounding for seasonal collections (no urgency manufacturing)
- **Product extended** with: `commerce`, `purchaseFraming`, `traditionLayers`, `clinicalNotes`, `sources`, `primaryIngredient`, `crossReferences`, `editorialProvenance`
- **Collection extended** with: `shopifyCollectionRef`, `featuredProducts`, `season`, `curationNote`, `intro`, `faqs`, field groups
- **Ingredient evolved** into connective hub with: `traditionLayers`, `sources`, `clinicalNotes`, `relatedProducts`, `relatedArticles`, `relatedCourses`, `relatedJourneys`, `faqs`, `gallery`, field groups

### Milestone 3: Composition Layer
- **`src/lib/commerce/composition/types.ts`** — ProductView, ProductCardView, CollectionView, ImageView
- **`src/lib/commerce/composition/index.ts`** — `composeProductView()`, `composeProductCardViews()`, `composeCollectionView()` — merges Sanity editorial + Shopify commerce with graceful degradation

### Milestone 4: Cart
- **`src/lib/commerce/shopify/cart/service.ts`** — Full Shopify Cart API wrapper (create, get, add, update, remove, discount, note)
- **`src/app/api/cart/route.ts`** — Server proxy with httpOnly cookie persistence (14-day expiry)
- **`src/context/CounterContext.tsx`** — Upgraded to dual-mode: local-only (backward-compatible) and Shopify-backed. Same `useCounter()` interface. Added: `checkoutUrl`, `isUpdating`, `discountCode`, `applyDiscount`, optional `variantId` parameter

### Milestone 5: Checkout & Order Confirmation
- **`src/app/[locale]/the-apothecary/order-confirmation/page.tsx`** — Calm, institutional confirmation page. No upsell, no urgency

### Milestone 6: Webhooks
- **`src/lib/commerce/webhooks/verify.ts`** — HMAC-SHA256 verification (Shopify), Stripe signature verification with timing-safe comparison
- **`src/lib/commerce/webhooks/idempotency.ts`** — In-memory idempotency store (production: Redis)
- **`src/app/api/webhooks/shopify/route.ts`** — Handles product/order/inventory/collection events, triggers revalidation
- **`src/app/api/webhooks/stripe/route.ts`** — Handles payment_intent.succeeded/failed, charge.refunded, disputes

### Milestone 7: Stripe Institutional Payments
- **`src/app/api/payments/route.ts`** — Payment Intent creation API (validated purpose, minimum amount, idempotent)
- **`src/components/commerce/PaymentForm.tsx`** — Stripe Elements wrapper with institutional styling, Apple Pay/Google Pay support

### Milestone 8: Inventory
- **`src/lib/commerce/shopify/inventory.ts`** — Real-time inventory status, derived messaging, back-in-stock registration

### Milestone 9: Customer Accounts
- **`src/lib/commerce/shopify/customers.ts`** — Customer profile + order history via Admin API

### Milestone 10: Security & Performance
- **`src/lib/commerce/security/rate-limit.ts`** — Token-bucket rate limiting (cart/payment/webhook buckets)
- **`src/lib/commerce/security/validation.ts`** — Input sanitisation, email validation, GID validation, IP extraction

### Milestone 11: Reconciliation
- **`src/lib/commerce/reconciliation/index.ts`** — Sanity ↔ Shopify consistency auditing (orphaned products, stale syncs, broken links)

---

## APIs Connected

| System | Protocol | Purpose |
|--------|----------|---------|
| Shopify Storefront API | GraphQL (public) | Products, collections, inventory, cart |
| Shopify Admin API | GraphQL (server) | Orders, customers, fulfilment, reconciliation |
| Stripe API | REST | Payment Intents, refunds, webhooks |
| Sanity Content Lake | GROQ | Editorial data, join keys |

---

## Environment Variables Required

```env
# Shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=xxx
SHOPIFY_ADMIN_ACCESS_TOKEN=xxx
SHOPIFY_WEBHOOK_SECRET=xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## Production Deployment Steps

1. **Configure Shopify store** — create storefront app, generate tokens, set API permissions
2. **Set environment variables** in hosting platform (Vercel/etc)
3. **Register webhooks** in Shopify admin → point to `/api/webhooks/shopify`
4. **Register Stripe webhooks** → point to `/api/webhooks/stripe`
5. **Link products** in Sanity Studio → set `commerce.shopifyProductId` via the commerce tab
6. **Set `purchaseFraming`** for each product (standard / education-first / reference-only)
7. **Verify** cart flow end-to-end in staging
8. **Monitor** webhook delivery in Shopify/Stripe dashboards
9. **Run reconciliation** to verify all links are valid

---

## Security Checks Completed

- [x] Shopify webhook HMAC-SHA256 verification (timing-safe)
- [x] Stripe webhook signature verification (timing-safe, replay protection)
- [x] Cart ID stored in httpOnly secure cookie (never in localStorage)
- [x] Variant IDs never exposed to client localStorage
- [x] Rate limiting on cart, payment, and webhook endpoints
- [x] Input sanitisation on all user-provided values
- [x] Circuit breaker prevents cascading failures
- [x] Environment variables fail-fast in production
- [x] No Shopify-owned data stored in Sanity (source-of-truth firewall)
- [x] GID validation prevents injection
- [x] Idempotency prevents duplicate webhook processing

---

## Performance Architecture

- **Circuit breaker** — auto-opens after repeated Shopify 5xx, resets after 30s
- **Exponential backoff** — retries with jitter prevent thundering herd
- **Cookie-based cart** — no client-side hydration needed for cart state
- **Graceful degradation** — if Shopify unavailable, editorial content still renders
- **Feature flags** — all future commerce features gated (no dead code in production)
- **Composition layer caching** — Shopify data cached for 30s (products), 0s (inventory)
- **Webhook revalidation** — ISR pages refresh on product/inventory/collection changes

---

## Remaining Optional Enhancements

These are flagged for future phases (feature-flagged off):
- [ ] Subscriptions (recurring remedy deliveries)
- [ ] Memberships (institutional patron tier)
- [ ] Gift cards
- [ ] Wishlist / Save for later
- [ ] Wholesale / practitioner accounts
- [ ] Affiliate programme
- [ ] Course bundles (academy + apothecary)
- [ ] Donations (Stripe institutional payments ready)
- [ ] Instalments (Stripe ready, needs frontend)
- [ ] Recently viewed (client-side, no commerce dependency)
- [ ] Frequently bought together (requires order data analysis)
- [ ] Custom Sanity Studio input for Shopify product picker (Admin API ready)
- [ ] Email notifications (back-in-stock, order updates)
- [ ] Redis-backed idempotency and rate limiting for production scale
- [ ] Customer self-service order pages (Admin API ready)

---

## Acceptance Criteria

- [x] Shopify integrated headlessly — acts only as commerce engine
- [x] Sanity remains editorial CMS — no commerce facts stored
- [x] Stripe remains payment infrastructure only — no checkout flow
- [x] Existing design language preserved — no layout/typography/colour changes
- [x] Commerce feels invisible — premium editorial experience maintained
- [x] Backwards compatible — `useCounter()` interface preserved
- [x] Feature-flagged — no dead code in production paths
- [x] Source-of-truth boundary enforced — one fact, one owner
- [x] Webhook-driven revalidation — no stale prices/availability
- [x] Production-ready security — HMAC, signatures, rate limits, sanitisation
- [x] Full TypeScript coverage — zero type errors in commerce layer
