# 06 — CMS Architecture

## Overview

Sanity CMS serves as the sole content management system for Sunnah Remedies. It provides a professional editorial interface through which non-developers manage all website content.

The CMS is invisible to visitors. The public website remains completely bespoke.

---

## Technology

| Layer | Technology |
|---|---|
| CMS | Sanity (hosted) |
| Studio | Sanity Studio, embedded at `/studio` |
| Frontend | Next.js App Router |
| Query Language | GROQ |
| Image Pipeline | Sanity CDN → Future: Cloudinary |
| Rich Text | Portable Text |
| Hosting | Vercel |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    VISITORS                          │
│              (see bespoke frontend)                  │
└─────────────────────┬───────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│              NEXT.JS FRONTEND                        │
│                                                     │
│  ┌─────────┐  ┌─────────┐  ┌──────────────────┐   │
│  │  Pages  │  │ Comps   │  │  GROQ Queries    │   │
│  │ (App    │──│ (same   │──│  (src/sanity/    │   │
│  │  Router)│  │  as v1) │  │   lib/queries)   │   │
│  └─────────┘  └─────────┘  └────────┬─────────┘   │
│                                      │              │
└──────────────────────────────────────┼──────────────┘
                                       │
┌──────────────────────────────────────▼──────────────┐
│                SANITY CMS                            │
│                                                     │
│  ┌──────────────┐  ┌───────────────────────────┐   │
│  │ Sanity Studio│  │    Content Lake            │   │
│  │ (/studio)    │  │    (hosted by Sanity)      │   │
│  └──────────────┘  └───────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────┐
│            FUTURE INTEGRATIONS                       │
│                                                     │
│  ┌───────────┐  ┌──────────┐  ┌─────────────┐     │
│  │Cloudinary │  │ Shopify  │  │   Stripe    │     │
│  │(media CDN)│  │(commerce)│  │ (payments)  │     │
│  └───────────┘  └──────────┘  └─────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Schema Organisation

### Directory Structure

```
src/sanity/
├── schemas/
│   ├── index.ts                    → Schema registry
│   ├── objects/
│   │   ├── seo.ts                  → SEO fields (reusable)
│   │   ├── media.ts                → Image, video, download objects
│   │   ├── rich-content.ts         → Portable Text + custom blocks
│   │   ├── editorial-workflow.ts   → Draft/Published/Scheduled
│   │   └── prophetic-reference.ts  → Citation object
│   └── documents/
│       ├── global/
│       │   ├── institution-settings.ts
│       │   ├── navigation.ts
│       │   ├── footer.ts
│       │   ├── global-seo.ts
│       │   ├── announcement.ts
│       │   └── testimonial.ts
│       ├── apothecary/
│       │   ├── product.ts
│       │   ├── collection.ts
│       │   ├── category.ts
│       │   └── ingredient.ts
│       ├── academy/
│       │   ├── programme.ts
│       │   └── faculty.ts
│       ├── journeys/
│       │   └── journey.ts
│       ├── knowledge/
│       │   ├── article.ts
│       │   ├── author.ts
│       │   └── topic.ts
│       ├── clinical/
│       │   └── consultations-page.ts
│       ├── institution/
│       │   └── charter.ts
│       └── pages/
│           └── homepage.ts
├── structure/
│   └── index.ts                    → Studio desk structure
└── lib/
    ├── client.ts                   → Sanity client configuration
    ├── image.ts                    → Image URL builder
    └── queries.ts                  → All GROQ queries
```

---

## Document Types

### Global (Singletons)

| Type | Purpose |
|---|---|
| `institutionSettings` | Core institutional information |
| `navigation` | Main navigation structure |
| `footerSettings` | Footer content and links |
| `globalSeo` | Default SEO settings |
| `homepage` | All homepage sections |
| `consultationsPage` | Clinical consultations page |
| `charter` | Founding charter document |

### Collections

| Type | Purpose | Key Fields |
|---|---|---|
| `product` | Apothecary remedies | slug, name, botanicalName, monograph content |
| `collection` | Product groupings | slug, name, products[] |
| `category` | Product categories | slug, name, description |
| `ingredient` | Ingredient library | slug, name, botanicalName, traditional uses |
| `programme` | Academy programmes | slug, name, curriculum, faculty |
| `faculty` | Teaching staff | slug, name, qualifications, chain |
| `journey` | Sacred journeys | slug, name, itinerary, scholars |
| `article` | Knowledge library | slug, title, body, author, topics |
| `author` | Article authors | slug, name, biography |
| `topic` | Article topics/tags | slug, title, description |
| `testimonial` | Attestations | statement, name, department |
| `faq` | Questions | question, answer, department |
| `announcement` | Site announcements | message, active, dates |

---

## Reusable Objects

| Object | Used In | Purpose |
|---|---|---|
| `seo` | All document types | Meta title, description, OG, etc. |
| `institutionalImage` | All types with imagery | Image + alt + caption + credits + Cloudinary ID |
| `institutionalVideo` | Products, programmes, journeys | Video embed + metadata |
| `downloadFile` | Multiple types | File attachment with metadata |
| `editorialWorkflow` | All publishable types | Status, author, reviewer, version |
| `propheticReference` | Products, articles | Graded hadith/Qur'an citation |
| `richContent` | Articles, charter, programmes | Portable Text with custom blocks |

---

## Rich Content Blocks

The Portable Text editor supports:

| Block | Purpose |
|---|---|
| Standard text | Paragraphs, headings, lists |
| `arabicText` | Arabic with transliteration and translation |
| `quranReference` | Formatted Qur'anic citation |
| `hadithReference` | Graded hadith with source |
| `footnote` | Academic footnotes |
| `academicCitation` | Formal bibliography entry |
| `evidencePanel` | Evidence summary with level |
| `clinicalNote` | Clinical information/warning |
| `scholarNote` | Scholarly commentary |
| `calloutBox` | Highlighted information |
| `warningBlock` | Important warnings |
| `downloadFile` | Inline file download |
| Image | With alt text and caption |

---

## Data Flow

### Build Time (Static Generation)

1. Next.js page requests data via GROQ query
2. Sanity client fetches from Content Lake
3. Data passed to existing components (unchanged)
4. Page rendered with institutional design system

### Revalidation

- ISR (Incremental Static Regeneration) with on-demand revalidation
- Sanity webhook triggers revalidation on publish
- Pages regenerate without full rebuild

### Preview

- Draft content viewable via preview client
- Editors see unpublished changes before going live
- Preview uses same components — identical visual output

---

## Future Integration Points

### Cloudinary (Media)

Every `institutionalImage` and `institutionalVideo` schema includes a `cloudinaryAssetId` field (currently hidden). When Cloudinary is integrated:

1. Media uploaded to Cloudinary
2. Asset ID stored in Sanity
3. `resolveMediaUrl()` function resolves Cloudinary delivery URL
4. Responsive transforms applied at edge

### Shopify (Commerce)

Every `product` schema includes a `futureShopifyProductId` field. When Shopify is integrated:

1. Products managed in Sanity (editorial content)
2. Shopify handles inventory, checkout, shipping
3. Product pages merge Sanity content + Shopify availability
4. Cart and checkout rendered by Shopify Storefront API

### Stripe (Payments)

Payment processing prepared through:
1. Programme and journey schemas include fee structures
2. Future integration via Stripe Checkout or Payment Intents
3. No Stripe code exists yet — only architectural preparation

---

## Studio Organisation

The Sanity Studio is organised by institutional department:

1. **Editorial** — Homepage, Announcements, Navigation
2. **The Apothecary** — Products, Collections, Ingredients
3. **The Academy** — Programmes, Faculty
4. **Sacred Journeys** — Journeys
5. **Knowledge Library** — Articles, Authors, Topics
6. **Clinical** — Consultations page
7. **Institution** — Charter, Settings, Footer, SEO
8. **Testimonials & FAQs** — Cross-department

---

## Naming Conventions

| Convention | Example |
|---|---|
| Document type | camelCase: `institutionSettings` |
| Field name | camelCase: `botanicalName` |
| Schema file | kebab-case: `institution-settings.ts` |
| Query export | camelCase + "Query": `allProductsQuery` |
| Slug field | Always `slug` with type `slug` |
| Reference fields | Named by relationship: `author`, `faculty`, `ingredients` |

---

## Performance

- GROQ queries request only needed fields (no over-fetching)
- Images served at appropriate sizes via Sanity CDN
- Static generation for all public pages
- API responses cached at CDN edge
- No client-side data fetching on public pages
