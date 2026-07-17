# Content Preflight & Intake Workflow

This document describes the complete, end-to-end path from your prepared
content document to a publicly visible Duʿa & Dhikr entry — every step,
in order, including the human review stages that happen entirely outside
this codebase. It complements
[CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md) (the mapping table and
field-by-field rules) and [SOURCE_POLICY.md](SOURCE_POLICY.md) (sourcing
rules) rather than repeating them — read those two alongside this one.

No step below has been run against real content. Nothing in this
repository has imported, staged, or published a real duʿā.

## 1. Accepted document / JSON structure

A JSON array of row objects, one object per duʿā/dhikr entry — see
[CONTENT_IMPORT_TEMPLATE.md](CONTENT_IMPORT_TEMPLATE.md) for the exact
shape and a fixture-only worked example
(`docs/dua-dhikr/sample-import.json`). If your source document is Word,
Excel, or Notion, convert it to this JSON shape first — no other input
format is accepted.

## 2. Required fields

`importIdentifier`, `collectionSlug`, `titleEn`, `arabicText`,
`translationEn`, and at least one `references[]` entry with `type` and
`citation`. A hadith reference additionally requires
`hadithCollection`/`hadithNumber`; a Qurʾān reference requires
`surah`/`ayah`. See `src/lib/dua-dhikr/import/schema.ts`,
`validateImportRow()`, for the exact, enforced rule set.

## 3. Optional fields

Everything else: `subcategorySlug`, `whatItIsFor`, `titleDa`,
`transliteration`, `translationDa`, `repetitionCount`, `timingLabel`,
`occasion`, `instruction`, `virtue`, `explanation`, `authenticationNote`.
Omitting one produces a **warning**, never a blocking error — but every
warning is surfaced by the preflight report (§9) so an omission is a
deliberate decision, not an oversight.

## 4. Allowed source domains

`quran.com`, `sunnah.com`, `usul.ai`, and their subdomains — enforced in
code (`ALLOWED_SOURCE_HOSTNAMES`, `isAllowedSourceHostname()` in
`src/lib/dua-dhikr/import/schema.ts`), not just documented. Any
`sourceUrl` on any other domain is a **blocking error**. See
[SOURCE_POLICY.md](SOURCE_POLICY.md) for why these three specifically.

## 5. Canonical category mapping

`collectionSlug` must resolve to one of the 39 canonical collections in
`src/lib/dua-dhikr/taxonomy.ts` — either directly or through an alias (see
§6). See [CATEGORY_ALIAS_MAP.md](CATEGORY_ALIAS_MAP.md) for the full list.
An unresolvable category is a blocking error, never silently dropped or
guessed.

## 6. Alias handling

`resolveCollectionSlug()` resolves any of the alternate terms in
[CATEGORY_ALIAS_MAP.md](CATEGORY_ALIAS_MAP.md) (e.g. "eating" →
`food-and-drink`, "before wudu" → `lavatory-and-wudu`) to its one
canonical collection before validation runs — you do not need to look up
the canonical slug yourself before preparing your document, but the
category name you use must be a recognised term, not an invented one.

## 7. Duplicate handling

Two layers, both read-only until you act on them:

- **Exact duplicates**: same `importIdentifier` within one batch is a
  blocking error (`findDuplicateImportIdentifiers`).
- **Near-duplicates**: identical Arabic (ignoring diacritics/whitespace),
  the same Arabic reused across two collections, or the same source +
  repetition count with different Arabic are all surfaced as **candidates
  for your review** (`src/lib/dua-dhikr/import/duplicate-detection.ts`) —
  never auto-merged, never auto-rejected. Two duʿās that merely share
  similar English wording are never flagged. See
  [CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md), "Duplicate-detection
  strategy", for how to resolve each case.

## 8. Dry-run command

```
npx tsx scripts/dua-dhikr-import.ts your-file.json
```

Read/validate only — this can never write to Sanity (there is no `--live`
flag present). Run this as many times as you like while preparing your
document.

## 9. Preflight report

```
npx tsx scripts/dua-dhikr-preflight.ts your-file.json        # text report
npx tsx scripts/dua-dhikr-preflight.ts your-file.json --json # machine-readable
```

Never imports a Sanity client, never requires `SANITY_API_TOKEN`, never
writes anything. Produces an executive summary (totals, warnings, blocked
count, duplicate groups) and a per-entry breakdown with an explicit
decision — `ready-to-stage`, `ready-after-minor-correction`,
`requires-source-verification`, `duplicate-candidate`, or
`blocked-from-import` — plus a `publicationEligibility` field that is
**always** `"not-eligible-pending-review"` at this stage. **"Ready to
stage" never means "ready to publish."**

## 10. Human correction loop

For every row the preflight report doesn't mark `ready-to-stage`: fix the
row in your source document, re-export the JSON, re-run the preflight
command. Repeat until the executive summary shows zero blocked entries and
you've deliberately resolved every duplicate candidate and warning (fixing
isn't always required — some warnings are legitimate, documented
omissions, e.g. no transliteration yet).

## 11. Approval before staging

You (the content owner) review the final preflight report and decide the
batch is ready. This is a human decision outside this codebase — nothing
here auto-approves a batch for staging.

## 12. Safe staging import

Only after your approval:

```
npx tsx scripts/dua-dhikr-import.ts your-file.json \
  --live --confirm-write --dataset <your-dataset-name>
```

All three flags are required together (§ next). Staged entries land at
`reviewStatus: "sourced"`, zero board approvals — not publicly visible.
Re-running this command later (e.g. with corrections) never overwrites
`reviewStatus`, `boardApprovals`, `editorialPublicationStatus`, or any
editorial elaboration a human has since added in Studio (virtue,
explanation, authentication note, source references, provenance) — see
`src/lib/dua-dhikr/import/import-content-document.ts`.

## 13. Sanity editorial review

A human editorial reviewer opens each staged entry in Sanity Studio,
checks wording/presentation, adds an editorial `boardApproval`, and
advances `reviewStatus` toward `"editorial-review"` / `"approved"`.

## 14. Scholarly review

A qualified scholarly reviewer independently verifies authenticity,
grading, and translation faithfulness, and adds a scholarly
`boardApproval`. This is the canonical, non-bypassable pathway. See
[REVIEW_BYPASS.md](REVIEW_BYPASS.md) for the separate, temporary,
editorial-only pathway available during this expansion phase — using it
requires an explicit, auditable decision, never a default.

## 15. Preview QA

Before advancing `reviewStatus` to `"published"`, view the entry on its
real collection page (via Sanity's preview/draft mode) — Arabic rendering,
RTL, translation, references, and repetition all display as expected, at
mobile and desktop widths.

## 16. Publication approval

Once `reviewStatus` reaches `"published"` **and** both board approvals are
recorded **and** every required field is present, the entry passes
`isDuaDhikrEntryPubliclyEligible()` (`src/sanity/lib/dua-dhikr-publication-gate.ts`)
and becomes visible on the live site automatically at the next fetch — no
separate "go live" action beyond setting `reviewStatus: "published"` in
Studio with genuine approvals recorded.

## 17. Rollback

See [CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md), "Rollback
procedure" — revert `reviewStatus` below `"published"` and clear
`editorialPublicationStatus` rather than deleting the document, preserving
the audit trail.

---

## Document-preparation checklist

Before sending your content document for import, confirm for **every**
entry:

- [ ] A stable `importIdentifier` you control (e.g. a row number in your
      source spreadsheet) — this must not change between drafts of the
      same document, or re-import will create a duplicate instead of
      updating.
- [ ] The category matches one of the canonical collections or a
      recognised alias in [CATEGORY_ALIAS_MAP.md](CATEGORY_ALIAS_MAP.md) —
      if genuinely none fit, flag it rather than guessing.
- [ ] The Arabic text is transcribed with full tashkīl, from a source you
      can name.
- [ ] At least one source reference is filled in, with a citation and, for
      hadith, the collection + number; for Qurʾān, the surah + ayah.
- [ ] Every `sourceUrl` (if you include one) points at `quran.com`,
      `sunnah.com`, or `usul.ai` — not a blog, forum, or social post.
- [ ] The repetition count (if any) is something you can point to a source
      for — leave it blank rather than guess.
- [ ] The English translation is derived from the Arabic, not written
      independently.
- [ ] Nothing in the row is placeholder or draft text you forgot to
      replace — the import pipeline will reject anything containing the
      words "FIXTURE" or "NOT FOR PUBLICATION" as a safety backstop, but
      it cannot catch other kinds of unfinished text.
- [ ] Virtue/explanation text (if included) reflects a genuinely supported
      claim, not a promotional simplification — see
      [SOURCE_POLICY.md](SOURCE_POLICY.md).

You do not need to fill in Danish translations, transliteration, or an
explanation before your first import — these can be added in Studio
afterward, and the site shows an honest "preparing for publication" or
falls back to English until they exist.
