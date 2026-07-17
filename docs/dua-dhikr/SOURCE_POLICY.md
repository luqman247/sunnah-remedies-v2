# Source Policy

## Approved verification sources, in priority order

1. **[quran.com](https://quran.com/)** — Qurʾānic verses and verse references.
2. **[sunnah.com](https://sunnah.com/)** — hadith text and recognised collection references.
3. **[usul.ai](https://usul.ai/)** — only where a primary Islamic text or a
   scholarly work must be located and checked.

## Never used as evidence

Random Islamic blogs, social-media posts, unsourced duʿā compilation
websites, AI-generated references, search-result summaries, or
**lifewithallah.com** — that site was consulted only as a UX/information-
architecture reference for this project (see the brief), never as a
source for any religious claim, and no text, translation, virtue, or
reference from it appears anywhere in this codebase.

## Never manufactured

Arabic text, hadith numbers, verse numbers, narrators, authentication
grades, virtues, rewards, repetition counts, or explanations attributed to
scholars. Where a reference cannot be confidently verified, the relevant
field is left empty and the document's `reviewStatus` stays below
`"published"` — see [REVIEW_BYPASS.md](REVIEW_BYPASS.md) for the one
narrow, documented exception to what may substitute for full scholarly
review, which still requires every content field to be genuinely present
and does not permit inventing any of them.

## What shipped in this phase

Zero real duʿā/dhikr content. Every collection page renders its structural
shell only; entries render only once real content exists in Sanity and
passes one of the two publication gates in
`src/sanity/lib/dua-dhikr-publication-gate.ts`. No fixture Islamic text
(Arabic, translation, virtue, or hadith/Qurʾān reference) was written into
any file that a public route reads from. Fixture data used for schema/
route testing (`tests/dua-dhikr/fixtures/`) uses neutral, clearly
non-religious placeholder strings (e.g. `"Fixture Arabic placeholder — not
for publication"`) and is never imported by any file under
`src/app/[locale]/`.

## Provenance record

Every `duaDhikrEntry` carries `contentProvenance` (the reused
`provenanceNote` object: an editorial origin narrative plus an internal-
only note) and `importIdentifier` (traceability back to the row in the
content document that produced it, once supplied) — see
[CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md).
