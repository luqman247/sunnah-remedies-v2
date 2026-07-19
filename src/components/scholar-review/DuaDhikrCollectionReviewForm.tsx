"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveDuaDhikrCollectionReviewAction } from "@/app/scholar-review/actions";
import type { DuaDhikrCollectionReviewInput } from "@/lib/scholar-review/review-records";
import { DUA_DHIKR_COLLECTION_DECISIONS, DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT } from "@/lib/scholar-review/decision-labels";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DuaDhikrCollectionReviewForm({
  collectionId,
  initial,
  locked = false,
}: {
  collectionId: string;
  initial: (DuaDhikrCollectionReviewInput & { completed?: boolean }) | null;
  locked?: boolean;
}) {
  const [fields, setFields] = useState<DuaDhikrCollectionReviewInput>({
    decision: initial?.decision,
    comments: initial?.comments ?? "",
    proposedOrdering: initial?.proposedOrdering ?? "",
  });
  const [completed, setCompleted] = useState(!!initial?.completed);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const commentRequired = fields.decision ? !DUA_DHIKR_COLLECTION_DECISIONS_NOT_REQUIRING_COMMENT.has(fields.decision) : false;

  function update<K extends keyof DuaDhikrCollectionReviewInput>(key: K, value: DuaDhikrCollectionReviewInput[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function save(markCompleted: boolean) {
    setStatus("saving");
    startTransition(async () => {
      const result = await saveDuaDhikrCollectionReviewAction(collectionId, fields, markCompleted);
      setStatus(result.ok ? "saved" : "error");
    });
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(completed), 1500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  function handleMarkReviewed() {
    if (!fields.decision) {
      setValidationError("Select a decision before marking this collection as reviewed.");
      return;
    }
    if (commentRequired && !fields.comments?.trim()) {
      setValidationError("A comment is required for any decision other than plain \"Approved\" or \"Defer.\"");
      return;
    }
    setValidationError(null);
    setCompleted(true);
    setStatus("saving");
    startTransition(async () => {
      const result = await saveDuaDhikrCollectionReviewAction(collectionId, fields, true);
      setStatus(result.ok ? "saved" : "error");
    });
  }

  if (locked) {
    return (
      <div style={styles.card}>
        <p style={styles.lockedNotice}>
          The Duʿā &amp; Dhikr programme has been submitted and is locked from further edits. Contact the project owner if this needs to be reopened.
        </p>
        <p style={{ fontSize: "0.85rem", color: "#20211C" }}>
          <strong>Decision:</strong> {DUA_DHIKR_COLLECTION_DECISIONS.find((d) => d.value === initial?.decision)?.label ?? "Not reviewed"}
        </p>
        {initial?.comments && <p style={{ fontSize: "0.85rem", color: "#4A4438" }}>{initial.comments}</p>}
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.1rem", color: "#0E3B2E" }}>Scholarly decision</h2>
        <SaveIndicator status={status} pending={isPending} />
      </div>

      <label style={styles.label}>Decision</label>
      <select value={fields.decision ?? ""} onChange={(e) => update("decision", e.target.value || undefined)} style={styles.select}>
        <option value="">Select a decision…</option>
        {DUA_DHIKR_COLLECTION_DECISIONS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <label style={styles.label}>
        Comments {commentRequired && <span style={{ color: "#9A2B2B" }}>(required)</span>}
      </label>
      <textarea value={fields.comments ?? ""} onChange={(e) => update("comments", e.target.value)} rows={4} style={styles.textarea} />

      {fields.decision === "reorder-entries" && (
        <div style={styles.fieldset}>
          <p style={{ margin: "0 0 0.6rem", fontSize: "0.85rem", fontWeight: 600, color: "#0E3B2E" }}>Proposed ordering</p>
          <p style={styles.hint}>List entry titles in the suggested order, separated by commas.</p>
          <textarea value={fields.proposedOrdering ?? ""} onChange={(e) => update("proposedOrdering", e.target.value)} rows={3} style={styles.textarea} />
        </div>
      )}

      {validationError && (
        <p role="alert" style={{ color: "#9A2B2B", fontSize: "0.85rem" }}>
          {validationError}
        </p>
      )}

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", alignItems: "center", flexWrap: "wrap" }}>
        <button type="button" onClick={() => save(completed)} disabled={isPending} style={styles.secondaryButton}>
          Save progress
        </button>
        <button type="button" onClick={handleMarkReviewed} disabled={isPending} style={styles.primaryButton}>
          {completed ? "Update reviewed decision" : "Mark as reviewed"}
        </button>
        {completed && <span style={{ fontSize: "0.82rem", color: "#0E3B2E", fontWeight: 600 }}>✓ Marked reviewed</span>}
      </div>
    </div>
  );
}

function SaveIndicator({ status, pending }: { status: SaveStatus; pending: boolean }) {
  if (pending || status === "saving") return <span style={styles.statusSaving}>Saving…</span>;
  if (status === "saved") return <span style={styles.statusSaved}>Saved</span>;
  if (status === "error") return <span style={styles.statusError}>Save failed — try again</span>;
  return null;
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: "#FFFFFF", border: "1px solid #E2DCCF", borderRadius: 4, padding: "1.5rem" },
  label: { display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#0E3B2E", margin: "0.75rem 0 0.3rem" },
  select: { width: "100%", padding: "0.55rem 0.65rem", border: "1px solid #C9C2B1", borderRadius: 3, fontSize: "0.9rem" },
  textarea: { width: "100%", boxSizing: "border-box", padding: "0.55rem 0.65rem", border: "1px solid #C9C2B1", borderRadius: 3, fontSize: "0.9rem", fontFamily: "inherit", marginBottom: "0.5rem" },
  fieldset: { margin: "1rem 0", padding: "0.9rem", background: "#F9F6EF", border: "1px solid #EDE7D9", borderRadius: 4 },
  hint: { fontSize: "0.8rem", color: "#6B6455", margin: "0 0 0.5rem" },
  primaryButton: { padding: "0.6rem 1.1rem", background: "#0E3B2E", color: "#F6F3EE", border: "none", borderRadius: 3, fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" },
  secondaryButton: { padding: "0.6rem 1.1rem", border: "1px solid #C9C2B1", background: "#FFFFFF", borderRadius: 3, fontSize: "0.88rem", cursor: "pointer" },
  statusSaving: { fontSize: "0.82rem", color: "#6B6455" },
  statusSaved: { fontSize: "0.82rem", color: "#0E3B2E", fontWeight: 600 },
  statusError: { fontSize: "0.82rem", color: "#9A2B2B", fontWeight: 600 },
  lockedNotice: { fontSize: "0.85rem", color: "#9A6B00", background: "#FFF7E5", border: "1px solid #E9CE8A", borderRadius: 3, padding: "0.7rem 0.9rem", margin: "0 0 1rem" },
};
