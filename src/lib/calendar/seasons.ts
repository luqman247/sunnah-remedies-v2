/**
 * Seasonal Rhythm — the Institution's sense of time.
 *
 * The digital estate observes the Islamic calendar's major seasons,
 * producing gentle shifts in tone, colour accent, and featured content.
 * These are NOT flashy marketing campaigns — they are quiet, reverent
 * acknowledgements that the tradition lives inside time.
 *
 * "The Gardens become the estate's seasonal rhythm and its moments of
 * reflection and beauty — the digital calendar breathing with planting,
 * harvest, Ramadan, and the sacred year."
 */

export type Season =
  | "ramadan"
  | "hajj"
  | "dhul-hijjah"
  | "rabi-al-awwal"
  | "muharram"
  | "standard";

export interface SeasonalContext {
  season: Season;
  label: string;
  greeting?: string;
  reflection?: string;
  accentClass: string;
}

const SEASONS: Record<Season, Omit<SeasonalContext, "season">> = {
  ramadan: {
    label: "Ramaḍān",
    greeting: "The month of patience and the month in which the Qur'ān was revealed",
    reflection: "The Institute enters its most reverent season — commerce set aside, the sacred brought forward",
    accentClass: "season--ramadan",
  },
  hajj: {
    label: "The Days of Ḥajj",
    greeting: "The best days of the year upon which the sun rises",
    reflection: "The Sacred Journeys community gathers — preparation, purpose, and the duty of care",
    accentClass: "season--hajj",
  },
  "dhul-hijjah": {
    label: "Dhūl Ḥijjah",
    greeting: "The sacred month of pilgrimage",
    reflection: "The first ten days — no deeds are more beloved to Allah than those performed in these days",
    accentClass: "season--hajj",
  },
  "rabi-al-awwal": {
    label: "Rabīʿ al-Awwal",
    greeting: "The month of the Prophetic birth — ṣallā Allāhu ʿalayhi wa sallam",
    reflection: "The tradition we preserve and practise has its origin in mercy sent to all the worlds",
    accentClass: "season--mawlid",
  },
  muharram: {
    label: "Muḥarram",
    greeting: "The sacred month — a new year for the community",
    reflection: "A new Hijrī year begins — the Institution renews its covenant with knowledge and service",
    accentClass: "season--muharram",
  },
  standard: {
    label: "",
    accentClass: "",
  },
};

/**
 * Approximate Hijri month detection.
 *
 * Uses the Intl API's Islamic calendar support. On browsers/runtimes
 * that don't support it, falls back to "standard" season.
 */
export function getCurrentSeason(): SeasonalContext {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
      month: "numeric",
      day: "numeric",
    });

    const parts = formatter.formatToParts(new Date());
    const monthPart = parts.find(p => p.type === "month");
    const dayPart = parts.find(p => p.type === "day");
    const hijriMonth = monthPart ? parseInt(monthPart.value, 10) : 0;
    const hijriDay = dayPart ? parseInt(dayPart.value, 10) : 1;

    let season: Season = "standard";
    if (hijriMonth === 9) season = "ramadan";
    else if (hijriMonth === 12 && hijriDay <= 13) season = "hajj";
    else if (hijriMonth === 12) season = "dhul-hijjah";
    else if (hijriMonth === 3) season = "rabi-al-awwal";
    else if (hijriMonth === 1) season = "muharram";

    return { season, ...SEASONS[season] };
  } catch {
    return { season: "standard", ...SEASONS.standard };
  }
}

/**
 * Get Hijri date string for display.
 */
export function getHijriDate(): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(new Date());
  } catch {
    return "";
  }
}

/**
 * Get the current Hijri year.
 */
export function getHijriYear(): number {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", {
      year: "numeric",
    });
    return parseInt(formatter.format(new Date()), 10);
  } catch {
    return 0;
  }
}

/* ── The Institutional Year ─────────────────────────────────────── */

export interface InstitutionalEvent {
  id: string;
  title: string;
  season: Season | "standard";
  hijriMonth: number;
  description: string;
  category: "ceremony" | "gathering" | "season" | "garden";
}

export const INSTITUTIONAL_YEAR: InstitutionalEvent[] = [
  {
    id: "new-year",
    title: "The New Hijrī Year",
    season: "muharram",
    hijriMonth: 1,
    description: "The Institution marks the turning of the year with reflection on what was built and what lies ahead",
    category: "ceremony",
  },
  {
    id: "mawlid",
    title: "The Prophetic Month",
    season: "rabi-al-awwal",
    hijriMonth: 3,
    description: "Readings and reflection on the Prophetic biography and the tradition of mercy that founded this work",
    category: "season",
  },
  {
    id: "spring-planting",
    title: "The Planting",
    season: "standard",
    hijriMonth: 4,
    description: "The medicinal garden's annual cycle begins — the community gathers to plant the materia medica",
    category: "garden",
  },
  {
    id: "annual-lecture",
    title: "The Annual Lecture",
    season: "standard",
    hijriMonth: 6,
    description: "A great public lecture by a leading scholar or physician — the Institute's principal act of public teaching",
    category: "gathering",
  },
  {
    id: "ramadan-programme",
    title: "The Ramaḍān Programme",
    season: "ramadan",
    hijriMonth: 9,
    description: "The Institute's most reverent season — reflective gatherings, adhkār prepared for the month, charitable care extended, and commerce set aside",
    category: "season",
  },
  {
    id: "annual-conference",
    title: "The Annual Conference",
    season: "standard",
    hijriMonth: 10,
    description: "The gathering of scholars, physicians, and researchers of Prophetic Medicine — building the field and the Institute's standing",
    category: "gathering",
  },
  {
    id: "harvest",
    title: "The Harvest",
    season: "standard",
    hijriMonth: 11,
    description: "The medicinal beds yield their harvest — the community gathers to bring in the materia medica and prepare for the year's remedies",
    category: "garden",
  },
  {
    id: "hajj-season",
    title: "The Sacred Journeys Season",
    season: "hajj",
    hijriMonth: 12,
    description: "Preparation, reading, and the duty of care — the pilgrimage community gathers, departs, and returns to lifelong companionship",
    category: "season",
  },
  {
    id: "ijaza-ceremony",
    title: "The Ijāzah Ceremony",
    season: "standard",
    hijriMonth: 12,
    description: "The annual conferral of licences — graduates named, honoured, and sent out as links in the chain of teaching",
    category: "ceremony",
  },
];

/**
 * Returns events grouped by their category.
 */
export function getEventsByCategory(): Record<string, InstitutionalEvent[]> {
  const grouped: Record<string, InstitutionalEvent[]> = {};
  for (const event of INSTITUTIONAL_YEAR) {
    if (!grouped[event.category]) grouped[event.category] = [];
    grouped[event.category].push(event);
  }
  return grouped;
}

/**
 * Returns the next upcoming event based on current Hijri month.
 */
export function getNextEvent(): InstitutionalEvent | null {
  try {
    const formatter = new Intl.DateTimeFormat("en-u-ca-islamic", { month: "numeric" });
    const currentMonth = parseInt(formatter.format(new Date()), 10);

    const upcoming = INSTITUTIONAL_YEAR.filter(e => e.hijriMonth > currentMonth);
    if (upcoming.length > 0) return upcoming[0];

    return INSTITUTIONAL_YEAR[0];
  } catch {
    return null;
  }
}
