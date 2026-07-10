# 02 · API Architecture, Data Flow, Caching, Rate Limiting & Errors

*How the app talks to Shopify — safely, quickly, and within limits.*
Depends on: Spec 00, 01

---

## 2.1 Two Shopify APIs, two roles

| API | Used for | Auth | Exposure |
|-----|----------|------|----------|
| **Storefront API** (GraphQL) | Reader-facing reads (products, collections, availability) and **cart** operations | Public Storefront access token (scoped, read/cart) | Called **server-side** by our app; token never shipped to client unless using the designated public storefront token pattern — prefer server proxy |
| **Admin API** (GraphQL) | Server-only: order lookups, fulfilment, draft orders, inventory detail, customer admin, reconciliation | Admin access token (secret) | **Server-only, never client** |

**Rule:** the client never holds an Admin token and never calls Admin API. Cart and catalog reads are proxied through our server (route handlers / server actions), so tokens, query cost, and caching stay under our control.

---

## 2.2 GraphQL discipline (query design, not code)

We describe *query shapes*; Cursor implements them against the pinned API version.

- **Request only needed fields.** Every query is minimal — it fetches exactly the fields the composing component needs, nothing more. This controls query cost (rate limits, §2.5) and payload size.
- **Typed operations.** Generate types from the Shopify schema so responses are strongly typed end-to-end. Queries live in a dedicated data-access layer (Spec 06), never inline in components.
- **Fragments for reuse.** Define shared field selections (a "product card" selection, a "product detail" selection, a "cart" selection) so listing and detail views stay consistent and cheap.
- **Pagination by cursor.** All list reads use cursor pagination; never fetch unbounded lists.
- **No overfetching for composition.** Since editorial comes from Sanity, Shopify queries deliberately **omit** narrative fields — they fetch price, availability, variants, SKU, weight, dimensions, country of origin, collection membership only.

**Named query set (the contract):**

| Query | Returns (fields) | Caller |
|-------|------------------|--------|
| `ProductCommerceByHandle` | price range, variants (id, price, availability, SKU), inventory status, weight, dimensions, country of origin | Product page composition |
| `ProductCardCommerce` | price range, availability, first-variant id | Listing/collection cards |
| `CollectionMembership` | product handles + availability for a collection | Collection pages, projection |
| `CartQuery` | cart lines, totals, discounts, estimated cost, checkoutUrl | Cart (Spec 03) |
| `InventoryStatus` | live availability for a variant | Real-time inventory (Spec 01 §1.7) |
| Admin: `OrderStatus` | order state, fulfilment, tracking | Order views (Spec 05) |
| Admin: `Reconcile` | product/inventory truth for cache repair | Reconciliation (Spec 05) |

---

## 2.3 Data flow — a product page (the canonical path)

```mermaid
sequenceDiagram
  participant Browser
  participant App as Next.js (server)
  participant Sanity
  participant Shopify as Storefront API
  participant Cloud as Cloudinary

  Browser->>App: GET /apothecary/[handle]
  App->>Sanity: Fetch editorial (cached/ISR)
  App->>Shopify: ProductCommerceByHandle (live, short cache)
  App->>Cloud: Image URLs (transform params)
  App->>App: Compose editorial + commerce + media
  App-->>Browser: Streamed HTML (editorial first, commerce hydrates)
  Note over Browser: Existing SR components render; buy affordance appears with live price/stock
```

**Editorial-first streaming (the invisible-commerce technique).** The educational content (Sanity) is static/fast and streams first; the live commerce state (price/availability) resolves in parallel and hydrates the buy affordance. The reader *starts learning immediately*; commerce arrives quietly a beat later. This is how we make commerce feel almost invisible **without changing a single component's design** — only the order and source of data delivery.

---

## 2.4 Caching strategy

Layered, with volatility-appropriate TTLs. **Inventory is never in a long cache.**

| Data | Strategy | TTL `[VERIFY per traffic]` |
|------|----------|------|
| Editorial (Sanity) | Static generation + on-demand revalidation on Sanity webhook | Until revalidated |
| Product commerce (price, variants, dims) | Server cache, short TTL + webhook revalidation | Seconds–minutes |
| Inventory/availability | **Live read**, minimal/no cache | ~0 (real-time) |
| Collection membership | Cached + webhook revalidation | Minutes |
| Commerce projection/index (Spec 01 §1.5) | Rebuilt by webhook | Event-driven |
| Cart | Not cached (per-session, live) | — |
| Images (Cloudinary) | CDN-cached (Phase 3) | Long |

**Revalidation is event-driven, not time-guessed:** webhooks (Spec 05) invalidate exactly what changed. Time-based TTLs are a backstop, not the primary mechanism.

**Cache keys** include API version and locale/market (future international) so upgrades and expansions don't serve stale or wrong-market data.

---

## 2.5 Rate limiting `[VERIFY current limits]`

Both Shopify GraphQL APIs use **calculated query cost with a leaky-bucket** model (points restored over time), not simple request counts. Stripe uses request-rate limits. Design accordingly:

- **Minimise query cost** by requesting only needed fields (§2.2) — the cheapest defence.
- **Centralised client** for each API wraps every call with:
  - **Cost-aware throttling** — respect returned cost/throttle metadata; back off before hitting the ceiling.
  - **Retry with exponential backoff + jitter** on throttle/`429`/`5xx`, with a max-attempts ceiling.
  - **Concurrency limiting** — a bounded queue so bursts (e.g. a webhook storm) don't exhaust the bucket.
- **Cache and projection** (§2.4) absorb read pressure so listing/search rarely hit Shopify per-request.
- **Webhook-driven revalidation** avoids polling entirely (polling is the classic rate-limit killer).
- **Separate buckets** conceptually: user-facing reads vs. background reconciliation run through different queues so background work can't starve the reader path.

---

## 2.6 Error handling

Commerce must **fail invisibly and honestly** — never a broken artefact.

| Failure | Behaviour |
|---------|-----------|
| Shopify read times out / errors | Serve cached editorial; show soft "availability temporarily unavailable"; disable buy affordance gracefully; log + alert |
| Inventory read fails | Fall back to "check availability" state; never assert in-stock when unknown |
| Cart operation fails | Optimistic UI rolls back; friendly, quiet error; retry offered (Spec 03) |
| Checkout URL unavailable | Clear message + retry; cart preserved; no lost basket |
| Admin API (orders) fails | Order view shows last-known + "refreshing"; retry; never a raw error |
| Webhook processing fails | Idempotent retry + dead-letter queue; reconciliation repairs (Spec 05) |
| Stripe failure (institutional) | Spec 04 recovery |

**Principles:** every error path has a designed, calm fallback (mirrors Blueprint Doc 01 "every failure state is designed"); we never show a raw stack trace, never assert a fact we couldn't verify (e.g. stock), and never lose a reader's cart. All errors are logged with correlation IDs (Spec 07) but never leak secrets or PII.

---

## 2.7 Resilience patterns

- **Circuit breaker** around each backend: if Shopify is failing, stop hammering it, serve degraded-but-readable pages, and recover automatically.
- **Timeouts** on every outbound call; no unbounded waits.
- **Graceful degradation ladder:** full page → editorial + soft availability → editorial-only (reference mode). The reader always gets the artefact's story.
- **Idempotency** on all state-changing operations keyed to the operation (cart mutations, webhook handling) so retries are safe.

---

## 2.8 Hydrogen compatibility (future)

The brief requires future Hydrogen compatibility **without adopting it now**. Preserve optionality:

- **Isolate all Shopify access** behind a data-access layer (Spec 06) with framework-agnostic function signatures. Components consume *our* typed functions, not Shopify SDK internals.
- **Use the Storefront Cart API + `checkoutUrl`** pattern (Spec 03) — the same model Hydrogen uses — so a future migration is a swap of the data layer, not a rewrite of composition or components.
- **Keep cart state and commerce types** in a portable module independent of the current framework's specifics.
- Result: adopting Hydrogen later (or Shopify's Oxygen hosting) is an infrastructure decision, not a redesign — consistent with "never touch the frontend."

---

## 2.9 Acceptance criteria (API & Data Flow)

- [ ] Client never holds Admin tokens; all Shopify access is server-proxied.
- [ ] Queries fetch only needed fields; typed; fragment-based; cursor-paginated.
- [ ] Editorial streams first; commerce hydrates — commerce feels invisible, components unchanged.
- [ ] Caching is volatility-appropriate and event-driven; inventory never long-cached.
- [ ] Every API client is cost-aware with backoff, jitter, concurrency limits; no polling.
- [ ] Every failure has a calm, honest fallback; carts never lost; no raw errors/PII leaked.
- [ ] Circuit breakers, timeouts, idempotency, and a degradation ladder are in place.
- [ ] Shopify access is isolated behind a portable data layer for future Hydrogen migration.

*Proceed to Spec 03.*
