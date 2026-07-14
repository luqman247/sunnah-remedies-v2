# 30 — Correction and Withdrawal Procedure

Purpose: what to do if an issue is found in a Dhikr item after it has been published. Every action below uses the existing schema and gate — nothing here requires a code change or deployment.

## Translation error

Correct `translationEn` and/or `translationDa` directly. Per [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md), the Arabic is never altered to match a translation — only the translation is corrected to match the Arabic. If the error was substantive (changed meaning, not a minor wording tweak), record the correction and reviewer in a new `boardApproval.notes` entry rather than editing history away.

## Arabic error

Treat as the most serious class of correction, since `arabicText` is the single authoritative source.

1. **Do not patch it live.** Immediately revert `reviewStatus` away from `published` (for example, back to `scholarly-review`). The canonical gate re-evaluates on every public request, so this removes the item from public eligibility the moment it is saved — no code change or deployment required.
2. Correct the Arabic.
3. Re-run the full review cycle from the start — [24-scholarly-review-form.md](24-scholarly-review-form.md) and [25-editorial-review-checklist.md](25-editorial-review-checklist.md) — before republishing. A prior approval does not carry over to corrected Arabic; it approved a different text.

## Source citation error, or a source later found to be disputed

Revert `reviewStatus` away from `published`, correct or remove the affected `sourceReferences` entry, and re-review per [23-source-verification-checklist.md](23-source-verification-checklist.md) and [24-scholarly-review-form.md](24-scholarly-review-form.md) before republishing. Per [03](03-authenticity-and-scholarly-review-policy.md), a disputed source does not remain published regardless of how long it has already been live.

## Withdrawal (item should no longer be public at all)

Revert `reviewStatus` to any value other than `published`. This takes effect immediately for the same reason as above — the gate is evaluated live, not cached against a stale status. No deployment, code change, or separate "unpublish" action is needed.

## Do not delete as the default response

Reverting `reviewStatus` preserves the item's review history (`sourceReferences`, `boardApprovals`) for audit purposes, which deletion would destroy. Reserve deletion for genuine duplicates or items created entirely in error — not for authenticity, translation, or sourcing corrections, where the history of what was reviewed and by whom remains valuable even after the item is no longer public.

## Record keeping

Use a new `boardApproval.notes` entry (rather than editing an existing approval's fields away) to record why a correction or withdrawal occurred, so the audit trail shows what happened and when, not just the item's current state.
