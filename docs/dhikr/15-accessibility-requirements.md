# 15 — Accessibility Requirements

No existing accessibility-requirements document was found repo-wide for this feature to extend (see [00-existing-system-audit.md](00-existing-system-audit.md) — accessibility mentions found elsewhere are incidental references inside design/photography manuals and phase specs, not a dedicated a11y spec). This document is therefore fully new, scoped to Dhikr-specific surfaces only; it does not restate general site-wide accessibility practice.

## Arabic / RTL / screen reader

- Arabic text blocks require `lang="ar"` at the element level so assistive technology applies correct pronunciation rules, distinct from the page's outer `lang` attribute (see [09-arabic-content-presentation.md](09-arabic-content-presentation.md)).
- Text must be real, selectable Unicode — never an image of text — both for screen-reader access and zoom/reflow support.
- Direction (`dir="rtl"`) must be scoped to the Arabic block only, so surrounding EN/DA UI chrome and its own screen-reader reading order are unaffected.

## Repeat counter (see 07)

- Counter increment must be reachable and operable via keyboard alone (not pointer-only), with a clear focus indicator.
- Counter state changes must be announced to screen readers (e.g. via an ARIA live region) since a visitor reciting with eyes closed relies on audible/announced feedback, not just visual count changes.
- Reset requires an explicit, separately-focusable confirmation control — never a single accidental keypress away from the increment control.

## Memorisation toggle (see 08)

- Progress-state toggle (not started / learning / memorised) must expose its current state to assistive tech (not colour-only signalling).
- The "My Progress" list must be navigable by heading/landmark structure, not a flat unlabelled list.

## Audio control (see 10)

- Playback controls must be fully keyboard-operable (play/pause/seek), with visible focus states.
- Controls must carry accessible labels distinguishing them from any other audio on the page (e.g. "Play recitation," not just "Play").
- Audio must never autoplay; playback starts only on explicit visitor interaction (see [10-audio-review-and-delivery.md](10-audio-review-and-delivery.md)) — unexpected sound is a known accessibility harm, particularly for screen-reader users.

## Reading layout (see 06)

- Toggling transliteration/translation visibility must not trap focus or require a screen-reader user to re-navigate the whole page to find the toggle.
- Sequential next/previous controls must be clearly labelled with the destination context (e.g. which item comes next), not generic "Next" with no context for screen-reader users navigating out of visual order.

## Explicit non-goals

- Does not define colour-contrast values — those are governed by existing design tokens/manuals, not restated here.
- Does not specify a testing tool (see [17-test-and-validation-plan.md](17-test-and-validation-plan.md) for how these requirements get verified).
