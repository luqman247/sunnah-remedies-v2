# Apothecary Product Manager — Phase 9 deliverables

## 1. Architecture summary

Sanity remains the single source of truth for editable Apothecary product content (copy, price, stock status, media references, publishing). Cloudinary delivers binaries referenced by the Media Library. The public site composes products through `src/lib/apothecary/service.ts` → GROQ (public visibility filter) → `productToRemedy` → existing monograph/catalogue UI. Shopify remains optional for checkout join; Counter behaviour is unchanged. AI drafts write only to `aiDraft` with review-required status.

## 2. Audit findings

- Editorial-rich monographs existed; commerce checkout still incomplete (Counter stub).
- Static `src/lib/content/remedies/*` was a fallback when Sanity had no public products.
- Landing featured three hardcoded remedies; now driven by featured/public CMS products.
- `composeProductView` commerce composition remains available but is not required for editorial SoT.

## 3. Content model

Product document groups: Essentials, Media, Content, Scholarship, Clinical, Pricing & Variants, Inventory, Relationships, Search, Publishing, AI Assistant, Operations. Supporting types: brand, certification, productImage, productVideo, productVariant, faqItem, mediaAsset, videoAsset, cloudinaryRef.

Public visibility: published document, `visibleInApothecary != false`, status in `active | coming-soon | out-of-stock` (or legacy undefined).

## 4. Files created

- `src/lib/apothecary/service.ts`, `ai-content.ts`, `media.ts`
- `src/app/api/apothecary/generate-content/route.ts`
- `src/sanity/actions/productActions.ts`, `productAiActions.ts`, `mediaActions.tsx`
- `src/sanity/badges/productBadges.ts`
- `src/sanity/lib/product-studio.ts`
- `src/sanity/tools/apothecary-overview.tsx`, `media-library-overview.tsx`
- Schemas: brand, certification, product-image/video/variant, faq-item, cloudinary-ref
- `scripts/migrate-static-remedies.ts`
- `docs/apothecary/MEDIA_SOURCE_OF_TRUTH.md`, `PRODUCT_MANAGEMENT_GUIDE.md`, this file

## 5. Files modified

- Product and related Apothecary schemas; structure; `sanity.config.ts`
- Queries, fetch, adapters, types
- Apothecary pages (landing, catalogue, monographs, `[slug]`)
- `RemedyMonograph`, ledger, dispensation price formatting
- Revalidate routes (locale paths), `.env.example`, `package.json`

## 6. Migration summary

`npm run migrate:static-remedies` imports static remedies as **draft** Sanity products (`visibleInApothecary: false`). Idempotent by `_id` (`product-{slug}`). Editors must review, attach media, mark active, and publish.

## 7. Admin URL

- Studio: `/studio`
- Apothecary overview tool inside Studio
- Optional alias paths if configured: `/admin/apothecary` (Studio remains canonical entry)

## 8. Editor usage instructions

See `docs/apothecary/PRODUCT_MANAGEMENT_GUIDE.md`.

## 9. AI generation workflow

Studio action → `POST /api/apothecary/generate-content` (Bearer `AI_ADMIN_TOKEN`) → provider abstraction → `aiDraft` with `review-required` → Approve/Reject actions → human Publish.

## 10. Media and video workflow

Media Library owns metadata; Cloudinary owns delivery; products reference library assets. See `docs/apothecary/MEDIA_SOURCE_OF_TRUTH.md`.

## 11. Security model

- AI routes require admin bearer token; Anthropic key server-only.
- Rate limiting on generate-content.
- Drafts/archived excluded from public GROQ.
- Product delete action removed; archive preferred.
- Revalidation webhook secret.

## 12. Environment variables required

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN` / `SANITY_API_WRITE_TOKEN`
- `AI_ADMIN_TOKEN`, `SANITY_STUDIO_AI_ADMIN_TOKEN`
- `ANTHROPIC_API_KEY`
- `SANITY_STUDIO_PREVIEW_SECRET`, `SANITY_STUDIO_SITE_URL`
- `REVALIDATION_SECRET` / `SANITY_REVALIDATE_SECRET`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (for library delivery URLs)
- `NEXT_PUBLIC_SITE_URL`

## 13. Verification evidence

| Check | Result |
| --- | --- |
| `npm run type-check` | Pass |
| `npm run lint` | Pass (0 errors; pre-existing warnings elsewhere) |
| `npm run build` | Pass |
| Dev server | `http://localhost:3010` |
| `/en/the-apothecary` | 200 — featured CMS products (Black Seed Oil, Honey, Senna) |
| `/en/the-apothecary/catalogue` | 200 — Black Seed Oil, Honey, Senna, Olive Oil |
| `/en/the-apothecary/honey` | 200 — monograph, £18, institutional summary from CMS |
| `/en/the-apothecary/black-seed-oil` | 200 — £24 |
| Missing slug | 404 (not found UI) |
| `POST /api/apothecary/generate-content` without token | 401 Unauthorized |
| HTML scanned for AI secrets | None exposed |
| `/studio` | 200 |
| Local Sanity write CRUD (create/upload/publish test product) | Blocked — local `.env.local` has no Sanity/AI credentials (only `VERCEL_OIDC_TOKEN`). Full editor CRUD must be verified against Vercel/production env after deploy |
| Unprefixed `/the-apothecary` on local | 404 (pre-existing next-intl/catch-all interaction); production `https://www.sunnahremedies.co.uk/the-apothecary` returns 200. Verify via `/en/...` locally or production URLs |

Guide: `docs/apothecary/PRODUCT_MANAGEMENT_GUIDE.md`

### Milestone 2 — Seller Centre draft workflow (2026-07-11)

Stopped before publish / final production verification per instruction.

**Test product:** Seller Centre Flow Test — Do Not Buy  
**Canonical id:** `product-seller-centre-flow-test-do-not-buy-mrfpw4wn` (draft only)

| Step | Result |
| --- | --- |
| Resume Draft | Actions → Resume Draft hydrates wizard from Sanity |
| Upload + reorder images | Second gallery image + Up/Down reorder |
| Video + poster | External URL + poster upload; review shows Gallery 2 · Video 1 |
| AI generate + Accept section | Blocked locally — `AI_ADMIN_TOKEN` / `SANITY_STUDIO_AI_ADMIN_TOKEN` absent; `POST /api/apothecary/generate-content` → 401 |
| Preview Draft | Monograph opens with Draft Preview Active |
| Remains private | Absent from `/the-apothecary` catalogue; public slug triggers not-found (dev soft 404 UI) |
| Quick Edit price + image | Main image replaced; price saved to £32 via **Save price** |
| Advanced Editor | Same document: `/studio/structure/...;product-seller-centre-flow-test-do-not-buy-mrfpw4wn` |
| `npm run type-check` | Pass |
| Seller Centre eslint | Pass (0 warnings) |
| `npm run build` | Pass |

**Not run (Milestone 3+):** publish, public catalogue appearance after publish, EN/DA published content, unpublish, archive, genuine HTTP 404 after removal.

### Milestone 3 — gate (steps 1–6, awaiting publish approval) — 2026-07-11

**Product:** Apothecary Verification Product — Do Not Buy  
**Canonical id:** `product-apothecary-verification-preview` (draft, Hidden)  
**Slug:** `apothecary-verification-product`

| Step | Result |
| --- | --- |
| 1. Seller Centre | Opened `/studio/apothecary-manager` |
| 2. Edit / Resume | Draft listed; Resume Draft + required fields confirmed (£12, image, summary) |
| 3. Required fields | Name, slug, price, primary image, short description present |
| 4. AI generate | **Blocked** — no `AI_ADMIN_TOKEN` in `.env.local`; UI shows Unauthorized; API 401 |
| 5. Preview while Draft+Hidden | Preview Draft → Draft Preview Active; £12; institutional summary visible |
| 6. Absent from catalogue | `/the-apothecary` does not list the product (including under Draft Mode) |
| 7. Publish | **Awaiting explicit approval** |

Security (pre-publish):

| Check | Result |
| --- | --- |
| AI no/bad auth | 401 |
| Draft no/bad secret | 401 |
| Catalogue HTML secrets | None |
| Public slug without Draft Mode | Not-found UI (`NEXT_HTTP_ERROR_FALLBACK;404`; Next soft 200 in dev) |
| `type-check` / Seller Centre eslint / `build` | Pass |

## 14. Known limitations

- Counter / payment checkout still incomplete.
- Static fallback remains until CMS products are published.
- AI approve does not overwrite non-empty historical scholarship.
- Sanity host allowlist may block new local Studio ports until configured.
- No dedicated Jest suite in package.json (lint/type-check/build are the automated gates).

## 15. Suggested commit message

```
feat(apothecary): complete product manager with CMS public wiring and AI drafts

Sanity SoT for catalogue content, Media Library refs, review-required AI
generation, public visibility filters, migration script, and editor guide.
```

## 16. Suggested next milestone

**Milestone 3 (in progress):** awaiting explicit approval to publish `product-apothecary-verification-preview`, then catalogue/detail round-trips, EN/DA, unpublish, archive, genuine HTTP 404, cleanup.

Add `AI_ADMIN_TOKEN` + `SANITY_STUDIO_AI_ADMIN_TOKEN` + model key to `.env.local` before AI Accept-section can pass. Add `REVALIDATION_SECRET` for webhook auth verification (route returns 400 without `_type` when secret unset).

Then: Shopify checkout join; remove static remedy fallback after monographs are live; Danish translation review queue.
