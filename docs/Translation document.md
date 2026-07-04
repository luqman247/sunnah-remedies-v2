# Sunnah Remedies — Bilingual (EN/DA) Architecture & Implementation Guide

**Stack:** Next.js 14+ (App Router) · TypeScript · Sanity CMS · Shopify Headless
**Model:** English = source of truth (unprefixed `/`) · Danish = `/dk` · designed for unlimited future languages
**Author's note for Cursor:** This document is the single source of truth. Create/modify files exactly as specified. Every code block is labelled with its file path. Where your existing repo differs (e.g. a different data-fetching helper), adapt the *integration point*, not the *architecture*.

---

## 0. Architectural decisions (read first)

These are the load-bearing choices. Everything else follows from them.

| Concern | Decision | Why |
|---|---|---|
| UI string i18n | **next-intl v3.22+ / v4** | The App Router standard. Server-Component-first, typed messages, built-in middleware, hreflang, locale detection + cookie. No client bundle bloat. |
| URL strategy | `localePrefix: 'as-needed'` with **custom prefix map** `{ da: '/dk' }` | English stays at `/` (no SEO migration, no redirects on existing URLs). Danish lives under `/dk`. The internal locale is `da`; only the *user-facing prefix* is `dk`. |
| CMS localization | **Document-level i18n** (`@sanity/document-internationalization`) | One document per language, linked by a translation-metadata document. This is what gives you translated slugs (`/dk/blog/hijama-fordele`), per-language publish, per-language "needs translation" status, and side-by-side review. **No schema duplication** — the same schema is reused for every language. |
| Shopify | **Shopify Markets + `@inContext` Storefront directive** | Native localization. Product/collection/variant/SEO translations live in Shopify (Translate & Adapt), fetched by passing `language: DA`. Checkout localizes automatically. |
| Translation pipeline | **AI draft → human review → publish**, English locked as source | Speed of MT with the quality control Prophetic-medicine content requires (Qur'anic Arabic, hadith, transliterations never machine-mangled). |
| Adding a language | **One entry in one config array + message file + enable in Sanity/Shopify** | Target: < 5 min, zero component/page/layout changes. |

**Golden rule enforced throughout:** *No duplicated pages, no duplicated layouts, no duplicated schemas, no duplicated components.* One `[locale]` tree renders all languages.

---

## 1. Packages to install

```bash
# Next.js i18n
npm i next-intl

# Sanity localization (in your Sanity studio project/workspace)
npm i @sanity/document-internationalization @sanity/language-filter

# Shopify Storefront typing helper (if not already present)
# (uses your existing Storefront API client — no new runtime dep required)
```

Minimum versions: `next-intl@^3.22` (or `^4`), `next@^14.2`, `@sanity/document-internationalization@^3`.

---

## 2. Folder structure (after)

```
src/
├── middleware.ts                      # next-intl middleware (locale detection, cookie, prefix)
├── i18n/
│   ├── routing.ts                     # SINGLE source of locale truth (add languages here)
│   ├── navigation.ts                  # typed Link / useRouter / redirect / usePathname
│   ├── request.ts                     # per-request messages loader
│   └── locales.ts                     # locale metadata (label, flag, dir, sanity id, shopify code)
├── messages/
│   ├── en.json                        # UI strings — English
│   └── da.json                        # UI strings — Danish
├── app/
│   ├── layout.tsx                     # minimal root (html lang set in [locale] layout)
│   ├── [locale]/
│   │   ├── layout.tsx                 # locale provider, <html lang dir>, metadata base
│   │   ├── page.tsx                   # homepage
│   │   ├── shop/…                     # shop (Shopify)
│   │   ├── academy/…                  # academy
│   │   ├── blog/
│   │   │   ├── page.tsx               # blog index
│   │   │   └── [slug]/page.tsx        # blog post (slug resolved per-locale from Sanity)
│   │   └── … all other routes
│   ├── sitemap.ts                     # locale-aware sitemap with alternates
│   ├── robots.ts
│   └── [...rest]/page.tsx             # catch-all → notFound (required by as-needed)
├── lib/
│   ├── sanity/
│   │   ├── client.ts                  # your existing client
│   │   ├── queries.ts                 # GROQ, all locale-parameterised
│   │   └── fetch.ts                   # sanityFetch(locale) helper w/ fallback
│   ├── shopify/
│   │   ├── client.ts                  # Storefront client w/ @inContext support
│   │   └── queries.ts
│   └── seo/
│       └── metadata.ts                # buildMetadata() → hreflang/canonical/OG per locale
├── components/
│   ├── LanguageSwitcher.tsx           # premium switcher (client)
│   └── … (all existing components consume useTranslations, no duplication)
└── emails/
    └── … (templates take a `locale` prop)

sanity/                                # Sanity Studio project
├── sanity.config.ts                   # add documentInternationalization + languageFilter plugins
├── schemas/
│   ├── … existing schemas (add `language` field via plugin, translatable slug)
│   └── objects/localeString.ts        # (only if you ever need field-level; not used by default)
└── structure/
    └── deskStructure.ts               # groups documents by translation status
```

---

## 3. Next.js i18n foundation

### 3.1 `src/i18n/locales.ts` — the metadata registry

This is the one place that describes each language. **Adding a language = adding one object here** (plus a message file). Everything downstream (switcher, hreflang, Sanity, Shopify, `dir`) reads from this.

```ts
// src/i18n/locales.ts
export type AppLocale = 'en' | 'da';

export interface LocaleConfig {
  /** Internal next-intl locale id */
  id: AppLocale;
  /** User-facing URL prefix ('' means unprefixed root) */
  prefix: string;
  /** Native label shown in the switcher */
  label: string;
  /** Short code shown in compact switcher */
  short: string;
  /** Emoji flag (or swap for SVG asset path) */
  flag: string;
  /** Text direction — RTL-ready for future Arabic/Urdu/Pashto */
  dir: 'ltr' | 'rtl';
  /** BCP-47 tag for <html lang> and hreflang */
  htmlLang: string;
  /** Sanity language id (must match documentInternationalization config) */
  sanityId: string;
  /** Shopify LanguageCode enum value for @inContext */
  shopify: string;
  /** ISO for date/number formatting */
  intl: string;
}

export const LOCALES: LocaleConfig[] = [
  {
    id: 'en',
    prefix: '',
    label: 'English',
    short: 'EN',
    flag: '🇬🇧',
    dir: 'ltr',
    htmlLang: 'en',
    sanityId: 'en',
    shopify: 'EN',
    intl: 'en-GB',
  },
  {
    id: 'da',
    prefix: '/dk',
    label: 'Dansk',
    short: 'DA',
    flag: '🇩🇰',
    dir: 'ltr',
    htmlLang: 'da',
    sanityId: 'da',
    shopify: 'DA',
    intl: 'da-DK',
  },
  // ➕ FUTURE: add Arabic in <5 min — uncomment, add messages/ar.json, enable in Sanity/Shopify.
  // {
  //   id: 'ar', prefix: '/ar', label: 'العربية', short: 'AR', flag: '🇸🇦',
  //   dir: 'rtl', htmlLang: 'ar', sanityId: 'ar', shopify: 'AR', intl: 'ar',
  // },
];

export const DEFAULT_LOCALE: AppLocale = 'en';

export const localeById = (id: string) =>
  LOCALES.find((l) => l.id === id) ?? LOCALES[0];

export const LOCALE_IDS = LOCALES.map((l) => l.id);
```

### 3.2 `src/i18n/routing.ts` — routing config (custom `/dk` prefix)

```ts
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';
import { LOCALES, DEFAULT_LOCALE } from './locales';

// Build the { da: '/dk' } prefix map from the registry.
// Default locale ('' prefix) is omitted so it stays at root.
const prefixes = Object.fromEntries(
  LOCALES.filter((l) => l.prefix).map((l) => [l.id, l.prefix]),
) as Record<string, `/${string}`>;

export const routing = defineRouting({
  locales: LOCALES.map((l) => l.id),
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: {
    mode: 'as-needed',   // en → '/', others → their prefix
    prefixes,            // da → '/dk'
  },
  // Persist the chosen language "forever": 1 year cookie.
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
  // Auto-detect from Accept-Language on first visit, but the cookie
  // (set when the user manually switches) always wins → never trap the user.
  localeDetection: true,
});
```

> **Why this satisfies your spec:** English at `/`, Danish at `/dk`, browser-language auto-redirect on first visit, and once a user manually switches, the `NEXT_LOCALE` cookie takes precedence over `Accept-Language` forever (1-year, refreshed each switch). The `[locale]` route segment receives `da` (the locale), not `dk` (the prefix) — next-intl rewrites internally.

### 3.3 `src/i18n/navigation.ts` — typed navigation

Always import `Link`, `useRouter`, `redirect`, `usePathname` from here — **never** from `next/link` or `next/navigation` for localized links. This is what keeps prefixes correct with zero per-component logic.

```ts
// src/i18n/navigation.ts
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
```

### 3.4 `src/i18n/request.ts` — per-request messages

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { localeById } from './locales';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  return {
    locale,
    // Lazy-loaded per request → only the active language ships.
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Copenhagen',
    now: new Date(),
    formats: {
      dateTime: {
        short: { day: 'numeric', month: 'short', year: 'numeric' },
      },
    },
    // Optional: intl locale for correct number/currency formatting
    // (Intl uses the locale id; da-DK formatting via `localeById`).
    getMessageFallback({ key }) {
      return key; // fail visibly in dev, never crash prod
    },
  };
});
```

### 3.5 `src/middleware.ts`

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match everything except API routes, Next internals, and files with extensions.
  // The negative lookahead means unprefixed English routes are matched too (required for as-needed).
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
};
```

> If your Sanity Studio is embedded at `/studio`, it's excluded above so the middleware never rewrites it.

### 3.6 `next.config.mjs` — wire up the plugin

```js
// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // …your existing config (images, redirects, etc.)
};

export default withNextIntl(nextConfig);
```

### 3.7 `src/app/[locale]/layout.tsx` — the one layout for all languages

```tsx
// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { localeById } from '@/i18n/locales';

// Statically pre-render every locale → no runtime cost, best Lighthouse.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering of Server Components using translations.
  setRequestLocale(locale);

  const cfg = localeById(locale);

  return (
    <html lang={cfg.htmlLang} dir={cfg.dir} suppressHydrationWarning>
      <body>
        {/* Provider streams only the active locale's messages to Client Components */}
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
```

> `dir={cfg.dir}` is why the site is **RTL-ready today** — the day you enable Arabic/Urdu/Pashto, layout direction flips automatically with zero code changes (pair with logical CSS properties: `margin-inline-start` not `margin-left`).

### 3.8 `src/app/layout.tsx` — minimal root

Keep the root layout tiny; the real `<html>` lives in `[locale]/layout.tsx`. If your Next version requires an `<html>` in the root, use a pass-through:

```tsx
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

### 3.9 `src/app/[...rest]/page.tsx` — required catch-all

With `as-needed`, add a catch-all so unmatched paths 404 cleanly instead of leaking.

```tsx
// src/app/[...rest]/page.tsx
import { notFound } from 'next/navigation';

export default function CatchAllPage() {
  notFound();
}
```

### 3.10 Using translations in components (the pattern)

**Server Component (default — preferred):**

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function Hero({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations('home.hero');
  return <h1>{t('title')}</h1>;
}
```

**Client Component (only when interactivity needs it):**

```tsx
'use client';
import { useTranslations } from 'next-intl';

export function AddToCart() {
  const t = useTranslations('shop');
  return <button>{t('addToCart')}</button>;
}
```

Existing components are **not duplicated** — each one swaps hard-coded strings for `t('…')`. That's the whole migration for UI text.

---

## 4. Message catalogs (UI strings)

One JSON file per language, identical key structure. These cover **everything that isn't CMS/Shopify content**: nav, footer, buttons, forms, breadcrumbs, pagination, filters, cookie banner, validation, success/error messages, ARIA labels.

```jsonc
// src/messages/en.json
{
  "nav": {
    "home": "Home",
    "shop": "Shop",
    "academy": "Academy",
    "blog": "Blog",
    "about": "About",
    "contact": "Contact",
    "cart": "Cart",
    "ariaMenu": "Main navigation",
    "ariaLanguage": "Change language"
  },
  "shop": {
    "addToCart": "Add to cart",
    "outOfStock": "Out of stock",
    "filters": "Filters",
    "sortBy": "Sort by",
    "results": "{count, plural, =0 {No products} one {# product} other {# products}}"
  },
  "form": {
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "placeholderEmail": "you@example.com",
    "submit": "Send",
    "sending": "Sending…",
    "success": "Thank you — we'll be in touch shortly.",
    "error": "Something went wrong. Please try again.",
    "validation": {
      "required": "This field is required",
      "email": "Please enter a valid email address",
      "minLength": "Must be at least {min} characters"
    }
  },
  "breadcrumbs": { "home": "Home" },
  "pagination": { "previous": "Previous", "next": "Next", "page": "Page {n}" },
  "cookie": {
    "title": "We value your privacy",
    "body": "We use cookies to improve your experience.",
    "accept": "Accept",
    "reject": "Reject non-essential",
    "settings": "Settings"
  },
  "search": { "placeholder": "Search…", "noResults": "No results found for \"{query}\"" }
}
```

```jsonc
// src/messages/da.json
{
  "nav": {
    "home": "Hjem",
    "shop": "Butik",
    "academy": "Akademi",
    "blog": "Blog",
    "about": "Om os",
    "contact": "Kontakt",
    "cart": "Kurv",
    "ariaMenu": "Hovednavigation",
    "ariaLanguage": "Skift sprog"
  },
  "shop": {
    "addToCart": "Læg i kurv",
    "outOfStock": "Udsolgt",
    "filters": "Filtre",
    "sortBy": "Sortér efter",
    "results": "{count, plural, =0 {Ingen produkter} one {# produkt} other {# produkter}}"
  },
  "form": {
    "name": "Navn",
    "email": "E-mail",
    "message": "Besked",
    "placeholderEmail": "dig@eksempel.dk",
    "submit": "Send",
    "sending": "Sender…",
    "success": "Tak — vi vender tilbage hurtigst muligt.",
    "error": "Noget gik galt. Prøv venligst igen.",
    "validation": {
      "required": "Dette felt er påkrævet",
      "email": "Indtast venligst en gyldig e-mailadresse",
      "minLength": "Skal være mindst {min} tegn"
    }
  },
  "breadcrumbs": { "home": "Hjem" },
  "pagination": { "previous": "Forrige", "next": "Næste", "page": "Side {n}" },
  "cookie": {
    "title": "Vi værner om dit privatliv",
    "body": "Vi bruger cookies til at forbedre din oplevelse.",
    "accept": "Acceptér",
    "reject": "Afvis ikke-nødvendige",
    "settings": "Indstillinger"
  },
  "search": { "placeholder": "Søg…", "noResults": "Ingen resultater for \"{query}\"" }
}
```

**Type safety (recommended):** add a global type so `t('…')` autocompletes and fails the build on a missing/renamed key.

```ts
// src/global.d.ts
import type en from './messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof en;
    Locale: import('./i18n/locales').AppLocale;
  }
}
```

> **Danish note:** the strings above are a professional baseline; have a native reviewer confirm tone for luxury/healthcare register before launch. The plural syntax (`one`/`other`) is ICU MessageFormat — Danish uses the same two categories as English.

---

## 5. Premium language switcher

Apple-minimal, accessible, keyboard-navigable, screen-reader-friendly. It switches locale **on the current path** (so `/dk/blog` ↔ `/blog`), updates the cookie via `useRouter`, and animates smoothly. Two visual variants included — pick one.

```tsx
// src/components/LanguageSwitcher.tsx
'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { LOCALES } from '@/i18n/locales';

export function LanguageSwitcher() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();          // locale-agnostic path (from @/i18n/navigation)
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const current = LOCALES.find((l) => l.id === locale)!;

  function switchTo(nextLocale: string) {
    setOpen(false);
    // useRouter updates the NEXT_LOCALE cookie on the client BEFORE navigating,
    // so the choice persists and takes precedence over Accept-Language forever.
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  // Close on outside click + Escape; return focus to trigger (a11y).
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="ls">
      <button
        ref={btnRef}
        type="button"
        className="ls__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('ariaLanguage')}
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden>{current.flag}</span>
        <span className="ls__label">{current.short}</span>
        <svg className={`ls__chev ${open ? 'is-open' : ''}`} width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`ls__menu ${open ? 'is-open' : ''}`} role="listbox" aria-label={t('ariaLanguage')}>
        {LOCALES.map((l) => {
          const active = l.id === locale;
          return (
            <button
              key={l.id}
              role="option"
              aria-selected={active}
              lang={l.htmlLang}
              className={`ls__item ${active ? 'is-active' : ''}`}
              onClick={() => switchTo(l.id)}
            >
              <span aria-hidden>{l.flag}</span>
              <span>{l.label}</span>
              {active && (
                <svg className="ls__check" width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                  <path d="M2 7l3.5 3.5L12 3.5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

```css
/* Co-locate as a CSS module (LanguageSwitcher.module.css) or in your design system.
   Uses logical properties so it mirrors correctly in future RTL locales. */
.ls { position: relative; }
.ls__trigger {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .4rem .7rem; border: 1px solid var(--border, rgba(0,0,0,.08));
  border-radius: 999px; background: transparent; cursor: pointer;
  font-size: .85rem; letter-spacing: .02em; line-height: 1;
  transition: border-color .2s ease, background .2s ease;
}
.ls__trigger:hover { border-color: var(--border-strong, rgba(0,0,0,.18)); }
.ls__trigger:focus-visible { outline: 2px solid var(--focus, #0b5); outline-offset: 2px; }
.ls__chev { transition: transform .2s ease; }
.ls__chev.is-open { transform: rotate(180deg); }
.ls__menu {
  position: absolute; inset-inline-end: 0; margin-block-start: .5rem;
  min-inline-size: 11rem; padding: .35rem;
  background: var(--surface, #fff); border: 1px solid var(--border, rgba(0,0,0,.08));
  border-radius: 14px; box-shadow: 0 8px 30px rgba(0,0,0,.12);
  opacity: 0; transform: translateY(-6px) scale(.98); pointer-events: none;
  transition: opacity .18s ease, transform .18s ease; z-index: 50;
}
.ls__menu.is-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
.ls__item {
  display: flex; align-items: center; gap: .6rem; inline-size: 100%;
  padding: .55rem .6rem; border: 0; border-radius: 9px; background: transparent;
  cursor: pointer; font-size: .9rem; text-align: start;
}
.ls__item:hover { background: var(--surface-hover, rgba(0,0,0,.04)); }
.ls__item.is-active { font-weight: 600; }
.ls__check { margin-inline-start: auto; }
@media (prefers-reduced-motion: reduce) {
  .ls__menu, .ls__chev { transition: none; }
}
```

**Integrate** into your sticky top nav (desktop + mobile). Because it reads from `LOCALES`, it needs **no change** when you add a language.

---

## 6. Sanity CMS — document-level internationalization

This is the heart of "every CMS document, forever, with no schema duplication."

### 6.1 How it works (mental model)

- Each translatable document type (post, product page, course, testimonial, FAQ, policy, page…) gets a hidden `language` field, added automatically by the plugin.
- A separate **translation-metadata document** links the EN and DA versions of the same content.
- The **same schema** serves every language — you never write `postDa` / `postEn`. One `post` schema, N language instances.
- Slugs are **per-document**, so `/blog/benefits-of-hijama` (EN) and `/dk/blog/hijama-fordele` (DA) are fully independent and SEO-clean.
- Publishing is **per-language** — Danish can stay in draft while English is live.

### 6.2 `sanity.config.ts`

```ts
// sanity/sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { documentInternationalization } from '@sanity/document-internationalization';
import { languageFilter } from '@sanity/language-filter';
import { schemaTypes } from './schemas';
import { deskStructure } from './structure/deskStructure';

// Keep this list in sync with src/i18n/locales.ts (same ids).
const SUPPORTED_LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'da', title: 'Dansk' },
  // ➕ FUTURE: { id: 'ar', title: 'العربية' }, etc.
];

// The document types that should be translatable.
const TRANSLATABLE_TYPES = [
  'page',
  'post',
  'productPage',
  'collectionPage',
  'course',
  'category',
  'testimonial',
  'faq',
  'policy',
  'knowledgeArticle',
  'clinicPage',
  'academyPage',
  // Singletons like navigation/footer/siteSettings can also be translatable:
  'navigation',
  'footer',
  'siteSettings',
];

export default defineConfig({
  name: 'default',
  title: 'Sunnah Remedies',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,
  plugins: [
    structureTool({ structure: deskStructure }),
    documentInternationalization({
      supportedLanguages: SUPPORTED_LANGUAGES,
      schemaTypes: TRANSLATABLE_TYPES,
      // The metadata document that links translations.
      // Weak references keep documents deletable independently.
      weakReferences: true,
      // Fields to copy when creating a translation (media, refs stay shared;
      // text fields are cleared so they get translated).
      // Leave default unless you have special base fields.
    }),
    // Optional: hide non-active-language fields if you ever mix in field-level i18n.
    languageFilter({
      supportedLanguages: SUPPORTED_LANGUAGES,
      defaultLanguages: ['en'],
      documentTypes: TRANSLATABLE_TYPES,
    }),
  ],
  schema: { types: schemaTypes },
});
```

### 6.3 Schema — translatable slug + language-aware fields

You do **not** rewrite schemas. Two small touches per translatable type:

1. The plugin injects the `language` field automatically — you don't add it manually, but you should hide it from the form (it does this by default) and make slugs unique per language.

```ts
// sanity/schemas/documents/post.ts
import { defineType, defineField } from 'sanity';

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  // Group translation status controls at the top of the form.
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      // Per-language slug: '/blog/benefits-of-hijama' vs '/dk/blog/hijama-fordele'.
      options: {
        source: 'title',
        maxLength: 96,
        // Ensure uniqueness WITHIN a language, not globally.
        isUnique: async (slug, ctx) => {
          const { document, getClient } = ctx;
          const client = getClient({ apiVersion: '2024-01-01' });
          const id = document?._id.replace(/^drafts\./, '');
          const params = {
            draft: `drafts.${id}`,
            published: id,
            slug,
            language: (document as any)?.language,
          };
          const query = `!defined(*[
            !(_id in [$draft, $published]) &&
            slug.current == $slug &&
            language == $language
          ][0]._id)`;
          return client.fetch(query, params);
        },
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'body', title: 'Body', type: 'blockContent' }),
    // Reusable SEO object (see 6.4) — translated per document automatically.
    defineField({ name: 'seo', title: 'SEO & Social', type: 'seo' }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'title', language: 'language', media: 'coverImage' },
    prepare({ title, language, media }) {
      return { title, subtitle: language?.toUpperCase(), media };
    },
  },
});
```

### 6.4 One reusable SEO object (used everywhere)

Because localization is document-level, a single `seo` object type is automatically per-language — **no `seoEn` / `seoDa`**.

```ts
// sanity/schemas/objects/seo.ts
import { defineType, defineField } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO & Social',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: 'metaTitle', type: 'string', title: 'Meta title',
      validation: (r) => r.max(60).warning('Ideally under 60 characters') }),
    defineField({ name: 'metaDescription', type: 'text', rows: 3, title: 'Meta description',
      validation: (r) => r.max(160).warning('Ideally under 160 characters') }),
    defineField({ name: 'ogImage', type: 'image', title: 'Open Graph image' }),
    defineField({ name: 'noIndex', type: 'boolean', title: 'Hide from search engines', initialValue: false }),
    defineField({ name: 'keywords', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
  ],
});
```

### 6.5 Translation status: "Up to date / Needs translation"

Document-level i18n gives you per-language publish out of the box. To surface **✓ Up to date / ⚠ Needs translation**, track when the English source last changed vs. when the Danish translation was last reviewed. Add a lightweight status object to each translatable type (or a shared field via a schema-composition helper):

```ts
// sanity/schemas/objects/translationStatus.ts
import { defineType, defineField } from 'sanity';

export const translationStatus = defineType({
  name: 'translationStatus',
  title: 'Translation status',
  type: 'object',
  // Read-only-ish: set by automation (see 6.7), editors flip "reviewed".
  fields: [
    defineField({
      name: 'state',
      type: 'string',
      title: 'Status',
      options: {
        list: [
          { title: '✓ Up to date', value: 'upToDate' },
          { title: '🟡 AI draft — needs review', value: 'aiDraft' },
          { title: '⚠ Needs translation', value: 'needsTranslation' },
        ],
        layout: 'radio',
      },
      initialValue: 'needsTranslation',
    }),
    // Hash/updatedAt of the English source at the time this translation was approved.
    defineField({ name: 'sourceVersion', type: 'string', hidden: true }),
    defineField({ name: 'lastReviewedAt', type: 'datetime', readOnly: true }),
  ],
});
```

Add `defineField({ name: 'translationStatus', type: 'translationStatus' })` to each translatable document (only meaningful on non-English docs; you can hide it when `language == 'en'` via a `hidden: ({document}) => document?.language === 'en'` callback).

**Badge in the document list** — a custom preview/badge component shows the status inline:

```tsx
// sanity/components/TranslationBadge.tsx
import { useDocumentBadges } from 'sanity';
// Register via document badges API in sanity.config.ts:
//   document: { badges: (prev, ctx) => [...prev, TranslationStatusBadge] }
export function TranslationStatusBadge(props: any) {
  const state = props?.published?.translationStatus?.state ?? props?.draft?.translationStatus?.state;
  if (props?.published?.language === 'en' || !state) return null;
  const map: Record<string, { label: string; tone: 'positive' | 'caution' | 'critical' }> = {
    upToDate: { label: '✓ Up to date', tone: 'positive' },
    aiDraft: { label: '🟡 AI draft — review', tone: 'caution' },
    needsTranslation: { label: '⚠ Needs translation', tone: 'critical' },
  };
  return map[state];
}
```

### 6.6 Desk structure grouped by status (editor UX)

```ts
// sanity/structure/deskStructure.ts
import type { StructureResolver } from 'sanity/structure';

export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Blog posts')
        .child(
          S.list()
            .title('Blog posts by language')
            .items([
              S.listItem().title('🇬🇧 English').child(
                S.documentList().title('English posts')
                  .filter('_type == "post" && language == "en"')),
              S.listItem().title('🇩🇰 Dansk').child(
                S.documentList().title('Danish posts')
                  .filter('_type == "post" && language == "da"')),
              S.divider(),
              S.listItem().title('⚠ Needs translation').child(
                S.documentList().title('Needs translation')
                  .filter('_type == "post" && language == "da" && translationStatus.state == "needsTranslation"')),
              S.listItem().title('🟡 AI drafts to review').child(
                S.documentList().title('AI drafts')
                  .filter('_type == "post" && language == "da" && translationStatus.state == "aiDraft"')),
            ]),
        ),
      // …repeat pattern for products, courses, testimonials, FAQs, policies.
    ]);
```

### 6.7 Auto-create Danish counterpart + flag stale translations

Two behaviours from your spec:

**(a) New English content → auto-create Danish draft.**
The plugin's "Translations" menu creates a linked translation on demand. To make it *automatic*, run a Sanity **content webhook / function** on `create` of an English doc that (1) creates the linked Danish document via the translation-metadata API and (2) sets `translationStatus.state = 'needsTranslation'`. See the AI pipeline in §8 which does both in one step (auto-generates the AI draft too).

**(b) English changes → flag Danish "needs translation."**
A webhook on English-document `update` compares a content hash against the Danish doc's stored `sourceVersion`; if different, it flips the Danish `translationStatus.state` to `needsTranslation` (or re-runs the AI draft). Minimal serverless handler:

```ts
// src/app/api/sanity/on-source-change/route.ts  (Next.js route handler, or a Sanity Function)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import crypto from 'node:crypto';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!, // write token, server-only
  useCdn: false,
});

export async function POST(req: NextRequest) {
  // Verify the Sanity webhook signature here (omitted for brevity — REQUIRED in prod).
  const doc = await req.json();
  if (doc.language !== 'en') return NextResponse.json({ skipped: true });

  const hash = crypto.createHash('sha1')
    .update(JSON.stringify({ t: doc.title, b: doc.body, e: doc.excerpt }))
    .digest('hex');

  // Find linked translations via the metadata document.
  const meta = await client.fetch(
    `*[_type == "translation.metadata" && references($id)][0]{ translations }`,
    { id: doc._id },
  );
  const daRef = meta?.translations?.find((tr: any) => tr._key === 'da')?.value?._ref;
  if (!daRef) return NextResponse.json({ noTranslation: true });

  await client.patch(daRef)
    .set({ 'translationStatus.state': 'needsTranslation', 'translationStatus.sourceVersion': hash })
    .commit();

  return NextResponse.json({ flagged: true });
}
```

> Always verify the Sanity webhook signature (`@sanity/webhook`) before mutating — never trust an unauthenticated POST.

### 6.8 Data layer — locale-parameterised GROQ + fallback

Every query takes the active locale. This is the bridge between `[locale]` routes and Sanity content.

```ts
// src/lib/sanity/queries.ts
import { groq } from 'next-sanity';

// Resolve a post by slug WITHIN a language (translated slugs are independent).
export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug && language == $language][0]{
    _id, title, excerpt, publishedAt,
    "slug": slug.current,
    coverImage, body,
    seo,
    // Sibling translations for hreflang generation:
    "translations": *[_type == "translation.metadata" && references(^._id)][0]
      .translations[].value->{ "lang": language, "slug": slug.current }
  }
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current, language }
`;

export const blogIndexQuery = groq`
  *[_type == "post" && language == $language] | order(publishedAt desc){
    _id, title, excerpt, "slug": slug.current, coverImage, publishedAt
  }
`;
```

```ts
// src/lib/sanity/fetch.ts
import { client } from './client';
import { DEFAULT_LOCALE } from '@/i18n/locales';

/**
 * Locale-aware fetch with graceful fallback:
 * if a Danish document doesn't exist yet, fall back to English content
 * (so the site is never broken during rollout) — configurable per call.
 */
export async function sanityFetch<T>({
  query,
  params = {},
  locale,
  fallbackToDefault = true,
}: {
  query: string;
  params?: Record<string, unknown>;
  locale: string;
  fallbackToDefault?: boolean;
}): Promise<T | null> {
  const primary = await client.fetch<T>(query, { ...params, language: locale });
  if (primary || !fallbackToDefault || locale === DEFAULT_LOCALE) return primary;
  return client.fetch<T>(query, { ...params, language: DEFAULT_LOCALE });
}
```

**Blog post page — one page renders all languages:**

```tsx
// src/app/[locale]/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { sanityFetch } from '@/lib/sanity/fetch';
import { postBySlugQuery, postSlugsQuery } from '@/lib/sanity/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { client } from '@/lib/sanity/client';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const slugs = await client.fetch<{ slug: string; language: string }[]>(postSlugsQuery);
  return slugs.map((s) => ({ locale: s.language, slug: s.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await sanityFetch<any>({ query: postBySlugQuery, params: { slug }, locale, fallbackToDefault: false });
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    ogImage: post.seo?.ogImage,
    noIndex: post.seo?.noIndex,
    // translated slugs → correct hreflang alternates
    alternates: post.translations,
  });
}

export default async function BlogPostPage({
  params,
}: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await sanityFetch<any>({ query: postBySlugQuery, params: { slug }, locale, fallbackToDefault: false });
  if (!post) notFound();
  return (/* …render post… */ null);
}
```

---

## 7. Shopify — multilingual products

Use **Shopify Markets** + the Storefront API `@inContext` directive. Translations (title, description, options, metafields, SEO) are entered in Shopify admin via **Translate & Adapt**; the Storefront API returns them when you pass the language context.

### 7.1 Storefront client with language context

```ts
// src/lib/shopify/client.ts
import { localeById } from '@/i18n/locales';

const endpoint = `https://${process.env.SHOPIFY_STORE_DOMAIN}/api/2024-10/graphql.json`;

export async function shopifyFetch<T>({
  query,
  variables = {},
  locale,
}: {
  query: string;
  variables?: Record<string, unknown>;
  locale: string;
}): Promise<T> {
  const languageCode = localeById(locale).shopify; // 'EN' | 'DA'
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_TOKEN!,
    },
    body: JSON.stringify({ query, variables: { ...variables, language: languageCode } }),
    next: { revalidate: 60 },
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}
```

### 7.2 Query with `@inContext`

```ts
// src/lib/shopify/queries.ts
export const productByHandleQuery = /* GraphQL */ `
  query ProductByHandle($handle: String!, $language: LanguageCode!)
  @inContext(language: $language) {
    product(handle: $handle) {
      id
      title              # localized
      description        # localized
      handle
      seo { title description }   # localized
      options { name values }     # localized
      variants(first: 100) {
        nodes { id title availableForSale price { amount currencyCode } }
      }
      metafields(identifiers: [{ namespace: "custom", key: "benefits" }]) {
        value             # localized if the metafield is translatable
      }
    }
  }
`;
```

### 7.3 Setup checklist (Shopify admin — one-time)

1. **Settings → Markets** → confirm your market(s) and add **Danish** as a published language.
2. Install **Translate & Adapt** (Shopify's free app) → translate products, collections, navigation, checkout, and theme content into Danish (AI-assisted translations available, then human-review).
3. Storefront API version `2024-10+` supports `@inContext(language:)`.
4. **Checkout** localizes automatically from the buyer's market/language context — pass the language when creating the cart (`cartCreate` with `@inContext`), and the hosted checkout renders in Danish.

> Product URLs: keep Shopify handles as your product identifiers and render them under `/dk/shop/[handle]`. If you want fully translated product handles, translate the handle in Translate & Adapt and resolve per-locale exactly as the blog does. Prices/currency come from the market context, not the language.

---

## 8. AI-assisted translation pipeline (recommended)

English is the **single source of truth**. When English content is created or changed, generate a Danish draft with AI, mark it 🟡 *AI draft — needs review*, and let an editor approve in one click. Purpose-built for Prophetic-medicine content: the system prompt **preserves** Qur'anic Arabic, hadith text, transliterations, and defined terminology via a glossary, translating only the surrounding prose.

### 8.1 Translation service (server-only)

Uses the Anthropic Messages API. Pick the current best model from the models list (https://docs.claude.com/en/docs/about-claude/models) and set it in an env var so it's trivially upgradable.

```ts
// src/lib/translation/translate.ts  (server only — never import in a client component)
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

// Domain glossary — terms that must stay consistent or untranslated.
const GLOSSARY = `
- Preserve verbatim (do NOT translate): all Arabic script, Qur'anic verses, hadith
  quotations, and transliterations like "Hijama", "Sunnah", "Ruqyah", "Nabidh".
- Keep brand name "Sunnah Remedies" unchanged.
- "Prophetic Medicine" → "Profetisk medicin".
- Maintain a respectful, precise, luxury-healthcare register (not casual).
`;

export async function translateToDanish(input: {
  title?: string;
  excerpt?: string;
  /** Portable Text or plain text; pass structured JSON to keep formatting */
  bodyJson?: unknown;
}): Promise<{ title?: string; excerpt?: string; bodyJson?: unknown }> {
  const model = process.env.ANTHROPIC_TRANSLATION_MODEL ?? 'claude-sonnet-5';

  const system = `You are a professional EN→DA (Danish) translator specialising in
healthcare and Islamic Prophetic-medicine content. Translate faithfully and idiomatically.
${GLOSSARY}
Return ONLY valid JSON matching the input shape. Do not add commentary.`;

  const msg = await anthropic.messages.create({
    model,
    max_tokens: 4096,
    system,
    messages: [{
      role: 'user',
      content: `Translate the following JSON values from English to Danish, keeping keys and structure identical:\n\n${JSON.stringify(input)}`,
    }],
  });

  const text = msg.content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .join('')
    .replace(/```json|```/g, '')
    .trim();

  try {
    return JSON.parse(text);
  } catch {
    // Never publish garbage: fall back to leaving fields empty → editor writes manually.
    return {};
  }
}
```

### 8.2 Orchestration (webhook on English create/update)

```ts
// src/app/api/sanity/generate-danish-draft/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import { translateToDanish } from '@/lib/translation/translate';

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  // 1. Verify Sanity webhook signature (REQUIRED).
  const en = await req.json();
  if (en.language !== 'en') return NextResponse.json({ skipped: true });

  // 2. Find or create the linked Danish document (via translation.metadata).
  //    (Use @sanity/document-internationalization's metadata pattern, or the
  //     Studio "Translations" action to pre-create; here we assume it exists.)
  const daId = await resolveOrCreateDanishTranslation(en._id); // your helper

  // 3. Generate the AI draft.
  const translated = await translateToDanish({
    title: en.title, excerpt: en.excerpt, bodyJson: en.body,
  });

  // 4. Write as a DRAFT (drafts. prefix) and mark status → aiDraft. Never auto-publish.
  await client
    .createOrReplace({
      _id: `drafts.${daId}`,
      _type: en._type,
      language: 'da',
      title: translated.title,
      excerpt: translated.excerpt,
      body: translated.bodyJson,
      slug: en.slug, // editor adjusts slug to translated form during review
      translationStatus: { state: 'aiDraft' },
    })
    .catch(() => null);

  return NextResponse.json({ ok: true });
}
```

### 8.3 Side-by-side review UI (Studio)

The document-internationalization plugin already shows a **Translations** menu and lets you open EN and DA side-by-side. Combined with the status badge (§6.5), an editor sees:

```
✅ English (current)     🟡 Danish (AI draft — needs review)
```

They read, tweak terminology, adjust the slug (`hijama-fordele`), then **Publish** the Danish document. On publish, a document action sets `translationStatus.state = 'upToDate'` and stamps `sourceVersion` + `lastReviewedAt`.

**Workflow summary:**
```
English created/updated
        ↓  (webhook)
Danish draft auto-generated by AI  →  status: 🟡 aiDraft
        ↓  (editor review, one-click)
Publish Danish  →  status: ✓ upToDate
```

This architecture supports adding Arabic/Dutch/German/French/Urdu/Pashto later **without touching the website** — you add the language to `LOCALES` + Sanity `supportedLanguages`, and the same pipeline generates drafts for the new language.

---

## 9. SEO — hreflang, canonical, alternates, sitemap, JSON-LD

### 9.1 Central metadata builder

```ts
// src/lib/seo/metadata.ts
import type { Metadata } from 'next';
import { LOCALES, localeById, DEFAULT_LOCALE } from '@/i18n/locales';

const SITE = process.env.NEXT_PUBLIC_SITE_URL!; // e.g. https://sunnahremedies.com

/** Build a locale-prefixed absolute URL. en → /path, da → /dk/path */
export function localeUrl(locale: string, path: string) {
  const prefix = localeById(locale).prefix; // '' or '/dk'
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE}${prefix}${clean === '/' ? '' : clean}` || SITE;
}

export function buildMetadata(opts: {
  locale: string;
  path: string;                 // canonical path in EN terms, e.g. '/blog/benefits-of-hijama'
  title?: string;
  description?: string;
  ogImage?: { asset?: { url?: string } } | string;
  noIndex?: boolean;
  /** Per-locale translated slugs, e.g. [{lang:'da', slug:'hijama-fordele'}] */
  alternates?: { lang: string; slug: string }[];
}): Metadata {
  const { locale, path, title, description, ogImage, noIndex, alternates } = opts;

  // hreflang map: each locale → its (possibly translated) URL.
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    const alt = alternates?.find((a) => a.lang === l.id);
    // For dynamic content use the translated slug; for static routes reuse `path`.
    const p = alt ? path.replace(/[^/]+$/, alt.slug) : path;
    languages[l.htmlLang] = localeUrl(l.id, p);
  }
  languages['x-default'] = localeUrl(DEFAULT_LOCALE, path);

  const ogUrl = typeof ogImage === 'string' ? ogImage : ogImage?.asset?.url;

  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical: localeUrl(locale, path),
      languages,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title, description,
      url: localeUrl(locale, path),
      siteName: 'Sunnah Remedies',
      locale: localeById(locale).intl.replace('-', '_'),
      alternateLocale: LOCALES.filter((l) => l.id !== locale).map((l) => l.intl.replace('-', '_')),
      images: ogUrl ? [{ url: ogUrl }] : undefined,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title, description,
      images: ogUrl ? [ogUrl] : undefined,
    },
  };
}
```

> **Duplicate-content protection:** every page emits `canonical` (self, locale-correct) + full `hreflang` set including `x-default` → English. Danish and English are distinct URLs with reciprocal alternates, which is exactly what Google wants.

### 9.2 JSON-LD (localized structured data)

Emit `inLanguage` and localized fields in a `<script type="application/ld+json">` rendered from a Server Component:

```tsx
// src/components/JsonLd.tsx
export function ArticleJsonLd({ locale, post, url }: any) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    inLanguage: locale === 'da' ? 'da-DK' : 'en-GB',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    image: post.coverImage?.asset?.url,
    mainEntityOfPage: url,
    publisher: { '@type': 'Organization', name: 'Sunnah Remedies' },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

### 9.3 Sitemap with alternates

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/locales';
import { localeUrl } from '@/lib/seo/metadata';
import { client } from '@/lib/sanity/client';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes (same segment across locales)
  const staticPaths = ['/', '/shop', '/academy', '/blog', '/about', '/contact'];

  // Dynamic: pull every post per language with its translated slug
  const posts = await client.fetch<{ slug: string; language: string }[]>(
    `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, language }`,
  );

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: localeUrl('en', path),
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [l.htmlLang, localeUrl(l.id, path)]),
        ),
      },
    });
  }

  for (const p of posts) {
    entries.push({
      url: localeUrl(p.language, `/blog/${p.slug}`),
      lastModified: new Date(),
    });
  }

  return entries;
}
```

### 9.4 robots

```ts
// src/app/robots.ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/studio/'] },
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
```

---

## 10. Forms (validation, errors, placeholders, buttons, success, emails)

All strings come from message catalogs; validation messages are keyed and passed to your schema. Example with `zod` + `react-hook-form`:

```tsx
// src/components/ContactForm.tsx
'use client';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export function ContactForm() {
  const t = useTranslations('form');
  const locale = useLocale();

  // Build the schema with translated messages.
  const schema = z.object({
    name: z.string().min(1, t('validation.required')),
    email: z.string().min(1, t('validation.required')).email(t('validation.email')),
    message: z.string().min(10, t('validation.minLength', { min: 10 })),
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values: z.infer<typeof schema>) {
    // Send the locale so the confirmation EMAIL is localized too.
    await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify({ ...values, locale }),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>{t('name')}
        <input {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <span role="alert">{errors.name.message}</span>}
      </label>
      <label>{t('email')}
        <input type="email" placeholder={t('placeholderEmail')} {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <span role="alert">{errors.email.message}</span>}
      </label>
      <label>{t('message')}
        <textarea {...register('message')} aria-invalid={!!errors.message} />
        {errors.message && <span role="alert">{errors.message.message}</span>}
      </label>
      <button disabled={isSubmitting}>{isSubmitting ? t('sending') : t('submit')}</button>
    </form>
  );
}
```

**Localized emails:** email templates accept a `locale` prop and pull strings from the same catalogs (server-side via `getTranslations({ locale, namespace: 'email' })`). One template, all languages:

```tsx
// src/emails/ContactConfirmation.tsx (react-email or your engine)
import { getTranslations } from 'next-intl/server';

export async function renderContactConfirmation(locale: string, name: string) {
  const t = await getTranslations({ locale, namespace: 'email.contact' });
  return `<h1>${t('greeting', { name })}</h1><p>${t('body')}</p>`;
}
```

Add an `email` namespace to `en.json` / `da.json` with `greeting`, `body`, `signoff`, etc.

---

## 11. Search (per-language)

Search only the active language. Whatever engine you use, scope by locale:

- **Sanity-native / GROQ search:** add `&& language == $language` to the query.
- **Algolia / Typesense / Meilisearch:** index a `language` attribute and pass a locale filter (`filters: language = da`), or use one index per language (`posts_en`, `posts_da`). One-index-per-language scales cleanly to future languages.

```ts
// GROQ example
export const searchQuery = groq`
  *[
    (_type == "post" || _type == "productPage" || _type == "knowledgeArticle")
    && language == $language
    && (title match $q + "*" || pt::text(body) match $q + "*")
  ][0...20]{ _type, title, "slug": slug.current }
`;
```

The search page reads `locale` from the route, calls with `{ q, language: locale }`, and results link via the locale-aware `Link`.

---

## 12. Accessibility & performance

**Accessibility (WCAG AA):**
- `<html lang dir>` set from `LOCALES` in `[locale]/layout.tsx` — correct per page.
- Language switcher: `aria-haspopup`, `aria-expanded`, `role="listbox"/"option"`, `aria-selected`, `lang` on each option, Escape + outside-click + focus return.
- Each language option carries its own `lang` attribute so screen readers pronounce "Dansk" in Danish.
- Form errors use `role="alert"` + `aria-invalid`.
- Focus-visible outlines; `prefers-reduced-motion` respected in switcher CSS.

**Performance (Lighthouse 95+):**
- **Server Components by default** — translations resolve on the server; `useTranslations` is only in genuinely interactive Client Components.
- **Static generation** via `generateStaticParams` for every locale × route → no per-request rendering cost.
- **Lazy message loading** — `request.ts` imports only the active locale's JSON; nothing else ships. Split catalogs by namespace if they grow large.
- **No duplicated rendering** — one `[locale]` tree; next-intl rewrites the prefix, it does not re-render per language.
- **No hydration mismatch** — `dir`/`lang` set server-side; `suppressHydrationWarning` only on `<html>`.
- `NextIntlClientProvider` with no `messages` prop only streams messages actually used by Client Components.

---

## 13. Adding a new language in < 5 minutes

The whole point of the architecture. To add **Arabic** (RTL) — or Dutch/German/French/Urdu/Pashto:

1. **`src/i18n/locales.ts`** — add one object to `LOCALES` (`id: 'ar'`, `prefix: '/ar'`, `dir: 'rtl'`, `sanityId: 'ar'`, `shopify: 'AR'`, …). *This alone updates routing, middleware, switcher, hreflang, sitemap, `<html dir>`.*
2. **`src/messages/ar.json`** — copy `en.json`, translate values (or AI-draft it).
3. **Sanity** — add `{ id: 'ar', title: 'العربية' }` to `supportedLanguages` in `sanity.config.ts`.
4. **Shopify** — publish Arabic in Markets, translate in Translate & Adapt.
5. **CSS** — none needed if you used logical properties (`margin-inline-*`, `text-align: start`); RTL flips automatically from `dir`.

No new pages, layouts, components, or schemas. Redeploy.

---

## 14. Testing checklist

**Routing & locale**
- [ ] `/` renders English; `/dk` renders Danish; `/dk/shop`, `/dk/academy`, `/dk/blog` all resolve.
- [ ] Unknown path → 404 (catch-all works with `as-needed`).
- [ ] First visit with `Accept-Language: da` redirects to `/dk`; with `en` stays on `/`.
- [ ] Manual switch sets `NEXT_LOCALE` cookie; cookie then overrides `Accept-Language` on next visit (clear cookie to re-test detection).
- [ ] Switching language on `/dk/blog/hijama-fordele` lands on the correct EN counterpart `/blog/benefits-of-hijama` (not a 404).

**Content**
- [ ] Danish document missing → fallback to English renders (no broken page) where `fallbackToDefault` is on; 404 where it's off (e.g. blog posts).
- [ ] Editing English flips linked Danish to ⚠ Needs translation.
- [ ] Creating English auto-generates 🟡 AI Danish draft; publishing flips to ✓ Up to date.
- [ ] Translated slugs are independent and unique within a language.

**SEO**
- [ ] Every page has self-canonical + full `hreflang` set incl. `x-default`.
- [ ] `sitemap.xml` lists both locales with alternates; `robots.txt` points to it.
- [ ] OG/Twitter tags localized; JSON-LD `inLanguage` correct.
- [ ] Google Search Console → International Targeting shows no hreflang errors.

**Shopify**
- [ ] Danish product title/description/SEO/options returned when `@inContext(language: DA)`.
- [ ] Checkout renders in Danish; correct currency per market.

**UI / forms / search**
- [ ] Nav, footer, breadcrumbs, pagination, filters, cookie banner all switch.
- [ ] Form validation/errors/placeholders/success + confirmation email localized.
- [ ] Search on `/dk` returns only Danish content; `/` only English.

**A11y & perf**
- [ ] `axe`/Lighthouse a11y = 100; keyboard-only switcher works; SR announces language.
- [ ] Lighthouse Performance ≥ 95 on `/` and `/dk` (mobile).
- [ ] No hydration warnings in console.

**Automated (add to CI):**
```ts
// e2e/i18n.spec.ts (Playwright)
test('danish home renders and switches back', async ({ page }) => {
  await page.goto('/dk');
  await expect(page.locator('html')).toHaveAttribute('lang', 'da');
  await page.getByLabel(/skift sprog|change language/i).click();
  await page.getByRole('option', { name: /English/ }).click();
  await expect(page).toHaveURL('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});
```

---

## 15. Migration strategy (phased, zero-downtime)

English URLs **do not change** (`as-needed` keeps them at `/`), so there is no SEO migration risk for existing pages. Roll out in phases behind the scenes:

**Phase 0 — Foundation (no visible change).** Install next-intl; add `i18n/`, `middleware.ts`, `next.config` plugin. Move `app/*` routes under `app/[locale]/`. Add `en.json` and wire existing hard-coded strings to `t()`. English still lives at `/`. Ship. *Nothing user-facing changes.*

**Phase 1 — Sanity multilingual.** Add the plugins; run the migration script to backfill `language: 'en'` on all existing documents and create translation-metadata for them. Add `translationStatus`. Deploy Studio. Editors see English tagged, no Danish yet.

```bash
# One-time backfill (run once against your dataset)
npx sanity migration run set-default-language
```
```ts
// sanity/migrations/set-default-language.ts
import { defineMigration, at, set } from 'sanity/migrate';
export default defineMigration({
  title: 'Set language=en on existing translatable docs',
  documentTypes: ['post','page','productPage','course','testimonial','faq','policy','knowledgeArticle'],
  migrate: {
    document(doc) {
      if (!(doc as any).language) return at('language', set('en'));
    },
  },
});
```

**Phase 2 — Danish content.** Enable `da`. Run AI drafts for priority pages (home, top products, key articles). Editors review + publish. `/dk` exists but is **not yet linked** in the public nav — QA it privately.

**Phase 3 — Shopify Danish.** Publish Danish market/language; translate catalog in Translate & Adapt; verify `@inContext`.

**Phase 4 — Go live.** Add the language switcher to the nav; enable `localeDetection`; submit updated sitemap to Search Console. Monitor.

**Phase 5 — Automate.** Turn on the create/update webhooks so all future content auto-drafts Danish.

---

## 16. Rollback plan

Each phase is independently reversible; nothing here hard-deletes data.

| If this breaks | Rollback |
|---|---|
| Routing/middleware regressions | Revert the deploy. Because English is unprefixed, reverting restores exact prior URLs — no redirect cleanup needed. |
| Don't want Danish public yet | Remove `LanguageSwitcher` from nav **or** set `da`'s `prefix` handling to gate it; set `localeDetection: false` so no one is auto-sent to `/dk`. `/dk` stays crawlable-only if linked. |
| Danish content quality issue | Unpublish the specific Danish document in Sanity (per-language publish) — English is untouched. |
| hreflang/SEO problem | `da` pages carry `noIndex` via the `seo.noIndex` toggle or a temporary global flag in `buildMetadata` until fixed. |
| AI pipeline misbehaving | Disable the webhook endpoint (env flag `TRANSLATION_PIPELINE_ENABLED=false`); editors translate manually. Drafts never auto-publish, so no bad content can reach production. |
| Full abort | Revert to the pre-Phase-0 tag. Sanity `language` fields are harmless if unused. Shopify translations are inert unless a language is published. |

Keep a git tag at each phase (`i18n-phase-0` … `i18n-phase-5`) and a Sanity dataset export before the Phase 1 backfill:
```bash
npx sanity dataset export production ./backups/pre-i18n.tar.gz
```

---

## 17. Editor & developer documentation (runbook)

**For content editors**
- Every translatable document has a language and a **Translations** menu (top of the editor) to jump between EN and DA.
- Status badges: **✓ Up to date**, **🟡 AI draft — review**, **⚠ Needs translation**.
- When you edit English, the Danish version is automatically flagged ⚠ — re-review it.
- New English pages auto-generate a 🟡 Danish AI draft. Open it, check terminology (Arabic/Qur'an/hadith are preserved), fix the slug to its Danish form, then **Publish**.
- English is always the source of truth. Never translate by editing the English document.

**For developers**
- Add a language: edit `src/i18n/locales.ts` (+ `messages/<id>.json`, Sanity `supportedLanguages`, Shopify). Nothing else.
- Always import navigation from `@/i18n/navigation`, never `next/link`/`next/navigation`, for localized links.
- Always use `t()` from next-intl for user-facing strings — no hard-coded copy in components.
- Server Components: `getTranslations` + `setRequestLocale(locale)`. Client Components: `useTranslations`.
- CMS queries always pass `language`; use `sanityFetch` for automatic fallback behaviour.
- Shopify queries always pass `@inContext(language:)`.
- Use CSS logical properties everywhere so RTL languages work with zero extra CSS.

**Environment variables**
```
NEXT_PUBLIC_SITE_URL=https://sunnahremedies.com
SANITY_PROJECT_ID=…
SANITY_DATASET=production
SANITY_WRITE_TOKEN=…            # server only
SHOPIFY_STORE_DOMAIN=…
SHOPIFY_STOREFRONT_TOKEN=…
ANTHROPIC_API_KEY=…             # server only, translation pipeline
ANTHROPIC_TRANSLATION_MODEL=claude-sonnet-5
TRANSLATION_PIPELINE_ENABLED=true
```

---

## 18. Deliverables index (for Cursor)

**Create:** `src/i18n/locales.ts`, `routing.ts`, `navigation.ts`, `request.ts`; `src/middleware.ts`; `src/messages/en.json`, `da.json`; `src/global.d.ts`; `src/app/[locale]/layout.tsx`; `src/app/[...rest]/page.tsx`; `src/app/sitemap.ts`, `robots.ts`; `src/components/LanguageSwitcher.tsx`; `src/lib/sanity/queries.ts`, `fetch.ts`; `src/lib/shopify/client.ts`, `queries.ts`; `src/lib/seo/metadata.ts`; `src/lib/translation/translate.ts`; `src/app/api/sanity/on-source-change/route.ts`, `generate-danish-draft/route.ts`; `sanity/schemas/objects/seo.ts`, `translationStatus.ts`; `sanity/structure/deskStructure.ts`; `sanity/components/TranslationBadge.tsx`; `sanity/migrations/set-default-language.ts`; `e2e/i18n.spec.ts`.

**Modify:** `next.config.mjs` (plugin); move all `app/*` routes into `app/[locale]/`; `sanity.config.ts` (plugins + desk structure); each translatable schema (translatable slug `isUnique`, add `seo` + `translationStatus`); root `app/layout.tsx`; nav/header (mount `LanguageSwitcher`); every component with hard-coded copy (→ `t()`); every data fetch (→ pass `locale`/`language`).

---

*End of implementation guide. This is production-grade, scales to unlimited languages, and adds a new language via one config object + one message file. English remains the single source of truth; Danish (and future languages) flow through AI-draft → human-review → publish.*
