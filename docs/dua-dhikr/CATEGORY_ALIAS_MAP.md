# Category & Alias Map

Source of truth: [`src/lib/dua-dhikr/taxonomy.ts`](../../src/lib/dua-dhikr/taxonomy.ts).
This document mirrors that file for editorial/reviewer reference — if the
two ever disagree, the code file is correct and this file needs updating.

Every term from the original request is discoverable through search,
filters, an alias, a subcategory, or a related-collection link — never by
creating a second collection for a concept that already has a canonical
home.

## Parent groups

| Key | Title |
|---|---|
| `daily-foundations` | Daily Foundations |
| `everyday-life` | Everyday Life |
| `family-and-relationships` | Family & Relationships |
| `faith-protection-and-healing` | Faith, Protection & Healing |
| `quran-and-sunnah-collections` | Qurʾān & Sunnah Collections |
| `nature-and-life-events` | Nature & Life Events |
| `sacred-times-and-journeys` | Sacred Times & Journeys |

## Collections, subcategories, and aliases

| Collection (slug) | Parent group | Subcategories | Aliases resolved to this collection |
|---|---|---|---|
| `morning-dhikr` | daily-foundations | — | morning, morning adhkar, morning remembrance *(defers to `/knowledge/dhikr/morning`)* |
| `evening-dhikr` | daily-foundations | — | evening, evening adhkar, evening remembrance *(defers to `/knowledge/dhikr/evening`)* |
| `after-salah` | daily-foundations | — | after prayer, post-salah, after salaah, after salat *(the two "After Salah" mentions in the brief collapse to this one entry)* |
| `before-sleep` | daily-foundations | — | going to sleep, bedtime, night duas |
| `waking-up` | daily-foundations | — | **after sleep**, on waking, upon waking |
| `tahajjud` | daily-foundations | — | night prayer, qiyam al-layl |
| `adhan-and-masjid` | daily-foundations | — | call to prayer, mosque, entering/leaving the mosque |
| `istikharah` | daily-foundations | — | prayer of guidance, seeking guidance |
| `food-and-drink` | everyday-life | — | **eating**, meals, drinking, before/after eating |
| `home` | everyday-life | `entering-home`, `leaving-home` | house, entering the house, leaving the house |
| `clothes` | everyday-life | — | dressing, wearing new clothes |
| `lavatory-and-wudu` | everyday-life | `before-wudu`, `after-wudu` | **wudu**, wudhu, ablution, toilet, lavatory, **before wudu**, **after wudu** |
| `travel` | everyday-life | `entering-a-car` | **travelling**, traveling, journey, vehicle, **car**, **entering a car** |
| `gatherings` | everyday-life | — | sitting with others, closing a gathering, kaffarat al-majlis |
| `social-interactions` | everyday-life | — | greetings, visiting others, sneezing |
| `money-and-shopping` | everyday-life | — | shopping, the marketplace, debt, provision |
| `marriage-and-children` | family-and-relationships | *(umbrella — see below)* | family |
| `parents` | family-and-relationships | — | — |
| `children` | family-and-relationships | — | — |
| `newborn` | family-and-relationships | — | new baby, birth |
| `marriage` | family-and-relationships | — | wedding, spouse |
| `ruqyah-and-illness` | faith-protection-and-healing | — | ruqya, sickness, healing, illness |
| `protection-of-iman` | faith-protection-and-healing | — | faith protection, steadfastness |
| `nightmares` | faith-protection-and-healing | — | bad dreams |
| `difficulties-and-happiness` | faith-protection-and-healing | — | hardship, anxiety, worry, gratitude, distress |
| `istighfar` | faith-protection-and-healing | — | seeking forgiveness, repentance |
| `praises-of-allah` | faith-protection-and-healing | — | tasbih, glorification, dhikr of praise |
| `salawat` | faith-protection-and-healing | — | blessings on the prophet, durood |
| `names-of-allah` | faith-protection-and-healing | — | asma ul husna, the beautiful names |
| `quranic-duas` | quran-and-sunnah-collections | — | duas from the quran, quran duas |
| `sunnah-duas` | quran-and-sunnah-collections | — | prophetic duas, hadith duas |
| `rain` | nature-and-life-events | — | rainfall, thunder |
| `wind` | nature-and-life-events | — | strong wind, storm |
| `nature` | nature-and-life-events | — | the natural world, creation |
| `death` | nature-and-life-events | — | bereavement, grief, condolences |
| `janazah` | nature-and-life-events | — | funeral prayer, funeral |
| `ramadan` | sacred-times-and-journeys | — | fasting month, the fast |
| `dhul-hijjah` | sacred-times-and-journeys | — | first ten days, day of arafah |
| `hajj-and-umrah` | sacred-times-and-journeys | `hajj`, `umrah` | **hajj**, **umrah**, pilgrimage |

## Worked examples from the brief

- **"After Sleep" → Waking Up.** `resolveCollectionSlug("after sleep")` returns `waking-up`. No separate "After Sleep" collection exists.
- **"Eating" → Food & Drink.** Resolves to `food-and-drink`.
- **"Travelling"/"Travel" → one collection.** Both resolve to `travel`; "entering a car" resolves to the `entering-a-car` subcategory of `travel`.
- **"Entering home"/"Leaving home" → subcategories of Home.** Both resolve to `home`, filterable by subcategory.
- **"Before Wudu"/"After Wudu" → within Lavatory & Wuḍūʾ.** Both resolve to `lavatory-and-wudu`, filterable by subcategory.
- **"Hajj"/"Umrah"/"Hajj & Umrah" → one parent-child structure.** All resolve to `hajj-and-umrah`, with `hajj` and `umrah` as its subcategories.
- **"Children", "Parents", "Marriage", "Newborn" stay directly discoverable** as their own collections, while `marriage-and-children` is a separate umbrella collection whose `relatedGroupSlugs` links to all four (see `duaDhikrCollection.relatedCollections` in Sanity, and the "Related collections" section rendered on each of their pages) — never a duplicate copy of their content.
- **The repeated "After Salah" item** in the brief collapses to the single `after-salah` collection — no duplicate is created.

## How this is enforced, not just documented

- `duaDhikrCollection.slug` (Sanity Studio) is validated against
  `CANONICAL_COLLECTION_SLUGS` — an editor cannot save a collection whose
  slug isn't in this list, which prevents a second collection being created
  for a concept that already exists under a different name.
- `tests/dua-dhikr/dua-dhikr-taxonomy.test.ts` asserts every alias in the
  brief resolves to the expected collection and that no two canonical
  collections share a slug or an alias.
