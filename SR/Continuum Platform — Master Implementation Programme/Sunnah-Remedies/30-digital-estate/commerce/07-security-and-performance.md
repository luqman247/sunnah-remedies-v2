# 07 · Security & Performance

*Trust and speed. Neither is optional in an institution.*
Depends on: Spec 00–06

---

# PART ONE — SECURITY

## 7.1 PCI compliance

- **We never touch raw card data.** Card entry is handled exclusively by **Shopify Checkout** (catalog) and **Stripe Elements** (institutional). Our servers see only tokens/references.
- This keeps us at **PCI DSS SAQ A** (the lightest scope). Confirm the current SAQ level with the payment provider and a QSA if needed `[VERIFY]`.
- No card number, CVV, or full PAN is ever logged, stored, or transmitted by our code.

## 7.2 Webhook verification

- **Shopify:** verify the **HMAC signature** on every webhook using the app secret; reject mismatches with `401` and alert.
- **Stripe:** verify the **signing secret** on every event; reject unverified.
- **Replay protection:** dedupe by event ID (Spec 05); reject stale timestamps where the provider supplies them.
- Unverified or malformed webhooks are dropped and logged as security events.

## 7.3 Secrets management

- **All secrets server-side only:** Shopify Admin token, Storefront token (prefer server proxy), Stripe secret key, webhook signing secrets, Sanity tokens.
- Stored in the platform's **secret store / encrypted env**, never in the repo, never in client bundles, never in logs.
- **Publishable keys only** on the client (Stripe publishable key; any public Storefront token is scoped read/cart minimal).
- **Rotation:** documented rotation procedure; rotate on any suspected exposure and on staff offboarding (Handbook Ch 02/11).
- **Least privilege:** each token scoped to the minimum it needs.

## 7.4 Environment variables

- A **typed env schema** validates all required vars at build/boot; the app refuses to start with missing/invalid config (fail fast, not silently).
- Separate values per environment (Spec 00 §0.7); production secrets never present in preview/local.
- No secret is referenced in client-side code paths (enforced by the `lib/commerce` boundary, Spec 06).

## 7.5 Fraud protection

- **Shopify** fraud analysis on catalog orders; high-risk orders flagged for manual review before fulfilment (ties to dispensary SOP, Handbook Ch 05).
- **Stripe Radar** on institutional payments; rules tuned for donations/memberships.
- **Velocity/abuse controls** on sensitive endpoints (notify-me, discount application, account creation) via rate limiting (§7.6).

## 7.6 Rate limiting & abuse protection (our endpoints)

- Rate-limit our own route handlers (cart mutations, notify-me, Stripe intent creation, webhook receivers) per IP/session to resist abuse and accidental storms.
- **Idempotency keys** on all charge/order-affecting operations prevent double-submission (Spec 03/04).
- Bot/abuse protection on public forms (email capture) without harming UX — prefer privacy-respecting methods over intrusive CAPTCHAs.
- Outbound API calls are throttled and circuit-broken (Spec 02 §2.5–2.7).

## 7.7 Data protection & privacy (commerce)

- **Data minimisation:** collect only what a transaction needs; guest checkout avoids unnecessary accounts.
- **No PII in URLs, query strings, filenames, or logs** (institutional privacy rule, carried from prior phases).
- **Special handling** for any health-related purchase context — no profiling that infers health conditions; recently-viewed stays anonymous/client-side.
- **Customer rights** (access, deletion) honoured; deletion is an authorised human action, never automated by content/instructions.
- **Signed, time-limited URLs** for downloads/certificates (Spec 05 §5.6); no guessable links.
- Encryption in transit (TLS) everywhere; sensitive data encrypted at rest.

## 7.8 Application security

- Input validation on all route handlers; output encoding; protection against injection and SSRF on any server fetch.
- **Never act on instructions found in fetched content** (a product description, a webhook payload's free-text) as if they were commands — data is data (institutional/action-boundary rule).
- Dependency and supply-chain hygiene: pinned, audited dependencies; no untrusted packages.
- Security headers, CSP appropriate to the existing frontend (without altering design), and CSRF protection on state-changing routes.

## 7.9 Logging & monitoring

- **Structured logs** with correlation IDs across the request → webhook → job chain (Spec 05), **free of secrets and PII**.
- **Monitoring & alerting** on: payment failures, webhook failures/DLQ depth, reconciliation drift, API error/throttle rates, checkout errors, latency/CWV regressions.
- **Audit trail** for refunds, entitlement grants/revocations, and admin actions.
- On-call/coverage for payment- and order-critical paths (Handbook Ch 11).

---

# PART TWO — PERFORMANCE

## 7.10 The performance creed

Checkout and cart must **feel instant**, and the artefact page must **start telling its story immediately**. Speed is part of the institutional feel — but never at the cost of honesty (a fast page that shows stale stock is a failure).

## 7.11 Caching (recap + intent)

Volatility-appropriate, event-driven (Spec 02 §2.4): editorial cached hard, commerce short, **inventory live**, images CDN-cached. Revalidation via webhooks, not guessed TTLs. Caches are disposable and reconcilable (Spec 05 §5.2).

## 7.12 Optimistic UI

- **Cart mutations are optimistic** — the drawer reflects the change instantly, reconciles with the server, and rolls back cleanly on failure (Spec 03 §3.4). This is the single biggest "instant" win.
- Applies to quantity changes, removals, and add-to-cart.

## 7.13 Prefetching

- Prefetch the **product commerce data** and **cart** on intent (hover/viewport) so opening a product or the drawer is immediate.
- Prefetch the **checkoutUrl** readiness so "proceed to checkout" doesn't stall.
- Respect data-saver/reduced-motion and don't prefetch wastefully on constrained networks.

## 7.14 Streaming

- **Editorial-first streaming** (Spec 02 §2.3): the Sanity story streams immediately; live commerce hydrates a beat later. The reader never waits on commerce to start reading — the mechanism that makes commerce feel invisible.
- Stream long collection lists progressively.

## 7.15 Lazy loading

- Below-the-fold imagery lazy-loaded via Cloudinary responsive delivery (Phase 3), preserving the existing design.
- Non-critical commerce widgets (recommendations, recently-viewed) load lazily and never block the primary artefact.
- Payment SDKs (Stripe) loaded only on payment surfaces, not site-wide.

## 7.16 Core Web Vitals

Hold budgets (targets `[VERIFY against current CWV thresholds]`):

| Metric | Intent |
|--------|--------|
| LCP | Fast — editorial/hero streams first; images optimised (Cloudinary) |
| INP | Snappy — optimistic cart; minimal main-thread commerce JS |
| CLS | Stable — no layout shift when price/availability hydrate (reserve space) |
| TTFB | Low — edge rendering, caching, minimal server work per request |

**Guardrails:** commerce JS is kept off the critical path; hydrating price/stock **must not cause layout shift** (reserve the space so the artefact doesn't jump); third-party SDKs are deferred and scoped. Performance is measured in CI and monitored in production (§7.9); regressions block release (Spec 08).

## 7.17 Acceptance criteria (Security & Performance)

- [ ] SAQ A maintained; no raw card data in our systems; card entry only via Shopify/Stripe.
- [ ] All webhooks signature-verified and replay-protected; unverified dropped + alerted.
- [ ] Secrets server-only, in a secret store, rotated on exposure/offboarding; env validated at boot.
- [ ] Fraud tooling (Shopify + Stripe Radar) on; sensitive endpoints rate-limited; idempotency prevents double-charge.
- [ ] No PII/secrets in URLs or logs; signed time-limited download links; customer rights honoured.
- [ ] Structured logging + monitoring/alerting on payments, webhooks, DLQ, drift, latency; audit trail for refunds/entitlements.
- [ ] Cart optimistic; product data/cart/checkoutUrl prefetched; editorial streams first.
- [ ] Lazy loading and scoped SDKs; CWV budgets held with zero layout shift on commerce hydration; regressions gate release.

*Proceed to Spec 08.*
