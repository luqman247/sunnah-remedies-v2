# 29 — Publication Approval Checklist

Purpose: the final check before flipping a `dhikrItem`'s `reviewStatus` to `published`. This checklist maps directly, one-to-one, to the seven conditions in the canonical publication gate (`src/sanity/lib/dhikr-publication-gate.ts`, `getDhikrEligibilityConditions`) — it does not restate the rule independently, and if this document and the gate ever appear to disagree, the gate is authoritative.

## Before publishing

Open the item's **Publication Readiness** tab in Sanity Studio and confirm all seven conditions show **Met**:

- [ ] Review status is "published" — this is the value you are about to set.
- [ ] Arabic text is present.
- [ ] English translation is present.
- [ ] Danish translation is present.
- [ ] At least one source reference is present.
- [ ] An approved scholarly board approval is present ([24-scholarly-review-form.md](24-scholarly-review-form.md)).
- [ ] An approved editorial board approval is present ([25-editorial-review-checklist.md](25-editorial-review-checklist.md)).

If any condition shows **Missing**, Sanity Studio's own Publish action will already be blocked by the schema's validators — this is enforced automatically by the same rule shown in the Readiness tab, not something you need to separately verify with a second system.

## Advisory checks (not gating, but worth confirming)

These are recommended, not required for publication — see the Publication Readiness tab's advisory section for the live status of each:

- [ ] Slug is configured. (Note: a separate, field-specific validator does require a slug before `reviewStatus` can be *saved* as `published`, even though it is not part of the seven-condition gate itself.)
- [ ] Category is correct.
- [ ] Consider whether transliteration or repetition guidance should be added now, even though neither is required.

## Publishing

Use Sanity Studio's native **Publish** action. No custom publish action exists in this project — this is a deliberate choice, so the existing, already-proven schema validators remain the single enforcement point rather than being duplicated or risked by a custom shortcut.

## After publishing

The item becomes visible on the public Knowledge Library Dhikr surface the next time the public query runs — there is no separate deployment step. If an issue is found after publishing, see [30-correction-and-withdrawal-procedure.md](30-correction-and-withdrawal-procedure.md).
