"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { submitProgrammeAction } from "@/app/scholar-review/actions";
import type { SubmissionBlockers } from "@/lib/scholar-review/progress";

const CONFIRMATION_TEXT = "I confirm that these decisions accurately record my scholarly review and do not directly publish content to the live website.";

export function ProgrammeSubmitPanel({
  programme,
  programmeLabel,
  blockers,
  alreadySubmitted,
  submittedAt,
  firstBlockerHref,
}: {
  programme: "dua-dhikr" | "feeling";
  programmeLabel: string;
  blockers: SubmissionBlockers;
  alreadySubmitted: boolean;
  submittedAt?: string;
  firstBlockerHref?: string;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(alreadySubmitted);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (submitted) {
    return (
      <div style={styles.successCard}>
        <p style={{ margin: 0, fontWeight: 600, color: "#0E3B2E" }}>✓ {programmeLabel} submitted</p>
        {submittedAt && <p style={{ margin: "0.3rem 0 0", fontSize: "0.82rem", color: "#6B6455" }}>{new Date(submittedAt).toLocaleString("en-GB")}</p>}
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#4A4438" }}>
          This programme is locked from further edits. It has not been published to the live website — the project owner reviews these decisions
          separately.
        </p>
      </div>
    );
  }

  function handleSubmit() {
    if (blockers.totalBlockers > 0) return;
    if (!confirmed) {
      setError("Please confirm the statement below before submitting.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await submitProgrammeAction(programme);
      if (result.ok) {
        setSubmitted(true);
      } else {
        setError(result.error ?? "Submission failed.");
      }
    });
  }

  return (
    <div style={styles.card}>
      <p style={{ margin: "0 0 0.5rem", fontWeight: 600, color: "#0E3B2E" }}>Submit {programmeLabel}</p>
      {blockers.totalBlockers > 0 ? (
        <p style={styles.blockerNotice}>
          {blockers.missingDecisionCount > 0 && <>{blockers.missingDecisionCount} item{blockers.missingDecisionCount === 1 ? "" : "s"} still need a decision. </>}
          {blockers.missingCommentCount > 0 && <>{blockers.missingCommentCount} item{blockers.missingCommentCount === 1 ? "" : "s"} need a required comment. </>}
          {firstBlockerHref && (
            <Link href={firstBlockerHref} style={{ color: "#9A6B00", fontWeight: 600 }}>
              Go to next item needing attention →
            </Link>
          )}
        </p>
      ) : (
        <p style={{ fontSize: "0.85rem", color: "#4A4438", margin: "0 0 0.75rem" }}>Every item has a decision. Ready to submit.</p>
      )}

      <label style={styles.checkboxRow}>
        <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} disabled={blockers.totalBlockers > 0} />
        <span>{CONFIRMATION_TEXT}</span>
      </label>

      {error && (
        <p role="alert" style={{ color: "#9A2B2B", fontSize: "0.85rem", margin: "0.5rem 0 0" }}>
          {error}
        </p>
      )}

      <button type="button" onClick={handleSubmit} disabled={blockers.totalBlockers > 0 || !confirmed || isPending} style={styles.button}>
        {isPending ? "Submitting…" : `Submit ${programmeLabel}`}
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.25rem", marginTop: "1rem" },
  successCard: { background: "#EAF2EC", border: "1px solid #0E3B2E", borderRadius: 4, padding: "1.25rem", marginTop: "1rem" },
  blockerNotice: { fontSize: "0.85rem", color: "#9A6B00", background: "#FFF7E5", border: "1px solid #E9CE8A", borderRadius: 3, padding: "0.6rem 0.75rem", margin: "0 0 0.75rem" },
  checkboxRow: { display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.85rem", color: "#20211C", lineHeight: 1.5 },
  button: { marginTop: "0.9rem", padding: "0.6rem 1.1rem", background: "#0E3B2E", color: "#F6F3EE", border: "none", borderRadius: 3, fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" },
};
