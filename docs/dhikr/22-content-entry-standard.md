# 22 — Content Entry Standard

Purpose: define the exact procedure and order of operations for entering a new Daily Dhikr item into Sanity Studio, from category selection through to a "sourced" item ready for scholarly review. This document governs *process*, not content — no Arabic text, translation, or citation is written here; see [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md) for who is authorised to do what, and the schema itself (`src/sanity/schemas/documents/dhikr/dhikr-item.ts`) for the authoritative field list.

## Before creating an item

1. Confirm a `dhikrCategory` document already exists for the intended category (Daily Dhikr → Dhikr Categories in Studio). If not, create it first — see [31-first-20-entries-production-plan.md](31-first-20-entries-production-plan.md) for the proposed category set.
2. Confirm you hold the "source compiler" role for this stage of entry ([03](03-authenticity-and-scholarly-review-policy.md)). Scholarly and editorial roles act later, not here.

## Entry sequence, by Studio tab

Field groups follow the Stage 2C restructuring recorded in [21-decision-log.md](21-decision-log.md).

1. **Identity** — set `titleEn` (internal working title only, no religious content), `titleDa` if known, `category`, `order`. Leave `slug` unset; it is only required once `reviewStatus` reaches `published`.
2. **Arabic Source Text** — enter `arabicText` exactly once, following [28-arabic-typography-standard.md](28-arabic-typography-standard.md). This becomes the authoritative source for every later stage; it is never duplicated onto a separate English or Danish record.
3. **Supporting Translations** — leave empty at this stage unless a reviewed translation is already available. Translations are derived from `arabicText`, not entered independently — see [26-translation-review-standard.md](26-translation-review-standard.md).
4. **Repetition Guidance** — leave empty unless a specific, sourced repetition count is already established (see [07-repeat-counter-specification.md](07-repeat-counter-specification.md)). Do not estimate or infer a count.
5. **Sources and Authenticity** — add at least one `sourceReferences` entry per [23-source-verification-checklist.md](23-source-verification-checklist.md). This is mandatory before the item can ever be published, and should be entered as early and completely as possible.
6. **Scholarly Review** and **Editorial Review** — leave untouched at this stage. `reviewStatus` defaults to `sourced`; do not advance it until the content above is genuinely complete.

## What "sourced" means in practice

An item may remain at `reviewStatus: sourced` indefinitely with only Arabic and a source reference populated — this is the expected, safe resting state for content awaiting scholarly capacity. Advancing `reviewStatus` to `scholarly-review` is a signal that the item is believed ready for review; it is not itself a data requirement enforced by the schema, so it must be done deliberately, not by habit.

## Do not

- Enter placeholder or approximate Arabic "to fill the field" — leave it empty until verified.
- Copy translation text from memory or from an unverified external source.
- Set `recommendedRepetitions` from general knowledge or common practice.
- Advance `reviewStatus` past `sourced` without having actually completed the corresponding review (see [24-scholarly-review-form.md](24-scholarly-review-form.md), [25-editorial-review-checklist.md](25-editorial-review-checklist.md)).

## Checking your work

Open the item's **Publication Readiness** tab at any time to see exactly which of the seven canonical conditions are met and which are missing — this reflects the same rule that gates public visibility (`src/sanity/lib/dhikr-publication-gate.ts`), not a separate opinion. See [29-publication-approval-checklist.md](29-publication-approval-checklist.md) before ever publishing.
