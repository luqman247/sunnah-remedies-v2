/**
 * Dhikr Fetch — staff-only internal preview.
 *
 * Deliberately separate from the shared public fetch.ts so a public route
 * can never accidentally import an ungated Dhikr query. Nothing exported
 * from this file may be imported by a route under src/app/[locale]/.
 *
 * Uses previewClient (perspective: previewDrafts), not the public client,
 * so staff reviewers can see Dhikr items regardless of Sanity's own
 * draft/publish state — that mechanism is separate from, and does not
 * substitute for, the reviewStatus gate in dhikr-publication-gate.ts.
 *
 * @see docs/dhikr/12-sanity-integration-plan.md
 * @see docs/dhikr/20-risk-register.md (R-01)
 */

import { previewClient } from "./client";
import {
  dhikrCategoriesInternalQuery,
  dhikrItemsInternalPreviewQuery,
  dhikrItemsInternalDetailQuery,
} from "./queries";

export interface DhikrCategoryPreview {
  _id: string;
  nameEn: string;
  nameDa?: string;
  order: number;
}

export interface DhikrItemPreview {
  _id: string;
  titleEn: string;
  titleDa?: string;
  categoryName?: string;
  order?: number;
  reviewStatus: string;
  hasArabicText: boolean;
  hasTranslationEn: boolean;
  hasTranslationDa: boolean;
  sourceReferenceCount: number;
  hasScholarlyApproval: boolean;
  hasEditorialApproval: boolean;
}

/** Staff-only. Never call from a route under src/app/[locale]/. */
export async function getDhikrCategoriesInternalPreview(): Promise<DhikrCategoryPreview[]> {
  try {
    const result = await previewClient.fetch<DhikrCategoryPreview[]>(dhikrCategoriesInternalQuery);
    return result ?? [];
  } catch {
    return [];
  }
}

/**
 * Staff-only. Does not apply the public eligibility filter (see
 * dhikr-publication-gate.ts) — results may include unreviewed, unapproved,
 * or unpublished items. Do not expose these results publicly.
 */
export async function getDhikrItemsInternalPreview(): Promise<DhikrItemPreview[]> {
  try {
    const result = await previewClient.fetch<DhikrItemPreview[]>(dhikrItemsInternalPreviewQuery);
    return result ?? [];
  } catch {
    return [];
  }
}

/* ── Full internal detail (Stage 2E) — governance fields, staff-only ──
 *
 * Every type and function below is staff-only. Governance fields
 * (reviewStatus, boardApprovals — including approver identity and
 * free-text notes) appear ONLY here, never in any public-facing type.
 */

/** Reader-facing subset of sourceReference — see src/sanity/schemas/objects/source-reference.ts. No `notes` field exists on this object. */
export interface DhikrInternalSourceReference {
  type?: string;
  citation?: string;
  hadithCollection?: string;
  hadithNumber?: string;
  hadithGrading?: string;
  surah?: string;
  ayah?: string;
  sourceUrl?: string;
  verifiedStatus?: string;
}

/** Governance record — see src/sanity/schemas/objects/board-approval.ts. `approver`/`notes` are staff-only identity/commentary fields. */
export interface DhikrInternalBoardApproval {
  board?: string;
  approved?: boolean;
  approver?: string;
  date?: string;
  notes?: string;
}

/** Resolved category identity, for display only — not a public projection. */
export interface DhikrInternalCategorySummary {
  categoryId?: string;
  categoryNameEn?: string;
  categoryNameDa?: string;
  categorySlug?: string;
}

/**
 * Full internal detail for one dhikrItem. Staff-only — contains reviewStatus
 * and full boardApprovals (reviewer identity, notes), which must never
 * appear in any type or query consumed by src/app/[locale]/.
 */
export interface DhikrItemInternalDetail extends DhikrInternalCategorySummary {
  _id: string;
  _type: string;
  _updatedAt: string;
  titleEn: string;
  titleDa?: string;
  slug?: string;
  order?: number;
  tags?: string[];
  arabicText?: string;
  transliteration?: string;
  translationEn?: string;
  translationDa?: string;
  recommendedRepetitions?: number;
  audioAssetTitle?: string;
  hasAudioAsset: boolean;
  sourceReferences: DhikrInternalSourceReference[];
  reviewStatus: string;
  boardApprovals: DhikrInternalBoardApproval[];
}

/**
 * Staff-only, full internal detail — reviewStatus, full sourceReferences,
 * and full boardApprovals (reviewer identity + notes) included. Applies no
 * eligibility filter; results may include unreviewed, unapproved, or
 * unpublished items, and this function does not silently fall back to a
 * public-safe projection on failure — a failed fetch returns an empty
 * array, the same "nothing to show" behaviour as every other function in
 * this file, never a partial or sanitised substitute.
 *
 * Never call from a route under src/app/[locale]/.
 */
export async function getDhikrItemsInternalDetail(): Promise<DhikrItemInternalDetail[]> {
  try {
    const result = await previewClient.fetch<DhikrItemInternalDetail[]>(dhikrItemsInternalDetailQuery);
    return result ?? [];
  } catch {
    return [];
  }
}

/* ── v1 placeholder register ───────────────────────────────────────
 *
 * Mirrors docs/dhikr/18-v1-content-register.md exactly. Contains only
 * placeholder IDs, proposed category labels, and a review-status stub —
 * no Arabic text, translation, source citation, grading, reward claim,
 * or repetition count. This is the single source these placeholders are
 * defined in; do not hard-code this list again elsewhere.
 */

export type DhikrPlaceholderReviewStatus = "pending-scholarly-input";

export interface DhikrPlaceholderEntry {
  slotId: string;
  proposedCategory: string;
  reviewStatus: DhikrPlaceholderReviewStatus;
  internalNote?: string;
}

export const DHIKR_V1_PLACEHOLDER_REGISTER: DhikrPlaceholderEntry[] = [
  { slotId: "DHK-001", proposedCategory: "Morning", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-002", proposedCategory: "Morning", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-003", proposedCategory: "Morning", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-004", proposedCategory: "Evening", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-005", proposedCategory: "Evening", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-006", proposedCategory: "Evening", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-007", proposedCategory: "After Prayer", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-008", proposedCategory: "After Prayer", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-009", proposedCategory: "Before Sleep", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-010", proposedCategory: "Travel", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-011", proposedCategory: "Distress / Difficulty", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
  { slotId: "DHK-012", proposedCategory: "General Remembrance", reviewStatus: "pending-scholarly-input", internalNote: "Not sourced" },
];
