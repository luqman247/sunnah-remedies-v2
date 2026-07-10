# Continuum Platform — P6: Commerce & Payments

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 6 (§19), §8 (Commerce), and module specs §4.5 (Commerce), §4.6 (Payments).
>
> **Duration:** 2 weeks · **Tier:** Capability

Enable selling — physical, digital, and subscription — via headless Shopify, with Stripe for non-storefront flows (memberships, donations, fees). PCI scope and money-critical correctness stay with the providers; the platform owns the experience.

---

## Objectives

- Implement Commerce (§4.5): headless Shopify catalog, cart, checkout orchestration, orders, and customers.
- Implement Payments (§4.6): Stripe payment intents, subscriptions, invoices, and refunds for non-storefront flows.
- Mirror Shopify products to CMS Product docs for editorial context (§8).
- Support digital-product entitlement and subscription state; expose the marketplace extension seam.
- Link commerce customers and payment records to Identity by id.

## Deliverables

- modules/commerce with catalog/cart/order interfaces over Shopify.
- modules/payments with charge/subscribe/refund over Stripe.
- Product mirror sync (Shopify → CMS Product docs).
- Digital entitlement grants; subscription state.
- Commerce-related updates to Platform Guide and Deployment Guide.

## Repository changes

- Add modules/commerce and modules/payments.
- Implement the commerce adapter (Shopify Storefront) and payment adapter (Stripe).
- Add webhook handlers for Shopify orders and Stripe events via the API gateway.
- Add commerce cart/checkout surfaces to apps/shell using design-system patterns.

## Folder structure

```
modules/
├── commerce/
│   ├── catalog/        # products, variants, inventory (Shopify)
│   ├── cart/           # cart + checkout orchestration
│   ├── orders/         # orders, customers, discounts, gift cards
│   ├── entitlement/    # digital product access
│   └── interface/      # commerce.catalog / cart / order + events
└── payments/
    ├── charges/        # payment intents, refunds
    ├── subscriptions/  # recurring billing (non-Shopify)
    ├── invoices/       # invoicing
    └── interface/      # payments.charge / subscribe / refund + events
```

## Modules affected

- Commerce (§4.5)
- Payments (§4.6)
- Identity — customer linkage
- CMS — product mirror
- Operations — fulfilment/reconciliation workflows
- Notifications — order/payment emails

## Interfaces to implement

- commerce.catalog / commerce.cart / commerce.order.
- Events: order.created, order.fulfilled, subscription.changed.
- payments.charge / payments.subscribe / payments.refund.
- Events: payment.succeeded, payment.failed, subscription.renewed.

## External services

- Shopify (headless, Storefront + Admin APIs) via the commerce adapter.
- Stripe (payments, subscriptions, invoices) via the payment adapter.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| SHOPIFY_STORE_DOMAIN | Shopify store domain. | yes |
| SHOPIFY_STOREFRONT_TOKEN | Storefront API token. | yes |
| SHOPIFY_ADMIN_TOKEN | Admin API token (secret manager). | yes (for sync) |
| SHOPIFY_WEBHOOK_SECRET | Verifies Shopify webhooks. | yes |
| STRIPE_SECRET_KEY | Stripe secret (secret manager). | yes |
| STRIPE_WEBHOOK_SECRET | Verifies Stripe webhooks. | yes |
| STRIPE_PUBLISHABLE_KEY | Client-side Stripe key. | yes |

## Acceptance criteria

- A generated store transacts end to end: browse → cart → checkout → order.
- PCI scope stays with providers; the platform never handles raw card data.
- Subscriptions and digital entitlements work (recurring physical via Shopify; non-storefront recurring via Stripe).
- Products mirror to CMS Product docs for editorial context; inventory reflects Shopify.
- Customers and payment records link to Identity by id.

## Testing requirements

- Unit: catalog mapping, cart operations, entitlement grants, subscription state transitions.
- Integration: checkout round-trip (test mode); Shopify order webhook → order.created; Stripe payment → payment.succeeded.
- Webhook security: unsigned/invalid webhooks rejected; idempotent processing on retry.
- Reconciliation: order/payment state matches provider after simulated failures.

## Production readiness checklist

- [ ] Webhooks signature-verified and idempotent; replay-safe.
- [ ] Provider keys in the secret manager; publishable keys scoped to client.
- [ ] Checkout handled by the provider (no card data in platform logs).
- [ ] Fulfilment and reconciliation workflows wired via Operations.
- [ ] Refund/chargeback handling and order-status notifications in place.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Money correctness | State drifts between platform and provider. | Treat providers as source of truth; reconcile via webhooks; idempotent handlers. |
| PCI scope creep | Card data touches the platform. | Provider-hosted checkout; never accept/store PAN; keep logs card-free. |
| Webhook spoofing | Forged webhooks trigger fulfilment. | Verify signatures; idempotency keys; reject on failure. |
| Inventory mismatch | CMS mirror diverges from Shopify. | Shopify is authoritative for inventory; mirror is read-only editorial context. |

## Dependencies

- Phase 0 (Core, adapters).
- Phase 2 (CMS Product mirror).
- Phase 3 (identity/customer linkage, gateway, secrets).
- Phase 5 (workflows for fulfilment; notifications for order emails).

## Documentation updates

- Document Commerce and Payments interfaces and webhook contracts.
- ADR: headless-Shopify boundary and Stripe-for-non-storefront split.
- Update Platform Guide with commerce activation.
- Update Deployment Guide with webhook endpoints and provider setup.

---

## Milestones & tasks

### Milestone 6.1 — Catalog & product mirror

**Objective.** Products flow from Shopify into the platform and CMS.

#### Task 6.1.1 — Implement the Shopify commerce adapter

- **Inputs:** Spec §8, §2.2; Shopify credentials.
- **Outputs:** The commerce adapter resolves to Shopify Storefront behind the commerce interface.
- **Files created:** `packages/adapters/commerce-shopify/`, `modules/commerce/interface/`
- **Files modified:** `adapters index`
- **Verification steps:**
  - Catalog reads from Shopify.
  - No Shopify SDK leaks outside the adapter.
- **Manual QA steps:**
  - List products via the interface; confirm data matches the Shopify store.

#### Task 6.1.2 — Implement commerce.catalog (products, variants, inventory)

- **Inputs:** Spec §8 catalog concerns.
- **Outputs:** commerce.catalog exposes products, variants, and inventory.
- **Files created:** `modules/commerce/catalog/`
- **Files modified:** `commerce interface`
- **Verification steps:**
  - Variants and inventory reflect Shopify.
  - Out-of-stock states surface correctly.
- **Manual QA steps:**
  - Adjust inventory in Shopify; confirm the change appears via the interface.

#### Task 6.1.3 — Implement product mirror to CMS

- **Inputs:** Spec §8 (catalogue mirrored to CMS Product docs); Operations jobs.
- **Outputs:** A sync job mirrors Shopify products to read-only CMS Product docs for editorial context.
- **Files created:** `modules/commerce sync job`
- **Files modified:** `operations jobs`, `cms Product usage`
- **Verification steps:**
  - New Shopify products create/refresh CMS Product docs.
  - Mirror is read-only for inventory.
- **Manual QA steps:**
  - Add a Shopify product; confirm the mirrored CMS doc appears with editorial fields available.

### Milestone 6.2 — Cart, checkout & orders

**Objective.** End-to-end purchase with provider-hosted checkout.

#### Task 6.2.1 — Implement cart and checkout orchestration

- **Inputs:** Spec §8 (platform renders cart; provider handles checkout).
- **Outputs:** commerce.cart operations; checkout hands off to the provider safely.
- **Files created:** `modules/commerce/cart/`
- **Files modified:** `commerce interface`, `apps/shell cart surface`
- **Verification steps:**
  - Cart add/update/remove works.
  - Checkout redirects to provider-hosted flow.
- **Manual QA steps:**
  - Build a cart and reach provider checkout in test mode; confirm no card data touches the platform.

#### Task 6.2.2 — Implement orders, customers, discounts, gift cards

- **Inputs:** Spec §8 order concerns; Identity linkage.
- **Outputs:** commerce.order exposes orders/customers; discounts and gift cards surfaced; customers linked to Identity.
- **Files created:** `modules/commerce/orders/`
- **Files modified:** `commerce interface`
- **Verification steps:**
  - Orders retrievable and linked to a user.
  - Discounts/gift cards apply.
- **Manual QA steps:**
  - Place a test order; confirm it links to the signed-in user and reflects a discount.

#### Task 6.2.3 — Handle Shopify order webhooks

- **Inputs:** Spec §8; API gateway; SHOPIFY_WEBHOOK_SECRET.
- **Outputs:** Signed, idempotent webhook handlers emit order.created/fulfilled.
- **Files created:** `commerce webhook handlers`
- **Files modified:** `settings/api-gateway routes`
- **Verification steps:**
  - Valid webhook emits events.
  - Invalid signature rejected; retries idempotent.
- **Manual QA steps:**
  - Replay a webhook; confirm idempotency and correct event emission.

### Milestone 6.3 — Payments & subscriptions

**Objective.** Non-storefront money movement via Stripe.

#### Task 6.3.1 — Implement the Stripe payment adapter

- **Inputs:** Spec §4.6, §2.2; Stripe credentials.
- **Outputs:** The payment adapter resolves to Stripe behind the payments interface.
- **Files created:** `packages/adapters/payments-stripe/`, `modules/payments/interface/`
- **Files modified:** `adapters index`
- **Verification steps:**
  - A test charge succeeds.
  - No Stripe SDK leaks outside the adapter.
- **Manual QA steps:**
  - Run a test-mode charge; confirm success and SCA handling.

#### Task 6.3.2 — Implement charges, refunds, and invoices

- **Inputs:** Spec §4.6 (payment intents, refunds, invoices).
- **Outputs:** payments.charge/refund and invoicing with SCA/3DS.
- **Files created:** `modules/payments/charges/`, `modules/payments/invoices/`
- **Files modified:** `payments interface`
- **Verification steps:**
  - Charge, refund, and invoice flows work in test mode.
  - SCA challenges handled.
- **Manual QA steps:**
  - Issue and refund a test charge; confirm states and receipts.

#### Task 6.3.3 — Implement subscriptions

- **Inputs:** Spec §4.6 subscriptions (non-Shopify recurring).
- **Outputs:** payments.subscribe with lifecycle; subscription.renewed/changed events.
- **Files created:** `modules/payments/subscriptions/`
- **Files modified:** `payments interface`
- **Verification steps:**
  - Subscription creates and renews in test mode.
  - Lifecycle events emitted.
- **Manual QA steps:**
  - Create a test subscription; simulate renewal; confirm events.

#### Task 6.3.4 — Handle Stripe webhooks and implement digital entitlement

- **Inputs:** Spec §8 digital products; §4.6; STRIPE_WEBHOOK_SECRET.
- **Outputs:** Signed idempotent Stripe webhooks emit payment events; successful purchase grants digital entitlement.
- **Files created:** `payments webhook handlers`, `modules/commerce/entitlement/`
- **Files modified:** `settings/api-gateway routes`, `commerce interface`
- **Verification steps:**
  - Valid webhook emits payment.succeeded; entitlement granted.
  - Invalid signature rejected.
- **Manual QA steps:**
  - Complete a test digital purchase; confirm entitlement unlocks the asset/download.

