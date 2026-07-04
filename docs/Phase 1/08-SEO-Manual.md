# 08 — SEO Manual

## Philosophy

Search engine optimisation at Sunnah Remedies serves discoverability — not manipulation. The institution produces content worth finding. SEO ensures that content *can* be found by those who seek it.

No dark patterns. No keyword stuffing. No manipulation of intent.

---

## SEO Architecture

### Global Defaults

The `globalSeo` document in Sanity provides:
- Site name: "Sunnah Remedies"
- Default meta description
- Default OG image (institutional lockup)
- Twitter handle
- Base keywords

### Per-Page SEO

Every content type includes an `seo` object with:

| Field | Max Length | Purpose |
|---|---|---|
| `metaTitle` | 70 chars | Custom `<title>` tag |
| `metaDescription` | 160 chars | Search result snippet |
| `canonicalUrl` | — | Canonical if duplicated |
| `ogImage` | 1200×630px | Social sharing image |
| `ogTitle` | — | Override for social |
| `ogDescription` | — | Override for social |
| `keywords` | — | Supplementary keywords |
| `noIndex` | boolean | Exclude from indexing |
| `structuredData` | — | Custom JSON-LD |

---

## Title Strategy

### Format

```
{Page Title} · Sunnah Remedies
```

### Examples

| Page | Title |
|---|---|
| Homepage | Sunnah Remedies — Institute of Prophetic Medicine |
| Apothecary | The Apothecary · Sunnah Remedies |
| Sidr Honey | Raw Sidr Honey — Monograph · Sunnah Remedies |
| Hijama Diploma | Hijāma Diploma · Sunnah Remedies |
| Umrah | Umrah — Sacred Journey · Sunnah Remedies |
| Article | {Article Title} · Knowledge Library · Sunnah Remedies |

### Rules

- Title under 60 characters (displayed in search results)
- Most important words first
- No keyword repetition
- Brand name at end, separated by ` · `

---

## Meta Descriptions

### Guidelines

- 120–160 characters
- Summarise the page content accurately
- Include the primary topic/keyword naturally
- End with a complete sentence
- Do not use the word "welcome"
- Do not use calls to action ("Click here", "Learn more")

### Examples

Good: "A dispensary where each remedy carries a monograph: historical context, Prophetic reference, traditional use, stated limits, and provenance."

Bad: "Welcome to our shop! Click here to browse our amazing range of natural products."

---

## Structured Data (JSON-LD)

### Organisation

```json
{
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Sunnah Remedies",
  "description": "Institute of Prophetic Medicine",
  "url": "https://sunnahremedies.com",
  "logo": "https://sunnahremedies.com/brand/lockup-horizontal-primary.svg"
}
```

### Product Pages

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Raw Sidr Honey",
  "description": "...",
  "offers": {
    "@type": "Offer",
    "price": "45.00",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock"
  }
}
```

### Articles

```json
{
  "@context": "https://schema.org",
  "@type": "ScholarlyArticle",
  "headline": "...",
  "author": { "@type": "Person", "name": "..." },
  "datePublished": "...",
  "publisher": { "@type": "Organization", "name": "Sunnah Remedies" }
}
```

### Courses

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "Hijāma Diploma",
  "provider": { "@type": "Organization", "name": "Sunnah Remedies Academy" },
  "description": "..."
}
```

### FAQ Pages

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
```

---

## URL Best Practices

- All URLs lowercase and hyphenated
- No trailing slashes
- No query parameters for content pages
- Permanent URLs — never change a published slug
- 301 redirects for any necessary URL changes
- No duplicate content accessible at multiple URLs

---

## Sitemap

Generated automatically by Next.js:
- All published products
- All published programmes
- All published journeys
- All published articles
- All institutional pages
- Updated on each deployment

---

## Robots.txt

```
User-agent: *
Allow: /
Disallow: /studio
Disallow: /api/

Sitemap: https://sunnahremedies.com/sitemap.xml
```

---

## Image SEO

- Every image has descriptive alt text (see Photography Manual)
- Images served in modern formats (WebP/AVIF via CDN)
- Responsive images with `srcset` and `sizes`
- Lazy loading below the fold
- Hero images loaded with `priority`
- File names are descriptive (handled by Sanity asset pipeline)

---

## Content SEO

### Heading Hierarchy

- One `h1` per page
- Logical heading order (h1 → h2 → h3)
- Headings describe content, not visual style

### Internal Linking

- Every page links to related content
- Department navigation at bottom of each page
- Cross-department connections (products → articles → programmes)
- No orphan pages (every page reachable within 3 clicks)

### Content Quality Signals

- Original, substantive content (not thin pages)
- Sources cited (builds authority)
- Regular updates (Last Updated date visible)
- Expert authorship (faculty attribution)

---

## Performance & Technical SEO

- Server-side rendering for all public pages
- Fast Time to First Byte via static generation
- Core Web Vitals within targets (see Engineering Standards)
- Mobile-first responsive design
- HTTPS everywhere
- No redirect chains
- Proper HTTP status codes (404 for missing, 301 for moved)

---

## Social Sharing

### Open Graph

Every page generates:
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:type" content="website" />
<meta property="og:url" content="..." />
```

### Twitter Cards

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

---

## What is Not Permitted

- Keyword stuffing
- Hidden text
- Cloaking (showing different content to search engines)
- Link schemes
- Auto-generated content for SEO purposes
- Doorway pages
- Thin affiliate content
- Manipulative structured data (marking up content that doesn't exist)
