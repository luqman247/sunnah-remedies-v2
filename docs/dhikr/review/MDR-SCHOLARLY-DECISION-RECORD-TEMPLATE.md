# MDR Scholarly Decision Record — Template

**Purpose**: the final, adjudicated outcome for one `MDR-0XX` record (or one clause of a composite record), distilled from one or more completed [MDR Scholarly Review Worksheets](MDR-SCHOLARLY-REVIEW-TEMPLATE.md). This is **not the same document as the worksheet**:

- A **worksheet** is a working aid completed once per reviewer, per review pass — it captures one person's process and reasoning as they work through a record.
- A **decision record** is the single, adjudicated outcome for a record, synthesised from the (at minimum two, per framework §B/§C) worksheets that led to it. There is one current decision record per record (or per clause); there may be several worksheets behind it, including superseded ones from earlier review rounds.

Only a completed decision record — not a worksheet alone — is sufficient basis for changing `scholarlyDecision`, `scholarlyReviewer`, or any other register field, and even then only via a separate, explicitly-approved commit under this project's standing checkpoint discipline (see [40-scholarly-review-and-adjudication-framework.md](../40-scholarly-review-and-adjudication-framework.md), §J).

Copy this file per record/clause decision (e.g. `MDR-006-decision-2026-XX-XX.md`) rather than editing this template in place.

---

## 1. Identification

- **MDR ID**: `MDR-0__`
- **Clause ID (if this decision covers a single clause)**: `MDR-0__-_` or "N/A — whole record"
- **Decision date**:
- **Decision version**: *(v1, v2, ... — increment on re-adjudication)*
- **Superseded decision record, if any**: *(link/filename of the prior version this replaces)*

## 2. Worksheets relied upon

| Reviewer | Role | Worksheet file | Date |
|---|---|---|---|
| | Primary | | |
| | Secondary | | |

## 3. Evidence relied upon

*List every source actually used to reach this decision, with its evidence tier (framework §D). This is the accepted evidentiary basis — not everything reviewed, only what the decision rests on.*

| Source | Evidence tier | What it established |
|---|---|---|
| | | |

## 4. Evidence rejected

*List every source considered but not relied upon, and why — including any source that supported a different conclusion. This is required for audit purposes; a decision record that only shows supporting evidence is incomplete.*

| Source | Why rejected / not relied upon |
|---|---|

## 5. Exact approved wording

- **Protected `originalDocumentText`/`fullArabicText`**: unchanged — copy exactly from the register for the record, confirming no alteration:

  ```
  [paste exact protected text]
  ```

- **Approved publication wording, if different from the protected text** *(this is a proposal for a distinct publication-wording field per framework §E — it does not overwrite the protected fields above, and does not exist as a live register field until that field is implemented)*:

  ```
  [paste approved publication wording, if any]
  ```

- **Nature of any difference between the two** *(punctuation-only / vocalisation-only / recognised variant / corrected transcription error — cite framework §E category)*:

## 6. Approved source reference

- **Collection**:
- **Edition / printing**:
- **Book / chapter**:
- **Hadith or entry number**:
- **Narrator (full chain as established)**:
- **Route** *(if the record has more than one reported route — state which route this decision covers)*:

## 7. Grading scope

- **Approved grading term(s), with authority**:
- **Explicitly covers** *(route + wording + count + reward clause, per framework §F's scoping requirement — an unscoped grading is not a valid outcome)*:
- **Explicitly does NOT cover** *(any other route/wording/count/reward variant found during research but not authenticated by this grading)*:
- **Disputed?** Yes / No — *(if yes, both/all positions and their authorities, as recorded in the worksheets, are carried forward here, not resolved by omission)*

## 8. Timing

- **Approved `morningSpecificStatus`**:
- **Approved `contentClassification`**:
- **Basis** *(wording-internal / narration-frame / explicit source-document heading — never chapter or compilation placement alone)*:

## 9. Repetition

- **Approved `repetitionCount`**:
- **Approved `repetitionEvidence`** *(must state which source ties this count to the narration, not merely the document annotation)*:
- **If no count is approved despite a source-document annotation, state why** *(e.g. annotation-only, no narration-level confirmation found)*:

## 10. Virtue/reward

- **Approved `virtueOrRewardClaim`** *(full text, preserving action/timing/count/conditions/certainty/outcome/grading-limitation per framework §H)*:
- **Approved `virtueEvidence`**:
- **Confirmation this claim is not a promotional simplification of a conditional/graduated source claim**: [ ] Confirmed

## 11. Conditions

*Only populated if `scholarlyDecision` is `approved-with-conditions`. Each condition must be independently checkable by a downstream step (editorial approval, import gate, or publication).*

1.
2.

## 12. Public wording

- **Proposed public-facing English translation** *(if within scope of this decision — otherwise "deferred to translation review")*:
- **Proposed public-facing Danish translation** *(if within scope)*:
- **Editorial approver sign-off status**: not yet reviewed / approved / returned *(editorial review is independent of and follows this decision — framework §B)*

## 13. Unresolved caveats

*Every open question this decision does not resolve, carried forward explicitly rather than silently dropped — e.g. "the direct primary page for this record has still not been fetched; this decision rests on tier-3 WebSearch synthesis corroborated by two independent sources."*

1.
2.

## 14. Second-review confirmation

- **Secondary reviewer name**:
- **Secondary reviewer confirms**: agreement with primary reviewer / documented disagreement, resolved as follows: ___________
- [ ] I confirm this decision was not finalised on the basis of a single reviewer's worksheet alone.

## 15. Import recommendation

- **Recommended `scholarlyDecision` value**: pending / approved / approved-with-conditions / revision-required / rejected / deferred
- **Does this decision, combined with the record's current `sourceResearchStatus`, `wordingMatchStatus`, and evidence fields, satisfy every condition in framework §J?** Yes / No — *(if "No," state exactly which condition(s) remain unmet; a decision record recommending import readiness while a §J condition is unmet is not internally consistent and must not be finalised as such)*
- **Recommended `importStatus` transition**: none (remains research-only) / recommend `import-ready` *(this decision record alone does not perform the transition — a separate, explicitly-approved commit is required per framework §J, condition 9)*

## 16. Audit trail

- **Full history of decisions for this record/clause** *(list every prior decision-record version, its outcome, and why superseded, so the record's adjudication history is never lost — consistent with [30-correction-and-withdrawal-procedure.md](../30-correction-and-withdrawal-procedure.md)'s "do not delete as the default response" principle)*:

  | Version | Date | Outcome | Superseded by / reason |
  |---|---|---|---|
  | v1 | | | |

- **This decision record's own status**: current / superseded
