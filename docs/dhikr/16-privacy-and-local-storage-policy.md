# 16 — Privacy & Local Storage Policy

## Why local-storage-first (assumption, not repository evidence)

This is a Dhikr-specific product decision, not derived from an existing repository pattern — no existing local-storage precedent for personal progress data was found during the audit ([00-existing-system-audit.md](00-existing-system-audit.md)). It follows directly from the account-free v1 scope in [01-product-scope.md](01-product-scope.md): without an account system, the only place per-visitor state (counter, memorisation progress) can live is the visitor's own device. The full reasoning for the account-free decision itself is logged in [21-decision-log.md](21-decision-log.md).

## What is stored locally

| Data | Source document | Sensitivity |
|---|---|---|
| Repeat counter value, per item, per session | [07-repeat-counter-specification.md](07-repeat-counter-specification.md) | Low — a number, no personal identifier |
| Memorisation progress state, per item | [08-memorisation-system.md](08-memorisation-system.md) | Low — reflects religious practice, treated as sensitive by default even though not identifying |
| Transliteration/translation visibility preference | [06-reader-experience-specification.md](06-reader-experience-specification.md) | Low — a UI preference |

## What is never stored or transmitted

- No account identifier, email, or name is attached to any of the above (consistent with the account-free v1 scope).
- No progress or counter data is sent to any analytics/tracking system by default — extending `analytics/tracking-plan.yaml` (see [00](00-existing-system-audit.md)) to log aggregate, anonymous usage events (e.g. "an item was read") is a separate decision from storing personal progress, and even that extension is not assumed here — it would need its own review against the existing tracking plan's conventions.
- No data is synced across devices in v1 (see non-goals in [08](08-memorisation-system.md)).

## Storage mechanism

Browser local storage (or equivalent client-side persistence), scoped per-origin, per-device — no server-side database table is required for this data in v1. This keeps the feature's data footprint minimal and avoids the account/consent obligations a server-stored personal record would carry.

Throughout this pack, "local storage" means persistent, per-origin browser storage that survives tab and browser closure until explicitly cleared (by the visitor or by browser data-clearing) — not `sessionStorage`. Where another document describes a value "resetting per session" (e.g. the repeat counter's default behaviour in [07-repeat-counter-specification.md](07-repeat-counter-specification.md)), that describes an application-level decision to discard a persisted value at the start of a new reading session, not a claim that the underlying storage mechanism itself is non-persistent.

If local storage is unavailable or blocked by the visitor's browser (e.g. private browsing), the reader experience must still function fully — only the counter and memorisation tools lose persistence, falling back to in-memory, session-only state (or a non-blocking notice), never the core reading experience. Using local storage is therefore always optional from the visitor's perspective, never a precondition for reading.

## Data lifecycle

- Clearing browser storage (or using a different device/browser) resets all local progress — this is a known, accepted tradeoff of the local-first approach, not a bug.
- No explicit "export my progress" or "delete my data" tooling is required in v1 because no server-side copy exists to delete — clearing local browser storage is sufficient and already visitor-controlled.

## Explicit non-goals

- Does not design any account-linked sync system (would require its own privacy review if pursued later — see [08](08-memorisation-system.md) post-v1 candidates).
- Does not define analytics event schemas — that's an extension of the existing `analytics/tracking-plan.yaml`, out of scope for this document.
