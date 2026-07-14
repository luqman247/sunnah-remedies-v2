# 25 — Editorial Review Checklist

Purpose: the check an editorial reviewer completes before recording a `boardApproval` entry with `board: "editorial"` on a `dhikrItem`. Editorial review covers tone, consistency, and presentation quality **after** scholarly approval — per [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md), the editorial reviewer cannot approve or re-open content on authenticity grounds. If an authenticity question arises during editorial review, return the item to scholarly review rather than resolving it here.

## Checks

- [ ] `titleEn` / `titleDa` are clear, concise, internal working labels — no religious content in the title itself.
- [ ] Transliteration (if present) uses a consistent scheme with other items in the same category.
- [ ] No reward or virtue claim has entered through `description`, `tags`, or the title — this requires the same sourcing rigor as core text ([03](03-authenticity-and-scholarly-review-policy.md)) and cannot be waved through at the editorial stage.
- [ ] Category assignment is correct for the item's content and occasion.
- [ ] Tags (if used) are neutral and organisational, not claims about the item.
- [ ] Translation phrasing reads naturally in both English and Danish without altering meaning from the Arabic — a presentation check, not a re-verification of accuracy (that was scholarly review's responsibility).
- [ ] No internal note, workflow language, or reviewer commentary has leaked into a public-facing field (`titleEn`, `titleDa`, `translationEn`, `translationDa`, `transliteration`).
- [ ] Slug (if set) is a sensible, readable URL segment.

## Decision

- **Approve** — every check above is satisfied. Record `boardApprovals` entry: `board: "editorial"`, `approved: true`, `approver`, `date`.
- **Request revisions** — a presentation issue needs fixing (e.g. inconsistent transliteration, an unsourced claim in a tag). Do not record an approval; communicate the required revision and leave `reviewStatus` unchanged.
- **Return to scholarly review** — if an authenticity question surfaces (source accuracy, translation-vs-Arabic fidelity, grading), this is out of scope for editorial review; route it back rather than approving or rejecting it here.

## After approval

Both a scholarly approval ([24-scholarly-review-form.md](24-scholarly-review-form.md)) and an editorial approval are required, independently, before `reviewStatus` can be saved as `published` — one approval of either kind alone is not sufficient. See [29-publication-approval-checklist.md](29-publication-approval-checklist.md) for the final pre-publication check.
