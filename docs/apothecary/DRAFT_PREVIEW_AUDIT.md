# Draft Preview Audit — Apothecary

## Root cause of the original 404

Preview opened `/the-apothecary/[slug]` (or Draft Mode) while the product page still used **published-only** GROQ and visibility filters. Draft and Hidden products were excluded, so `notFound()` ran even when Draft Mode was enabled.

Contributing factors:

1. Public GROQ filter excludes drafts and `visibleInApothecary == false`
2. Service layer re-checked public visibility
3. Fetch path did not switch to `previewClient` / drafts perspective under Draft Mode
4. English Draft Mode is more reliable on `/en/the-apothecary/...` than the unprefixed public path

## Fix (current architecture)

1. `GET /api/draft` validates `SANITY_PREVIEW_SECRET`, enables Draft Mode, redirects to locale-correct path with optional `previewId`
2. `GET /api/draft/disable` exits Draft Mode
3. Product page uses `getRemedyForPage` → `getProductBySlugForPage`
4. When Draft Mode is on: authenticated `previewClient` + preview GROQ (drafts + hidden allowed)
5. When Draft Mode is off: unchanged public queries and visibility rules
6. Presentation tool maps Product → frontend route
7. Seller Centre and document action **Preview Draft** use `buildProductDraftPreviewUrl`

## Canonical routes

| Locale | Public | Draft Mode redirect |
|--------|--------|---------------------|
| English (default) | `/the-apothecary/{slug}` | `/en/the-apothecary/{slug}` |
| Danish | `/dk/the-apothecary/{slug}` | `/dk/the-apothecary/{slug}` |

## Required env

- `SANITY_PREVIEW_SECRET` (server)
- `SANITY_STUDIO_PREVIEW_SECRET` (same value, Studio)
- `SANITY_API_TOKEN` (preview perspective)
- `SANITY_STUDIO_SITE_URL` / `NEXT_PUBLIC_SITE_URL`
