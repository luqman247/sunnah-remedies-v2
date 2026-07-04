/**
 * Sunnah Remedies — Digital Library
 *
 * Schema for the institutional publishing platform.
 * The library is organised into volumes, each containing
 * a curated collection of authentic Qur'anic verses
 * and Prophetic traditions (hadith).
 *
 * Sources: Quran.com · Sunnah.com · Usul.ai
 *
 *
 * ══════════════════════════════════════════════════════════
 * EDITORIAL STANDARDS
 * ══════════════════════════════════════════════════════════
 *
 * Every entry distinguishes five layers of content.
 * No layer may ever be conflated with another in data
 * or in the rendered interface.
 *
 * Layer 1 — QUR'AN (type: "quran")
 *   The word of Allah. `arabic` is the sacred text.
 *   `english` is a human translation and must never be
 *   presented as though it were Revelation itself.
 *   No grading is applied — authenticity is absolute.
 *
 * Layer 2 — AUTHENTIC HADITH (type: "hadith")
 *   The words, actions, or approvals of the Prophet ﷺ
 *   as transmitted through authenticated chains.
 *   Only Sahih and Hasan narrations are admitted.
 *   `english` is a translation and must be labelled as such.
 *
 * Layer 3 — EDITORIAL COMMENTARY (scholarNotes)
 *   Institutional notes written by our editorial team.
 *   Must be visually separated from Layers 1 and 2.
 *   Never displayed adjacent to Arabic text without
 *   clear typographic distinction.
 *
 * Layer 4 — CLASSICAL EXPLANATION (classicalReferences)
 *   Insights from classical scholars (Ibn Kathīr, al-Nawawī,
 *   Ibn al-Qayyim, etc.). Attributed by name and work.
 *   Presented as scholarship, never as Revelation.
 *
 * Layer 5 — MODERN CONTEXTUAL NOTE (modernNotes)
 *   Contemporary scholarly perspective or institutional
 *   context. Clearly marked as modern commentary.
 *   Lowest visual weight in the hierarchy.
 *
 * DISPLAY RULES:
 * - The interface must always show the content type
 *   (Qur'an or Prophetic Tradition) before the text.
 * - Arabic text is the primary presentation.
 * - English is always labelled as translation.
 * - Source attribution is always visible.
 * - Layers 3–5, when displayed, are visually separated
 *   from Layers 1–2 by rule, spacing, or label.
 * ══════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════
// Enumerations
// ═══════════════════════════════════════════════════════════

export type Category =
  | "healing"
  | "provision"
  | "patience"
  | "gratitude"
  | "knowledge"
  | "reflection"
  | "mercy"
  | "trust"
  | "supplication"
  | "creation"
  | "purification";

export type EditorialStatus =
  | "draft"
  | "review"
  | "published"
  | "archived";

// ═══════════════════════════════════════════════════════════
// Editorial photography
// ═══════════════════════════════════════════════════════════

/**
 * A curated editorial photograph accompanying a revelation entry
 * or volume. Follows the same three-state lifecycle as the Plate
 * component: an entry may carry a written art-direction brief
 * long before any image is shot.
 *
 * Approved subjects (from the institutional photography brief):
 *   manuscript, library-table, calligraphy, book, natural-paper,
 *   ink, glass, olive-branch, honey, stone, wood, morning-light
 *
 * Photography must never compete with Revelation for attention.
 * It exists to deepen the stillness of the Reading Room.
 */
export interface EditorialPhotography {
  /** Three-state lifecycle: brief → interim → final */
  status: "brief" | "interim" | "final";

  /** What the image communicates */
  purpose: string;

  /** Shot composition direction */
  composition: string;

  /** Lighting direction */
  lighting: string;

  /** Emotional register */
  mood: string;

  /** Primary subject */
  subject?: string;

  /** Production image (when status is "interim" or "final") */
  image?: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  };

  /** Photographer credit */
  credit?: string;

  /** Image caption */
  caption?: string;
}

// ═══════════════════════════════════════════════════════════
// Entry — a single Qur'anic verse or hadith
// ═══════════════════════════════════════════════════════════

export interface RevelationEntry {
  /** Unique identifier: "q:SURAH:VERSE" or "h:COLLECTION:NUMBER" */
  id: string;

  /** Layer 1 or Layer 2 — determines editorial treatment */
  type: "quran" | "hadith";

  /** Arabic text — sacred text (Layer 1) or Prophetic speech (Layer 2) */
  arabic: string;

  /** English translation — always a human rendering, never Revelation */
  english: string;

  /** Human-readable source citation for display */
  source: string;

  /** Canonical reference URL (Quran.com, Sunnah.com, or Usul.ai) */
  reference?: string;

  /** Primary thematic classification */
  category: Category;

  /** Search keywords */
  keywords?: string[];

  /** Additional thematic tags for cross-referencing */
  themes?: Category[];

  /** Related Apothecary product slugs */
  relatedProducts?: string[];

  /** Related Academy course/lesson slugs */
  relatedCourses?: string[];

  /** Related Knowledge Library article slugs */
  relatedArticles?: string[];

  /** Related Sacred Journey experience slugs */
  relatedJourneys?: string[];

  /** Layer 3 — Editorial commentary (never displayed as Revelation) */
  scholarNotes?: string;

  /** Layer 4 — Classical scholarly references (attributed by scholar and work) */
  classicalReferences?: string[];

  /** Layer 5 — Modern contextual notes (lowest visual weight) */
  modernNotes?: string;

  /** Publication status — only "published" entries are displayed */
  editorialStatus: EditorialStatus;

  /** Reviewer identifier */
  reviewedBy?: string;

  /** Date of last editorial review (ISO 8601) */
  lastReviewed?: string;

  /** Estimated reading time */
  readingTime?: string;

  /** Whether this entry should be featured prominently */
  featured?: boolean;

  /** Editorial photography — architectural provision for future integration */
  editorial?: EditorialPhotography;
}

// ═══════════════════════════════════════════════════════════
// Volume — a curated collection within the library
// ═══════════════════════════════════════════════════════════

export interface Volume {
  /** Machine identifier, e.g. "volume-i" */
  id: string;

  /** Volume number in the library sequence */
  number: number;

  /** Roman numeral for display */
  numeral: string;

  /** Volume title */
  title: string;

  /** Subtitle or thematic scope */
  subtitle?: string;

  /** Editorial description of the volume's purpose */
  description: string;

  /**
   * Subject tags for this volume.
   * Volume I is broad (many categories).
   * Future volumes may be monographic (e.g. "honey", "black-seed").
   */
  subjects: string[];

  /** Publication date (ISO 8601) */
  publishedDate: string;

  /** Editorial status of the volume as a whole */
  editorialStatus: EditorialStatus;

  /** The entries belonging to this volume */
  entries: RevelationEntry[];

  /** Volume cover photography */
  coverImage?: EditorialPhotography;
}

// ═══════════════════════════════════════════════════════════
// Library — the institutional publishing platform
// ═══════════════════════════════════════════════════════════

export interface Library {
  /** Institutional name */
  name: string;

  /** All published and in-progress volumes */
  volumes: Volume[];
}

/**
 * Planned volumes for the Digital Library.
 * Each volume is a self-contained scholarly publication.
 *
 *   I    Foundations of Revelation    (current — 269 entries)
 *   II   Prophetic Medicine           al-Ṭibb al-Nabawī
 *   III  Honey                        العسل
 *   IV   Olive                        الزيتون
 *   V    Black Seed                   الحبة السوداء
 *   VI   Dates                        التمر
 *   VII  Sleep                        النوم
 *   VIII Nutrition                    الغذاء
 *   IX   Patience                     الصبر
 *   X    Mercy                        الرحمة
 *   XI   Healing                      الشفاء
 */

// ═══════════════════════════════════════════════════════════
// Display constants
// ═══════════════════════════════════════════════════════════

export const TYPE_LABELS: Record<RevelationEntry["type"], string> = {
  quran: "The Noble Qurʼan",
  hadith: "Prophetic Tradition",
};
