# Visual System

## Design tokens

Duʿa & Dhikr uses the repository's existing tokens exclusively — no new
colours, fonts, or radii were introduced.

| Token | Value | Use |
|---|---|---|
| `--sage-deep` | `#232A1E` (emerald) | Headings, Arabic text, active states |
| `--brass` | `#9A7B4F` (light) / `#c7a25a` (dark) | Icons, eyebrows, hover/focus accents |
| `--paper` | `#ECE6D8` (ivory) | Card backgrounds |
| `--font-display` | — | Collection card titles |
| `--font-arabic` | — | `.type-arabic` (Arabic text blocks) |
| `--font-utility` | — | Badges, labels, toolbar buttons |
| `--radius` | `2px` | Every card/button — deliberately near-flat, not rounded |
| `--hairline` | 1px mixed-ink border | Card borders, dividers |
| `--space-1`…`--space-20` | 4px–160px | All new spacing in this feature |

**Spacing scale decision**: the audit found two coexisting spacing scales
in the repository (`--s1..--s8` legacy, `--space-1..--space-20` 8px-base).
All new Duʿa & Dhikr CSS
(`src/components/dua-dhikr/dua-dhikr.css`,
`src/app/[locale]/knowledge-library/dua-dhikr/dua-dhikr-landing.css`) uses
`--space-*` exclusively. The reused `DhikrTimeNavigation` component keeps
its own existing `--s*`-based stylesheet unchanged.

## Icon system

`src/components/dua-dhikr/icons.tsx` — one `DuaDhikrIcon` component, one
shared 24×24 viewBox, 1.5px stroke, round joins/caps, `currentColor` (never
a hardcoded fill), decorative (`aria-hidden`) by default since every icon
sits beside a text title that already names the concept.

Every icon is an original line drawing built from simple geometric,
architectural, or natural motifs (a prayer mat's woven lines, a crescent
and bedding shape, a plate and cup, a doorway, a water droplet, wind lines,
a Kaʿbah-inspired outline, etc.) — **no** depiction of Prophets,
Companions, angels, or sacred personalities, and no stock icon pack.

35 keys are defined (`src/lib/dua-dhikr/taxonomy.ts`, `ICON_KEYS`), one per
canonical collection plus a `leaf` fallback. Swapping or refining an
individual icon is a one-line change to the `PATHS` map — no consumer
needs to change.

### Icon-selection principles (for adding future icons)

When a new canonical collection needs an icon, choose or draw one that
follows all of these — enforced where testable by
`tests/dua-dhikr/dua-dhikr-icon-consistency.test.ts`:

1. **One shared wrapper, never per-icon styling.** Add only geometry
   (`<path>`, `<circle>`, `<rect>`, `<ellipse>` with `d`/`cx`/`cy`/`r`/etc.)
   to the `PATHS` map. Never set `fill`, `stroke`, `strokeWidth`, or
   `style` on an individual shape — colour, weight, and caps come from the
   shared `<svg>` wrapper in `DuaDhikrIcon` alone. This is what guarantees
   every icon reads as one family, not a per-icon judgement call.
2. **Geometric, architectural, or natural motifs only.** A prayer mat's
   woven lines, a crescent, a plate and cup, a doorway, a water droplet,
   wind lines, a Kaʿbah-inspired outline. Never a depiction of a Prophet,
   Companion, angel, or other sacred personality, and never a stock icon
   pack or emoji.
3. **Recognition, not decoration.** The icon should help a reader
   recognise the collection at a glance alongside its text label — if a
   shape doesn't clearly evoke the concept, prefer a more literal motif
   over an abstract one.
4. **Optically balanced at 20–28px.** Test the icon at the sizes actually
   used in the UI (20px in search results, 24px on cards, ~36–40px in a
   collection hero) — a shape that reads clearly as a large illustration
   but collapses into a blob at 20px needs simplifying, not more detail.
5. **No new icon key without a consumer.** Every key in `ICON_KEYS` must
   be assigned to at least one collection in `CANONICAL_COLLECTIONS` (test-
   enforced) — don't pre-add speculative icons.
6. **Never copy Life With Allah's (or any other site's) artwork, icon
   pack, or exact visual treatment.** That site is a UX/IA reference only,
   per docs/dua-dhikr/README.md.

## Cards

- **`DuaDhikrCollectionCard`** — icon, title, description, entry count
  (`"{count} entries"` or `"Preparing for publication"` when zero),
  subcategory labels. Server component; hover lifts 2px
  (`prefers-reduced-motion: no-preference` guarded) and brightens the
  border to `--brass`; focus-visible gets a 3px brass outline.
- **`DuaDhikrEntryCard`** — see [CONTENT_MODEL.md](CONTENT_MODEL.md) for the
  full reading hierarchy and memorise-mode behaviour.

## Reading hierarchy (entry card)

1. What this is for (small, muted, utility font)
2. **Arabic** (`ArabicText` — `dir="rtl" lang="ar"`, `.type-arabic`, 2.1
   line-height, no truncation, never behind an accordion)
3. Translation (locale-aware)
4. Transliteration (visually secondary — smaller, italic, muted)
5. Timing/repetition badges
6. Virtue, Explanation, References — each in its own `<details>`/`<summary>`
   (native, keyboard-operable, no custom JS disclosure widget needed)
7. Source citation line
8. Optional audio (hidden entirely when no asset is set; never autoplays)
9. Toolbar: Memorise mode, mark as learning/memorised, share

## Focus mode vs. memorisation mode

These are two unrelated features that happen to sit near each other in the
UI and must not be conflated:

- **Focus mode** (the sitewide "Day / Focus / Evening" reading-mode
  selector, top-right of every Knowledge Library page) is a broader,
  pre-existing site feature (`src/components/ui/ReadingModeSelector.tsx`)
  that changes reading theme/contrast across the *entire* site. Duʿa &
  Dhikr did not build it and does not modify it.
- **Memorise mode** (the toolbar button on `DuaDhikrEntryCard`) is a
  Duʿa & Dhikr-specific learning feature: it enlarges the Arabic text and
  progressively hides/reveals the translation and transliteration behind
  explicit "Show translation" / "Show transliteration" actions, and lets a
  reader mark an entry as "learning" or "memorised" — state stored only in
  `src/lib/dua-dhikr/local-storage.ts` (device-local, no account). See
  [CONTENT_MODEL.md](CONTENT_MODEL.md) for the full reading hierarchy.

A reader can be in sitewide Focus mode and Duʿa-specific memorise mode
at the same time — they are independent, composable states.

## Empty states

Reuses the exact pattern already established by the Evening Dhikr page: a
neutral heading + one sentence, inside a bordered block
(`.dua-dhikr-empty-state`) — never a fabricated entry, never a "coming
soon" illustration.

## Motion

Only two transitions exist in the whole system: a card hover lift (translateY,
guarded by `prefers-reduced-motion`) and colour transitions on hover/focus
(180ms ease). No page-load animation, no scroll-triggered reveal, no
autoplay of any kind.
