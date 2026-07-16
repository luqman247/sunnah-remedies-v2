"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { validateDraftInput, draftDocumentId, type DecisionValue } from "./draft-logic";

/**
 * Server actions for the MDR Scholarly Review Workbench.
 *
 * Every action verifies the staff session before reading or writing —
 * defence in depth beyond middleware.ts, following the same pattern as
 * src/lib/operations/actions.ts. Reads and writes exclusively the
 * `dhikrMdrReviewDraft` Sanity document type (see
 * src/sanity/schemas/documents/dhikr-review/dhikr-mdr-review-draft.ts) —
 * never the research register file, never `dhikrItem`, never any field
 * gated by the canonical publication rule. Submitting a review here creates
 * or updates ONE draft document; it never sets importStatus, never changes
 * scholarlyDecision on the live register, and never imports or publishes
 * anything. See docs/dhikr/40-scholarly-review-and-adjudication-framework.md.
 *
 * Validation of untrusted input is in ./draft-logic.ts (pure, no session/
 * network dependency) so it can be tested directly — see
 * tests/dhikr/dhikr-mdr-review-workbench.test.ts.
 */

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/sign-in");
  }
  return session;
}

export interface MdrReviewDraftDoc {
  _id: string;
  mdrId: string;
  sequenceNumber?: number;
  status: "draft" | "submitted";
  decision: DecisionValue;
  correctedArabicText?: string;
  correctedEnglishText?: string;
  approvedSourceReference?: string;
  approvedTiming?: string;
  approvedRepetitionCount?: number;
  approvedVirtueText?: string;
  compositeClausesApproved?: boolean;
  reviewerNotes?: string;
  reviewerName?: string;
  reviewerQualification?: string;
  reviewDate?: string;
  signedConfirmation?: boolean;
  updatedAt?: string;
}

/** All existing review drafts, staff-only. Empty array if none exist yet or the fetch fails. */
export async function loadAllDrafts(): Promise<MdrReviewDraftDoc[]> {
  await requireSession();
  try {
    const result = await writeClient.fetch<MdrReviewDraftDoc[]>(
      `*[_type == "dhikrMdrReviewDraft"] | order(mdrId asc)`,
    );
    return result ?? [];
  } catch {
    return [];
  }
}

export interface DraftInput {
  mdrId: string;
  sequenceNumber?: number;
  decision: DecisionValue;
  correctedArabicText: string;
  correctedEnglishText: string;
  approvedSourceReference: string;
  approvedTiming: string;
  approvedRepetitionCount?: number;
  approvedVirtueText: string;
  compositeClausesApproved: boolean;
  reviewerNotes: string;
  reviewerName: string;
  reviewerQualification: string;
  reviewDate: string;
  signedConfirmation: boolean;
}

async function upsertDraft(input: DraftInput, status: "draft" | "submitted"): Promise<{ ok: true } | { ok: false; error: string }> {
  await requireSession();

  const validationError = validateDraftInput(input, status);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  const id = draftDocumentId(input.mdrId);
  const fields = {
    mdrId: input.mdrId,
    sequenceNumber: input.sequenceNumber,
    status,
    decision: input.decision,
    correctedArabicText: input.correctedArabicText,
    correctedEnglishText: input.correctedEnglishText,
    approvedSourceReference: input.approvedSourceReference,
    approvedTiming: input.approvedTiming,
    approvedRepetitionCount: input.approvedRepetitionCount,
    approvedVirtueText: input.approvedVirtueText,
    compositeClausesApproved: input.compositeClausesApproved,
    reviewerNotes: input.reviewerNotes,
    reviewerName: input.reviewerName,
    reviewerQualification: input.reviewerQualification,
    reviewDate: input.reviewDate,
    signedConfirmation: input.signedConfirmation,
    updatedAt: new Date().toISOString(),
  };

  await writeClient.createIfNotExists({ _id: id, _type: "dhikrMdrReviewDraft", mdrId: input.mdrId, status: "draft" });
  await writeClient.patch(id).set(fields).commit();

  return { ok: true };
}

/** Saves a draft in progress. Never requires every field to be complete. */
export async function saveDraft(input: DraftInput) {
  return upsertDraft(input, "draft");
}

/**
 * Submits a final decision. Requires decision + reviewer identity + a
 * checked signed-confirmation box. This still only writes a
 * `dhikrMdrReviewDraft` document — it never touches the live register,
 * importStatus, or any public/Sanity publication field. A submitted draft
 * is transcribed into the register later, by a human, via a separate,
 * explicitly-approved commit.
 */
export async function submitDraft(input: DraftInput) {
  return upsertDraft(input, "submitted");
}
