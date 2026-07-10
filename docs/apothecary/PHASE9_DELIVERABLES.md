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

Complete Shopify checkout join for shoppable products; remove static remedy fallback after all monographs are live in Sanity; wire batch/inventory operations UI; Danish product translation review queue.
