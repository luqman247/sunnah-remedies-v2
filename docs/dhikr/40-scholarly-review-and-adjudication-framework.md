# 40 — Scholarly Review and Adjudication Framework (Stage 4A)

**Status of this document**: architecture and governance specification only. No `MDR-0XX` record's `scholarlyDecision`, `scholarlyReviewer`, or `importStatus` is changed by this document. No hadith grading, wording, timing, repetition, or virtue/reward field on any record is changed by this document. This document does not itself review MDR-001.

## A. Purpose

Stage 3B (see [32-morning-dhikr-source-register.md](32-morning-dhikr-source-register.md) and `docs/dhikr/research/`) produced *research* — for each of the 30 records, a best-effort, evidence-labelled account of narrator, collection, grading, wording comparison, timing, repetition, and virtue/reward claims, almost entirely from WebSearch synthesis and a small number of directly fetched pages. Research is not adjudication. No record has been read by a qualified reviewer against a raw primary text; no record has a named human decision attached to it beyond the placeholder `"pending"`.

Stage 4 converts Stage 3B research into **explicit, attributable scholarly decisions** — a named reviewer, on a named date, records a specific decision about a specific record's source, wording, grading, and claims, with a documented rationale — **without altering the protected transcription evidence** (`originalDocumentText`, `fullArabicText`, `sourceDocumentAnnotations`) that Stage 3A established and every later stage has been forbidden from silently correcting.

Stage 4 is not one event. It is a pipeline with distinct actors and distinct gates:

```
Stage 3B research (done, all 30 records)
        │
        ▼
Stage 4A — this document: define the process, roles, states, and artifacts
        │
        ▼
Stage 4B — per-record scholarly + wording + editorial adjudication (not started)
        │
        ▼
Stage 4C — import approval + Sanity `dhikrItem` creation (not started, gated by
           the EXISTING canonical publication gate — see §J)
        │
        ▼
Stage 5 — public publication (not started, gated by the EXISTING
           `src/sanity/lib/dhikr-publication-gate.ts`, unchanged by any of this)
```

This document defines Stage 4A only: the framework, not a single verdict.

### Relationship to the existing (pre-register) review system

This project already has a scholarly/editorial review system for `dhikrItem` documents in Sanity: [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md), [23](23-source-verification-checklist.md), [24](24-scholarly-review-form.md), [25](25-editorial-review-checklist.md), [29](29-publication-approval-checklist.md), [30](30-correction-and-withdrawal-procedure.md), backed by `boardApproval` objects (`board: "scholarly" | "editorial"`, a single `approved` boolean) and the canonical gate (`src/sanity/lib/dhikr-publication-gate.ts`). That system was designed for content that already lives in Sanity as a `dhikrItem` draft.

The Morning Dhikr Register deliberately does **not** live in Sanity (ADR-020, [21-decision-log.md](21-decision-log.md#adr-020)) — precisely so that 30 unresearched, unreviewed transcriptions are never one accidental status flip away from the publication gate. This framework is the **missing pre-Sanity layer**: it governs how a register record earns the right to become a `dhikrItem` draft at all. It does not replace, weaken, or bypass the existing `boardApproval`/`reviewStatus`/publication-gate system — a record that clears Stage 4 under this framework still enters Sanity as an unreviewed `dhikrItem` (`reviewStatus: "sourced"`) and must independently clear scholarly board approval, editorial board approval, and the seven-condition eligibility gate before it can ever be `published`. Stage 4 decisions recorded under this framework are **not** the same thing as a `boardApproval` entry, and populating one does not populate the other.

## B. Roles

| Role | Scope of authority | May decide |
|---|---|---|
| **Research compiler** | The Stage 3B work already performed. No further authority once Stage 4 begins on a record — cannot self-adjudicate their own research. | Nothing at Stage 4. May be consulted for clarification. |
| **Primary scholarly reviewer** | A single named, qualified individual assigned to a specific `MDR-0XX` record (or clause, for composite records). Performs the first substantive scholarly adjudication. | Source identification (which narration, which collection, which route); hadith grading, scoped to the exact route/wording/count/reward (§F); recognised-variant status (§E); timing classification (§G); repetition-count approval (§G); virtue/reward wording approval (§H); recommends a `scholarlyDecision` value (§C). |
| **Secondary scholarly reviewer** | An independent qualified individual who did not perform the primary review of the same record. Required before any record reaches `approved` (see §C, §J) — a single reviewer's judgment is never sufficient for final approval, mirroring the "no single point of failure" principle already used for scholarly + editorial board approval in the existing Sanity workflow. | Confirms, disputes, or overrides the primary reviewer's grading/wording/timing/repetition/virtue decisions; may independently request `revision-required`; may not unilaterally record `approved` alone without addressing any disagreement with the primary reviewer explicitly. |
| **Arabic-text editor** | A qualified individual competent in classical Arabic orthography and diacritics, distinct from (but may overlap in person with) a scholarly reviewer. | Wording adjudication mechanics (§E): exact-match vs. punctuation-only vs. vocalisation-only vs. recognised-variant vs. transcription-error vs. compilation-combination determinations. Proposes corrected **publication** wording (never edits `originalDocumentText`/`fullArabicText` — see §E). Does **not** decide hadith authenticity or grading. |
| **Editorial approver** | The existing Editorial reviewer role from [03](03-authenticity-and-scholarly-review-policy.md)/[25](25-editorial-review-checklist.md), scoped here to register-level records rather than `dhikrItem` documents. Reviews tone, presentation, and public-suitability of the *proposed publication wording and translation*, after scholarly and Arabic-text adjudication are complete. | Public suitability of presentation only (§B decision list). Cannot approve or reopen a record on authenticity, grading, or wording-accuracy grounds — per the existing policy, an authenticity question found during editorial review is routed back to the scholarly reviewer(s), not resolved at this stage. |
| **Technical gatekeeper** | A engineering role, not a scholarly one. Verifies that `computeImportGate` and this framework's own decision-state requirements are actually satisfied before any code change moves a record's `importStatus` away from `research-only`, and verifies protected fields remain untouched throughout. | Nothing substantive about content. Confirms mechanically that every condition in §J is met before an `importStatus` transition is technically permitted to be made (by a separate, explicitly-approved commit, per this project's standing checkpoint discipline). Has authority to **block** a transition on gate-failure grounds; has no authority to **approve** content. |

### Who may decide what (summary table)

| Decision | Deciding role(s) |
|---|---|
| Source identification (which narration/collection/route) | Primary scholarly reviewer, confirmed by secondary scholarly reviewer |
| Hadith grading (scoped) | Primary + secondary scholarly reviewer (must agree, or the disagreement itself becomes the recorded outcome — see §F) |
| Wording selection / recognised-variant status | Arabic-text editor, with scholarly reviewer sign-off where a wording difference bears on grading scope |
| Timing (morning/evening/general) | Primary scholarly reviewer, confirmed by secondary |
| Repetition count | Primary scholarly reviewer — approvable only when tied to a source (§G) |
| Virtue/reward wording | Primary scholarly reviewer, confirmed by secondary — full-condition preservation is checked by both |
| Public suitability (tone, presentation) | Editorial approver, after scholarly + Arabic-text adjudication is complete |
| Protected-text correction *proposals* | Arabic-text editor may **propose**; only a documented, explicit, separately-approved decision (outside this framework's normal flow — see §E) may ever authorise touching `originalDocumentText`/`fullArabicText`, and never silently |
| Import approval (`importStatus` transition) | Requires §J's full condition set to be met; mechanically confirmed by the technical gatekeeper; the transition itself is still only ever made via this project's standing "do not commit without explicit approval" checkpoint discipline |

## C. Decision states

`scholarlyDecision` is currently declared as `scholarlyDecision: string` in `src/lib/dhikr-research/types.ts` — a free-text field, **not** a TypeScript union type. Only one value is actually in use across all 30 records today: `"pending"` (the Stage 3A/3B default, meaning "not yet reviewed"). This document does **not** convert `scholarlyDecision` to a union type in Stage 4A — the task's instruction to "not alter enums in Stage 4A unless the specification proves a change is necessary" is read literally: proposing a controlled vocabulary in prose, without editing `types.ts`, is sufficient for Stage 4A. Converting the field to an actual union type (recommended for Stage 4B, so `computeImportGate` and the register's own type system can enforce these values rather than relying on convention) is listed as an open follow-up in §J.

The values below are **proposed** for Stage 4B use. None is implemented as a compile-time-checked value today; all are currently expressible only as free text in the same `scholarlyDecision: string` field.

| Value | Meaning | Entry criteria |
|---|---|---|
| `pending` | **Currently the only value in use.** No scholarly adjudication has occurred. This is the Stage 3A default and remains the value for every record until Stage 4B review of that specific record begins. | Default. No action required to enter this state — every record starts here. |
| `approved` | Both primary and secondary scholarly reviewers agree the record's source, grading (as scoped), wording, timing, repetition, and virtue/reward claims are each individually sound, with no unresolved caveat that would mislead a reader. | Requires: primary review complete; secondary review complete and concurring; Arabic-text adjudication complete (§E); for composite records, every clause independently `approved` (§I); no open `revision-required` item. |
| `approved-with-conditions` | Both reviewers agree the record may proceed, but only if specific, named conditions are attached to the eventual public presentation (e.g., a grading caveat must be shown, or a specific wording variant must be labelled as such). This is **not** a weaker version of `approved` that skips conditions — it is a record of what must accompany the record if it proceeds. | Same as `approved`, plus: at least one explicit, itemised condition recorded in the decision record (§ decision-record template) that a downstream editorial/import step must satisfy. A record in this state is not more import-ready than `revision-required` until its conditions are separately confirmed as met. |
| `revision-required` | A reviewer (primary or secondary) has identified a specific, addressable gap — e.g., a citation needs a raw-source check, a wording comparison needs to be redone against a directly fetched page — that does not amount to rejection but must be resolved before re-review. | Any reviewer may enter this state unilaterally. Must be accompanied by a specific, actionable list of what is required (not merely "needs more work"). |
| `rejected` | The underlying source is judged fabricated, unauthenticated beyond any reasonable scholarly threshold, or the record cannot be responsibly attributed to a source at all (e.g., MDR-013's currently-unidentified narration, if no narration is ever located). Rejection is a considered, reasoned scholarly judgment, not merely "we ran out of time." | Requires both primary and secondary reviewer agreement, or an explicit documented override by a designated senior scholarly authority if they disagree. A rejected record does not silently disappear — its decision record and rationale are retained for audit (§ decision-record template), consistent with [30-correction-and-withdrawal-procedure.md](30-correction-and-withdrawal-procedure.md)'s "do not delete as the default response" principle. |
| `deferred` | Adjudication is intentionally postponed — e.g., pending an external scholarly consultation, pending access to a specific raw printed edition, or pending a decision on a cross-cutting policy question (such as how the project wants to handle graduated/disputed gradings generally) that affects more than one record. | Any reviewer may propose; should record what condition would end the deferral, so it does not become a silent, permanent non-decision. |

`importStatus` (already a real TypeScript union in `types.ts`: `"research-only" | "import-ready" | "imported" | "rejected"`) is unaffected by this document and remains `"research-only"` for all 30 records — see §J for exactly what must be true before any record may even be considered for `"import-ready"`.

## D. Source adjudication

A reviewer choosing between competing evidentiary claims for the same record applies this hierarchy — from strongest to weakest — consistent with the evidence-quality vocabulary already established throughout the Stage 3B audit reports:

1. **Raw primary source** — a printed edition, manuscript, or scan of the actual named collection (e.g., a physical or PDF copy of Sahih Muslim), inspected character-for-character. **Not yet achieved for any of the 30 records.**
2. **Recognised primary hosting, directly fetched** — a reputable digital hosting of the primary collection itself (e.g., islamweb.net/ar/library), opened via a fetch tool and its returned text treated as **tool-mediated**, not raw. Achieved for a minority of records in Stage 3B (e.g., MDR-006, MDR-008, MDR-009, MDR-014's Qur'anic clause).
3. **Tool-mediated primary quotation via WebSearch synthesis** — an AI-generated summary that quotes or paraphrases primary-collection wording without the reviewer having opened the primary page directly. This is the evidentiary basis for the majority of Stage 3B research (MDR-010 through MDR-030 almost entirely).
4. **Classical commentary or secondary compilation** — a recognised classical work (e.g., Majma' al-Zawa'id, 'Amal al-Yawm wa'l-Layla) that quotes and evaluates an earlier primary report, directly inspected. Distinct from, and never treated as equivalent to, the primary collection itself (see MDR-003's Majma' al-Zawa'id precedent).
5. **Modern takhrij (hadith-verification) discussion** — a modern scholarly article or fatwa page discussing a hadith's grading and sourcing, directly fetched (e.g., islamweb.net fatwa pages, khaledalsabt.com).
6. **Compilation provenance only** — a modern devotional compilation's (Hisn al-Muslim, Hisn al-Hasin) inclusion of a text, used only to note that the compilation carries it, never as evidence of authenticity.
7. **Search-engine snippet or title** — a page title or short snippet seen in search results but not opened (`dorar.net` titles blocked at 403 throughout this project are a recurring example). Identifies a lead only.
8. **AI/WebSearch synthesis alone, unconfirmed by anything above** — a WebSearch tool's own generated summary with no corroborating directly-fetched source.

**AI synthesis alone (tier 8, and in practice most of tier 3) cannot support final approval.** A record whose strongest evidence is WebSearch synthesis (the great majority of MDR-010 through MDR-030 as of Stage 3B) requires at minimum a tier-2 (directly fetched recognised hosting) confirmation before a reviewer may record `approved`. `approved-with-conditions` may be used where a reviewer judges the tier-3/4/5 evidence sufficiently convergent (multiple independent tool-mediated sources agreeing) to proceed with an explicit caveat, but this remains a documented, conscious downgrade from full confidence, not a default.

## E. Wording adjudication

| Outcome | Meaning | Required reviewer action |
|---|---|---|
| **Exact match** | The compared source's wording is character-for-character identical to `fullArabicText`, confirmed against at least a tier-2 source (§D). | Record the comparison source and confirm no diacritic/punctuation difference exists. |
| **Punctuation-only difference** | Wording is identical; only comma/period/pause markers differ, which do not change meaning or recitation. | Note the specific punctuation difference; does not block `approved`. |
| **Vocalisation-only difference** | Wording is identical in consonantal skeleton; only diacritics (tashkil) differ, without changing the grammatically intended reading. | Note the specific vocalisation difference; does not block `approved` if the underlying grammar/meaning is unaffected. |
| **Recognised variant** | A documented, scholarship-acknowledged alternate wording exists for the same narration (not merely "it looks similar") — per the standing project rule, never assigned without positive evidence that the variant is recognised, not just plausible. | Cite the specific source establishing the variant as recognised, not inferred. |
| **Transcription error** | The reviewer judges the source-document's wording (as transcribed in Stage 3A) to be an error relative to the authenticated primary wording — e.g., a plausible typo (MDR-020's "وهدأيه"). | Requires explicit scholarly sign-off, not an editor's unilateral judgment; the correction is never written into `originalDocumentText`/`fullArabicText` (see below). |
| **Compilation combination** | The record's wording appears to combine material from more than one distinct hadith or compilation choice (e.g., MDR-026's unresolved conflation candidate). | Document each contributing source separately; do not force a single-source attribution where evidence does not support one. |
| **Composite record** | The record genuinely joins independently-sourced narrations (see §I) — not merely multiple clauses of one narration. | Handled entirely under §I's clause-by-clause process. |
| **Unresolved wording** | The comparison remains inconclusive — most records as of Stage 3B. | Record what would resolve it (typically: a tier-2 direct fetch). Blocks `approved` (§J). |
| **Protected source-document typo** | The reviewer judges the source *document itself* (not the underlying hadith) to contain a plain transcription irregularity, distinct from a hadith-wording question. | Flag in the decision record; propose a publication wording; never edit the protected field. |

**Protected transcription is never altered by Stage 4 review, in any outcome above.** `originalDocumentText` and `fullArabicText` remain exactly as Stage 3A transcribed them — this project's transcription fields have never been edited by any research pass through Stage 3B, and Stage 4A changes nothing about that rule; if a genuine, scholarly-approved correction is ever authorised, it is a separate, explicitly-flagged, human-approved action outside the normal Stage 4 review flow, and even then the corrected reading is written to a **new**, clearly-labelled publication-wording field — never to `originalDocumentText` or `fullArabicText`, and never silently.

**Any corrected publication wording is stored separately.** The register's current type (`DhikrSourceResearchRecord`) has no dedicated "approved publication wording" field — this is a genuine gap Stage 4B implementation must close (a new field, e.g., `approvedPublicationWording: string`, distinct from `sourceArabicWording` which already exists to hold a *comparison* source's wording, not an approved final reading). Until that field exists, no Stage 4 reviewer may record a corrected wording anywhere in the register's typed structure other than free-text notes in a decision record (§ decision-record template) pending that implementation.

## F. Grading adjudication

| Situation | Required handling |
|---|---|
| Sahih / hasan / da'if / mawquf / marfu' / mursal | Record the exact grading term as reported by the exact named authority, for the exact route. Never round a weaker grading up (e.g., "hasan li-ghayrihi" is not simply "hasan") or a stronger one down without citing the authority who did so. |
| Interrupted chains (inqita') | Record explicitly if identified (e.g., MDR-009's unresolved Makhul–Anas connectivity question); do not assume connected transmission absent a specific finding. |
| Narrator weakness | Record the specific narrator and the specific weakness alleged (e.g., MDR-020's Isma'il ibn 'Ayyash region-dependent reliability), not a generic "weak chain" label. |
| Differing routes for the same matn | Treat each route as a separate evidentiary unit (§F requirement below) — a stronger route's grading never automatically extends to a weaker parallel route reporting the same or similar wording (MDR-023's Sahih Muslim vs. Majma' al-Zawa'id precedent). |
| Conflicting scholarly gradings | Record both/all positions with their named authorities; do not silently prefer one without documented reasoning (MDR-009, MDR-014, MDR-020's al-Albani-vs-others precedents). This is exactly the situation `sourceResearchStatus: "disputed"` exists to represent, and a `disputed` record requires explicit secondary-reviewer engagement with the disagreement, not a majority-vote shortcut. |
| A scholar's own changed position over time (e.g., al-Albani's early-vs-later gradings) | Record both positions and which is later/superseding, where determinable; do not cite only the position that supports the desired outcome. |
| Reward clauses with weaker evidence than the base text | Grade the reward/virtue clause **independently** of the base narration's grading (per the three-layer distinction established throughout Stage 3B: recited text / narrator frame / narration-attached outcome). A sahih base narration does not make an attached reward clause sahih by association — MDR-008's and MDR-014's precedents of grading the reward clause's wording as a separate, still-unresolved question apply generally. |

**Grading must be scoped to the exact route, wording, count, and reward** — the standing Stage 3B rule ("an authentic underlying narration does not automatically authenticate altered wording, omitted or added clauses, disputed particles, a different count, or a reward statement from another route") is a Stage 4 adjudication requirement, not merely a research-writing convention. A decision record (§ decision-record template) that grades a record must state explicitly which route, which exact wording, which repetition count, and which reward clause the grading covers — an unscoped grading is not a valid Stage 4 outcome.

## G. Timing and repetition

### Timing

Reviewers must distinguish, and record separately, which of the following actually supports a timing conclusion — never inferring one from another:

- **Wording-internal timing** — the recited Arabic itself contains a time-word (e.g., "أَصْبَحْنَا"). Strongest evidence.
- **Narration-frame timing** — the wider hadith's own reported introductory or closing instruction states a timing usage (e.g., "man qala hina yusbihu aw yumsi"), even where the recited text itself has only one time-word. Valid evidence for `morningSpecificStatus`, distinct from and not requiring wording-internal timing.
- **Chapter placement** — the hadith collection's own chapter heading (e.g., "Bab ma yaqulu idha asbaha"). **Never sufficient alone** — a placement is not a claim about the text's own usage; it reflects a compiler's organisational choice.
- **Compilation placement** — the *source document supplied to this project* placing an entry within a "morning dhikr" list. **Never sufficient alone**, for the same reason, and explicitly excluded throughout Stage 3B as a basis for `morningSpecificStatus`.
- **Explicit source-document heading** — a genuine, explicit label the source document itself states (e.g., MDR-028's "المَسَاءُ فَقَطْ" / "Evening only"). This **is** direct, valid evidence — distinct from mere placement in a list, because it is an explicit statement, not an inference from position.
- **Narrative context rather than instruction** — a story-frame detail describing *when* an exchange occurred (e.g., MDR-024's Fajr-to-duha narrative describing when the Prophet ﷺ and Juwayriyyah spoke) is descriptive context, not a prescriptive timing instruction, and must not be used to populate `morningSpecificStatus`.

Approved values remain the existing `MorningSpecificStatus` union (`"uncertain" | "morning-only" | "evening-only" | "morning-and-evening" | "not-time-specific"`) — Stage 4A proposes no new value.

### Repetition

Reviewers must distinguish four separate facts before approving a `repetitionCount`:

1. **Source-document annotation** — what the supplied source document itself marks (e.g., "3x"). Document-supplied, not evidence of authenticity by itself.
2. **Narration-supported count** — what the identified hadith's own wording actually states (which may exist even where the source document carries no annotation, e.g., MDR-024's narration-internal "three times" with no document annotation, or may be absent even where an annotation exists, e.g., MDR-017's unconfirmed "3x").
3. **Reward threshold** — a count tied specifically to a graduated reward (e.g., MDR-009's 1×/2×/3×/4× Fire-emancipation ladder) is a distinct fact from the base recitation count, and its authenticity is scoped separately (§F).
4. **Later compilation instruction** — a count supplied only by a later compilation's own editorial convention, not by the narration itself. Must be labelled as such, never presented as narration-supported.

**A repetition count may be approved only when tied to a source** — i.e., fact (2) or (3) above must be established from at least a tier-2 or corroborated tier-3 source (§D); fact (1) alone (a document annotation with no narration-level confirmation, e.g., MDR-026's currently-unconfirmed "100x" for a combined two-phrase form) does not meet the bar for `approved`, regardless of how long the annotation has been carried in the register.

## H. Virtue and reward

Every approved virtue/reward claim must preserve all of the following, exactly as the Stage 3B `virtueOrRewardClaim` discipline already required, now as a Stage 4 approval gate rather than only a drafting convention:

- **Action** — precisely which act the claim attaches to (e.g., "performs Fajr in congregation, remains in dhikr until sunrise, then two rak'ahs" — not merely "prays").
- **Timing** — the specific timing condition, if any (morning, evening, a specific window).
- **Count** — the specific repetition count the claim is conditioned on, where relevant (§G) — a graduated claim (MDR-009) must preserve every tier, not just the highest.
- **Conditions** — every stated precondition (e.g., MDR-008's "with certainty," "dies before evening/morning").
- **Certainty level** — whether the claim is reported as certain, disputed, or from a route with weaker evidence than the base text (§F).
- **Outcome** — the exact stated outcome, not a paraphrase that changes its scope (e.g., "comparable to a complete Hajj and 'Umrah," not "guarantees Hajj").
- **Grading limitation** — the claim's own grading scope, which may differ from the base narration's grading (§F).

**Promotional simplification is banned outright.** A reviewer may not approve a virtue/reward claim that has been shortened into an unconditional promise (e.g., "protection from Hell," "guaranteed Paradise," "Allah guarantees everything for the day") where the source's actual claim is conditional, graduated, or scoped — this is not a stylistic preference but a direct extension of the standing project rule applied at every Stage 3B pass and now binding at adjudication.

## I. Composite records

Four records currently have a formal clause map, each requiring **independent clause-by-clause approval before any whole-record approval decision is recorded**:

| Record | Clause map | Clauses | Why composite |
|---|---|---|---|
| **MDR-003** | `src/lib/dhikr-research/audits/mdr-003-clause-map.ts` | `MDR-003-A` through `MDR-003-F` (6 clauses) | Long text where segmentation revealed one continuous narration (Majma' al-Zawa'id, secondary compilation) — clauses exist for wording-comparison precision, not because separate sources were confirmed; each clause still needs its own wording-match determination. |
| **MDR-004** | `src/lib/dhikr-research/audits/mdr-004-clause-map.ts` | `MDR-004-A` through `MDR-004-F` (6 clauses) | Longest record (1,697 characters); structural analysis suggests several distinct narration leads plus at least one unsourced block — genuinely provisional composite picture requiring per-clause source confirmation. |
| **MDR-005** | `src/lib/dhikr-research/audits/mdr-005-clause-map.ts` | (per that clause map) | `contentClassification` remains `unclassified` at the whole-record level as of Stage 3B — a signal that whole-record classification is itself pending clause-level resolution. |
| **MDR-029** | `src/lib/dhikr-research/audits/mdr-029-clause-map.ts` | `MDR-029-A`, `MDR-029-B` | Two **independently reported, differently-graded** hadiths joined by an explicit `|` in the source document — Part A (Anas ibn Malik, Tirmidhi, disputed grading) and Part B (Nu'aym ibn Hammar al-Ghatafani, Hadith Qudsi, separately-reported sahih grading) are genuinely separate narrations, not one text split for convenience. |

**Note**: MDR-001 (`contentClassification: "composite-text"`) has no clause-map file — it is a *reference line* naming four separate Qur'anic items (Ayat al-Kursi, al-Ikhlas, al-Falaq, an-Nas) rather than their recited text, per its own `transcriptionNotes`. Whether MDR-001 requires a clause map, or whether "composite reference line, not composite recitation" is itself the correct classification decision, is a Stage 4B question for the primary reviewer — not resolved by this document.

MDR-017 and MDR-027 both retain internal `|` separators in their transcribed text without a formal clause map (documented precedent: MDR-017's two alternative wordings of one hadith; MDR-027's ambiguous, unidentified structure) — reviewers should re-examine at Stage 4B whether either now warrants a clause map under this framework's criteria (independently sourced components, not merely alternate wordings of one report).

**Process for a composite record**:

1. Each clause receives its own primary + secondary scholarly review, exactly as a standalone record would (§B, §C).
2. Each clause's `sourceResearchStatus`-equivalent, grading, and wording-match determination are recorded independently in the clause map's own fields (`sourceResearchStatus`, `gradingNotes`, `wordingMatch`, `unresolvedIssues` — see the existing `ClauseMapEntry` interface in each clause-map file).
3. A whole-record `scholarlyDecision` may only be recorded once **every** clause has reached a terminal state (`approved`, `approved-with-conditions`, or `rejected` — not `pending`, `revision-required`, or `deferred`).
4. If any clause is `rejected`, the reviewer decides whether the whole record is `rejected` or whether the surviving clause(s) can stand alone as a re-scoped, shorter record — this is itself a scholarly judgment, not automatic.
5. Reconstruction-integrity (the concatenation of all clauses reproducing `originalDocumentText` exactly) must remain verified by the existing programmatic test for that record before any clause-level approval is finalised — a passing reconstruction test is a precondition for review, not a substitute for it.

## J. Import gate

**Research complete is not approval.** All 30 records completed Stage 3B research; none has scholarly approval. These are different facts and this framework treats them as such throughout.

**The minimum conditions for a record to pass Stage 4** (i.e., become eligible for `importStatus` to move away from `"research-only"`) are **all** of the following, together:

1. `scholarlyDecision` is `approved` or `approved-with-conditions` (§C), recorded by both a primary and a secondary scholarly reviewer, with `scholarlyReviewer` populated with an actual name.
2. `sourceResearchStatus` is `"verified"` (the existing `computeImportGate` requirement — not `"scholarly-review-required"`, `"in-progress"`, `"sourced"`, or `"disputed"`).
3. `wordingMatchStatus` is one of the existing accepted resolved states (`"exact-match"`, `"minor-orthographic-variation"`, `"recognised-narration-variant"`) — not `"unresolved"`, `"composite-of-multiple-sources"`, or `"materially-different"`.
4. If `contentClassification` requires grading (all values except `"quranic-recitation"`), `hadithGrading` is populated **and** has been through §F's scoped adjudication, not merely a WebSearch-synthesis report.
5. If `repetitionCount` is set, `repetitionEvidence` is populated **and** meets §G's "tied to a source" bar, not merely a document annotation.
6. If `virtueOrRewardClaim` is set, `virtueEvidence` is populated **and** meets §H's full-condition-preservation bar.
7. For `contentClassification: "composite-text"` records (or any record later determined to require a clause map, per §I), **every** clause has independently reached `approved` or `approved-with-conditions` — a whole-record approval cannot paper over one unresolved clause.
8. Any wording adjudicated as `"transcription error"` or `"protected source-document typo"` (§E) has an explicit, separate, human-approved correction record — and even then, `originalDocumentText`/`fullArabicText` remain unedited; only a new, distinct publication-wording field (not yet implemented — see §E) may carry a corrected reading.
9. `importStatus` itself is only ever moved by a separate, explicitly-approved commit under this project's standing checkpoint discipline — Stage 4 adjudication alone, however complete, does not itself flip the field; a human approval step for the code change remains required, mirroring every prior stage of this project.

**Scholarly approval alone may not be enough.** A record can be `scholarlyDecision: approved` and still fail `computeImportGate` today (e.g., on `wordingMatchStatus` or missing `repetitionEvidence`) — scholarly sign-off addresses source and grading, not the independent wording/editorial conditions §J also requires. Wording adjudication (§E, performed by the Arabic-text editor) and editorial approval (§B) are both independently required and are not satisfied merely because a scholarly reviewer approved the record's authenticity.

**Composite records require all clauses to pass** (§I, condition 7 above) — there is no whole-record shortcut.

**Unresolved protected-text questions block import.** Any open item in a clause's or record's `unresolvedIssues` that concerns the protected text itself (as opposed to a secondary, non-blocking research gap) prevents `sourceResearchStatus: "verified"` from being honestly recorded, and therefore prevents condition 2 above from being met — this is enforced by the existing `computeImportGate` logic, unchanged by this document.

Reaching Sanity import (a future `dhikrItem` draft) is **not** publication. That draft still separately requires `boardApproval` (`scholarly`, `editorial`) and the seven-condition canonical gate (`src/sanity/lib/dhikr-publication-gate.ts`) to be satisfied before `reviewStatus` can ever become `"published"` — this framework governs entry into that existing pipeline, not an exemption from it.
