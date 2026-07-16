# MDR-001–030 — Scholarly Review Matrix

**Status**: tracking artifact only. Every approval-related column below is `Pending` or blank for every record, without exception — no record has begun Stage 4 adjudication as of this document's creation. See [40-scholarly-review-and-adjudication-framework.md](../40-scholarly-review-and-adjudication-framework.md) for what each column means and who may change it, and [MDR-001-030-review-queue.md](MDR-001-030-review-queue.md) for the recommended order in which this matrix should be filled in.

"Research complete" below reflects Stage 3B completion (every record has been researched), not scholarly adjudication — see framework §J: **research complete is not approval**.

| MDR ID | Research complete | Primary source directly inspected | Wording resolved | Grading resolved | Timing resolved | Repetition resolved | Reward resolved | Primary reviewer | Second reviewer | Arabic editor | Editorial approval | scholarlyDecision | importStatus | Gate result |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| MDR-001 | Yes | No | No | N/A | No | No | N/A | — | — | — | — | pending | research-only | Blocked (5) |
| MDR-002 | Yes | No | No | No | No | No | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-003 | Yes | No *(secondary compilation only)* | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-004 | Yes | No | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (5) |
| MDR-005 | Yes | No | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (5) |
| MDR-006 | Yes | Yes *(tool-mediated)* | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-007 | Yes | Yes *(tool-mediated)* | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-008 | Yes | Yes *(tool-mediated)* | No | No | No | N/A | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-009 | Yes | No | No | No *(disputed)* | No | No | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-010 | Yes | No | No | No | No | N/A | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-011 | Yes | No | No | No | No | No | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-012 | Yes | No | No | No | N/A | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-013 | Yes | No | No | No *(unassigned)* | N/A | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-014 | Yes | Yes *(Qur'anic clause only)* | Partial *(Qur'anic clause exact-match)* | No *(disputed, hadith layer)* | No | No | No | — | — | — | — | pending | research-only | Blocked (3) |
| MDR-015 | Yes | No | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-016 | Yes | No | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-017 | Yes | No | No | No | N/A | No | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-018 | Yes | No | No | No *(none located)* | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-019 | Yes | No | No | No *(compilation-grading only)* | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-020 | Yes | No | No | No *(disputed)* | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-021 | Yes | No | No | No | No | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-022 | Yes | No | No | No | No | N/A | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-023 | Yes | No | No | No *(two routes)* | N/A | No | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-024 | Yes | No | No | No | No | No | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-025 | Yes | No | No | No *(none located)* | No | N/A | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-026 | Yes | No | No | No *(unmatched)* | N/A | No | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-027 | Yes | No | No | No *(unassigned)* | N/A | No | N/A | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-028 | Yes | No | No | No *(weak, unnamed)* | No | No | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-029 | Yes | No | No | No *(Part 1 disputed, Part 2 undisputed)* | No | N/A | No | — | — | — | — | pending | research-only | Blocked (4) |
| MDR-030 | Yes | No | No | No *(da'if; narrator-name discrepancy)* | N/A | N/A | N/A | — | — | — | — | pending | research-only | Blocked (4) |

**Legend**:
- **Research complete**: Stage 3B research pass performed for this record (all 30 = Yes).
- **Primary source directly inspected**: at least one tier-2 source (framework §D) was directly fetched for this record — most records rest on tier-3/WebSearch-synthesis evidence only ("No" here does not mean no research occurred).
- **Wording / Grading / Timing / Repetition / Reward resolved**: whether Stage 4 adjudication (not Stage 3B research) has reached a terminal, reviewer-confirmed conclusion for that dimension. "N/A" means the dimension does not apply to this record (e.g., no repetition count exists to resolve).
- **Primary reviewer / Second reviewer / Arabic editor / Editorial approval**: name and date once assigned and completed; blank (`—`) means not yet assigned.
- **scholarlyDecision / importStatus**: live register values, read directly from `src/lib/dhikr-research/morning-dhikr-register.ts` — every row must continue to read `pending` / `research-only` until a properly completed, second-reviewed decision record (see [MDR-SCHOLARLY-DECISION-RECORD-TEMPLATE.md](MDR-SCHOLARLY-DECISION-RECORD-TEMPLATE.md)) and a separate, explicitly-approved commit change them.
- **Gate result**: `computeImportGate(record).canImport` and blocker count, read directly from the register as of this document's creation.

No cell in the **Primary reviewer**, **Second reviewer**, **Arabic editor**, **Editorial approval**, **scholarlyDecision**, or **importStatus** columns may be populated with anything other than the values shown here until Stage 4B review actually occurs, following [40-scholarly-review-and-adjudication-framework.md](../40-scholarly-review-and-adjudication-framework.md).
