# Accessibility Checklist

| Requirement | Implementation | Status |
|---|---|---|
| Correct RTL + `lang="ar"` | `ArabicText.tsx` — `dir="rtl" lang="ar"` on every Arabic block | ✅ |
| No truncation of Arabic | `.dua-dhikr-arabic` has no `overflow`/`-webkit-line-clamp`; `white-space: normal` | ✅ |
| Generous line-height | `line-height: 2.1` (`2.2` in memorise mode) | ✅ |
| Arabic font scaling without layout breakage | `clamp()`-based font-size, flex/grid layouts, no fixed heights on Arabic containers | ✅ |
| Keyboard navigation | All interactive controls are native `<button>`/`<a>`/`<input>`/`<details>` — no custom click-only divs | ✅ |
| Visible focus states | `:focus-visible` with a 2–3px `--brass` outline on every link, button, and input across `dua-dhikr.css` | ✅ |
| Semantic headings | `h1` (sr-only page title) → `h2` per section → `h3` per parent group, one skip in the hierarchy avoided throughout | ✅ |
| Accessible accordions | Native `<details>`/`<summary>` for Virtue/Explanation/References — no custom ARIA disclosure needed | ✅ |
| Accessible audio controls | Native `<audio controls>`, `aria-label` naming the entry, hidden entirely (not just visually) when no asset exists, never autoplays | ✅ |
| Sufficient colour contrast | Reuses existing repository tokens (`--sage-deep` on `--paper`, `--ink` on `--paper`) already relied on elsewhere in the Knowledge Library | ✅ (inherited) |
| Reduced-motion support | Card hover-lift wrapped in `@media (prefers-reduced-motion: no-preference)`; no other motion exists | ✅ |
| Screen-reader labels for icons | `DuaDhikrIcon` is `aria-hidden` by default (adjacent text always names the concept); accepts `title` + `role="img"` for standalone use | ✅ |
| Decorative icons marked as such | Same as above — default `aria-hidden="true"` | ✅ |
| Touch targets ≥44px | `min-height: 44px` on `.dua-dhikr-entry-card__action`, `.dua-dhikr-discovery-link`, `.dua-dhikr-search__input`, `.dua-dhikr-search__result` | ✅ |
| No text in inaccessible images | No raster images used anywhere in this feature — icons are inline SVG, text is real text | ✅ |
| No reliance on colour alone | Pending-review state uses an icon-free text badge (`"Scholarly review pending"`), not colour coding | ✅ |
| Live regions for dynamic content | Search results use `role="status" aria-live="polite"`; in-collection entry count uses `role="status"` | ✅ |
| Locale-aware `lang` on translated text | `lang={locale}` on translation/virtue/explanation paragraphs in `DuaDhikrEntryCard` | ✅ |

## Manual verification (browser pane)

Performed as part of this change — see `docs/dua-dhikr/QA_REPORT.md` for
screenshots and the specific viewport widths and interactions checked
(320px, 375px, 768px, 1024px, desktop; keyboard-only navigation through
search, filters, memorise mode, and the toolbar; RTL rendering of the
Arabic block).
