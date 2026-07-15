/**
 * MDR-005 clause map — Stage 3B research analysis only.
 *
 * MDR-005 (324 characters) contains a single comma boundary marking a shift
 * from a third-person-plural declaration about Allah's exclusive dominion
 * and attributes ("أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ...") to a
 * second-person vocative petition opening with "اللَّهُمَّ" ("O Allah,
 * make..."). This is a meaningful grammatical/thematic boundary (new
 * vocative; change from declaration to petition), not segmentation merely
 * because the text is long — MDR-005 is comparatively short. Indexed
 * research leads (see below) associate a closely related combined
 * declaration-plus-petition wording with a single reported narration
 * (Ibn Abi Awfa via Abu al-Warqa', per Mishkat al-Masabih and its
 * commentaries) — so this clause boundary does not establish composite
 * (independently-sourced) content; both clauses may belong to one reported
 * narration. The map is retained because the grammatical boundary is real
 * and useful for research precision, and because the two clauses carry
 * distinct, separately-assessed wording divergences from every indexed
 * lead located (see gradingNotes per clause and
 * docs/dhikr/research/MDR-005-source-audit.md). Clause B's unsourced
 * closing phrase (see MDR-005-B's gradingNotes/unresolvedIssues) is
 * recorded as a possible addition *within* clause B, not as proof that
 * clause A and clause B have independently proven sources.
 *
 * This file is a research artifact. It is not imported into any Sanity
 * schema, public route, or the canonical eligibility gate, and it does not
 * alter src/lib/dhikr-research/morning-dhikr-register.ts's stored fields —
 * see tests/dhikr/dhikr-source-register-mdr-005-audit.test.ts for the
 * static checks confirming this.
 *
 * Each clause's `exactArabicClause` is *computed* from
 * MORNING_DHIKR_SOURCE_REGISTER's own MDR-005.originalDocumentText via
 * String.indexOf on the marker phrase below, rather than hand-transcribed,
 * so the clause map can never silently drift from the authoritative
 * register text.
 */

import { MORNING_DHIKR_SOURCE_REGISTER } from "../morning-dhikr-register";

export type ClauseId = "MDR-005-A" | "MDR-005-B";

export type ApparentGenre =
  | "prophetic supplication"
  | "divine praise"
  | "quranic phrase"
  | "hadith qudsi wording"
  | "classical dua"
  | "later devotional composition"
  | "composite transition"
  | "uncertain";

export type ClauseSourceResearchStatus =
  | "not-started"
  | "in-progress"
  | "sourced"
  | "scholarly-review-required"
  | "verified"
  | "disputed"
  | "conflicting-evidence"
  | "no-source-located";

export type ClauseWordingMatch =
  | "unresolved"
  | "exact-match"
  | "minor-orthographic-variation"
  | "recognised-narration-variant"
  | "materially-different"
  | "no-source-to-compare";

export type ClauseTimingStatus =
  | "not-time-specific"
  | "morning-and-evening"
  | "morning-only"
  | "uncertain"
  | "no-timing-evidence";

export type BoundaryConfidence = "high" | "medium" | "uncertain";

export interface ClauseMapEntry {
  clauseId: ClauseId;
  sequenceWithinRecord: number;
  /** Computed from the live register text — never hand-transcribed. */
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
 * Opening-word marker used to locate the clause A/B boundary within
 * MDR-005.originalDocumentText via String.indexOf. Clause A's slice starts
 * at index 0 (the record has no leading-space quirk, unlike MDR-004), and
 * runs up to and including the comma; clause B's slice starts immediately
 * after the comma and therefore includes the source document's single
 * space character that follows it — documented separator handling, not an
 * omission.
 */
const CLAUSE_B_MARKER = "اللَّهُمَّ اجْعَلْ أَوَّلَ هَذَا النَّهَارِ";

function getMdr005OriginalText(): string {
  const record = MORNING_DHIKR_SOURCE_REGISTER.find((r) => r.internalId === "MDR-005");
  if (!record) throw new Error("MDR-005 not found in MORNING_DHIKR_SOURCE_REGISTER");
  return record.originalDocumentText;
}

/**
 * Slices MDR-005's originalDocumentText into the two clause substrings.
 * Concatenating both slices in order reproduces originalDocumentText
 * exactly — see the reconstruction test in
 * tests/dhikr/dhikr-source-register-mdr-005-audit.test.ts.
 */
export function computeClauseSlices(): Record<ClauseId, string> {
  const text = getMdr005OriginalText();
  const commaIdx = text.indexOf("،");
  if (commaIdx === -1) throw new Error("Clause boundary comma not found in MDR-005.originalDocumentText");
  const boundaryIdx = commaIdx + 1; // include the comma itself in clause A
  const marker = text.slice(boundaryIdx).trimStart();
  if (!marker.startsWith(CLAUSE_B_MARKER)) {
    throw new Error("Clause B marker does not immediately follow the comma boundary in MDR-005.originalDocumentText");
  }
  return {
    "MDR-005-A": text.slice(0, boundaryIdx),
    "MDR-005-B": text.slice(boundaryIdx),
  };
}

const CLAUSE_SLICES = computeClauseSlices();
const CLAUSE_ORDER: ClauseId[] = ["MDR-005-A", "MDR-005-B"];

/**
 * Research findings per clause. Source-hierarchy discipline: every source
 * below is labelled precisely (an indexed search-results page is not a
 * directly inspected primary page; a modern fatwa's relay of a classical
 * grading is not the classical grading source itself) — no later
 * quotation or index entry is described as a directly inspected primary
 * source. Search-engine synthesis (WebSearch) is distinguished throughout
 * from directly fetched page content (WebFetch); an unresolved conflict
 * between a WebSearch synthesis claim and directly-fetched page content is
 * recorded explicitly rather than silently preferring one over the other.
 */
const IBN_ABI_AWFA_COMBINED_SOURCE =
  "Reported source lead, not directly inspected: a directly-fetched Usul.ai search-results index page (not the primary pages themselves — see below) associates a closely related combined declaration-plus-petition wording with a report attributed to 'Abdullah ibn Abi Awfa (via Abu al-Warqa'), indexed under: Mishkat al-Masabih (al-Tabrizi's own numbering, hadith 38; commonly cross-referenced as hadith 2414 in commentary editions), Mirqat al-Mafatih sharh Mishkat al-Masabih (al-Mulla 'Ali al-Qari, vol. 14, p. 107), al-Matalib al-'Aliyya bi-Zawa'id al-Masanid al-Thamaniyya (Ibn Hajar al-'Asqalani), 'Amal al-Yawm wa'l-Layla (Ibn al-Sunni), Takhrij Ahadith Ihya' 'Ulum al-Din (al-'Iraqi), al-Muntakhab min Musnad 'Abd ibn Humayd, and Subul al-Huda wa'l-Rashad (al-Salihi al-Shami). None of these primary or commentary pages were themselves opened and read in this pass — sunnah.com/mishkat:2414 returned HTTP 403 and a direct usul.ai per-hadith page (usul.ai/t/mishkat-masabih/2414) returned HTTP 404 to direct WebFetch in this environment; only the Usul.ai search-results index page itself was directly inspected, and it surfaced title/author/volume-page/hadith-number/matched-phrase metadata, not full primary-page text. A WebSearch synthesis (not directly inspected, and not relied upon as fact) additionally claimed this report frames itself as something the Prophet ﷺ said specifically upon entering the morning, and separately claimed the 'الكبرياء والعظمة' wording belongs to the Sahih Muslim hadith from Ibn Mas'ud — the second claim was checked and found unsupported: a WebSearch result's own page title for the actual Sahih Muslim/Ibn Mas'ud hadith sharh (dorar.net/hadith/sharh/20406 — this title, not page body content, is the only part of that page seen in this pass; the page itself was not fetched with WebFetch) already quotes that hadith's wording as 'أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له...' — matching MDR-006, not the 'الكبرياء والعظمة' wording of MDR-005. Even at this snippet-only evidentiary level, this is enough to treat the earlier WebSearch synthesis's Sahih-Muslim attribution as an unverified/likely-incorrect conflation of two distinct reports; it is not relied upon. This snippet-level check is itself not equivalent to direct inspection and is not cited elsewhere in this record as a directly-inspected source.";

const IRAQI_WEAK_GRADING_SOURCE =
  "Reported grading, not directly inspected in its primary source: a directly-fetched modern fatwa page (islamweb.net/ar/fatwa/437644/) discusses a closely related du'a beginning 'اللَّهُمَّ اجْعَلْ أَوَّلَ يَوْمِنَا هَذَا صَلَاحًا' (note: 'يَوْمِنَا هَذَا', not MDR-005's 'هَذَا النَّهَارِ' — a lexical variant whose significance is unresolved) and states this was reported with a weak chain to the Prophet ﷺ, citing 'Abd ibn Humaid (in al-Muntakhab) and al-Tabarani (two routes), with the exact grading language 'إسناده ضعيف' (its chain is weak) attributed to al-Hafiz al-'Iraqi in Takhrij Ahadith al-Ihya. The fatwa page explicitly states only the partial wording up to 'نجاحا' was located in these collections — it does not mention or corroborate MDR-005's further closing phrase 'أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ'. A second directly-fetched fatwa page (islamweb.net/ar/fatwa/103482/), checked specifically for this closing phrase, was confirmed NOT to contain it. Whether this Abd-ibn-Humaid/al-Tabarani weak report is the same underlying report as the Ibn Abi Awfa/Mishkat al-Masabih lead above, a variant of it, or a distinct report sharing only the 'صلاحا...فلاحا...نجاحا' formula, was not resolved in this pass — al-'Iraqi's own Takhrij Ahadith al-Ihya was not directly inspected, only a modern fatwa's relay of it.";

export const MDR_005_CLAUSE_MAP: ClauseMapEntry[] = [
  {
    clauseId: "MDR-005-A",
    sequenceWithinRecord: 1,
    exactArabicClause: CLAUSE_SLICES["MDR-005-A"],
    openingWords: "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ",
    boundaryConfidence: "high",
    boundaryReason:
      "A declarative, third-person-plural statement about Allah's exclusive dominion, greatness, magnificence, creation, command, night and day ('أَصْبَحْنَا...لِلَّهِ وَحْدَهُ') ends at the comma; a new vocative 'اللَّهُمَّ' then opens a second-person petition ('O Allah, make...') in clause B — a change from declaration to petition and a new vocative opening, both listed boundary indicators. Not segmented merely because the text is long (MDR-005 is one of the shorter records in the register at 324 characters).",
    apparentGenre: "divine praise",
    sourceResearchStatus: "in-progress",
    proposedSources: [IBN_ABI_AWFA_COMBINED_SOURCE],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-only",
    gradingNotes:
      "No grading of this clause specifically (as distinct from the record's petition clause) was located in this pass; the only directly-inspected grading discussion found (IRAQI_WEAK_GRADING_SOURCE) concerns the petition wording, not this declaration. Three indexed matched-phrase snippets for closely related wording were located via the directly-inspected Usul.ai search-results page, and they disagree with each other: one (Mirqat al-Mafatih) omits 'وَالْحَمْدُ لِلَّهِ' between 'لِلَّهِ' and 'وَالْكِبْرِيَاءِ', matching MDR-005's own omission of that phrase; two others (al-Matalib al-'Aliyya; Mishkat al-Masabih itself) include 'وَالْحَمْدُ لِلَّهِ' at that position, which MDR-005 lacks. Because none of these three indexed sources was itself directly opened and read (only the search-index snippets were seen), and because the snippets disagree with each other, this is recorded as an unresolved wording question — not a confirmed omission, error, or recognised narration variant.",
    unresolvedIssues: [
      "No primary hadith or classical-compilation page was directly inspected for this clause; only a search-results index page and its snippets.",
      "The three indexed snippets located disagree with each other on whether 'وَالْحَمْدُ لِلَّهِ' appears between 'لِلَّهِ' and 'وَالْكِبْرِيَاءِ' — MDR-005 lacks this phrase, matching one of the three snippets and diverging from the other two.",
      "A WebSearch synthesis claim attributing this wording to the Sahih Muslim/Ibn Mas'ud hadith was checked against a dorar.net search-result page title (snippet only, not a WebFetch page read) and found unsupported — not relied upon (see IBN_ABI_AWFA_COMBINED_SOURCE).",
    ],
  },
  {
    clauseId: "MDR-005-B",
    sequenceWithinRecord: 2,
    exactArabicClause: CLAUSE_SLICES["MDR-005-B"],
    openingWords: "اللَّهُمَّ اجْعَلْ أَوَّلَ هَذَا النَّهَارِ",
    boundaryConfidence: "high",
    boundaryReason:
      "Opens with the vocative 'اللَّهُمَّ' and shifts from clause A's declaration to a direct petition ('make the beginning of this day...'), ending the record.",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "in-progress",
    proposedSources: [IBN_ABI_AWFA_COMBINED_SOURCE, IRAQI_WEAK_GRADING_SOURCE],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-only",
    gradingNotes:
      "A directly-fetched modern fatwa page (islamweb.net/ar/fatwa/437644/) relays al-Hafiz al-'Iraqi's grading 'إسناده ضعيف' (weak chain), citing 'Abd ibn Humaid and al-Tabarani, for a closely related wording ('اللَّهُمَّ اجْعَلْ أَوَّلَ يَوْمِنَا هَذَا صَلَاحًا...') — but that fatwa explicitly scopes its finding to the wording up to 'نجاحا' only, and does not mention or corroborate this clause's further closing phrase 'أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ'. A second directly-fetched fatwa page (islamweb.net/ar/fatwa/103482/) was checked specifically for that closing phrase and does not contain it. This grading is therefore not extended to the clause as a whole, and is recorded only as reported/relayed, not directly inspected in its primary source (al-'Iraqi's own Takhrij Ahadith al-Ihya was not opened). The lexical variant between the fatwa's 'يَوْمِنَا هَذَا' and this clause's 'هَذَا النَّهَارِ' is also unresolved — it was not established whether this reflects a recognised narration variant, a distinct-but-related report, or an unrelated paraphrase.",
    unresolvedIssues: [
      "No primary hadith or classical-compilation page was directly inspected for this clause; only a modern fatwa's relay of a grading, and a search-results index page.",
      "The closing phrase 'أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ' was not located or corroborated in any source directly inspected in this pass — it remains unsourced. This does not, by itself, establish that clause B combines two independently-sourced texts; the sourced lead (through 'نجاحا') and the unsourced closing phrase are recorded as two parts of one clause with an unresolved wording boundary, not as two separately-proven narrations. Possible explanations for the closing phrase, none preferred or decided in this pass: (a) a longer, unlocated version of the same reported narration; (b) a recognised transmission variation; (c) a later compilation addition; (d) a later devotional extension; (e) transcription drift; (f) an unresolved transcription or attribution error.",
      "Whether the al-'Iraqi-graded 'Abd ibn Humaid/al-Tabarani report and the Ibn Abi Awfa/Mishkat al-Masabih report are the same underlying narration, a shared-formula variant, or two distinct reports was not resolved.",
      "The 'يَوْمِنَا هَذَا' vs 'هَذَا النَّهَارِ' wording variant between the directly-inspected fatwa's quotation and this clause was not resolved.",
    ],
  },
];

export function reconstructMdr005FromClauses(): string {
  return CLAUSE_ORDER.map((id) => CLAUSE_SLICES[id]).join("");
}
