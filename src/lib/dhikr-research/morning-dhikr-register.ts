/**
 * Morning Dhikr Source Register — Stage 3A transcription.
 *
 * 30 records transcribed verbatim from the content owner's supplied source
 * document ("Project_Sadaqah_M:E Dua_Arabic_Only.docx"). Extraction method:
 * the source .docx was unzipped and its raw word/document.xml paragraph
 * structure (<w:p>/<w:t>) was parsed directly and independently cross-checked
 * against a macOS `textutil -convert txt` conversion of the same file — both
 * methods agreed exactly on content and order (31 total paragraphs, 30
 * non-empty). This is the authoritative transcription; see
 * docs/dhikr/32-morning-dhikr-source-register.md for full methodology and
 * the transcription audit table.
 *
 * Per Stage 3A scope: only transcription fields are populated below. Every
 * research field (sourcing, grading, wording verification, scholarly
 * decision, import status) is deliberately left in its unclaimed default —
 * see computeImportGate in ./validation.ts, which blocks every record here
 * from import for that reason. No source claim, hadith grading, translation,
 * or reward/virtue claim has been added or verified. Entries are stored in
 * this array in exact document order (sequenceNumber 1-30, physically
 * ascending) — see assertRegisterStoredInAuthoritativeOrder.
 */

import type {
  ContentClassification,
  DhikrSourceResearchRecord,
  ImportStatus,
  MorningSpecificStatus,
  SourceResearchStatus,
  WordingMatchStatus,
} from "./types";

function unclaimedResearchFields(): Pick<
  DhikrSourceResearchRecord,
  | "contentClassification"
  | "morningSpecificStatus"
  | "sourceResearchStatus"
  | "primaryCollection"
  | "primaryReference"
  | "secondaryReferences"
  | "narrator"
  | "sourceArabicWording"
  | "wordingMatchStatus"
  | "hadithGrading"
  | "gradingAuthority"
  | "gradingNotes"
  | "repetitionEvidence"
  | "virtueOrRewardClaim"
  | "virtueEvidence"
  | "sourceUrls"
  | "usulAiResearchNotes"
  | "scholarlyReviewer"
  | "scholarlyDecision"
  | "editorialNotes"
  | "importStatus"
> {
  return {
    contentClassification: "unclassified" as ContentClassification,
    morningSpecificStatus: "uncertain" as MorningSpecificStatus,
    sourceResearchStatus: "not-started" as SourceResearchStatus,
    primaryCollection: "",
    primaryReference: "",
    secondaryReferences: [],
    narrator: "",
    sourceArabicWording: "",
    wordingMatchStatus: "unresolved" as WordingMatchStatus,
    hadithGrading: "",
    gradingAuthority: "",
    gradingNotes: "",
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    editorialNotes: "",
    importStatus: "research-only" as ImportStatus,
  };
}

export const MORNING_DHIKR_SOURCE_REGISTER: DhikrSourceResearchRecord[] = [
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-001-source-audit.md
    // for the full research trail behind every field below.
    sequenceNumber: 1,
    internalId: "MDR-001",
    openingArabicWords: "آيَة ٱلْكُرْسِيّ",
    fullArabicText: "آيَة ٱلْكُرْسِيّ | ٱلْإِخْلَاص 3x | ٱلْفَلَق 3x| ٱلنَّاس  3x ",
    originalDocumentText: "آيَة ٱلْكُرْسِيّ | ٱلْإِخْلَاص 3x | ٱلْفَلَق 3x| ٱلنَّاس  3x ",
    sourceDocumentAnnotations: ["3x (al-Ikhlas)", "3x (al-Falaq)", "3x (an-Nas)"],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Document lists this entry as a reference to Ayat al-Kursi plus the three Quls by name, each annotated 3x, rather than transcribing their full Qur'anic text inline. fullArabicText reproduces exactly what the source document contains (the reference line), not the full Qur'anic text of the four items referenced.",
    proposedCategory: "",
    contentClassification: "composite-text",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "scholarly-review-required",
    primaryCollection: "Sunan Abi Dawud; Jami' at-Tirmidhi (three-Quls component; primary pages not yet directly inspected — see usulAiResearchNotes and the audit report's evidence-quality table)",
    primaryReference:
      "Abu Dawud 5082; Tirmidhi 3575 — three-Quls component only (al-Ikhlas, al-Falaq, an-Nas, 3x morning and evening), as reported by search-indexed sunnah.com content and independently corroborated by islamqa.info; the sunnah.com pages themselves were not directly inspected in this environment (HTTP 403). No primary reference is asserted for the whole combined entry; see secondaryReferences for the separately-sourced Ayat al-Kursi component. Manual verification against the primary pages is still required — see docs/dhikr/research/MDR-001-source-audit.md.",
    secondaryReferences: [
      "Component: Ayat al-Kursi (Qur'an 2:255) paired with the opening of Surah al-Mu'min/Ghafir (40:1-3) as a morning-recited pair — Jami' at-Tirmidhi 2879, narrated by Abu Hurairah, reported as graded da'if (weak) by Imam at-Tirmidhi himself (directly inspected via islamqa.org's citation page, not sunnah.com's own page); a parallel version with a weak chain is reported as recorded by Ibn al-Sunni, 'Amal al-Yawm wal-Layla, no. 77 — this specific citation was not independently located or inspected and its exact location remains unverified. This is a different hadith from the three-Quls citation above and does not involve the three Quls at all.",
      "Related but distinct: Sahih al-Bukhari 5010, narrated by Abu Hurairah (the 'thief who was Shaytan' narration) — reported as sahih, instructing recitation of Ayat al-Kursi at bedtime for protection through the night 'until the morning', not as a morning-recited item. This is contextual evidence only for why compilations commonly place Ayat al-Kursi near morning/evening adhkar — it does not establish a morning repetition and is not evidence for MDR-001's specific grouping.",
      "Component: al-Ikhlas (Qur'an 112), al-Falaq (Qur'an 113), an-Nas (Qur'an 114) — surah identity and opening-verse Arabic text directly inspected on quran.com (quran.com/112, /113, /114); Ayat al-Kursi (Qur'an 2:255) opening Arabic text likewise directly inspected on quran.com/2/255.",
    ],
    narrator:
      "Abdullah ibn Khubayb (three-Quls component, Abu Dawud 5082/Tirmidhi 3575, per indirect corroboration); Abu Hurairah (Ayat al-Kursi + al-Mu'min component, Tirmidhi 2879, weak — see secondaryReferences). Narrator names are as reported by secondary corroboration, not yet confirmed against a directly-inspected primary isnad.",
    sourceArabicWording:
      "",
    wordingMatchStatus: "composite-of-multiple-sources",
    hadithGrading: "",
    gradingAuthority: "",
    gradingNotes:
      "Left empty at the record level: this record combines two components with different, and differently-verified, grading claims, so no single value can honestly represent it. As reported (not yet directly inspected on their primary sunnah.com pages): the three-Quls component is graded hasan sahih gharib by at-Tirmidhi, with its isnad separately reported as graded sahih by Imam an-Nawawi (al-Adhkar, p.107); the Ayat al-Kursi + al-Mu'min component's only located morning-specific hadith (Tirmidhi 2879) is reported graded da'if (weak) by at-Tirmidhi himself. Provisional metadata — verify against the original collection page or edition. See primaryReference/secondaryReferences and the audit report's per-narration grading table.",
    repetitionCount: 3,
    repetitionEvidence:
      "Applies only to the al-Ikhlas/al-Falaq/an-Nas component, not to Ayat al-Kursi: Abu Dawud 5082 and Tirmidhi 3575 are reported (via secondary corroboration, not yet direct inspection of the primary pages) to state the Prophet ﷺ instructed reciting these three surahs three times ('thalathan') in the evening and in the morning. The source document attaches no repetition marker to Ayat al-Kursi itself (checked directly against this record's own originalDocumentText), and no repetition-count evidence for Ayat al-Kursi was located in this stage. This repetition count must not be extended to Ayat al-Kursi.",
    virtueOrRewardClaim:
      "Three-Quls component: reported as 'they will suffice you against all things' (kafathu min kulli shay'), stated within the same hadith as the repetition instruction. Ayat al-Kursi + al-Mu'min component: reported that recitation 'in the morning' brings protection 'until the evening' (and vice versa for evening recitation), stated within a hadith reported graded weak.",
    virtueEvidence:
      "Three-Quls claim: Abu Dawud 5082; Tirmidhi 3575 (reported hasan sahih gharib / sahih isnad per an-Nawawi, via secondary corroboration) — evidence located, primary-page inspection still outstanding. Ayat al-Kursi + al-Mu'min claim: Tirmidhi 2879 (reported da'if per at-Tirmidhi); parallel weak-chain version reported in Ibn al-Sunni, 'Amal al-Yawm wal-Layla no. 77, location unverified — evidence located but weak, not sahih or hasan, and not yet directly inspected.",
    sourceUrls: [
      "https://sunnah.com/abudawud:5082",
      "https://sunnah.com/tirmidhi:3575",
      "https://sunnah.com/tirmidhi:2879",
      "https://sunnah.com/bukhari:5010",
      "https://islamqa.info/en/answers/126587",
      "https://islamqa.org/hanafi/hadithanswers/122483/reciting-the-beginning-verses-of-surah-mumin-and-ayatul-kursi/",
      "https://quran.com/2/255",
      "https://quran.com/112",
      "https://quran.com/113",
      "https://quran.com/114",
    ],
    usulAiResearchNotes:
      "Search expressions used on usul.ai (https://usul.ai): 'Ayat al-Kursi morning evening', and a site-restricted web search 'site:usul.ai al-Mu'awwidhatayn OR Ikhlas OR Falaq OR Nas morning evening'. No specific book, volume/page, or hadith number was located for this combination via either query — results surfaced whole classical texts and commentaries (tafsir, fiqh works, unrelated titles) rather than an individually-citable hadith entry comparable to sunnah.com's per-hadith pages. Arabic wording was not directly inspected via Usul.ai in this pass. Usul.ai's more targeted features (its AI chat / 'Find Hadith' filter) were not used interactively in this pass and remain untried. Direct WebFetch access to sunnah.com's own hadith pages returned HTTP 403 in this environment for every URL attempted (abudawud:5082, tirmidhi:3575, tirmidhi:2879, hisn:87, bulugh/2/220); hadith numbers, narrators, and gradings above are as reported via Google-indexed search-result snippets of sunnah.com plus islamqa.info's and islamqa.org's independent citation of the same hadith numbers and gradings (islamqa.org's page was directly fetched and its full quoted text inspected; islamqa.info's page was likewise directly fetched). Remaining for a human researcher: open the sunnah.com pages for Abu Dawud 5082, Tirmidhi 3575, and Tirmidhi 2879 directly; locate and inspect an actual edition or Usul.ai work-location for the Ibn al-Sunni no. 77 citation, which was never independently located in this pass; and use Usul.ai's interactive search/chat tooling to check for classical commentary or variant narrations beyond what is recorded here.",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    editorialNotes:
      "MDR-001 is a compilation-style reference list (Ayat al-Kursi + three Quls), not itself the recited Arabic text of any of the four items. It combines two components with different, unequal degrees of source verification, one of which (the three-Quls component) is strongly reported-graded and the other (Ayat al-Kursi's morning pairing) weakly reported-graded — no primary page for either has yet been directly inspected in this environment. No single narration containing the full combined MDR-001 entry was located during this audit; the evidence located supports the components separately, not the combined entry as one narration. Recommend scholarly review decide whether to: (a) keep as one composite register entry with per-component sourcing as recorded here, (b) split into separate entries once mapped into dhikrItem, or (c) drop the Ayat al-Kursi reference from this entry given its weak morning-specific sourcing, retaining only the well-graded three-Quls instruction — after manual primary-source verification (see docs/dhikr/research/MDR-001-source-audit.md, 'Manual primary-source verification required').",
    importStatus: "research-only",
  },
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-002-source-audit.md
    // for the full research trail behind every field below.
    sequenceNumber: 2,
    internalId: "MDR-002",
    openingArabicWords: "بسْمِ اللَّهِ الَّذِي لَا يَضُرُّ",
    fullArabicText:
      "بسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ، فِي الْأَرْضِ، وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ 3x ",
    originalDocumentText:
      "بسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ، فِي الْأَرْضِ، وَلَا فِي السَّمَاءِ، وَهُوَ السَّمِيعُ الْعَلِيمُ 3x ",
    sourceDocumentAnnotations: ["3x"],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "scholarly-review-required",
    primaryCollection: "Jami' at-Tirmidhi; Sunan Ibn Majah (Arabic text, narrator, timing, repetition, and grading metadata found in directly inspected source-page content relayed by the content owner into this environment); Sunan Abi Dawud (numbering and chapter context corroborated, Arabic wording not separately re-inspected beyond the shared Tirmidhi/Ibn Majah text)",
    primaryReference:
      "Tirmidhi 3388 and Ibn Majah 3869 — core narration strongly established from directly inspected, user-relayed source-page content: Arabic wording, narrator chain, timing, repetition, and grading (see sourceArabicWording and the per-source grading table in docs/dhikr/research/MDR-002-source-audit.md). Primary wording and practice details are substantially verified on this basis, but the record remains under scholarly review — this content was relayed by the content owner into this environment, not independently fetched by this system. Abu Dawud 5088 (Kitab al-Adab, 'What to say when waking up') carries the same numbering, independently corroborated via Usul.ai's Badhl al-Majhud commentary; its own Arabic wording was not separately re-inspected in this pass.",
    secondaryReferences: [
      "Riyad as-Salihin 1457 (Kitab al-Adhkar) — directly inspected source-page content (relayed by the content owner) confirms the same text, and the page attributes the narration to Abu Dawud and Tirmidhi, with An-Nawawi's own note that Tirmidhi called it hasan sahih.",
      "Usul.ai search 'أبان بن عثمان حين يصبح ثلاث مرات' located Badhl al-Majhud fi Hall Sunan Abi Dawud (commentary by al-Saharanfuri) referencing Entry 5088 — independent corroboration, via a second authorized source, of Abu Dawud's numbering for this hadith.",
      "Usul.ai search (same query) also located Sahih Ibn Hibban, Entry 317 — a possible additional primary collection for this hadith; topical relevance only, not independently confirmed as the identical text in this pass.",
      "Usul.ai search (same query) also located al-Tabarani, Kitab al-Du'a — a possible additional reference; not independently confirmed in this pass.",
      "Compilation provenance only, not the underlying source: Sharh Hisn al-Muslim min Adhkar al-Kitab wa'l-Sunna (Majdi al-Ahmad), located via Usul.ai, discusses this hadith as part of Hisn al-Muslim's morning/evening adhkar compilation.",
      "Unverified leads from the task brief, not located via an approved source in this pass: Musnad Ahmad and Sunan al-Kubra of an-Nasa'i (9843) — both still require direct manual search; not resolved by this correction pass.",
    ],
    narrator:
      "Aban ibn Uthman narrates from his father, Uthman ibn Affan (companion), from the Messenger of Allah ﷺ — this chain appears in directly inspected source-page content (relayed by the content owner) for Tirmidhi 3388 and Ibn Majah 3869, and is consistent with Riyad as-Salihin 1457. No independently-chained corroborating narration (i.e. reaching the Prophet ﷺ through a different route than Aban-from-Uthman) has been located in any pass to date — this single-chain ('gharib'-type) feature is reflected in Tirmidhi's own classification (\"حسن صحيح غريب\", gharib specifically flagging this chain singularity). No documented reliability concern about Aban ibn Uthman personally has been located. Research status remains scholarly-review-required pending independent, agent-fetched (not merely relayed) confirmation of this chain.",
    sourceArabicWording:
      "مَا مِنْ عَبْدٍ يَقُولُ فِي صَبَاحِ كُلِّ يَوْمٍ وَمَسَاءِ كُلِّ لَيْلَةٍ: بِسْمِ اللَّهِ الَّذِي لاَ يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلاَ فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ، ثَلاَثَ مَرَّاتٍ، إِلاَّ لَمْ يَضُرَّهُ شَيْءٌ — Evidence label: directly inspected source-page content relayed by the content owner (Tirmidhi 3388 and Ibn Majah 3869, substantively the same wording on both; corroborated by Riyad as-Salihin 1457). This is not identical in evidentiary weight to primary text independently fetched by this system. Closing-clause note: the relayed transcription of the closing clause read literally as \"فَيَضُرُّهُ شَيْءٌ\" (‘then something will harm him’), the opposite of the hadith's established meaning — the negation appears to have been omitted or corrupted in relay. The wording here, \"إِلاَّ لَمْ يَضُرَّهُ شَيْءٌ\", is the standard formula supported by the surrounding narration context and by every prior English-translation source in this audit, and has been reconstructed on that basis — it is NOT independently transcribed from the live page, and must be treated as reconstructed, not confirmed, until a human researcher independently re-confirms it character-for-character against the live Tirmidhi/Ibn Majah pages.",
    wordingMatchStatus: "minor-orthographic-variation",
    hadithGrading: "",
    gradingAuthority: "",
    gradingNotes:
      "Left empty at the record level: the schema's single hadithGrading/gradingAuthority fields cannot cleanly represent four distinct, source-specific grading labels without implying one covers the whole record — this absence of a single record-level grading is itself one of the reasons sourceResearchStatus remains scholarly-review-required, not merely a cosmetic gap. As found in directly inspected, user-relayed source-page content: Tirmidhi's own compiler classification (on the Tirmidhi 3388 page, in Arabic) is \"هَذَا حَدِيثٌ حَسَنٌ صَحِيحٌ غَرِيبٌ\" (hasan sahih gharib); the same page separately displays a modern edition grading, \"Grade: Hasan (Darussalam)\"; the Ibn Majah 3869 page displays \"Hasan\"; Riyad as-Salihin 1457 states An-Nawawi's own note that Tirmidhi called it \"حسن صحيح\" (hasan sahih). These source-specific grading labels differ in formulation but do not, by themselves, establish a substantive contradiction — all four are within the hasan/sahih family, not a sahih-vs-da'if conflict. Scholarly review is still required to confirm how the public portal should present the grading (e.g. citing Tirmidhi's own classification, the Darussalam edition grading, or both). Full per-source breakdown in docs/dhikr/research/MDR-002-source-audit.md.",
    repetitionCount: 3,
    repetitionEvidence:
      "Found in directly inspected, user-relayed source-page content for both Tirmidhi 3388 and Ibn Majah 3869: \"ثَلاَثَ مَرَّاتٍ\" (three times), positioned after the recited formula and before the virtue clause — the three repetitions apply to the whole supplication as a single unit, not to a sub-part of it. This directly supports and matches the source document's own '3x' annotation. Primary wording is substantially verified on this basis, though independent (agent-fetched, not relayed) confirmation remains outstanding.",
    virtueOrRewardClaim:
      "Found in directly inspected, user-relayed source-page content for Tirmidhi 3388 (with the closing clause reconstructed per the sourceArabicWording note above) and consistent with Ibn Majah 3869: \"إِلاَّ لَمْ يَضُرَّهُ شَيْءٌ\" — the narrower, directly-supported claim is simply \"nothing will harm him.\" No \"until morning\" or \"until evening\" durational limitation is asserted in the relayed wording itself, and none is added here.",
    virtueEvidence:
      "Tirmidhi 3388; Ibn Majah 3869 — directly inspected, user-relayed source-page content, consistent between both. Riyad as-Salihin 1457 corroborates via its own directly inspected, user-relayed text. Not yet independently fetched by this system.",
    sourceUrls: [
      "https://sunnah.com/abudawud:5088",
      "https://sunnah.com/tirmidhi:3388",
      "https://sunnah.com/ibnmajah:3869",
      "https://sunnah.com/riyadussalihin:1457",
    ],
    usulAiResearchNotes:
      "Search expressions used on usul.ai (https://usul.ai): (1) 'بسم الله الذي لا يضر مع اسمه شيء' — surfaced classical commentary/fatwa works discussing this hadith (Ibn Baz fatwas, Sharh Hisn al-Muslim, Al-Isaba, Asad al-Ghaba) but no granular primary hadith-collection page. (2) 'أبان بن عثمان حين يصبح ثلاث مرات' — the most productive query: located Badhl al-Majhud fi Hall Sunan Abi Dawud referencing Entry 5088 (corroborating Abu Dawud's numbering independently), Sahih Ibn Hibban Entry 317 (a new potential collection lead, not independently confirmed as the same text), and al-Tabarani's Kitab al-Du'a. (3) 'من قال بسم الله الذي لا يضر' — returned the same class of fatwa/commentary works as query 1, no new primary-collection hit. (4) 'حين يمسي ثلاث مرات' — returned results (Musnad Abi Hanifa, Kanz al-Ummal, al-Fath al-Kabir) that do not appear topically specific to this hadith; treated as noise, not evidence. (5) 'Aban ibn Uthman morning evening supplication' (English) — returned no clearly relevant results. No book located via Usul.ai in this pass provided a directly-readable, individually-citable hadith entry with full Arabic text and its own grading comparable to sunnah.com's per-hadith page format. Separately, Tirmidhi 3388, Ibn Majah 3869, and Riyad as-Salihin 1457 were addressed through directly inspected source-page content relayed by the content owner into this environment (a follow-up correction pass), substantially establishing Arabic wording, narrator, timing, repetition, and grading for those three sources — but this is user-relayed content, not content independently fetched by this system, which is one reason sourceResearchStatus remains scholarly-review-required. Still remaining for a human researcher: independently verify the Sahih Ibn Hibban Entry 317 and al-Tabarani Kitab al-Du'a leads found via Usul.ai actually contain this same hadith; check Musnad Ahmad and an-Nasa'i's Sunan al-Kubra 9843 directly; independently re-inspect Abu Dawud 5088's own Arabic page text (not yet separately re-confirmed beyond its shared numbering/chapter context); and character-for-character re-verify the sourceArabicWording field's reconstructed closing clause against the live Tirmidhi/Ibn Majah pages.",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    editorialNotes:
      "Unlike MDR-001, MDR-002 is a single, well-identified hadith (not a composite reference list). Its core narration is strongly established from directly inspected, user-relayed source-page content for Tirmidhi 3388 and Ibn Majah 3869 (corroborated by Riyad as-Salihin 1457): one narrator chain (Aban ibn Uthman from Uthman ibn Affan), an explicit three-times repetition instruction, an explicit morning-and-evening timing instruction, and a protection claim ('nothing will harm him'). Primary wording and practice details are substantially verified on this basis, but the record remains under scholarly review — sourceResearchStatus is kept at 'scholarly-review-required', not 'verified', because: the closing clause was reconstructed rather than copied character-for-character from an independently accessible live primary page; Abu Dawud 5088's own Arabic page remains uninspected; the Sahih Ibn Hibban and al-Tabarani leads remain unconfirmed; grading presentation still requires scholarly judgment; record-level grading fields remain empty (itself one reason scholarly review is required, not a cosmetic gap); and the directly inspected evidence was relayed into this environment rather than independently fetched by this system. The grading differences across sources (Tirmidhi's own hasan sahih gharib; the Darussalam edition's displayed Hasan; Ibn Majah's displayed Hasan; An-Nawawi's hasan sahih citation) do not amount to a substantive contradiction, but do not by themselves justify 'verified' either. scholarlyDecision and importStatus are unchanged by this correction (still pending / research-only).",
    importStatus: "research-only",
  },
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-003-source-audit.md
    // and src/lib/dhikr-research/audits/mdr-003-clause-map.ts for the full
    // clause-level research trail behind every field below.
    sequenceNumber: 3,
    internalId: "MDR-003",
    openingArabicWords: "أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ",
    fullArabicText:
      "أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ، وَأَحَقُّ مِنْ عَبْدٍ، وَانْصُرْ مَنِ ابْتَغَى، وَأَرْأَفُ مِنْ مَلِكٍ، وَأَجْوَدُ مِنْ سُئِلَ، وَأَوْسَعُ مِنْ أَعْطَى أَنْتَ الْمَالِكُ لَا شَرِيكَ، وَالْفَرْدُ لَا نِدَّ لَكَ، كُلُّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَكَ، لَنْ تُطَاعَ إِلَّا بِإِذْنِكَ، وَلَنْ تُعْصَى إِلَّا بِعِلْمِكَ، تُطَاعُ فَتُشْكَرُ، وَتُعْصَى فَتُغْفَرُ، أَقْرَبُ شَـهِيدٌ، وَأَدْنَى حَفِيظٌ، حَلَتْ دُونَ النُّفُوسِ، وَأَخَذَتْ بِالنَّوَاصِي، وَكَتَبَتْ الْآثَارَ، وَنَسَخَتْ الْآجَالَ، الْقُلُوبُ لَكَ مَفْضِيَةٌ، وَالسِّرُّ عِندَكَ عَلَانِيَةٌ، الْحَلَالُ مَا أَحْلَلْتَ، وَالْحَرَامُ مَا حَرَّمْتَ، وَالدِّينُ مَا شَرَعْتَ، وَالْأَمْرُ مَا قَضَيْتَ، الْخَلْقَ خَلْقَكَ، وَالْعَبْدُ عَبْدُكَ، وَأَنتَ اللَّـهُ الرَّؤُوفُ الرَّحِيمُ، أَسْأَلُكَ بِنُورِ وَجْهِكَ الَّذِي أَشْرَقَ لَهُ السَّمَاوَاتُ وَالْأَرْضُ، وَبِكُلِّ حَقٍّ هُوَ لَكَ، وَبِحَقِّ السَّائِلِينَ عَلَيْكَ، أَنْ تَقِيلَنِي فِي هَذِهِ الْغَدَاةِ، وَفِي هَذِهِ الْعَشِيَّةِ، وَأَنْ تَجِيرَنِي مِنَ النَّارِ بِقُدْرَتِكَ ",
    originalDocumentText:
      "أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ، وَأَحَقُّ مِنْ عَبْدٍ، وَانْصُرْ مَنِ ابْتَغَى، وَأَرْأَفُ مِنْ مَلِكٍ، وَأَجْوَدُ مِنْ سُئِلَ، وَأَوْسَعُ مِنْ أَعْطَى أَنْتَ الْمَالِكُ لَا شَرِيكَ، وَالْفَرْدُ لَا نِدَّ لَكَ، كُلُّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَكَ، لَنْ تُطَاعَ إِلَّا بِإِذْنِكَ، وَلَنْ تُعْصَى إِلَّا بِعِلْمِكَ، تُطَاعُ فَتُشْكَرُ، وَتُعْصَى فَتُغْفَرُ، أَقْرَبُ شَـهِيدٌ، وَأَدْنَى حَفِيظٌ، حَلَتْ دُونَ النُّفُوسِ، وَأَخَذَتْ بِالنَّوَاصِي، وَكَتَبَتْ الْآثَارَ، وَنَسَخَتْ الْآجَالَ، الْقُلُوبُ لَكَ مَفْضِيَةٌ، وَالسِّرُّ عِندَكَ عَلَانِيَةٌ، الْحَلَالُ مَا أَحْلَلْتَ، وَالْحَرَامُ مَا حَرَّمْتَ، وَالدِّينُ مَا شَرَعْتَ، وَالْأَمْرُ مَا قَضَيْتَ، الْخَلْقَ خَلْقَكَ، وَالْعَبْدُ عَبْدُكَ، وَأَنتَ اللَّـهُ الرَّؤُوفُ الرَّحِيمُ، أَسْأَلُكَ بِنُورِ وَجْهِكَ الَّذِي أَشْرَقَ لَهُ السَّمَاوَاتُ وَالْأَرْضُ، وَبِكُلِّ حَقٍّ هُوَ لَكَ، وَبِحَقِّ السَّائِلِينَ عَلَيْكَ، أَنْ تَقِيلَنِي فِي هَذِهِ الْغَدَاةِ، وَفِي هَذِهِ الْعَشِيَّةِ، وَأَنْ تَجِيرَنِي مِنَ النَّارِ بِقُدْرَتِكَ ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Verified against the raw document.xml paragraph structure independently of the visual PDF rendering, after an initial visual scan raised a false concern about entry ordering; text and position both confirmed correct.",
    proposedCategory: "",
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "scholarly-review-required",
    primaryCollection:
      "Reported underlying source: al-Tabarani (al-Mu'jam al-Kabir; also cited as Kitab al-Du'a per a secondary corroborating source) — al-Tabarani's own original entry was not directly inspected in this pass. The complete Arabic wording was directly inspected in al-Haythami's recognised secondary classical compilation, Majma' al-Zawa'id (which quotes and evaluates reports from earlier collections, including al-Tabarani's), via a recognised classical-text hosting page (islamweb.net). Majma' al-Zawa'id is not al-Tabarani's own primary collection and is not described as such anywhere in this record.",
    primaryReference:
      "The complete sequence of all six MDR-003 research clauses (MDR-003-A through MDR-003-F) was located together in one quoted narration in al-Haythami's Majma' al-Zawa'id, there attributed to al-Tabarani and reported as narrated from Abu Umama al-Bahili from the Prophet ﷺ — a weak chain, per al-Haythami's own grading (see gradingAuthority). This is not the same as confirmation from al-Tabarani's own original entry, which was not directly inspected in this pass; the composite-clauses hypothesis is not supported by the located quotation, but original-source confirmation remains outstanding. contentClassification ('general-prophetic-supplication') describes the claimed genre and transmitted attribution as reported in this quotation, not an authenticated fact. See docs/dhikr/research/MDR-003-source-audit.md and src/lib/dhikr-research/audits/mdr-003-clause-map.ts for the clause-by-clause wording comparison — five of six clauses contain real wording variants from al-Haythami's quoted wording (only clause C matches it exactly); several variants change meaning, not merely orthography (e.g. 'لَا نِدَّ لَكَ' vs the quotation's 'لَا يَهْلِكُ'; 'النُّفُوسِ' vs 'الثُّغُورِ'; 'تَقِيلَنِي' vs 'تَقْبَلَنِي'; 'وَ' vs 'أَوْ' between the morning/evening references, left unresolved — see morningSpecificStatus).",
    secondaryReferences: [
      "islamqa.info (ar/answers/549819) — directly inspected secondary corroboration: an independent fatwa page directly fetched in this pass, discussing the same hadith's authenticity, confirming the same narrator (Fudail ibn Jubair, alternate spelling of Faddal ibn Jubair), the same weak verdict, and quoting the opening/closing wording (with an ellipsis for the middle) consistent with the fuller Majma' al-Zawa'id text.",
      "Usul.ai search 'اللهم أنت أحق من ذكر وأحق من عبد' located indexed classical hadith-commentary works discussing or quoting this hadith or closely related phrasing (Sharh Bulugh al-Maram, Subul al-Salam, Mir'at al-Mafatih Sharh Mishkat al-Masabih, and others) — secondary corroboration that this is a recognised, discussed (if weak) hadith in classical literature, not a modern fabrication; full context of these entries was not independently inspected beyond the search tool's summary — indexed, not directly read in full.",
      "Usul.ai search 'فضال بن جبير عن أبي أمامة' located indexed classical rijal-criticism works corroborating Faddal/Fudail ibn Jubair's weakness: Ibn 'Adi's al-Kamil fi Du'afa' al-Muhaddithin ('all his hadiths are unpreserved'), al-Dhahabi's al-Mughni fi al-Du'afa', and Ibn al-Mulaqqin's Mukhtasar Talkhis al-Dhahabi — surfaced via search index and summarized by the fetch tool; not read in full by a human or independently re-verified beyond that summary.",
      "Compilation provenance only, not the underlying source: al-Tabarani (d. 360 AH) significantly predates both Ibn al-Jazari's 'Amal al-Yawm wal-Layla/Hisn al-Hasin (d. 833 AH) and Sa'id al-Qahtani's modern Hisn al-Muslim — this hadith's inclusion (if any) in either compilation was not checked in this pass and is not being relied on as the source.",
    ],
    narrator:
      "Abu Umama al-Bahili (Companion), reported as narrating from the Prophet ﷺ — Prophetic attribution is recorded here as transmitted in a weak chain, not as an authenticated fact. Chain (per the secondary corroborating source): al-Abbas ibn al-Walid al-Narsi ← Hisham ibn Hisham al-Kufi ← Faddal/Fudail ibn Jubair ← Abu Umama. Al-Haythami states that Faddal ibn Jubair is weak and agreed upon as weak ('ضعيف مجمع على ضعفه'), directly inspected in his own text. This is separately corroborated by Ibn 'Adi's own, distinct criticism ('all his hadiths are unpreserved') and by rijal-criticism works surfaced (but not directly read in full) via Usul.ai search, including al-Dhahabi's al-Mughni fi al-Du'afa'. Al-Haythami's 'agreed upon' phrase is attributed here to al-Haythami's own statement, not converted into an independent claim of broader modern scholarly consensus.",
    sourceArabicWording:
      "اللهم أنت أحق من ذُكِر، وأحق من عُبِد، وأنصر من ابتُغِي، وأرأف من ملك، وأجود من سُئِل، وأوسع من أعطى، أنت الملك لا شريك لك، والفرد لا يهلك، كل شيء هالك إلا وجهك، لن تُطاع إلا بإذنك، ولن تُعصى إلا بعلمك، تُطاع فتشكر، وتُعصى فتغفر، أقرب شهيد، وأدنى حفيظ، حلت دون الثغور، وأخذت بالنواصي، وكتبت الآثار، ونسخت الآجال، القلوب لك مفضية، والسر عندك علانية، الحلال ما أحللت، والحرام ما حرمت، والدين ما شرعت، والأمر ما قضيت، والخلق خلقك، والعبد عبدك، وأنت الله الرءوف الرحيم. أسألك بنور وجهك الذي أشرقت له السماوات والأرض، بكل حق هو لك، وبحق السائلين عليك، أن تقبلني في هذه الغداة - أو في هذه العشية - وأن تجيرني من النار بقدرتك. Arabic wording transcribed from al-Haythami's quotation in Majma' al-Zawa'id, not independently checked against al-Tabarani's original collection. Not primary Arabic — it is a secondary compilation's quotation, directly inspected via a recognised classical-text hosting page (islamweb.net), content processed through this environment's fetch tooling rather than read as raw untouched source.",
    wordingMatchStatus: "materially-different",
    hadithGrading: "Da'if (weak)",
    gradingAuthority:
      "Al-Haythami states, in Majma' al-Zawa'id, that Faddal ibn Jubair is weak and agreed upon as weak: \"وفيه فضّال بن جبير، وهو ضعيف مجمع على ضعفه\" — directly inspected in al-Haythami's own text. This is separately corroborated, not merged into one claim: Ibn 'Adi's own distinct criticism (al-Kamil fi Du'afa' al-Muhaddithin: his ten [example] hadiths are 'غير محفوظة', unpreserved/unreliable) and islamqa.info's own citation of a consistent verdict on the same narrator (both directly inspected). Additional rijal-criticism works (al-Dhahabi's al-Mughni fi al-Du'afa', Ibn al-Mulaqqin's Mukhtasar Talkhis al-Dhahabi) were surfaced via Usul.ai search but summarized by the fetch tool rather than read in full — cited as indexed corroboration, not as independently re-verified primary reading.",
    gradingNotes:
      "Unlike MDR-001 and MDR-002, this record is not a composite of differently-graded components — the complete quoted narration in Majma' al-Zawa'id carries one grading verdict (da'if) covering all six clauses together, so hadithGrading/gradingAuthority are populated at the record level rather than left empty. This is al-Haythami's grading of the quotation he presents, not an independently re-derived grading of al-Tabarani's original entry, which was not directly inspected. This does not mean the record is scholarly-final: the numerous clause-level wording variants (see primaryReference, and the full detail in src/lib/dhikr-research/audits/mdr-003-clause-map.ts) still require scholarly judgment on whether MDR-003's specific wording reflects source-document transcription drift, a transmission variant, edition variation, or unresolved error — no explanation is asserted as correct here.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence:
      "Not populated: al-Haythami's quoted wording is a first-person petition ('I ask You... that You pardon/accept me... and save me from the Fire') rather than a third-person promise of virtue for reciting it (contrast MDR-002's explicit 'nothing will harm him'). No 'whoever recites this will receive X' framing was found in this quotation, and none is inferred from the supplication wording itself.",
    sourceUrls: [
      "https://islamqa.info/ar/answers/549819",
      "https://www.islamweb.net/ar/library/content/87/17253/",
    ],
    usulAiResearchNotes:
      "Search 1 (Arabic): 'اللهم أنت أحق من ذكر وأحق من عبد' — returned commentary/sharh works quoting or discussing this hadith: Sharh Bulugh al-Maram (al-Khudayr) vol. 2 p.213; Subul al-Salam (al-San'ani) vol. 7 p.3169 and vol. 1 p.109; al-Tabsira li'l-Lakhmi vol. 3 p.191 (full Arabic text with grammatical analysis, per the search tool's summary); Mir'at al-Mafatih Sharh Mishkat al-Masabih (al-Mubarakfuri) vol. 1 p.269 (complete text with commentary); Tuhfat al-Dhakirin (al-Shawkani) vol. 5 p.41; Masabih al-Jami' (al-Damamini) vol. 1 p.199. These are secondary commentary works, not al-Tabarani's own primary page — full context/attribution-explicitness of each was not independently verified beyond the search tool's summary; indexed classical commentary located, treated as corroboration that this hadith is recognised in classical literature, not as primary-source confirmation. Search 2 (Arabic): 'فضال بن جبير عن أبي أمامة' — returned indexed classical rijal-criticism works: Ibn 'Adi's al-Kamil fi Du'afa' al-Muhaddithin vol. 6 p.21, vol. 7 p.131, vol. 8 p.586 (entry 1568); al-Dhahabi's al-Mughni fi al-Du'afa' vol. 2 p.510 (entry 4904, narrator-reliability assessment); Ibn al-Mulaqqin's Mukhtasar Talkhis al-Dhahabi vol. 1 p.463 (entry 156); al-Sudasiyyat by al-Farawi vol. 1 p.81 (entry 24). These are surfaced via search index and summarized by the fetch tool, not directly read in full — cited as corroboration via a different literature genre than Search 1's commentary works, not as independently re-verified primary reading. Neither search surfaced al-Tabarani's own al-Mu'jam al-Kabir or Kitab al-Du'a as a directly browsable primary entry with its own hadith number in this pass — remaining for a human researcher: locate and directly inspect al-Tabarani's own original text via Usul.ai's book-browse feature (rather than keyword search) or a recognised print edition.",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    editorialNotes:
      "MDR-003 was initially assumed to be a composite of independently-sourced clauses, given its length and apparent thematic shifts. The complete Arabic wording was directly inspected in al-Haythami's recognised secondary classical compilation, Majma' al-Zawa'id — not al-Tabarani's own primary collection, which was not directly inspected. The complete sequence of all six MDR-003 clauses was located together, in the same broad order, in one quoted narration there; the composite-clauses hypothesis is not supported by this quotation, but confirmation from al-Tabarani's original entry remains outstanding, so this is not described as 'proven' or 'confirmed directly from al-Tabarani' anywhere in this record. contentClassification was accordingly changed from the default 'composite-text' to 'general-prophetic-supplication' — this describes the claimed genre and reported attribution as transmitted in a weak chain, not an authenticated fact. morningSpecificStatus is kept at 'uncertain' (not changed to 'morning-and-evening'): the enum's documented meaning is whether a record is 'confirmed to belong' in a morning-specific list, and that confirmation is not present here — the only evidence is (a) Majma' al-Zawa'id's chapter placement and (b) a morning/evening reference inside the quotation itself that contains an unresolved 'وَ' (and) vs 'أَوْ' (or) variant between MDR-003's own document wording and al-Haythami's quotation, meaning even the exact textual claim about morning-and-evening usage is not settled. A broad usage association with morning/evening dhikr is plausible from the chapter context, but that is short of the 'confirmed' standard the field is documented to represent. The record remains scholarly-review-required, not verified, given the density of clause-level wording variants (five of six clauses; see src/lib/dhikr-research/audits/mdr-003-clause-map.ts) and because the underlying primary source (al-Tabarani) has not been directly inspected. Recommend scholarly review resolve: (a) whether MDR-003's specific variant wordings reflect transcription drift, a transmission variant, edition variation, or error, (b) whether a weak-chain narration should be included in the public Morning Dhikr collection regardless of wording, (c) the وَ/أَوْ timing-wording question, and (d) whether MDR-003 should be corrected, preserved as compilation wording, or excluded — the portal must not silently replace MDR-003's document wording with al-Haythami's quoted wording. See docs/dhikr/research/MDR-003-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
  },
  {
    sequenceNumber: 4,
    internalId: "MDR-004",
    openingArabicWords: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ",
    fullArabicText:
      " لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ وَسَعْدَيْكَ، وَالْخَيْرُ فِي يَدَيْكَ، وَمِنْكَ وَإِلَيْكَ، اللَّهُمَّ مَا قُلْتُ مِنْ قَوْلٍ أَوْ حَلَفْتُ مِنْ حَلَفٍ أَوْ نَذَرْتُ مِنْ نَذْرٍ، فَمَشِيئَتُكَ بَيْنَ يَدَي ذَلِكَ كُلِّهِ، مَا شِئْتَ كَانَ وَمَا لَمْ تَشَأْ لَمْ يَكُنْ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِكَ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ مَا صَلَّيْتُ مِنْ صَلَاةٍ فَعَلَى مَنْ صَلَّيْتَ، وَمَا لَعَنْتُ مِنْ لَعْنٍ فَعَلَى مَنْ لَعَنْتَ، إِنَّكَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ، تَوَفَّنِي مُسْلِمًا وَالْحِقْنِي بِالصَّالِحِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الرِّضَا بَعْدَ الْقَضَاءِ، وَبَرْدَ الْعَيْشِ بَعْدَ الْمَوْتِ، وَلَذَّةِ النَّظَرِ إِلَى وَجْهِكَ، وشوقا إِلَى لِقَائِكَ، مِنْ غَيْرِ ضَرَّاءَ مُضِرَّةٍ، وَلَا فِتْنَةً مُضِلَّةً، وَأَعُوذُ بِكَ أَنْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَعْتَدِي أَوْ يُعْتَدَى عَلَيَّ، أَوْ أَكْسِبَ خَطِيئَةً، أَوْ ذَنبًا لَا يَغْفِرُ، اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، ذَا الْجَلاَلِ وَالْإِكْرَامِ، فَإِنِّي أَعْهَدُ إِلَيْكَ فِي هَذِهِ الْحَيَاةِ الدُّنْيَا وَأَشْهَدُكَ، وَكَفَى بِكَ شهيدا، أَنَّي أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ، لَا شَرِيكَ لَكَ، لَكَ الْمَلْكُ وَلَكَ الْحَمْدُ، وَأَنتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، وَأَشْهَدُ أَنَّ مُحَمَّدًا ﷺ عَبْدُكَ وَرَسُولُكَ، وَأَشْهَدُ أَنَّ وَعْدَكَ حَقٌّ، وَلِقَاءُكَ حَقٌّ، وَالسَّاعَةُ آتِيَةٌ لَا رَيْبَ فِيهَا، وَأَنَّكَ تَبْعَثُ مَن فِي الْقُبُورِ، وَأَنَّكَ إِنْ تَكِلِينِي إِلَى نَفْسِي تَكِلْنِي إِلَى ضُعْفٍ وَذَنبٍ وَخَطِيئَةٍ، وَإِنِّي لَا أَثِقُ إِلَّا بِرَحْمَتِكَ فَاغْفِرْ لِي ذُنُوبِي كُلَّهَا، إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنتَ، وَتُبْ عَلَيَّ إِنَّكَ أَنتَ التَّوَابُ الرَّحِيمُ",
    originalDocumentText:
      " لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ وَسَعْدَيْكَ، وَالْخَيْرُ فِي يَدَيْكَ، وَمِنْكَ وَإِلَيْكَ، اللَّهُمَّ مَا قُلْتُ مِنْ قَوْلٍ أَوْ حَلَفْتُ مِنْ حَلَفٍ أَوْ نَذَرْتُ مِنْ نَذْرٍ، فَمَشِيئَتُكَ بَيْنَ يَدَي ذَلِكَ كُلِّهِ، مَا شِئْتَ كَانَ وَمَا لَمْ تَشَأْ لَمْ يَكُنْ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِكَ، إِنَّكَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ مَا صَلَّيْتُ مِنْ صَلَاةٍ فَعَلَى مَنْ صَلَّيْتَ، وَمَا لَعَنْتُ مِنْ لَعْنٍ فَعَلَى مَنْ لَعَنْتَ، إِنَّكَ وَلِيِّي فِي الدُّنْيَا وَالْآخِرَةِ، تَوَفَّنِي مُسْلِمًا وَالْحِقْنِي بِالصَّالِحِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الرِّضَا بَعْدَ الْقَضَاءِ، وَبَرْدَ الْعَيْشِ بَعْدَ الْمَوْتِ، وَلَذَّةِ النَّظَرِ إِلَى وَجْهِكَ، وشوقا إِلَى لِقَائِكَ، مِنْ غَيْرِ ضَرَّاءَ مُضِرَّةٍ، وَلَا فِتْنَةً مُضِلَّةً، وَأَعُوذُ بِكَ أَنْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَعْتَدِي أَوْ يُعْتَدَى عَلَيَّ، أَوْ أَكْسِبَ خَطِيئَةً، أَوْ ذَنبًا لَا يَغْفِرُ، اللَّهُمَّ فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، ذَا الْجَلاَلِ وَالْإِكْرَامِ، فَإِنِّي أَعْهَدُ إِلَيْكَ فِي هَذِهِ الْحَيَاةِ الدُّنْيَا وَأَشْهَدُكَ، وَكَفَى بِكَ شهيدا، أَنَّي أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ وَحْدَكَ، لَا شَرِيكَ لَكَ، لَكَ الْمَلْكُ وَلَكَ الْحَمْدُ، وَأَنتَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، وَأَشْهَدُ أَنَّ مُحَمَّدًا ﷺ عَبْدُكَ وَرَسُولُكَ، وَأَشْهَدُ أَنَّ وَعْدَكَ حَقٌّ، وَلِقَاءُكَ حَقٌّ، وَالسَّاعَةُ آتِيَةٌ لَا رَيْبَ فِيهَا، وَأَنَّكَ تَبْعَثُ مَن فِي الْقُبُورِ، وَأَنَّكَ إِنْ تَكِلِينِي إِلَى نَفْسِي تَكِلْنِي إِلَى ضُعْفٍ وَذَنبٍ وَخَطِيئَةٍ، وَإِنِّي لَا أَثِقُ إِلَّا بِرَحْمَتِكَ فَاغْفِرْ لِي ذُنُوبِي كُلَّهَا، إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنتَ، وَتُبْ عَلَيَّ إِنَّكَ أَنتَ التَّوَابُ الرَّحِيمُ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Verified against the raw document.xml paragraph structure independently of the visual PDF rendering, after an initial visual scan raised a false concern about entry ordering; text and position both confirmed correct. Source document leaves the words \"وشوقا\" and \"شهيدا\" undiacritized mid-paragraph while the rest of the paragraph is fully vocalized; transcribed exactly as it appears, not corrected.",
    proposedCategory: "",
    contentClassification: "composite-text",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Provisional source leads only — no primary hadith page or recognised classical compilation was directly inspected in this pass. See src/lib/dhikr-research/audits/mdr-004-clause-map.ts for the full clause-by-clause breakdown. Clauses A-C are reported in secondary/indexed material as connected to a narration from Zayd ibn Thabit, with leads to Musnad Ahmad, al-Hakim's al-Mustadrak, al-Tabarani, and al-Bayhaqi's Kitab al-Asma wa al-Sifat. Clause D is reported as connected to an Ammar ibn Yasir narration in an-Nasa'i. Clause E is reported as connected to an Ibn Mas'ud narration with leads to Abu Dawud 5067, Tirmidhi 3392, and Ahmad. None of these original entries was directly inspected. Clause F has no confirmed source.",
    primaryReference:
      "No single source has been confirmed to contain the whole MDR-004 text. MDR-004 is provisionally classified as composite-text: structural analysis (six grammatically distinct clauses) and distinct reported source leads strongly suggest it combines material associated with several narrations, but the composite conclusion remains provisional until the named source texts are directly inspected and compared — a grammatical boundary does not itself prove a separate narration, and no separate origin is treated as confirmed merely because different search results were found. Clauses A-C have a reported source lead (an indexed/secondary description of a hadith taught to Zayd ibn Thabit, with reported morning-specific wording not directly verified, and reportedly differing assessments from Ibn al-Jawzi and al-Haythami, neither directly inspected). Clause D has a reported source lead (an Ammar ibn Yasir narration in an-Nasa'i, reported as having a sound chain — this characterisation itself is unverified). Clause E has a reported source lead (an Ibn Mas'ud narration, with reported morning-and-evening wording not directly verified, and a reported chain disconnection, not directly inspected). Clause F remains unsourced — a single unverified mirror-site lead was noted but is not treated as a confirmed source. contentClassification ('composite-text') describes a provisional classification, not an authenticated fact.",
    secondaryReferences: [
      "Zayd ibn Thabit component: a modern takhrij (sourcing) article on alukah.net is reported, via search snippet, to quote differing gradings (an Ibn al-Jawzi statement, and a claim attributed to al-Bukhari using the phrase 'منكر الحديث') — the article itself is inaccessible (direct WebFetch returned HTTP 403 in this environment); its content is known only via a Google-indexed search snippet, not direct inspection. Whether 'منكر الحديث' refers to the narration itself or to a specific narrator in its chain is unresolved and must not be assumed either way without inspecting the original passage.",
      "Zayd ibn Thabit component: dorar.net's Mawsu'ah Hadithiyyah (an indexed secondary discussion) has an entry reporting a closely matching hadith attributed to al-Bayhaqi's Kitab al-Asma wa al-Sifat, narrated from Zayd ibn Thabit — dorar.net itself is inaccessible (direct WebFetch returned HTTP 403); known only via search snippet.",
      "Ammar ibn Yasir component (clause D): no sunnah.com-scoped search in this pass surfaced a specific an-Nasa'i hadith number; this remains an indexed attribution requiring direct inspection.",
      "Ibn Mas'ud component (clause E): islamweb.net fatawa pages ('درجة حديث أيعجز أحدكم...', 'رتبة حديث اللهم فاطر السموات والأرض عالم') and islamqa.info ('حديث اتخاذ العهد عند الله') are candidate secondary discussions of this hadith's grading, located via search index, but were not directly fetched in this pass — indexed leads requiring direct inspection.",
      "Compilation provenance only, not the underlying source: neither Hisn al-Muslim nor Hisn al-Hasin's own inclusion (or non-inclusion) of any component of MDR-004 was checked in this pass.",
    ],
    narrator:
      "Three reported Companion narrators for three distinct clause groups, none verified in an underlying collection: (1) clauses A-C — reported as attributed to Zayd ibn Thabit; (2) clause D — reported as attributed to Ammar ibn Yasir; (3) clause E — reported as attributed to Abdullah ibn Mas'ud. These are search-indexed source-lead attributions, not confirmed narrator chains. Clause F has no reported narrator located in this pass.",
    sourceArabicWording: "",
    wordingMatchStatus: "unresolved",
    hadithGrading: "",
    gradingAuthority: "",
    gradingNotes:
      "Left empty at the record level: MDR-004's provisional composite structure involves several distinct reported source leads, plus one unsourced block — no single grading value could honestly represent this record, and no component's own grading has been directly inspected in this pass. Per-component summary, all reported through inaccessible or indexed secondary material, not direct inspection: Zayd ibn Thabit component — an Ibn al-Jawzi statement ('لا يثبت', not established) and an al-Haythami route-specific assessment (one of al-Tabarani's two routes reportedly has trustworthy narrators, the rest reportedly contain the weak Abu Bakr ibn Abi Maryam) are reported as differing assessments through an inaccessible takhrij article — recorded as a reported disagreement, not a directly-inspected one, and not harmonised into a single verdict. Ammar ibn Yasir component — reported as having a sound chain only; grading authority and exact formulation are unverified, and this is not treated as a settled fact. Ibn Mas'ud component — a chain disconnection (inqita') is reported, not a blanket weak-narrator claim; collection references remain unverified, and no final weak grading is claimed without inspecting the relevant source or grading discussion. Clause F — no grading possible; no source is confirmed.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence:
      "Not populated: every identified clause of MDR-004 reads as a first-person petition, oath-related declaration, or testimony formula, not a third-person 'whoever recites this will receive X' promise. No virtue or reward claim is inferred from this petition/testimony wording itself, per instruction.",
    sourceUrls: [],
    usulAiResearchNotes:
      "Search 1 (Arabic): 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ وَسَعْدَيْكَ وَالْخَيْرُ فِي يَدَيْكَ' — returned classical commentary/reference works mentioning fragments of the phrase (Umdat al-Ahkam min Kalam Khayr al-Anam by Abd al-Ghani al-Maqdisi; Al-Tawdih li-Sharh al-Jami al-Sahih by Ibn al-Mulaqqin, vol. 2 p.235, hadith 727; Al-Muntakhab min Musnad Abd ibn Humayd, vol. 1 p.122; Musnad al-Imam al-Shafi'i, vol. 1 p.176; Al-Aqida fi Allah by Umar Sulayman al-Ashqar, entry 2551; Mishkat al-Masabih; Sharh Sunan Ibn Majah by al-Athiyubi, vol. 100 p.12; Sharh Sunan Abi Dawud by al-Abbad, vol. 9 p.103, entry 3580) — none of these confirmed as the specific Zayd ibn Thabit narration; most discuss the standard Hajj Talbiyah or Ibn Umar's addition to it, a related but distinct textual tradition, and are recorded as candidate underlying collections requiring direct inspection, not confirmed sources. No result gave a direct, individually-citable primary hadith page with full Arabic text and its own grading for the Zayd ibn Thabit version specifically. Remaining for a human researcher: directly inspect Ahmad's Musnad, al-Hakim's al-Mustadrak, al-Tabarani, and al-Bayhaqi's Kitab al-Asma wa al-Sifat for the Zayd ibn Thabit hadith; directly inspect an-Nasa'i for the Ammar ibn Yasir dua; directly inspect Abu Dawud 5067, Tirmidhi 3392, and Ahmad no. 51 for the Ibn Mas'ud covenant hadith; and attempt to locate a reliable source for clause F, or classify it as currently unsourced, including verifying the unconfirmed al-Tabarani mirror lead (hadithunlocked.com, tabarani:4803) against an original or recognised edition. General note: Usul.ai's search results for this record, as for MDR-001-003, skewed toward classical commentary/jurisprudential works rather than granular per-hadith primary pages with explicit grading.",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    editorialNotes:
      "MDR-004 (1697 characters, the longest entry in the register) was not assumed in advance to be one hadith, a composite text, an exact narration, a Prophetic supplication, or morning-specific — each was to be determined from evidence. Structural analysis and distinct source leads strongly suggest that MDR-004 combines material associated with several narrations (Zayd ibn Thabit; Ammar ibn Yasir; Abdullah ibn Mas'ud) plus one block (clause F, roughly the final quarter of the text) for which no source has been confirmed — but this composite picture remains provisional: no primary hadith page or recognised classical compilation was directly inspected in this pass (dorar.net and alukah.net, which appear to hold directly relevant discussion, both returned HTTP 403 to direct fetch), so segmentation (which is structurally reliable, given exact reconstruction) must be distinguished from source attribution, which must in turn be distinguished from proof of separate origins. The E→F clause boundary in particular is a provisional source-analysis boundary, not a verified hadith boundary. contentClassification ('composite-text') and every attribution recorded in this stage describe a provisional classification and reported/indexed sourcing only. morningSpecificStatus is kept 'uncertain' at the record level: reported (not directly verified) timing wording differs across components, and the record is not marked morning-specific merely because some of its clauses report morning-specific wording. sourceResearchStatus is kept 'in-progress', not 'scholarly-review-required', because key source evidence remains inaccessible — narrator, timing, grading, and references currently rely on search snippets, indexed leads, or secondary synthesis, not direct inspection; the status may move to 'scholarly-review-required' once the source texts and grading evidence named in the manual verification checklist have been directly inspected. Recommend scholarly review only after that direct inspection: (a) directly inspect all four collections named for the Zayd ibn Thabit component and resolve the reported Ibn al-Jawzi/al-Haythami disagreement; (b) directly inspect an-Nasa'i for the Ammar ibn Yasir component; (c) directly inspect Abu Dawud 5067/Tirmidhi 3392/Ahmad no. 51 for the Ibn Mas'ud component; (d) locate a reliable source for clause F or classify it as currently unsourced; (e) decide whether MDR-004 should be split, corrected, preserved as compilation wording, or excluded. See docs/dhikr/research/MDR-004-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
  },
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-005-source-audit.md
    // for the full research trail behind every field below.
    sequenceNumber: 5,
    internalId: "MDR-005",
    openingArabicWords: "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْكِبْرِيَاءِ",
    fullArabicText:
      "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْكِبْرِيَاءِ وَالْعَظْمَةِ وَالْخَلْقِ وَالْأَمْرِ وَاللَّيْلِ وَالنَّهَارِ وَمَا يُضْحَى فِيهِمَا لِلَّهِ وَحْدَهُ، اللَّهُمَّ اجْعَلْ أَوَّلَ هَذَا النَّهَارِ صَلَاحًا وَأَوْسَطَهُ فَلَاحًا وَآخِرَهُ نَجَاحًا أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ",
    originalDocumentText:
      "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْكِبْرِيَاءِ وَالْعَظْمَةِ وَالْخَلْقِ وَالْأَمْرِ وَاللَّيْلِ وَالنَّهَارِ وَمَا يُضْحَى فِيهِمَا لِلَّهِ وَحْدَهُ، اللَّهُمَّ اجْعَلْ أَوَّلَ هَذَا النَّهَارِ صَلَاحًا وَأَوْسَطَهُ فَلَاحًا وَآخِرَهُ نَجَاحًا أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    contentClassification: "unclassified",
    morningSpecificStatus: "morning-only",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "No primary hadith collection page was directly inspected in this pass — sunnah.com/mishkat:2414 returned HTTP 403, and a direct usul.ai per-hadith page attempt (usul.ai/t/mishkat-masabih/2414) returned HTTP 404. A directly-fetched Usul.ai search-results index page associates closely related declaration-plus-petition wording with several classical works via indexed metadata only (title/author/volume-page/hadith-number/matched-phrase — not full primary-page text): Mishkat al-Masabih (al-Tabrizi), Mirqat al-Mafatih sharh Mishkat al-Masabih (al-Mulla 'Ali al-Qari, vol. 14, p. 107), al-Matalib al-'Aliyya bi-Zawa'id al-Masanid al-Thamaniyya (Ibn Hajar al-'Asqalani), 'Amal al-Yawm wa'l-Layla (Ibn al-Sunni), al-Muntakhab min Musnad 'Abd ibn Humayd, Takhrij Ahadith Ihya' 'Ulum al-Din (al-'Iraqi), and Subul al-Huda wa'l-Rashad (al-Salihi al-Shami). None of these is treated as a confirmed primary source — see src/lib/dhikr-research/audits/mdr-005-clause-map.ts, IBN_ABI_AWFA_COMBINED_SOURCE, for the full labelling.",
    primaryReference:
      "No single confirmed hadith or entry number. Indexed cross-references only, none directly confirmed by opening the corresponding primary page: Mishkat al-Masabih hadith 38 (al-Tabrizi's own numbering; commonly cross-referenced as hadith 2414 in commentary editions) and Ibn Hajar's al-Matalib al-'Aliyya, indexed as hadith 2414 by the same search tool (that numbering scheme was not independently confirmed to align with Mishkat's).",
    secondaryReferences: [
      "islamweb.net/ar/fatwa/437644/ (directly inspected via WebFetch) — modern takhrij discussion relaying al-Hafiz al-'Iraqi's grading 'إسناده ضعيف' for a closely related 'صلاحا...فلاحا...نجاحا' wording (quoted there as 'اللَّهُمَّ اجْعَلْ أَوَّلَ يَوْمِنَا هَذَا صَلَاحًا...', not MDR-005's 'أَوَّلَ هَذَا النَّهَارِ'), citing 'Abd ibn Humaid (al-Muntakhab) and al-Tabarani, and explicitly scoping this finding to the wording up to 'نجاحا' only.",
      "islamweb.net/ar/fatwa/103482/ (directly inspected via WebFetch) — checked specifically for MDR-005's closing phrase 'أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ'; confirmed this phrase does not appear on that page.",
    ],
    narrator:
      "Reported: 'Abdullah ibn Abi Awfa, via Abu al-Warqa' — a search-indexed attribution (Mishkat al-Masabih and its commentaries), not a directly-inspected or confirmed narrator chain. A WebSearch synthesis additionally framed this as something the Prophet ﷺ said specifically upon entering the morning; that framing was not directly verified against any primary page in this pass and is reported, not confirmed.",
    sourceArabicWording: "",
    wordingMatchStatus: "unresolved",
    hadithGrading: "",
    gradingAuthority: "",
    gradingNotes:
      "Left empty at the record level: no single grading value can honestly represent MDR-005, because the only directly-inspected grading discussion located (islamweb.net fatwa 437644, relaying al-Hafiz al-'Iraqi's 'إسناده ضعيف' via 'Abd ibn Humaid and al-Tabarani) explicitly scopes itself to a closely related wording only up to 'نجاحا' — covering clause A and the first part of clause B — and does not address MDR-005's closing phrase 'أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ', which remains unsourced and ungraded. That fatwa's own quoted wording ('يَوْمِنَا هَذَا') also differs lexically from MDR-005's ('هَذَا النَّهَارِ'), so it is not certain this is even the same underlying report rather than a closely related one. al-'Iraqi's own Takhrij Ahadith al-Ihya' was not directly inspected — only a modern fatwa's relay of it. See src/lib/dhikr-research/audits/mdr-005-clause-map.ts for the full per-clause breakdown.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence:
      "Not populated: clause B's request that Allah make the day's beginning/middle/end good is the content of the petition itself, not a stated promise of reward or protection for reciting it. No virtue or reward claim is inferred from a petition's own content, per instruction.",
    sourceUrls: [
      "https://www.islamweb.net/ar/fatwa/437644/",
      "https://www.islamweb.net/ar/fatwa/103482/",
    ],
    usulAiResearchNotes:
      "Search 1 (usul.ai/search, Arabic): 'أصبحنا وأصبح الملك لله والكبرياء' — returned an indexed results page (directly fetched) listing: (1) Mirqat al-Mafatih sharh Mishkat al-Masabih (al-Mulla 'Ali al-Qari), vol. 14 p. 107, hadith 2414, matched phrase 'أصبحنا وأصبح الملك لله والكبرياء والعظمة والخلق والليل والنهار' (no 'والحمد لله'); (2) al-Matalib al-'Aliyya bi-Zawa'id al-Masanid al-Thamaniyya (Ibn Hajar al-'Asqalani), hadith 2414, matched phrase 'أصبحنا وأصبح الملك لله والحمد لله والكبرياء' (includes 'والحمد لله'); (3) Mishkat al-Masabih (al-Tabrizi), hadith 38, narrator chain 'Ibn Abi Awfa via Abu al-Warqa'', matched phrase 'أصبحنا وأصبح الملك لله عز وجل والحمد لله والكبرياء' (includes 'عز وجل' and 'والحمد لله'); (4)-(7) further listed without full detail: 'Amal al-Yawm wa'l-Layla (Ibn al-Sunni), Takhrij Ahadith Ihya' 'Ulum al-Din (al-'Iraqi), al-Muntakhab min Musnad 'Abd ibn Humayd, Subul al-Huda wa'l-Rashad. For every item, the tool reported 'full context visible' on the search-results page itself, but no individual permalink URL could be extracted from the page (confirmed by a follow-up fetch asking specifically for href values — none were returned), so no single primary page could be opened and read directly; this is recorded as an indexed-lead result, not a direct-inspection result, for all seven items. Attempting a direct hadith-number URL (usul.ai/t/mishkat-masabih/2414) returned HTTP 404. Whether full context was inspected: no, for all items (index/snippet only). Whether attribution was explicit: yes for items 1-3 (Ibn Abi Awfa named); not confirmed for items 4-7. Source type: classical hadith commentary / classical hadith collection (indexed only). Confidence: low-to-moderate (consistent classical-work citations, but no primary text independently confirmed, and item wording disagrees on 'والحمد لله'). Remaining verification: directly open Mishkat al-Masabih hadith 38/2414, Mirqat al-Mafatih vol. 14 p. 107, and al-Matalib al-'Aliyya's own entry to resolve the 'والحمد لله' discrepancy and confirm or refute Ibn Abi Awfa as narrator.\n\nSearch 2 (WebFetch, Usul.ai search-results page, follow-up): requested raw href values for the same result set — none were returned ('The HTML source does not contain explicit hyperlink URLs... only text content and structural elements are visible'), confirming no individual primary-page permalink was accessible from this search UI in this pass.\n\nGeneral note: as for MDR-001 through MDR-004, Usul.ai's search results for this record skewed toward classical commentary/index metadata rather than a directly openable per-hadith primary page with full context and its own grading.",
    scholarlyReviewer: "",
    scholarlyDecision: "pending",
    editorialNotes:
      "MDR-005 (324 characters) was not assumed in advance to be one hadith, morning-specific, Prophetic, authentic, or independently sourced — each was to be determined from evidence. The record splits cleanly at a single comma into a declarative clause (A: Allah's exclusive dominion/attributes) and a petition clause (B: opening with the vocative 'اللَّهُمَّ') — see src/lib/dhikr-research/audits/mdr-005-clause-map.ts for the full breakdown. This structural segmentation is kept because the grammatical boundary is real and useful for research precision, but it does not by itself prove separate origins: indexed leads associate a closely related combined declaration-plus-petition wording with a single reported narration (Ibn Abi Awfa via Abu al-Warqa', per Mishkat al-Masabih and its commentaries), so both clauses may belong to one reported narration, and clause B's unsourced closing phrase may be an addition within that same clause rather than proof that the whole record combines independently-sourced components. Classification correction (narrow pass, superseding the initial Stage 3B classification): contentClassification was first recorded as 'composite-text', but on review that overstated the evidence — two unresolved wording questions (the 'وَالْحَمْدُ لِلَّهِ' disagreement in clause A; the unsourced closing phrase in clause B) show that source unity is unresolved, not that independent sourcing is established. Demonstrating a composite record requires showing at least two actually-established independently-sourced components, which has not been done here — one reported combined narration is a significant lead, not a settled multi-source finding. contentClassification is therefore recorded as 'unclassified'. Note on enum selection: neither 'uncertain' nor 'general-remembrance' exists as a value of ContentClassification in src/lib/dhikr-research/types.ts, and no new enum member has been added — 'unclassified' is the closest existing controlled value that does not assert a specific classification the evidence does not yet support. morningSpecificStatus is kept 'morning-only', supportable from the transcribed text's own explicit wording ('أَصْبَحْنَا' / 'أَوَّلَ هَذَا النَّهَارِ' — direct timing wording within the text itself, not merely a reported narrator-frame or a chapter heading); this describes the explicit timing of the transcribed text itself, not authentication of the reported narration, and not proof that no evening counterpart ('أَمْسَيْنَا') exists — no evening-parallel version of this specific wording was located in this pass, but this absence was not exhaustively verified. sourceResearchStatus is kept 'in-progress', not 'scholarly-review-required', because no primary hadith or classical-compilation page was itself directly opened and read in this pass (sunnah.com returned HTTP 403; a direct usul.ai per-hadith URL attempt returned HTTP 404) — narrator, exact hadith numbering, and the scope of the one directly-inspected grading (al-'Iraqi's 'إسناده ضعيف', via a modern fatwa, itself only covering a closely related wording up to 'نجاحا') remain indexed leads or partial-scope findings, not direct inspection of the primary or classical grading source, and complete source unity remains unresolved. A WebSearch synthesis claim attributing the 'الكبرياء والعظمة' wording to the Sahih Muslim/Ibn Mas'ud hadith was checked against that hadith's own indexed page title (dorar.net/hadith/sharh/20406, snippet-level only) and found unsupported — not relied upon. Possible explanations for the closing phrase — none preferred, none decided in this pass: a longer, unlocated version of the same reported narration; a recognised transmission variation; a later compilation addition; a later devotional extension; transcription drift; or an unresolved transcription/attribution error. Recommend scholarly review only after direct inspection of: (a) Mishkat al-Masabih hadith 38/2414 and Mirqat al-Mafatih vol. 14 p. 107, to resolve the 'وَالْحَمْدُ لِلَّهِ' discrepancy and confirm the Ibn Abi Awfa narrator chain; (b) al-'Iraqi's Takhrij Ahadith Ihya' 'Ulum al-Din directly, to confirm the weak-chain grading and its exact scope; (c) a further attempt to locate a source for the closing phrase 'أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ', or classify it as currently unsourced; (d) whether the 'Abd ibn Humaid/al-Tabarani weak report (fatwa 437644) and the Ibn Abi Awfa/Mishkat al-Masabih report are the same underlying narration; (e) once source unity is resolved one way or another, revisit contentClassification against the actual established relationship between clause A and clause B. See docs/dhikr/research/MDR-005-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
  },
  {
    sequenceNumber: 6,
    internalId: "MDR-006",
    openingArabicWords: "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
    fullArabicText:
      "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ الْمَلِكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ إِنِّي أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِن شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبْرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ ",
    originalDocumentText:
      "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ الْمَلِكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ إِنِّي أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِن شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبْرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 7,
    internalId: "MDR-007",
    openingArabicWords: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    fullArabicText: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النَّشُورُ",
    originalDocumentText: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النَّشُورُ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 8,
    internalId: "MDR-008",
    openingArabicWords: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ",
    fullArabicText:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ",
    originalDocumentText:
      "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Widely known as Sayyid al-Istighfar; transcribed exactly as it appears in the source document, not corrected or compared against a reference wording in this stage.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 9,
    internalId: "MDR-009",
    openingArabicWords: "اللَّهُمَّ إنِّي أصْبَحْتُ أُشْهِدُكَ",
    fullArabicText:
      "اللَّهُمَّ إنِّي أصْبَحْتُ أُشْهِدُكَ، وأُشْهِدُ حَمَلَةَ عَرْشِكَ، ومَلائِكَتَكَ، وجَميْعَ خَلْقِكَ، أنَّكَ أنْتَ اللهُ لا إلَهَ إلاَّ أنْتَ وَحْدَكَ لا شَرِيْكَ لَكَ، وأنَّ مُحَمَّدًا عَبْدُكَ ورَسُولُكَ 4x",
    originalDocumentText:
      "اللَّهُمَّ إنِّي أصْبَحْتُ أُشْهِدُكَ، وأُشْهِدُ حَمَلَةَ عَرْشِكَ، ومَلائِكَتَكَ، وجَميْعَ خَلْقِكَ، أنَّكَ أنْتَ اللهُ لا إلَهَ إلاَّ أنْتَ وَحْدَكَ لا شَرِيْكَ لَكَ، وأنَّ مُحَمَّدًا عَبْدُكَ ورَسُولُكَ 4x",
    sourceDocumentAnnotations: ["4x"],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
    repetitionCount: 4,
  },
  {
    sequenceNumber: 10,
    internalId: "MDR-010",
    openingArabicWords: "اللَّهُمَّ مَا أصْبَحَ بِي مِنْ نِعْمَةٍ",
    fullArabicText:
      "اللَّهُمَّ مَا أصْبَحَ بِي مِنْ نِعْمَةٍ، أوْ بِأحَدٍ مِنْ خَلقِكَ، فَمِنْكَ وَحْدَكَ لا شَرِيْكَ لَكَ، فَلَكَ الحَمْدُ ولَكَ الشُّكْرُ",
    originalDocumentText:
      "اللَّهُمَّ مَا أصْبَحَ بِي مِنْ نِعْمَةٍ، أوْ بِأحَدٍ مِنْ خَلقِكَ، فَمِنْكَ وَحْدَكَ لا شَرِيْكَ لَكَ، فَلَكَ الحَمْدُ ولَكَ الشُّكْرُ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 11,
    internalId: "MDR-011",
    openingArabicWords: "اللَّهُمَّ عَافِنِي فِي بَدَنِي",
    fullArabicText:
      "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْت، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ لَا إِلَهَ إِلَّا أَنْتَ 3x ",
    originalDocumentText:
      "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْت، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ لَا إِلَهَ إِلَّا أَنْتَ 3x ",
    sourceDocumentAnnotations: ["3x"],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
    repetitionCount: 3,
  },
  {
    sequenceNumber: 12,
    internalId: "MDR-012",
    openingArabicWords: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    fullArabicText:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    originalDocumentText:
      "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 13,
    internalId: "MDR-013",
    openingArabicWords: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَالْهَرَمِ",
    fullArabicText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَالْهَرَمِ، وَسُوءِ الْكِبَرِ، وَفِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ",
    originalDocumentText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَالْهَرَمِ، وَسُوءِ الْكِبَرِ، وَفِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 14,
    internalId: "MDR-014",
    openingArabicWords: "حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ",
    fullArabicText: "حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ العَرْشِ العَظِيمِ 7x",
    originalDocumentText: "حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ العَرْشِ العَظِيمِ 7x",
    sourceDocumentAnnotations: ["7x"],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
    repetitionCount: 7,
  },
  {
    sequenceNumber: 15,
    internalId: "MDR-015",
    openingArabicWords: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    fullArabicText:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي, وَدُنْيَايَ وَأَهْلِي وَمَالِي. اللَّهُمَّ اسْتُرْ عَوْرَتِي وَأَمِّنْ رَوْعَتِي. اللَّهُمَّ احْفَظْنِي مِن بَيْنِ يَدَيَّ وَمِن خَلْفِي, وَعَنْ يَمِينِي وَعَنْ شَمَالِي, وَمِن فَوْقِي, وَأَعُوذُ بِعَظْمَتِكَ أَنْ أُغْتَالَ مِن تَحْتِي",
    originalDocumentText:
      "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي, وَدُنْيَايَ وَأَهْلِي وَمَالِي. اللَّهُمَّ اسْتُرْ عَوْرَتِي وَأَمِّنْ رَوْعَتِي. اللَّهُمَّ احْفَظْنِي مِن بَيْنِ يَدَيَّ وَمِن خَلْفِي, وَعَنْ يَمِينِي وَعَنْ شَمَالِي, وَمِن فَوْقِي, وَأَعُوذُ بِعَظْمَتِكَ أَنْ أُغْتَالَ مِن تَحْتِي",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 16,
    internalId: "MDR-016",
    openingArabicWords: "اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ",
    fullArabicText:
      "اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ، فَاطِرَ السَّموَاتِ والأرْضِ، رَبَّ كُلِّ شَيءٍ ومَلِيْكَهُ، أشْهَدُ أنْ لا إلَهَ إلاَّ أنْتَ، أعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكهِ، وأنْ أقْتَرِفَ عَلَى نَفْسِي سُوءًا، أوْ أجُرَّهُ إلَى مُسْلِمٍ",
    originalDocumentText:
      "اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ، فَاطِرَ السَّموَاتِ والأرْضِ، رَبَّ كُلِّ شَيءٍ ومَلِيْكَهُ، أشْهَدُ أنْ لا إلَهَ إلاَّ أنْتَ، أعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكهِ، وأنْ أقْتَرِفَ عَلَى نَفْسِي سُوءًا، أوْ أجُرَّهُ إلَى مُسْلِمٍ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 17,
    internalId: "MDR-017",
    openingArabicWords: "رَضِينَا بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا",
    fullArabicText:
      "رَضِينَا بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا وَبِمُحَمَّدٍ رَسُولا | رضيت بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا وَبِمُحَمَّدٍ نَبيا 3x ",
    originalDocumentText:
      "رَضِينَا بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا وَبِمُحَمَّدٍ رَسُولا | رضيت بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا وَبِمُحَمَّدٍ نَبيا 3x ",
    sourceDocumentAnnotations: ["3x"],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Source document gives two wordings separated by \"|\" (رَضِينَا ... رَسُولا and رضيت ... نَبيا) as a single entry; both variants preserved verbatim, not merged or split. Which variant (or both) belongs in the final register is a Stage 3B research question.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
    repetitionCount: 3,
  },
  {
    sequenceNumber: 18,
    internalId: "MDR-018",
    openingArabicWords: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ",
    fullArabicText: " يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    originalDocumentText: " يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 19,
    internalId: "MDR-019",
    openingArabicWords: "أَصْبَحْنَا وَأصْبح الْملك لله",
    fullArabicText: "أَصْبَحْنَا وَأصْبح الْملك لله وَالْحَمْد لله لَا شريك لَهُ لَا إِلَه إِلَّا هُوَ وَإِلَيْهِ النشور ",
    originalDocumentText: "أَصْبَحْنَا وَأصْبح الْملك لله وَالْحَمْد لله لَا شريك لَهُ لَا إِلَه إِلَّا هُوَ وَإِلَيْهِ النشور ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Diacritization is lighter than in similar-looking neighbouring entries (compare entry 6); preserved exactly as it appears, not normalised to match other entries.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 20,
    internalId: "MDR-020",
    openingArabicWords: "أصَبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    fullArabicText:
      "أصَبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ، وَبَرَكَتَهُ، وهدأيه، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ",
    originalDocumentText:
      "أصَبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ، وَبَرَكَتَهُ، وهدأيه، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Contains the word \"وهدأيه\", which does not match standard spelling patterns seen elsewhere in the document and may be a source-document typo. Transcribed exactly as it appears; not corrected. Flagged for scholarly clarification in Stage 3B.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 21,
    internalId: "MDR-021",
    openingArabicWords: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ",
    fullArabicText:
      " أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ ",
    originalDocumentText:
      " أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 22,
    internalId: "MDR-022",
    openingArabicWords: "لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ",
    fullArabicText:
      "لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا إِلَهَ إِلَّا اللَّهُ لَا شَرِيكَ لَهُ لَا إِلَهَ إِلَّا اللَّهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ لَا إِلَهَ إِلَّا اللَّهُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    originalDocumentText:
      "لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا إِلَهَ إِلَّا اللَّهُ لَا شَرِيكَ لَهُ لَا إِلَهَ إِلَّا اللَّهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ لَا إِلَهَ إِلَّا اللَّهُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "No repetition marker is visible for this entry in the source document, unlike the closely related entry 23 immediately following it.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 23,
    internalId: "MDR-023",
    openingArabicWords: "لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ",
    fullArabicText: " لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ 10x",
    originalDocumentText: " لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ 10x",
    sourceDocumentAnnotations: ["10x"],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
    repetitionCount: 10,
  },
  {
    sequenceNumber: 24,
    internalId: "MDR-024",
    openingArabicWords: "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ",
    fullArabicText: "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    originalDocumentText: "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 25,
    internalId: "MDR-025",
    openingArabicWords: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ لَا قُوَّةَ إِلَّا بِاللَّهِ",
    fullArabicText:
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ لَا قُوَّةَ إِلَّا بِاللَّهِ مَا شَاءَ اللَّهُ كَانَ وَمَا لَمْ يَشَأْ لَمْ يَكُنْ أَعْلَمُ أَنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ وَأَنَّ اللَّهَ قَدْ أَحَاطَ بِكُلِّ شَيْءٍ عِلْمًا",
    originalDocumentText:
      "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ لَا قُوَّةَ إِلَّا بِاللَّهِ مَا شَاءَ اللَّهُ كَانَ وَمَا لَمْ يَشَأْ لَمْ يَكُنْ أَعْلَمُ أَنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ وَأَنَّ اللَّهَ قَدْ أَحَاطَ بِكُلِّ شَيْءٍ عِلْمًا",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 26,
    internalId: "MDR-026",
    openingArabicWords: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    fullArabicText: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ,  سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ 100x ",
    originalDocumentText: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ,  سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ 100x ",
    sourceDocumentAnnotations: ["100x"],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    ...unclaimedResearchFields(),
    repetitionCount: 100,
  },
  {
    sequenceNumber: 27,
    internalId: "MDR-027",
    openingArabicWords: "سُبْحَانَ اللَّهِ | الْحَمْدُ لِلَّهِ",
    fullArabicText: "سُبْحَانَ اللَّهِ  |  الْحَمْدُ لِلَّهِ | لَا إِلَٰهَ إِلَّا اللَّهُ مَائَةَ مَرَّةٍ اللَّهُ أَكْبَرُ 100x",
    originalDocumentText: "سُبْحَانَ اللَّهِ  |  الْحَمْدُ لِلَّهِ | لَا إِلَٰهَ إِلَّا اللَّهُ مَائَةَ مَرَّةٍ اللَّهُ أَكْبَرُ 100x",
    sourceDocumentAnnotations: ["100x", "مِائَةَ مَرَّةٍ (embedded in text: \"one hundred times\")"],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Contains the phrase \"مَائَةَ مَرَّةٍ\" (\"one hundred times\") within the transcribed text itself, in addition to the separate \"100x\" annotation; both consistently indicate the same document-supplied repetition count.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
    repetitionCount: 100,
  },
  {
    sequenceNumber: 28,
    internalId: "MDR-028",
    openingArabicWords: "المَسَاءُ فَقَطْ أَمْسَيْنَا وَأَمْسَى الْمَلِكُ لِلَّهِ",
    fullArabicText:
      "المَسَاءُ فَقَطْ أَمْسَيْنَا وَأَمْسَى الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ أَعُوذُ بِاللَّهِ الَّذِي يُمْسِكُ السَّمَاءَ أَن تَقَعَ عَلَى الْأَرْضِ إِلَّا بِإِذْنِهِ مِنْ شَرِّ مَا خَلَقَ وَذَرَأَ وَبَرَأَ",
    originalDocumentText:
      "المَسَاءُ فَقَطْ أَمْسَيْنَا وَأَمْسَى الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ أَعُوذُ بِاللَّهِ الَّذِي يُمْسِكُ السَّمَاءَ أَن تَقَعَ عَلَى الْأَرْضِ إِلَّا بِإِذْنِهِ مِنْ شَرِّ مَا خَلَقَ وَذَرَأَ وَبَرَأَ",
    sourceDocumentAnnotations: ["المَسَاءُ فَقَطْ (heading: \"Evening only\")"],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "Source document begins this entry with the heading \"المَسَاءُ فَقَطْ\" (\"Evening only\"), the only place in the document where a timing/category label is stated explicitly. Preserved verbatim as part of the transcribed text and separately recorded in sourceDocumentAnnotations and proposedCategory. morningSpecificStatus is nonetheless left as \"uncertain\" per the Stage 3A rule to keep all research fields unclaimed until formal review.",
    proposedCategory: "Evening",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 29,
    internalId: "MDR-029",
    openingArabicWords: ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ",
    fullArabicText:
      ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ وَصَلَّى رَكْعَتَيْنِ كَانَ لَهُ كَأَجْرِ حَجَّةٍ وَعُمَرَةٍ تَامَّةٍ كَمَا تَقَدَّمَ | وَيَقُولُ اللَّهُ تَعَالَى: يَا ابْنَ آدَمَ، ارْكَعْ لِي أَرْبَعَ رَكَعَاتٍ أَوَّلَ النَّهَارِ، أَكْفِكْ آخِرَهُ",
    originalDocumentText:
      ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ وَصَلَّى رَكْعَتَيْنِ كَانَ لَهُ كَأَجْرِ حَجَّةٍ وَعُمَرَةٍ تَامَّةٍ كَمَا تَقَدَّمَ | وَيَقُولُ اللَّهُ تَعَالَى: يَا ابْنَ آدَمَ، ارْكَعْ لِي أَرْبَعَ رَكَعَاتٍ أَوَّلَ النَّهَارِ، أَكْفِكْ آخِرَهُ",
    sourceDocumentAnnotations: ["ACTION (heading/label, in mixed Latin-Arabic text)"],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "This entry is an action/practice note (praying two rak'ahs after sunrise) containing a quoted divine saying, not a dua recited by the worshipper in the same sense as the other entries. It begins with an explicit \"ACTION\" label in the source document. The action's stated reward (\"like a complete Hajj and Umrah\") is preserved verbatim within fullArabicText/originalDocumentText; virtueOrRewardClaim is left unclaimed per Stage 3A scope rather than restating this as a research-backed claim.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
  {
    sequenceNumber: 30,
    internalId: "MDR-030",
    openingArabicWords: "دَعَا رَسُول الله ﷺ سُلَيْمَان",
    fullArabicText:
      "دَعَا رَسُول الله ﷺ سُلَيْمَان: اللَّهُمَّ إِنِّي أَسْأَلُكَ صِحَةً فِي إِيمَانٍ وَإِيمَانًا فِي حُسْنِ خُلُقٍ وَنَجَاحًا يَتْبَعُهُ فَلَاحٌ وَرَحْمَةً مِنْكَ وَعَافِيَةً وَمَغْفِرَةً مِنْكَ وَرِضْوَانًا",
    originalDocumentText:
      "دَعَا رَسُول الله ﷺ سُلَيْمَان: اللَّهُمَّ إِنِّي أَسْأَلُكَ صِحَةً فِي إِيمَانٍ وَإِيمَانًا فِي حُسْنِ خُلُقٍ وَنَجَاحًا يَتْبَعُهُ فَلَاحٌ وَرَحْمَةً مِنْكَ وَعَافِيَةً وَمَغْفِرَةً مِنْكَ وَرِضْوَانًا",
    sourceDocumentAnnotations: [
      "دَعَا رَسُول الله ﷺ سُلَيْمَان (narrator attribution embedded in text: \"The Messenger of Allah ﷺ supplicated for Sulaiman\")",
    ],
    transcriptionStatus: "exact",
    transcriptionNotes:
      "This entry opens with a narrative attribution embedded directly in the source text, introducing the dua that follows. Preserved verbatim, not separated into its own field.",
    proposedCategory: "",
    ...unclaimedResearchFields(),
  },
];
