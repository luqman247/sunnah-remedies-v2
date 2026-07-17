/**
 * Duʿā & Dhikr — canonical taxonomy and alias map.
 *
 * Single source of truth for the parent-group / collection / subcategory
 * structure described in docs/dua-dhikr/CATEGORY_ALIAS_MAP.md. Sanity's
 * `duaDhikrCollection.parentGroup` and `iconKey` option lists are generated
 * from this file's constants (not hand-duplicated), and the search/filter
 * layer resolves every alias in ALIAS_MAP back to exactly one canonical
 * collection slug — never to a second, competing collection.
 *
 * Do not add a new collection here that duplicates an existing concept
 * under a different name; add the new name to that collection's `aliases`
 * array instead. See docs/dua-dhikr/CATEGORY_ALIAS_MAP.md for the worked
 * examples (After Sleep → Waking Up, Eating → Food & Drink, etc.).
 */

export const PARENT_GROUPS = [
  { key: "daily-foundations", titleEn: "Daily Foundations", titleDa: "Daglige Grundpiller" },
  { key: "everyday-life", titleEn: "Everyday Life", titleDa: "Hverdagsliv" },
  { key: "family-and-relationships", titleEn: "Family & Relationships", titleDa: "Familie & Relationer" },
  { key: "faith-protection-and-healing", titleEn: "Faith, Protection & Healing", titleDa: "Tro, Beskyttelse & Helbredelse" },
  { key: "quran-and-sunnah-collections", titleEn: "Qurʾān & Sunnah Collections", titleDa: "Qurʾān- & Sunnah-Samlinger" },
  { key: "nature-and-life-events", titleEn: "Nature & Life Events", titleDa: "Naturen & Livsbegivenheder" },
  { key: "sacred-times-and-journeys", titleEn: "Sacred Times & Journeys", titleDa: "Hellige Tider & Rejser" },
] as const;

export type ParentGroupKey = (typeof PARENT_GROUPS)[number]["key"];

/** Original, restrained line-icon keys — see src/components/dua-dhikr/icons.tsx. */
export const ICON_KEYS = [
  "sunrise",
  "moon-bedding",
  "prayer-mat",
  "tasbih",
  "bedding-crescent",
  "waking-sun",
  "minaret",
  "istikharah-compass",
  "plate-cup",
  "doorway",
  "garment",
  "water-droplet",
  "journey-path",
  "gathering-circle",
  "handshake",
  "coin",
  "family-abstract",
  "child-abstract",
  "cradle",
  "rings",
  "shield",
  "heart-hands",
  "cloud-worry",
  "open-quran",
  "salawat-star",
  "beautiful-names",
  "cloud-raindrop",
  "wind-lines",
  "leaf-branch",
  "crescent-fade",
  "janazah-arch",
  "crescent-moon",
  "mountain-path",
  "kaaba-outline",
  "leaf",
] as const;

export type IconKey = (typeof ICON_KEYS)[number];

export interface CanonicalSubcategory {
  slug: string;
  titleEn: string;
  titleDa?: string;
  /** Extra search terms that resolve to this subcategory specifically. */
  aliases?: string[];
}

export interface CanonicalCollection {
  slug: string;
  parentGroup: ParentGroupKey;
  titleEn: string;
  titleDa?: string;
  descriptionEn: string;
  /** Optional Danish override, layered in from a duaDhikrCollection Sanity document — the taxonomy itself only authors English descriptions. */
  descriptionDa?: string;
  iconKey: IconKey;
  /** Alternate terms users may search/filter by that all resolve to this collection. */
  aliases: string[];
  subcategories?: CanonicalSubcategory[];
  /** Slugs of other canonical collections this one is conceptually grouped with (umbrella relationships), e.g. Marriage & Children. */
  relatedGroupSlugs?: string[];
  /** External route this collection defers to instead of a Duʿā & Dhikr collection page (Morning/Evening Dhikr). */
  externalHref?: string;
}

export const CANONICAL_COLLECTIONS: CanonicalCollection[] = [
  // A. Daily Foundations
  {
    slug: "morning-dhikr",
    parentGroup: "daily-foundations",
    titleEn: "Morning Dhikr",
    descriptionEn: "The Sunnah remembrances for the start of the day.",
    iconKey: "sunrise",
    aliases: ["morning", "morning adhkar", "morning remembrance"],
    externalHref: "/knowledge/dhikr/morning",
  },
  {
    slug: "evening-dhikr",
    parentGroup: "daily-foundations",
    titleEn: "Evening Dhikr",
    descriptionEn: "The Sunnah remembrances for the close of the day.",
    iconKey: "moon-bedding",
    aliases: ["evening", "evening adhkar", "evening remembrance"],
    externalHref: "/knowledge/dhikr/evening",
  },
  {
    slug: "after-salah",
    parentGroup: "daily-foundations",
    titleEn: "After Salah",
    descriptionEn: "Remembrance recited after the completion of the five daily prayers.",
    iconKey: "prayer-mat",
    aliases: ["after prayer", "post-salah", "after salaah", "after salat"],
  },
  {
    slug: "before-sleep",
    parentGroup: "daily-foundations",
    titleEn: "Before Sleep",
    descriptionEn: "Remembrance recited before retiring for the night.",
    iconKey: "bedding-crescent",
    aliases: ["going to sleep", "bedtime", "night duas"],
  },
  {
    slug: "waking-up",
    parentGroup: "daily-foundations",
    titleEn: "Waking Up",
    descriptionEn: "Remembrance recited upon waking.",
    iconKey: "waking-sun",
    aliases: ["after sleep", "on waking", "upon waking"],
  },
  {
    slug: "tahajjud",
    parentGroup: "daily-foundations",
    titleEn: "Tahajjud",
    descriptionEn: "Remembrance and duʿā associated with the night prayer.",
    iconKey: "crescent-moon",
    aliases: ["night prayer", "qiyam al-layl"],
  },
  {
    slug: "adhan-and-masjid",
    parentGroup: "daily-foundations",
    titleEn: "Adhan & Masjid",
    descriptionEn: "Remembrance for the call to prayer and entering or leaving the masjid.",
    iconKey: "minaret",
    aliases: ["call to prayer", "mosque", "entering the mosque", "leaving the mosque"],
  },
  {
    slug: "istikharah",
    parentGroup: "daily-foundations",
    titleEn: "Istikharah",
    descriptionEn: "The prayer and duʿā of seeking Allah's guidance in a decision.",
    iconKey: "istikharah-compass",
    aliases: ["prayer of guidance", "seeking guidance"],
  },

  // B. Everyday Life
  {
    slug: "food-and-drink",
    parentGroup: "everyday-life",
    titleEn: "Food & Drink",
    descriptionEn: "Remembrance for beginning and finishing food and drink.",
    iconKey: "plate-cup",
    aliases: ["eating", "meals", "drinking", "before eating", "after eating"],
  },
  {
    slug: "home",
    parentGroup: "everyday-life",
    titleEn: "Home",
    descriptionEn: "Remembrance for entering and leaving the home.",
    iconKey: "doorway",
    aliases: ["house"],
    subcategories: [
      { slug: "entering-home", titleEn: "Entering Home", aliases: ["entering the house"] },
      { slug: "leaving-home", titleEn: "Leaving Home", aliases: ["leaving the house"] },
    ],
  },
  {
    slug: "clothes",
    parentGroup: "everyday-life",
    titleEn: "Clothes",
    descriptionEn: "Remembrance for dressing and undressing.",
    iconKey: "garment",
    aliases: ["dressing", "wearing new clothes"],
  },
  {
    slug: "lavatory-and-wudu",
    parentGroup: "everyday-life",
    titleEn: "Lavatory & Wuḍūʾ",
    descriptionEn: "Remembrance for the lavatory and for ablution.",
    iconKey: "water-droplet",
    aliases: ["wudu", "wudhu", "ablution", "toilet", "lavatory"],
    subcategories: [
      { slug: "before-wudu", titleEn: "Before Wuḍūʾ", aliases: ["before wudu", "before wudhu"] },
      { slug: "after-wudu", titleEn: "After Wuḍūʾ", aliases: ["after wudu", "after wudhu"] },
    ],
  },
  {
    slug: "travel",
    parentGroup: "everyday-life",
    titleEn: "Travel",
    descriptionEn: "Remembrance for journeys, by any means.",
    iconKey: "journey-path",
    aliases: ["travelling", "traveling", "journey", "vehicle", "car"],
    subcategories: [{ slug: "entering-a-car", titleEn: "Entering a Vehicle", aliases: ["entering a car"] }],
  },
  {
    slug: "gatherings",
    parentGroup: "everyday-life",
    titleEn: "Gatherings",
    descriptionEn: "Remembrance for beginning and closing a gathering.",
    iconKey: "gathering-circle",
    aliases: ["sitting with others", "closing a gathering", "kaffarat al-majlis"],
  },
  {
    slug: "social-interactions",
    parentGroup: "everyday-life",
    titleEn: "Social Interactions",
    descriptionEn: "Remembrance for greetings, visits, and everyday exchanges.",
    iconKey: "handshake",
    aliases: ["greetings", "visiting others", "sneezing"],
  },
  {
    slug: "money-and-shopping",
    parentGroup: "everyday-life",
    titleEn: "Money & Shopping",
    descriptionEn: "Remembrance for trade, debt, and provision.",
    iconKey: "coin",
    aliases: ["shopping", "the marketplace", "debt", "provision"],
  },

  // C. Family & Relationships
  {
    slug: "marriage-and-children",
    parentGroup: "family-and-relationships",
    titleEn: "Marriage & Children",
    descriptionEn: "The wider family collection, gathering Parents, Children, Newborn, and Marriage.",
    iconKey: "family-abstract",
    aliases: ["family"],
    relatedGroupSlugs: ["parents", "children", "newborn", "marriage"],
  },
  {
    slug: "parents",
    parentGroup: "family-and-relationships",
    titleEn: "Parents",
    descriptionEn: "Remembrance and duʿā for one's parents.",
    iconKey: "family-abstract",
    aliases: [],
    relatedGroupSlugs: ["marriage-and-children"],
  },
  {
    slug: "children",
    parentGroup: "family-and-relationships",
    titleEn: "Children",
    descriptionEn: "Remembrance and duʿā for one's children.",
    iconKey: "child-abstract",
    aliases: [],
    relatedGroupSlugs: ["marriage-and-children"],
  },
  {
    slug: "newborn",
    parentGroup: "family-and-relationships",
    titleEn: "Newborn",
    descriptionEn: "Remembrance and duʿā for a newborn child.",
    iconKey: "cradle",
    aliases: ["new baby", "birth"],
    relatedGroupSlugs: ["marriage-and-children"],
  },
  {
    slug: "marriage",
    parentGroup: "family-and-relationships",
    titleEn: "Marriage",
    descriptionEn: "Remembrance and duʿā for marriage.",
    iconKey: "rings",
    aliases: ["wedding", "spouse"],
    relatedGroupSlugs: ["marriage-and-children"],
  },

  // D. Faith, Protection & Healing
  {
    slug: "ruqyah-and-illness",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Ruqyah & Illness",
    descriptionEn: "Remembrance for sickness and seeking a cure.",
    iconKey: "shield",
    aliases: ["ruqya", "sickness", "healing", "illness"],
  },
  {
    slug: "protection-of-iman",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Protection of Īmān",
    descriptionEn: "Remembrance for the protection and strengthening of faith.",
    iconKey: "shield",
    aliases: ["faith protection", "steadfastness"],
  },
  {
    slug: "nightmares",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Nightmares",
    descriptionEn: "Remembrance for bad dreams and nightmares.",
    iconKey: "cloud-worry",
    aliases: ["bad dreams"],
  },
  {
    slug: "difficulties-and-happiness",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Difficulties & Happiness",
    descriptionEn: "Remembrance for hardship, anxiety, and gratitude in ease.",
    iconKey: "heart-hands",
    aliases: ["hardship", "anxiety", "worry", "gratitude", "distress"],
  },
  {
    slug: "istighfar",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Istighfar",
    descriptionEn: "Seeking Allah's forgiveness.",
    iconKey: "tasbih",
    aliases: ["seeking forgiveness", "repentance"],
  },
  {
    slug: "praises-of-allah",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Praises of Allah",
    descriptionEn: "Remembrance in praise and glorification of Allah.",
    iconKey: "tasbih",
    aliases: ["tasbih", "glorification", "dhikr of praise"],
  },
  {
    slug: "salawat",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Ṣalawāt",
    descriptionEn: "Sending blessings upon the Prophet ﷺ.",
    iconKey: "salawat-star",
    aliases: ["blessings on the prophet", "durood"],
  },
  {
    slug: "names-of-allah",
    parentGroup: "faith-protection-and-healing",
    titleEn: "Names of Allah",
    descriptionEn: "Duʿā through Allah's Most Beautiful Names.",
    iconKey: "beautiful-names",
    aliases: ["asma ul husna", "the beautiful names"],
  },

  // E. Qurʾān & Sunnah Collections
  {
    slug: "quranic-duas",
    parentGroup: "quran-and-sunnah-collections",
    titleEn: "Qurʾānic Duʿās",
    descriptionEn: "Duʿās drawn directly from the Qurʾān.",
    iconKey: "open-quran",
    aliases: ["duas from the quran", "quran duas"],
  },
  {
    slug: "sunnah-duas",
    parentGroup: "quran-and-sunnah-collections",
    titleEn: "Sunnah Duʿās",
    descriptionEn: "Duʿās taught by the Prophet ﷺ in the authentic Sunnah.",
    iconKey: "open-quran",
    aliases: ["prophetic duas", "hadith duas"],
  },

  // F. Nature & Life Events
  {
    slug: "rain",
    parentGroup: "nature-and-life-events",
    titleEn: "Rain",
    descriptionEn: "Remembrance for rainfall.",
    iconKey: "cloud-raindrop",
    aliases: ["rainfall", "thunder"],
  },
  {
    slug: "wind",
    parentGroup: "nature-and-life-events",
    titleEn: "Wind",
    descriptionEn: "Remembrance for strong wind.",
    iconKey: "wind-lines",
    aliases: ["strong wind", "storm"],
  },
  {
    slug: "nature",
    parentGroup: "nature-and-life-events",
    titleEn: "Nature",
    descriptionEn: "Remembrance for the wider natural world.",
    iconKey: "leaf-branch",
    aliases: ["the natural world", "creation"],
  },
  {
    slug: "death",
    parentGroup: "nature-and-life-events",
    titleEn: "Death",
    descriptionEn: "Remembrance for facing the death of a loved one.",
    iconKey: "crescent-fade",
    aliases: ["bereavement", "grief", "condolences"],
  },
  {
    slug: "janazah",
    parentGroup: "nature-and-life-events",
    titleEn: "Janāzah",
    descriptionEn: "Remembrance for the funeral prayer.",
    iconKey: "janazah-arch",
    aliases: ["funeral prayer", "funeral"],
  },

  // G. Sacred Times & Journeys
  {
    slug: "ramadan",
    parentGroup: "sacred-times-and-journeys",
    titleEn: "Ramaḍān",
    descriptionEn: "Remembrance for the month of fasting.",
    iconKey: "crescent-moon",
    aliases: ["fasting month", "the fast"],
  },
  {
    slug: "dhul-hijjah",
    parentGroup: "sacred-times-and-journeys",
    titleEn: "Dhūl Ḥijjah",
    descriptionEn: "Remembrance for the first ten days of Dhūl Ḥijjah.",
    iconKey: "mountain-path",
    aliases: ["first ten days", "day of arafah"],
  },
  {
    slug: "hajj-and-umrah",
    parentGroup: "sacred-times-and-journeys",
    titleEn: "Ḥajj & ʿUmrah",
    descriptionEn: "Remembrance for the pilgrimage rites of Ḥajj and ʿUmrah.",
    iconKey: "kaaba-outline",
    aliases: ["hajj", "umrah", "pilgrimage", "hajj & umrah", "hajj and umrah"],
    subcategories: [
      { slug: "hajj", titleEn: "Ḥajj" },
      { slug: "umrah", titleEn: "ʿUmrah" },
    ],
  },
];

/** Every canonical collection slug, for schema option lists and validation. */
export const CANONICAL_COLLECTION_SLUGS = CANONICAL_COLLECTIONS.map((c) => c.slug);

/**
 * Alias → canonical collection slug, built once from CANONICAL_COLLECTIONS
 * (each collection's own slug and titleEn also resolve to itself). Lookups
 * are case-insensitive; the map itself stores lower-cased keys.
 */
function buildAliasMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const collection of CANONICAL_COLLECTIONS) {
    const terms = [collection.slug, collection.titleEn, ...collection.aliases];
    for (const term of terms) {
      const key = term.trim().toLowerCase();
      if (!map.has(key)) map.set(key, collection.slug);
    }
    for (const sub of collection.subcategories ?? []) {
      const subTerms = [sub.slug, sub.titleEn, ...(sub.aliases ?? [])];
      for (const term of subTerms) {
        const key = term.trim().toLowerCase();
        if (!map.has(key)) map.set(key, collection.slug);
      }
    }
  }
  return map;
}

export const ALIAS_MAP: Map<string, string> = buildAliasMap();

/** Resolve any supplied term (canonical name or alias) to its canonical collection slug, or undefined if unrecognised. */
export function resolveCollectionSlug(term: string): string | undefined {
  return ALIAS_MAP.get(term.trim().toLowerCase());
}

export function getCanonicalCollection(slug: string): CanonicalCollection | undefined {
  return CANONICAL_COLLECTIONS.find((c) => c.slug === slug);
}

export function getCollectionsByParentGroup(parentGroup: ParentGroupKey): CanonicalCollection[] {
  return CANONICAL_COLLECTIONS.filter((c) => c.parentGroup === parentGroup);
}
