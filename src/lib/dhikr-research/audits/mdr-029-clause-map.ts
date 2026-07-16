/**
 * MDR-029 clause map — Stage 3B research analysis only.
 *
 * MDR-029 (236 characters) joins two independently reported narrations with
 * an explicit "|" divider in the source document itself — this is a real
 * source boundary, not merely punctuation. Part 1 (Anas ibn Malik, Jami'
 * al-Tirmidhi, congregational Fajr + dhikr until sunrise + two rak'ahs, a
 * Hajj-and-Umrah-equivalent outcome, disputed grading) and Part 2 (Nu'aym
 * ibn Hammar al-Ghatafani, a Hadith Qudsi via Abu Dawud/al-Tirmidhi,
 * concerning four rak'ahs at the start of the day, a separately reported
 * sahih grading) differ in narrator, collection, wording, action, outcome,
 * and grading conclusion. See docs/dhikr/research/MDR-021-030-batch-source-audit.md,
 * "MDR-029" for the full research trail.
 *
 * This file is a research artifact. It is not imported into any Sanity
 * schema, public route, projection, auth, middleware, or the canonical
 * eligibility gate, and it does not alter
 * src/lib/dhikr-research/morning-dhikr-register.ts's stored fields — see
 * tests/dhikr/dhikr-source-register-mdr-021-030-batch-audit.test.ts for the
 * static checks confirming this.
 *
 * Clause boundaries were chosen on source-plurality grounds (two distinct,
 * independently-sourced narrations joined by the source document's own "|"
 * divider — not a grammatical/thematic boundary within one narration, which
 * is the more common case elsewhere in this register and is deliberately
 * NOT segmented). Each clause's `exactArabicClause` is *computed* from
 * MORNING_DHIKR_SOURCE_REGISTER's own MDR-029.originalDocumentText via
 * indexOf on the marker phrases below, rather than hand-transcribed, so the
 * clause map can never silently drift from the authoritative register text.
 *
 * Separator rule: the source document's own "|" character, together with
 * the single space immediately before and after it exactly as transcribed,
 * is retained as the trailing portion of Clause A (Part 1) — following the
 * established convention (per MDR-003's clause map) that a non-final
 * clause's slice includes its own trailing separator exactly as the source
 * document has it, rather than stripping it or reassigning it to the
 * following clause. Concatenating both clause slices in order therefore
 * reproduces originalDocumentText exactly, with no separate separator-
 * insertion logic required — see the reconstruction test in
 * tests/dhikr/dhikr-source-register-mdr-021-030-batch-audit.test.ts.
 */

import { MORNING_DHIKR_SOURCE_REGISTER } from "../morning-dhikr-register";

export type ClauseId = "MDR-029-A" | "MDR-029-B";

export type ApparentGenre =
  | "prophetic supplication"
  | "divine praise"
  | "quranic phrase"
  | "hadith qudsi wording"
  | "classical dua"
  | "later devotional composition"
  | "action/practice note"
  | "composite transition"
  | "uncertain";

export type ClauseSourceResearchStatus = "not-started" | "in-progress" | "sourced" | "scholarly-review-required" | "verified" | "disputed";

export type ClauseWordingMatch =
  | "unresolved"
  | "exact-match"
  | "minor-orthographic-variation"
  | "recognised-narration-variant"
  | "materially-different"
  | "no-source-to-compare";

export type ClauseTimingStatus = "not-time-specific" | "morning-and-evening" | "morning-or-evening" | "morning-only" | "uncertain";

export type BoundaryConfidence = "high" | "medium" | "uncertain";

export interface ClauseMapEntry {
  clauseId: ClauseId;
  sequenceWithinRecord: number;
  /** Computed from the live register text — never hand-transcribed. See MARKER-derived construction below. */
  exactArabicClause: string;
  openingWords: string;
  boundaryConfidence: BoundaryConfidence;
  boundaryReason: string;
  apparentGenre: ApparentGenre;
  sourceResearchStatus: ClauseSourceResearchStatus;
  proposedSources: string[];
  directlyInspectedArabic: boolean;
  wordingMatch: ClauseWordingMatch;
  timingStatus: ClauseTimingStatus;
  gradingNotes: string;
  unresolvedIssues: string[];
}

/**
 * Opening-word markers used to locate each clause boundary within
 * MDR-029.originalDocumentText via String.indexOf. Order matters — each
 * marker must be the literal start of its clause, and markers must appear
 * in this exact document order for the slice below to be correct.
 */
const CLAUSE_BOUNDARY_MARKERS: Record<ClauseId, string> = {
  "MDR-029-A": ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ",
  "MDR-029-B": "وَيَقُولُ اللَّهُ تَعَالَى",
};

const CLAUSE_ORDER: ClauseId[] = ["MDR-029-A", "MDR-029-B"];

function getMdr029OriginalText(): string {
  const record = MORNING_DHIKR_SOURCE_REGISTER.find((r) => r.internalId === "MDR-029");
  if (!record) throw new Error("MDR-029 not found in MORNING_DHIKR_SOURCE_REGISTER");
  return record.originalDocumentText;
}

/**
 * Slices MDR-029's originalDocumentText into the two clause substrings.
 * Clause A's slice includes its own trailing separator (" | ", exactly as
 * the source document has it, per the documented separator rule above).
 * Concatenating both slices in order reproduces originalDocumentText
 * exactly — see reconstructMdr029FromClauses and the reconstruction test.
 */
export function computeClauseSlices(): Record<ClauseId, string> {
  const text = getMdr029OriginalText();
  const indices = CLAUSE_ORDER.map((id) => {
    const idx = text.indexOf(CLAUSE_BOUNDARY_MARKERS[id]);
    if (idx === -1) throw new Error(`Boundary marker for ${id} not found in MDR-029.originalDocumentText`);
    return idx;
  });
  const slices = {} as Record<ClauseId, string>;
  for (let i = 0; i < CLAUSE_ORDER.length; i++) {
    const start = indices[i];
    const end = i + 1 < indices.length ? indices[i + 1] : text.length;
    slices[CLAUSE_ORDER[i]] = text.slice(start, end);
  }
  return slices;
}

const CLAUSE_SLICES = computeClauseSlices();

const PART_1_SOURCE =
  "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. Reportedly Jami' al-Tirmidhi, narrated by Anas ibn Malik, graded 'hasan gharib' by al-Tirmidhi himself; WebSearch synthesis notes many scholars weakened it, while others (reportedly including Ibn Baz and al-Albani, via corroborating routes) graded it hasan.";

const PART_2_SOURCE =
  "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. Reportedly a Hadith Qudsi (Allah's own words reported through the Prophet ﷺ) via Nu'aym ibn Hammar al-Ghatafani, reported by Abu Dawud and al-Tirmidhi (also cited in Musnad Ahmad), graded sahih by al-Albani (Sahih Abi Dawud) and by al-Nawawi (al-Khulasa) — no disagreement located in this pass.";

export const MDR_029_CLAUSE_MAP: ClauseMapEntry[] = [
  {
    clauseId: "MDR-029-A",
    sequenceWithinRecord: 1,
    exactArabicClause: CLAUSE_SLICES["MDR-029-A"],
    openingWords: ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ",
    boundaryConfidence: "high",
    boundaryReason:
      "The source document's own explicit '|' divider marks a genuine source boundary here, not a grammatical pause within one narration: everything before it concerns congregational Fajr prayer, remaining seated in dhikr until sunrise, and then two rak'ahs, attributed (per WebSearch synthesis) to a report from Anas ibn Malik in Jami' al-Tirmidhi. Everything after it is a distinct Hadith Qudsi via a different narrator (Nu'aym ibn Hammar al-Ghatafani) concerning a different action (four rak'ahs at the start of the day) with a different outcome and a separately reported grading. This is a source-plurality boundary, not merely a thematic one — the two parts were not shown to derive from the same narration in this pass.",
    apparentGenre: "action/practice note",
    sourceResearchStatus: "disputed",
    proposedSources: [PART_1_SOURCE],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-only",
    gradingNotes:
      "Reported grading is itself disputed among scholars: al-Tirmidhi's own classification is 'hasan gharib'; WebSearch synthesis reports 'many scholars weakened it', while others (reportedly including Ibn Baz and al-Albani via corroborating routes) graded it hasan. This grading applies only to this clause's own narration (Anas ibn Malik, Tirmidhi) — it must not be extended to authenticate Clause B's separate Hadith Qudsi, which has its own, separately reported (and undisputed in this pass) sahih grading. The located wording reportedly repeats 'تَامَّةٍ' ('complete') three times for emphasis ('tammatin tammatin tammatin'); MDR-029's own protected text has 'تَامَّةٍ' once — this difference is recorded precisely, not smoothed over, and originalDocumentText/fullArabicText remain unedited.",
    unresolvedIssues: [
      "Exact hadith number in Jami' al-Tirmidhi not confirmed in this pass.",
      "Whether MDR-029's single 'تَامَّةٍ' reflects a documented shorter variant, a compilation's abridgement, or a transcription simplification of the located triple-repeated form — not established in this pass.",
      "No page was directly fetched in this pass; the grading dispute itself was not independently adjudicated against each named scholar's own primary work.",
    ],
  },
  {
    clauseId: "MDR-029-B",
    sequenceWithinRecord: 2,
    exactArabicClause: CLAUSE_SLICES["MDR-029-B"],
    openingWords: "وَيَقُولُ اللَّهُ تَعَالَى",
    boundaryConfidence: "high",
    boundaryReason:
      "See Clause A's boundaryReason — the same '|' divider marks the same source boundary from the other side. This clause opens with its own explicit divine-speech attribution ('وَيَقُولُ اللَّهُ تَعَالَى' — 'and Allah the Exalted says'), a structural marker distinct from Clause A's action-description framing, consistent with this being an independently sourced Hadith Qudsi rather than a continuation of Clause A's narration.",
    apparentGenre: "hadith qudsi wording",
    sourceResearchStatus: "in-progress",
    proposedSources: [PART_2_SOURCE],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-only",
    gradingNotes:
      "Reported sahih by al-Albani (Sahih Abi Dawud) and al-Nawawi (al-Khulasa), with no disagreement located in this pass — a materially more settled grading than Clause A's. This grading applies only to this clause's own Hadith Qudsi (Nu'aym ibn Hammar al-Ghatafani) — it must not be extended to authenticate Clause A's separate, disputed narration. The located wording uses the construction 'لا تعجزني من أربع ركعات' ('do not fail Me [in] four rak'ahs'); MDR-029's own protected text uses 'ارْكَعْ لِي أَرْبَعَ رَكَعَاتٍ' ('bow/pray for Me four rak'ahs') — a different verb and construction, recorded precisely, not smoothed over, and originalDocumentText/fullArabicText remain unedited.",
    unresolvedIssues: [
      "Exact hadith numbers in Abu Dawud/Tirmidhi/Ahmad not confirmed in this pass.",
      "Whether MDR-029's 'ارْكَعْ لِي' construction reflects a documented alternate wording or a paraphrase of the located 'لا تعجزني من' construction — not established in this pass.",
      "No page was directly fetched in this pass; the sahih grading was not independently verified against al-Albani's or al-Nawawi's own primary works.",
    ],
  },
];

export function reconstructMdr029FromClauses(): string {
  return CLAUSE_ORDER.map((id) => CLAUSE_SLICES[id]).join("");
}
