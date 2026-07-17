# Temporary Scholarly-Review Bypass

## What this is

For the Duʿa & Dhikr expansion phase only, a `duaDhikrEntry` (and,
separately, a `duaDhikrCollection`'s own introduction copy) may be
published without a scholarly board approval, provided:

- an editorial board approval **is** recorded, and
- every mandatory content field is present (Arabic, both translations, at
  least one source reference), and
- the document is explicitly marked, by a human editorial reviewer, with
  `editorialPublicationStatus = "editorial-only-scholarly-review-pending"`.

This is the same mechanism already built and shipped for Morning Dhikr
(`dhikrItem.editorialPublicationStatus`,
`DHIKR_EDITORIAL_ELIGIBILITY_GROQ` in
`src/sanity/lib/dhikr-publication-gate.ts`) — chosen deliberately over
inventing new terminology, because it already fits this architecture and
is already tested and in production use for one content type.

## Where it lives

- **Schema field**: `duaDhikrEntry.editorialPublicationStatus` and
  `duaDhikrCollection.editorialPublicationStatus`
  (`src/sanity/schemas/documents/dua-dhikr/*.ts`). Value is either `""`
  (not used) or `"editorial-only-scholarly-review-pending"`.
- **Eligibility rule**: `DUA_DHIKR_EDITORIAL_ELIGIBILITY_GROQ` and
  `isDuaDhikrEntryEditoriallyPubliclyEligible()` in
  `src/sanity/lib/dua-dhikr-publication-gate.ts` — a **separate, additive**
  rule from the canonical `DUA_DHIKR_ELIGIBILITY_GROQ`. Changing one never
  changes the other.
- **Query**: `duaDhikrEntriesEditoriallyPublicEligibleQuery`
  (`src/sanity/lib/queries.ts`) — a distinct query, not a modification of
  the canonical `duaDhikrEntriesPublicEligibleQuery`.
- **Fetch**: `getEditoriallyPublishedDuaDhikrEntriesPublic()` in
  `src/sanity/lib/dua-dhikr-public-fetch.ts`, tagged
  `publicationPathway: "editorial-pending-scholarly-review"` on every
  result it returns.
- **UI**: any entry with that pathway renders
  `<span class="dua-dhikr-pending-badge">` reading "Scholarly review
  pending" (`duaDhikr.entryCard.pendingScholarlyReviewBadge`) —
  `DuaDhikrEntryCard.tsx`. The word "reviewed" or "verified" is never used
  for this pathway; **nothing in this codebase ever displays "scholarly
  reviewed" for content that used this bypass.**

## What it does NOT do

- It does **not** touch, weaken, or share code with
  `DHIKR_ELIGIBILITY_GROQ`/`DUA_DHIKR_ELIGIBILITY_GROQ` (the canonical,
  full scholarly-approved rule) — both remain exactly as strict as before.
- It does **not** apply to `dhikrItem` (Morning/Evening Dhikr) — that
  content type has its own, pre-existing, independent bypass
  (`"editorially-published-pending-scholarly-review"`, a different string
  value, on a different eligibility function) that this work does not
  touch.
- It does **not** remove, hide, or repurpose the `reviewStatus` field or
  the `boardApprovals` array — a document using the bypass can still be
  tracked through `sourced → scholarly-review → …` normally; the bypass is
  an *additional* door, not a replacement for the existing one.
- It does **not** apply anywhere outside `duaDhikrEntry` and
  `duaDhikrCollection` — no other document type in this repository gained
  a new publication pathway as part of this work.

## Audit trail

- `boardApprovals` still records who approved what and when (editorial
  approval is still mandatory even via the bypass).
- `reviewStatus` can independently sit at `"scholarly-review"` (i.e.
  genuinely awaiting scholarly review) at the same time
  `editorialPublicationStatus` is set — the two fields are not mutually
  exclusive, so "editorially published, scholarly review still pending" is
  visible and true in the data, not just in the public label.
- Nothing is deleted or silently reinterpreted if a document later gains a
  real scholarly board approval and its `reviewStatus` reaches
  `"published"` — at that point it also satisfies the canonical rule and
  is returned by both `getDuaDhikrEntriesPublic()` (as
  `"scholarly-approved"`) and (harmlessly, redundantly)
  `getEditoriallyPublishedDuaDhikrEntriesPublic()`;
  `getAllPublicDuaDhikrEntries()` does not de-duplicate by `_id` across the
  two pathways today — see "Remaining work" in the top-level summary for
  this known, low-impact gap (an entry that satisfies both gates
  simultaneously would appear twice until de-duplicated; in practice this
  requires deliberately keeping the bypass flag set on an already
  scholarly-approved entry, which the editorial workflow discourages but
  does not currently block at the schema level).

## Reversal

To withdraw the bypass for one entry: clear
`editorialPublicationStatus` back to `""` in Studio. It immediately drops
out of `duaDhikrEntriesEditoriallyPublicEligibleQuery` and stops rendering
on the public site. To withdraw the mechanism entirely: remove the
`editorialPublicationStatus` field's non-empty option from the schema and
delete `duaDhikrEntriesEditoriallyPublicEligibleQuery` /
`getEditoriallyPublishedDuaDhikrEntriesPublic()` — everything that was
published only via this pathway disappears from the public site the next
time content is fetched (no caching layer stores it separately), while
`reviewStatus`/`boardApprovals` and the canonical pathway are completely
unaffected.

## Test coverage

`tests/dua-dhikr/dua-dhikr-review-bypass-scope.test.ts` asserts:

- the bypass eligibility function never returns `true` for a document that
  hasn't explicitly set `editorialPublicationStatus`;
- the bypass never requires (and is never satisfied by) a scholarly board
  approval;
- the canonical `DUA_DHIKR_ELIGIBILITY_GROQ` string is unchanged by the
  bypass's existence;
- the bypass constants/functions in `dua-dhikr-publication-gate.ts` are
  entirely distinct from (not aliases of, not calling into)
  `dhikr-publication-gate.ts`'s Morning/Evening Dhikr bypass.
