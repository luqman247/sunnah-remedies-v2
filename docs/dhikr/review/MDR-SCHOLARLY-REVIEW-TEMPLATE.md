# MDR Scholarly Review Worksheet — Template

**Purpose**: the working document a **primary** or **secondary scholarly reviewer** (see [40-scholarly-review-and-adjudication-framework.md](../40-scholarly-review-and-adjudication-framework.md), §B) completes while adjudicating one `MDR-0XX` record. This worksheet is a working aid — it has no effect on the register by itself. A reviewer's conclusions are only binding once transcribed into a **[MDR Scholarly Decision Record](MDR-SCHOLARLY-DECISION-RECORD-TEMPLATE.md)**, which is a distinct, separate artifact (see that template for why).

Copy this file per review (e.g. `MDR-006-review-2026-XX-XX-primary.md`) rather than editing this template in place.

---

## 1. Identification

- **MDR ID**: `MDR-0__`
- **Clause ID (if reviewing a single clause of a composite record)**: `MDR-0__-_` or "N/A — whole record"
- **Reviewer name**:
- **Reviewer qualification**: *(e.g. institution, ijazah, specific field of expertise — record enough that a future reader can assess the review's own authority, per the framework's audit-trail requirement)*
- **Review role**: Primary / Secondary *(select one)*
- **Review date**:
- **Review version**: *(increment if this record/clause is re-reviewed after `revision-required` — e.g. v1, v2)*

## 2. Protected text confirmation

- **Protected Arabic reviewed** (`originalDocumentText`/`fullArabicText`, copied verbatim from `src/lib/dhikr-research/morning-dhikr-register.ts` — do not retype from memory):

  ```
  [paste exact fullArabicText here]
  ```

- [ ] I have confirmed this text is copied directly from the register, not retyped.
- [ ] I understand this field is protected and I am not proposing to edit it directly (see §5 below if a correction is genuinely warranted).

## 3. Source Arabic reviewed

- **Source Arabic reviewed** (the comparison text used for wording adjudication — paste exactly, and label its evidence tier per the framework §D):

  ```
  [paste comparison Arabic here]
  ```

- **Evidence tier of the source Arabic above** (framework §D, tier 1–8): ____
- **Primary source inspected**: Yes / No — *(if "No," state the strongest tier actually reached and why a stronger tier was not reachable in this review)*
- **Edition and hadith number**: *(exact collection, edition/printing if known, book, chapter, hadith number)*
- **Narrator**: *(exact chain as far as established)*
- **Route** *(if more than one route exists for this record/clause — see MDR-009, MDR-020, MDR-029 precedents)*:

## 4. Attribution

- **Reported narrator chain (isnad), as far as established**:
- **Prophetic attribution**: direct / narrator-relayed / disputed / not established
- **Mawquf / marfu' / mursal status, if relevant**:
- **Connectivity (ittisal) concerns, if any** *(e.g. an unnamed link, an unconfirmed hearing relationship — see MDR-009's Makhul–Anas precedent)*:

## 5. Grading

- **Grading term(s) reported, with authority and exact source for each** *(list every authority separately — do not merge into one summary term; see framework §F)*:

  | Authority | Grading term | Source cited | Directly inspected? |
  |---|---|---|---|
  | | | | |

- **Is grading disputed among named authorities?** Yes / No — *(if yes, this must not be resolved by majority vote; document the disagreement in full — framework §F)*
- **Grading scope** *(state explicitly which route, which exact wording, which repetition count, and which reward clause this grading covers — an unscoped grading is not valid per framework §F)*:

## 6. Wording comparison

- **Outcome** *(select one, per framework §E)*: exact match / punctuation-only difference / vocalisation-only difference / recognised variant / transcription error / compilation combination / composite record / unresolved wording / protected source-document typo
- **Basis for this determination**:
- **If "recognised variant": cite the specific source establishing recognised status** *(not merely "it looks similar" — this must not be assigned on plausibility alone)*:
- **If "transcription error" or "protected source-document typo": proposed publication wording** *(never written into `originalDocumentText`/`fullArabicText` — see framework §E)*:

## 7. Recognised variant decision

- **Is any wording difference found here already documented elsewhere in this register as a recognised variant?** Yes / No / N/A
- **If yes, cite the other record/clause**:

## 8. Timing decision

- **Basis relied upon** *(select all that genuinely apply, per framework §G — do not infer one from another)*: wording-internal timing / narration-frame timing / explicit source-document heading / chapter placement (not sufficient alone) / compilation placement (not sufficient alone) / narrative context (not an instruction — must not be used)
- **Recommended `morningSpecificStatus`**: uncertain / morning-only / evening-only / morning-and-evening / not-time-specific
- **Recommended `contentClassification`**:

## 9. Repetition decision

- **Source-document annotation** *(as transcribed, if any)*:
- **Narration-supported count, if established** *(distinct fact from the annotation — framework §G)*:
- **Reward threshold, if the count is tied to a graduated reward**:
- **Later compilation instruction, if the count derives only from a compilation convention rather than the narration itself**:
- **Recommended `repetitionCount`**:
- **Is this count tied to a source sufficient for approval (framework §G)?** Yes / No

## 10. Virtue/reward decision

Confirm each of the following is preserved in the reviewed claim (framework §H) — do not approve a claim missing any of these:

- [ ] Action precisely stated
- [ ] Timing condition stated (or explicitly absent, if genuinely unconditioned)
- [ ] Count condition stated (or explicitly absent)
- [ ] All other conditions preserved (certainty, death-timing, etc., as applicable)
- [ ] Certainty/grading level of the claim itself stated
- [ ] Exact outcome preserved, not paraphrased into an unconditional promise
- [ ] Grading limitation of the claim stated separately from the base narration's grading

- **Recommended `virtueOrRewardClaim` text**:
- **Recommended `virtueEvidence` text**:

## 11. Clause-by-clause decisions (composite records only — framework §I)

*Repeat this block per clause. Leave blank if this record is not composite.*

| Clause ID | Source status | Grading | Wording | Timing | Repetition | Virtue/reward | Clause decision |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

- [ ] I confirm reconstruction-integrity for this record's clause map is currently passing (per its dedicated test) as a precondition for this review.

## 12. Required corrections

*List every specific, actionable item that must be resolved before this record can move past `revision-required`, if applicable. Do not write "needs more work" — each item must be independently addressable.*

1.
2.

## 13. Publication wording proposal

*Only if wording adjudication in §6 produced a proposed correction. This is a proposal for a future, separate publication-wording field — it is not written into any protected field by this worksheet.*

## 14. Reviewer confidence

- **Overall confidence in this review**: High / Medium / Low
- **What would raise confidence, if not already at High**:

## 15. `scholarlyDecision` recommendation

- **Recommended value** *(framework §C)*: pending / approved / approved-with-conditions / revision-required / rejected / deferred
- **Rationale** *(required — a recommendation without rationale is not usable)*:

## 16. Conditions *(only if recommending `approved-with-conditions`)*

*List every condition explicitly. A condition is something a downstream step must satisfy, not a vague caveat.*

1.
2.

## 17. Signature / approval line

- **Reviewer signature (name, role, date)**:
- **This worksheet reflects my own review; it is not a copy of another reviewer's conclusions.**  [ ] Confirmed

## 18. Second-review requirement

- [ ] This worksheet is a **primary** review — a secondary scholarly reviewer's independent worksheet is required before any `scholarlyDecision` other than `pending`, `revision-required`, `rejected`, or `deferred` may be finalised (framework §B, §C).
- [ ] This worksheet is a **secondary** review — the primary reviewer's worksheet has been read; any disagreement is documented in §5/§6/§8/§9/§10 above, not silently overridden.
