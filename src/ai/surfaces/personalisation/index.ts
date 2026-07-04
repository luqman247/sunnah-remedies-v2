/**
 * AI Personalisation Surface (§7.6 / Milestone 10).
 *
 * Privacy-first personalisation using declared preferences,
 * coarse consented segments, and session context.
 * No invasive cross-site tracking. Consent-gated.
 */

/* ── User Segments (§7.6) ────────────────────────────────────────── */

export const USER_SEGMENTS = [
  "first_time_visitor",
  "returning_visitor",
  "student",
  "practitioner",
  "patient",
  "researcher",
  "healthcare_professional",
] as const;

export type UserSegment = (typeof USER_SEGMENTS)[number];

/* ── Preferences Model ───────────────────────────────────────────── */

export interface UserPreferences {
  segment: UserSegment;
  interests: string[];
  language: string;
  consentGiven: boolean;
  consentTimestamp?: string;
  enrolledCourses?: string[];
  viewedTopics?: string[];
  purchasedProducts?: string[];
}

/* ── Personalisation Rules ───────────────────────────────────────── */

interface PersonalisationConfig {
  homepageEmphasis: string[];
  recommendedTopics: string[];
  recommendedProducts: boolean;
  recommendedCourses: boolean;
  showResearchDepth: boolean;
  showArabicPrimary: boolean;
}

const SEGMENT_CONFIGS: Record<UserSegment, PersonalisationConfig> = {
  first_time_visitor: {
    homepageEmphasis: ["introduction", "featured_remedies", "about"],
    recommendedTopics: ["prophetic-medicine-introduction", "black-seed", "honey"],
    recommendedProducts: true,
    recommendedCourses: true,
    showResearchDepth: false,
    showArabicPrimary: false,
  },
  returning_visitor: {
    homepageEmphasis: ["new_content", "seasonal", "recommendations"],
    recommendedTopics: [],
    recommendedProducts: true,
    recommendedCourses: true,
    showResearchDepth: false,
    showArabicPrimary: false,
  },
  student: {
    homepageEmphasis: ["courses", "knowledge_library", "study_resources"],
    recommendedTopics: [],
    recommendedProducts: false,
    recommendedCourses: true,
    showResearchDepth: true,
    showArabicPrimary: false,
  },
  practitioner: {
    homepageEmphasis: ["clinical_protocols", "research", "advanced_courses"],
    recommendedTopics: [],
    recommendedProducts: true,
    recommendedCourses: true,
    showResearchDepth: true,
    showArabicPrimary: false,
  },
  patient: {
    homepageEmphasis: ["consultations", "remedies", "wellness"],
    recommendedTopics: ["consultation-preparation", "wellness-basics"],
    recommendedProducts: true,
    recommendedCourses: false,
    showResearchDepth: false,
    showArabicPrimary: false,
  },
  researcher: {
    homepageEmphasis: ["research", "evidence_base", "clinical_trials"],
    recommendedTopics: [],
    recommendedProducts: false,
    recommendedCourses: true,
    showResearchDepth: true,
    showArabicPrimary: true,
  },
  healthcare_professional: {
    homepageEmphasis: ["clinical_protocols", "research", "cpd"],
    recommendedTopics: [],
    recommendedProducts: true,
    recommendedCourses: true,
    showResearchDepth: true,
    showArabicPrimary: false,
  },
};

/* ── Personalisation Engine ──────────────────────────────────────── */

export interface PersonalisedRecommendations {
  topics: string[];
  products: boolean;
  courses: boolean;
  emphasis: string[];
  showResearchDepth: boolean;
  showArabicPrimary: boolean;
  whyShown: string;
}

export function getPersonalisedRecommendations(
  preferences: UserPreferences
): PersonalisedRecommendations {
  if (!preferences.consentGiven) {
    return {
      topics: SEGMENT_CONFIGS.first_time_visitor.recommendedTopics,
      products: true,
      courses: true,
      emphasis: SEGMENT_CONFIGS.first_time_visitor.homepageEmphasis,
      showResearchDepth: false,
      showArabicPrimary: false,
      whyShown: "Default recommendations (no personalisation consent)",
    };
  }

  const config = SEGMENT_CONFIGS[preferences.segment];
  const topics = config.recommendedTopics.length > 0
    ? config.recommendedTopics
    : preferences.interests || [];

  return {
    topics,
    products: config.recommendedProducts,
    courses: config.recommendedCourses,
    emphasis: config.homepageEmphasis,
    showResearchDepth: config.showResearchDepth,
    showArabicPrimary: config.showArabicPrimary,
    whyShown: `Personalised for ${preferences.segment.replace(/_/g, " ")}`,
  };
}

/* ── Segment Detection ───────────────────────────────────────────── */

export function detectSegment(signals: {
  hasAccount: boolean;
  hasPurchases: boolean;
  hasEnrolments: boolean;
  visitCount: number;
  referrer?: string;
  declaredRole?: string;
}): UserSegment {
  if (signals.declaredRole) {
    const role = signals.declaredRole.toLowerCase();
    if (role.includes("practitioner") || role.includes("therapist"))
      return "practitioner";
    if (role.includes("student")) return "student";
    if (role.includes("researcher") || role.includes("academic"))
      return "researcher";
    if (role.includes("doctor") || role.includes("nurse") || role.includes("physician"))
      return "healthcare_professional";
    if (role.includes("patient")) return "patient";
  }

  if (signals.hasEnrolments) return "student";
  if (signals.hasPurchases) return "returning_visitor";
  if (signals.hasAccount || signals.visitCount > 1) return "returning_visitor";
  return "first_time_visitor";
}

/* ── Preference Centre ───────────────────────────────────────────── */

export interface PreferenceCentreOptions {
  segments: typeof USER_SEGMENTS;
  currentPreferences: UserPreferences;
}

export function getPreferenceCentreConfig(
  currentPreferences?: UserPreferences
): PreferenceCentreOptions {
  return {
    segments: USER_SEGMENTS,
    currentPreferences: currentPreferences ?? {
      segment: "first_time_visitor",
      interests: [],
      language: "en",
      consentGiven: false,
    },
  };
}
