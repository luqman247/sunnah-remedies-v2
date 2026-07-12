# 06 — Reader Experience Specification

## Intent

The reading experience should feel calm and unhurried, consistent with the existing design manual's tone (see [00](00-existing-system-audit.md)), not app-like or gamified. This document specifies layout and interaction structure — no visual design tokens are invented; existing tokens (`src/lib/tokens.ts`, `motionTokens.ts`) and the design manual govern actual styling.

## Reading modes

1. **Category browse** — scrollable list of items in a category, each showing title + short preview (no full Arabic text at this level, to keep the list scannable).
2. **Focused reader** — single item, full view: Arabic text, transliteration, translation, source-attribution link, optional audio control, optional counter (see [07](07-repeat-counter-specification.md)).
3. **Sequential flow** — from focused reader, next/previous moves through the category in `order`, without returning to the list each time (mirrors a "session" reading pattern).

## Layout structure (focused reader)

- Arabic text is the visual primary element (largest, top or most prominent position depending on RTL handling — see [09](09-arabic-content-presentation.md)).
- Transliteration and translation are secondary, togglable independently (a visitor reciting from memory may want Arabic only; a learner may want all three).
- Source-attribution link is present but unobtrusive — a small, consistent affordance, not a modal interrupting reading.
- Counter (if enabled for that item) sits near the Arabic text, not competing with it for primary visual weight.

## Session behaviour

- No forced onboarding, tutorial, or modal before reading — a visitor should reach Arabic text within one click of entering a category.
- Toggling transliteration/translation visibility persists locally for the session (not server-tracked), consistent with the local-only posture in [16](16-privacy-and-local-storage-policy.md).
- Sequential flow position is not persisted across sessions unless the visitor has interacted with the memorisation system ([08](08-memorisation-system.md)), to avoid conflating "browsing" with "tracked progress."

## What this document does not specify

- Exact pixel/spacing values — governed by existing design tokens and manuals, not restated here.
- Component implementation — see [11-route-and-component-map.md](11-route-and-component-map.md) for which existing components this composes.
- Counter mechanics — see [07](07-repeat-counter-specification.md).
