# Content Import Template

The import script (`scripts/dua-dhikr-import.ts`) expects a JSON file
containing an array of objects in this shape. Validation rules are
enforced by `src/lib/dua-dhikr/import/schema.ts` — see
[CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md) for the full mapping
table and validation rules.

## Row shape

```jsonc
{
  // Required
  "importIdentifier": "string — a stable ID you control, e.g. \"DOC-001\"",
  "collectionSlug": "string — a canonical slug or any known alias, e.g. \"eating\" resolves to \"food-and-drink\"",
  "titleEn": "string",
  "arabicText": "string — the authoritative source text, full tashkīl",
  "translationEn": "string",
  "references": [
    {
      "type": "hadith | quran | research | book | other",
      "citation": "string — human-readable citation",
      "hadithCollection": "string — required if type is \"hadith\"",
      "hadithNumber": "string — required if type is \"hadith\"",
      "hadithGrading": "sahih | hasan | daif | mawdu | other",
      "surah": "string — required if type is \"quran\"",
      "ayah": "string — required if type is \"quran\"",
      "sourceUrl": "string (URL)",
      "verifiedStatus": "verified | unverified"
    }
  ],

  // Optional
  "subcategorySlug": "string, e.g. \"entering-home\"",
  "whatItIsFor": "string",
  "titleDa": "string",
  "transliteration": "string",
  "translationDa": "string",
  "repetitionCount": "number — omit rather than guess",
  "timingLabel": "morning-only | evening-only | morning-and-evening | not-time-specific",
  "occasion": ["string", "..."],
  "instruction": "string",
  "virtue": "string — only if a genuinely supported claim",
  "explanation": "string",
  "authenticationNote": "string"
}
```

## Worked example (real structure, fixture content)

The example below uses clearly non-religious placeholder text so it can be
safely committed to the repository and used to test the import pipeline
end-to-end. **Never replace these placeholder strings with invented
Islamic content** — only with content transcribed and verified from your
source document.

```json
[
  {
    "importIdentifier": "FIXTURE-001",
    "collectionSlug": "food-and-drink",
    "subcategorySlug": null,
    "whatItIsFor": "FIXTURE PLACEHOLDER — not for publication.",
    "titleEn": "Fixture Entry One",
    "titleDa": "Fixtur-post Et",
    "arabicText": "FIXTURE ARABIC PLACEHOLDER — NOT FOR PUBLICATION",
    "transliteration": "fixture-placeholder-transliteration",
    "translationEn": "FIXTURE PLACEHOLDER — not for publication.",
    "translationDa": "FIXTUR-PLACEHOLDER — ikke til offentliggørelse.",
    "repetitionCount": 1,
    "timingLabel": "not-time-specific",
    "occasion": ["fixture-testing"],
    "instruction": "FIXTURE PLACEHOLDER.",
    "virtue": null,
    "explanation": "FIXTURE PLACEHOLDER — not for publication.",
    "authenticationNote": "Fixture row for import-pipeline testing only.",
    "references": [
      {
        "type": "other",
        "citation": "Fixture citation — not a real source.",
        "verifiedStatus": "unverified"
      }
    ]
  },
  {
    "importIdentifier": "FIXTURE-002",
    "collectionSlug": "travel",
    "subcategorySlug": "entering-a-car",
    "whatItIsFor": "FIXTURE PLACEHOLDER — not for publication.",
    "titleEn": "Fixture Entry Two",
    "arabicText": "FIXTURE ARABIC PLACEHOLDER — NOT FOR PUBLICATION",
    "translationEn": "FIXTURE PLACEHOLDER — not for publication.",
    "references": [
      {
        "type": "hadith",
        "citation": "Fixture hadith citation — not a real source.",
        "hadithCollection": "Fixture Collection",
        "hadithNumber": "0000",
        "hadithGrading": "other",
        "verifiedStatus": "unverified"
      }
    ]
  }
]
```

This exact JSON is checked into
[`docs/dua-dhikr/sample-import.json`](sample-import.json) so you can run:

```
npx tsx scripts/dua-dhikr-import.ts docs/dua-dhikr/sample-import.json
```

as a dry run to see the pipeline work end-to-end before your real content
document is ready. `tests/dua-dhikr/dua-dhikr-import-fixtures.test.ts`
asserts this sample file can never be imported live into a route a public
visitor can reach with `reviewStatus` above `"sourced"` — see
[SOURCE_POLICY.md](SOURCE_POLICY.md), "Unpublished fixture protection".
