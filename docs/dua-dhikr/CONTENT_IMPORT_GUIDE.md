# Content Import Guide

## Overview

1. Convert your source document (Word/Excel/Notion/etc.) into a JSON array
   matching [CONTENT_IMPORT_TEMPLATE.md](CONTENT_IMPORT_TEMPLATE.md) — one
   object per duʿa/dhikr entry.
2. For each `collectionSlug` you plan to use, make sure a
   `duaDhikrCollection` Sanity document already exists with that slug
   (Studio → Duʿa & Dhikr → Collections). The import does not create
   collections — only entries.
3. Run a dry run: `npx tsx scripts/dua-dhikr-import.ts your-file.json`.
   Fix every reported issue before proceeding — nothing is written in dry
   run mode.
4. Run live: `npx tsx scripts/dua-dhikr-import.ts your-file.json --live`
   (requires `SANITY_API_TOKEN` with write access in the environment).
5. In Sanity Studio, review each imported entry (all land at
   `reviewStatus: "sourced"`, zero board approvals — the import never
   publishes anything), add the Danish translation if not already present,
   verify every source reference, and advance `reviewStatus` /
   `boardApprovals` through the normal editorial + scholarly review
   workflow, exactly as for any other entry.

## Mapping table

| Your document field | Duʿa & Dhikr field | Notes |
|---|---|---|
| What for? | `whatItIsFor` | One or two plain-language sentences |
| Duʿa (Arabic) | `arabicText` | Authoritative source — full tashkīl |
| Translation | `translationEn` (+ `translationDa` if supplied) | |
| Transliteration | `transliteration` | |
| Virtue | `virtue` → `virtueText` | Optional — leave blank rather than guess |
| Explanation | `explanation` → `explanationText` | |
| Reference | `references[]` → `sourceReferences[]` | See "Source-reference validation" below |
| Repetition | `repetitionCount` → `recommendedRepetitions` | Number only, never inferred |
| Category | `collectionSlug` (+ optional `subcategorySlug`) | Must resolve via `src/lib/dua-dhikr/taxonomy.ts` — see [CATEGORY_ALIAS_MAP.md](CATEGORY_ALIAS_MAP.md) |

## Validation rules

Enforced by `src/lib/dua-dhikr/import/schema.ts`, `validateImportRow()`,
before any write happens:

**Required**: `importIdentifier`, `collectionSlug` (must resolve to a
canonical slug or alias), `titleEn`, `arabicText`, `translationEn`, at
least one `references[]` entry with both `type` and `citation`.

**Optional**: everything else. `repetitionCount` must be a number if
present — never guessed when the field is simply absent.

A row that fails any required check is **not written**, in either dry-run
or live mode, and is reported with the exact field and reason.

## Duplicate-detection strategy

- **Within one batch**: `findDuplicateImportIdentifiers()` flags any
  `importIdentifier` repeated in the same file before anything is written.
- **Across runs**: each row maps to a deterministic Sanity `_id`
  (`duaDhikrEntry-<importIdentifier>`), so re-importing the same
  `importIdentifier` updates that one document (`createOrReplace`) instead
  of creating a second document. Change `importIdentifier` deliberately if
  you mean to create a genuinely new, separate entry.
- **Content-level duplicates** (the same duʿa transcribed twice under two
  different identifiers) are not auto-detected — reviewers should check
  for this during the normal editorial review pass, the same as for any
  other content type in this repository.

## Source-reference validation strategy

Each reference must state its `type` (`hadith` | `quran` | `research` |
`book` | `other`) and a human-readable `citation`. For `type: "hadith"`,
also supply `hadithCollection`/`hadithNumber`/`hadithGrading` where known;
for `type: "quran"`, supply `surah`/`ayah`. Set `verifiedStatus` to
`"verified"` only once the reference has actually been opened and checked
against `quran.com`, `sunnah.com`, or `usul.ai` (see
[SOURCE_POLICY.md](SOURCE_POLICY.md)) — leave it `"unverified"` (the
schema default) otherwise. The import script never sets
`verifiedStatus: "verified"` on your behalf.

## Rollback procedure

- **Before publishing**: delete the specific document in Studio
  (`duaDhikrEntry-<importIdentifier>`), or simply leave it at
  `reviewStatus: "sourced"` indefinitely — it is not publicly visible
  until it passes a publication gate (see
  [REVIEW_BYPASS.md](REVIEW_BYPASS.md)).
- **After publishing, needing a full withdrawal**: follow the existing
  Dhikr correction/withdrawal precedent
  (`docs/dhikr/30-correction-and-withdrawal-procedure.md`) — the same
  principle applies here: revert `reviewStatus` below `"published"` and
  clear `editorialPublicationStatus` rather than deleting the document
  outright, preserving the audit trail (`contentProvenance`,
  `boardApprovals` history).
- **Re-running an import batch**: safe. The script uses
  `createIfNotExists` (which seeds `reviewStatus: "sourced"` and an empty
  `editorialPublicationStatus` only the first time a document is created)
  followed by a separate `.patch(id).set(fields).commit()` that writes only
  the content fields this import owns — see `toOwnedContentFields()` in
  `src/lib/dua-dhikr/import/import-content-document.ts`. Re-running an
  import after a human has advanced `reviewStatus`/`boardApprovals` in
  Studio updates only the transcription fields (Arabic, translations,
  guidance, references, provenance) and never resets review state.
