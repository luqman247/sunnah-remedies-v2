# Sunnah Remedies Duʿa & Dhikr Library

A premium expansion of the Knowledge Library's existing Dhikr work into the
wider Sunnah collections of duʿa and dhikr — Daily Foundations, Everyday
Life, Family & Relationships, Faith/Protection/Healing, Qurʾān & Sunnah
Collections, Nature & Life Events, and Sacred Times & Journeys.

This is **not** a rebuild. Morning and Evening Dhikr (`dhikrItem`,
`dhikrCategory`, `/knowledge/dhikr/morning`, `/knowledge/dhikr/evening`) are
**complete, production implementations, live on `main`** — this project
does not modify them. Duʿa & Dhikr adds a new, parallel content type
(`duaDhikrEntry` / `duaDhikrCollection`) for everything else, reusing the
same review pipeline, the same reused Sanity objects (`sourceReference`,
`boardApproval`), and the same visual language. This branch
(`feature/dua-dhikr-library-architecture`) is kept in sync with `main` by
merge (not rebase) so the two stay compatible — see the reconciliation
record in [QA_REPORT.md](QA_REPORT.md).

## What exists today

- **Taxonomy** — [src/lib/dua-dhikr/taxonomy.ts](../../src/lib/dua-dhikr/taxonomy.ts):
  the single source of truth for parent groups, canonical collections,
  subcategories, and the alias map. See [CATEGORY_ALIAS_MAP.md](CATEGORY_ALIAS_MAP.md).
- **Sanity schema** — `duaDhikrCollection` and `duaDhikrEntry`
  ([src/sanity/schemas/documents/dua-dhikr/](../../src/sanity/schemas/documents/dua-dhikr/)).
  See [CONTENT_MODEL.md](CONTENT_MODEL.md).
- **Publication gate** — [src/sanity/lib/dua-dhikr-publication-gate.ts](../../src/sanity/lib/dua-dhikr-publication-gate.ts),
  with a temporary, documented, reversible bypass for this expansion phase.
  See [REVIEW_BYPASS.md](REVIEW_BYPASS.md).
- **Public fetch + GROQ** — [src/sanity/lib/dua-dhikr-public-fetch.ts](../../src/sanity/lib/dua-dhikr-public-fetch.ts),
  queries in [src/sanity/lib/queries.ts](../../src/sanity/lib/queries.ts).
- **Routes** — `/[locale]/knowledge-library/dua-dhikr` (landing) and
  `/[locale]/knowledge-library/dua-dhikr/[collectionSlug]` (collection).
  See [INFORMATION_ARCHITECTURE.md](INFORMATION_ARCHITECTURE.md).
- **Components** — `src/components/dua-dhikr/` (`ArabicText`, `icons`,
  `DuaDhikrEntryCard`, `DuaDhikrCollectionCard`, `DuaDhikrSearch`,
  `DuaDhikrEntryCollection`, `ContinueReading`). See [VISUAL_SYSTEM.md](VISUAL_SYSTEM.md).
- **Local-only reading progress** — [src/lib/dua-dhikr/local-storage.ts](../../src/lib/dua-dhikr/local-storage.ts):
  memorise/learning state and a "Continue reading" list, both device-local,
  no account, no gamification.
- **Tests** — `tests/dua-dhikr/`, mirroring the conventions of `tests/dhikr/`.

## What is deliberately not built yet

- No real Duʿa content exists anywhere in this repository. Every route
  renders its full structural shell (title, icon, subcategory nav, related
  collections) with an honest "preparing for publication" empty state —
  the same precedent as the existing Evening Dhikr page — never invented
  Arabic, translations, virtues, or references.
- The Learning section's eight guides are placeholder-only by design (see
  `duaDhikr.landing.learningGuides` in `src/messages/en.json`) — not routed,
  not published, until sourced content is supplied.
- Per-entry detail routes are not built (mirrors the existing, deliberate
  decision not to build one for Morning/Evening Dhikr yet — see
  `docs/dhikr/21-decision-log.md`, ADR-015). Entries render inline on their
  collection page.

## How to bring in the content document

See [CONTENT_IMPORT_GUIDE.md](CONTENT_IMPORT_GUIDE.md) and
[CONTENT_IMPORT_TEMPLATE.md](CONTENT_IMPORT_TEMPLATE.md).

## Sourcing rules

See [SOURCE_POLICY.md](SOURCE_POLICY.md) — nothing here may assert an
Arabic text, hadith number, verse reference, grading, virtue, or repetition
count that has not been verified against `quran.com`, `sunnah.com`, or
`usul.ai`.
