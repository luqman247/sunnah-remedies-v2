---
title: Sunnah Remedies — Search, SEO & Knowledge Architecture
document_type: Engineering Specification (Cursor Implementation Blueprint)
phase: Discoverability, Authority & Structured Knowledge
status: For implementation
constraints: No redesign · No typography change · No layout change · No design-language change · No code in this document
stack: Next.js (App Router) · Sanity · Cloudinary · Shopify Storefront API + Stripe · Vercel edge/ISR
---

# SUNNAH REMEDIES — SEARCH, SEO & KNOWLEDGE ARCHITECTURE
## Engineering Specification — Cursor Implementation Blueprint

*The objective is not excellent SEO. The objective is to make Sunnah Remedies the most authoritative, discoverable, structured, and searchable digital institution for Prophetic Medicine — for humans, classical search engines, and large language models alike.*

---

## 0. SCOPE, CONSTRAINTS & GOVERNING PRINCIPLES

### 0.1 What this phase does and does not touch

This phase is **purely additive** to the presentation layer built in Phases 1–4. It introduces metadata, structured data, a knowledge graph, internal linking, a search engine, filtering, AI-discoverability surfaces, editorial SEO tooling, analytics, and performance work. It **must not** alter any visual design, typography, layout, component styling, or design token established in Phase 1. Every deliverable in this document either lives in the `<head>`, in non-visual route handlers (sitemaps, feeds, robots, `llms.txt`), in the Sanity schema/Studio, in a search index, or in *net-new* content routes (entity pages, citation pages) that inherit the existing design system without modifying it.

Where a new visible surface is unavoidable (search UI, filter UI, entity pages), it is assembled **exclusively from existing Phase 1 components and tokens**. No new visual language is introduced. If a required interaction has no existing component, it is escalated to the design owner rather than improvised.

### 0.2 Stack assumptions (confirm before build)

The specification assumes: **Next.js App Router** (React Server Components, `generateMetadata`, route handlers, ISR); **Sanity** as the content lake and the single source of truth for editorial entities and their relationships; **Cloudinary** for all media and its derivations; **Shopify Storefront API** for commerce data with **Stripe** for payment; and **Vercel** for hosting with edge middleware and Incremental Static Regeneration. If any assumption is wrong (e.g. Pages Router, different host), the affected sections are flagged in §0.5 as requiring adaptation, but the architecture is otherwise portable.

### 0.3 The core idea — the site becomes a knowledge base, not a page collection

The organising principle of the entire phase: **every meaningful concept is an entity, every entity is a node in a graph, and every page is a rendered view of one or more nodes.** Products, ingredients, conditions, hadith, Qur'anic references, research papers, scholars, courses, and journeys are not "pages" — they are typed entities with declared relationships. The website, the structured data, the internal links, the search index, and the AI surfaces are all *projections of one underlying graph* held in Sanity. This is what makes the institution coherent to a crawler, an LLM, and a human simultaneously, and it is what prevents the SEO layer from becoming a bolt-on that rots.

### 0.4 The three consumers, one source

Every artefact this phase produces serves three consumers from a single source of truth:

```
                    ┌──────────────────────────────┐
                    │   SANITY (source of truth)   │
                    │  entities + relationships +  │
                    │   editorial SEO metadata     │
                    └──────────────┬───────────────┘
                                   │  GROQ projections
             ┌─────────────────────┼─────────────────────┐
             ▼                     ▼                     ▼
   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
   │  HUMANS          │  │  SEARCH ENGINES  │  │  LLMs / AI        │
   │  rendered pages  │  │  metadata +      │  │  llms.txt +       │
   │  + internal      │  │  JSON-LD +       │  │  entity pages +   │
   │  search + facets │  │  sitemaps +      │  │  citation anchors │
   │                  │  │  feeds           │  │  + clean chunks   │
   └──────────────────┘  └──────────────────┘  └──────────────────┘
```

**One authoring action feeds all three.** An editor who publishes a "Black Seed" ingredient with its relationships automatically (a) renders the human page, (b) emits metadata + `MedicalWebPage`/`Drug`-family JSON-LD + sitemap entries + RSS, (c) indexes the entity in the search engine, and (d) exposes a clean, chunked, citation-anchored entity view to LLMs. No consumer is served by hand-maintained duplication.

### 0.5 Non-negotiable principles

1. **Truth and *isnād* above ranking.** Structured data never asserts a medical claim, a hadith grading, or an evidence level beyond what the editorial record supports. We never emit `AggregateRating`, `MedicalStudy` outcomes, or authenticity gradings that are fabricated to win a rich result. Schema reflects the sourced record; it never inflates it. A false rich snippet is both a manipulation and a Google policy violation — forbidden on both counts.
2. **Additive, reversible, design-safe.** Nothing here touches the design language, and every mechanism can be disabled without breaking the site.
3. **Portable, not locked-in.** The search engine, in particular, sits behind an internal abstraction so it can be replaced. A hundred-year institution does not hard-wire itself to a single vendor.
4. **Fast by default.** Every artefact respects the Phase 1/Core Web Vitals budgets. Search and structured data must never regress LCP, CLS, or INP.
5. **Accessible.** All new surfaces (search, filters, entity pages) meet WCAG 2.2 AA, because discoverability includes discoverability by assistive technology.

---

## 1. MASTER ARCHITECTURE

### 1.1 System layers

```
┌───────────────────────────────────────────────────────────────────────┐
│  LAYER 6 — DISCOVERY SURFACES                                           │
│  Metadata · JSON-LD · Sitemaps · RSS · robots.txt · llms.txt ·          │
│  Entity pages · Citation pages · Semantic landing pages                 │
├───────────────────────────────────────────────────────────────────────┤
│  LAYER 5 — SEARCH & FILTER                                              │
│  Search index (Algolia) · Faceting · Autocomplete · Analytics ·         │
│  Ranking/merchandising · No-result strategy                             │
├───────────────────────────────────────────────────────────────────────┤
│  LAYER 4 — RENDERING (Next.js App Router)                              │
│  RSC pages · generateMetadata · route handlers (sitemap/robots/feeds) · │
│  ISR + on-demand revalidation · edge middleware (redirects/normalise)   │
├───────────────────────────────────────────────────────────────────────┤
│  LAYER 3 — KNOWLEDGE GRAPH & PROJECTION                                │
│  GROQ projections · relationship resolution · derived fields ·          │
│  reading-time · slug integrity · reference graph traversal              │
├───────────────────────────────────────────────────────────────────────┤
│  LAYER 2 — SOURCES OF TRUTH                                            │
│  Sanity (entities, relationships, editorial SEO) ·                      │
│  Shopify (products/offers/inventory) · Cloudinary (media + derivations) │
├───────────────────────────────────────────────────────────────────────┤
│  LAYER 1 — SYNC & PIPELINES                                            │
│  Sanity webhooks → revalidate + reindex · Shopify webhooks →            │
│  product sync · Cloudinary transforms · scheduled full reindex          │
└───────────────────────────────────────────────────────────────────────┘
```

### 1.2 Master data flow — publish event

```
Editor publishes/updates entity in Sanity Studio
        │
        ▼
Sanity webhook fires (document type + id + operation)
        │
        ├──► Next.js revalidation endpoint
        │        └─ on-demand revalidate affected routes (entity page,
        │           any page referencing it, listing pages, sitemap)
        │
        ├──► Search indexing worker
        │        └─ project entity → search record(s) → upsert to index
        │           (incremental; relationship fields flattened for facets)
        │
        └──► Derived-surface refresh
                 └─ entity page, citation page, llms.txt manifest entry,
                    RSS item, sitemap lastmod all recomputed
```

### 1.3 Master data flow — commerce event

```
Shopify product/inventory/price change
        │
        ▼
Shopify webhook → product-sync worker
        │
        ├─ update Offer/availability fields cached for the product route
        ├─ trigger Next.js revalidate for product + collection routes
        └─ upsert product search record (price, availability facets)
```

Commerce data (price, inventory, `Offer`) is owned by Shopify and **never duplicated as truth** in Sanity; Sanity holds only the *editorial and knowledge* layer of a product (its ingredient relationships, evidence, hadith references, preparation, contraindications, related reading). The product page and its `Product`+`Offer` schema are composed by *joining* the Shopify commerce record to the Sanity knowledge record on a shared key (Shopify product handle / SKU stored on the Sanity product document).

---

## 2. REPOSITORY / FOLDER STRUCTURE

Net-new folders only; existing Phase 1–4 structure is untouched. Illustrative App Router layout:

```
/app
  /(site)                         # existing rendered site (unchanged design)
  /robots.ts                      # robots.txt route handler
  /sitemap.ts                     # sitemap index route handler
  /sitemaps
    /pages.xml/route.ts           # editorial + static
    /products.xml/route.ts        # Shopify-derived
    /courses.xml/route.ts
    /entities.xml/route.ts        # ingredients/conditions/hadith/etc.
    /images.xml/route.ts          # image sitemap
    /videos.xml/route.ts          # video sitemap
    /news.xml/route.ts            # future (guarded/empty until enabled)
  /feeds
    /rss.xml/route.ts             # site-wide editorial feed
    /[collection]/rss.xml/route.ts# per-collection feeds
  /llms.txt/route.ts              # AI discovery manifest
  /llms-full.txt/route.ts         # optional expanded manifest
  /knowledge                      # NET-NEW entity + semantic surfaces
    /[type]/[slug]/page.tsx       # entity pages (ingredient/condition/…)
    /citations/[refId]/page.tsx   # canonical citation pages
  /search/page.tsx                # search results surface (existing components)

/lib
  /seo
    metadata.ts                   # metadata builder (inheritance/overrides)
    canonical.ts                  # canonical + URL normalisation rules
    schema/                       # JSON-LD builders per type (config, not markup)
  /knowledge-graph
    projections/                  # GROQ projection definitions per entity
    relationships.ts              # relationship traversal + related-* resolvers
    reference-resolver.ts         # citation/refId resolution
  /search
    engine.ts                     # ENGINE ABSTRACTION (swap Algolia/Meili)
    index-config/                 # per-index searchable attrs, facets, ranking
    indexers/                     # entity → record mappers
  /commerce
    shopify-join.ts               # join Sanity knowledge ↔ Shopify commerce

/sanity
  /schemas
    /objects/seo.ts               # reusable SEO object (see Part 8)
    /objects/reference-block.ts   # citation/bibliography object
    /objects/relationship.ts      # typed relationship object
    /documents/…                  # entity documents (Part 3)

/scripts
  reindex-full.ts                 # scheduled full reindex
  validate-schema.ts              # structured-data validation in CI
  broken-reference-audit.ts       # knowledge-graph integrity audit
```

The **search engine abstraction** (`/lib/search/engine.ts`) is load-bearing: every call site imports the abstraction, never the vendor SDK directly, so the engine is replaceable per §16 (migration) and §0.5 (portability).

---

## 3. PART ONE — TECHNICAL SEO

### 3.1 Metadata architecture (inheritance + overrides)

Metadata is resolved through a **four-tier cascade**, each tier overriding the last, implemented in a single builder (`/lib/seo/metadata.ts`) consumed by every route's `generateMetadata`:

| Tier | Source | Governs |
|---|---|---|
| 1 · Institutional defaults | Static config | Site name, default OG image, locale, Twitter handle, title template |
| 2 · Type defaults | Per-entity-type config | Title/description patterns, default schema type, robots policy per type |
| 3 · Document values | Sanity/Shopify fields | Computed title/description from entity data |
| 4 · Editorial overrides | Sanity `seo` object | Hand-authored SEO title, description, canonical, social image, robots, schema overrides |

Resolution order: Tier 4 wins where present, else Tier 3, else Tier 2, else Tier 1. **No page ever ships without a resolved title, description, canonical, and OG image** — a fallback at Tier 1/2 always exists. The builder returns Next.js `Metadata` (title, description, alternates.canonical, openGraph, twitter, robots, other) for `generateMetadata`; no metadata is hand-written in page files.

### 3.2 Dynamic metadata

Every dynamic route (`/products/[handle]`, `/knowledge/[type]/[slug]`, `/courses/[slug]`, `/articles/[slug]`) computes metadata at request/build time from the entity, then applies editorial overrides. Title patterns are defined per type (e.g. ingredient: *"{name} — Benefits, Evidence & Prophetic Tradition | Sunnah Remedies"*), description patterns draw from a dedicated `metaDescription` field (never auto-truncated body text if an authored one exists). Titles target ≤ 60 chars visible, descriptions ≤ 155 chars, both truncated gracefully with authored priority.

### 3.3 Canonical URLs & URL normalisation

A single canonical policy (`/lib/seo/canonical.ts`) governs the whole estate:

- Canonical host: `https://www.sunnahremedies.com` (choose www or apex once; enforce forever via 301).
- Lowercase paths; trailing slash policy fixed (recommend **no trailing slash**) and enforced by edge middleware with 301.
- Strip/ignore tracking params (`utm_*`, `gclid`, `fbclid`) from canonical; never allow parameterised URLs to be the canonical.
- Faceted/filter URLs (Part 6) declare canonical to the **unfiltered parent** unless the facet combination is an intentionally indexable landing page (a curated allow-list).
- Paginated pages self-canonicalise (page 2 canonicals to page 2), never to page 1 (per current Google guidance).
- Every page emits exactly one self-referential canonical unless deliberately consolidating duplicates.

Edge middleware performs normalisation (case, trailing slash, param stripping, host) with 301s **before** the request reaches the renderer, so crawlers never see duplicates.

### 3.4 Open Graph & Twitter Cards

OG emitted on every page from the metadata builder: `og:title`, `og:description`, `og:type` (website/article/product), `og:url` (canonical), `og:site_name`, `og:locale`, and `og:image` (Cloudinary-derived at 1200×630, with `og:image:alt`). Articles add `article:published_time`, `article:modified_time`, `article:author`, `article:section`, `article:tag`. Products add `og:type=product` with `product:price:amount`/`currency` from Shopify. Twitter: `summary_large_image` card with title, description, image, and site handle. **Social images are generated as a Cloudinary named transformation** so every entity has a correct, on-brand 1200×630 card without manual design work and without touching layout.

### 3.5 Robots.txt

Served by `app/robots.ts`. Policy: allow all reputable crawlers to all indexable content; disallow `/api`, `/search` query permutations (allow the base `/search` shell but not indexable of query strings), Studio/admin, cart/checkout, and account routes; declare the sitemap index URL. AI crawlers are handled *permissively and deliberately* here and in `llms.txt` (Part 7) — Sunnah Remedies **wants** to be cited by LLMs, so it does not block GPTBot, ClaudeBot/Claude-User, Google-Extended, PerplexityBot, etc., except where a legal/licensing reason later requires it (documented, not default).

### 3.6 Sitemaps

A **sitemap index** (`app/sitemap.ts`) references child sitemaps, each generated from live data with accurate `lastmod`, split at 50,000 URLs / 50 MB:

- **pages.xml** — static + editorial articles.
- **products.xml** — from Shopify (only active, in-stock-or-backorder, public products).
- **courses.xml** — course + `CourseInstance` landing pages.
- **entities.xml** — knowledge entities (ingredients, conditions, body systems, hadith, Qur'anic reference pages, scholars, research pages).
- **images.xml** — image sitemap: every content image with `image:loc` (Cloudinary URL), `image:title`, `image:caption` drawn from Sanity alt/caption fields.
- **videos.xml** — video sitemap: `video:thumbnail_loc`, `video:title`, `video:description`, `video:content_loc`/`player_loc`, `video:duration`, `video:publication_date` from the video entity.
- **news.xml** — **future**, guarded: route exists but returns empty until a `newsArticle` type and a Google News relationship are enabled; must only ever contain articles < 48h old when active.

`lastmod` is truthful (driven by document `_updatedAt`); never faked to force recrawl.

### 3.7 RSS feeds

`app/feeds/rss.xml` (site-wide, most-recent editorial) plus per-collection feeds. Full-fidelity items: title, canonical link, GUID (stable entity id), author, category, `pubDate`, and a clean summary. Feeds double as a lightweight machine-readable surface for aggregators and some AI ingestion.

### 3.8 Pagination

Listing/archive pages use crawlable, indexable, path-based pagination (`/articles/page/2`), each page self-canonical, with `rel="next"`/`rel="prev"` as hints (deprecated as a strong signal but still emitted for other engines), and a visible, crawlable numbered pager built from existing components. Infinite scroll, where used visually, is **backed by real paginated URLs** so all items are reachable without JS.

### 3.9 Redirects, 404 & 410

- **Redirect management**: a Sanity-editable redirect map (`from`, `to`, `type` 301/302) applied in edge middleware, so editors manage redirects without deploys. All legacy/renamed slugs auto-create a 301 on slug change (slug history tracked per document).
- **404**: a designed, helpful not-found (existing components) offering search, popular entities, and a route to a human — never a dead end (mirrors the Experience Manual's empty-state ethic). Returns proper `404` status.
- **410**: intentionally removed content returns `410 Gone` (via middleware allow-list) so engines de-index permanently rather than recrawling forever. Distinguished from 404 by editorial intent flag on the document (`retired: true`).

### 3.10 Duplicate-content prevention

Canonical policy (§3.3) + parameter stripping + faceted-URL canonicalisation + single-host + slug uniqueness constraints in Sanity + pagination self-canonical. Cross-entity duplication (e.g. an ingredient described on both its entity page and a product page) is resolved by **canonicalising the descriptive content to the entity page** and having product pages *reference/summarise-and-link* rather than duplicate.

### 3.11 Language support & future hreflang

Current build is English-first. The architecture is **hreflang-ready now** even though multilingual is future: URL structure reserves a locale segment pattern (`/{locale}/…`, default locale un-prefixed), every entity carries a stable language-independent `entityId` so translations can link as `alternates`, and the metadata builder is already structured to emit `alternates.languages` when translations exist. When Arabic (and others) launch, hreflang (`x-default` + per-locale) is emitted from the translation graph with zero re-architecture. Arabic content is planned RTL-aware and Amiri-set per Phase 1, but that is future scope; only the *scaffolding* ships now.

### 3.12 Indexation strategy

Explicit per-type indexation policy (Tier 2 metadata): index all knowledge entities, articles, products, courses, faculty; `noindex` thin/utility pages (internal search results, cart, account, filtered permutations outside the allow-list, tag pages below a content threshold). A **crawl-budget discipline**: keep the indexable set high-quality and the sitemaps accurate so engines spend budget on canonical, valuable URLs. Google Search Console + Bing Webmaster Tools verified; sitemaps submitted; index coverage monitored (Part 9).

### 3.13 Core Web Vitals, prefetching, lazy loading

- **LCP**: entity/article hero media served from Cloudinary with correct responsive `srcset`, `priority` on the LCP image, AVIF/WebP negotiation, and no layout shift (explicit dimensions). Respect existing Phase 3 Cloudinary derivations.
- **CLS**: all media and embeds reserve space; fonts loaded with `font-display: swap` and preloaded per Phase 1; no injected content above the fold.
- **INP**: search/filter interactions debounced, off-main-thread where possible, results virtualised for long lists; hydrate interactive islands lazily (§12).
- **Prefetching**: App Router `<Link>` prefetch on in-viewport internal links (related-entity links especially), so deep knowledge navigation feels instant.
- **Lazy loading**: below-the-fold images/videos `loading="lazy"`; non-critical interactive components (search modal, filter panels) code-split and hydrated on interaction.

### 3.14 Metadata inheritance & overrides, per content source

| Content source | Base metadata from | Override surface |
|---|---|---|
| Editorial article (Sanity) | article fields + type defaults | Sanity `seo` object |
| Product (Shopify + Sanity) | Shopify title/price + Sanity knowledge | Sanity `seo` on the linked product doc |
| Course (Sanity) | course fields | Sanity `seo` object |
| Video (Sanity/Cloudinary) | video entity fields | Sanity `seo` object |
| Image | alt/caption fields | inline in asset metadata |
| Institution/about | static + org config | config-level |
| Author/faculty | person entity | Sanity `seo` on person doc |
| Research page | research entity | Sanity `seo` object |

Every source resolves through the same four-tier cascade; overrides always live in Sanity so editors control final output without a deploy.

---

## 4. PART TWO — SCHEMA.ORG / STRUCTURED DATA ARCHITECTURE

### 4.1 Architecture: composable JSON-LD from a shared builder

Structured data is produced by a set of **typed builder functions** (`/lib/seo/schema/`), one per schema type, each taking a resolved entity and returning a JSON-LD object. Pages compose builders into a single `@graph` (one `<script type="application/ld+json">` per page containing a connected graph), so entities on a page reference each other by `@id`. **No JSON-LD is hand-written in templates.** Every emitted node carries a stable `@id` equal to the entity's canonical URL + fragment, so the same entity referenced across pages is *one identity in the graph* — the structured-data mirror of the knowledge graph (Part 3).

### 4.2 Global singletons (emitted site-wide via root layout)

- **Organization / MedicalOrganization** — the institution: `name`, `url`, `logo`, `sameAs` (social/authoritative profiles), `medicalSpecialty`, `foundingDate`, address(es) for the campuses, `contactPoint`. Emitted once with a fixed `@id` (`{site}/#organization`) that all other nodes reference as `publisher`/`provider`.
- **EducationalOrganization** — asserted as an additional type on the org (`@type: ["MedicalOrganization","EducationalOrganization"]`) so the Academy is discoverable as an educational body.
- **LocalBusiness** — per physical campus (London/Copenhagen/Riyadh) with geo, hours, address, referencing the org.
- **WebSite** + **SearchAction** — the site node with `potentialAction` `SearchAction` pointing at the internal search endpoint (enables sitelinks search box). `@id` `{site}/#website`.

### 4.3 Per-type mapping (source field → schema property)

Each builder maps entity fields to properties. Representative mappings (not exhaustive; full table in Appendix A):

| Schema type | Emitted on | Key properties → source |
|---|---|---|
| **Product** + **Offer** | product pages | name, description, image, brand→org; `Offer.price/priceCurrency/availability/url` → **Shopify**; `Offer.priceValidUntil`; `sku`/`gtin` where present |
| **AggregateRating** / **Review** | product/course | **only** from genuine, verified reviews; omitted entirely if none — never invented |
| **Course** + **CourseInstance** | course pages | name, description, provider→org; `hasCourseInstance` with `courseMode`, `startDate`, `location`, `courseWorkload`; offers/price if paid |
| **Article** | editorial articles | headline, image, author→Person, publisher→org, datePublished/Modified, `articleSection`, `wordCount` |
| **MedicalWebPage** | condition/ingredient/clinical entities | `about`→MedicalEntity, `medicalAudience`, `lastReviewed`, `reviewedBy`→Person/Physician; **with medical disclaimers surfaced** |
| **MedicalCondition** | condition entities | name, `signOrSymptom`, `possibleTreatment`→ingredient/product entities, `associatedAnatomy`→body system |
| **MedicalEntity / Substance** | ingredient entities | name, `activeIngredient`, related conditions; contraindications expressed in body + `MedicalContraindication` where modelled |
| **MedicalStudy** | research entities | `studySubject`, `studyLocation`, `sponsor`, `citation`; evidence level in text |
| **Person** / **Author** / **Physician** (future) | faculty/author pages | name, `jobTitle`, `affiliation`→org, `alumniOf`, `knowsAbout`, `sameAs` |
| **Event** | events/journeys | name, `startDate`, `location`, `organizer`→org, `eventAttendanceMode` |
| **FAQPage** | pages with genuine Q&A | `mainEntity` question/answer pairs (authored, not scraped) |
| **HowTo** | preparation guides | `step`, `supply`, `tool`, `totalTime` |
| **BreadcrumbList** | all deep pages | positional trail from URL taxonomy |
| **CollectionPage** | listing/collection pages | `mainEntity`/`hasPart` → member entities |
| **VideoObject** | video entities | name, description, thumbnailUrl (Cloudinary), uploadDate, duration (ISO 8601), contentUrl, transcript |
| **ImageObject** | key images | contentUrl, caption, creator, license |
| **Book** | library/published works | name, author, isbn, `about`, publisher |
| **Dataset** | research datasets (future) | name, description, `distribution`, license |
| **CreativeWork / Citation** | citation pages (Part 7) | `@id` = refId anchor, `author`, `datePublished`, `isPartOf`, `identifier` (DOI/ISBN/hadith ref) |
| **Speakable** | eligible articles/FAQ | `speakable` cssSelector/xpath over the concise answer block |

### 4.4 The medical-integrity guardrails

Because this is medical content, structured data is held to policy and to the Integrity Ledger:

- `MedicalWebPage` entities carry `lastReviewed` and `reviewedBy` (a real, named reviewer) — populated from the editorial reviewer field (Part 8). If unreviewed, the medical schema is downgraded (no clinical claims asserted).
- No treatment claim is emitted as `possibleTreatment`/`drug` beyond what the sourced editorial record supports; traditional-usage vs modern-evidence distinction (Part 6 facet) is preserved in the schema's descriptive fields.
- Hadith authenticity gradings and Qur'anic references appear as `citation`/`CreativeWork` with accurate identifiers; **never asserted as medical efficacy claims**.
- `AggregateRating` emitted only from verified reviews and only where genuinely present.

### 4.5 Inheritance, reusable components, validation, extensibility

- **Inheritance**: builders share sub-builders (`orgRef`, `personRef`, `imageObject`, `breadcrumb`, `citation`) so common nodes are defined once. Every builder receives the global `orgRef`/`websiteRef` by `@id`.
- **Reusable components**: the citation/reference builder is shared by Article, MedicalWebPage, MedicalStudy, and the standalone citation pages, guaranteeing one citation format across the estate.
- **Validation**: a CI step (`scripts/validate-schema.ts`) renders each template type and validates emitted JSON-LD against schema.org + Google Rich Results requirements; build fails on invalid required properties. Manual spot-checks via Rich Results Test and Schema Markup Validator pre-launch.
- **Future extensibility**: new schema types are added as new builders + a mapping table row; the `@graph` composition model absorbs them without template changes. `NewsArticle`, `Physician`, and `Dataset` are scaffolded now (builders stubbed, guarded) and switched on when their content types launch.

---

## 5. PART THREE — INTERNAL KNOWLEDGE GRAPH

### 5.1 The model: typed entities + typed relationships

The knowledge graph is modelled natively in Sanity. Every concept is a **document type (entity)**; every connection is a **typed reference** (or an array of typed relationship objects) declared on the entity. Sanity's reference system *is* the graph store; GROQ traversal *is* the query engine. No separate graph database is required at this scale, and this keeps the graph editable by editors and versioned with content.

### 5.2 Entity types (Sanity documents)

`ingredient`, `condition`, `bodySystem`, `product` (knowledge layer, joined to Shopify), `researchPaper`, `hadith`, `quranReference`, `scholar`, `facultyMember`, `journey` (Sacred Journeys), `consultationService`, `course`, `article`, `video`, `faq`, `reference` (citation/bibliography item), `event`, `collection`.

### 5.3 Relationship object (reusable)

A single reusable `relationship` object type expresses a directed, typed edge with optional qualifiers:

| Field | Purpose |
|---|---|
| `target` | reference to any entity (weak/typed) |
| `relationType` | enum: `treats`, `treatedBy`, `containsIngredient`, `evidencedBy`, `citedIn`, `contraindicatedIn`, `partOfBodySystem`, `taughtIn`, `relatedTo`, `preparedBy`, `authoredBy`, `reviewedBy`, `referencedIn`, etc. |
| `strength` | optional weighting for ranking related-* modules and search boosts |
| `note` | editorial note on the relationship |
| `evidenceLevel` | where the edge is a clinical claim, the evidence tier |

Relationships are declared **once, on the natural owner**, and **resolved bidirectionally** at projection time (a reverse-reference GROQ query surfaces "what references this entity"), so editors never maintain both directions by hand. Integrity is enforced by `broken-reference-audit.ts` (Part 15) which fails CI on dangling references.

### 5.4 The canonical entity relationship diagram (the "Black Seed" pattern, generalised)

```
                         ┌───────────────┐
                         │   INGREDIENT  │  (e.g. Black Seed)
                         └──────┬────────┘
        containsIngredient ┌────┴─────┬──────────┬───────────┬────────────┐
                           ▼          ▼          ▼           ▼            ▼
                      ┌─────────┐ ┌────────┐ ┌─────────┐ ┌────────┐ ┌──────────┐
                      │ PRODUCT │ │CONDITION│ │RESEARCH│ │ HADITH │ │  QURAN   │
                      └────┬────┘ └───┬────┘ │ PAPER  │ └───┬────┘ │REFERENCE │
                           │          │      └───┬────┘     │      └────┬─────┘
              Offer/Shopify│   treats │  evidence│  citation│  citation │
                           ▼          ▼          ▼          ▼           ▼
                      ┌─────────────────────────────────────────────────────┐
                      │              REFERENCE / BIBLIOGRAPHY                │
                      │        (citation pages, refIds, DOIs, isnād)        │
                      └─────────────────────────────────────────────────────┘
        also linked from INGREDIENT:
          → preparation (HowTo)   → contraindications (facets/MedicalContraindication)
          → videos (VideoObject)  → faqs (FAQPage)   → courses (taughtIn)
          → consultations (relatedService)  → bodySystem (partOfBodySystem)
          → relatedRemedies (relatedTo)
```

Every entity type declares the relationships natural to it, so the *same connective richness* exists for ingredients, conditions, body systems, courses, products, research papers, hadith, Qur'anic references, scholars, faculty, journeys, and consultations. The graph is **complete when every entity can answer: what am I, what do I treat/contain/evidence, who authored/reviewed me, where am I cited, what should I be read alongside, and what are my contraindications.**

### 5.5 Derived/projected fields

At projection time (`/lib/knowledge-graph/projections/`), each entity resolves: its outbound relationships, its inbound references (reverse graph), a computed `relatedEntities` set (ranked by `relationType` + `strength`), reading time (articles), a flattened `facetBundle` (Part 6), and a `citationBundle` (Part 7). These projections feed rendering, schema, search indexing, and AI surfaces from one query shape per type.

### 5.6 Governance of the graph

Relationship vocabulary (`relationType` enum) is centrally owned and versioned; adding a type is a schema change reviewed by the knowledge architect. This prevents relationship sprawl and keeps the graph queryable and the internal-linking modules coherent.

---

## 6. PART FOUR — INTERNAL LINKING

### 6.1 Principle: links are projections of the graph, not hand-placed

Internal linking is **generated from the knowledge graph**, so topical authority is a structural property, not an editorial chore. Each entity page renders "related-*" modules built from resolved relationships, using existing Phase 1 components only.

### 6.2 The related-* modules (per entity, where applicable)

| Module | Source relationship | Appears on |
|---|---|---|
| Related Articles | `relatedTo`/`referencedIn` (article) | all entities |
| Related Products | `containsIngredient`/`treatedBy` | ingredient, condition |
| Related Courses | `taughtIn` | ingredient, condition, product |
| Related Conditions | `treats`/`treatedBy` | ingredient, product, bodySystem |
| Related Ingredients | `containsIngredient`/`relatedTo` | product, condition |
| Related Hadith | `citation` (hadith) | ingredient, condition, article |
| Related Qur'anic Verses | `citation` (quranReference) | ingredient, condition, article |
| Related Research | `evidencedBy` | ingredient, condition, product |
| Related Videos | `relatedTo` (video) | all entities |
| Related FAQs | `relatedTo` (faq) | all entities |

Modules are **capped and ranked** (by `strength` then recency) to avoid link dilution; each module links with descriptive, human anchor text (the entity's name/short label), never "click here". Reciprocal linking is automatic via reverse-reference resolution.

### 6.3 Contextual in-body linking

Beyond modules, editors receive **internal-linking suggestions** in Sanity (Part 8): when an entity name appears in body text, the Studio surfaces the matching entity for optional linking. Auto-linking is *suggested, never forced*, to preserve editorial control and avoid over-optimisation. A first mention of a key entity in body copy links to that entity's page.

### 6.4 Authority flow & orphan prevention

Hub pages (body-system pages, collection pages, pillar entity pages) act as topical hubs linking down to specific entities and up to the institution. `broken-reference-audit.ts` also reports **orphans** (entities with no inbound links) so nothing is stranded outside the graph — the internal-linking equivalent of the Experience Manual's "no guest left alone."

---

## 7. PART FIVE — SEARCH ENGINE

### 7.1 Recommendation: Algolia as primary, behind a swappable abstraction

**Recommendation: Algolia** for launch, with the engine isolated behind `/lib/search/engine.ts` so Meilisearch (or a future vector engine) can replace it without touching call sites.

**Why Algolia for Sunnah Remedies now:**

- **Feature-complete out of the box for exactly this brief**: typo tolerance, synonyms, faceting, ranking rules, **merchandising/pinned results**, **built-in Search Analytics** (Part 9), and A/B testing — all first-party, no assembly. The brief's Part 5/6/9 requirements map almost one-to-one onto Algolia native features.
- **Relevance and multilingual/transliteration maturity**: robust handling of accents, transliteration, and mixed-script (Arabic ↔ transliterated Latin) queries, plus `queryLanguages`/plurals — important for "black seed / habbat al-barakah / حبة البركة".
- **DX and velocity**: mature InstantSearch/autocomplete libraries let the search UI be assembled from existing Phase 1 components quickly, and instant/edge-served results meet the performance bar.
- **Managed operations**: no search infra to run; scales without ops burden for a small team.

**Honest trade-offs (why one might choose Meilisearch instead):**

- **Cost at scale**: Algolia pricing scales with search operations and records; a very high-traffic future could make **Meilisearch** (open-source, self-hostable, flat-cost) materially cheaper.
- **Data sovereignty / permanence**: a hundred-year institution may prefer an **open-source, self-hostable** engine it fully controls over a proprietary SaaS. Meilisearch (or OpenSearch) satisfies that value directly.
- **Analytics/merchandising gap**: Meilisearch's built-in analytics and merchandising are less mature, so Part 9 and pinned-results would need more custom work.

**Decision**: launch on **Algolia** to hit the full feature brief fast and well; keep the abstraction so that if cost or sovereignty later dominates, migrating to **Meilisearch** is a config-and-indexer change, not a rebuild. This directly serves §0.5 (portability) and §16 (migration).

### 7.2 Index design

A **primary unified index** (`content`) holds all searchable entity types with a `type` attribute for filtering/facet-scoping, plus **replica indices** for alternate sort orders (relevance, date, popularity). Rationale: a unified index powers a single instant-search box across products, courses, conditions, ingredients, herbs, articles, research, hadith, Qur'an, FAQs, videos, faculty, events, and consultations, while `type` faceting scopes results per surface.

Each record (mapped by `/lib/search/indexers/`) carries: `objectID` (entity id), `type`, `title`, `subtitle`, `body`/`excerpt` (searchable text, chunked for long docs), `slug`/`url`, `image` (Cloudinary), and a **flattened facet bundle** (Part 6): condition, ingredient, bodySystem, evidenceLevel, hadithAuthenticity, preparation, difficulty, audience flags (pregnancy/children), usageType (traditional/modern), availability, category, collection, courseLevel, author, scholar, publicationDate, plus transliteration/synonym aliases.

### 7.3 Searchable attributes & ranking

- **Searchable attributes** (ordered by importance): `title` > `subtitle`/aliases (incl. transliteration) > `keywords` > `body`/`excerpt`. Arabic name, transliteration, and English variants all indexed as searchable so any spelling finds the entity.
- **Custom ranking**: after textual relevance, tie-break by `popularity` (from analytics), `editorialWeight` (pillar/priority flag), and recency — so authoritative pillar entities surface first.
- **Ranking rules**: default typo/geo/words/filters/proximity/attribute/exact chain, tuned so exact entity-name matches win.

### 7.4 Required search features (mapping to the brief)

| Requirement | Implementation |
|---|---|
| Autocomplete | Autocomplete library over the `content` index + a `querySuggestions` index built from analytics |
| Instant results | InstantSearch, results as-you-type, edge-served |
| Typo tolerance | Native, tuned per attribute (stricter on short queries) |
| Synonyms | Synonym sets (e.g. "black seed"↔"nigella sativa"↔"habbat al-barakah"↔"kalonji"); one-way synonyms for brand/traditional terms |
| Arabic transliteration | Transliteration aliases indexed per entity; `queryLanguages` incl. Arabic; accent/diacritic-insensitive |
| English spelling variants | Synonyms + typo tolerance (e.g. "cupping"/"hijama"/"hijamah") |
| Faceted search | Attributes-for-faceting = the Part 6 facet bundle |
| Search analytics | Algolia Analytics + custom events (Part 9) |
| Ranking rules / weighted results | Custom ranking + `editorialWeight` |
| Pinned results | Algolia Rules (query→pinned objectIDs) for curated/institutional answers |
| Popular searches | `querySuggestions` index + popular list from analytics |
| No-results suggestions | On zero results: relax typo, drop least-important facet, and surface nearest entities + a route to ask a human (Experience-Manual empty-state ethic) |
| Future multilingual | Per-locale replica indices keyed by the `entityId` translation graph (Part 3.11) |

### 7.5 Indexing pipeline

Incremental upserts on Sanity/Shopify webhooks (Layer 1); nightly full reconcile (`reindex-full.ts`); index settings themselves are **version-controlled** in `/lib/search/index-config/` and applied via CI (settings-as-config), never hand-edited in the dashboard, so relevance config is reproducible and portable.

---

## 8. PART SIX — KNOWLEDGE FILTERS (FACETING)

### 8.1 Faceting model

Facets are the **flattened, indexed projection of graph relationships and entity attributes** (§7.2). Every knowledge type supports filtering on the facets relevant to it; irrelevant facets are simply absent for that type. Facet values are controlled vocabularies in Sanity (not free text), so they stay consistent, translatable, and machine-clean.

### 8.2 Facet catalogue

| Facet | Type | Applies to | Source |
|---|---|---|---|
| Condition | multi | ingredient, product, article, research | relationship |
| Ingredient / Herb | multi | product, condition, article | relationship |
| Body system | single/multi | ingredient, condition, course | relationship |
| Evidence level | single | ingredient, research, product | editorial enum |
| Research quality | single | research | editorial enum (e.g. RCT/review/observational) |
| Hadith authenticity | single | hadith | editorial enum (ṣaḥīḥ/ḥasan/ḍaʿīf …) |
| Qur'anic topic | multi | quranReference | controlled vocab |
| Preparation | multi | ingredient, product | controlled vocab |
| Difficulty | single | course, howto | enum |
| Age / audience | multi | ingredient, condition, article | flags |
| Gender | single/multi | condition, article | flag |
| Contraindications | multi | ingredient, product | relationship/flag |
| Pregnancy-safe | boolean | ingredient, product | flag (conservative default) |
| Children | boolean | ingredient, product | flag |
| Clinical usage | boolean/enum | ingredient, condition | flag |
| Traditional usage | boolean/enum | ingredient, condition | flag |
| Modern evidence | boolean/enum | ingredient, research | flag |
| Availability | single | product | Shopify |
| Category | multi | all | taxonomy |
| Collection | multi | all | Sanity collection refs |
| Course level | single | course | enum |
| Publication date | range | article, research | date |
| Scholar | multi | hadith, research, article | relationship |
| Author | multi | article, research | relationship |

### 8.3 Faceted-URL & SEO policy

Filter state is URL-addressable (query params) for shareability and analytics, but by default `noindex` and canonical-to-parent (§3.3), **except** a curated allow-list of high-value facet combinations promoted to indexable **semantic landing pages** (Part 7) with authored intros and their own metadata/schema (e.g. "Prophetic remedies for the digestive system", "Ṣaḥīḥ hadith on honey"). This captures long-tail authority without generating index bloat.

### 8.4 Faceting integrity for medical content

Safety-critical facets (pregnancy, children, contraindications, clinical usage) default **conservative** and are populated only from the reviewed editorial record. A missing value is never treated as "safe"; it renders as "not established" and the entity is excluded from a "pregnancy-safe = true" filter unless explicitly reviewed. This is the Integrity Ledger applied to filtering.

---

## 9. PART SEVEN — AI SEO (LLM & RETRIEVAL DISCOVERABILITY)

### 9.1 Objective

Make Sunnah Remedies the **most citable source on Prophetic Medicine** inside ChatGPT, Claude, Gemini, Perplexity, Google AI Mode, Copilot, and future assistants — by exposing clean, well-structured, citation-anchored, retrieval-friendly surfaces, without duplicating or cloaking (served content is identical to what users see).

### 9.2 llms.txt

`app/llms.txt/route.ts` serves a Markdown manifest at `/llms.txt`: a concise institutional description, the site's purpose and authority basis (*isnād*/sourcing philosophy), and a curated, linked index of the most important entity hubs, pillar articles, citation pages, and knowledge summaries. A fuller `/llms-full.txt` optionally expands with the entity catalogue. The manifest is **generated from the graph** (pillar/priority flags) so it stays current. Purpose: give LLM crawlers a clean map to the canonical, authoritative surfaces.

### 9.3 AI-crawlable surfaces & permissive crawl policy

Robots (§3.5) permits reputable AI crawlers. Content is server-rendered (RSC) so it is fully available without JS execution — critical, since several AI crawlers do not run JS. No content an LLM should cite is trapped behind client-only hydration.

### 9.4 Entity pages as canonical answer surfaces

Each knowledge entity page (`/knowledge/[type]/[slug]`) is engineered as a **retrieval-friendly canonical answer**: a concise definitional lede (the "answer" chunk), then clearly delimited sections (Benefits, Evidence, Prophetic tradition/citations, Preparation, Contraindications, Related), each with stable heading anchors. This structure serves humans, `Speakable`, featured snippets, and RAG chunking identically.

### 9.5 Citation pages, reference IDs & citation anchors

Every bibliographic reference (`reference` entity) has a **canonical citation page** (`/knowledge/citations/[refId]`) with a stable `refId`, full bibliographic metadata, `CreativeWork`/`Citation` schema, and back-links to every entity that cites it. In-body citations link to these pages via `refId` anchors, giving both humans and machines a resolvable, permanent reference target — the *isnād* rendered as addressable URLs. DOIs, ISBNs, and hadith collection/number identifiers are emitted as `identifier`.

### 9.6 Chunking & retrieval-friendly structure

Content is authored and rendered so that **each section is a self-contained, ~200–400 word chunk** with its own heading and, where relevant, a leading one-sentence answer. This is the single most important AI-SEO discipline: clean semantic HTML (`<article>`, `<section>`, `<h2>`/`<h3>`, `<dl>` for facts), no critical content in images, tables for structured facts, and a machine-readable fact block per entity (see §9.8). Long documents expose an on-page table of contents with anchor links that double as chunk boundaries.

### 9.7 Question-and-answer architecture

Every entity and pillar article carries an authored Q&A block (feeding `FAQPage` schema and `querySuggestions`). Questions mirror real user/assistant phrasings ("Is black seed safe in pregnancy?", "What does the hadith say about honey?") with concise, sourced answers — the units LLMs extract and cite.

### 9.8 Machine-readable references & structured bibliographies

Each entity exposes a compact **machine-readable fact block** (rendered as `<dl>`/microdata + mirrored in JSON-LD): canonical name, aliases/transliteration, one-line definition, key evidence level, primary citations (refIds), and contraindication summary. Structured bibliographies (per entity and site-wide) are generated from `reference` entities. Together these give AI systems clean, unambiguous, attributable facts.

### 9.9 Future: vector search, RAG & AI APIs

Scaffolding now, activation later: the chunk boundaries, stable anchors, `refId` system, and clean projections are exactly what a future **vector index** and **RAG endpoint** need — a future `/api/knowledge` (documented, not built now) could serve chunk-level JSON with embeddings and citations. Because chunks and citations are already first-class, standing up vector search later is additive, not a re-architecture. No AI API ships in this phase; the content is simply made ready for it.

### 9.10 Anti-manipulation guardrail

No cloaking, no LLM-only hidden text, no fabricated authority. What machines read is what humans read. AI discoverability is earned through genuine structure and sourcing — consistent with both platform policies and the Integrity Ledger.

---

## 10. PART EIGHT — EDITORIAL SEO (SANITY STUDIO)

### 10.1 The reusable `seo` object (attached to every indexable document)

| Field | Type | Notes |
|---|---|---|
| `seoTitle` | string | overrides computed title; live length guidance |
| `seoDescription` | text | overrides computed description; length guidance |
| `canonicalUrl` | url | rare manual override |
| `socialImage` | image (Cloudinary) | overrides default OG card |
| `robots` | enum | index/noindex, follow/nofollow |
| `schemaOverrides` | object | per-page schema field overrides/additions |
| `keywords` | array | topical hints (internal use, not meta keywords) |
| `focusEntities` | references | primary entities this doc is "about" (drives schema `about`) |

### 10.2 Knowledge & authority fields (on entity/article documents)

| Field | Purpose |
|---|---|
| `relationships` | typed edges (Part 3) — the graph author surface |
| `author` | reference → person/faculty |
| `reviewer` | reference → physician/scholar (drives `reviewedBy`/`lastReviewed`) |
| `reviewDate` | date of clinical/scholarly review |
| `readingTime` | auto-computed, editable |
| `featuredSnippetAnswer` | concise answer block (feeds Speakable/FAQ/lede) |
| `faqs` | authored Q&A (feeds FAQPage) |
| `citations` | references → `reference` entities (feeds bibliography + refIds) |
| `bibliography` | ordered citation list |
| `evidenceLevel` / `usageType` | editorial enums (feed facets + medical schema) |
| `internalLinkSuggestions` | Studio-surfaced suggestions (Part 6.3), one-click to link |

### 10.3 Studio experience

Editors get: live Google/OG/Twitter previews; length and readability guidance; a **structured-data preview** showing the JSON-LD that will emit; relationship authoring with reverse-reference visibility ("this entity is referenced by…"); internal-linking suggestions as they write; and validation warnings (missing reviewer on medical content, missing citations on a claim, orphaned entity). Publishing is **blocked** for medical entities lacking a reviewer or required disclaimers — editorial governance enforced in the tool, not by hope.

### 10.4 Roles & workflow

Author → Reviewer (clinical/scholarly) → Editor (SEO/publish). Reviewer sign-off is a required transition for `MedicalWebPage` content; the reviewer identity flows into schema and the visible byline, satisfying E-E-A-T and the *isnād* standard simultaneously.

---

## 11. PART NINE — ANALYTICS

### 11.1 Search analytics (from Algolia + custom events)

Tracked and surfaced on an internal dashboard: most-searched topics, products, and diseases; **failed/zero-result searches**; trending searches (velocity); search refinement paths; click-through rate per query; result-position clicks; and no-result → exit vs → recovery. Zero-result and refinement data feed directly back to editors as **editorial opportunities** ("people search X, we have nothing").

### 11.2 Content analytics

Popular articles, popular remedies, entity page engagement, related-module click-through (does the knowledge graph actually route people deeper?), and citation-page referrals. Distinguish human vs known-bot/AI-crawler traffic where possible to understand AI-surface pickup.

### 11.3 SEO/index analytics

Google Search Console + Bing Webmaster: index coverage, impressions/clicks per query and page, rich-result status and errors, Core Web Vitals field data, and crawl stats. Rich-result validity monitored continuously (regressions alert).

### 11.4 Editorial-opportunity loop

A scheduled report converts zero-result searches, high-impression/low-CTR queries, and orphaned-but-searched entities into a prioritised editorial backlog — closing the loop from discovery data to content creation. This is how the knowledge base *grows toward demand* without guessing.

### 11.5 Privacy

Analytics respect the institution's privacy posture (Experience Manual / Trust Framework): no PII in search logs, consent-aware measurement, IP anonymisation, and no cross-site profiling. Discoverability is pursued without surveilling the seeker.

---

## 12. PART TEN — PERFORMANCE

### 12.1 Caching & edge delivery

- Pages served via **ISR** with on-demand revalidation on publish (Layer 1), so pages are static-fast but never stale.
- Search served from Algolia's edge/DSN; search UI results cached client-side per session for instant refinement.
- Structured data and metadata computed at build/revalidate, not per request.
- Cloudinary CDN for all media with format/quality auto-negotiation (Phase 3).
- Sitemaps/feeds/`llms.txt` cached with sensible TTLs and revalidated on content change.

### 12.2 Indexing performance

Incremental/background indexing on webhooks (never blocking a request); nightly full reconcile off-peak; index settings applied via CI. Indexing failures retry with backoff and alert; a failed index update never breaks the site (search degrades gracefully to a cached/previous state).

### 12.3 Front-end performance (respecting Phase 1 budgets)

Lazy hydration of interactive islands (search modal, filters) — hydrate on interaction, not on load; virtualised long result/facet lists; debounced query input; prefetch in-viewport internal links; no CLS from injected schema/OG (all in `<head>`/non-visual); LCP image prioritised and Cloudinary-optimised. Structured data and SEO additions must show **zero regression** against the existing CWV budget — verified in CI (§14).

### 12.4 Accessibility (performance's twin)

All new surfaces meet **WCAG 2.2 AA**: search and filters fully keyboard-operable, ARIA live-regions for instant results, visible focus, labelled facets, reduced-motion respected, sufficient contrast (using existing tokens). Entity pages use correct heading hierarchy (also serving chunking/§9.6). Accessibility is treated as a discoverability requirement, not an afterthought.

---

## 13. INTEGRATION SPECIFICATIONS

### 13.1 Sanity

Source of truth for entities, relationships, editorial SEO, and citations. Provides: schema additions (`seo`, `relationship`, `reference` objects + entity docs); GROQ projections per type; webhooks → revalidate + reindex; slug-history tracking for auto-301s; publish-time validation gates. Sanity is the graph store and the editorial control plane.

### 13.2 Shopify

Owns commerce truth (price, inventory, `Offer`, checkout via Stripe). Integration: Storefront API read for product/offer/availability; webhooks → product-sync + revalidate + reindex; join key (handle/SKU) on the Sanity product doc binds the knowledge layer to the commerce layer. **Commerce data is never mirrored as truth in Sanity**; the product page and its `Product`+`Offer` schema are composed at render by joining the two sources.

### 13.3 Cloudinary

Owns media and derivations. Integration: named transformations for OG/Twitter social cards (1200×630) and responsive `srcset`; image/video sitemap entries drawn from asset metadata (alt/caption/duration); AVIF/WebP negotiation; poster/thumbnail for `VideoObject`. No media is self-hosted; all derivations are Cloudinary-side per Phase 3.

---

## 14. SECURITY CONSIDERATIONS

- **Secrets**: Algolia admin key, Sanity write token, Shopify Storefront token, and revalidation secret stored as environment secrets (Vercel), never client-exposed. The client uses **search-only** Algolia keys, scoped to permitted indices/attributes.
- **Webhook authenticity**: all Sanity/Shopify webhooks verified by signature/shared secret; unsigned requests rejected. Revalidation endpoint requires the revalidation secret.
- **Injection/abuse**: search queries sanitised; rate-limit search and revalidation endpoints; edge middleware guards redirect-map lookups against open-redirect (allow-list destinations, no external redirects from the map).
- **Structured-data integrity**: schema emitted server-side from the trusted record only; no user input reflected into JSON-LD.
- **PII**: none in search records, sitemaps, feeds, or `llms.txt`; analytics anonymised (§11.5).
- **Crawler policy as security**: robots/`llms.txt` are policy, not enforcement; sensitive routes (account, checkout, Studio) are protected by auth regardless of robots.
- **Dependency & supply chain**: pin and audit search/SEO dependencies; the engine abstraction limits blast radius of any single vendor SDK.

---

## 15. TESTING CHECKLIST

**Metadata & canonical**
- [ ] Every route type resolves title/description/canonical/OG/Twitter with no undefined fallbacks.
- [ ] Canonical is self-referential and correct; params stripped; host/case/trailing-slash normalised via 301.
- [ ] Paginated pages self-canonical; faceted pages canonical-to-parent except allow-listed landings.

**Structured data**
- [ ] Each schema type validates against schema.org + Google Rich Results (CI gate).
- [ ] `@graph` `@id`s are stable and cross-referenced; org/website singletons present site-wide.
- [ ] No fabricated `AggregateRating`/medical claims; `reviewedBy`/`lastReviewed` present on medical pages.

**Knowledge graph & linking**
- [ ] No dangling references (audit passes); no orphan entities.
- [ ] Related-* modules render from relationships and are reciprocal.
- [ ] Citation pages resolve every in-body `refId`.

**Search**
- [ ] Autocomplete, typo tolerance, synonyms, transliteration (Arabic↔Latin) return expected entities.
- [ ] Facets scope correctly per type; safety facets default conservative.
- [ ] Zero-result path relaxes + suggests + offers human route.
- [ ] Pinned/merchandised rules fire for curated queries.
- [ ] Index settings applied from config (not dashboard drift).

**Sitemaps/feeds/AI**
- [ ] Sitemap index + children valid, accurate `lastmod`, correct includes/excludes, 50k split.
- [ ] Image/video sitemaps populated; news guarded/empty until enabled.
- [ ] `llms.txt`/`llms-full.txt` generate from graph and resolve.
- [ ] Content fully available server-rendered without JS (AI-crawler check).

**Redirects/status**
- [ ] Editable redirect map applies 301s; slug changes auto-301; retired content returns 410; 404 renders helpful page with 404 status.

**Performance/a11y**
- [ ] CWV budgets unregressed (Lighthouse/field) in CI.
- [ ] WCAG 2.2 AA on search/filters/entity pages (keyboard, ARIA live, contrast, focus).

**Integrations**
- [ ] Sanity/Shopify webhooks verified, trigger revalidate + reindex.
- [ ] Product schema joins Shopify offer to Sanity knowledge correctly.
- [ ] Social cards render from Cloudinary transformation.

---

## 16. PRODUCTION-READINESS CHECKLIST

- [ ] GSC + Bing Webmaster verified; sitemap index submitted; `llms.txt` live.
- [ ] Robots policy reviewed (AI crawlers permitted deliberately).
- [ ] Algolia production indices seeded via full reindex; search-only keys in client; admin key server-only.
- [ ] Index settings, synonyms, rules committed to `/lib/search/index-config` and applied via CI.
- [ ] Redirect map seeded from any legacy URL inventory; 301s verified.
- [ ] Rich results validated across all types; no errors/warnings on required properties.
- [ ] Reviewer sign-off enforced on all medical entities in production content.
- [ ] Monitoring/alerts: index-coverage drops, rich-result errors, CWV regressions, indexing failures, zero-result spikes.
- [ ] Rollback: SEO layer feature-flagged; structured data and search UI can be disabled without breaking pages.
- [ ] Backup/versioning of Sanity dataset and index config.

---

## 17. ACCEPTANCE CRITERIA

The phase is accepted only when **all** hold:

1. **Every indexable page** emits complete metadata, one self-referential canonical, OG/Twitter, and a valid, connected `@graph` of JSON-LD appropriate to its type.
2. **Every knowledge entity** exists as a typed node with resolved outbound + inbound relationships, renders related-* modules, and appears correctly in search with correct facets.
3. **Search** returns products, courses, conditions, ingredients, herbs, articles, research, hadith, Qur'an, FAQs, videos, faculty, events, and consultations, with autocomplete, typo tolerance, synonyms, Arabic transliteration, faceting, ranking rules, pinned results, popular searches, and a graceful zero-result path — all within the performance budget.
4. **Sitemaps, feeds, robots.txt, and llms.txt** are live, valid, generated from data, and accurate.
5. **AI surfaces** (entity pages, citation pages, chunked structure, refIds, machine-readable facts, Q&A) are present and server-rendered without JS.
6. **Editors** control SEO title/description/canonical/social image/schema overrides/keywords/relationships/author/reviewer/review date/reading time/featured-snippet answer/FAQ/citations/bibliography/internal-linking from within Sanity, with previews and validation gates.
7. **Analytics** capture search, content, and index metrics and produce an editorial-opportunity backlog.
8. **No regression** to design, typography, layout, design language, Core Web Vitals, or accessibility.
9. **Integrity guardrails** hold: no fabricated ratings, evidence levels, or authenticity gradings; medical content reviewed; conservative safety facets.
10. **Portability**: the search engine sits behind the abstraction and is demonstrably swappable.

---

## 18. MIGRATION STRATEGY

- **Legacy URLs**: inventory all existing URLs; map every changed/removed URL to a 301 (or 410 if intentionally gone) via the editable redirect map before launch; verify no legacy URL 404s silently.
- **Content → graph**: back-fill relationships and citations on existing entities (a one-time editorial pass, prioritised by pillar entities); the audit tool reports coverage so the graph is provably complete over time, not assumed.
- **Search rollout**: seed indices via full reindex; soft-launch search behind a flag; validate relevance on real queries before promoting.
- **Engine migration path (Algolia → Meilisearch/other)**: because all call sites use `/lib/search/engine.ts` and index settings live as config, migration is (1) implement the abstraction for the new engine, (2) translate index-config, (3) run parallel indexing, (4) A/B relevance, (5) cut over. No page or component changes required.
- **Schema evolution**: new schema types ship as guarded builders (NewsArticle/Physician/Dataset) and are enabled with their content types — no retrofit.

---

## 19. FUTURE SCALABILITY

- **Multilingual**: locale-segmented URLs, `entityId` translation graph, per-locale search replicas, and hreflang scaffolding are already in place; adding Arabic (RTL/Amiri per Phase 1) and further languages is additive.
- **Vector/RAG**: chunk boundaries, anchors, refIds, and clean projections make a future vector index and `/api/knowledge` RAG endpoint additive, not structural.
- **News**: `NewsArticle` + `news.xml` switch on for a future editorial/news desk.
- **Physician directory & Dataset**: `Physician` and `Dataset` builders enable a future practitioner directory and open research data.
- **New entity types**: the entity+relationship+projection+facet+schema+index pattern is uniform, so a new knowledge type (e.g. "regimen", "protocol") is a repeatable addition, not a bespoke build.
- **Federation across campuses**: the three-campus `LocalBusiness` model and the graph support future per-campus knowledge and events without re-architecture.

The architecture is deliberately built so that the institution's discoverability compounds over decades: every new entity strengthens the graph, every graph edge strengthens internal linking and search, and every clean, cited surface strengthens authority with both search engines and LLMs — exactly the durable, structural authority a hundred-year institution requires.

---

## APPENDIX A — SCHEMA-TO-SOURCE FIELD MAPPING (REFERENCE)

*A living reference maintained alongside `/lib/seo/schema/`. Each builder documents: schema type, emitted properties, source field (Sanity/Shopify/Cloudinary/derived), required-vs-optional, and validation rule. Extended per new type. Representative rows are given in §4.3; the full table is maintained in-repo as the single source for schema mapping so that structured data and this document never drift.*

## APPENDIX B — URL TAXONOMY (REFERENCE)

```
/                                     home
/knowledge/[type]/[slug]              entity pages (ingredient|condition|bodySystem|
                                        hadith|quran|scholar|research|video|faq)
/knowledge/citations/[refId]          canonical citation pages
/articles/[slug]  /articles/page/[n]  editorial + pagination
/products/[handle]                    product (Shopify⋈Sanity)
/collections/[slug]                   CollectionPage
/courses/[slug]                       Course + CourseInstance
/faculty/[slug]                       Person/Physician
/events/[slug]                        Event
/journeys/[slug]                      Sacred Journeys (Event/Trip)
/search                               search shell (noindex query states)
/sitemap.xml /sitemaps/*.xml          sitemap index + children
/feeds/rss.xml                        feeds
/robots.txt  /llms.txt  /llms-full.txt
```

## APPENDIX C — INDEX CONFIGURATION REFERENCE (REFERENCE)

```
index: content (+ replicas: content_date, content_popularity)
searchableAttributes (ordered):
  title > aliases,transliteration > keywords > excerpt,body
attributesForFaceting:
  type, condition, ingredient, bodySystem, evidenceLevel, researchQuality,
  hadithAuthenticity, quranTopic, preparation, difficulty, audience,
  pregnancySafe, children, usageType(traditional|modern|clinical),
  availability, category, collection, courseLevel, scholar, author,
  publicationDate(range)
customRanking: desc(editorialWeight), desc(popularity), desc(recency)
rules: query→pinned objectIDs (curated institutional answers)
synonyms: ingredient/condition/practice equivalences (+ Arabic transliteration)
queryLanguages: [en, ar]; ignorePlurals; typoTolerance tuned per attribute
```

---

## COLOPHON

*Sunnah Remedies — Search, SEO & Knowledge Architecture · Cursor Implementation Blueprint.*

This specification is additive to Phases 1–4 and changes no design, typography, layout, or design language. It turns the website into a single knowledge graph projected simultaneously to humans, search engines, and large language models, and holds every discoverability mechanism to the institution's governing standard: **truth and *isnād* above ranking — we make the tradition maximally discoverable by making it maximally well-structured and honestly sourced, never by manipulating what it says.**

*Two Ledgers. One Standard.*
