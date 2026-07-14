# 24 — Scholarly Review Form

Purpose: the structured check a scholarly reviewer completes before recording a `boardApproval` entry with `board: "scholarly"` on a `dhikrItem`. This form is a procedural aid for the reviewer — it has no effect in Sanity itself; only the actual `boardApprovals` entry recorded in Studio is read by the canonical publication gate (`src/sanity/lib/dhikr-publication-gate.ts`).

## Reviewer record

- Reviewer name — recorded in `boardApproval.approver`.
- Date of review — recorded in `boardApproval.date`.

## Checks

- [ ] **Source authenticity** — has the [23-source-verification-checklist.md](23-source-verification-checklist.md) been satisfied for every `sourceReferences` entry on this item?
- [ ] **Arabic accuracy** — does `arabicText` match the cited source exactly, including full diacritics (see [28-arabic-typography-standard.md](28-arabic-typography-standard.md))?
- [ ] **English translation accuracy** — is `translationEn` checked against the Arabic itself, not reviewed as an independent English text? Per [03](03-authenticity-and-scholarly-review-policy.md), a discrepancy is resolved by correcting the translation — the Arabic is never adjusted to match a translation.
- [ ] **Danish translation accuracy** — is `translationDa` independently checked against the Arabic (not against the English translation)?
- [ ] **Repetition guidance** — if `recommendedRepetitions` is populated, is it confirmed as sourced from the same citation trail, not inferred or estimated? If not sourced, it should be left empty rather than approved.
- [ ] **Reward or virtue claims** — does any field on the item (title, description, tags, transliteration) assert a specific spiritual reward, virtue, or benefit? Per [03](03-authenticity-and-scholarly-review-policy.md), any such claim requires the same sourcing rigor as the core text and must not enter through a loosely-reviewed field. Flag and remove, or require independent sourcing, before approving.

## Decision

Choose one:

- **Approve** — every check above is satisfied. Record `boardApprovals` entry: `board: "scholarly"`, `approved: true`, `approver`, `date`. Use `notes` for any minor caveat that does not block approval.
- **Return for revision** — one or more checks fail in a way the source compiler can address (e.g. citation incomplete, translation drifted from Arabic). Do not record an approval; use `notes` on an unapproved entry, or communicate the required revision outside Sanity, and leave `reviewStatus` unchanged until revised.
- **Reject as unauthenticated or disputed** — the source itself is weak, fabricated, or contested. Per [03](03-authenticity-and-scholarly-review-policy.md), this item does not proceed regardless of how commonly the text circulates elsewhere. There is no "publish with a caveat" state.

## After approval

A scholarly approval alone is not sufficient for publication — an independent editorial approval is still required (see [25-editorial-review-checklist.md](25-editorial-review-checklist.md)), and both are checked together by the canonical gate before `reviewStatus` can be saved as `published`.
