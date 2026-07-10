# 07 — Engineering Standards

## Principles

1. **Institutional longevity** — code must be maintainable for years, not weeks
2. **Strong typing** — TypeScript strictness prevents drift
3. **Minimal dependencies** — every dependency is a liability
4. **Clear architecture** — new developers orient within minutes
5. **No cleverness** — readable code over clever code

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js | 16.x |
| Language | TypeScript | 6.x |
| Styling | Tailwind CSS | 4.x |
| CMS | Sanity | Latest |
| Hosting | Vercel | — |
| Runtime | React | 19.x |
| Node | Node.js | 20+ |

---

## Project Structure

```
/
├── docs/                          → Institutional documentation
├── Logo/                          → Source brand assets
├── public/
│   ├── brand/                     → Deployed brand assets
│   └── photography/               → Static photography
├── src/
│   ├── app/
│   │   ├── (studio)/             → Sanity Studio route group
│   │   │   └── studio/[[...tool]]/
│   │   ├── layout.tsx            → Root layout (fonts, chrome)
│   │   ├── page.tsx              → Homepage
│   │   ├── the-apothecary/
│   │   ├── the-academy/
│   │   ├── sacred-journeys/
│   │   ├── knowledge-library/
│   │   ├── charter/
│   │   ├── consultations/
│   │   └── globals.css
│   ├── components/
│   │   ├── chrome/               → Masthead, Footer, Seal, Wordmark
│   │   ├── editorial/            → Editorial layout components
│   │   ├── academy/              → Academy-specific components
│   │   ├── apothecary/           → Apothecary-specific components
│   │   ├── journeys/             → Journey-specific components
│   │   ├── threshold/            → Homepage-specific
│   │   └── ui/                   → Shared UI primitives
│   ├── context/                  → React contexts
│   ├── lib/
│   │   ├── brand.ts              → Brand asset configuration
│   │   ├── tokens.ts             → Design tokens
│   │   ├── content/              → Static content (legacy, being migrated)
│   │   └── navigation/           → Navigation structure
│   └── sanity/
│       ├── schemas/
│       │   ├── objects/          → Reusable schema objects
│       │   └── documents/        → Document type schemas
│       ├── structure/            → Studio desk configuration
│       └── lib/
│           ├── client.ts         → Sanity client
│           ├── image.ts          → Image URL utilities
│           └── queries.ts        → GROQ queries
├── sanity.config.ts              → Sanity Studio configuration
├── sanity.cli.ts                 → Sanity CLI configuration
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.local                    → Environment variables (not committed)
```

---

## TypeScript Standards

### Strict Mode

TypeScript runs in strict mode. No `any` types. No `@ts-ignore` without documented justification.

### Type Definitions

- Sanity document types: generated from schemas or defined in `src/sanity/lib/types.ts`
- Component props: defined inline or in adjacent `.types.ts` files
- Shared types: `src/lib/content/types.ts`

### Naming

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `EditorialPillar` |
| Functions | camelCase | `getRemedyBySlug` |
| Constants | camelCase or UPPER_SNAKE | `brandColors`, `API_VERSION` |
| Types/Interfaces | PascalCase | `Remedy`, `AcademyProgramme` |
| Files (components) | PascalCase | `Masthead.tsx` |
| Files (utilities) | kebab-case | `site-structure.ts` |
| CSS classes | kebab-case / BEM | `masthead__brand` |
| Sanity types | camelCase | `institutionSettings` |

---

## Component Standards

### Structure

```typescript
// 1. Imports
import { type FC } from "react";

// 2. Types (if complex)
interface Props {
  title: string;
  body: string;
}

// 3. Component
export function ComponentName({ title, body }: Props) {
  return (
    <section>
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}
```

### Rules

- One component per file (small helpers may coexist)
- Props destructured in function signature
- No default exports (named exports only, except pages)
- No inline styles except for dynamic values from CMS
- No `useEffect` for data fetching (use server components)
- Client components marked with `"use client"` only when necessary

---

## Styling Standards

### Approach

- Tailwind CSS 4 for utility classes (new CSS-first configuration)
- Custom CSS in `globals.css` for institutional design system
- CSS custom properties for all design tokens
- No CSS-in-JS
- No styled-components (except Sanity Studio internals)

### Class Naming

- Institutional components use BEM-style classes: `masthead__brand`, `footer__grid`
- Utility classes from Tailwind for spacing adjustments
- Never mix arbitrary Tailwind values with custom CSS classes

### CSS Custom Properties

All spacing, colours, and typography are defined as CSS custom properties:

```css
--deep-emerald: #0E3B2E;
--gilt: #C7A25A;
--paper: #F6F3EE;
--s4: 1.5rem;
--measure-reading: 65ch;
```

---

## Data Fetching

### Pattern

All data fetching happens in server components at the page level:

```typescript
// src/app/the-apothecary/[slug]/page.tsx
import { client } from "@/sanity/lib/client";
import { productBySlugQuery } from "@/sanity/lib/queries";

export default async function ProductPage({ params }: Props) {
  const product = await client.fetch(productBySlugQuery, { slug: params.slug });
  return <RemedyMonograph remedy={product} />;
}
```

### Rules

- No client-side data fetching on public pages
- GROQ queries defined centrally in `queries.ts`
- Queries fetch only necessary fields
- Static generation with ISR for all public content
- Preview mode available for editors

---

## Error Handling

- 404 pages use `notFound()` from Next.js
- Missing CMS content handled gracefully (fallback UI, not crashes)
- No unhandled promise rejections
- Console errors are bugs, not warnings to ignore

---

## Environment Variables

| Variable | Purpose | Public |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project identifier | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Dataset name | Yes |
| `SANITY_API_TOKEN` | Server-side API token | No |

Future:
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud | Yes |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify API | No |
| `STRIPE_SECRET_KEY` | Stripe API | No |

---

## Git Conventions

### Branches

- `main` — production, always deployable
- `develop` — integration branch
- Feature branches: `feature/sanity-schemas`, `feature/academy-page`
- Fix branches: `fix/navigation-mobile`

### Commits

Conventional commits:
- `feat: add product schema`
- `fix: correct mobile navigation z-index`
- `docs: add CMS architecture documentation`
- `refactor: migrate homepage to Sanity data`
- `chore: update dependencies`

### Pull Requests

- One logical change per PR
- Description explains *why*, not just *what*
- All checks pass before merge
- No force-pushing to shared branches

---

## Performance Budget

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| Total page weight (initial) | < 500KB |
| JavaScript bundle | < 150KB |
| Image per viewport | < 200KB |

---

## Security

- No secrets in client-side code
- Sanity API token only on server
- Environment variables validated at build time
- No user input rendered without sanitisation
- Content Security Policy headers configured
- No third-party scripts without explicit approval

---

## Testing

- Type checking: `tsc --noEmit`
- Linting: ESLint with Next.js config
- Build verification: `next build` must succeed
- No unit tests for presentational components (tested by build)
- Integration tests for data fetching (future)
- Visual regression testing (future)

---

## Deployment

- Vercel automatic deployments from `main`
- Preview deployments for all PRs
- Environment variables configured in Vercel dashboard
- No manual deployment steps
- Build must complete without warnings treated as errors
