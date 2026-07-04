/**
 * Search Index Configuration — version-controlled.
 *
 * Applied via CI (settings-as-config), never hand-edited in the dashboard.
 * Relevance config is reproducible and portable.
 */

import type { IndexSettings } from "../engine";

export const contentIndexConfig: IndexSettings = {
  searchableAttributes: [
    "title",
    "subtitle,aliases,transliteration",
    "keywords",
    "excerpt,body",
  ],
  attributesForFaceting: [
    "type",
    "condition",
    "ingredient",
    "bodySystem",
    "evidenceLevel",
    "hadithAuthenticity",
    "preparation",
    "difficulty",
    "audience",
    "pregnancySafe",
    "children",
    "usageType",
    "availability",
    "category",
    "collection",
    "courseLevel",
    "scholar",
    "author",
    "publicationDate",
  ],
  customRanking: [
    "desc(editorialWeight)",
    "desc(popularity)",
    "desc(recency)",
  ],
  synonyms: [
    { type: "synonym", words: ["black seed", "nigella sativa", "habbat al-barakah", "kalonji", "حبة البركة"] },
    { type: "synonym", words: ["honey", "asal", "عسل"] },
    { type: "synonym", words: ["cupping", "hijama", "hijamah", "حجامة", "wet cupping"] },
    { type: "synonym", words: ["senna", "sana makki", "سنا مكي"] },
    { type: "synonym", words: ["olive oil", "zayt al-zaytun", "زيت الزيتون"] },
    { type: "synonym", words: ["fasting", "siyam", "صيام", "sawm"] },
    { type: "synonym", words: ["prophetic medicine", "tibb nabawi", "طب نبوي", "tibb al-nabawi"] },
    { type: "synonym", words: ["zamzam", "zam zam", "zamzam water"] },
    { type: "synonym", words: ["sidr", "lote tree", "nabk", "سدر"] },
    { type: "synonym", words: ["henna", "hina", "حناء"] },
    { type: "synonym", words: ["talbina", "talbinah", "barley porridge"] },
    { type: "synonym", words: ["miswak", "siwak", "مسواك"] },
    { type: "oneWaySynonym", words: ["digestive"], input: "stomach" },
    { type: "oneWaySynonym", words: ["immune system"], input: "immunity" },
    { type: "oneWaySynonym", words: ["respiratory"], input: "breathing" },
  ],
};

/**
 * Pinned results — curated institutional answers for specific queries.
 * Maps query patterns to objectIDs that should appear first.
 */
export const pinnedResults: Record<string, string[]> = {
  "prophetic medicine": ["institution-about"],
  "what is tibb nabawi": ["institution-about"],
  "consultations": ["consultations-page"],
  "courses": ["academy-overview"],
  "hijama": ["hijama-course", "hijama-ingredient"],
  "sacred journeys": ["journeys-overview"],
};
