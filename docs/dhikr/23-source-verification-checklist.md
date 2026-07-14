# 23 — Source Verification Checklist

Purpose: a checklist for the source compiler role ([03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md)) when adding a `sourceReferences` entry to a `dhikrItem`. Each entry reuses the existing shared `sourceReference` object (`src/sanity/schemas/objects/source-reference.ts`) — this document explains how to fill that object correctly for Dhikr content; it does not define a new field.

## Before adding a source reference

- [ ] Is the source citable and specific — a named collection, book, or reference — not "commonly known" or "widely recited"? A source that cannot be named and checked does not qualify.
- [ ] Is `type` set correctly (`hadith`, `quran`, `research`, `book`, or `other`)?

## If `type` is `hadith`

- [ ] Is `hadithCollection` filled with the actual named collection?
- [ ] Is `hadithNumber` filled with the specific, checkable reference number within that collection?
- [ ] Is `hadithGrading` recorded honestly? A weak (`da'if`) or fabricated (`mawdu'`) grading must be labelled as such, never omitted or softened to make an item appear more usable.

## If `type` is `quran`

- [ ] Are `surah` and `ayah` recorded precisely?

## For any type

- [ ] If `sourceUrl` is used, does it link to a verifiable, stable, reputable source — not a placeholder, a general search-engine link, or a page requiring interpretation to locate the reference?
- [ ] Is `verifiedStatus` set honestly? If the attribution cannot be traced to a specific, checkable source, it must be marked **Unverified** — the "Ibn al-Qayyim rule" already encoded in the shared `sourceReference` object.
- [ ] If the source is disputed or contested by credible scholarship, does the item still proceed? Per [03](03-authenticity-and-scholarly-review-policy.md), it does **not** — a disputed source does not proceed to editorial review or publication, regardless of how commonly the text circulates elsewhere.

## Before requesting scholarly review

- [ ] At least one `sourceReferences` entry exists on the item.
- [ ] Every entry above has been completed honestly, not partially, for each source added.

## What this checklist does not cover

This checklist confirms a citation is complete and honestly recorded — it does not itself judge whether the source is authentic enough to publish. That scholarly judgement belongs to the scholarly reviewer and is covered separately in [24-scholarly-review-form.md](24-scholarly-review-form.md). A source compiler who is uncertain about authenticity should still record the citation completely and flag the uncertainty in the item's workflow, rather than guessing or omitting the entry.
