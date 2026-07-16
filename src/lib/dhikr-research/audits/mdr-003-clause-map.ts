/**
 * MDR-003 clause map — Stage 3B research analysis only.
 *
 * MDR-003 is a long, apparently composite supplication (996 characters,
 * no internal punctuation beyond commas). This module segments it into
 * independently researchable clauses so each can be sourced on its own
 * merits, per docs/dhikr/research/MDR-003-source-audit.md.
 *
 * This file is a research artifact. It is not imported into any Sanity
 * schema, public route, or the canonical eligibility gate, and it does not
 * alter src/lib/dhikr-research/morning-dhikr-register.ts's stored fields —
 * see tests/dhikr/dhikr-source-register-mdr-003-audit.test.ts for the
 * static checks confirming this.
 *
 * Clause boundaries were chosen on grammatical/thematic grounds (shifts in
 * verb form, predicate structure, or grammatical subject — see
 * `boundaryReason` per clause), not merely because the text is long. Each
 * clause's `exactArabicClause` is *computed* from
 * MORNING_DHIKR_SOURCE_REGISTER's own MDR-003.originalDocumentText via
 * indexOf on the marker phrases below, rather than hand-transcribed, so the
 * clause map can never silently drift from the authoritative register text.
 */

import { MORNING_DHIKR_SOURCE_REGISTER } from "../morning-dhikr-register";

export type ClauseId = "MDR-003-A" | "MDR-003-B" | "MDR-003-C" | "MDR-003-D" | "MDR-003-E" | "MDR-003-F";

export type ApparentGenre =
  | "prophetic supplication"
  | "divine praise"
  | "quranic phrase"
  | "hadith qudsi wording"
  | "classical dua"
  | "later devotional composition"
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

export type ClauseTimingStatus =
  | "not-time-specific"
  | "morning-and-evening"
  | "morning-or-evening"
  | "uncertain";

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
 * MDR-003.originalDocumentText via String.indexOf. Order matters — each
 * marker must be the literal start of its clause, and markers must appear
 * in this exact document order for the slice below to be correct.
 */
const CLAUSE_BOUNDARY_MARKERS: Record<ClauseId, string> = {
  "MDR-003-A": "أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ",
  "MDR-003-B": "أَنْتَ الْمَالِكُ لَا شَرِيكَ",
  "MDR-003-C": "لَنْ تُطَاعَ إِلَّا بِإِذْنِكَ",
  "MDR-003-D": "أَقْرَبُ شَـهِيدٌ",
  "MDR-003-E": "الْقُلُوبُ لَكَ مَفْضِيَةٌ",
  "MDR-003-F": "أَسْأَلُكَ بِنُورِ وَجْهِكَ",
};

const CLAUSE_ORDER: ClauseId[] = ["MDR-003-A", "MDR-003-B", "MDR-003-C", "MDR-003-D", "MDR-003-E", "MDR-003-F"];

function getMdr003OriginalText(): string {
  const record = MORNING_DHIKR_SOURCE_REGISTER.find((r) => r.internalId === "MDR-003");
  if (!record) throw new Error("MDR-003 not found in MORNING_DHIKR_SOURCE_REGISTER");
  return record.originalDocumentText;
}

/**
 * Slices MDR-003's originalDocumentText into the six clause substrings.
 * Each non-final clause's slice includes its own trailing separator (a
 * comma-space, or in the A/B boundary's case a bare space, exactly as the
 * source document has it — there is no comma between clause A and B in the
 * original text). Concatenating all six slices in order therefore
 * reproduces originalDocumentText exactly, with no separator insertion
 * logic required — see the reconstruction test in
 * tests/dhikr/dhikr-source-register-mdr-003-audit.test.ts.
 */
export function computeClauseSlices(): Record<ClauseId, string> {
  const text = getMdr003OriginalText();
  const indices = CLAUSE_ORDER.map((id) => {
    const idx = text.indexOf(CLAUSE_BOUNDARY_MARKERS[id]);
    if (idx === -1) throw new Error(`Boundary marker for ${id} not found in MDR-003.originalDocumentText`);
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

/**
 * Research findings per clause. All six clauses were found, on direct
 * inspection of a recognised SECONDARY classical compilation (see
 * docs/dhikr/research/MDR-003-source-audit.md §7), to be located together,
 * in the same broad order, in one quoted narration in al-Haythami's Majma'
 * al-Zawa'id — there attributed to al-Tabarani (al-Mu'jam al-Kabir / Kitab
 * al-Du'a) and reported as narrated from Abu Umama al-Bahili, from the
 * Prophet ﷺ, through a chain al-Haythami grades weak ("da'if") due to
 * Faddal ibn Jubair, whom he states is agreed upon as weak.
 *
 * IMPORTANT — source hierarchy: Majma' al-Zawa'id is al-Haythami's
 * recognised SECONDARY classical compilation, which quotes and evaluates
 * reports from earlier collections. It is not al-Tabarani's own primary
 * collection. Al-Tabarani's own original entry (al-Mu'jam al-Kabir / Kitab
 * al-Du'a) was NOT directly inspected in this pass — every "directly
 * inspected" claim below refers to al-Haythami's quotation, not
 * al-Tabarani's original. This module never asserts the composite-clauses
 * hypothesis is "proven false" or "confirmed directly from al-Tabarani" —
 * only that the located quotation does not support it, while
 * confirmation from al-Tabarani's original remains outstanding.
 *
 * For every clause, "wordingMatch" is evaluated against al-Haythami's
 * quoted wording specifically — not against "every transmission of the
 * hadith" and not against al-Tabarani's unseen original. A clause's
 * wording difference from the quotation may reflect: source-document
 * transcription drift, a genuine transmission variant, edition variation
 * between printings of Majma' al-Zawa'id, or an unresolved error in either
 * text — this module does not decide which explanation is correct.
 */
const SHARED_QUOTED_SOURCE =
  "Reported as narrated from Abu Umama al-Bahili, attributed there to al-Tabarani (al-Mu'jam al-Kabir / Kitab al-Du'a) — al-Tabarani's own original entry not directly inspected. Complete wording directly inspected in al-Haythami's Majma' al-Zawa'id (Bab ma yaqulu idha asbaha wa-idha amsa), a recognised secondary classical compilation, via a recognised classical-text hosting page (islamweb.net), content relayed through this environment's fetch tooling. Not al-Tabarani's primary collection.";

export const MDR_003_CLAUSE_MAP: ClauseMapEntry[] = [
  {
    clauseId: "MDR-003-A",
    sequenceWithinRecord: 1,
    exactArabicClause: CLAUSE_SLICES["MDR-003-A"],
    openingWords: "أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ",
    boundaryConfidence: "high",
    boundaryReason:
      "Opens the supplication with a run of parallel afal-min (comparative) declarations about Allah's attributes (أحق من، أرأف من، أجود من، أوسع من); ends where the comparative pattern breaks into a plain nominal sentence in clause B.",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "scholarly-review-required",
    proposedSources: [SHARED_QUOTED_SOURCE],
    directlyInspectedArabic: true,
    wordingMatch: "materially-different",
    timingStatus: "not-time-specific",
    gradingNotes:
      "Reported as a Prophetic supplication through a weak chain (see record-level grading) — genre/attribution as transmitted, not authenticated. Materially different against al-Haythami's quoted wording (not against every transmission of the hadith, and not against al-Tabarani's uninspected original): MDR-003 has 'مِنْ ذِكْرٍ'/'مِنْ عَبْدٍ' (genitive nouns) where the quotation has 'مَنْ ذُكِرَ'/'مَنْ عُبِدَ' (relative-clause passive verbs, 'than whoever is remembered/worshipped') — a real grammatical-construction difference, not a diacritic one, and MDR-003's 'مِنْ عَبْدٍ' arguably loses the intended sense. MDR-003 also has an imperative 'وَانْصُرْ مَنِ ابْتَغَى' where the quotation has a comparative 'وَأَنْصَرُ مَنِ ابْتُغِيَ', breaking MDR-003's own parallel structure. Whether these differences reflect source-document transcription drift, a genuine transmission variant, edition variation, or an unresolved error is not decided here.",
    unresolvedIssues: [
      "Whether 'وَانْصُرْ' is a genuine source-document reading or a transcription drift from 'وَأَنْصَرُ' — not silently corrected here.",
      "Whether 'مِنْ مَلِكٍ' (a king) or a verb reading was intended in al-Haythami's quotation at this position — the fetched rendering was ambiguous without full diacritics and was not resolved in this pass.",
    ],
  },
  {
    clauseId: "MDR-003-B",
    sequenceWithinRecord: 2,
    exactArabicClause: CLAUSE_SLICES["MDR-003-B"],
    openingWords: "أَنْتَ الْمَالِكُ لَا شَرِيكَ",
    boundaryConfidence: "high",
    boundaryReason:
      "Shifts from comparative (afal-min) constructions to plain noun-predicate declarative sentences (أنت الملك، الفرد، كل شيء هالك); ends where the construction shifts again to negated verbs in clause C.",
    apparentGenre: "divine praise",
    sourceResearchStatus: "scholarly-review-required",
    proposedSources: [SHARED_QUOTED_SOURCE],
    directlyInspectedArabic: true,
    wordingMatch: "materially-different",
    timingStatus: "not-time-specific",
    gradingNotes:
      "Reported as part of the weak-chain narration (see record-level grading). Materially different against al-Haythami's quoted wording — the most significant variants in the whole record: MDR-003 has 'الْمَالِكُ' (the Owner) where the quotation has 'الْمَلِكُ' (the King/Sovereign) — a different word, not a diacritic variant. MDR-003's 'لَا شَرِيكَ' omits the quotation's trailing 'لَكَ' ('no partner *for You*'). Most significantly, MDR-003's 'وَالْفَرْدُ لَا نِدَّ لَكَ' ('and the One, there is no equal to You') diverges entirely from the quotation's 'وَالْفَرْدُ لَا يَهْلِكُ' ('and the One does not perish') — different predicates, different meaning, not a minor variant. Whether this reflects source-document transcription drift, a genuine transmission variant, edition variation, or an unresolved error is not decided here.",
    unresolvedIssues: [
      "Whether 'لَا نِدَّ لَكَ' is an authentic alternate wording found in some manuscript/transmission of this hadith, or a later substitution — not established in this pass.",
    ],
  },
  {
    clauseId: "MDR-003-C",
    sequenceWithinRecord: 3,
    exactArabicClause: CLAUSE_SLICES["MDR-003-C"],
    openingWords: "لَنْ تُطَاعَ إِلَّا بِإِذْنِكَ",
    boundaryConfidence: "high",
    boundaryReason:
      "Shifts to negated second-person passive verbs (لن تُطاع، لن تُعصى) describing obedience/disobedience; ends where the construction shifts to elative/superlative predicate adjectives in clause D.",
    apparentGenre: "divine praise",
    sourceResearchStatus: "scholarly-review-required",
    proposedSources: [SHARED_QUOTED_SOURCE],
    directlyInspectedArabic: true,
    wordingMatch: "exact-match",
    timingStatus: "not-time-specific",
    gradingNotes:
      "Reported as part of the weak-chain narration (see record-level grading). This is the one clause in MDR-003 with no identified wording difference — exact against the inspected Majma' al-Zawa'id quotation specifically, not established as exact against every transmission of the hadith or against al-Tabarani's uninspected original.",
    unresolvedIssues: [],
  },
  {
    clauseId: "MDR-003-D",
    sequenceWithinRecord: 4,
    exactArabicClause: CLAUSE_SLICES["MDR-003-D"],
    openingWords: "أَقْرَبُ شَـهِيدٌ",
    boundaryConfidence: "high",
    boundaryReason:
      "Shifts from verb-based obedience/disobedience statements to elative predicate-adjective declarations (أقرب شهيد، أدنى حفيظ) about Allah's knowledge/control over creation; ends where the grammatical subject changes to 'القلوب' in clause E.",
    apparentGenre: "divine praise",
    sourceResearchStatus: "scholarly-review-required",
    proposedSources: [SHARED_QUOTED_SOURCE],
    directlyInspectedArabic: true,
    wordingMatch: "materially-different",
    timingStatus: "not-time-specific",
    gradingNotes:
      "Reported as part of the weak-chain narration (see record-level grading). Materially different against al-Haythami's quoted wording: MDR-003 has 'حَلَتْ دُونَ النُّفُوسِ' ('came between the souls') where the quotation has 'حَلَتْ دُونَ الثُّغُورِ' ('came between the frontier-posts/gaps') — a different noun, changing the image from souls to guarded passes/frontiers, which arguably fits the surrounding 'guardian/witness' theme (حفيظ) better than MDR-003's reading. Whether this reflects source-document transcription drift, a genuine transmission variant, edition variation, or an unresolved error is not decided here.",
    unresolvedIssues: [
      "Whether 'النُّفُوسِ' is an authentic alternate wording or a substitution — not established in this pass.",
    ],
  },
  {
    clauseId: "MDR-003-E",
    sequenceWithinRecord: 5,
    exactArabicClause: CLAUSE_SLICES["MDR-003-E"],
    openingWords: "الْقُلُوبُ لَكَ مَفْضِيَةٌ",
    boundaryConfidence: "high",
    boundaryReason:
      "New grammatical subject ('القلوب', the hearts) opens a run of parallel X-huwa-Y declarations about legislation/ownership (الحلال، الحرام، الدين، الأمر، الخلق، العبد); closes with an explicit divine-name restatement ('وأنت الله الرؤوف الرحيم') that reads as a natural seal to the whole praise section, immediately before the clearest boundary in the record — the shift to first-person petition in clause F.",
    apparentGenre: "divine praise",
    sourceResearchStatus: "scholarly-review-required",
    proposedSources: [SHARED_QUOTED_SOURCE],
    directlyInspectedArabic: true,
    wordingMatch: "materially-different",
    timingStatus: "not-time-specific",
    gradingNotes:
      "Reported as part of the weak-chain narration (see record-level grading). MDR-003's 'الْخَلْقَ خَلْقَكَ' omits the 'وَ' conjunction that precedes every other parallel item in this list in al-Haythami's quotation ('وَالْخَلْقُ خَلْقُكَ') — an apparent transcription omission, not a substantive wording change, but still a documented difference from an exact match against the quotation. Whether this reflects source-document transcription drift, a transmission variant, edition variation, or an unresolved error is not decided here.",
    unresolvedIssues: [],
  },
  {
    clauseId: "MDR-003-F",
    sequenceWithinRecord: 6,
    exactArabicClause: CLAUSE_SLICES["MDR-003-F"],
    openingWords: "أَسْأَلُكَ بِنُورِ وَجْهِكَ",
    boundaryConfidence: "high",
    boundaryReason:
      "Clearest boundary in the record: shifts from third-person declarative praise about Allah to an explicit first-person petition verb ('أَسْأَلُكَ', 'I ask You') — the textbook grammatical marker of a du'a's petition portion. Contains the record's only explicit timing reference.",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "scholarly-review-required",
    proposedSources: [SHARED_QUOTED_SOURCE],
    directlyInspectedArabic: true,
    wordingMatch: "materially-different",
    timingStatus: "uncertain",
    gradingNotes:
      "Reported as part of the weak-chain narration (see record-level grading). Several wording variants against al-Haythami's quoted wording: MDR-003's 'أَشْرَقَ' (masculine verb) vs. the quotation's 'أَشْرَقَتْ' (feminine, matching standard Arabic verb-subject agreement with 'السَّمَاوَاتُ'); MDR-003 adds a 'وَ' before 'بِكُلِّ حَقٍّ' that the quotation lacks there, and separately omits a 'وَ' before 'أَنْ تَجِيرَنِي' that the quotation has. Two more significant differences: MDR-003's 'تَقِيلَنِي' (from ق-ي-ل, roughly 'release/pardon me') vs. the quotation's 'تَقْبَلَنِي' (from ق-ب-ل, 'accept me') — different roots, different meaning. And MDR-003 has 'وَ' ('and') between 'هَذِهِ الْغَدَاةِ' and 'هَذِهِ الْعَشِيَّةِ' where the quotation has 'أَوْ' ('or') — this variant is kept explicitly unresolved (see timingStatus and unresolvedIssues), not settled in either direction, and is not treated as resolved merely because it also happens to sit within a chapter titled for morning/evening. Whether any of these differences reflect source-document transcription drift, a genuine transmission variant, edition variation, or an unresolved error is not decided here.",
    unresolvedIssues: [
      "The وَ/أَوْ variant between 'هذه الغداة' and 'هذه العشية' is not resolved — MDR-003's own wording ('and') is not assumed correct over al-Haythami's quotation ('or'), nor vice versa. This affects whether the supplication is textually for both morning and evening, or for whichever applies — timingStatus is kept 'uncertain' pending resolution, and the broader chapter-heading context alone is not used to settle it.",
      "تَقِيلَنِي vs. تَقْبَلَنِي — which is the wording in al-Tabarani's uninspected original, and whether MDR-003's reading is a legitimate alternate or a substitution, is not established in this pass.",
    ],
  },
];

export function reconstructMdr003FromClauses(): string {
  return CLAUSE_ORDER.map((id) => CLAUSE_SLICES[id]).join("");
}
