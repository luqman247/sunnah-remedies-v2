# 07 — Repeat Counter Specification

## Scope restriction

This document specifies a **generic counting mechanism** — increment, reset, and persistence behaviour. It assigns **no repetition count to any specific dhikr**. Where a traditional count exists for a given item, that value is a scholarly-review output that lands in the `recommendedRepetitions` field defined in [04-dhikr-content-schema.md](04-dhikr-content-schema.md) — never in this document.

## Mechanism

- A tap/click/keypress increments a per-item counter, starting at zero, with no upper bound enforced by the mechanism itself.
- If an item's `recommendedRepetitions` field is populated (post scholarly-review, not by this architecture), the UI may display it as a *reference target* — e.g. "X of [target]" — but reaching the target does not lock or disable further counting. The mechanism never hard-stops a visitor.
- If `recommendedRepetitions` is empty (the default state for all items in this architecture phase), the counter displays a plain running count with no target.
- Reset is a single, explicit, undo-safe action (a confirmation step, not a silent reset) — resetting a count in the middle of recitation is a costly mistake for a user to make by accident.

## Persistence

- Counter state is local to the device (see [16-privacy-and-local-storage-policy.md](16-privacy-and-local-storage-policy.md)) — no account, no server round-trip required for core counting.
- Counter state resets per reading session by default; whether it persists across sessions (e.g. "today's count") is an open product decision, not assumed here — logged in [21-decision-log.md](21-decision-log.md).

## Accessibility touchpoints (detailed fully in 15)

- Counter must be operable via keyboard and screen-reader without relying on precise tap targets alone.
- Increment action should have a non-visual (audible/haptic-optional) confirmation path, since a visitor may be reciting with eyes closed.

## Explicit non-goals

- No leaderboard, streak-shaming, or social comparison of counts.
- No gamification badges tied to count milestones.
- No count value is asserted for any specific dhikr in this document or anywhere else in this architecture pack.
