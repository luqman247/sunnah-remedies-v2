# 08 — Memorisation System

## Intent

Let a visitor privately track which dhikr items they've memorised or are learning, without turning the feature into a quiz app or requiring an account. This is a lightweight progress tracker, not a spaced-repetition algorithm with scheduling notifications — that level of complexity is explicitly out of scope for v1.

## Progress states, per item

- **Not started** (default, no marking).
- **Learning** — visitor has flagged this item as in-progress.
- **Memorised** — visitor has flagged this item as known.

State transitions are visitor-initiated only (a manual toggle/button), not inferred from counter usage or reading time — inferring mastery from behaviour would be unreliable and is not attempted.

These states are a personal, self-reported reading aid only. Marking an item **Memorised** records that the visitor believes they know it from memory — it is not a claim of correct recitation, religious merit, or acceptance, and carries no scholarly or religious authority.

## Where progress lives

- Stored locally per device (see [16-privacy-and-local-storage-policy.md](16-privacy-and-local-storage-policy.md)), keyed by the item's `id`/`_id` from the content schema ([04](04-dhikr-content-schema.md)).
- No server-side account or sync in v1. A visitor switching devices starts fresh — this tradeoff is accepted for v1 to avoid requiring accounts (see [01-product-scope.md](01-product-scope.md) non-goals).

## Surfaces

- Per-item toggle in the focused reader view ([06](06-reader-experience-specification.md)).
- A dedicated "My Progress" view listing items by state, linking back to each item's reader view (see [02-information-architecture.md](02-information-architecture.md)).

## Explicit non-goals (v1)

- No spaced-repetition scheduling or reminders.
- No quizzing/testing mechanism (e.g. hiding Arabic and prompting recall).
- No cross-device sync without an account system, which is out of scope for v1.
- No sharing of memorisation progress with others.

## Post-v1 candidates (not committed, logged for awareness)

- Optional account-linked sync.
- Optional gentle reminder ("you marked this as learning 2 weeks ago").

These are not designed here; if pursued, they'd need their own architecture pass and are noted only so the local-storage design in [16](16-privacy-and-local-storage-policy.md) doesn't foreclose them structurally.
