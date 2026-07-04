/**
 * TypeScript types derived from Sanity schemas.
 * These types are used by the frontend to ensure type safety
 * when consuming CMS data.
 */

/* ── Base Types ─────────────────────────────────────────────────── */

export interface TranslationStatus {
  state?: "upToDate" | "aiDraft" | "needsTranslation";
  sourceVersion?: string;
  lastReviewedAt?: string;
}

export interface TranslationSibling {
  lang: string;
  slug: string;
}

export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
  language?: string;
  translationStatus?: TranslationStatus;
  translations?: TranslationSibling[];
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
    url?: string;
  };
  alt?: string;
  caption?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  cloudinaryAssetId?: string;
}

export interface SanitySlug {
  _type: "slug";
  current: string;
}

export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: SanityImage;
  ogTitle?: string;
  ogDescription?: string;
  keywords?: string[];
  noIndex?: boolean;
  structuredData?: string;
}

export interface EditorialWorkflow {
  status?: "draft" | "in-review" | "published" | "scheduled" | "archived";
  author?: { _ref: string };
  reviewer?: string;
  approvalDate?: string;
  scheduledPublishDate?: string;
  revisionNotes?: string;
  versionNumber?: string;
  lastUpdated?: string;
}

export interface InternalLink {
  label: string;
  href: string;
  primary?: boolean;
}

/* ── Prophetic Reference ────────────────────────────────────────── */

export type Grade = "Established" | "Reported" | "Tried";
export type PropheticAttribution = "revelation" | "hadith" | "classical";

export interface PropheticReference {
  statement: string;
  transliteration?: string;
  grade: Grade;
  source: string;
  standing?: string;
  siglum?: string;
  attribution: PropheticAttribution;
}

/* ── Global ─────────────────────────────────────────────────────── */

export interface NavigationItem {
  label: string;
  href: string;
  description?: string;
  highlighted?: boolean;
  hidden?: boolean;
  children?: { label: string; href: string; description?: string }[];
}

export interface Navigation extends SanityDocument {
  mainNavigation: NavigationItem[];
  announcementBar?: {
    active: boolean;
    message?: string;
    link?: string;
    linkLabel?: string;
  };
}

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterSettings extends SanityDocument {
  preFooterStatement?: string;
  preFooterAction?: { label: string; href: string };
  columns: FooterColumn[];
  closingStatement?: string;
  colophon?: string;
}

/* ── Product ────────────────────────────────────────────────────── */

export interface Product extends SanityDocument {
  name: string;
  slug: SanitySlug;
  transliteration?: string;
  botanicalName?: string;
  nature?: string;
  institutionalSummary?: string;
  folio?: string;
  mainImage?: SanityImage;
  gallery?: SanityImage[];
  historicalContext?: string[];
  propheticReferences?: PropheticReference[];
  traditionalScholarship?: string[];
  traditionalUsage?: string[];
  evidenceEstablished?: string[];
  evidenceEmerging?: string[];
  provenanceOrigin?: string[];
  provenanceCultivation?: string[];
  provenanceHarvesting?: string[];
  laboratoryVerification?: string[];
  qualityAssurance?: string[];
  suggestedUse?: string[];
  preparation?: string[];
  storage?: string[];
  contraindications?: string[];
  volume?: string;
  price?: number;
  priceNote?: string;
  inStock?: boolean;
  futureShopifyProductId?: string;
  relatedProducts?: Product[];
  ingredients?: Ingredient[];
  academyLessons?: InternalLink[];
  knowledgeLibrary?: InternalLink[];
  pathways?: InternalLink[];
  faq?: { question: string; answer: string }[];
  seo?: SeoFields;
}

export interface Ingredient extends SanityDocument {
  name: string;
  slug: SanitySlug;
  botanicalName?: string;
  arabicName?: string;
  family?: string;
  description?: string;
  traditionalUses?: string[];
  propheticBasis?: string;
  image?: SanityImage;
}

/* ── Programme ──────────────────────────────────────────────────── */

export interface CurriculumModule {
  number?: string;
  title: string;
  hours?: number;
  description?: string;
  sources?: string[];
  practical?: string;
}

export interface LearningOutcome {
  outcome: string;
  assessed: boolean;
}

export interface Programme extends SanityDocument {
  name: string;
  slug: SanitySlug;
  subtitle?: string;
  folio?: string;
  tier: "Essential" | "Professional" | "Advanced" | "Licensed";
  duration?: string;
  format?: string;
  fee?: string;
  feeNote?: string;
  nextCohort?: string;
  whatItIs?: string[];
  forWhom?: string[];
  whatItAsks?: string[];
  curriculum?: CurriculumModule[];
  learningOutcomes?: LearningOutcome[];
  faculty?: Faculty[];
  assessment?: string[];
  certification?: string[];
  entryRequirements?: string[];
  clinicalPractice?: string[];
  faq?: { question: string; answer: string }[];
  testimonials?: { statement: string; name: string; context?: string; year?: string }[];
  seo?: SeoFields;
}

/* ── Faculty ────────────────────────────────────────────────────── */

export interface Faculty extends SanityDocument {
  name: string;
  slug: SanitySlug;
  title?: string;
  licence?: string;
  chain?: string;
  biography?: string[];
  portrait?: SanityImage;
  departments?: string[];
  specialisms?: string[];
  role?: string;
}

/* ── Journey ────────────────────────────────────────────────────── */

export interface ItineraryDay {
  day: string;
  title: string;
  focus?: string;
  activities?: string[];
}

export interface JourneyScholar {
  name: string;
  role?: string;
  grounding?: string;
  biography?: string[];
}

export interface EducationalSession {
  title: string;
  format?: string;
  description?: string;
}

export interface Journey extends SanityDocument {
  name: string;
  slug: SanitySlug;
  subtitle?: string;
  folio?: string;
  meaning?: string[];
  season?: string;
  duration?: string;
  location?: string;
  groupSize?: string;
  fee?: string;
  feeNote?: string;
  nextDeparture?: string;
  forWhom?: string[];
  whatItAsks?: string[];
  preparation?: string[];
  flightGuidance?: string[];
  accommodationPhilosophy?: string[];
  learning?: string[];
  educationalSessions?: EducationalSession[];
  companionship?: string[];
  guidance?: string[];
  spiritualGrowth?: string[];
  reflection?: string[];
  reflectionJournals?: string[];
  healthGuidance?: string[];
  safety?: string[];
  organisation?: string[];
  itinerary?: ItineraryDay[];
  scholars?: JourneyScholar[];
  reading?: { title: string; note?: string }[];
  packing?: string[];
  heroImage?: SanityImage;
  gallery?: SanityImage[];
  faq?: { question: string; answer: string }[];
  policies?: { title: string; body?: string[] }[];
  pathways?: InternalLink[];
  seo?: SeoFields;
}

/* ── Article ────────────────────────────────────────────────────── */

export interface Article extends SanityDocument {
  title: string;
  slug: SanitySlug;
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
  author?: { name: string; title?: string; biography?: string; portrait?: SanityImage };
  topics?: Topic[];
  publishedAt?: string;
  readingTime?: number;
  contentType?: string;
  featured?: boolean;
  mainImage?: SanityImage;
  relatedArticles?: Article[];
  seo?: SeoFields;
}

export interface Topic extends SanityDocument {
  title: string;
  slug: SanitySlug;
  description?: string;
  lede?: string;
  sections?: { heading: string; body?: string[] }[];
  related?: Topic[];
}

/* ── Department Card (resolved from reference) ─────────────────── */

export interface DepartmentCardResolved {
  order: number;
  nameEn: string;
  nameAr: string;
  standfirst: string;
  href: string;
  size: "standard" | "feature";
  plate?: {
    status: "brief" | "interim" | "final";
    purpose: string;
    composition: string;
    lens?: string;
    lighting: string;
    grade?: string;
    mood: string;
    image?: SanityImage;
    alt?: string;
    caption?: string;
    decorative?: boolean;
    credit?: string;
  };
}

/* ── Homepage ───────────────────────────────────────────────────── */

export interface HomepagePillar {
  eyebrow?: string;
  title: string;
  body?: string;
  image?: SanityImage;
  caption?: string;
  link?: { label: string; href: string };
  reverse?: boolean;
}

export interface TrustItem {
  numeral?: string;
  title: string;
  text?: string;
}

export interface HomepageData extends SanityDocument {
  hero?: {
    image?: SanityImage;
    statement: string;
    qualifier?: string;
  };
  institutionSection?: {
    numeral?: string;
    title?: string;
    body?: string[];
  };
  pillars?: HomepagePillar[];
  trustSection?: {
    numeral?: string;
    label?: string;
    heading?: string;
    items?: TrustItem[];
  };
  featuredRemedies?: {
    eyebrow?: string;
    title: string;
    body?: string;
    image?: SanityImage;
    link?: { label: string; href: string };
    reverse?: boolean;
  }[];
  academySection?: {
    numeral?: string;
    label?: string;
    title?: string;
    body?: string;
    pullQuote?: string;
    link?: { label: string; href: string };
  };
  knowledgeSection?: {
    numeral?: string;
    label?: string;
    title?: string;
    body?: string;
    link?: { label: string; href: string };
  };
  journeysSection?: {
    numeral?: string;
    label?: string;
    title?: string;
    body?: string;
    pullQuote?: string;
    link?: { label: string; href: string };
    editorialPhoto?: SanityImage;
  };
  foundingStatement?: {
    numeral?: string;
    eyebrow?: string;
    title?: string;
    body?: string[];
    link?: { label: string; href: string };
  };
  invitation?: {
    numeral?: string;
    title?: string;
    body?: string;
    actions?: InternalLink[];
  };
  seo?: SeoFields;

  /* V2 Arrival fields (Ch. 12) */
  eyebrow?: string;
  foundingYear?: number;
  arrivalArabic?: string;
  arrivalEnglish?: string;
  standfirst?: string;
  enterLabel?: string;
  enterHref?: string;
  thresholdPlate?: { _ref: string };
  tradition?: {
    stamp: string;
    arabicEpigraph?: string;
    standfirst: string;
    body: string[];
    pullQuote: { text: string; attribution?: string; source?: string };
  };
  departmentCards?: DepartmentCardResolved[];
  authoritySignals?: { label: string; value: string | null; note?: string }[];
  correspondence?: {
    heading: string;
    body: string;
    placeholder: string;
    consentText: string;
    successText: string;
  };
  institutionStatement?: string;
}

/* ── Testimonial ────────────────────────────────────────────────── */

export interface Testimonial extends SanityDocument {
  statement: string;
  name: string;
  context?: string;
  year?: string;
  department: string;
  featured?: boolean;
}

/* ── FAQ ────────────────────────────────────────────────────────── */

export interface FaqItem extends SanityDocument {
  question: string;
  answer: string;
  department: string;
  orderRank?: number;
}
