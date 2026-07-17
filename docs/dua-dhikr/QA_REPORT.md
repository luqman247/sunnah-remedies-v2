# QA Report

Reflects what was actually run and observed, not what was intended.

## Reconciliation with production `main` (this pass)

Branch `feature/dua-dhikr-library-architecture`, starting commit `0bce753`,
merged `origin/main` (`3a3715e`, bringing in the completed Evening Dhikr
production implementation) via `git merge` — **zero conflicts**; the only
files touched by both sides (`src/messages/en.json`, `da.json`) had their
edits in disjoint regions and auto-merged cleanly. A local, unpushed backup
branch `backup/dua-dhikr-architecture-pre-main-sync` was created at
`0bce753` before merging.

- **Naming standardisation**: every occurrence of `Duʿā` (capital, project
  name) and generic-word `duʿā` (lowercase, "supplication") was normalised
  to `Duʿa`/`duʿa` (107 + 28 replacements across 36+ files) per the updated
  official name, **Sunnah Remedies Duʿa & Dhikr Library**. Zero remaining
  occurrences of `Duʿā`, bare `Dua &`, or reversed `Dhikr & Duʿa` ordering
  (`rg` verified). No TypeScript identifiers, schema names, route slugs, or
  file paths were renamed — only visible strings and prose.
- **Typecheck**: `npx tsc --noEmit` → **exit 0**, clean, after the merge and
  naming pass.
- **Tests**: `tests/dua-dhikr/*` 7/7 pass. `tests/dhikr/*` **29/30** pass —
  one pre-existing failure (`dhikr-morning-page-visual-safety.test.ts`)
  confirmed present with byte-identical file content on `origin/main`
  itself (not introduced by this branch or the merge). Publication,
  reference-projection, navigation, and schema/review-bypass tests all
  re-run and pass explicitly.
- **Production build**: `npm run build` → exit 0, both Duʿa & Dhikr routes
  present in the manifest.
- **Browser verification**: see "Reconciliation browser verification"
  below — a `next dev`/Turbopack-only artifact caused bare unprefixed
  routes (including the unrelated site root `/`) to 404 in dev mode; the
  production server (`next start`) served every route correctly, so this
  was an environment quirk, not a code defect (confirmed via zero diff
  against `origin/main` in `middleware.ts`/`src/i18n/*`).

### Reconciliation browser verification

Run against the production build (`next start --port 3200`), since the
dev-server artifact above made it the more reliable signal:

- **English**: bare `/`, `/knowledge-library`, `/knowledge-library/
  dua-dhikr` (landing), `/knowledge/dhikr/morning` and `/evening`
  (production, real content — 2/30 and 2/16 entries editorially reviewed
  respectively, rendering Arabic/translation/virtue/source correctly),
  `/knowledge-library/dua-dhikr/home` (empty-state collection with
  subcategory filters), `/knowledge-library/dua-dhikr/hajj-and-umrah`
  (subcategory filters "Ḥajj"/"ʿUmrah"), and the legacy
  `/knowledge-library/dhikr` → `/knowledge-library/dua-dhikr` redirect
  (308, confirmed via `curl -I` and in-browser) — all correct.
- **Danish**: confirmed the actual convention first (`src/i18n/locales.ts`,
  `da.prefix === "/dk"` — not assumed). `/dk/knowledge-library/dua-dhikr`,
  `/dk/knowledge/dhikr/morning`, `/dk/knowledge/dhikr/evening`, `/dk/
  knowledge-library/dua-dhikr/home` all render fully translated UI chrome
  (nav, breadcrumb-adjacent labels, search placeholder, filter labels,
  empty-state copy). Collection titles/descriptions without an authored
  Danish override in Sanity fall back to the English taxonomy default
  (e.g. "Home" stayed English) — this is the existing, documented
  Morning/Evening Dhikr fallback pattern (dual `*En`/`*Da` fields, no
  Danish → English fallback for message *keys*, but content fields do
  fall back), not a silent/undocumented gap.
- **Viewports**: 375px (mobile — nav collapses to hamburger, no overflow),
  768px (tablet — found a **pre-existing, sitewide** ~63px horizontal
  overflow in the header's `.masthead__actions` cluster, reproduced
  identically on an unrelated page (`/the-apothecary`) with zero diff in
  the header component vs `origin/main` — not introduced by this branch),
  1024px and 1440px (desktop — no overflow).
- **Console/hydration**: no hydration errors, no application errors on any
  Duʿa & Dhikr page. One pre-existing, sitewide React key-collision warning
  ("`/charter`") reproduces on every page including ones this project never
  touched.
- **No redirect loops**: confirmed — `morning-dhikr`/`evening-dhikr`
  collection slugs `redirect()` once to the real production routes, which
  do not themselves redirect anywhere.

## Original architecture-phase report (pre-reconciliation)

The section below was written before the `main` merge and naming pass, on
the original isolated architecture branch. Kept as the historical record of
that phase; superseded where it conflicts with the reconciliation section
above.

Everything below concerns the Duʿa & Dhikr expansion. Morning/Evening Dhikr
code paths were not modified; their existing test suite was re-run to
confirm no regression.

## Type checking

`npx tsc --noEmit` — clean except one pre-existing failure unrelated to
this work: `tests/auth/staff-credentials.test.ts` (TS2393, "Duplicate
function implementation"), confirmed present even with every Duʿa & Dhikr
change stashed out of the tree (`git stash push -u` + re-run). Not touched
by this branch.

Two real issues were found and fixed during typecheck:
- `DuaDhikrCollectionPublic` was missing a `descriptionDa` field referenced
  by the collection page/card — added to `CanonicalCollection` and merged
  in from the optional Sanity document in `getDuaDhikrCollectionsPublic()`.
- `tests/dua-dhikr/dua-dhikr-local-storage.test.ts` had no top-level
  import, so its `assert`/`runAll` collided (TS2393) with
  `tests/auth/staff-credentials.test.ts` under whole-program `tsc`
  (both were "global script" files) — fixed by adding `export {}`.

## Linting

No ESLint config exists anywhere in this repository (pre-existing — `next
lint` was removed in Next.js 16 and no `eslint.config.*` was ever added).
Nothing to run; not something this branch could reasonably add out of
scope.

## Unit/integration tests

`tests/dua-dhikr/` — 7 new files, all passing:
- `dua-dhikr-taxonomy-and-aliases.test.ts`
- `dua-dhikr-schema-and-review-bypass.test.ts`
- `dua-dhikr-public-fetch-safety.test.ts`
- `dua-dhikr-routes-and-locale.test.ts`
- `dua-dhikr-components-and-accessibility.test.ts`
- `dua-dhikr-import-pipeline.test.ts`
- `dua-dhikr-local-storage.test.ts`

Several real bugs were caught and fixed by these tests before this report
was written: missing alias entries (`before wudu`/`after wudu`/`hajj &
umrah` did not resolve until added to `taxonomy.ts`), and an unsafe
`createOrReplace` in the import script that would have silently reset a
human reviewer's `reviewStatus`/`boardApprovals` on re-import — replaced
with the `createIfNotExists` + `.patch().set()` pattern already
established by `src/lib/dhikr-research/import/import-approved-records.ts`.

`tests/dhikr/` (existing suite, re-run in full): **28/30 pass.** Two
pre-existing failures, confirmed (by file mtime, predating this session)
unrelated to this branch:
- `dhikr-mdr-review-workbench.test.ts` — times out starting a live dev
  server; environment-dependent, not touched by this branch.
- `dhikr-morning-page-visual-safety.test.ts` — fails against an in-progress,
  uncommitted refactor of `MorningDhikrCollection.tsx` into
  `PendingReferenceCard.tsx`/`ReviewedDhikrCard.tsx` that already existed,
  incomplete, in the working tree before this session began.

One existing test was intentionally updated, not just left to fail:
`tests/dhikr/dhikr-landing-page.test.ts`'s
`testKnowledgeLibrarySectionsPointsToDhikrLanding` asserted the sidebar
pointed at `/knowledge-library/dhikr` — updated to assert
`/knowledge-library/dua-dhikr` with the label "Duʿa & Dhikr", reflecting
the deliberate, documented navigation change in
[INFORMATION_ARCHITECTURE.md](INFORMATION_ARCHITECTURE.md).

## Production build

`npm run build` — succeeded. Both new routes compile and appear in the
route manifest:
```
├ ƒ /[locale]/knowledge-library/dua-dhikr
├ ƒ /[locale]/knowledge-library/dua-dhikr/[collectionSlug]
```
(Server-rendered on demand rather than statically prerendered — expected,
since both fetch live Sanity data; `generateStaticParams` still enumerates
every canonical collection slug so every route is known to Next.js ahead
of time.)

## Browser verification

Dev server run on port 3100 (port 3000 was occupied by an unrelated
third-party app already running on this machine — verified before use and
avoided). Verified in a real browser:

- **Landing page** (`/en/knowledge-library/dua-dhikr`): hero with title,
  lede, embedded `DhikrTimeNavigation` (Morning/Evening links unchanged),
  search box; Quick Access grid (9 cards matching the spec's example list);
  Browse by Occasion with all 7 parent groups and every collection, correct
  diacritics (Ṣalawāt, Īmān, Ḥajj, ʿUmrah, Ramaḍān, Janāzah, Dhūl Ḥijjah);
  subcategory labels on Home/Travel/Lavatory & Wuḍūʾ/Ḥajj & ʿUmrah cards;
  Guided Discovery with all 7 occasion links correctly targeted; Learning
  section rendering all 8 guide titles as inert (non-clickable) placeholder
  text with the "not yet available" notice; Continue Reading section
  correctly renders nothing (not even its own heading) with no visit
  history.
- **Icons**: all rendered as distinct, original line-icon SVGs in brass/
  emerald tones — sunrise, moon+bedding, prayer mat, plate+cup, doorway,
  journey path, shield, etc. — confirmed visually, not just via markup.
- **Collection page** (`/en/knowledge-library/dua-dhikr/home`): breadcrumb,
  icon, parent-group eyebrow, description, subcategory filters ("All /
  Entering Home / Leaving Home"), in-collection search, honest "Preparing
  for publication" empty state (no fabricated content), Previous/Next
  navigation to sibling collections in the same parent group ("← Food &
  Drink" / "Clothes →").
- **Umbrella collection** (`/en/knowledge-library/dua-dhikr/marriage-and-
  children`): "Related collections" correctly rendered Parents/Children/
  Newborn/Marriage as four distinct cards — confirmed no duplicated
  content, matching the documented umbrella pattern.
- **Redirects**: `/knowledge-library/dua-dhikr/morning-dhikr` correctly
  redirected to `/knowledge/dhikr/morning` (confirmed via
  `window.location.href` after navigation) rather than rendering a second
  page.
- **Keyboard navigation**: tabbing through the landing page lands focus on
  interactive controls with a visible solid brass (`rgb(154,123,79)`)
  outline.
- **Mobile (375px)**: nav collapses to a hamburger, the Morning/Evening
  hero stacks vertically with its existing responsive divider, search box
  goes full-width, breadcrumb wraps — no horizontal overflow, all text
  legible.
- **Danish locale**: could not be verified in this preview environment —
  `/dk` (bare locale root) and the pre-existing, unmodified `/dk/knowledge/
  dhikr/morning` both 404 on this dev server instance, so this is a
  pre-existing environment limitation, not a regression from this branch.
  The underlying locale configuration and full en/da message-key parity
  were verified instead via `dua-dhikr-routes-and-locale.test.ts`.
- **Cookie consent, reading-mode selector (Day/Focus/Evening)**: both
  pre-existing sitewide features, confirmed still functional alongside the
  new page.

Not exercised (no real content exists to click through yet, by design —
see [SOURCE_POLICY.md](SOURCE_POLICY.md)): the entry-card memorise-mode
toggle, expandable virtue/explanation/references sections, and audio
control were verified via static source/accessibility tests
(`dua-dhikr-components-and-accessibility.test.ts`) rather than live
interaction, since no `duaDhikrEntry` document exists in this Sanity
dataset to render one.

## Pre-existing issues found but not introduced by this branch

- `console.error`: "Encountered two children with the same key... /charter"
  — a duplicate-key warning from an unrelated footer/nav list, reproduces
  on every page including ones this branch never touched.
- No ESLint configuration anywhere in the repository.
- Two failing tests in `tests/dhikr/` (see above), both predating this
  session (confirmed by file modification time).
