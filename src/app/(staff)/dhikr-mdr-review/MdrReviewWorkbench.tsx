"use client";

import { useMemo, useState, useTransition } from "react";
import { saveDraft, submitDraft, type MdrReviewDraftDoc, type DraftInput } from "./actions";

/** Read-only, serializable slice of a research-register record — passed from the server component. */
export interface MdrWorkbenchClause {
  clauseId: string;
  exactArabicClause: string;
  apparentGenre: string;
  sourceResearchStatus: string;
  wordingMatch: string;
  unresolvedIssues: string[];
}

export interface MdrWorkbenchRecord {
  internalId: string;
  sequenceNumber: number;
  openingArabicWords: string;
  fullArabicText: string;
  originalDocumentText: string;
  sourceDocumentAnnotations: string[];
  transcriptionStatus: string;
  sourceResearchStatus: string;
  contentClassification: string;
  morningSpecificStatus: string;
  primaryReference: string;
  narrator: string;
  hadithGrading: string;
  wordingMatchStatus: string;
  repetitionCount?: number;
  virtueOrRewardClaim: string;
  scholarlyDecision: string;
  editorialApproval: string;
  importStatus: string;
  isComposite: boolean;
  canImport: boolean;
  blockedReasons: string[];
  proposedPublicationArabic: string;
  unresolvedConcern: string;
  clauses?: MdrWorkbenchClause[];
}

const EMPTY_DRAFT_INPUT: Omit<DraftInput, "mdrId" | "sequenceNumber"> = {
  decision: "",
  correctedArabicText: "",
  correctedEnglishText: "",
  approvedSourceReference: "",
  approvedTiming: "",
  approvedRepetitionCount: undefined,
  approvedVirtueText: "",
  compositeClausesApproved: false,
  reviewerNotes: "",
  reviewerName: "",
  reviewerQualification: "",
  reviewDate: "",
  signedConfirmation: false,
};

const DECISION_OPTIONS: { value: DraftInput["decision"]; label: string }[] = [
  { value: "", label: "(not yet decided)" },
  { value: "approved", label: "Approve" },
  { value: "approved-with-corrections", label: "Approve with corrections" },
  { value: "deferred", label: "Defer" },
  { value: "rejected", label: "Reject" },
];

const TIMING_OPTIONS = ["", "morning-only", "evening-only", "morning-and-evening", "not-time-specific", "uncertain"];

const labelClass = "font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#0E3B2E]/60 block mb-1";
const inputClass = "w-full border border-[#0E3B2E]/20 bg-white px-2 py-1.5 text-sm font-[family-name:var(--font-body)] text-[#0E3B2E]";

function draftToInput(record: MdrWorkbenchRecord, doc: MdrReviewDraftDoc | undefined): DraftInput {
  if (!doc) return { mdrId: record.internalId, sequenceNumber: record.sequenceNumber, ...EMPTY_DRAFT_INPUT };
  return {
    mdrId: record.internalId,
    sequenceNumber: record.sequenceNumber,
    decision: doc.decision ?? "",
    correctedArabicText: doc.correctedArabicText ?? "",
    correctedEnglishText: doc.correctedEnglishText ?? "",
    approvedSourceReference: doc.approvedSourceReference ?? "",
    approvedTiming: doc.approvedTiming ?? "",
    approvedRepetitionCount: doc.approvedRepetitionCount,
    approvedVirtueText: doc.approvedVirtueText ?? "",
    compositeClausesApproved: doc.compositeClausesApproved ?? false,
    reviewerNotes: doc.reviewerNotes ?? "",
    reviewerName: doc.reviewerName ?? "",
    reviewerQualification: doc.reviewerQualification ?? "",
    reviewDate: doc.reviewDate ?? "",
    signedConfirmation: doc.signedConfirmation ?? false,
  };
}

function isComplete(input: DraftInput): boolean {
  return !!input.decision && !!input.reviewerName.trim() && !!input.reviewerQualification.trim() && !!input.reviewDate.trim() && input.signedConfirmation;
}

function fieldRow(label: string, value: string, onChange: (v: string) => void, multiline = false) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {multiline ? (
        <textarea className={inputClass} rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputClass} type="text" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function generateDecisionRecordMarkdown(record: MdrWorkbenchRecord, draft: DraftInput, status: "draft" | "submitted"): string {
  return `# MDR Scholarly Decision Record — ${record.internalId} (${status === "submitted" ? "SUBMITTED — still requires transcription into the register" : "DRAFT, not yet submitted"})

## 1. Identification
- MDR ID: ${record.internalId}
- Decision date: ${draft.reviewDate || "(not set)"}
- Decision: ${draft.decision || "(not yet decided)"}

## 5. Exact approved wording
- Protected originalDocumentText/fullArabicText (unchanged, for reference):
  ${record.fullArabicText}
- Approved publication wording:
  ${draft.correctedArabicText || "(same as protected text)"}

## English meaning
${draft.correctedEnglishText || "(not set)"}

## 6. Approved source reference
${draft.approvedSourceReference || "(not set)"}

## 8. Timing
${draft.approvedTiming || "(not set)"}

## 9. Repetition
${draft.approvedRepetitionCount ?? "(not set)"}

## 10. Virtue/reward
${draft.approvedVirtueText || "(none)"}

${record.isComposite ? `## Composite record\nAll clauses independently approved: ${draft.compositeClausesApproved ? "Yes" : "No"}\n` : ""}
## 14. Reviewer
- Name: ${draft.reviewerName || "(not set)"}
- Qualification: ${draft.reviewerQualification || "(not set)"}
- Signed confirmation: ${draft.signedConfirmation ? "Yes" : "No"}

## Notes
${draft.reviewerNotes || "(none)"}

---
Status: ${status}. This record is not binding on the register until a human transcribes it into the
register via a separate, explicitly-approved commit (see docs/dhikr/40-scholarly-review-and-
adjudication-framework.md, §J).
`;
}

function downloadMarkdown(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type FilterMode = "all" | "completed" | "pending";

export function MdrReviewWorkbench({
  records,
  initialDrafts,
}: {
  records: MdrWorkbenchRecord[];
  initialDrafts: MdrReviewDraftDoc[];
}) {
  const initialDraftMap = useMemo(() => {
    const map: Record<string, MdrReviewDraftDoc> = {};
    for (const d of initialDrafts) map[d.mdrId] = d;
    return map;
  }, [initialDrafts]);

  const [inputs, setInputs] = useState<Record<string, DraftInput>>(() => {
    const map: Record<string, DraftInput> = {};
    for (const r of records) map[r.internalId] = draftToInput(r, initialDraftMap[r.internalId]);
    return map;
  });
  const [savedStatus, setSavedStatus] = useState<Record<string, "draft" | "submitted" | undefined>>(() => {
    const map: Record<string, "draft" | "submitted" | undefined> = {};
    for (const r of records) map[r.internalId] = initialDraftMap[r.internalId]?.status;
    return map;
  });

  const [selectedId, setSelectedId] = useState(records[0]?.internalId ?? "");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [message, setMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const selectedIndex = records.findIndex((r) => r.internalId === selectedId);
  const selected = records[selectedIndex];
  const input = inputs[selectedId];

  const visibleRecords = useMemo(() => {
    if (filter === "all") return records;
    return records.filter((r) => {
      const complete = isComplete(inputs[r.internalId]) && savedStatus[r.internalId] === "submitted";
      return filter === "completed" ? complete : !complete;
    });
  }, [records, inputs, savedStatus, filter]);

  const completedCount = records.filter((r) => savedStatus[r.internalId] === "submitted").length;

  function updateInput(patch: Partial<DraftInput>) {
    setInputs((prev) => ({ ...prev, [selectedId]: { ...prev[selectedId], ...patch } }));
  }

  function goTo(offset: number) {
    const nextIndex = selectedIndex + offset;
    if (nextIndex >= 0 && nextIndex < records.length) {
      setSelectedId(records[nextIndex].internalId);
      setMessage("");
    }
  }

  function handleSave() {
    setMessage("");
    startTransition(async () => {
      const result = await saveDraft(input);
      if (result.ok) {
        setSavedStatus((prev) => ({ ...prev, [selectedId]: "draft" }));
        setMessage(`Draft saved for ${selectedId}.`);
      } else {
        setMessage(`Could not save: ${result.error}`);
      }
    });
  }

  function handleSubmit() {
    setMessage("");
    startTransition(async () => {
      const result = await submitDraft(input);
      if (result.ok) {
        setSavedStatus((prev) => ({ ...prev, [selectedId]: "submitted" }));
        setMessage(`Submitted final decision for ${selectedId}. This still requires transcription into the register.`);
      } else {
        setMessage(`Could not submit: ${result.error}`);
      }
    });
  }

  if (!selected) return null;

  const markdown = generateDecisionRecordMarkdown(selected, input, savedStatus[selectedId] === "submitted" ? "submitted" : "draft");

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
      <nav aria-label="MDR records" className="border border-[#0E3B2E]/10">
        <div className="p-3 border-b border-[#0E3B2E]/10">
          <p className="font-[family-name:var(--font-utility)] text-xs uppercase tracking-widest text-[#0E3B2E]/60 mb-2">
            Progress: {completedCount} / {records.length} submitted
          </p>
          <div className="h-1.5 w-full bg-[#0E3B2E]/10">
            <div className="h-1.5 bg-[#0E3B2E]" style={{ width: `${(completedCount / records.length) * 100}%` }} />
          </div>
          <div className="flex gap-1 mt-3" role="group" aria-label="Filter records">
            {(["all", "pending", "completed"] as FilterMode[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`text-xs px-2 py-1 font-[family-name:var(--font-utility)] uppercase tracking-wide ${
                  filter === f ? "bg-[#0E3B2E] text-white" : "bg-[#0E3B2E]/5 text-[#0E3B2E]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <ul className="divide-y divide-[#0E3B2E]/10 max-h-[60vh] overflow-y-auto">
          {visibleRecords.map((r) => {
            const status = savedStatus[r.internalId];
            return (
              <li key={r.internalId}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(r.internalId);
                    setMessage("");
                  }}
                  aria-current={r.internalId === selectedId}
                  className={`w-full text-left px-3 py-2 text-sm font-[family-name:var(--font-utility)] flex items-center justify-between ${
                    r.internalId === selectedId ? "bg-[#0E3B2E] text-white" : "text-[#0E3B2E] hover:bg-[#0E3B2E]/5"
                  }`}
                >
                  <span>
                    {r.internalId}
                    {r.isComposite && <span className="ml-1 opacity-70">·composite</span>}
                  </span>
                  <span className="text-xs opacity-70">{status === "submitted" ? "✓" : status === "draft" ? "…" : ""}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button type="button" onClick={() => goTo(-1)} disabled={selectedIndex <= 0} className="text-xs font-[family-name:var(--font-utility)] uppercase tracking-widest px-3 py-1.5 border border-[#0E3B2E]/20 disabled:opacity-30">
              ← Previous
            </button>
            <button type="button" onClick={() => goTo(1)} disabled={selectedIndex >= records.length - 1} className="text-xs font-[family-name:var(--font-utility)] uppercase tracking-widest px-3 py-1.5 border border-[#0E3B2E]/20 disabled:opacity-30">
              Next →
            </button>
          </div>
          <span className="text-xs font-[family-name:var(--font-utility)] text-[#0E3B2E]/60">
            Record {selectedIndex + 1} of {records.length}
          </span>
        </div>

        <section aria-labelledby="protected-text-heading" className="border border-[#0E3B2E]/20 p-4">
          <h2 id="protected-text-heading" className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#0E3B2E]/60 mb-2">
            Protected transcription (read-only — {selected.internalId}, sequence {selected.sequenceNumber})
          </h2>
          <p dir="rtl" lang="ar" className="text-lg leading-relaxed text-[#0E3B2E] mb-2">
            {selected.fullArabicText}
          </p>
          {selected.sourceDocumentAnnotations.length > 0 && (
            <p className="text-xs text-[#0E3B2E]/60 mb-2">Annotations: {selected.sourceDocumentAnnotations.join(", ")}</p>
          )}
          <dl className="text-xs text-[#0E3B2E]/70 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
            <dt className="font-medium">Transcription status</dt><dd>{selected.transcriptionStatus}</dd>
            <dt className="font-medium">Proposed publication Arabic</dt><dd>{selected.proposedPublicationArabic}</dd>
            <dt className="font-medium">Source research status</dt><dd>{selected.sourceResearchStatus}</dd>
            <dt className="font-medium">Classification</dt><dd>{selected.contentClassification}</dd>
            <dt className="font-medium">Morning-specific status</dt><dd>{selected.morningSpecificStatus}</dd>
            <dt className="font-medium">Primary reference</dt><dd className="break-words">{selected.primaryReference || "—"}</dd>
            <dt className="font-medium">Narrator</dt><dd className="break-words">{selected.narrator || "—"}</dd>
            <dt className="font-medium">Grading</dt><dd>{selected.hadithGrading || "—"}</dd>
            <dt className="font-medium">Wording match status</dt><dd>{selected.wordingMatchStatus}</dd>
            <dt className="font-medium">Repetition (research)</dt><dd>{selected.repetitionCount !== undefined ? `${selected.repetitionCount}x` : "—"}</dd>
            <dt className="font-medium">Virtue/reward claim</dt><dd className="break-words">{selected.virtueOrRewardClaim || "—"}</dd>
            <dt className="font-medium">Unresolved concerns</dt><dd className="break-words">{selected.unresolvedConcern}</dd>
          </dl>
        </section>

        {selected.clauses && (
          <section aria-labelledby="clauses-heading" className="border border-[#0E3B2E]/20 p-4">
            <h2 id="clauses-heading" className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#0E3B2E]/60 mb-2">
              Clause details (composite record — {selected.clauses.length} clauses)
            </h2>
            <div className="space-y-3">
              {selected.clauses.map((c) => (
                <div key={c.clauseId} className="border border-[#0E3B2E]/10 p-2">
                  <p className="text-xs font-medium text-[#0E3B2E]">{c.clauseId} ({c.apparentGenre})</p>
                  <p dir="rtl" lang="ar" className="text-sm text-[#0E3B2E] my-1">{c.exactArabicClause}</p>
                  <p className="text-xs text-[#0E3B2E]/60">Status: {c.sourceResearchStatus} · Wording: {c.wordingMatch}</p>
                  {c.unresolvedIssues.length > 0 && (
                    <ul className="text-xs text-[#0E3B2E]/60 list-disc pl-4 mt-1">
                      {c.unresolvedIssues.map((issue) => <li key={issue}>{issue}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="gate-status-heading" className="border border-[#0E3B2E]/20 p-4">
          <h2 id="gate-status-heading" className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#0E3B2E]/60 mb-2">
            Live register status
          </h2>
          <p className="text-sm">scholarlyDecision: {selected.scholarlyDecision} · editorialApproval: {selected.editorialApproval} · importStatus: {selected.importStatus}</p>
          <p className="text-sm mt-1">{selected.canImport ? "canImport: true" : `canImport: false (${selected.blockedReasons.length} blocker(s))`}</p>
        </section>

        <section aria-labelledby="draft-heading" className="border border-[#0E3B2E]/20 p-4">
          <h2 id="draft-heading" className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#0E3B2E]/60 mb-3">
            Your review — saved to Sanity, {savedStatus[selectedId] === "submitted" ? "SUBMITTED" : savedStatus[selectedId] === "draft" ? "draft saved" : "not yet saved"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fieldRow("Reviewer name", input.reviewerName, (v) => updateInput({ reviewerName: v }))}
            {fieldRow("Reviewer qualification", input.reviewerQualification, (v) => updateInput({ reviewerQualification: v }))}
            <div>
              <label className={labelClass}>Review date</label>
              <input className={inputClass} type="date" value={input.reviewDate} onChange={(e) => updateInput({ reviewDate: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Decision</label>
              <select className={inputClass} value={input.decision} onChange={(e) => updateInput({ decision: e.target.value as DraftInput["decision"] })}>
                {DECISION_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3">{fieldRow("Corrected/approved Arabic (leave blank if same as protected text)", input.correctedArabicText, (v) => updateInput({ correctedArabicText: v }), true)}</div>
          <div className="mt-3">{fieldRow("English meaning", input.correctedEnglishText, (v) => updateInput({ correctedEnglishText: v }), true)}</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {fieldRow("Approved source reference", input.approvedSourceReference, (v) => updateInput({ approvedSourceReference: v }))}
            <div>
              <label className={labelClass}>Approved timing</label>
              <select className={inputClass} value={input.approvedTiming} onChange={(e) => updateInput({ approvedTiming: e.target.value })}>
                {TIMING_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt || "(not set)"}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Approved repetition count</label>
              <input
                className={inputClass}
                type="number"
                value={input.approvedRepetitionCount ?? ""}
                onChange={(e) => updateInput({ approvedRepetitionCount: e.target.value === "" ? undefined : Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="mt-3">{fieldRow("Approved virtue/reward wording", input.approvedVirtueText, (v) => updateInput({ approvedVirtueText: v }), true)}</div>
          {selected.isComposite && (
            <label className="flex items-center gap-2 mt-3 text-sm text-[#0E3B2E]">
              <input type="checkbox" checked={input.compositeClausesApproved} onChange={(e) => updateInput({ compositeClausesApproved: e.target.checked })} />
              All clauses independently approved
            </label>
          )}
          <div className="mt-3">{fieldRow("Reviewer notes", input.reviewerNotes, (v) => updateInput({ reviewerNotes: v }), true)}</div>

          <label className="flex items-start gap-2 mt-4 text-sm text-[#0E3B2E] border-t border-[#0E3B2E]/10 pt-4">
            <input type="checkbox" checked={input.signedConfirmation} onChange={(e) => updateInput({ signedConfirmation: e.target.checked })} className="mt-1" />
            I confirm this is my own reviewed decision for {selected.internalId}, and I am signing it as final.
          </label>

          <div className="flex flex-wrap gap-3 mt-4">
            <button type="button" onClick={handleSave} disabled={isPending} className="text-xs font-[family-name:var(--font-utility)] uppercase tracking-widest px-4 py-2 border border-[#0E3B2E] text-[#0E3B2E] disabled:opacity-50">
              Save draft
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !isComplete(input)}
              className="text-xs font-[family-name:var(--font-utility)] uppercase tracking-widest px-4 py-2 bg-[#0E3B2E] text-white disabled:opacity-50"
            >
              Submit final decision
            </button>
            <button
              type="button"
              onClick={() => downloadMarkdown(`${selected.internalId}-decision-draft.md`, markdown)}
              className="text-xs font-[family-name:var(--font-utility)] uppercase tracking-widest px-4 py-2 border border-[#0E3B2E]/40 text-[#0E3B2E]"
            >
              Export as Markdown
            </button>
          </div>
          {message && <p className="text-sm mt-3 text-[#0E3B2E]">{message}</p>}
        </section>

        <section aria-labelledby="markdown-heading" className="border border-[#0E3B2E]/20 p-4">
          <h2 id="markdown-heading" className="font-[family-name:var(--font-utility)] text-xs font-medium uppercase tracking-widest text-[#0E3B2E]/60 mb-2">
            Generated decision-record preview
          </h2>
          <textarea readOnly className="w-full h-56 border border-[#0E3B2E]/20 bg-[#0E3B2E]/5 p-2 text-xs font-mono" value={markdown} />
        </section>
      </div>
    </div>
  );
}
