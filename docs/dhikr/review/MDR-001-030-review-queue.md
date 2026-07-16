# MDR-001–030 — Stage 4 Review Queue

**Status**: planning artifact only. No record listed here is approved, scholarly-reviewed, or import-ready. All data below is read directly from `src/lib/dhikr-research/morning-dhikr-register.ts` and `computeImportGate` as of Stage 3B completion (branch checkpoint `c0fe12a95ea6d516f906d8ae21f634489eeaddc1`) — see [40-scholarly-review-and-adjudication-framework.md](../40-scholarly-review-and-adjudication-framework.md) for the process this queue feeds into.

Every record below remains `scholarlyDecision: pending`, `importStatus: research-only`, blocked by `computeImportGate`. Nothing in this document changes that.

## Complexity groups

Grouping is advisory, intended to sequence review effort from safest to most demanding — it is not a scholarly judgment about any record's authenticity, and a primary reviewer may reclassify a record's actual complexity once review begins.

### Lower-complexity (6 records)

Single, clearly identified narration; grading reported with reasonable (if not yet directly fetched) consistency; at most one small, specific wording gap.

| MDR ID | sourceResearchStatus | wordingMatchStatus | contentClassification | morningSpecificStatus | repetitionCount | Grading status | Clause map | Main unresolved issue | Blockers |
|---|---|---|---|---|---|---|---|---|---|
| MDR-015 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | 3 authorities agree (al-Nawawi, Ahmad Shakir, al-Albani) | no | No page directly fetched, despite strongest grading agreement in the batch | 4 |
| MDR-021 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | Sahih 'ala shart al-Shaykhayn (Shu'ayb al-Arna'ut, reported) | no | Single word ("مُسْلِمًا") presence/absence unresolved | 4 |
| MDR-022 | in-progress | unresolved | general-prophetic-supplication | uncertain | — | Sahih li-ghayrihi (al-Albani, reported) | no | Single connective ("و") wording point unresolved | 4 |
| MDR-024 | in-progress | unresolved | general-prophetic-supplication | uncertain | 3 | Sahih Muslim's own canonical inclusion (reported) | no | Documented in-collection wording variant (combined vs. per-phrase-prefixed) not resolved | 4 |
| MDR-010 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | Cited to al-Albani, al-Kalim al-Tayyib (title only) | no | No page directly fetched; evening-form wording unconfirmed | 4 |
| MDR-011 | in-progress | unresolved | morning-and-evening | morning-and-evening | 3 | "Hasan or close to it" (reported) | no | No page directly fetched; exact wording of all five clauses unconfirmed | 4 |

### Moderate-complexity (10 records)

Narration and (in most cases) grading identified; a specific, bounded wording, route, or attribution question remains open.

| MDR ID | sourceResearchStatus | wordingMatchStatus | contentClassification | morningSpecificStatus | repetitionCount | Grading status | Clause map | Main unresolved issue | Blockers |
|---|---|---|---|---|---|---|---|---|---|
| MDR-002 | scholarly-review-required | minor-orthographic-variation | morning-and-evening | morning-and-evening | 3 | reported, not detailed here | no | Closing clause reconstructed rather than copied character-for-character; Abu Dawud 5088 uninspected | 4 |
| MDR-006 | scholarly-review-required | unresolved | morning-and-evening | morning-and-evening | — | Sahih (underlying four-part narration in Sahih Muslim) | no | 2723/4901 hadith-numbering discrepancy unreconciled; wording differences vs. directly-fetched page | 4 |
| MDR-007 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | Al-Tirmidhi reportedly hasan | no | النشور/المصير closing-word assignment unresolved between two directly-fetched sources | 4 |
| MDR-008 | scholarly-review-required | unresolved | general-prophetic-supplication | morning-and-evening | — | Sahih (Sahih al-Bukhari, directly-fetched hosting) | no | Three wording-difference points (clause order, لَكَ, فَ) vs. directly-fetched Bukhari page; 5947/6306 numbering discrepancy | 4 |
| MDR-012 | in-progress | unresolved | general-prophetic-supplication | uncertain | — | Reportedly Sahih (Bukhari 6363) | no | Two-word wording difference (دَيْن/رِجَال pairing) vs. reported Bukhari wording | 4 |
| MDR-016 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | Hasan sahih (al-Tirmidhi), Ibn Hibban, al-Hakim (reported) | no | Two-vs-three-occasions timing ambiguity unresolved | 4 |
| MDR-017 | in-progress | unresolved | general-prophetic-supplication | uncertain | 3 (not narration-confirmed) | Sahih by isnad (al-Hakim, reported) | no | Neither of two source-document variants exactly matches the one located wording; repetition count not narration-confirmed | 4 |
| MDR-023 | in-progress | unresolved | general-prophetic-supplication | uncertain | 10 | Sahih Muslim's own inclusion (primary route only) | no | Two distinct reward-figure routes (primary Sahih Muslim vs. secondary Majma' al-Zawa'id); secondary route's own source/isnad/grading uninspected | 4 |
| MDR-025 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | No grading located in this pass | no | Specific daughter's identity not established; no grading located | 4 |
| MDR-028 | in-progress | unresolved | prophetic-evening-dhikr | evening-only | 3 | Weak chain, unnamed narrator, fada'il-leniency noted | no | Closing-clause wording differs from the located Ibn al-Sunni report; narrator unnamed | 4 |

### High-complexity (6 records)

The underlying narration itself is not conclusively identified, no grading was located at all, or a genuine attribution discrepancy (a different name) was found.

| MDR ID | sourceResearchStatus | wordingMatchStatus | contentClassification | morningSpecificStatus | repetitionCount | Grading status | Clause map | Main unresolved issue | Blockers |
|---|---|---|---|---|---|---|---|---|---|
| MDR-013 | in-progress | unresolved | general-prophetic-supplication | uncertain | — | Not assigned — narration unidentified | no | Underlying narration itself not identified — the most fundamental gap in the batch | 4 |
| MDR-018 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | No grading located at all | no | No grading located in this pass, despite a reasonably specific narrator/collection lead | 4 |
| MDR-019 | in-progress | unresolved | morning-and-evening | morning-and-evening | — | "Good chain" per al-Haythami's grading compilation only | no | Underlying primary musnad (not merely al-Haythami's grading compilation) not identified | 4 |
| MDR-026 | in-progress | unresolved | general-prophetic-supplication | uncertain | 100 (not confirmed for this combined form) | Not assigned to MDR-026's own combined form | no | Combined-and-counted form does not match any of three located candidate hadiths | 4 |
| MDR-027 | in-progress | unresolved | general-prophetic-supplication | uncertain | 100 (document-supplied, scope unresolved) | Not assigned — narration unidentified | no | Three-part structure's "100 times" scope ambiguous; underlying narration unidentified | 4 |
| MDR-030 | in-progress | unresolved | general-prophetic-supplication | uncertain | — | Da'if (Shu'ayb al-Arna'ut, reported) | no | Source-document embedded narrator name ("Sulaiman") does not match the located hadith's named recipient ("Salman al-Khayr") | 4 |

### Disputed / composite (8 records)

Either a genuine, named scholarly grading dispute exists, or the record is formally composite (clause-mapped, or `contentClassification: composite-text`). These require the most scholarly coordination and should be reviewed last, once the process has been proven on simpler records.

| MDR ID | sourceResearchStatus | wordingMatchStatus | contentClassification | morningSpecificStatus | repetitionCount | Grading status | Clause map | Main unresolved issue | Blockers |
|---|---|---|---|---|---|---|---|---|---|
| MDR-001 | scholarly-review-required | composite-of-multiple-sources | composite-text | uncertain | 3 | not applicable at whole-record level | no *(reference line, not segmented — see framework §I note)* | Compound reference line (Ayat al-Kursi + 3 Quls) — segmentation/classification not finalised | 5 |
| MDR-003 | scholarly-review-required | materially-different | general-prophetic-supplication | uncertain | — | Da'if (weak) | **yes** — `mdr-003-clause-map.ts` (6 clauses) | Two clause-level wording differences unresolved; al-Tabarani's own original still uninspected; و/أو timing variant unresolved | 4 |
| MDR-004 | in-progress | unresolved | composite-text | uncertain | — | not assigned | **yes** — `mdr-004-clause-map.ts` (6 clauses) | Longest record (1,697 characters); several distinct clause sources still unconfirmed, one block wholly unsourced | 5 |
| MDR-005 | in-progress | unresolved | **unclassified** | morning-only | — | not assigned | **yes** — `mdr-005-clause-map.ts` | Whole-record classification remains `unclassified`, pending clause-level resolution | 5 |
| MDR-009 | **disputed** | unresolved | morning-and-evening | morning-and-evening | 4 | Disputed: al-Nawawi/Ibn al-Qayyim/al-Diya' al-Maqdisi/Ibn Hajar/Ibn Baz (hasan) vs. al-Albani (weak, jahala) | no | Named grading dispute; "وَحْدَكَ لَا شَرِيْكَ لَكَ" presence/absence unresolved | 4 |
| MDR-014 | **disputed** | exact-match *(Qur'anic base clause only)* | quranic-recitation | morning-and-evening | 7 | Disputed (hadith layer only): al-Mundhiri/Ibn Baz/Arna'ut (hasan) vs. al-Albani (fabricated/weak) | no | Mawquf/marfu' hadith-layer grading dispute; Qur'anic base clause itself is not in dispute | 3 |
| MDR-020 | **disputed** | unresolved | morning-and-evening | morning-and-evening | — | Disputed: al-Nawawi/Ibn al-Qayyim/al-'Iraqi (accept) vs. Ibn Hajar/al-Albani-later (weaken); al-Albani changed position over time | no | Named grading dispute, including one scholar's own changed position; "وهدأيه" wording question | 4 |
| MDR-029 | in-progress | unresolved | composite-text | morning-only | — | Part 1 disputed; Part 2 separately reported sahih | **yes** — `mdr-029-clause-map.ts` (2 clauses) | Two independently-sourced, differently-graded narrations; wording differences in both parts | 4 |

## Reviewer requirements

Every record, without exception, requires a **primary scholarly reviewer** and a **secondary scholarly reviewer** before `scholarlyDecision` may become anything other than `pending`, `revision-required`, `rejected`, or `deferred` (framework §B, §C) — this is not listed per-row because it applies uniformly.

An **Arabic-text editor** (framework §B) is required for every record whose `wordingMatchStatus` is not already `exact-match` — i.e., every record in this queue except MDR-014's Qur'anic base clause, which was directly verified against Qur'an.com and needs no further Arabic-editor wording work (though its disputed hadith-layer grading still requires full scholarly review).

## Recommended review sequence

The safest sequence starts with the strongest-evidenced, simplest records to validate the review process itself, then proceeds through increasingly complex identification/wording gaps, and ends with the records requiring the most scholarly coordination (named disputes, then composite multi-clause records):

1. MDR-015 — strongest grading agreement in the batch (3 authorities, no dispute)
2. MDR-021 — single wording gap, strong grading citation
3. MDR-022 — single wording gap, strong grading citation
4. MDR-024 — well-established narration, one documented in-collection variant
5. MDR-010 — single narration, evening-form wording gap only
6. MDR-011 — single narration, repetition count already narration-confirmed
7. MDR-006 — strong narration (Sahih Muslim), numbering discrepancy to reconcile
8. MDR-008 — strong narration (Sahih al-Bukhari), three bounded wording points
9. MDR-012 — strong narration (Bukhari), one two-word wording gap
10. MDR-002 — established core narration, one reconstructed clause to verify
11. MDR-007 — established narration, one closing-word ambiguity
12. MDR-016 — established narration, timing-occasions ambiguity only
13. MDR-028 — narration identified but chain weak; bounded wording gap
14. MDR-017 — dual source-document variants, neither yet matched exactly
15. MDR-023 — primary route strong; secondary route needs independent inspection
16. MDR-025 — narration identified; grading and narrator-identity gaps
17. MDR-018 — narrator/collection lead present; no grading located yet
18. MDR-013 — narration itself unidentified
19. MDR-019 — only a grading-compilation lead, not a primary musnad, identified
20. MDR-026 — combined form unmatched to any of three candidates
21. MDR-027 — narration unidentified and structure ambiguous
22. MDR-030 — narrator-name discrepancy requires resolution before anything else
23. MDR-009 — named grading dispute (single narration)
24. MDR-014 — named grading dispute (hadith layer only; Qur'anic base is settled)
25. MDR-020 — named grading dispute, including a scholar's own changed position
26. MDR-001 — composite reference line, classification undecided
27. MDR-003 — composite (6 clauses), secondary-compilation-only source
28. MDR-005 — composite, still `unclassified` at whole-record level
29. MDR-004 — composite (6 clauses), longest and least-resolved record
30. MDR-029 — composite, two independently-graded narrations, one disputed

This sequence is a recommendation, not a requirement — a primary reviewer or the technical gatekeeper may reorder it, e.g. to match a specific scholar's availability or expertise, without needing to amend this document first.
