# Sunnah Remedies — Phase 3 Implementation Specification

## Engineering Design Document · for execution in Cursor

**Status:** Approved for implementation
**Author role:** Lead Digital Experience Architect
**Executor:** Cursor (agentic implementation)
**Depends on:** Phase 1 (Institutional Design System) ✓ · Phase 2 (Sanity CMS Architecture) ✓ · *Homepage / Arrival Sequence Build Specification v2.0* (the reference implementation — its tokens, the isnād signature, the `Plate` component states, the motion tokens, and the accessibility baselines are inherited here and must not be re-derived)
**Non-goals:** Do not redesign the design system. Do not recreate the CMS. Do not replace working components. Extend the existing foundation only.

> **How Cursor should use this document.** Execute top to bottom. Chapters 1–6 establish the media infrastructure and must land before any editorial page consumes media. Chapters 7–10 specify the pillar experiences. Chapters 11–14 are cross-cutting requirements every page must satisfy. Chapters 15–19 gate the work. Where this document says a value is authoritative, do not substitute. Where it defers a decision to Chapter 19, do not guess — implement the seam and leave the decision flagged.

---

## Chapter 0 — Scope, inheritance, and decision records

### 0.1 What Phase 3 delivers

1. A production media pipeline where **every image and video is sourced from Cloudinary**, optimised automatically, and managed entirely through Sanity by non-technical editors.
2. An **institution-wide media component layer** that all pages consume (extends the v2 `Plate`).
3. **Editorial experiences** for the five surfaces: Homepage, The Apothecary, The Academy, Sacred Journeys, The Knowledge Library.
4. A **photography and video direction system** that makes the whole institution visually coherent.
5. Cross-cutting **motion, accessibility, and performance** guarantees.
6. A **migration path** off `/public` and a set of gates (acceptance, testing, production readiness).

### 0.2 Inheritance from v2 (do not redefine)

The following are defined in the Homepage v2 spec and apply globally in Phase 3: the colour/spacing/line tokens; the type system (Fraunces / Newsreader / IBM Plex Mono / Amiri / Reem Kufi); the **isnād rule** signature; the **`Plate`** component with `brief | interim | final` states and its zero-CLS contract; the motion easing tokens and reduced-motion path; the WCAG 2.2 AA baseline; and the truth/*amāna* content constraint (nothing invented; graceful-empty containers). Phase 3 layers Cloudinary **behind** the `final` state of `Plate` and generalises the media layer; it does not change the component's public contract.

### 0.3 Architecture decision records (ADRs)

| ADR | Decision | Rationale | Consequence |
|-----|----------|-----------|-------------|
| ADR-1 | **Cloudinary is the DAM and delivery layer**; `/public` is not a long-term media source | Automatic AVIF/WebP, `q_auto`, content-aware crop, ABR video, a single searchable library | All render paths resolve to Cloudinary URLs; `/public` retains only static UI chrome (favicons, brand marks that never change) |
| ADR-2 | **Sanity holds structured content + a Cloudinary reference**, not binaries | Editors work in one place; content stays portable and localisable | The Cloudinary reference object is embedded in Sanity docs via the media plugin |
| ADR-3 | Editors pick/upload assets through the **`sanity-plugin-cloudinary` media picker inside Studio** | "No developer required"; uploads land in Cloudinary with folder + tags | Studio requires the Cloudinary cloud name + an unsigned upload preset scoped to editors |
| ADR-4 | Delivery uses **`next-cloudinary`** (`CldImage`, `CldVideoPlayer`, `getCldImageUrl`) | First-party Next.js integration: srcset, `f_auto`, `q_auto`, blur placeholders, OG image helpers | `next.config` allows the Cloudinary `remotePatterns`; a thin wrapper adapts it to `Plate`/`EditorialImage` |
| ADR-5 | **Context-specific alt/caption live in Sanity**; asset-level facts (photographer, copyright, licence) live in **Cloudinary structured metadata** | The same image needs different alt in different contexts; credit/licence travel with the binary | Components merge both sources at render (Sanity alt wins; Cloudinary credit is the fallback/default) |
| ADR-6 | **Named transformation presets** are centralised in `/lib/cloudinary/presets`, not hand-authored per call site | Coherent grade and crop everywhere; testable; changeable in one place | Components accept a `preset` key, never raw transformation strings |
| ADR-7 | **Video ships poster-first**; the stream is deferred and adaptive (HLS via Cloudinary ABR) | Protects LCP and data budgets; respects reduced-motion / save-data | Ambient hero video never blocks first paint and never autoplays under reduced-motion |
| ADR-8 | A **media resolver** prefers a Cloudinary reference and falls back to a legacy `/public` path during migration | Nothing breaks mid-migration; per-asset rollback | The resolver is removed at the end of 3A.2 once `/public` media is retired |

---

## Chapter 1 — System architecture

### 1.1 Data flow

```
            EDITOR (Sanity Studio)
                    │  upload / pick
                    ▼
        ┌───────────────────────────┐
        │  sanity-plugin-cloudinary │  (Media Library widget, in Studio)
        └───────────┬───────────────┘
                    │ writes reference {public_id, format, width, height, ...}
                    ▼
        ┌───────────────────────────┐        binaries + technical metadata
        │        SANITY (content)   │◄──────────────── CLOUDINARY (DAM) ─────────┐
        │  documents + cloudinary   │   folder, tags, structured metadata        │
        │  reference + context alt  │                                            │
        └───────────┬───────────────┘                                            │
                    │ GROQ (server)                                              │
                    ▼                                                            │
        ┌───────────────────────────┐    getCldImageUrl / CldImage / CldVideo    │
        │   NEXT.JS (App Router)     │───────────────────────────────────────────┘
        │   RSC → media layer →      │    f_auto q_auto g_auto srcset  (delivery CDN)
        │   Plate/EditorialImage/... │
        └───────────┬───────────────┘
                    ▼
                 VISITOR  (AVIF/WebP, LQIP→full, ABR video)
```

### 1.2 Runtime boundaries

- **Server (RSC / route handlers):** all Sanity reads (GROQ), Cloudinary URL generation, LQIP generation, OG image URLs, signed operations. Cloudinary API secret is server-only.
- **Client:** only the interactive seams — mobile nav, the reveal observer, gallery/lightbox, video player controls, the correspondence form. No client-side content fetching above the fold.
- **Build/CI:** transformation-preset unit tests, contrast tests, Lighthouse budgets, link/schema validation.

### 1.3 Environments & secrets

| Variable | Exposure | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | public | delivery URL construction |
| `CLOUDINARY_API_KEY` | server | signed uploads / admin ops |
| `CLOUDINARY_API_SECRET` | server only (never bundled) | signing |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | public | unsigned editor uploads (scoped, folder-locked, size/format-limited) |
| `SANITY_PROJECT_ID` / `SANITY_DATASET` | public | client config |
| `SANITY_API_READ_TOKEN` | server | draft/preview reads |

The unsigned upload preset is **restricted**: locked to the institution's root folder, allowed formats (jpg/png/webp/heic/mp4/mov), max dimensions/size caps, and an incoming eager transformation to normalise colour profile. This lets editors upload safely from the Studio widget without exposing the secret.

---

## Chapter 2 — Folder structure

```
/src
  /app
    /(site)
      layout.tsx                     # Masthead, SiteFooter, MarginRail, font + token providers
      page.tsx                       # Homepage (v2 arrival sequence + editorial extensions)
      /apothecary
        page.tsx                     # editorial index
        /[slug]/page.tsx             # Product Monograph
      /academy
        page.tsx
        /[slug]/page.tsx             # Programme microsite
      /sacred-journeys
        page.tsx
        /[slug]/page.tsx             # Journey experience
      /library
        page.tsx
        /[slug]/page.tsx             # Article (publication)
    /studio/[[...index]]/page.tsx    # embedded Sanity Studio (or separate deployment — Ch.19)
    /api/                            # og image route, revalidation webhook, optional upload-sign route
  /components
    /media
      Plate.tsx                      # inherited v2 contract; final state → Cloudinary
      EditorialImage.tsx             # inline editorial image w/ caption/credit
      EditorialVideo.tsx             # inline video, poster-first
      HeroMedia.tsx                  # full-bleed image OR ambient video hero
      Gallery.tsx                    # editorial gallery + accessible lightbox
      MediaCaption.tsx               # caption · credit · copyright rendering
      Poster.tsx                     # video poster + play affordance
    /editorial
      IsnadRule.tsx  SectionStamp.tsx  Eyebrow.tsx
      PullQuote.tsx  BlockQuote.tsx  Footnote.tsx  Figure.tsx
      ReferenceList.tsx  Citation.tsx  ReadingTime.tsx  AuthorBio.tsx
      PortableBody.tsx               # constrained portable-text renderer
    /layout
      Masthead.tsx  SiteFooter.tsx  MarginRail.tsx  SkipLink.tsx
    /pillars
      /apothecary  /academy  /journeys  /library   # composed section blocks per pillar
    /motion
      Reveal.tsx  Parallax.tsx  useReducedMotion.ts  motionTokens.ts
  /lib
    /cloudinary
      presets.ts                     # named transformation presets (ADR-6)
      url.ts                         # getImageUrl / getVideoUrl / getPoster / getOgImageUrl
      lqip.ts                        # blur placeholder generation
      loader.ts                      # next/image custom loader (fallback path)
    /sanity
      client.ts  queries/            # GROQ per pillar
      resolveMedia.ts                # Cloudinary-ref → render model (+ /public fallback, ADR-8)
      types.ts                       # generated types
    /content
      claims.ts                      # evidence/claims governance helpers (Ch.7.6)
  /styles
    tokens.css                       # v2 tokens (colour/space/line) — inherited
    typography.css  globals.css
  /sanity                            # schema (if co-located)
    /schemas/documents  /schemas/objects  /desk  /plugins
/public                             # UI chrome only after migration (favicons, static brand marks)
```

---

## Chapter 3 — Component responsibilities (contracts, not code)

Each component is specified by inputs, behaviour, output, and states. Cursor implements to these contracts.

### 3.1 Media layer

| Component | Inputs | Behaviour | Accessibility | Performance |
|-----------|--------|-----------|---------------|-------------|
| `Plate` | `asset` (media model), `aspect` (required), `priority?`, `variant` | v2 state machine `brief\|interim\|final`; `final` renders via Cloudinary through `EditorialImage`; identical aspect across states → CLS 0 | per v2 (aria-label from purpose/alt) | reserves layout; priority only for LCP plate |
| `EditorialImage` | `publicId`, `preset`, `alt`, `caption?`, `credit?`, `sizes`, `priority?` | Cloudinary delivery: `f_auto`, `q_auto`, preset gravity/crop, responsive `srcset` from `sizes`, blur LQIP placeholder | `alt` required unless decorative; caption/credit are supplementary, not alt | lazy by default; eager+`fetchpriority=high` if `priority` |
| `HeroMedia` | `mode: image\|video`, media, `poster` | full-bleed; image → `EditorialImage priority`; video → `EditorialVideo` ambient, poster-first | video decorative → poster carries meaning; controls exposed | video deferred; poster is LCP candidate, preloaded |
| `EditorialVideo` | `publicId`, `poster`, `mode: ambient\|player`, `captionsVtt?` | ambient = muted/loop/inline, **autoplay only if not reduced-motion and not save-data**; player = full controls | captions track required for narrative video; keyboard-operable player | ABR (HLS) via Cloudinary; poster shown until play; never blocks paint |
| `Gallery` | `items[]`, `layout: strip\|grid\|editorial` | responsive gallery; opens accessible lightbox; keyboard + focus trap | roving tabindex, `Esc` closes, focus returns; alt per item | thumbnails via `t_thumb`; full images lazy in lightbox |
| `MediaCaption` | `caption?`, `credit?`, `copyright?` | mono caption line; renders credit/copyright with restraint | associated to figure via `aria-describedby` | none |

### 3.2 Editorial layer

`PortableBody` renders constrained portable text (paragraph, emphasis, links, and the registered inline/block types below only): `PullQuote`, `BlockQuote`, `Footnote` (with back-reference), `Figure` (image/diagram + numbered caption), `Citation`, and `ReferenceList`. `ReadingTime` computes from body word count. `AuthorBio` renders a `person` reference. `SectionStamp`, `Eyebrow`, and `IsnadRule` are inherited from v2.

### 3.3 Composition rule

Pages are thin: a route file fetches via one GROQ query, maps to a render model, and composes **pillar section blocks** from `/components/pillars`. No page file constructs raw Cloudinary URLs, contains copy, or defines layout primitives — those live in the media/editorial/layout layers.

---

## Chapter 4 — Media pipeline (Cloudinary)

### 4.1 Account structure

**Folder taxonomy** (mirrors the institution; enforced by the upload preset):

```
sunnah-remedies/
  homepage/        apothecary/{product-slug}/    academy/{programme-slug}/
  journeys/{journey-slug}/    library/{article-slug}/    people/    brand/
  future/{podcasts,documentaries,webinars,360}/
```

**Tag taxonomy** (controlled vocabulary; drives DAM search and the photography system, Ch. 8):
`pillar:{apothecary|academy|journeys|library|clinical|brand}` · `type:{hero|ingredient|lifestyle|portrait|architecture|manuscript|equipment|environment|detail|diagram}` · `light:{natural|low|studio}` · `status:{brief|interim|final}` · `orientation:{landscape|portrait|square}` · `motion:{still|ambient|narrative}`.

**Structured metadata fields** (defined in Cloudinary; editable in the Media Library): `photographer`, `copyright`, `licence`, `capture_location`, `default_alt`. These travel with the asset (ADR-5).

### 4.2 Transformation presets (`/lib/cloudinary/presets.ts`)

Every preset applies `f_auto` (AVIF→WebP→fallback) and a `q_auto` tier. Components reference presets by key; raw params never appear at call sites (ADR-6).

| Preset key | Crop / gravity | Quality | Aspect(s) | Used by |
|------------|----------------|---------|-----------|---------|
| `hero` | `c_fill,g_auto` | `q_auto:good` | 16:7 (≥md) · 4:5 (sm) | HeroMedia, threshold plate |
| `editorial` | `c_fill,g_auto` | `q_auto:good` | per figure | EditorialImage inline |
| `portrait` | `c_fill,g_face` (fallback `g_auto`) | `q_auto:good` | 4:5 | faculty/author/producer portraits |
| `product` | `c_pad,g_auto,b_auto` or `c_fill,g_auto` | `q_auto:best` | 1:1 & 4:5 | Apothecary product plates |
| `ingredient` | `c_fill,g_auto` | `q_auto:best` | 3:2 | ingredient detail |
| `gallery_thumb` | `c_fill,g_auto` | `q_auto:eco` | 1:1 | Gallery strip/grid |
| `wide` | `c_fill,g_auto` | `q_auto:good` | 21:9 | cinematic journey/hero bands |
| `lqip` | `w_24,e_blur:1000` | `q_1` | matches parent | blur placeholders |
| `og` | `c_fill,g_auto` | `q_auto` | 1200×630 | social cards |

Gravity note: `g_auto` = content-aware focal detection (satisfies "focal point detection"); `g_face`/`g_faces` for portraits (satisfies "face detection where appropriate"). Cloudinary's stored **hotspot/crop from the Media Library** overrides auto-gravity when an editor has set one.

### 4.3 Responsive delivery

`EditorialImage` emits a responsive `srcset` derived from its `sizes` prop and a shared width ladder `[320, 480, 640, 768, 1024, 1280, 1536, 1920, 2560]`, with `dpr_auto`. Each component declares `sizes` explicitly:

- Full-bleed hero: `sizes="100vw"`.
- Two-up editorial: `sizes="(min-width:1024px) 50vw, 100vw"`.
- Gallery thumb: `sizes="(min-width:768px) 25vw, 50vw"`.

`width`/`height` (or intrinsic aspect) are always set so the browser reserves layout (CLS 0).

### 4.4 Blur placeholders (LQIP)

`/lib/cloudinary/lqip.ts` generates a tiny `lqip`-preset URL and returns a base64 `blurDataURL` (fetched/encoded server-side at request or build). `EditorialImage` passes `placeholder="blur"`. LQIP grade must match the final grade (Ch. 8.2) so the transition reads as a focus-pull, not a colour shift.

### 4.5 Video pipeline

- Delivery: Cloudinary **adaptive bitrate streaming** (HLS) with `f_auto:video` and `q_auto`; `sp_auto` streaming profile (or `sp_full_hd` for cinematic journey heroes).
- Poster: a designated poster image asset per video (preferred) or `so_auto`/`so_0` frame; poster is the paint target and may be the LCP element.
- Ambient hero video: muted, `loop`, `playsInline`, **autoplay gated** on `prefers-reduced-motion: no-preference` AND not `Save-Data`; otherwise the poster stands in with a play affordance.
- Narrative video (interviews, documentary): `player` mode, full controls, **WebVTT captions required**, chapters where available.
- Weight discipline: never ship raw MP4 to the client; the stream is deferred until in-view or on play (Ch. 12).

### 4.6 Editor workflow (no developer)

1. Editor opens a document in Studio, clicks the Cloudinary field, and the **Media Library widget** opens.
2. Editor uploads or selects; the asset lands in the correct folder (preset-locked) and inherits default tags.
3. Editor sets hotspot/crop and, if needed, structured metadata (photographer/copyright) in the widget.
4. Editor writes **context alt** and optional **caption** in the adjacent Sanity fields.
5. On publish, delivery is automatic — `f_auto`, `q_auto`, responsive, LQIP — with no code change. Moving a `mediaAsset` from `brief` to `final` is the same one-field status flip defined in v2.

---

## Chapter 5 — Sanity integration

### 5.1 Plugin & config

Install `sanity-plugin-cloudinary`; register the Cloudinary custom input type. Configure the cloud name and the restricted unsigned preset. Add a Studio **Media** desk pane that lists `mediaAsset`/`videoAsset` documents for library-style browsing and reuse.

### 5.2 Reusable media documents (extend, do not replace v2's `mediaAsset`)

**`mediaAsset`** (v2 fields retained: `status`, `purpose`, `composition`, `lens`, `lighting`, `grade`, `mood`, `location`, `subject`, `props`, `caption`, `alt`, `decorative`, `credit`) — **add**:

| Field | Type | Notes |
|-------|------|-------|
| `cloudinary` | `cloudinary.asset` | the picked/uploaded reference; required when `status ∈ {interim, final}` |
| `focalOverride` | boolean | true if editor set a manual hotspot (disables `g_auto`) |
| `copyright` | string | falls back to Cloudinary structured metadata |
| `tags` | array<string> | mirror of the controlled vocabulary for GROQ filtering |

**`videoAsset`** (new): `cloudinary` (`cloudinary.asset`, video), `poster` (→ `mediaAsset`), `mode` (`ambient|player`), `captionsVtt` (file/URL, required for `player`), `chapters` (array of `{ label, start }`), `credit`, `copyright`, `alt/description`.

**`person`** (new/extended): faculty, authors, producers, guides — `name`, `role`, `bioShort`, `bioLong` (portable), `portrait` (→ `mediaAsset`, `portrait` preset), `credentials`, `links`.

### 5.3 GROQ discipline

One query per route, projecting the full render model including resolved media references and `person` joins. Projections resolve the Cloudinary reference fields the render model needs (`public_id`, `format`, `width`, `height`, `secure_url`) plus the Sanity context `alt`/`caption`. Query shape (illustrative projection, not application code):

```
*[_type == "product" && slug.current == $slug][0]{
  ..., "hero": hero->{ status, alt, caption, credit, "cld": cloudinary.asset },
  ingredients[]->{ name, "img": image->{ alt, "cld": cloudinary.asset } },
  faculty[]->{ name, role, "portrait": portrait->{ alt, "cld": cloudinary.asset } }
}
```

`resolveMedia.ts` converts each projected node into the render model consumed by `Plate`/`EditorialImage`, applying the `/public` fallback during migration (ADR-8).

---

## Chapter 6 — The media component layer (behavioural spec)

- **Single entry points.** All imagery renders through `Plate` (framed/placeholder-aware regions) or `EditorialImage` (inline editorial). All video renders through `HeroMedia`/`EditorialVideo`. No other component constructs media URLs.
- **Alt resolution order:** Sanity context `alt` → Cloudinary `default_alt` → (if `decorative`) `alt=""`. A non-decorative asset with no alt from either source **fails CI** (Ch. 16).
- **Credit/copyright:** rendered by `MediaCaption` when present; sourced Sanity-first, Cloudinary-fallback.
- **Priority policy:** exactly one `priority` media element per route (the LCP candidate — hero image or video poster). Everything else lazy.
- **Placeholder policy:** every `EditorialImage` has an LQIP; every video has a poster. No empty boxes, ever.

---

## Chapter 7 — The Apothecary (editorial monograph)

**Positioning:** a museum-catalogue publication, not a shop. Commerce is present but subordinate to scholarship ("knowledge before commerce").

### 7.1 Index page (`/apothecary`)

Editorial index, not a product grid. A short institutional standfirst; collections presented as editorial cards (image + name + one line), isnād dividers between collections; a quiet "browse the full apothecary" affordance. No prices, badges, or "sale" language on the index.

### 7.2 Product Monograph (`/apothecary/[slug]`) — section sequence

1. **Masthead of the monograph** — catalogue number (mono), product name (Fraunces), Arabic name (Amiri), one-line standfirst.
2. **Hero** — `HeroMedia` (image or ambient video), `hero`/`wide` preset.
3. **Introduction** — institutional framing, 1–2 measured paragraphs.
4. **The ingredient** — ingredient photography (`ingredient` preset) + origin story.
5. **Origin & harvest** — harvest location, producer information; optional map (Ch. 9 pattern reused).
6. **Craftsmanship & preparation** — how it is prepared; detail photography.
7. **Traditional usage** — the prophetic-tradition context (scholarly, sourced).
8. **Modern understanding & evidence-informed commentary** — governed by Ch. 7.6.
9. **Clinical considerations** — cautions, interactions, who should seek advice.
10. **Gallery** — `Gallery` (editorial layout); optional 360 (future seam, Ch. 13).
11. **Quality standards** — sourcing, testing, packaging.
12. **FAQs** — accordion, accessible.
13. **References** — `ReferenceList` with citations.
14. **Related** — related ingredients, related products, related Academy courses, related articles, related journeys (cross-pillar).
15. **Downloadable monograph** — PDF (generated or uploaded); link with size/format stated.
16. **Commerce band** — purchase affordance presented with restraint at the foot, never as the hero.

### 7.3 Content model — `product` (document)

`catalogueNo`, `nameEn`, `nameAr`, `slug`, `standfirst`, `hero` (→ media), `introduction` (portable), `ingredients` (array → `ingredient`), `origin` `{ location, producer→person, harvestNote }`, `preparation` (portable + media), `traditionalUsage` (portable, sources required), `modernCommentary` (portable, evidence-linked), `clinicalConsiderations` (portable), `gallery` (array → media), `qualityStandards` (portable), `faqs` (array `{ q, a }`), `references` (array → `reference`), related refs (products/ingredients/courses/articles/journeys), `monographPdf` (file), `commerce` `{ sku, price, availability, externalBuyUrl? }`, `seo`.

`ingredient` (document, reusable across products): `name`, `botanicalName`, `image` (→ media), `originNote`, `relatedProducts`.

### 7.4 Media plan

Hero → `hero`/`wide`; ingredient → `ingredient`; producer → `portrait`; gallery → `product` + `gallery_thumb`. All `final` from Cloudinary; `brief` placeholders carry shot briefs until commissioned (Ch. 8).

### 7.5 Motion & a11y

Reveals per Ch. 10; FAQ accordion keyboard-operable with `aria-expanded`; gallery lightbox per Ch. 3.1; references are real anchors with back-links.

### 7.6 Content governance & health-claims (mandatory)

Because products are ingestible and the audience is health-seeking, the schema and editorial process must keep claims lawful and truthful:
- `modernCommentary` statements that assert an effect **require** at least one linked `reference`; the Studio validates this.
- The renderer surfaces a standing, quiet **non-diagnostic disclaimer** on every product page (traditional-use framing; not a substitute for medical advice).
- Editorial review must ensure claims comply with the applicable advertising and health-claim regulations in the markets served (in the UK, ASA/CAP and MHRA guidance on medicinal claims and permitted health claims). This is a governance requirement on the content team; engineering enforces the reference-linking and disclaimer mechanics. This is not legal advice — route final claim wording through qualified review.

---

## Chapter 8 — Photography & visual direction system

The institution must look commissioned and coherent. This chapter is the visual bible; it binds to the Cloudinary tag taxonomy (Ch. 4.1).

### 8.1 Per-pillar direction

| Pillar | Light | Subjects | Palette / grade | Composition | Never |
|--------|-------|----------|-----------------|-------------|-------|
| Apothecary | natural, single-source, morning | glass, wood, stone, herbs, ingredients, laboratory, hands, preparation | warm neutral, low saturation, deep shadow | still-life restraint, negative space | floating herbs, splashes, wellness clichés |
| Academy | natural + soft studio | teaching, books, students, clinical practice, equipment, faculty, classrooms, certification | calm neutral, honest | documentary, candid over posed | corporate smiles, staged "diversity" shots |
| Sacred Journeys | golden/blue hour, architectural | mosques, architecture, pilgrimage, companionship, reflection, travel | cinematic, slightly cooler, luminous | wide, human-scale, reverent | tourist snapshots, over-processed HDR |
| Knowledge Library | low, directional | manuscripts, books, libraries, writing, scholarship | archival, muted, paper-toned | detail + still, textural | stocky "flat-lay desk" tropes |
| Clinical | soft, clean | consultations, calm private spaces, professionalism | quiet, trustworthy | measured, respectful of privacy | clinical coldness, stocky "doctor" poses |

### 8.2 Coherence rules

- **One grade family.** All pillars share a warm-neutral base grade with pillar-specific temperature shifts (Journeys cooler, Library paper-toned). LQIP grade matches final grade (Ch. 4.4).
- **No stock, no AI imagery, no lifestyle stock.** Enforced at content review; violations are release-blocking for the asset.
- **Human presence is real.** People are named (`person`), credited, and photographed candidly.
- **Placeholders are art-directed.** Until commissioned photography exists, `Plate` `brief` state shows the shot brief (purpose · composition · lens · light · grade · mood) — the absence reads as intent.

### 8.3 Shot-brief data

Every planned image is a `mediaAsset` in `brief` status carrying its brief. This doubles as the commissioning worksheet for the photographer and the placeholder on the live site. `status` advances `brief → interim → final` with no layout or code change.

---

## Chapter 9 — The Academy (programme microsites) & 9-bis maps

**Positioning:** executive education, not an LMS listing.

### 9.1 Programme page (`/academy/[slug]`) — section sequence

Hero imagery → course introduction → faculty (portraits, `person`) → curriculum (modules) → learning outcomes → clinical practice → facilities → student journey → gallery → testimonials → FAQs → assessment → certification → graduate pathways → entry requirements → course handbook (download) → editorial storytelling interludes → student-interview video (`player` mode, captioned).

### 9.2 Content model — `programme` (document)

`title`, `slug`, `standfirst`, `hero` (→ media), `introduction` (portable), `faculty` (array → `person`), `curriculum` (array → `curriculumModule {title, summary, hours}`), `outcomes` (array<string>), `clinicalPractice` (portable + media), `facilities` (portable + gallery), `studentJourney` (ordered steps), `gallery` (array → media), `testimonials` (array → `testimonial {quote, attribution, portrait}`), `faqs`, `assessment` (portable), `certification` (portable), `graduatePathways` (portable), `entryRequirements` (portable), `handbookPdf` (file), `interviews` (array → `videoAsset`), `seo`.

### 9.3 Maps (shared pattern, reused by Journeys)

A `MapFigure` component renders a static, styled map image (privacy-respecting, no third-party trackers by default) with plotted points from CMS coordinates; interactive upgrade is a Ch. 13 seam. Consent-gated if a third-party interactive map is later enabled.

---

## Chapter 10 — Sacred Journeys (experiences) & the motion system

**Positioning:** cinematic experiences, not booking pages.

### 10.1 Journey page (`/sacred-journeys/[slug]`) — section sequence

Cinematic hero (video `wide`/`sp_full_hd`, poster-first) → journey story → interactive itinerary (day-by-day) → accommodation → maps (Ch. 9.3) → educational programme → spiritual preparation → packing guide → reading list → reflection-journal artefact → gallery → testimonials → FAQs → travel information → registration (invitation, not a checkout).

### 10.2 Content model — `journey` (document)

`title`, `slug`, `standfirst`, `heroVideo` (→ `videoAsset`) / `hero` (→ media fallback), `story` (portable), `itinerary` (array → `itineraryDay {day, title, narrative, locations[], media}`), `accommodation` (portable + gallery), `map` `{ points[{label,lat,lng,note}] }`, `programme` (portable), `preparation` (portable), `packingGuide` (array), `readingList` (array → `reference`/`article`), `reflectionJournal` (downloadable artefact), `gallery` (array → media), `testimonials`, `faqs`, `travelInfo` (portable), `registration` `{ mode: enquiry|waitlist|external, url? }`, `seo`.

### 10.3 Motion system (global; extends v2 tokens)

Principles: **elegant, slow, natural, never distracting, never "tech-startup."** Tokens inherited from v2 (`--ease-out`, `--dur`, `--dur-reveal`).

| Effect | Where | Spec | Reduced-motion |
|--------|-------|------|----------------|
| Arrival choreography | homepage hero | per v2 Ch. 11.1 | skipped; static |
| Section reveal | all pages | `translateY(16px)→0` + opacity, `--dur-reveal`, IO threshold 0.2, once, stagger ≤80ms | disabled; content visible |
| Image reveal | editorial images | gentle mask/opacity on first view, ≤700ms | opacity-only ≤200ms or none |
| Parallax | hero/cinematic bands only | subtle background translate (≤8% of scroll), **desktop ≥lg only** | disabled |
| Hover micro-interactions | links, cards | underline draw / arrow advance, ≤200ms | opacity-only |
| Video | ambient heros | autoplay gated (Ch. 4.5) | poster only, no autoplay |

No parallax on text, no motion conveying information without a static equivalent, no scroll-jacking, no motion library beyond a ≤1KB IntersectionObserver + CSS.

---

## Chapter 11 — Knowledge Library (publication)

**Positioning:** a genuine publishing house — long-form editorial, not a blog.

### 11.1 Article page (`/library/[slug]`) — composition

Article masthead (kicker, title in Fraunces, standfirst, author→`person`, `ReadingTime`, publication + revision dates) → hero editorial photograph → long-form body (`PortableBody`) supporting: pull quotes, block quotes, footnotes (with back-references), tables, figures (numbered, captioned), medical diagrams/illustrations, references/academic citations, and inline video embeds → author biography → references → related articles / products / courses / journeys → audio narration (future seam, Ch. 13).

### 11.2 Content model — `article` (document)

`kicker`, `title`, `slug`, `standfirst`, `author` (→ `person`), `hero` (→ media), `body` (portable text with the registered types in Ch. 3.2), `footnotes` (array), `references` (array → `reference`), `figures` (array → `figure {media|diagram, caption, number}`), `related` (cross-pillar refs), `publishedAt`, `revisions` (array `{date, note}`), `audioNarration` (→ `audioAsset`, future), `readingTimeOverride?`, `seo`.

### 11.3 Long-form typography

Measure ≤ 68ch; Newsreader body per v2 ramp; pull quotes in Newsreader italic; footnotes and citations in the mono/small styles; figures numbered and referenced from the text; tables get horizontal scroll on small screens with a visible affordance. Reading time is computed, not authored (unless overridden).

---

## Chapter 12 — Performance

### 12.1 Core Web Vitals targets (per route, mid-tier mobile)

| Metric | Target | Ceiling |
|--------|--------|---------|
| LCP | ≤ 2.0s | 2.5s |
| CLS | ≤ 0.03 | 0.1 |
| INP | ≤ 150ms | 200ms |

### 12.2 Media budgets (above-the-fold, compressed)

| Role | Budget |
|------|--------|
| LCP image (or video poster) | ≤ 200KB |
| Total above-the-fold imagery | ≤ 500KB |
| Ambient hero video (initial) | poster only; stream deferred, first segment ≤ ~600KB |
| Fonts | ≤ 140KB, ≤ 6 WOFF2 (inherited v2) |
| Route JS (hydration) | ≤ 90KB per route |

### 12.3 Techniques (required)

Priority/preload exactly one LCP media element per route; lazy everything below the fold; `f_auto`+`q_auto` on every image; ABR + deferred load for video; responsive `srcset` + correct `sizes`; per-route code splitting; RSC streaming with Suspense for below-the-fold sections; Cloudinary CDN caching + Next ISR/revalidation (webhook from Sanity on publish); no render-blocking JS; font-metric overrides so font swap contributes 0 CLS; `Save-Data`/reduced-motion downgrade paths. **Lighthouse CI budgets fail the build on regression.**

---

## Chapter 13 — Future extensibility (build the seams now)

Implement the schema stubs and component seams so these need no re-architecture later:
- **`audioAsset`** (Cloudinary audio) + article `audioNarration` + a `PodcastEpisode` document — for podcasts and article narration.
- **Documentary:** long-form `videoAsset` with `chapters` + a `filmStrip` gallery — the `player` mode already supports it.
- **Webinar:** `event` document with `mode: live|recording` and an embed seam (consent-gated).
- **360 imagery:** a `Media360` component seam behind `Plate` (Cloudinary 360 spin / viewer) — product galleries already reserve the slot.
- **Localisation / full RTL locale:** all layout uses logical properties (inherited v2) so an Arabic locale mirrors without rework.

Each seam is a schema field + a component boundary + a tag/folder in Cloudinary (`future/…`), left dormant (graceful-empty) until content exists.

---

## Chapter 14 — Accessibility (WCAG 2.2 AA, verified)

Inherited v2 baselines apply site-wide. Phase 3 additions:
- **Images:** alt resolution per Ch. 6; decorative imagery `alt=""`; figures use `<figure>/<figcaption>` linked via `aria-describedby`.
- **Video:** narrative video requires WebVTT captions; players are fully keyboard-operable with visible focus; no autoplay with sound; ambient video is decorative and never sole carrier of meaning.
- **Galleries/lightbox:** roving tabindex, `Esc` to close, focus trap while open, focus returns to trigger.
- **Reduced motion:** disables parallax, image reveals (beyond opacity), video autoplay, and scroll reveals — content is fully present.
- **Structure:** one `<h1>` per page; correct landmark and heading order; skip link first in tab order.
- **Contrast:** all token pairings meet AA; the CI contrast test (v2 Ch. 13.3) runs on every build.
- **Arabic runs:** correct `lang="ar"`/`dir="rtl"`; Arabic never rendered in a Latin face.

---

## Chapter 15 — Migration strategy

**3A.0 — Foundations.** Cloudinary account, folder + tag taxonomy, structured-metadata fields, restricted upload preset; install `sanity-plugin-cloudinary`; add `remotePatterns`; set env vars; extend `mediaAsset` + add `videoAsset`/`person`; ship `/lib/cloudinary` (presets, url, lqip, loader) and `resolveMedia.ts` with the `/public` fallback (ADR-8).

**3A.1 — Media layer live.** Implement `Plate` (Cloudinary behind `final`), `EditorialImage`, `HeroMedia`, `EditorialVideo`, `Gallery`, `MediaCaption`. The resolver serves Cloudinary when a reference exists, `/public` otherwise — nothing breaks.

**3A.2 — Asset migration.** Bulk-upload existing `/public` media to Cloudinary via the Upload API/CLI into the correct folders with default tags; backfill Sanity `cloudinary` references; verify parity; then **remove `/public` media and the resolver fallback.** `/public` retains UI chrome only.

**3B — Editorial build, pillar by pillar.** Homepage (extend v2) → Library → Academy → Apothecary → Sacred Journeys (order by content-readiness; Library and Academy are the most content-ready, Journeys the most media-dependent). Each pillar consumes the media layer; no pillar re-implements media.

**Rollback.** The Cloudinary loader is feature-flagged; per-asset rollback is possible until 3A.2 completes. After 3A.2, rollback is redeploy-based.

---

## Chapter 16 — Acceptance criteria

A phase increment is accepted only when all hold:

1. Every rendered image and video resolves to Cloudinary (no `/public` media) after 3A.2.
2. All imagery renders through `Plate`/`EditorialImage`; all video through `HeroMedia`/`EditorialVideo`; no raw Cloudinary URLs at call sites.
3. Editors can upload/select, set hotspot + structured metadata, and write context alt entirely in Studio, and the asset appears optimised on the site with no code change.
4. `f_auto`/`q_auto` verified serving AVIF/WebP; responsive `srcset` present; every image has an LQIP; every video has a poster.
5. `brief → interim → final` status flip changes media with **zero layout shift** (measured).
6. Every non-decorative image has an alt (Sanity or Cloudinary); missing alt fails CI.
7. Narrative video has working captions and a keyboard-operable player; ambient video obeys the autoplay gate.
8. Each pillar page matches its section sequence and content model in Chapters 7–11.
9. Photography coherence: assets carry the controlled tags; grade/LQIP consistent; no stock/AI/lifestyle-stock present.
10. Motion matches Chapter 10; reduced-motion path verified on every page.
11. Product pages enforce reference-linked claims and render the disclaimer (Ch. 7.6).
12. Performance budgets and CWV targets met; Lighthouse a11y & best-practices ≥ 95; budget regressions fail the build.
13. Accessibility (Ch. 14) verified: landmarks, one `<h1>`, focus management, contrast, Arabic `lang`/`dir`.
14. Future seams (Ch. 13) exist as dormant schema + component boundaries without affecting current UX.

---

## Chapter 17 — Testing checklist

**Unit:** transformation presets produce expected params (crop/gravity/quality/format); `resolveMedia` maps references + `/public` fallback correctly; alt-resolution order; reading-time calculation; claims validator (reference required).
**Component:** `Plate` state matrix (brief/interim/final) with CLS assertions; `EditorialImage` srcset/sizes/LQIP; `EditorialVideo` autoplay gate under reduced-motion & Save-Data; `Gallery` keyboard + focus trap; portable-text renderer for every registered type.
**Integration (per pillar):** GROQ returns the full render model incl. `person` joins and media refs; each section renders from CMS with no hard-coded copy.
**Accessibility:** automated axe pass + manual keyboard walkthrough per template; caption presence for narrative video; contrast CI; screen-reader spot check on the bilingual hero.
**Performance:** Lighthouse CI per template against budgets; LCP element is the intended media; CLS ≤ target; verify AVIF/WebP negotiation and deferred video.
**Editorial E2E:** an editor uploads a new asset in Studio → it appears optimised on the live route; a `brief`→`final` flip swaps media with no layout shift.
**Migration:** parity check between `/public` originals and Cloudinary-delivered assets before `/public` removal; broken-media scan after fallback removal.

---

## Chapter 18 — Production readiness checklist

- [ ] Cloudinary account: folders, tags, structured metadata, restricted upload preset, ABR video enabled.
- [ ] Secrets set per environment; API secret confirmed **not** bundled client-side.
- [ ] `remotePatterns`/CSP allow Cloudinary delivery + widget; CSP reviewed for the media widget and any embeds.
- [ ] Sanity Cloudinary plugin live; Media desk pane available; editor roles scoped.
- [ ] Revalidation webhook (Sanity publish → Next ISR) working; caching headers verified.
- [ ] `/public` media removed; resolver fallback retired; broken-media scan clean.
- [ ] CWV budgets green on staging under throttled mobile; Lighthouse CI wired into the pipeline.
- [ ] Accessibility sign-off (automated + manual) per template.
- [ ] Content governance: product disclaimer live; claims-reference validation enforced; claim wording routed through qualified review.
- [ ] OG images generate from Cloudinary (never a placeholder); schema.org per template (Product/Course/Article; **no medical schema** — inherited v2 Ch. 15).
- [ ] Backup/versioning: Sanity dataset export cadence; Cloudinary asset retention policy documented.
- [ ] Rollback procedure documented.

---

## Chapter 19 — Open decisions (implement the seam; flag the decision)

1. **Studio deployment:** embedded (`/studio`) vs standalone host — affects CSP and auth. Default: embedded unless infra dictates otherwise.
2. **Upload security:** unsigned restricted preset (simplest for editors) vs signed server-route uploads (tighter). Default: restricted unsigned preset with strict folder/format/size limits; provide the signed route seam.
3. **Interactive maps:** static styled maps (privacy-first) now; third-party interactive maps are consent-gated and deferred.
4. **PDF monographs/handbooks:** generated from content vs editor-uploaded. Default: editor-uploaded field now; generation is a later seam.
5. **Commerce backend:** the Apothecary purchase affordance target (existing store vs external) — engineering exposes the field; business ratifies.
6. **Founding year, authority figures, department URLs, Arabic sign-off, correspondence provider** — inherited from v2 Ch. 18; remain content ratifications, not engineering blockers.

---

*End of Phase 3 Implementation Specification. This document is intended to be executable by Cursor without further clarification. It extends — and must remain consistent with — the Homepage Build Specification v2.0; where the two differ, the later approved revision governs and the change is recorded here.*
