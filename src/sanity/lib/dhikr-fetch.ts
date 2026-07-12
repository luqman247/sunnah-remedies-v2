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
