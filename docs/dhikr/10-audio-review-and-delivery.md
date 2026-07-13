# 10 — Audio Review & Delivery

## Scope

This document specifies the **pipeline** for recitation audio — how it would be recorded, reviewed, and delivered — not any actual audio asset, reciter selection, or licensing agreement. It follows the existing `audio-asset` Sanity schema pattern (`src/sanity/schemas/documents/global/audio-asset.ts`, see [00-existing-system-audit.md](00-existing-system-audit.md)) rather than proposing a new asset model.

## Pipeline stages

1. **Sourcing** — a reciter (or licensed existing recording) is identified per `dhikrItem`. Licensing terms must be confirmed and recorded before use; this architecture does not pre-select a reciter or license.
2. **Scholarly review** — recitation accuracy (correct text, correct tajweed where applicable) is confirmed by the same scholarly-reviewer role defined in [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md), independent of the text-accuracy review — audio and text are reviewed as separate concerns since an error can exist in either without the other.
3. **Technical QA** — audio quality (levels, noise floor, file format) checked before publish; this is an engineering/editorial concern, not a scholarly one.
4. **Attach to item** — approved audio is linked to its `dhikrItem` via the `audioAsset` reference field ([04-dhikr-content-schema.md](04-dhikr-content-schema.md)).
5. **Publish** — audio only goes live once its parent item's `reviewStatus` is `approved` or later; an item's audio cannot outpace the text-review gate.

## Delivery

- Audio is optional per item — the reader experience ([06](06-reader-experience-specification.md)) must degrade gracefully with no audio control shown when none exists, not a broken/disabled control.
- Audio never autoplays on page load, navigation, or item change — playback starts only from an explicit visitor action. This is a hard requirement, not a preference (see [15-accessibility-requirements.md](15-accessibility-requirements.md)).
- Delivery mechanism (CDN, hosting) follows whatever pattern the existing `audio-asset` schema already implies — this document does not propose a new hosting system.
- Playback controls must meet the accessibility requirements in [15-accessibility-requirements.md](15-accessibility-requirements.md) (keyboard-operable, captioned/labelled for screen readers).

## Explicit non-goals

- No reciter is named, selected, or contracted by this document.
- No licensing terms are decided here.
- No audio file is created, uploaded, or referenced by real ID.
