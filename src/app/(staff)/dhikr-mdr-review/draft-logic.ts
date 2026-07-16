/**
 * Pure, session-free logic shared by the MDR review server actions
 * (./actions.ts), the summary page, and the test suite
 * (tests/dhikr/dhikr-mdr-review-workbench.test.ts). Nothing in this file
 * touches Sanity, sessions, or the research register — it exists so the
 * validation and counting rules can be tested directly, without a live
 * server or session, and so the server action and the test can never drift
 * apart by re-implementing the same rule twice.
 */

export type DecisionValue = "" | "approved" | "approved-with-corrections" | "deferred" | "rejected";

export const ALLOWED_DECISIONS: ReadonlySet<string> = new Set(["", "approved", "approved-with-corrections", "deferred", "rejected"]);
export const ALLOWED_TIMINGS: ReadonlySet<string> = new Set(["", "morning-only", "evening-only", "morning-and-evening", "not-time-specific", "uncertain"]);
export const MDR_ID_PATTERN = /^MDR-\d{3}$/;
export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export interface DraftInputLike {
  mdrId: string;
  sequenceNumber?: number;
  decision: DecisionValue;
  approvedTiming: string;
  approvedRepetitionCount?: number;
  reviewDate: string;
  reviewerName: string;
  reviewerQualification: string;
  signedConfirmation: boolean;
}

/**
 * Server-side whitelist/shape validation — re-checks every value against an
 * explicit allowed set rather than trusting the wire. A Server Action is a
 * public RPC endpoint; the DraftInput TypeScript type only constrains a
 * well-behaved browser client, not an arbitrary POST to this action.
 *
 * Returns an error message, or null if the input is valid for the given
 * status ("draft" saves allow incomplete data; "submitted" requires the
 * full reviewer-identity + signed-confirmation set).
 */
export function validateDraftInput(input: DraftInputLike, status: "draft" | "submitted"): string | null {
  if (!MDR_ID_PATTERN.test(input.mdrId)) return "Invalid MDR ID.";

  if (input.sequenceNumber !== undefined && (!Number.isInteger(input.sequenceNumber) || input.sequenceNumber < 1 || input.sequenceNumber > 30)) {
    return "Invalid sequence number.";
  }

  if (!ALLOWED_DECISIONS.has(input.decision)) return "Invalid decision value.";
  if (!ALLOWED_TIMINGS.has(input.approvedTiming)) return "Invalid timing value.";

  if (input.approvedRepetitionCount !== undefined) {
    if (!Number.isInteger(input.approvedRepetitionCount) || input.approvedRepetitionCount < 0 || input.approvedRepetitionCount > 100) {
      return "Approved repetition count must be a whole number between 0 and 100.";
    }
  }

  if (input.reviewDate.trim() !== "" && !DATE_PATTERN.test(input.reviewDate.trim())) {
    return "Review date must be in YYYY-MM-DD format.";
  }

  if (status === "submitted") {
    if (!input.decision) return "A decision is required to submit.";
    if (!input.reviewerName.trim()) return "Reviewer name is required to submit.";
    if (!input.reviewerQualification.trim()) return "Reviewer qualification is required to submit.";
    if (!input.reviewDate.trim()) return "Review date is required to submit.";
    if (!input.signedConfirmation) return "The signed-confirmation checkbox must be checked to submit.";
  }

  return null;
}

export function draftDocumentId(mdrId: string): string {
  return `mdr-review-draft-${mdrId.toLowerCase()}`;
}

export interface DraftSummaryInput {
  mdrId: string;
  status?: "draft" | "submitted";
  decision?: DecisionValue;
}

export interface DraftSummary {
  approved: number;
  approvedWithCorrections: number;
  deferred: number;
  rejected: number;
  incomplete: number;
  stillRequiringAttention: string[];
}

/**
 * Pure summary-count logic, shared by the summary page and tests. Counts
 * are derived purely from submitted draft documents — never from the live
 * register's own scholarlyDecision field.
 */
export function summariseDrafts(allMdrIds: string[], drafts: DraftSummaryInput[]): DraftSummary {
  const draftByMdrId = new Map(drafts.map((d) => [d.mdrId, d]));
  const submitted = drafts.filter((d) => d.status === "submitted");

  return {
    approved: submitted.filter((d) => d.decision === "approved").length,
    approvedWithCorrections: submitted.filter((d) => d.decision === "approved-with-corrections").length,
    deferred: submitted.filter((d) => d.decision === "deferred").length,
    rejected: submitted.filter((d) => d.decision === "rejected").length,
    incomplete: allMdrIds.length - submitted.length,
    stillRequiringAttention: allMdrIds.filter((id) => draftByMdrId.get(id)?.status !== "submitted"),
  };
}
