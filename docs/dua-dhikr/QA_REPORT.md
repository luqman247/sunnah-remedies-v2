# QA Report

Reflects what was actually run and observed on `feature/dua-dhikr-library`, not what was intended.

## Scope

Everything below concerns the Duʿā & Dhikr expansion. Morning/Evening Dhikr
code paths were not modified; their existing test suite was re-run to
confirm no regression.

## Type checking

`npx tsc --noEmit` — clean except one pre-existing failure unrelated to
this work: `tests/auth/staff-credentials.test.ts` (TS2393, "Duplicate
function implementation"), confirmed present even with every Duʿā & Dhikr
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
`/knowledge-library/dua-dhikr` with the label "Duʿā & Dhikr", reflecting
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
