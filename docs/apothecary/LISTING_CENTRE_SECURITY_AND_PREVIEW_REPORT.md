# Listing Centre — Security and Preview Report (Milestone 0.5)

**Date:** 11 July 2026  
**Branch:** `feature/apothecary-listing-composer`  
**Dev server:** `http://localhost:3055` (actual Next.js port; not hardcoded in product code)  
**Scope:** Remove browser AI credential exposure; secure and prove Draft + Hidden preview.  
**Out of scope:** Listing Centre UI, media uploader, schema changes, publishing the test product.

---

## 1. Previous AI exposure

`SANITY_STUDIO_AI_ADMIN_TOKEN` (falling back to `AI_ADMIN_TOKEN`) was inlined into the client/Studio bundle via `next.config.ts` `env`, then read by:

- `src/sanity/tools/seller-centre/utils.ts` (`callProductAi`)
- `src/sanity/actions/productAiActions.ts`
- `src/sanity/plugins/editorial-ai/index.ts`

Any editor (or anyone loading Studio JS) could extract the shared privileged bearer.

`ANTHROPIC_API_KEY` was already server-only (safe).

---

## 2. Files responsible (before)

| File | Issue |
|------|--------|
| `next.config.ts` | Inlined `SANITY_STUDIO_AI_ADMIN_TOKEN` and `SANITY_STUDIO_PREVIEW_SECRET` |
| `sanity.config.ts` | Embedded long-lived preview secret in Presentation enable URL |
| `src/sanity/lib/product-preview.ts` | Built `/api/draft?secret=…` URLs for the browser |
| Seller Centre + product AI actions | Sent inlined admin bearer from Studio JS |
| `src/app/api/apothecary/generate-content/route.ts` | Accepted shared static admin bearer only |
| `src/app/api/draft/route.ts` | Accepted long-lived `SANITY_PREVIEW_SECRET` query param |

---

## 3. Secure AI architecture implemented

```
Sanity Studio (useClient().config().token — user session)
  → POST /api/apothecary/generate-content
  → authorizeSanityStudioEditor()  [users/me + project editor roles]
     or server-only SANITY_API_TOKEN match (never inlined to browser)
  → ANTHROPIC_API_KEY (server env)
  → draft JSON (review-required; never published)
```

Shared `AI_ADMIN_TOKEN` / `SANITY_STUDIO_AI_ADMIN_TOKEN` are **no longer** read for Apothecary AI auth and are **not** inlined via Next `env`.

---

## 4. Authentication and permission checks

Implemented in `src/lib/apothecary/studio-auth.ts`:

| Condition | Status |
|-----------|--------|
| Missing Authorization | **401** |
| Invalid Sanity user token | **401** |
| Valid user, not project member / not editor-capable role | **403** |
| Server-only `SANITY_API_TOKEN` (timing-safe compare) | Allowed as service credential |
| Invalid payload | **400** |
| Provider key missing | **503** (auth already passed) |
| Rate limit | **429** |

Editor-capable roles: administrator, editor, developer, contributor (and aliases).

No tokens, Authorization headers, or provider keys are logged.

---

## 5. Preview root cause

1. **Never-published drafts** only exist as `drafts.{id}`.  
   `productPreviewBySlugQuery` excludes `drafts.**`, so slug-only lookup fails unless a published id exists for overlay.
2. **Long-lived secret in Studio JS / URLs** made enable insecure by design.
3. **Fixture contamination:** a second document `product-apothecary-verification-preview` was **published + visible** on the same slug, so public URLs showed the product while a separate never-published draft also existed. For this milestone the published duplicate was set to `status: draft` + `visibleInApothecary: false` (not deleted; not re-published). Never-published draft id used for proof: `1c4dc252-1804-43f0-9716-0767b922082d`.

---

## 6. Preview correction

| Change | Detail |
|--------|--------|
| `POST /api/apothecary/preview` | Validates Studio/user (or server API token), loads product **by id** via `previewClient`, enables Draft Mode, returns `{ redirectTo }` derived server-side |
| `GET /api/draft-mode/enable` | `defineEnableDraftMode` + short-lived `@sanity/preview-url-secret` for Presentation |
| `GET /api/draft` | **Retired** — always **401** (no long-lived secret query) |
| Studio Preview Draft action | POST then `window.open(origin + redirectTo)` — no secret in URL |
| Seller Centre | `openProductPreview(row, sanityToken)` |
| `sanity.config.ts` | Presentation enable = `/api/draft-mode/enable` (no secret) |
| `next.config.ts` | Removed preview/AI secret inlining; site origin only |

Missing documents return **404** from preview POST and **do not** enable Draft Mode.

---

## 7. Draft + Hidden runtime evidence

Product: **Apothecary Verification Product — Do Not Buy**  
Slug: `apothecary-verification-product`  
State: never-published draft id `1c4dc252-…`, `status: draft`, `visibleInApothecary: false`

| Step | Result |
|------|--------|
| `POST /api/apothecary/preview` with server API token | **200**, `redirectTo` includes `previewId`, sets `__prerender_bypass` |
| Open redirect with Draft cookie | Title: `… (Preview)`; product content visible |
| Not published | Confirmed |

---

## 8. Public isolation evidence

| Check | Result |
|-------|--------|
| Clean session `/the-apothecary/apothecary-verification-product` | Institutional not-found UI (“This page has not been found”); title `Remedy monograph`; **no product h1** |
| Catalogue | Verification product **absent** |
| Browser (localhost:3055) | Not-found corridor confirmed visually |

---

## 9. 401 / 403 evidence

| Request | Status |
|---------|--------|
| AI, no auth | **401** |
| AI, invalid bearer | **401** |
| Preview POST, no auth | **401** |
| Preview POST, invalid bearer | **401** |
| Legacy `GET /api/draft?secret=…` | **401** |
| Preview missing document (authenticated) | **404** (Draft Mode not enabled) |

---

## 10. Disable-preview evidence

`GET /api/draft/disable` remains. After disable, clean public fetch again shows not-found UI only (no product monograph).

---

## 11. Client-bundle secret inspection

| Scan target | Result |
|-------------|--------|
| Source `SANITY_STUDIO_AI_ADMIN_TOKEN` / `SANITY_STUDIO_PREVIEW_SECRET` reads | **Removed** from Studio client paths |
| `.next/static` after `npm run build` | **PASS** — no `SANITY_STUDIO_AI_ADMIN_TOKEN`, `SANITY_STUDIO_PREVIEW_SECRET`, or `AI_ADMIN_TOKEN` string exposure |
| Stale `dist/static` (old Sanity build) | Contained old AI token **name** reference → **deleted** stale `dist/` |

**Rotation note (do not auto-rotate):**  
`SANITY_STUDIO_PREVIEW_SECRET` / `SANITY_PREVIEW_SECRET` were previously inlined to browsers — **mark for rotation after approval**.  
`AI_ADMIN_TOKEN` / `SANITY_STUDIO_AI_ADMIN_TOKEN` were **MISSING** in `.env.local` at verification time (nothing to rotate for AI admin).  
`ANTHROPIC_API_KEY` remains **MISSING** — generation returns **503** after successful auth.

---

## 12. Type-check result

`npm run type-check` — **Pass**

---

## 13. Lint result

Scoped eslint on changed files — **0 errors** (pre-existing warnings only in unrelated editorial route vars / deprecated stubs).

Full `eslint .` still OOMs on large artefacts (pre-existing).

---

## 14. Build result

`npm run build` — **Pass** (Next.js 16.2.10)

---

## 15. Browser routes tested

| Route | Outcome |
|-------|---------|
| `http://localhost:3055/the-apothecary/apothecary-verification-product` | Public not-found UI |
| Preview redirect with Draft cookie | Product preview title + content |
| `/api/draft/disable` | Exits Draft Mode |
| `/api/apothecary/generate-content` | 401 unauth; 503 auth without Anthropic |
| `/api/apothecary/preview` | 401 unauth; 200 auth; 404 missing |
| `/api/draft` | 401 |
| Catalogue | No verification product |

---

## 16. Files changed

**Added**

- `src/lib/apothecary/studio-auth.ts`
- `src/app/api/apothecary/preview/route.ts`
- `src/app/api/draft-mode/enable/route.ts`
- `docs/apothecary/LISTING_CENTRE_SECURITY_AND_PREVIEW_REPORT.md`

**Updated**

- `next.config.ts`
- `sanity.config.ts`
- `src/app/api/apothecary/generate-content/route.ts`
- `src/app/api/draft/route.ts`
- `src/app/api/ai/editorial/route.ts`
- `src/sanity/lib/product-preview.ts`
- `src/sanity/lib/product-studio.ts`
- `src/sanity/actions/productActions.ts`
- `src/sanity/actions/productAiActions.ts`
- `src/sanity/tools/seller-centre/utils.ts`
- `src/sanity/tools/seller-centre/AddProductWizard.tsx`
- `src/sanity/tools/seller-centre/QuickEdit.tsx`
- `src/sanity/tools/seller-centre/SellerHome.tsx`
- `src/sanity/plugins/editorial-ai/index.ts`
- `docs/apothecary/LISTING_CENTRE_PREFLIGHT_AUDIT.md`

**Removed locally**

- Stale `dist/` Studio build output (contained old client token reference)

**Content ops (test fixture only, not schema)**

- Patched `product-apothecary-verification-preview` → draft + hidden (was incorrectly public on same slug)

---

## 17. Remaining blockers / limitations

| Item | Severity | Notes |
|------|----------|-------|
| `ANTHROPIC_API_KEY` missing | Blocks live AI text generation | Auth path proven (503 after auth). Add key to enable generation |
| Soft HTTP **200** on not-found | Non-blocking for isolation | Next/next-intl local soft 404; UI correctly withholds product. Genuine HTTP 404 not achieved locally |
| Previously inlined preview secrets in env | Rotation pending approval | Do not auto-rotate |
| Studio interactive click-through | Manual | Code path uses same POST API proven via authenticated service token |

---

## 18. Recommended commit messages

```
fix(security): keep apothecary AI credentials server-side

fix(preview): secure unpublished product draft preview
```

Suggested split:

1. Security commit — `studio-auth`, generate-content, editorial route, next.config AI removal, Seller Centre / AI action token plumbing, editorial-ai helper.  
2. Preview commit — preview route, draft-mode enable, draft route retirement, product-preview helpers, Studio/Seller Centre preview openers, sanity.config Presentation path.

---

## Stop-condition assessment

| Statement | Proven? |
|-----------|---------|
| AI can be invoked without a privileged static token in the browser | **Yes** (auth architecture + bundle scan). Live model output needs `ANTHROPIC_API_KEY`. |
| Never-published Draft + Hidden product previewable privately; public visitors cannot access it | **Yes** (runtime + browser). |

**Listing Centre UI not started.**
