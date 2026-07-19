/**
 * "I am feeling…" — canonical taxonomy.
 *
 * Single source of truth for the family / feeling-state structure described
 * in docs/i-am-feeling/SPEC.md §4. Mirrors the discipline already
 * established in src/lib/dua-dhikr/taxonomy.ts: this fixed, curated file —
 * not Sanity — is what determines which routes exist at all.
 * feelingFamily/feelingState Sanity documents are optional, additive
 * editorial enrichment layered on top (their own curatorial copy, gated by
 * reviewStatus/safeguardingLevel — see src/sanity/lib/feeling-publication-gate.ts),
 * never a second source of routing truth.
 *
 * Every state below exists in this file regardless of launch status, so the
 * architecture is complete even where launchStatus keeps a public route
 * from being generated (deferred/not-suitable states never reach
 * generateStaticParams — see src/app/[locale]/i-am-feeling/[feelingSlug]/page.tsx).
 */

export const FEELING_FAMILIES = [
  {
    key: "heart-feels-heavy",
    titleEn: "When the Heart Feels Heavy",
    titleDa: "Når hjertet føles tungt",
    order: 1,
  },
  {
    key: "mind-wont-settle",
    titleEn: "When the Mind Will Not Settle",
    titleDa: "Når sindet ikke vil falde til ro",
    order: 2,
  },
  {
    key: "emotions-feel-intense",
    titleEn: "When Emotions Feel Intense",
    titleDa: "Når følelserne føles intense",
    order: 3,
  },
  {
    key: "faith-feels-distant",
    titleEn: "When Faith Feels Distant",
    titleDa: "Når troen føles fjern",
    order: 4,
  },
  {
    key: "heart-feels-open",
    titleEn: "When the Heart Feels Open",
    titleDa: "Når hjertet føles åbent",
    order: 5,
  },
  {
    key: "facing-change-or-difficulty",
    titleEn: "When Facing Change or Difficulty",
    titleDa: "Når man står over for forandring eller modgang",
    order: 6,
  },
] as const;

export type FeelingFamilyKey = (typeof FEELING_FAMILIES)[number]["key"];

export type FeelingTone =
  | "heavy"
  | "unsettled"
  | "intense"
  | "distant"
  | "open"
  | "transitional";

export type FeelingLaunchStatus = "launch" | "deferred" | "not-suitable";

export type FeelingSafeguardingLevel = "standard" | "heightened" | "crisis-adjacent";

export interface CanonicalFeelingState {
  slug: string;
  family: FeelingFamilyKey;
  labelEn: string;
  labelDa?: string;
  oneLineDescriptionEn: string;
  oneLineDescriptionDa?: string;
  tone: FeelingTone;
  launchStatus: FeelingLaunchStatus;
  safeguardingLevel: FeelingSafeguardingLevel;
  /** Alternate terms users may search/filter by that all resolve to this state. */
  aliases: string[];
  /** Slugs of other canonical states this one is related to. */
  relatedSlugs: string[];
  /** Human-readable note on why a non-launch state is deferred/excluded — never shown publicly. */
  deferralNote?: string;
}

export const CANONICAL_FEELING_STATES: CanonicalFeelingState[] = [
  // A. When the Heart Feels Heavy
  {
    slug: "grieving-a-loss",
    family: "heart-feels-heavy",
    labelEn: "Grieving a Loss",
    labelDa: "Sorg over et tab",
    oneLineDescriptionEn: "For when someone or something dear has gone.",
    oneLineDescriptionDa: "For når nogen eller noget kært er gået bort.",
    tone: "heavy",
    launchStatus: "launch",
    safeguardingLevel: "heightened",
    aliases: ["bereavement", "grief", "loss", "mourning"],
    relatedSlugs: ["feeling-alone", "feeling-distant-from-allah"],
  },
  {
    slug: "feeling-alone",
    family: "heart-feels-heavy",
    labelEn: "Feeling Alone",
    labelDa: "At føle sig alene",
    oneLineDescriptionEn: "For when the people around you don't feel close enough.",
    oneLineDescriptionDa: "For når dem omkring dig ikke føles tætte nok.",
    tone: "heavy",
    launchStatus: "launch",
    safeguardingLevel: "heightened",
    aliases: ["unloved", "isolated", "lonely", "loneliness"],
    relatedSlugs: ["grieving-a-loss", "feeling-distant-from-allah"],
  },
  {
    slug: "weighed-down-by-guilt",
    family: "heart-feels-heavy",
    labelEn: "Weighed Down by Guilt or Regret",
    labelDa: "Tynget af skyld eller fortrydelse",
    oneLineDescriptionEn: "For when something you did — or didn't do — won't leave you alone.",
    oneLineDescriptionDa: "For når noget du gjorde — eller ikke gjorde — ikke slipper dig.",
    tone: "heavy",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["guilty", "regret", "ashamed", "humiliated"],
    relatedSlugs: ["struggling-with-sincerity", "feeling-distant-from-allah"],
  },
  {
    slug: "feeling-disappointed",
    family: "heart-feels-heavy",
    labelEn: "Feeling Let Down",
    labelDa: "At føle sig svigtet",
    oneLineDescriptionEn: "For when someone or something didn't meet what you hoped for.",
    oneLineDescriptionDa: "For når nogen eller noget ikke levede op til det, du håbede.",
    tone: "heavy",
    launchStatus: "deferred",
    safeguardingLevel: "standard",
    aliases: ["hurt", "let down", "disappointed"],
    relatedSlugs: ["grieving-a-loss"],
    deferralNote:
      "Insufficient content differentiation from grief/hardship at launch — revisit with usage data (SPEC §4).",
  },

  // B. When the Mind Will Not Settle
  {
    slug: "feeling-anxious",
    family: "mind-wont-settle",
    labelEn: "Anxious or Worried",
    labelDa: "Ængstelig eller bekymret",
    oneLineDescriptionEn: "For when your thoughts won't stop turning something over.",
    oneLineDescriptionDa: "For når dine tanker ikke kan lade noget ligge.",
    tone: "unsettled",
    launchStatus: "launch",
    safeguardingLevel: "heightened",
    aliases: ["worried", "nervous", "insecure", "on edge", "uneasy"],
    relatedSlugs: ["feeling-overwhelmed", "restless-at-night"],
  },
  {
    slug: "feeling-overwhelmed",
    family: "mind-wont-settle",
    labelEn: "Overwhelmed",
    labelDa: "Overvældet",
    oneLineDescriptionEn: "For when there's simply too much at once.",
    oneLineDescriptionDa: "For når det hele bliver for meget på én gang.",
    tone: "unsettled",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["weak", "defeated", "discouraged"],
    relatedSlugs: ["feeling-anxious", "feeling-weary"],
  },
  {
    slug: "restless-at-night",
    family: "mind-wont-settle",
    labelEn: "Restless at Night",
    labelDa: "Urolig om natten",
    oneLineDescriptionEn: "For when sleep won't come, or brings bad dreams.",
    oneLineDescriptionDa: "For når søvnen udebliver, eller bringer onde drømme.",
    tone: "unsettled",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["nightmares", "bad dreams", "insomnia", "can't sleep"],
    relatedSlugs: ["feeling-anxious"],
  },
  {
    slug: "feeling-weary",
    family: "mind-wont-settle",
    labelEn: "Feeling Weary",
    labelDa: "At føle sig udmattet",
    oneLineDescriptionEn: "For when you're simply tired — in a way rest alone doesn't fix.",
    oneLineDescriptionDa: "For når du blot er træt — på en måde hvile alene ikke løser.",
    tone: "unsettled",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["tired", "exhausted", "drained"],
    relatedSlugs: ["feeling-overwhelmed", "facing-illness"],
  },

  // C. When Emotions Feel Intense
  {
    slug: "feeling-angry",
    family: "emotions-feel-intense",
    labelEn: "Angry or Frustrated",
    labelDa: "Vred eller frustreret",
    oneLineDescriptionEn: "For when something has stirred real anger.",
    oneLineDescriptionDa: "For når noget har vakt ægte vrede.",
    tone: "intense",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["frustrated", "irritated", "rage", "offended"],
    relatedSlugs: ["struggling-with-envy"],
  },
  {
    slug: "struggling-with-envy",
    family: "emotions-feel-intense",
    labelEn: "Struggling with Envy",
    labelDa: "Kæmper med misundelse",
    oneLineDescriptionEn: "For when you notice envy and don't want to carry it.",
    oneLineDescriptionDa: "For når du mærker misundelse og ikke ønsker at bære den.",
    tone: "intense",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["jealous", "envious"],
    relatedSlugs: ["struggling-with-sincerity"],
  },
  {
    slug: "feeling-impatient",
    family: "emotions-feel-intense",
    labelEn: "Impatient",
    labelDa: "Utålmodig",
    oneLineDescriptionEn: "For when waiting feels unbearable.",
    oneLineDescriptionDa: "For når ventetiden føles uudholdelig.",
    tone: "intense",
    launchStatus: "deferred",
    safeguardingLevel: "standard",
    aliases: ["impatient", "restless", "can't wait"],
    relatedSlugs: ["facing-a-decision"],
    deferralNote: "Marginal distinctiveness from Overwhelmed/Anxious at launch — park for v2 review (SPEC §4).",
  },

  // D. When Faith Feels Distant
  {
    slug: "feeling-distant-from-allah",
    family: "faith-feels-distant",
    labelEn: "Distant from Allah",
    labelDa: "Fjern fra Allah",
    oneLineDescriptionEn: "For when worship feels far away, or hard to feel.",
    oneLineDescriptionDa: "For når tilbedelse føles fjern, eller svær at mærke.",
    tone: "distant",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["spiritually numb", "disconnected"],
    relatedSlugs: ["struggling-with-sincerity", "troubled-by-doubts"],
  },
  {
    slug: "struggling-with-sincerity",
    family: "faith-feels-distant",
    labelEn: "Struggling with Sincerity",
    labelDa: "Kæmper med oprigtighed",
    oneLineDescriptionEn: "For when you're unsure your heart is in what you're doing.",
    oneLineDescriptionDa: "For når du er usikker på, om dit hjerte er med i det, du gør.",
    tone: "distant",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    // "hypocritical"/"hypocrite" is a deliberate compassionate-reframing alias — SPEC §7.2.
    aliases: ["hypocritical", "hypocrite", "hypocrisy", "not sincere", "fake"],
    relatedSlugs: ["feeling-distant-from-allah", "weighed-down-by-guilt"],
  },
  {
    slug: "troubled-by-doubts",
    family: "faith-feels-distant",
    labelEn: "Troubled by Doubts",
    labelDa: "Plaget af tvivl",
    oneLineDescriptionEn: "For when questions about faith feel unsettling to sit with.",
    oneLineDescriptionDa: "For når spørgsmål om troen føles svære at rumme.",
    tone: "distant",
    launchStatus: "deferred",
    safeguardingLevel: "heightened",
    aliases: [
      "doubtful",
      "uncertain about faith",
      "waswas",
      "intrusive thoughts",
      "struggling to trust",
      "spiritually unsettled",
      "disbelief",
    ],
    relatedSlugs: ["feeling-distant-from-allah"],
    deferralNote:
      "Architected, not excluded — deferred pending a dedicated scholarly working group and the heightened clinical gate (SPEC §4, 'Reinstating this category').",
  },

  // E. When the Heart Feels Open
  {
    slug: "feeling-grateful",
    family: "heart-feels-open",
    labelEn: "Grateful",
    labelDa: "Taknemmelig",
    oneLineDescriptionEn: "For when you want to mark a blessing properly.",
    oneLineDescriptionDa: "For når du ønsker at værdsætte en velsignelse på rette vis.",
    tone: "open",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["thankful", "blessed"],
    relatedSlugs: ["feeling-at-peace"],
  },
  {
    slug: "feeling-at-peace",
    family: "heart-feels-open",
    labelEn: "At Peace",
    labelDa: "I fred",
    oneLineDescriptionEn: "For when things feel settled, and you want that to last.",
    oneLineDescriptionDa: "For når tingene føles i ro, og du ønsker det skal vare ved.",
    tone: "open",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["content", "satisfied", "peaceful"],
    relatedSlugs: ["feeling-grateful", "feeling-hopeful"],
  },
  {
    slug: "feeling-hopeful",
    family: "heart-feels-open",
    labelEn: "Hopeful",
    labelDa: "Håbefuld",
    oneLineDescriptionEn: "For when you're looking forward to something.",
    oneLineDescriptionDa: "For når du ser frem til noget.",
    tone: "open",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["confident", "determined", "anticipation"],
    relatedSlugs: ["feeling-at-peace", "facing-a-decision"],
  },

  // F. When Facing Change or Difficulty
  {
    slug: "facing-a-decision",
    family: "facing-change-or-difficulty",
    labelEn: "Facing a Difficult Decision",
    labelDa: "Står over for en svær beslutning",
    oneLineDescriptionEn: "For when you don't yet know which way to go.",
    oneLineDescriptionDa: "For når du endnu ikke ved, hvilken vej du skal vælge.",
    tone: "transitional",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["indecisive", "confused", "lost", "uncertain"],
    relatedSlugs: ["feeling-hopeful"],
  },
  {
    slug: "facing-illness",
    family: "facing-change-or-difficulty",
    labelEn: "Facing Illness",
    labelDa: "Står over for sygdom",
    oneLineDescriptionEn: "For when sickness — yours or a loved one's — is on your mind.",
    oneLineDescriptionDa: "For når sygdom — din egen eller en du elsker — fylder dine tanker.",
    tone: "transitional",
    launchStatus: "launch",
    safeguardingLevel: "heightened",
    aliases: ["sick", "illness", "unwell"],
    relatedSlugs: ["grieving-a-loss", "feeling-weary"],
  },
  {
    slug: "afraid-of-what-lies-ahead",
    family: "facing-change-or-difficulty",
    labelEn: "Afraid of What Lies Ahead",
    labelDa: "Bange for det, der venter",
    oneLineDescriptionEn: "For when the future feels uncertain.",
    oneLineDescriptionDa: "For når fremtiden føles usikker.",
    tone: "transitional",
    launchStatus: "launch",
    safeguardingLevel: "standard",
    aliases: ["scared", "nervous", "fear of the future"],
    relatedSlugs: ["facing-a-decision", "feeling-anxious"],
  },
];

export const CANONICAL_FEELING_STATE_SLUGS = CANONICAL_FEELING_STATES.map((s) => s.slug);
export const CANONICAL_FEELING_FAMILY_SLUGS = FEELING_FAMILIES.map((f) => f.key);

export function getCanonicalFeelingState(slug: string): CanonicalFeelingState | undefined {
  return CANONICAL_FEELING_STATES.find((s) => s.slug === slug);
}

export function getFeelingStatesByFamily(family: FeelingFamilyKey): CanonicalFeelingState[] {
  return CANONICAL_FEELING_STATES.filter((s) => s.family === family);
}

/** Every state eligible to receive a public route at all, regardless of Sanity content. */
export function getLaunchFeelingStates(): CanonicalFeelingState[] {
  return CANONICAL_FEELING_STATES.filter((s) => s.launchStatus === "launch");
}

/**
 * Alias → canonical feeling slug, built once from CANONICAL_FEELING_STATES
 * (each state's own slug and labelEn also resolve to itself). Lookups are
 * case-insensitive; the map stores lower-cased keys. Deferred/not-suitable
 * states are included so a search for one of their aliases (e.g. "waswas")
 * can be handled gracefully (see src/lib/feeling/search.ts) rather than
 * returning a hard zero-result.
 */
function buildFeelingAliasMap(): Map<string, string> {
  const map = new Map<string, string>();
  for (const state of CANONICAL_FEELING_STATES) {
    const terms = [state.slug, state.labelEn, ...state.aliases];
    for (const term of terms) {
      const key = term.trim().toLowerCase();
      if (!map.has(key)) map.set(key, state.slug);
    }
  }
  return map;
}

export const FEELING_ALIAS_MAP: Map<string, string> = buildFeelingAliasMap();

/** Resolve any supplied term (canonical slug, label, or alias) to its canonical feeling slug, or undefined if unrecognised. */
export function resolveFeelingSlug(term: string): string | undefined {
  return FEELING_ALIAS_MAP.get(term.trim().toLowerCase());
}
