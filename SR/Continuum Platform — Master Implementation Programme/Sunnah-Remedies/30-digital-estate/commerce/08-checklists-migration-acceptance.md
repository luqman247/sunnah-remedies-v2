# 08 · Testing, Migration, Production Readiness, Deployment & Acceptance

*The checklists that turn this specification into a safe, staged launch.*
Depends on: Spec 00–07

---

## 8.1 Migration strategy (from no-commerce to invisible-commerce)

A staged rollout — never a big-bang. Each phase is reversible and behind flags (Spec 00 §0.8).

**Stage 0 — Foundations (no customer-visible change)**
- Provision Shopify (dev store), Stripe (test mode); pin API versions; set up env/secrets (Spec 07).
- Build `lib/commerce` clients (Storefront/Admin/Stripe), config, and the webhook receivers (verified, idempotent).
- Add the Sanity `commerce` reference block (Spec 01 §1.4); link a **pilot set** of products.

**Stage 1 — Read-only composition (internal/preview)**
- Compose editorial + commerce on product/collection pages behind a flag; verify field ownership and honest inventory in preview.
- No cart yet. Validate caching, rate-limit behaviour, error fallbacks, streaming.

**Stage 2 — Cart (preview → staging)**
- Cart API integration; drawer + full page on SR components; optimistic UI.
- Test add/update/remove, discounts, gift notes, estimates, edge cases (Spec 03 §3.8).

**Stage 3 — Checkout handoff (staging, test payments)**
- `checkoutUrl` redirect; branded checkout; return route + confirmation.
- `orders/*` webhooks → order views, institutional emails, fulfilment triggers; reconciliation running.
- End-to-end test-mode purchases (physical, digital, mixed).

**Stage 4 — Stripe institutional flows (staging, test mode)**
- Payment Intents + entitlements for the first institutional flow (e.g. donations or a course); dunning/recovery tested.

**Stage 5 — Soft launch (production, limited)**
- Live keys; a small live catalog; real transactions monitored closely; abandoned-recovery live.
- Rollback plan ready (flags off → editorial-only, still a beautiful readable site).

**Stage 6 — Full launch & future flags**
- Full catalog; then enable future flags (subscriptions, memberships, gift cards, wholesale, practitioner, affiliate, bundles) one at a time, each with its own acceptance pass.

**Rollback principle:** at every stage, turning the commerce flags off returns the site to a fully functional editorial institution — commerce is additive and reversible.

---

## 8.2 Testing checklist

**Unit / integration**
- [ ] Composition merges Sanity + Shopify + Cloudinary correctly; missing-link → editorial-only.
- [ ] Field ownership enforced; no double-authored facts.
- [ ] Storefront/Admin clients: cost-aware throttling, backoff, concurrency limits.
- [ ] Cart service: add/update/remove/note/discount; inventory validation; checkoutUrl.
- [ ] Stripe intents + entitlement grant/check/revoke.
- [ ] Webhook receivers: signature verify, dedupe/idempotency, async enqueue, DLQ.
- [ ] Reconciliation repairs seeded drift.

**End-to-end (test mode)**
- [ ] Guest purchase (physical) → confirmation → order view → fulfilment/tracking → emails.
- [ ] Logged-in purchase → history/addresses.
- [ ] Digital purchase → entitlement → signed download → resend fallback.
- [ ] Mixed cart → split fulfilment.
- [ ] Discount code, gift card, gift note.
- [ ] Abandoned checkout → single respectful recovery.
- [ ] Stripe donation/membership → entitlement → receipt → refund → dunning on failed recurring.
- [ ] Wallets: Apple Pay / Google Pay / Express Checkout.

**Resilience / failure states**
- [ ] Shopify outage → editorial-only graceful page; no broken artefact.
- [ ] Inventory read fails → "check availability", never false in-stock.
- [ ] Card declined / 3DS challenge → honest inline recovery, no double-charge.
- [ ] Webhook missed → reconciliation repairs state.
- [ ] Sold-out-in-cart, price-changed, invalid-discount, lost-cart → all designed fallbacks (Spec 03 §3.8).

**Integrity (institutional)**
- [ ] Inventory always live; no oversell.
- [ ] No fake compare-at; no manufactured urgency; recommendations curated/honest.
- [ ] Editorial streams first; commerce never interrupts the story.

**Non-functional**
- [ ] CWV budgets met (LCP/INP/CLS/TTFB); zero layout shift on price/stock hydration.
- [ ] Accessibility of cart/account surfaces preserved (existing standards).
- [ ] Rate-limit/load test: burst traffic and webhook storms handled.
- [ ] Security tests (§8.5).

---

## 8.3 Production-readiness checklist

- [ ] API versions pinned; upgrade plan documented.
- [ ] Secrets in secret store; env schema validated at boot; no secrets client-side.
- [ ] Webhooks registered, verified, idempotent; DLQ + alerting live.
- [ ] Reconciliation scheduled; drift alerts configured.
- [ ] Monitoring/alerting on payments, orders, webhooks, DLQ depth, drift, error/throttle rates, latency, CWV.
- [ ] Structured logging with correlation IDs; no PII/secrets in logs.
- [ ] Fraud tooling enabled (Shopify + Stripe Radar); high-risk-order review process (Handbook Ch 05).
- [ ] Institutional emails wired to webhooks (confirmation, dispatch, arrival, recovery) in the SR voice.
- [ ] Checkout branded to design system; return/confirmation on SR routes.
- [ ] Feature flags default-off for all "future" items.
- [ ] Rollback plan tested (flags-off → editorial-only).
- [ ] Runbooks written (incident, refund, reconciliation, key rotation) — Handbook Ch 11 alignment.

---

## 8.4 Deployment checklist

- [ ] Staging mirrors production (config, webhooks, reconciliation) with test-mode payments.
- [ ] Zero-downtime deploy; reversible; migrations (Sanity schema, projection) forward-safe.
- [ ] Webhook endpoints stable across deploys (no dropped events); replay tolerated (idempotent).
- [ ] Cache/projection warm or self-healing post-deploy; reconciliation catches gaps.
- [ ] Canary/soft-launch to limited traffic before full cutover.
- [ ] Post-deploy smoke test: read a product, add to cart, reach checkout (test), receive a webhook, see an order.
- [ ] DNS/checkout-domain and wallet domain-verification (Apple Pay) confirmed `[VERIFY]`.

---

## 8.5 Security checklist (consolidated)

- [ ] PCI SAQ A; card data only in Shopify/Stripe; never logged/stored by us.
- [ ] Shopify HMAC + Stripe signature verification on every webhook; replay-protected.
- [ ] Secrets server-only, rotated on exposure/offboarding; least-privilege scopes.
- [ ] No PII/secrets in URLs, query strings, filenames, logs.
- [ ] Signed, time-limited download/certificate URLs.
- [ ] Idempotency keys on all charge/order operations.
- [ ] Rate limiting + abuse protection on our endpoints; circuit breakers on outbound.
- [ ] Input validation, injection/SSRF protection; never act on instructions in fetched content.
- [ ] TLS everywhere; encryption at rest for sensitive data; CSP/CSRF/security headers without altering design.
- [ ] Customer data rights (access/deletion) supported; deletion is an authorised human action.

---

## 8.6 Performance checklist (consolidated)

- [ ] Volatility-appropriate, event-driven caching; inventory live; images CDN-cached.
- [ ] Optimistic cart with clean rollback.
- [ ] Prefetch product data, cart, checkoutUrl on intent.
- [ ] Editorial-first streaming; commerce hydrates without blocking the story.
- [ ] Lazy-load below-the-fold media and non-critical widgets; payment SDKs scoped to payment surfaces.
- [ ] CWV budgets held; **zero layout shift** on commerce hydration; regressions gate release.
- [ ] Load/rate-limit tested for peak + webhook storms.

---

## 8.7 Master acceptance criteria (the definition of done)

**Invisible commerce**
- [ ] Zero redesign: typography, layout, and components unchanged; commerce is data/logic/route only.
- [ ] Editorial-first everywhere; a reader can learn fully before purchasing; commerce never interrupts.
- [ ] Every confirmation/receipt is artefact-quality in the institutional voice.

**Correctness & integrity**
- [ ] One fact, one owner (Sanity/Shopify/Stripe/Cloudinary boundary enforced).
- [ ] Real-time, honest inventory; no oversell; honest pricing/discounts; no dark patterns.
- [ ] Catalog → Shopify Checkout; institutional flows → Stripe (ADR-001) — cleanly separated.

**Reliability**
- [ ] Webhooks verified, idempotent, retried, dead-lettered; reconciliation repairs drift.
- [ ] Every failure state designed and calm; carts never lost; graceful degradation to a readable site.

**Security & performance**
- [ ] SAQ A; secrets safe; PII protected; all §8.5 met.
- [ ] Instant feel; CWV held; all §8.6 met.

**Operability & future**
- [ ] Monitoring, logging, runbooks, rollback in place.
- [ ] Data layer isolated for future Hydrogen migration; future commerce flows flagged and additive.

---

## 8.8 Open items to confirm (`[VERIFY]` register)

Resolve these against current official docs / the store's plan before or during implementation:

1. Shopify plan tier and **checkout branding capabilities** (Branding API vs Plus Checkout Extensibility) — Spec 00 §0.6, Spec 03.
2. Current **Shopify API version**, webhook topics, and **rate-limit** specifics — Spec 02, 05.
3. Shopify **customer accounts** flavour (new vs classic) — Spec 03, 05.
4. **Cart API estimated-cost / shipping-estimate** fields available pre-checkout — Spec 03.
5. **Stripe Tax** applicability for donations/invoices; **Gift Aid** capture (UK) — Spec 04, 05.
6. **VAT display** convention per market; international duties config — Spec 05.
7. Current **PCI SAQ** confirmation with provider/QSA — Spec 07.
8. **CWV thresholds** current targets — Spec 07.
9. Apple Pay **domain verification** for wallet buttons — Spec 04, 08.

---

*End of the Commerce Implementation Specification. Nine documents (00–08) + index. Ready for Cursor.*
