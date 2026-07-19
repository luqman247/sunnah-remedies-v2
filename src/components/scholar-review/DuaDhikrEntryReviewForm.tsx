"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { saveDuaDhikrEntryReviewAction } from "@/app/scholar-review/actions";
import type { DuaDhikrEntryReviewInput } from "@/lib/scholar-review/review-records";
import { DUA_DHIKR_ENTRY_DECISIONS, DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT, DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS } from "@/lib/scholar-review/decision-labels";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function DuaDhikrEntryReviewForm({
  entryId,
  initial,
  duplicateCandidates,
  locked = false,
}: {
  entryId: string;
  initial: (DuaDhikrEntryReviewInput & { completed?: boolean }) | null;
  duplicateCandidates: { _id: string; titleEn: string }[];
  locked?: boolean;
}) {
  const [fields, setFields] = useState<DuaDhikrEntryReviewInput>({
    decision: initial?.decision,
    comments: initial?.comments ?? "",
    proposedArabicCorrection: initial?.proposedArabicCorrection ?? "",
    proposedArabicCorrectionReason: initial?.proposedArabicCorrectionReason ?? "",
    proposedTranslation: initial?.proposedTranslation ?? "",
    proposedTransliteration: initial?.proposedTransliteration ?? "",
    correctedSource: initial?.correctedSource ?? "",
    hadithGrading: initial?.hadithGrading ?? "",
    duplicateTargetEntry: initial?.duplicateTargetEntry,
    duplicateResolution: initial?.duplicateResolution,
    virtueConcern: initial?.virtueConcern ?? "",
    explanationConcern: initial?.explanationConcern ?? "",
    generalComments: initial?.generalComments ?? "",
  });
  const [completed, setCompleted] = useState(!!initial?.completed);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const commentRequired = fields.decision ? !DUA_DHIKR_ENTRY_DECISIONS_NOT_REQUIRING_COMMENT.has(fields.decision) : false;

  function update<K extends keyof DuaDhikrEntryReviewInput>(key: K, value: DuaDhikrEntryReviewInput[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function save(markCompleted: boolean) {
    setStatus("saving");
    startTransition(async () => {
      const result = await saveDuaDhikrEntryReviewAction(entryId, fields, markCompleted);
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
      setValidationError("Select a decision before marking this entry as reviewed.");
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
      const result = await saveDuaDhikrEntryReviewAction(entryId, fields, true);
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
          <strong>Decision:</strong> {DUA_DHIKR_ENTRY_DECISIONS.find((d) => d.value === initial?.decision)?.label ?? "Not reviewed"}
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
        {DUA_DHIKR_ENTRY_DECISIONS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>

      <label style={styles.label}>
        Comments {commentRequired && <span style={{ color: "#9A2B2B" }}>(required)</span>}
      </label>
      <textarea value={fields.comments ?? ""} onChange={(e) => update("comments", e.target.value)} rows={4} style={styles.textarea} />

      {fields.decision === "approved-with-arabic-correction" && (
        <Fieldset title="Proposed Arabic correction">
          <p style={styles.hint}>The original Arabic text is never edited directly — this is a proposed replacement for an editor to apply, with your reason.</p>
          <textarea
            value={fields.proposedArabicCorrection ?? ""}
            onChange={(e) => update("proposedArabicCorrection", e.target.value)}
            rows={3}
            dir="rtl"
            style={{ ...styles.textarea, fontSize: "1.15rem" }}
            placeholder="Proposed Arabic text…"
          />
          <textarea
            value={fields.proposedArabicCorrectionReason ?? ""}
            onChange={(e) => update("proposedArabicCorrectionReason", e.target.value)}
            rows={2}
            style={styles.textarea}
            placeholder="Reason for this correction…"
          />
        </Fieldset>
      )}

      {fields.decision === "approved-with-translation-revision" && (
        <Fieldset title="Proposed translation">
          <textarea value={fields.proposedTranslation ?? ""} onChange={(e) => update("proposedTranslation", e.target.value)} rows={3} style={styles.textarea} />
        </Fieldset>
      )}

      {fields.decision === "approved-with-transliteration-revision" && (
        <Fieldset title="Proposed transliteration">
          <textarea value={fields.proposedTransliteration ?? ""} onChange={(e) => update("proposedTransliteration", e.target.value)} rows={3} style={styles.textarea} />
        </Fieldset>
      )}

      {fields.decision === "approved-with-source-correction" && (
        <Fieldset title="Corrected source citation">
          <textarea value={fields.correctedSource ?? ""} onChange={(e) => update("correctedSource", e.target.value)} rows={2} style={styles.textarea} />
        </Fieldset>
      )}

      {fields.decision === "hadith-grading-required" && (
        <Fieldset title="Proposed hadith grading">
          <input type="text" value={fields.hadithGrading ?? ""} onChange={(e) => update("hadithGrading", e.target.value)} style={styles.input} placeholder="e.g. Sahih, Hasan, Da'if — with grader" />
        </Fieldset>
      )}

      {fields.decision === "duplicate-consolidate" && (
        <Fieldset title="Duplicate resolution">
          {duplicateCandidates.length > 0 ? (
            <>
              <label style={styles.label}>Duplicate target entry</label>
              <select value={fields.duplicateTargetEntry ?? ""} onChange={(e) => update("duplicateTargetEntry", e.target.value || undefined)} style={styles.select}>
                <option value="">Select the other entry…</option>
                {duplicateCandidates.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.titleEn}
                  </option>
                ))}
              </select>
            </>
          ) : (
            <p style={styles.hint}>No automatically-detected duplicate for this entry. Describe the suspected duplicate in your comments.</p>
          )}
          <label style={styles.label}>Resolution</label>
          <select value={fields.duplicateResolution ?? ""} onChange={(e) => update("duplicateResolution", e.target.value || undefined)} style={styles.select}>
            <option value="">Select a resolution…</option>
            {DUA_DHIKR_ENTRY_DUPLICATE_RESOLUTIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </Fieldset>
      )}

      <Fieldset title="Additional notes (optional)">
        <label style={styles.label}>Virtue text concern</label>
        <textarea value={fields.virtueConcern ?? ""} onChange={(e) => update("virtueConcern", e.target.value)} rows={2} style={styles.textarea} />
        <label style={styles.label}>Explanation concern</label>
        <textarea value={fields.explanationConcern ?? ""} onChange={(e) => update("explanationConcern", e.target.value)} rows={2} style={styles.textarea} />
        <label style={styles.label}>General comments</label>
        <textarea value={fields.generalComments ?? ""} onChange={(e) => update("generalComments", e.target.value)} rows={2} style={styles.textarea} />
      </Fieldset>

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

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ margin: "1rem 0", padding: "0.9rem", background: "#F9F6EF", border: "1px solid #EDE7D9", borderRadius: 4 }}>
      <p style={{ margin: "0 0 0.6rem", fontSize: "0.85rem", fontWeight: 600, color: "#0E3B2E" }}>{title}</p>
      {children}
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
  input: { width: "100%", boxSizing: "border-box", padding: "0.55rem 0.65rem", border: "1px solid #C9C2B1", borderRadius: 3, fontSize: "0.9rem" },
  textarea: { width: "100%", boxSizing: "border-box", padding: "0.55rem 0.65rem", border: "1px solid #C9C2B1", borderRadius: 3, fontSize: "0.9rem", fontFamily: "inherit", marginBottom: "0.5rem" },
  hint: { fontSize: "0.8rem", color: "#6B6455", margin: "0 0 0.5rem" },
  primaryButton: { padding: "0.6rem 1.1rem", background: "#0E3B2E", color: "#F6F3EE", border: "none", borderRadius: 3, fontSize: "0.88rem", fontWeight: 600, cursor: "pointer" },
  secondaryButton: { padding: "0.6rem 1.1rem", border: "1px solid #C9C2B1", background: "#FFFFFF", borderRadius: 3, fontSize: "0.88rem", cursor: "pointer" },
  statusSaving: { fontSize: "0.82rem", color: "#6B6455" },
  statusSaved: { fontSize: "0.82rem", color: "#0E3B2E", fontWeight: 600 },
  statusError: { fontSize: "0.82rem", color: "#9A2B2B", fontWeight: 600 },
  lockedNotice: { fontSize: "0.85rem", color: "#9A6B00", background: "#FFF7E5", border: "1px solid #E9CE8A", borderRadius: 3, padding: "0.7rem 0.9rem", margin: "0 0 1rem" },
};
