# Draft Preview Audit — Phase 0 / Phase 1

## Root cause of the original 404

Preview opened a product URL while the monograph page still used **published-only** GROQ and visibility filters (`visibleInApothecary`, status not draft). Draft Mode alone was not enough: the data layer never switched to an authenticated drafts perspective, so Hidden/Draft products always resolved to `notFound()`.

Secondary factors:

- English Draft Mode is more reliable on `/en/the-apothecary/{slug}` than the unprefixed public path
- Duplicate verification documents (one with `language: null`) could miss a strict `language == "en"` filter unless `previewId` is used

## Canonical routes

| Locale | Public | Draft Mode redirect |
|--------|--------|---------------------|
| English (default) | `/the-apothecary/{slug}` | `/en/the-apothecary/{slug}` |
| Danish | `/dk/the-apothecary/{slug}` | `/dk/the-apothecary/{slug}` |

## Implemented architecture

1. `GET /api/draft` — validates `SANITY_PREVIEW_SECRET`, enables Draft Mode, redirects with optional `previewId`
2. `GET /api/draft/disable` — exits Draft Mode
3. Product page uses `getRemedyForPage` → `getProductBySlugForPage`
4. Draft Mode on → `previewClient` (`perspective: "drafts"`, server token) + preview GROQ
5. Draft Mode off → published client + public filters unchanged
6. Studio **Preview Draft** builds `/api/draft?secret=…&slug=/en/…&id=…`
7. Presentation tool maps Product → frontend route

## Security

- Preview secret validated server-side (401 if invalid)
- `SANITY_API_TOKEN` only on the server `previewClient`
- Public catalogue queries never use the preview client
- Preview metadata is `noindex`
- Product remains Draft + Hidden during verification

## Studio Preview Draft (client secret)

`PreviewDraftProductAction` runs in the browser. Next.js does not expose
`SANITY_STUDIO_PREVIEW_SECRET` to client bundles unless it is listed under
`next.config.ts` → `env`. Without that, `buildProductDraftPreviewUrl` returned
`null` and an earlier fallback opened the **public** monograph URL (404 for
Hidden drafts).

Fix:

1. Inline `SANITY_STUDIO_PREVIEW_SECRET` / `SANITY_STUDIO_SITE_URL` via `next.config.ts` `env`
2. Never fall back to the public product URL from Preview Draft

## Verified success path (browser)

```
Draft + Hidden product in Studio
        ↓
Preview Draft (document actions)
        ↓
Monograph opens with Draft Preview Active + (Preview) title
        ↓
Product absent from normal /the-apothecary
```

Test product kept Draft + Hidden: `apothecary-verification-product`
(`/product-apothecary-verification-preview`).
