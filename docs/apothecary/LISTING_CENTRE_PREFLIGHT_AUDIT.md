# Apothecary Listing Centre — Milestone 0 Preflight Audit

**Date:** 11 July 2026  
**Branch:** `feature/apothecary-listing-composer`  
**Commit:** `06a4c1db29962b954d729dd64c6e8e813073d146`  
**Checkpoint:** `chore(apothecary): checkpoint before listing centre replacement`  
**Parent:** `feature/apothecary-product-manager` (ancestor of HEAD; both tips equal at checkpoint)  
**Working tree:** clean  
**Authority:** Actual repository. V2.3 Markdown is design reference only. Generated prototype code must not be copied.

---

## 1. Executive verdict

**The V2.3 implementation plan cannot be executed safely as written.**

The repository can host a Listing Centre, but the V2.3 master prompt contains **blocking contradictions** against the live public renderers and the live AI auth model:

| Area | V2.3 claim | Repository truth | Severity |
|------|------------|------------------|----------|
| Primary image | `mediaGallery[].role === "primary"` | Public UI uses `primaryLibraryImage` → `mainImage` only | **Blocking** |
| Video | `productVideos` + Sanity `file` upload | Public UI uses `libraryVideos[0].cloudinary` only | **Blocking** |
| AI auth | “Bearer server-side only” while Studio `fetch` sends token | `SANITY_STUDIO_AI_ADMIN_TOKEN` inlined via `next.config.ts` `env` | **Blocking (security)** |
| Five-media write target | Count `mediaGallery + productVideos` only | Must also sync public SoT fields or public site stays blank | **Blocking** |
| Portable Text | Install `@portabletext/editor` immediately | Not direct dep; Sanity already provides PT inputs; no install yet | Non-blocking |
| Preview | Assumed fixed | Architecturally capable via `previewId`; slug-only never-published still fragile | Non-blocking pending runtime test |

**Gate decision:** Do **not** begin UI Milestone 1 until the corrected write contract and AI auth design below are approved. Seller Centre remains. Schemas untouched. No publish.

---

## 2. Verified Product schema

Sources read in full:

- `src/sanity/schemas/documents/apothecary/product.ts`
- `src/sanity/schemas/objects/product-image.ts`
- `src/sanity/schemas/objects/product-video.ts`
- `src/sanity/schemas/objects/seo.ts`
- `src/sanity/schemas/documents/global/media-asset.ts`
- `src/sanity/schemas/documents/global/video-asset.ts`
- Seller Centre: `document.ts`, `QuickEdit.tsx`, `utils.ts`

### 2.1 Listing Centre–critical fields

| Field path | Type | Required | Validation / enums / default | Public renderer | Current Seller Centre |
|------------|------|----------|------------------------------|-----------------|------------------------|
| `name` | string | **yes** | `rule.required()` | Title / remedy name | Written |
| `slug` | slug | **yes** | `rule.required()`, source `name` | Route key | Written |
| `subtitle` | string | no | — | Via adapter if mapped | Written |
| `institutionalSummary` | text | no | — | Catalogue / standfirst copy | Written as short description |
| `fullDescription` | array of `block` | no | Portable Text | Detail narrative (if mapped) | **Partial** — wizard stores plain text; Quick Edit often patches `historicalContext` instead |
| `mainImage` | image (+alt required on field) | no | alt required when present | **Yes** — fallback primary | **Yes** — primary write path |
| `primaryLibraryImage` | ref → `mediaAsset` | no | filter interim/final + class | **Yes** — preferred primary | **No** — never set |
| `mediaGallery` | `productImage[]` | no | each item needs library or inline image | **No** (fetched, unused) | **No** |
| `productVideos` | `productVideo[]` | no | library / file / URL; autoplay+unmuted forbidden | **No** (fetched, unused) | **Yes** — written |
| `libraryVideos` | ref[] → `videoAsset` | no | — | **Yes** — only public video path | Library picker exists; public path needs Cloudinary on asset |
| `gallery` | image[] | no | legacy | No | No |
| `price` | number | soft | `min(0)`; required when `status=active` & shoppable | Yes | Yes |
| `salePrice` | number | no | `min(0)` and `< price` | Yes | Yes |
| `currency` | string | no | `GBP` \| `DKK`; default `GBP` | Yes | Defaulted |
| `stockStatus` | string | no | `in-stock` \| `low-stock` \| `out-of-stock` \| `backorder` \| `unavailable`; default `in-stock` | Yes | Yes |
| `estimatedDispatchTime` | string | no | — | If mapped | Yes |
| `seo.metaTitle` | string | no | max 70 | SEO | Partial |
| `seo.metaDescription` | text | no | max 160 | SEO | Partial |
| `seo.keywords` | string[] | no | tags | SEO | Partial |
| `seo.ogImage` | image | no | — | SEO | Rare |
| `status` | string | **yes** | `draft` \| `active` \| `coming-soon` \| `out-of-stock` \| `discontinued` \| `archived`; default `draft` | Visibility gate | Yes |
| `visibleInApothecary` | boolean | no | **Conflict:** document `initialValue` = `false`; field `initialValue` = `true` | Must not be `false` for public | Yes |
| `featured` | boolean | no | default `false` | Featured lists | Yes |
| `aiDraft.*` | object | no | reviewStatus enum; PT fullDescription; readOnly timestamps | Never auto-public | AI accept paths |

### 2.2 `productImage`

| Field | Type | Notes |
|-------|------|-------|
| `libraryAsset` | ref → mediaAsset | Preferred |
| `image` | image | Hidden when library set |
| `role` | enum | `primary` \| `packaging` \| `ingredient` \| `lifestyle` \| `detail` \| `editorial`; default `editorial` |
| `alt` / `caption` / `credit` | string | Overrides |
| `displayOrder` | number | |
| `cloudinaryAssetId` | string | hidden |

Validation: library **or** inline image required.

### 2.3 `productVideo`

| Field | Type | Notes |
|-------|------|-------|
| `libraryVideo` | ref → videoAsset | Preferred |
| `file` | file | mp4/webm/mov — Studio only unless public path extended |
| `externalUrl` | url | |
| `title` | string | required for inline |
| `poster` | image | |
| `role` | enum | hero / product-demonstration / … |
| `autoplay` / `muted` / `loop` / `controls` | boolean | autoplay requires muted |

### 2.4 `seo` object

Confirmed: `metaTitle`, `metaDescription`, `canonicalUrl`, `ogImage`, `ogTitle`, `ogDescription`, `keywords`, `noIndex`, `robots`, `focusEntities`, `structuredData`.

### 2.5 `aiDraft` object

Confirmed: `reviewStatus` (`none` \| `review-required` \| `approved` \| `rejected`), `shortDescription`, `fullDescription` (blocks), `generatedAt`, `provider`, `notes`.

### 2.6 `mediaAsset` / `videoAsset` (public-relevant)

- **mediaAsset:** Sanity DAM metadata + optional `cloudinary` + optional Sanity `image`. Public image resolver accepts Cloudinary URL/public_id or nested Sanity `image`.
- **videoAsset:** Public delivery expects `cloudinary.public_id` or `cloudinary.secure_url`. Sanity `file` on videoAsset is review-only per schema description. `uploadToCloudinary` in `src/lib/integrations/cloudinary.ts` is a **stub returning null**.

### 2.7 V2.3 field corrections

| V2.3 statement | Verdict |
|----------------|---------|
| Product title field is `name` | **Correct** |
| Short description is `institutionalSummary` | **Correct** |
| Full description is `fullDescription` (PT) | **Correct** (Seller Centre often bypasses) |
| Primary display = `mediaGallery` role primary | **Incorrect for public** |
| Videos = `productVideos` only | **Incorrect for public** — need `libraryVideos` + Cloudinary |
| `visibleInApothecary` initial true | **Ambiguous** — document vs field conflict |
| SEO paths | **Correct** |
| Status / stockStatus enums | **Correct** |

---

## 3. Public image source of truth

**Canonical resolver:** `resolveProductImage` in `src/lib/apothecary/media.ts`  
**Wiring:** `productToRemedy` → monograph / featured surfaces.

### Definitive answers

1. **Catalogue-card primary image:** Same resolver: `primaryLibraryImage` then `mainImage`. Catalogue listing rows currently show little/no image UI; featured/homepage and monograph do.
2. **Product-page primary image:** `primaryLibraryImage` → `mainImage` → static slug photography fallback.
3. **Does `mediaGallery` `role="primary"` affect public rendering?** **No.** Zero public consumers.
4. **Must Listing Centre update `mainImage`?** **Yes** for the current Sanity CDN upload path used by Seller Centre. Required unless a resolvable `primaryLibraryImage` is always set.
5. **Must it update `primaryLibraryImage`?** **Not strictly** if `mainImage` is set. Preferred for Media Library workflow; overrides `mainImage` when resolvable.
6. **Is one canonical field sufficient?** **Runtime yes (either alone works).** Architecture is dual-field. `mediaGallery` is **not** sufficient alone.
7. **Legacy fallbacks:** `mainImage`; `gallery` (unused by resolver); slug static `FALLBACK_PHOTOGRAPHY`.

### Exact required write for an uploaded primary image (current public path)

Minimum (matches Seller Centre today):

```ts
mainImage: {
  _type: "image",
  asset: { _type: "reference", _ref: "<sanityImageAssetId>" },
  alt: "<required alt>",
}
```

Use existing `uploadImageAsset` + `imageRef` in `src/sanity/tools/seller-centre/document.ts`.

**Recommended dual write for Listing Centre (Studio metadata + public SoT):**

```ts
{
  mainImage: { _type: "image", asset: { _type: "reference", _ref: imageAssetId }, alt },
  // optional preferred override when mediaAsset exists:
  // primaryLibraryImage: { _type: "reference", _ref: mediaAssetId },
  mediaGallery: [
    {
      _type: "productImage",
      _key: "...",
      role: "primary",
      alt,
      image: { _type: "image", asset: { _type: "reference", _ref: imageAssetId } },
      displayOrder: 0,
    },
    // …additional images
  ],
}
```

Do **not** implement the uploader until this contract is approved.

---

## 4. Public video source of truth

**Canonical resolver:** `resolveProductVideoUrl` — reads **only** `libraryVideos[0].cloudinary`.

### Definitive answers

1. **Can a direct Sanity file asset render publicly?** **No** (current public path).
2. **Does the renderer require Cloudinary?** **Yes** for public video.
3. **Does `productVideos[].file` work publicly?** **No.**
4. **Does `productVideos[].libraryVideo` work publicly?** **No**, unless the same asset is also referenced from `libraryVideos` with Cloudinary populated.
5. **Simplified Listing Centre workflow:** Create/select `videoAsset` with Cloudinary delivery → set Product `libraryVideos` to that ref. Optionally also append `productVideos` for Studio roles/poster — secondary.
6. **Exact object for public play:**

```ts
libraryVideos: [
  { _type: "reference", _ref: "<videoAssetId>", _key: "..." }
]
// videoAsset.cloudinary.public_id or secure_url must be set
```

**Do not treat `client.assets.upload("file")` as approved for public rendering.** Studio may store the file; public monograph will ignore it until Cloudinary (or resolver change) exists.

**Blocking dependency:** live Cloudinary upload is stubbed (`uploadToCloudinary` → `null`). Listing Centre video must either (a) attach pre-existing Cloudinary-backed `videoAsset`s, or (b) defer public video until upload is implemented — as a separate approved milestone.

---

## 5. Five-media enforcement plan

**Approved product rule:** max 5 total (images + videos), ≥1 image to publish, exactly one primary image, video cannot be primary, block 6th item, never truncate existing >5.

### Count definition (corrected)

```
slotCount = mediaGallery.length + productVideos.length
```

Plus **public sync fields** outside the count:

- Primary image always mirrored to `mainImage` (and optionally `primaryLibraryImage`)
- Public video also mirrored to `libraryVideos` when Cloudinary-ready

### Enforcement layers (no schema migration in M0/M1 unless approved)

| Layer | Behaviour |
|-------|-----------|
| **UI** | Hide/disable add control at 5; reject 6th with clear copy; force first image `role=primary`; videos never primary; banner if existing `slotCount > 5` (read-only add, allow remove/reorder only) |
| **Mutation helper** | `composerToDocumentFields` / save path rejects writes that would raise count above 5 for products that were ≤5; for legacy >5, refuse new appends only |
| **Schema (optional later)** | Custom validation warning/error on `mediaGallery.length + productVideos.length > 5` — **do not auto-truncate**; ship only after UI proven |

Do not modify existing product content automatically.

---

## 6. AI security verdict

### Classification: **UNSAFE** (with INCOMPLETE auth model)

**Evidence:**

1. `next.config.ts` inlines privileged token into the client/Studio bundle:

```ts
env: {
  SANITY_STUDIO_AI_ADMIN_TOKEN:
    process.env.SANITY_STUDIO_AI_ADMIN_TOKEN ||
    process.env.AI_ADMIN_TOKEN ||
    "",
}
```

2. Seller Centre reads it in browser code and sends Bearer:

`callProductAi` in `src/sanity/tools/seller-centre/utils.ts` → `process.env.SANITY_STUDIO_AI_ADMIN_TOKEN`

3. Same pattern in `src/sanity/actions/productAiActions.ts`.

4. API correctly gates on server env and keeps `ANTHROPIC_API_KEY` server-only — **provider key is SAFE**; **admin bearer is UNSAFE** because any Studio loader can extract it.

5. Not on `NEXT_PUBLIC_*`, but **`SANITY_STUDIO_*` via Next `env` is browser-accessible** — equivalent exposure.

### Smallest secure flow (design only — do not implement until approved)

```
Sanity Studio tool (authenticated Sanity session)
  → POST /api/apothecary/generate-content  (same-origin, credentials)
  → Server verifies Sanity/editor authorisation (session cookie / Sanity token exchange / signed Studio request)
  → Server uses AI_ADMIN_TOKEN or skips shared bearer entirely
  → Server holds ANTHROPIC_API_KEY
  → Returns validated draft JSON
```

**Hard requirements before Listing Centre AI UI:**

- Remove `SANITY_STUDIO_AI_ADMIN_TOKEN` from `next.config.ts` `env`
- Stop reading privileged tokens in client components
- Do not put tokens in `NEXT_PUBLIC_*` or generated Studio code

V2.3 doc `06-secure-ai-architecture.md` is **internally contradictory** (claims server-only while requiring Studio Bearer). Treat as incorrect.

---

## 7. Preview security verdict

| # | Question | Verdict |
|---|----------|---------|
| 1 | Preview secret in browser-generated code/URLs? | **Yes** — `buildProductDraftPreviewUrl` puts `secret` in query; also inlined as `SANITY_STUDIO_PREVIEW_SECRET` |
| 2 | Never-published draft excluded by slug GROQ? | **Slug query excludes `drafts.**` ids**; relies on perspective overlay **or** `productPreviewByIdQuery` |
| 3 | Preview by document ID? | **Yes** — `/api/draft?id=` → `previewId` → `getProductBySlugForPage({ documentId })` |
| 4 | Draft + Hidden private render? | **Yes** when Draft Mode on — `getRemedyForPage` skips public visibility |
| 5 | Public queries still exclude? | **Yes** — `publicProductFilter` + `isPubliclyVisibleProduct` |
| 6 | Invalid secret? | **401** (`/api/draft`); not 403 |
| 7 | Missing products HTTP 404? | `notFound()` behaviour; **do not claim hard HTTP 404** (local soft 404 known) |

**Env footgun:** URL builder accepts `SANITY_STUDIO_PREVIEW_SECRET || SANITY_PREVIEW_SECRET`; API validates **`SANITY_PREVIEW_SECRET` only**.

**Do not claim preview is fully fixed** without the runtime plan below.

### Runtime test plan (temporary never-published product)

1. Create product via Studio/Seller Centre; leave `status: draft`, `visibleInApothecary: false`; **do not publish**.
2. Note document id and slug.
3. Open preview via Studio action / `buildProductDraftPreviewUrl` **with `id`**.
4. Expect: Draft Mode cookie set; monograph renders privately.
5. Open same slug in a clean private window **without** Draft Mode → must not show product.
6. Call `/api/draft` with wrong secret → expect **401**.
7. Repeat preview **without** `id` (slug only) → record pass/fail (this is the R1 risk).
8. Delete or archive the temporary product after test; do not leave visible.

---

## 8. Draft-preview root-cause hypothesis

**Hypothesis (aligned with V2.3 R1, refined):**

- Never-published products exist only as `drafts.{id}`.
- `productPreviewBySlugQuery` filters `!(_id in path("drafts.**"))`, so slug-only fetch depends on API perspective overlay onto a published id that **does not exist**.
- **Mitigation already in repo:** prefer `productPreviewByIdQuery` when `previewId` / `id` is present (`getProductBySlugForPage`).
- **Likely failure mode:** preview URLs missing `id`, or `SANITY_API_TOKEN` unset, or Studio/API secret env mismatch → 401 or empty → `notFound()`.

**Fix direction (later milestone, not M0):** always require document id on preview URLs; optionally relax slug preview query under Draft Mode only; unify secret env names. Verify with runtime plan before changing code.

---

## 9. Portable Text editor recommendation

| Option | Status | Recommendation |
|--------|--------|----------------|
| `document.execCommand` / HTML / `dangerouslySetInnerHTML` | Forbidden | **Reject** |
| `@portabletext/react` | Direct dep — **render** only | Keep for public |
| `@portabletext/editor` | Transitive via `sanity`, not direct | Acceptable **after** compatibility spike; do not install in M0 |
| Sanity Studio `PortableTextInput` / form builder input | Already available inside Studio | **Preferred for Milestone 1 shell** |

**Recommendation:** Reuse **Sanity’s built-in Portable Text input** inside the Studio tool (or wrap the same input component Sanity uses for `fullDescription`) so storage stays native `block[]` with zero HTML conversion. Defer adding `@portabletext/editor` as a direct dependency until a spike proves it is necessary and version-aligned with `sanity@^6.3.0`.

Do not install a dependency in Milestone 0.

---

## 10. Exact reusable functions

| Concern | Symbol | Path |
|---------|--------|------|
| Image upload | `uploadImageAsset`, `imageRef` | `src/sanity/tools/seller-centre/document.ts` |
| Draft/publish | `saveWizardDraft`, `publishProductDocument`, `unpublishProductDocument`, `hydrateWizardFromSanity` | same |
| Wizard field map | `wizardToDocumentFields` | same (extend → `composerToDocumentFields`) |
| AI client (unsafe today) | `callProductAi` | `src/sanity/tools/seller-centre/utils.ts` |
| Helpers | `slugify`, `newKey`, `publishRequirements`, `statusLabel`, … | `utils.ts` |
| Persistence pattern | `loadWizardPersistence`, `saveWizardPersistence`, … | `persistence.ts` |
| Preview URLs | `buildProductDraftPreviewUrl`, `productDraftPreviewPath`, `studioPreviewSecret` | `src/sanity/lib/product-preview.ts` |
| Public image/video | `resolveProductImage`, `resolveProductVideoUrl` | `src/lib/apothecary/media.ts` |
| Sanity image URL | `resolveMediaUrl` | `src/sanity/lib/image.ts` |
| Cloudinary URL | `getImageUrl`, `getVideoUrl` | `src/lib/cloudinary` |
| Cloudinary upload | `uploadToCloudinary` | `src/lib/integrations/cloudinary.ts` — **stub** |
| Page fetch | `getRemedyForPage`, `getProductBySlugForPage` | `service.ts` / `fetch.ts` |
| GROQ | `allProductsQuery`, `productBySlugQuery`, `productPreviewBySlugQuery`, `productPreviewByIdQuery` | `queries.ts` |
| AI server | `generateProductContent` | `src/lib/apothecary/ai-content.ts` |
| Styles | `styles.ts` | seller-centre |

---

## 11. Incorrect V2.3 assumptions

1. Primary public image is `mediaGallery[].role === "primary"`.
2. Writing only `mediaGallery` / `productVideos` is enough for the public site.
3. Sanity `client.assets.upload("file")` is an approved public video path.
4. Prefer `productVideos` over `libraryVideos` for public delivery.
5. AI Bearer token can safely live in Studio client / `SANITY_STUDIO_*` Next `env`.
6. Function name `callGenerateContent` — actual name is `callProductAi`.
7. Document helpers named `createProduct` / `hydrateProduct` / `patchProduct` — actual names differ (`saveWizardDraft`, `hydrateWizardFromSanity`, etc.).
8. Preview is already fully fixed for never-published products without verifying `id` path.
9. Hardcoded ports `3000`/`3010` — use actual Next port.
10. Safe to install `@portabletext/editor` without a spike.
11. Copying `apothecary-listing/**` generated TSX is acceptable — **it is not**.
12. `visibleInApothecary` initial value is unambiguously `true`.

---

## 12. Required corrections to the master prompt

Replace V2.3 critical schema facts with:

- Public primary image write: **`mainImage` required** for Sanity uploads; optionally also `primaryLibraryImage`; `mediaGallery` with `role: "primary"` is Studio metadata only until renderer changes.
- Public video write: **`libraryVideos` → Cloudinary-backed `videoAsset`**; `productVideos` optional metadata; **no** Sanity-file-only public claim.
- AI: **no privileged token in browser**; implement secure Studio→server auth before AI UI; remove Next `env` token inlining as a prerequisite milestone.
- Preview: always pass document **`id`**; treat slug-only as unsupported until proven.
- PT: prefer Sanity Portable Text input; no `execCommand`/HTML; no dependency install until approved spike.
- Build **beside** Seller Centre; do not remove Seller Centre; do not change schemas; do not publish.
- Branch is already `feature/apothecary-listing-composer` from checkpoint — do not recreate from scratch.

---

## 13. Exact files allowed to change in Milestone 1

**Milestone 1 (recommended):** shell + dashboard + identity/commerce form **without** media uploader, **without** AI, **without** schema changes — side-by-side with Seller Centre.

Allowed:

- `docs/apothecary/LISTING_CENTRE_*.md` (docs only as needed)
- **New files only** under `src/sanity/tools/seller-centre/` (e.g. `ApothecaryListingCentre.tsx`, `ListingDashboard.tsx`, `ListingComposer.tsx`, section components, `composer-persistence.ts`)
- Minimal registration toggle in `sanity.config.ts` **to add** a second tool or feature-flag entry — **keep** existing Seller Centre tool registered
- Additive helpers in `document.ts` / `types.ts` / `styles.ts` / `utils.ts` (no deletion of wizard APIs)

---

## 14. Exact files prohibited from changing (Milestone 1)

- All Product / media / SEO / AI schemas under `src/sanity/schemas/**`
- Public Apothecary pages under `src/app/[locale]/the-apothecary/**`
- `src/lib/apothecary/media.ts` (SoT) — unless a separately approved “public media sync” milestone
- `src/app/api/apothecary/**`, `src/app/api/draft/**` — until AI/preview security milestones
- `next.config.ts` token inlining — change only in an approved **security** milestone (preferably before AI UI)
- Product content in Sanity (no migrations, no bulk patches)
- Deletion/disable of existing Seller Centre files (`AddProductWizard.tsx`, `SellerHome.tsx`, `QuickEdit.tsx`, …)
- Copying files from Downloads `apothecary-listing/**` into the repo
- Merges to `enterprise-refactor` or `main`

---

## 15. Blocking issues

1. **Image SoT mismatch** — V2.3 writes would not update public primary image.
2. **Video SoT mismatch** — V2.3 `productVideos` / Sanity file path does not render publicly; Cloudinary upload stubbed.
3. **AI token browser exposure** — UNSAFE; must redesign before Listing Centre AI.
4. **Master prompt instructs unsafe AI + wrong media fields** — executing it as-is fails product and security goals.

---

## 16. Non-blocking issues

1. `visibleInApothecary` document vs field initialValue conflict.
2. Seller Centre stores long copy in `historicalContext` rather than `fullDescription`.
3. Preview secret in URL (editor-capability risk; acceptable short-term with Studio access control).
4. Soft HTTP 404 locally for missing products.
5. Catalogue list UI may not show images even when resolver works elsewhere.
6. `@portabletext/editor` not direct — needs spike.
7. Package zip contains obsolete V2/V2.1/V2.2 + generated TSX + HTML/PDF handoffs.
8. Function naming drift between V2.3 docs and repo.

---

## 17. Recommended first implementation milestone

**Milestone 1 — Listing Centre shell (safe):**

1. New Studio tool entry **alongside** Seller Centre (do not remove).
2. Dashboard list (GROQ read-only).
3. Composer single page for identity, pricing, stock, SEO, visibility.
4. Save draft / publish using **existing** document helpers with **corrected** field map (`name`, `institutionalSummary`, `fullDescription` as PT via Sanity input, `mainImage` when media added later).
5. Preview button using `buildProductDraftPreviewUrl` **always with `_id`**.
6. **Exclude:** media uploader, AI generate, schema edits, Seller Centre removal, Cloudinary upload.

**Then, only after approval:**

- **M1b / Security:** remove AI token from Next `env`; secure AI route auth.
- **M2 — Media:** five-slot UI writing `mainImage` + `mediaGallery` (+ optional library); attach-only Cloudinary videos via `libraryVideos`.
- **M3 — AI + PT polish** after security gate.

---

## 18. Rollback strategy

1. Checkpoint commit already exists: `06a4c1d` — reset/revert feature commits on `feature/apothecary-listing-composer` to this SHA if needed.
2. Keep Seller Centre registered until Listing Centre verified end-to-end.
3. Additive-only files → delete new tool files and revert `sanity.config.ts` registration to restore prior Studio.
4. Never merge broken Listing Centre to `enterprise-refactor` / `main`.
5. No content migrations ⇒ no content rollback required for M1 shell.
6. If a later media milestone writes bad fields, restore documents from Sanity history; do not run destructive scripts.

---

## Audit 8 — V2.3 package claims

Recorded under Downloads `Kimi_Agent_SR Products (1)/`:

| Artefact | Treatment |
|----------|-----------|
| `Sunnah-Remedies-Apothecary-Listing-Centre-V2.3-Final-Consistent/*.md` | Design reference only |
| V2 / V2.1 / V2.2 folders | Historical; superseded |
| `apothecary-listing/**/*.tsx` generated prototype | **Do not copy** |
| `apothecary-handoff/*.html|*.pdf` | Handoff visuals only |
| V2 `*.pdf` / `V2-compiled.html` | Handoff only |

---

## Branch and safety confirmation

| Check | Result |
|-------|--------|
| Current branch `feature/apothecary-listing-composer` | **Yes** |
| Parent `feature/apothecary-product-manager` | **Yes** (ancestor; tips equal at checkpoint) |
| Checkpoint commit exists | **Yes** — `06a4c1d` |
| Working tree clean | **Yes** |
| No merge to enterprise-refactor / main | **Observed** |

---

## Appendix A — Corrected Milestone 1 prompt (repository-grounded)

```
You are implementing Milestone 1 of the Apothecary Listing Centre on branch
feature/apothecary-listing-composer (checkpoint 06a4c1d already exists).

AUTHORITY
- The repository is source truth.
- docs/apothecary/LISTING_CENTRE_PREFLIGHT_AUDIT.md is binding for contradictions.
- V2.3 Markdown is UX reference only. Do NOT copy apothecary-listing prototype code.

DO NOT
- Remove or disable the current Seller Centre
- Modify schemas or product content
- Publish products
- Implement media upload / five-slot media
- Implement AI generate UI
- Inline or read AI_ADMIN_TOKEN / SANITY_STUDIO_AI_ADMIN_TOKEN in client code
- Install new dependencies
- Merge to enterprise-refactor or main
- Use document.execCommand, dangerouslySetInnerHTML, or HTML↔PT conversion

BUILD
1. New Studio tool components under src/sanity/tools/seller-centre/ (Listing Centre shell)
2. Register ALONGSIDE existing Seller Centre in sanity.config.ts
3. ListingDashboard — list products (name, status, price, stock, updated)
4. ListingComposer — single scroll page: identity, description (Sanity PT input for
   fullDescription), commerce, SEO, visibility
5. Save Draft / Publish via existing document helpers; field names:
   name, slug, subtitle, institutionalSummary, fullDescription (blocks),
   price, salePrice, currency, volume, stockStatus, estimatedDispatchTime,
   category, brand, seo.metaTitle/metaDescription/keywords, status, visibleInApothecary, featured
6. Preview via buildProductDraftPreviewUrl ALWAYS including document _id
7. Reuse styles.ts institutional tokens; styled-components already installed

PUBLIC MEDIA CONTRACT (document in code comments; do not implement uploader yet)
- Public image SoT: primaryLibraryImage → mainImage (resolveProductImage)
- mediaGallery role=primary does NOT drive public UI today
- Public video SoT: libraryVideos[0].cloudinary only

VERIFY
- npm run type-check && npm run lint && npm run build
- Browser: Studio shows both tools; new shell opens; Seller Centre still works
- Stop after Milestone 1. Do not start media or AI.
```

---

## Appendix B — Verification results (Milestone 0)

Application code was not changed to make these pass (docs only).

| Command | Result | Notes |
|---------|--------|-------|
| `npm run type-check` | **Pass** | `tsc --noEmit` exit 0 |
| `npm run lint` (`eslint .`) | **Pre-existing failure** | OOM (exit 134) while linting `dist/static/*` bundles — not introduced by this audit |
| Scoped `eslint "src/**/*.{ts,tsx}"` | **Pass** (0 errors) | 270 pre-existing warnings across operations/workflows; none in new audit doc |
| `npm run build` | **Pass** | Next.js 16.2.10 compiled successfully |

No application code was modified for Milestone 0 beyond creating this audit document.
