/**
 * MDR-004 clause map — Stage 3B research analysis only.
 *
 * MDR-004 is the longest entry in the register (1697 characters). Unlike
 * MDR-003, where segmentation ultimately revealed one single narration,
 * MDR-004's structural analysis and distinct reported source leads strongly
 * suggest it combines material associated with several narrations, plus one
 * block for which no source has been confirmed — but this composite picture
 * remains provisional: no primary hadith page or recognised classical
 * compilation was directly inspected in this pass. Segmentation (verified
 * exact by reconstruction) must be distinguished from source attribution,
 * which must in turn be distinguished from proof of separate origins. See
 * docs/dhikr/research/MDR-004-source-audit.md for the full research trail.
 *
 * This file is a research artifact. It is not imported into any Sanity
 * schema, public route, or the canonical eligibility gate, and it does not
 * alter src/lib/dhikr-research/morning-dhikr-register.ts's stored fields —
 * see tests/dhikr/dhikr-source-register-mdr-004-audit.test.ts for the
 * static checks confirming this.
 *
 * Clause boundaries were chosen on grammatical/thematic grounds (a new
 * vocative "اللَّهُمَّ" opening a distinct theme, a shift from declaration to
 * petition, a shift in grammatical construction — see `boundaryReason` per
 * clause), not merely because the text is long. Each clause's
 * `exactArabicClause` is *computed* from MORNING_DHIKR_SOURCE_REGISTER's own
 * MDR-004.originalDocumentText via indexOf on the marker phrases below,
 * rather than hand-transcribed, so the clause map can never silently drift
 * from the authoritative register text.
 */

import { MORNING_DHIKR_SOURCE_REGISTER } from "../morning-dhikr-register";

export type ClauseId = "MDR-004-A" | "MDR-004-B" | "MDR-004-C" | "MDR-004-D" | "MDR-004-E" | "MDR-004-F";

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
 * Opening-word markers used to locate each clause boundary within
 * MDR-004.originalDocumentText via String.indexOf. Clause A's marker
 * excludes the source document's leading single-space character; that
 * space is included in clause A's slice separately (see
 * computeClauseSlices), not lost.
 */
const CLAUSE_BOUNDARY_MARKERS: Record<ClauseId, string> = {
  "MDR-004-A": "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",
  "MDR-004-B": "اللَّهُمَّ مَا قُلْتُ مِنْ قَوْلٍ",
  "MDR-004-C": "اللَّهُمَّ مَا صَلَّيْتُ مِنْ صَلَاةٍ",
  "MDR-004-D": "اللَّهُمَّ إِنِّي أَسْأَلُكَ الرِّضَا",
  "MDR-004-E": "اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ",
  "MDR-004-F": "وَأَشْهَدُ أَنَّ وَعْدَكَ حَقٌّ",
};

const CLAUSE_ORDER: ClauseId[] = ["MDR-004-A", "MDR-004-B", "MDR-004-C", "MDR-004-D", "MDR-004-E", "MDR-004-F"];

function getMdr004OriginalText(): string {
  const record = MORNING_DHIKR_SOURCE_REGISTER.find((r) => r.internalId === "MDR-004");
  if (!record) throw new Error("MDR-004 not found in MORNING_DHIKR_SOURCE_REGISTER");
  return record.originalDocumentText;
}

/**
 * Slices MDR-004's originalDocumentText into the six clause substrings.
 * Clause A's slice starts at index 0 (not at its marker's indexOf result),
 * so it captures the source document's single leading space character —
 * documented separator handling, not an omission. Each other non-final
 * clause's slice includes its own trailing comma-space separator exactly
 * as it appears in the source. Concatenating all six slices in order
 * therefore reproduces originalDocumentText exactly — see the
 * reconstruction test in tests/dhikr/dhikr-source-register-mdr-004-audit.test.ts.
 */
export function computeClauseSlices(): Record<ClauseId, string> {
  const text = getMdr004OriginalText();
  const indices = CLAUSE_ORDER.map((id) => {
    const idx = text.indexOf(CLAUSE_BOUNDARY_MARKERS[id]);
    if (idx === -1) throw new Error(`Boundary marker for ${id} not found in MDR-004.originalDocumentText`);
    return idx;
  });
  indices[0] = 0; // documented separator-handling rule: include the leading space in clause A
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
 * Research findings per clause. Source-hierarchy discipline: every source
 * below is labelled precisely (original primary collection vs. a later
 * quotation of it vs. classical commentary vs. a modern fatwa/article
 * discussing it) — no later quotation is described as the primary source,
 * and no collection is described as directly inspected unless its own page
 * was actually opened and read. Search-engine synthesis (WebSearch) is
 * distinguished throughout from directly fetched page content (WebFetch).
 */
const ZAYD_IBN_THABIT_SOURCE =
  "Reported source lead, not directly inspected: an indexed/secondary description associates this clause group with a hadith reportedly taught by the Prophet ﷺ to Zayd ibn Thabit, with reported morning-specific wording ('حِين يُصبح') not directly verified. Candidate underlying collections named in search-engine synthesis (not directly fetched): Musnad Ahmad, al-Hakim's al-Mustadrak, al-Tabarani, and al-Bayhaqi's Kitab al-Asma wa al-Sifat (per a dorar.net Mawsu'ah Hadithiyyah entry surfaced in search results but not directly fetched — dorar.net returned HTTP 403 to direct WebFetch in this environment). Reportedly differing assessments were located, neither directly inspected: Ibn al-Jawzi (al-'Ilal al-Mutanahiya) is reported, through an inaccessible takhrij article known only via search snippet, to have said this hadith 'لا يثبت' (is not established); al-Haythami is reported, through the same inaccessible-article class of secondary synthesis, to have said one of al-Tabarani's two routes has trustworthy narrators while the remaining routes contain Abu Bakr ibn Abi Maryam, reportedly graded weak. This is recorded as a reported disagreement requiring direct inspection, not a directly-inspected or settled verdict.";

const AMMAR_IBN_YASIR_SOURCE =
  "Reported source lead, not directly inspected: search-engine synthesis associates this clause with a narration attributed to Ammar ibn Yasir in an-Nasa'i, reported as having a sound chain ('sahih') only — this characterisation itself is unverified, and is not treated as a settled fact. Grading authority and exact formulation are unverified. No specific an-Nasa'i hadith number was located via sunnah.com-scoped search in this pass. Recorded as a search-indexed source-lead attribution requiring direct primary-page verification, not a directly-inspected grading.";

const IBN_MASUD_COVENANT_SOURCE =
  "Reported source lead, not directly inspected: an indexed/secondary description associates this clause with a narration attributed to Abdullah ibn Mas'ud, with reported morning-and-evening wording ('كُلَّ صَبَاحٍ وَمَسَاءٍ') not directly verified. Candidate underlying collections, via search-engine synthesis: Abu Dawud 5067, Tirmidhi 3392, Ahmad (Musnad no. 51, with slight wording variation) — collection references remain unverified. A chain disconnection is reported (Ahmad's narrators otherwise belonging to the Sahih collections, except that 'Awf ibn 'Abdullah reportedly did not hear directly from Ibn Mas'ud) — a specific reported weakening factor, not a blanket 'weak narrator' claim and not a directly-inspected or final grading. Not directly inspected on Abu Dawud's, Tirmidhi's, or Ahmad's own pages in this pass.";

export const MDR_004_CLAUSE_MAP: ClauseMapEntry[] = [
  {
    clauseId: "MDR-004-A",
    sequenceWithinRecord: 1,
    exactArabicClause: CLAUSE_SLICES["MDR-004-A"],
    openingWords: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",
    boundaryConfidence: "high",
    boundaryReason:
      "Opens with a Talbiyah-style repeated-response formula (لَبَّيْكَ...لَبَّيْكَ...) distinct in form from every other clause in the record; ends where a new vocative 'اللَّهُمَّ' opens a grammatically distinct oath/vow theme in clause B.",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "in-progress",
    proposedSources: [ZAYD_IBN_THABIT_SOURCE],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-only",
    gradingNotes:
      "Reported as connected to the Zayd ibn Thabit source lead (see record-level grading) — attribution not verified in any underlying collection. No directly-inspected primary-collection Arabic text was obtained for this clause in this pass — comparison wording located via search-engine synthesis only, which is not treated as equivalent to direct inspection. wordingMatch is therefore 'unresolved', not a matched value, pending direct inspection of Ahmad/al-Hakim/al-Tabarani/al-Bayhaqi's own pages.",
    unresolvedIssues: [
      "No directly-inspected primary Arabic text has been obtained for this clause — only a search-synthesized quotation from a secondary article.",
      "Whether this clause's wording exactly matches, varies from, or materially differs from any of the four named collections' own text is not established in this pass.",
    ],
  },
  {
    clauseId: "MDR-004-B",
    sequenceWithinRecord: 2,
    exactArabicClause: CLAUSE_SLICES["MDR-004-B"],
    openingWords: "اللَّهُمَّ مَا قُلْتُ مِنْ قَوْلٍ",
    boundaryConfidence: "high",
    boundaryReason:
      "New vocative 'اللَّهُمَّ' opens a distinct theme (oaths and vows subject to Allah's will); ends where a further new vocative 'اللَّهُمَّ' opens a parallel-structure theme about prayers/curses in clause C.",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "in-progress",
    proposedSources: [ZAYD_IBN_THABIT_SOURCE],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-only",
    gradingNotes:
      "Reported as connected to the same Zayd ibn Thabit source lead as clause A (a search-synthesized quotation includes this content contiguously with clause A and clause C, but this contiguity itself is reported through secondary synthesis, not directly inspected). No directly-inspected primary Arabic obtained; wordingMatch is 'unresolved' for the same reason as clause A.",
    unresolvedIssues: [
      "No directly-inspected primary Arabic text has been obtained for this clause.",
    ],
  },
  {
    clauseId: "MDR-004-C",
    sequenceWithinRecord: 3,
    exactArabicClause: CLAUSE_SLICES["MDR-004-C"],
    openingWords: "اللَّهُمَّ مَا صَلَّيْتُ مِنْ صَلَاةٍ",
    boundaryConfidence: "high",
    boundaryReason:
      "New vocative 'اللَّهُمَّ' opens a parallel-structure theme (prayers/curses redirected to Allah's judgment) mirroring clause B's grammar; closes with wording resembling the Qur'anic phrase in Surah Yusuf 12:101 ('تَوَفَّنِي مُسْلِمًا وَأَلْحِقْنِي بِالصَّالِحِينَ' — MDR-004 reads 'وَالْحِقْنِي', a one-letter variant). Ends where an explicit first-person petition verb 'أَسْأَلُكَ' opens clause D — the clearest grammatical boundary in this segment, and also a point where the reported source lead changes (see below) — though a grammatical boundary alone does not itself prove separate origins.",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "in-progress",
    proposedSources: [
      ZAYD_IBN_THABIT_SOURCE,
      "The closing phrase 'تَوَفَّنِي مُسْلِمًا وَ(أَ)لْحِقْنِي بِالصَّالِحِينَ' closely resembles Qur'an 12:101 (Surah Yusuf), part of Prophet Yusuf's own supplication — not independently verified against Quran.com in this pass (out of scope for this record's research budget; flagged for manual verification). If this resemblance is confirmed, this clause would itself be a further composite of a hadith framing plus an embedded Qur'anic phrase.",
    ],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-only",
    gradingNotes:
      "Reported as connected to the same Zayd ibn Thabit source lead as clauses A and B, on the same reported (not directly inspected) basis. No directly-inspected primary Arabic obtained; wordingMatch is 'unresolved' for the same reason as clauses A and B.",
    unresolvedIssues: [
      "No directly-inspected primary Arabic text has been obtained for this clause.",
      "The apparent Qur'an 12:101 resemblance in the closing phrase was not independently verified against Quran.com in this pass.",
    ],
  },
  {
    clauseId: "MDR-004-D",
    sequenceWithinRecord: 4,
    exactArabicClause: CLAUSE_SLICES["MDR-004-D"],
    openingWords: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الرِّضَا",
    boundaryConfidence: "high",
    boundaryReason:
      "Explicit first-person petition marker 'إِنِّي أَسْأَلُكَ' ('I ask You') opens a new theme distinct from clauses A–C's oath/prayer/curse content, and a reported source lead (see proposedSources) associates this specific wording with a different narration (Ammar ibn Yasir) than the Zayd ibn Thabit source lead behind clauses A–C — this association is reported, not directly confirmed. Ends where a further new vocative 'اللَّهُمَّ' opens a Qur'anic-style address in clause E.",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "in-progress",
    proposedSources: [AMMAR_IBN_YASIR_SOURCE],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "no-timing-evidence",
    gradingNotes:
      "Reported, via search-engine synthesis only, as connected to a narration attributed to Ammar ibn Yasir in an-Nasa'i with a chain reported as sound — not directly inspected, and this attribution is not presented as verified. No directly-inspected primary Arabic text was obtained for this clause; wordingMatch is 'unresolved'.",
    unresolvedIssues: [
      "The an-Nasa'i hadith number for this narration was not located via sunnah.com-scoped search in this pass.",
      "The 'sound chain' grading claim was not directly inspected on any primary or classical grading source.",
      "No explicit morning/evening timing wording was located for this specific clause in this pass — timingStatus is 'no-timing-evidence', not inferred from the record's overall morning-dhikr context.",
    ],
  },
  {
    clauseId: "MDR-004-E",
    sequenceWithinRecord: 5,
    exactArabicClause: CLAUSE_SLICES["MDR-004-E"],
    openingWords: "اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ",
    boundaryConfidence: "high",
    boundaryReason:
      "New vocative 'اللَّهُمَّ' opens a Qur'anic-style address ('فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ' closely resembles Qur'an 39:46, Surah az-Zumar) leading into a covenant/testimony (shahada) formula distinct in theme and reported source lead from clause D. Ends at a point where the located comparison quotation's own text (the shorter Ibn Mas'ud narration lead) stops — clause F's content was not found in the same located quotation. This split is a provisional source-analysis boundary, not a verified hadith boundary — a grammatical boundary here does not itself prove a separate narration (see clause F).",
    apparentGenre: "prophetic supplication",
    sourceResearchStatus: "in-progress",
    proposedSources: [
      IBN_MASUD_COVENANT_SOURCE,
      "Opening phrase 'اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ عَالِمَ الْغَيْبِ وَالشَّهَادَةِ' closely resembles Qur'an 39:46 (Surah az-Zumar), per multiple tafsir sources surfaced in search results (quran.ksu.edu.sa Tafsir Ibn Kathir, others) — not independently re-verified against Quran.com directly in this pass.",
    ],
    directlyInspectedArabic: false,
    wordingMatch: "unresolved",
    timingStatus: "morning-and-evening",
    gradingNotes:
      "Reported, via search-engine synthesis, as connected to a narration attributed to Ahmad with narrators otherwise belonging to the Sahih collections, except for a reported chain disconnection (Awf ibn Abdullah reportedly not having heard directly from Ibn Mas'ud) — a specific reported weakness, not a blanket 'weak' label, and not a directly-inspected or final grading. No directly-inspected primary Arabic text was obtained for this clause; wordingMatch is 'unresolved'. timingStatus is recorded as 'morning-and-evening' because a search-indexed or secondary description reports 'كُلَّ صَبَاحٍ وَمَسَاءٍ' (every morning and evening) within the narration's own introductory framing — but the Arabic wording itself has not been directly inspected, so this reported timing is not treated as directly verified.",
    unresolvedIssues: [
      "No directly-inspected primary Arabic text has been obtained for this clause.",
      "The Qur'an 39:46 resemblance was not independently re-verified against Quran.com directly in this pass.",
      "Whether MDR-004's full clause E wording (which appears somewhat longer than the shortest located quotation of the Ibn Mas'ud hadith) matches a specific known longer route, or contains additional unattributed material, is not fully resolved.",
    ],
  },
  {
    clauseId: "MDR-004-F",
    sequenceWithinRecord: 6,
    exactArabicClause: CLAUSE_SLICES["MDR-004-F"],
    openingWords: "وَأَشْهَدُ أَنَّ وَعْدَكَ حَقٌّ",
    boundaryConfidence: "medium",
    boundaryReason:
      "Grammatically, this continues the same 'وَأَشْهَدُ أَنَّ...' (and I bear witness that...) testimony chain begun in clause E, so the boundary here is not a clean grammatical break in the way A/B/C/D/E's boundaries are — it is drawn primarily because the shortest located quotation of the Ibn Mas'ud covenant hadith (clause E's proposed source) ends before this content begins, and no confirmed source was located for this continuation specifically. Confidence is 'medium', not 'high', reflecting this partly source-driven (not purely grammatical) boundary.",
    apparentGenre: "uncertain",
    sourceResearchStatus: "in-progress",
    proposedSources: [
      "Unconfirmed mirror lead only — not attributed to al-Tabarani or any collection as a source: one search result (a third-party mirror site, hadithunlocked.com, referencing 'tabarani:4803') surfaced a possible thematic association with a longer covenant-hadith route touching on the Last Hour and resurrection. This is recorded strictly as an unverified mirror lead, not as an attribution — it was not confirmed by directly inspecting that page or any classical source, and this clause is not attributed to al-Tabarani on this basis.",
    ],
    directlyInspectedArabic: false,
    wordingMatch: "no-source-to-compare",
    timingStatus: "uncertain",
    gradingNotes:
      "No source is confirmed for this clause in this pass; evidence label: no source located / location unverified. It may be: (a) part of a longer route of the narration reportedly associated with clause E, not yet located and confirmed, (b) a separately-sourced testimony/istighfar composition, or (c) later devotional composition appended in compilation. This module does not decide which explanation is correct. No grading can be assigned to unsourced content.",
    unresolvedIssues: [
      "No source has been confirmed for this clause — it remains the least-resourced portion of MDR-004.",
      "The unconfirmed mirror lead (hadithunlocked.com, tabarani:4803) was not independently verified in this pass and does not establish attribution to al-Tabarani.",
      "Whether this clause belongs to the same narration reportedly associated with clause E, a different narration, or neither, is unresolved.",
    ],
  },
];

export function reconstructMdr004FromClauses(): string {
  return CLAUSE_ORDER.map((id) => CLAUSE_SLICES[id]).join("");
}
