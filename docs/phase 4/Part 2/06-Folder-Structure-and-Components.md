# 06 · Folder Structure & Component Responsibilities

*Where the new commerce layer lives, and what each part is responsible for — without touching a single design component.*
Depends on: Spec 00–05

---

## 6.1 Guiding rule

**Existing presentation components are not modified.** The commerce layer is a set of **new** modules — data access, services, state, routes, webhook receivers — that *feed* existing components with data and *handle transactions* off-screen. If a change would alter a component's markup or styling, it is out of scope. New "components" here are **logic/data wrappers and unstyled shells that render existing design-system pieces**.

The whole layer is isolated behind clean boundaries so a future Hydrogen migration (Spec 02 §2.8) swaps the data layer without touching composition or design.

---

## 6.2 Proposed folder structure (illustrative — adapt to the repo's conventions)

```
/ (existing Next.js app — DO NOT restructure existing design/UI)
├─ app/                              # routes (App Router)
│  ├─ (shop)/
│  │  ├─ apothecary/[handle]/        # product route → composition (Spec 02 §2.3)
│  │  ├─ collections/[handle]/       # collection route
│  │  ├─ cart/                       # full-page cart route (renders existing SR cart shell)
│  │  ├─ account/                    # account surfaces (order history, addresses, downloads…)
│  │  └─ order/confirmation/         # post-checkout return route (SR components)
│  ├─ api/                           # route handlers (server-only)
│  │  ├─ cart/                       # cart mutations proxy → Storefront Cart API
│  │  ├─ checkout/                   # checkoutUrl resolution
│  │  ├─ stripe/                     # Payment Intents, entitlements (institutional)
│  │  ├─ webhooks/
│  │  │  ├─ shopify/                 # verified Shopify webhook receiver
│  │  │  ├─ stripe/                  # verified Stripe webhook receiver
│  │  │  └─ sanity/                  # revalidation receiver
│  │  └─ notify/                     # back-in-stock capture, etc.
│
├─ lib/commerce/                     # THE commerce layer (new, isolated)
│  ├─ shopify/
│  │  ├─ storefront-client/          # cost-aware Storefront API client (Spec 02 §2.5)
│  │  ├─ admin-client/               # server-only Admin API client
│  │  ├─ queries/                    # typed query/fragment definitions (Spec 02 §2.2)
│  │  ├─ cart/                       # cart service (Spec 03)
│  │  └─ types/                      # generated Shopify types
│  ├─ stripe/
│  │  ├─ client/                     # server-side Stripe client
│  │  ├─ intents/                    # Payment Intent orchestration (Spec 04)
│  │  ├─ entitlements/               # entitlement grant/check/revoke (Spec 04 §4.8)
│  │  └─ webhooks/                   # Stripe event handlers
│  ├─ composition/                   # merge Sanity + Shopify + Cloudinary (Spec 01 §1.1)
│  ├─ projection/                    # commerce cache/index (Spec 01 §1.5) — disposable
│  ├─ reconciliation/               # drift repair jobs (Spec 05 §5.2)
│  ├─ webhooks/                      # shared verify + idempotency + queue (Spec 05 §5.1)
│  ├─ pricing-display/               # tax/format helpers (display only)
│  └─ config/                        # pinned API versions, TTLs, feature flags (Spec 00 §0.7–0.8)
│
├─ sanity/                           # existing (Phase 2) — add commerce reference block only (Spec 01 §1.4)
├─ components/                       # existing SR design system — UNCHANGED
└─ env/                              # typed env schema; secrets server-only (Spec 07)
```

**Key boundaries:**
- `components/` (design system) is **read-only** for this phase.
- `lib/commerce/` is **the only place** Shopify/Stripe are touched.
- Composition happens server-side in `lib/commerce/composition` and is consumed by routes, which pass plain data to existing components.

---

## 6.3 Component & module responsibilities

| Module | Responsibility | Must NOT |
|--------|----------------|----------|
| **Storefront client** | Cost-aware, retried, typed reads + cart mutations (Spec 02) | Leak tokens to client; overfetch |
| **Admin client** | Server-only order/inventory/customer/reconcile reads | Ever run client-side |
| **Queries/fragments** | Single source of query shapes; minimal fields | Live inline in components |
| **Cart service** | Cart CRUD via Cart API; cartId persistence; checkoutUrl | Render UI; hold card data |
| **Composition layer** | Merge editorial (Sanity) + commerce (Shopify) + media (Cloudinary) into view models | Author facts; change design |
| **Projection/index** | Fast listing/search cache | Be treated as truth |
| **Reconciliation** | Repair drift from authoritative sources | Overwrite the source |
| **Stripe intents** | Create/confirm Payment Intents (institutional) | Grant entitlements pre-webhook |
| **Entitlement service** | Grant/check/revoke access on verified webhooks | Trust client callbacks |
| **Webhook receivers** | Verify, dedupe, ack, enqueue | Do heavy work inline; trust unverified events |
| **Config** | Pinned versions, TTLs, flags | Hardcode secrets |
| **Existing design components** | Render the artefact/cart/account **exactly as designed** | Be modified for commerce |

---

## 6.4 The composition contract (view models)

Routes call the composition layer and receive **plain, typed view models** that existing components consume. Example shapes (data contracts, not code):

- **ProductView** = editorial (from Sanity: title, narrative, ingredient history, clinical notes, references, FAQs, photography order, cross-links, `purchaseFraming`) + commerce (from Shopify: price, compare-at, variants, availability, SKU, weight, dimensions, country of origin) + media (Cloudinary URLs).
- **CollectionView** = editorial framing (Sanity) + live membership/availability (Shopify).
- **CartView** = cart lines, totals, estimated cost, discounts, gift note, curated recommendations (Sanity), checkoutUrl.
- **AccountView** = identity, orders, addresses, entitlements (downloads, certificates, courses), invoices.

Because components receive **data**, not new markup, the design is untouched while commerce becomes fully functional.

---

## 6.5 State management

- **Cart state:** server-authoritative (Cart API) with optimistic client updates (Spec 03/07); `cartId` in a secure cookie; no cart data in localStorage beyond non-sensitive hints.
- **Recently viewed:** client-only, anonymous (Spec 01 §1.8).
- **Auth/session:** Shopify customer session; entitlements checked server-side.
- **No sensitive data client-side:** no card data, no Admin tokens, no PII beyond what a logged-in customer already owns.

---

## 6.6 Acceptance criteria (Structure)

- [ ] All Shopify/Stripe access is confined to `lib/commerce/`; design components unchanged.
- [ ] Routes consume typed view models from the composition layer; components receive data only.
- [ ] Webhook receivers, clients, entitlements, reconciliation, and projection each have a single clear responsibility.
- [ ] The data layer is portable (Hydrogen-ready); composition and design are independent of it.
- [ ] No secrets, Admin tokens, card data, or server-only logic exist client-side.

*Proceed to Spec 07.*
