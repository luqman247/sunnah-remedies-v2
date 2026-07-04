/**
 * Evidence Engine — Core Type System.
 *
 * The Provenance Envelope, source taxonomy, epistemic axes,
 * and structured response object. Every AI surface depends on
 * these types. §3 of the specification.
 */

/* ── Source Taxonomy (§3.2) ──────────────────────────────────────── */

export const SOURCE_CATEGORIES = [
  "QURAN",
  "SUNNAH",
  "CLASSICAL",
  "CONTEMPORARY",
  "RESEARCH",
  "TRADITION",
  "INSTITUTIONAL",
] as const;

export type SourceCategory = (typeof SOURCE_CATEGORIES)[number];

/* ── Epistemic Axes (§3.3) ───────────────────────────────────────── */

export const EPISTEMIC_AXES = ["doctrinal", "evidentiary"] as const;
export type EpistemicAxis = (typeof EPISTEMIC_AXES)[number];

/* ── Authenticity Grading (§3.3) ─────────────────────────────────── */

export const AUTHENTICITY_GRADES = [
  "sahih",
  "hasan",
  "daif",
  "sahih-li-ghayrih",
  "hasan-li-ghayrih",
  "mawdu",
] as const;

export type AuthenticityGrade = (typeof AUTHENTICITY_GRADES)[number];

/* ── Access Levels (§9.2) ────────────────────────────────────────── */

export const ACCESS_LEVELS = [
  "public",
  "registered",
  "student",
  "practitioner",
  "editor",
  "clinician",
  "admin",
] as const;

export type AccessLevel = (typeof ACCESS_LEVELS)[number];

/* ── Citation Objects per Source Type (§3.5) ──────────────────────── */

export interface QuranCitation {
  type: "quran";
  surah: string;
  ayah: string;
  surahName: string;
  translationSource?: string;
}

export interface HadithCitation {
  type: "hadith";
  collection: string;
  book?: string;
  number: string;
  narrator?: string;
  grade: AuthenticityGrade;
}

export interface ResearchCitation {
  type: "research";
  title: string;
  authors: string[];
  journal?: string;
  year?: string;
  doi?: string;
}

export interface ClassicalScholarshipCitation {
  type: "classical";
  scholar: string;
  work: string;
  edition?: string;
  pageOrSection?: string;
}

export interface ContemporaryScholarshipCitation {
  type: "contemporary";
  scholar: string;
  work?: string;
  source?: string;
  year?: string;
  context?: string;
}

export interface ProductCitation {
  type: "product";
  productId: string;
  title: string;
  shopifyHandle?: string;
}

export interface CourseCitation {
  type: "course";
  courseId: string;
  lectureId?: string;
  timestamp?: string;
}

export interface ArticleCitation {
  type: "article";
  title: string;
  author?: string;
  slug: string;
  publishedAt?: string;
}

export interface PolicyCitation {
  type: "policy";
  policyId: string;
  clause?: string;
  version?: string;
}

export type Citation =
  | QuranCitation
  | HadithCitation
  | ResearchCitation
  | ClassicalScholarshipCitation
  | ContemporaryScholarshipCitation
  | ProductCitation
  | CourseCitation
  | ArticleCitation
  | PolicyCitation;

/* ── Provenance Envelope (§3.4) ──────────────────────────────────── */

export interface ProvenanceEnvelope {
  chunkId: string;
  sourceCategory: SourceCategory;
  authenticityGrade?: AuthenticityGrade;
  epistemicAxis: EpistemicAxis[];
  citation: Citation;
  language: string;
  contentType: string;
  accessLevel: AccessLevel;
  sanityDocId: string;
  sanityRev: string;
  editorialApproved: boolean;
  parentChunkId?: string;
  supersedes?: string | null;
  lastVerifiedAt: string;
}

/* ── Structured Response Object (§3.6) ───────────────────────────── */

export interface Claim {
  text: string;
  sourceCategory: SourceCategory;
  citations: string[];
  confidence: number;
}

export interface EscalationAction {
  recommend:
    | "clinical_consultation"
    | "scholarly_referral"
    | "course_enrolment"
    | "emergency_services"
    | "further_reading";
  reason: string;
}

export interface RelatedContent {
  articles: { id: string; title: string; slug: string }[];
  courses: { id: string; title: string; slug: string }[];
  products: { id: string; title: string; slug: string; handle?: string }[];
  consultations: { id: string; title: string; slug: string }[];
}

export interface StructuredResponse {
  summary: string;
  claims: Claim[];
  warnings: string[];
  disclaimers: string[];
  escalation?: EscalationAction;
  related: RelatedContent;
  metadata: {
    surface: string;
    language: string;
    confidenceBand: "high" | "medium" | "low";
    retrievedChunkIds: string[];
    processingTimeMs: number;
    cached: boolean;
  };
}

/* ── Chunk with Envelope (for vector storage) ────────────────────── */

export interface DocumentChunk {
  id: string;
  content: string;
  envelope: ProvenanceEnvelope;
  embedding?: number[];
  parentContent?: string;
  headingPath?: string[];
  tokenCount: number;
}

/* ── Rendering colour token mapping (§3.2) ───────────────────────── */

export const EVIDENCE_COLOUR_TOKENS: Record<SourceCategory, string> = {
  QURAN: "--evidence-revelation",
  SUNNAH: "--evidence-revelation",
  CLASSICAL: "--evidence-scholarship",
  CONTEMPORARY: "--evidence-scholarship",
  RESEARCH: "--evidence-empirical",
  TRADITION: "--evidence-tradition",
  INSTITUTIONAL: "--evidence-institution",
};

/* ── Category axis mapping ───────────────────────────────────────── */

export const CATEGORY_AXES: Record<SourceCategory, EpistemicAxis[]> = {
  QURAN: ["doctrinal"],
  SUNNAH: ["doctrinal"],
  CLASSICAL: ["doctrinal"],
  CONTEMPORARY: ["doctrinal"],
  RESEARCH: ["evidentiary"],
  TRADITION: ["doctrinal", "evidentiary"],
  INSTITUTIONAL: ["doctrinal", "evidentiary"],
};
