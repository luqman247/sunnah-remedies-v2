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
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
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
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes:
      "Editorial-launch verification (2026-07-16, corrected 2026-07-16): a tool-mediated fetch (WebFetch's summarising model) of islamweb.net's hosted Sunan Abi Dawud text (Kitab al-Nawm, Bab ma yaqulu idha asbaha) found hadith 5088, narrator 'Uthman ibn 'Affan via his son Aban ibn 'Uthman, wording substantially consistent with fullArabicText (no difference observed in this pass), and the three-times repetition and 'no sudden affliction' protection clause stated within the narration itself. This is category B evidence (a recognised hosting viewed through a summarising tool) — not category A (raw Arabic directly inspected and mechanically compared) — so exact wording is not independently confirmed against a raw, unmediated manuscript, and this note does not claim 'exact match' or 'character-for-character' correspondence. No material wording uncertainty was identified: the recited formula was found consistent across the single source consulted, with no competing reading surfaced. This does not itself constitute scholarly authentication — scholarlyDecision remains pending. The Tirmidhi/Ibn Majah-based closing-clause reconstruction noted in sourceArabicWording above ('nothing will harm him') was not independently re-confirmed in this pass and remains a separate, outstanding item; the approved wording below instead follows the tool-mediated Abu Dawud 5088 text.",
    approvedArabicText:
      "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    approvedEnglishText:
      "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
    approvedSourceReference:
      "Sunan Abi Dawud 5088 (Kitab al-Adab), narrated by 'Uthman ibn 'Affan via his son Aban ibn 'Uthman; also Jami' al-Tirmidhi 3388 and Sunan Ibn Majah 3869. Wording checked via a tool-mediated fetch of islamweb.net's hosted Sunan Abi Dawud text; not independently confirmed against a raw manuscript.",
    approvedTiming: "morning-and-evening",
    approvedRepetitionCount: 3,
    approvedVirtueText:
      "Whoever recites this three times upon entering the morning will not be struck by sudden affliction until evening; whoever recites it three times upon entering the evening will not be struck by sudden affliction until morning. (Stated within the same Sunan Abi Dawud 5088 narration; hasan sahih gharib per al-Tirmidhi's own classification of the parallel Tirmidhi 3388 report.)",
    editorialReviewer: "Luqman Hakim",
    editorialApproval: "approved",
    editorialApprovalDate: "2026-07-16",
    publicationReviewStatus: "editorially-published-pending-scholarly-review",
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
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
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
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
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
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-005 (324 characters) was not assumed in advance to be one hadith, morning-specific, Prophetic, authentic, or independently sourced — each was to be determined from evidence. The record splits cleanly at a single comma into a declarative clause (A: Allah's exclusive dominion/attributes) and a petition clause (B: opening with the vocative 'اللَّهُمَّ') — see src/lib/dhikr-research/audits/mdr-005-clause-map.ts for the full breakdown. This structural segmentation is kept because the grammatical boundary is real and useful for research precision, but it does not by itself prove separate origins: indexed leads associate a closely related combined declaration-plus-petition wording with a single reported narration (Ibn Abi Awfa via Abu al-Warqa', per Mishkat al-Masabih and its commentaries), so both clauses may belong to one reported narration, and clause B's unsourced closing phrase may be an addition within that same clause rather than proof that the whole record combines independently-sourced components. Classification correction (narrow pass, superseding the initial Stage 3B classification): contentClassification was first recorded as 'composite-text', but on review that overstated the evidence — two unresolved wording questions (the 'وَالْحَمْدُ لِلَّهِ' disagreement in clause A; the unsourced closing phrase in clause B) show that source unity is unresolved, not that independent sourcing is established. Demonstrating a composite record requires showing at least two actually-established independently-sourced components, which has not been done here — one reported combined narration is a significant lead, not a settled multi-source finding. contentClassification is therefore recorded as 'unclassified'. Note on enum selection: neither 'uncertain' nor 'general-remembrance' exists as a value of ContentClassification in src/lib/dhikr-research/types.ts, and no new enum member has been added — 'unclassified' is the closest existing controlled value that does not assert a specific classification the evidence does not yet support. morningSpecificStatus is kept 'morning-only', supportable from the transcribed text's own explicit wording ('أَصْبَحْنَا' / 'أَوَّلَ هَذَا النَّهَارِ' — direct timing wording within the text itself, not merely a reported narrator-frame or a chapter heading); this describes the explicit timing of the transcribed text itself, not authentication of the reported narration, and not proof that no evening counterpart ('أَمْسَيْنَا') exists — no evening-parallel version of this specific wording was located in this pass, but this absence was not exhaustively verified. sourceResearchStatus is kept 'in-progress', not 'scholarly-review-required', because no primary hadith or classical-compilation page was itself directly opened and read in this pass (sunnah.com returned HTTP 403; a direct usul.ai per-hadith URL attempt returned HTTP 404) — narrator, exact hadith numbering, and the scope of the one directly-inspected grading (al-'Iraqi's 'إسناده ضعيف', via a modern fatwa, itself only covering a closely related wording up to 'نجاحا') remain indexed leads or partial-scope findings, not direct inspection of the primary or classical grading source, and complete source unity remains unresolved. A WebSearch synthesis claim attributing the 'الكبرياء والعظمة' wording to the Sahih Muslim/Ibn Mas'ud hadith was checked against that hadith's own indexed page title (dorar.net/hadith/sharh/20406, snippet-level only) and found unsupported — not relied upon. Possible explanations for the closing phrase — none preferred, none decided in this pass: a longer, unlocated version of the same reported narration; a recognised transmission variation; a later compilation addition; a later devotional extension; transcription drift; or an unresolved transcription/attribution error. Recommend scholarly review only after direct inspection of: (a) Mishkat al-Masabih hadith 38/2414 and Mirqat al-Mafatih vol. 14 p. 107, to resolve the 'وَالْحَمْدُ لِلَّهِ' discrepancy and confirm the Ibn Abi Awfa narrator chain; (b) al-'Iraqi's Takhrij Ahadith Ihya' 'Ulum al-Din directly, to confirm the weak-chain grading and its exact scope; (c) a further attempt to locate a source for the closing phrase 'أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ', or classify it as currently unsourced; (d) whether the 'Abd ibn Humaid/al-Tabarani weak report (fatwa 437644) and the Ibn Abi Awfa/Mishkat al-Masabih report are the same underlying narration; (e) once source unity is resolved one way or another, revisit contentClassification against the actual established relationship between clause A and clause B. See docs/dhikr/research/MDR-005-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
  },
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-006-source-audit.md
    // for the full research trail behind every field below.
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "scholarly-review-required",
    primaryCollection:
      "A directly fetched recognised hosting of Sahih Muslim's collection text: islamweb.net's own library pages (islamweb.net/ar/library, Kitab al-Dhikr wa'l-Du'a wa't-Tawbah wa'l-Istighfar), opened successfully via WebFetch (sunnah.com/tirmidhi:3390 and sunnah.com/abudawud:5071 both returned HTTP 403 to direct fetch in this environment; usul.ai's per-hadith pages were not reachable by a guessed URL and were not attempted a second time given the islamweb.net fetch succeeded). Opening this webpage is not the same as exact textual inspection: the isnad and matn reported below were returned as a WebFetch quotation, mediated by that tool's summarising model, not independently copied from the page's raw HTML, a scan, or a print edition. With that limitation, the mediated quotation shows an isnad ('Uthman ibn Abi Shaybah -> Jarir -> al-Hasan ibn 'Ubaydullah -> Ibrahim ibn Suwayd -> 'Abd al-Rahman ibn Yazid -> 'Abdullah [ibn Mas'ud, per this chain's well-established Kufan convention and corroborating secondary sources]) and a matn in which all four of MDR-006's thematic components (tahlil/tahmid declaration; 'khayr/sharr of this day or night' petition; refuge from laziness and bad old age; refuge from punishment of the Fire and the grave) occur together and in the same order, with an instruction that the same wording is said in the morning ('وَإِذَا أَصْبَحَ قَالَ ذَلِكَ أَيْضًا') substituting the day-word for the night-word. A first fetch attempt returned an elided ('...') version of this same passage; a second, more targeted fetch returned a fuller (but still tool-mediated) quotation. Several wording differences between that quotation and MDR-006 were observed (see wordingMatchStatus and gradingNotes) and are unresolved — not selected as narration variant, transcription error, vocalisation error, edition difference, omission, or fetch-tool artefact without raw, unmediated Arabic evidence.",
    primaryReference:
      "Sahih Muslim, Kitab al-Dhikr wa'l-Du'a wa't-Tawbah wa'l-Istighfar — commonly cross-referenced as hadith 2723 (a numbering seen consistently across secondary sources, not itself independently verified against a page showing that exact number); the directly-fetched islamweb.net library page's own internal reference reads hadith 4901 in its numbering. The two numbers were not reconciled against a single authoritative index in this pass.",
    secondaryReferences: [
      "usul.ai/search (directly fetched, twice) — search-results index page only, not individual primary pages; corroborates Ibn Mas'ud as narrator and Sahih Muslim as a collection containing this hadith via multiple indexed classical commentaries (e.g. 'Fath al-Mun'im sharh Sahih Muslim' by Musa Shahin Lashin, vol. 6 p. 1871; 'Sharh al-Tibi 'ala Mishkat al-Masabih'), and separately via Musnad al-Bazzar (graded authentic in that index's own annotation) and Ibn Taymiyyah's al-Kalim al-Tayyib — none of these individual works was itself opened.",
      "surahquran.com/Hadith-26083.html (directly fetched) — a tertiary hadith-aggregator page attributing this wording to 'Sahih Abi Dawud' hadith 5071, narrator Ibn Mas'ud, graded sahih by al-Albani. This specific numbering claim is flagged as unreliable: a separate directly-observed search result for 'Abu Dawud 5071' quoted a materially different matn ('...رب العالمين، اللهم إني أسألك خير هذا اليوم فتحه ونصره ونوره وبركته وهداه...', not present in MDR-006 at all) — an unresolved inconsistency between two tertiary sources, not relied upon for the hadith-number claim.",
      "hadithprophet.com/hadith-61590.html (directly fetched) — a tertiary hadith-aggregator page attributing closely related wording (including the kasal/su' al-kibar and 'adhab fi'n-nar/'adhab fi'l-qabr phrases) to Sunan al-Tirmidhi hadith 3390, narrator 'Abdullah, graded hasan sahih; corroborates the Sahih Muslim finding without being itself a primary page.",
    ],
    narrator:
      "Reported as the Prophet's ﷺ own regular practice ('كان النبي ﷺ إذا أمسى قال...', per the directly-inspected primary page's own framing and corroborating secondary sources), narrated by 'Abdullah ibn Mas'ud — the isnad on the directly-fetched islamweb.net Sahih Muslim page ends with '\"عبد الله\"', a well-established shorthand for Ibn Mas'ud in this specific Kufan transmission chain (Ibrahim ibn Suwayd -> 'Abd al-Rahman ibn Yazid -> 'Abdullah), corroborated by every secondary source consulted (surahquran.com, hadithprophet.com, usul.ai index, and multiple WebSearch results) all naming Ibn Mas'ud without exception.",
    sourceArabicWording:
      "Tool-mediated Arabic quotation returned from a directly fetched hosting of Sahih Muslim (islamweb.net/ar/library); requires confirmation against a raw edition before textual comparison is final. Not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Sahih Muslim wording — it was fetched successfully via WebFetch, but the text below was returned through that tool's summarising model, not independently copied from the page's raw HTML, a scan, or a print edition: أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ (evening form; morning substitution instruction quoted the same way: 'وَإِذَا أَصْبَحَ قَالَ ذَلِكَ أَيْضًا أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ'). This quotation must not be treated as the final critical Arabic text for comparison purposes — see wordingMatchStatus and gradingNotes.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Sahih — the underlying four-part narration is contained in Sahih Muslim. This grading applies to the identified narration, not to every unresolved letter-form or vocalisation in MDR-006.",
    gradingAuthority: "Sahih Muslim's canonical inclusion, with textual comparison still pending.",
    gradingNotes:
      "The narration identity, the authenticity of the underlying report, and exact textual correspondence are three separate conclusions, not one. The underlying four-part narration is found in Sahih Muslim, and the four-part structure and overall wording correspond to that narration — but this does not authenticate every MDR-006 letter-form or vocalisation, and unresolved wording differences remain outside the character-level authentication claim. Specific unresolved wording points, none silently corrected in fullArabicText/originalDocumentText and none attributed to a selected cause without raw, unmediated Arabic evidence: (1) MDR-006 reads 'الْمَلِكُ' (al-Malik, 'the King') at 'أَصْبَحَ الْمَلِكُ لِلَّهِ' and again after 'لَا شَرِيكَ لَهُ', where the tool-mediated quotation instead reads 'الْمُلْكُ' (al-Mulk, 'the dominion') in both places. (2) MDR-006 has only one 'لَهُ' before 'الْمَلِكُ وَلَهُ الْحَمْدُ', while the tool-mediated quotation has two ('لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ'). (3) MDR-006 includes 'إِنِّي' in 'رَبِّ إِنِّي أَسْأَلُكَ', absent from the tool-mediated quotation's 'رَبِّ أَسْأَلُكَ' — observed across two separate fetches of the same page. (4) MDR-006 vocalises 'وَسُوءِ الْكِبْرِ' (sukun) where the tool-mediated quotation vocalises 'وَسُوءِ الْكِبَرِ' (fatha). Each of these four points is an unresolved wording difference that may reflect a recognised transmission variant, a source-document transcription error, a vocalisation error, an edition difference, an omission, a WebFetch summarisation artefact, or an unresolved textual error — no single explanation is selected without directly inspected, raw Arabic evidence, and the fact that these types of difference are individually common in hadith transmission does not by itself establish that this specific difference is a recognised transmitted variant. wordingMatchStatus is therefore 'unresolved', not 'exact-match', 'minor-orthographic-variation', 'recognised-narration-variant', or 'materially-different', until MDR-006 and a raw Sahih Muslim text have been compared character-for-character.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence:
      "Not populated: every clause of MDR-006 is first-person petition or refuge-seeking wording ('أَسْأَلُكَ...', 'أَعُوذُ بِكَ...') describing what is being asked for, not a third-person 'whoever recites this will receive X' promise or a stated outcome. No virtue or reward claim is inferred from this petition wording, per instruction.",
    sourceUrls: [
      "https://islamweb.net/ar/library/index.php?page=bookcontents&flag=1&bk_no=1&ID=4973",
      "https://surahquran.com/Hadith-26083.html",
      "https://hadithprophet.com/hadith-61590.html",
    ],
    usulAiResearchNotes:
      "Search 1 (usul.ai/search, Arabic): 'أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله وحده' — returned an indexed results page (directly fetched) listing: (1) Al-Dhikr al-Thamin (Muhammad ibn Salih al-'Uthaymin), vol.1 p.20, entry 10, matched phrase 'أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله...', narrator chain given as 'Ibn Mas'ud (from Abu Huraira)' [inconsistent with every other source consulted, which name only Ibn Mas'ud — not relied upon], continuation reported present; (2) Musnad al-Bazzar (Abu Bakr al-Bazzar), entry 18 marked authentic in the index's own annotation, matched phrase 'أمسينا وأمسى الملك لله والحمد لله لا إله إلا الله...', narrator 'Abdullah ibn Mas'ud, continuation reported present; (3) al-Kalim al-Tayyib (Ibn Taymiyyah), vol.2 p.186, entry 1715, matched phrase 'أمسينا وأمسى الملك لله والحمد لله...', narrator 'Abdullah, continuation reported present with a variant 'سوء الكفر' noted by the tool; (4) Masabih al-Sunna (al-Baghawi), vol.7 p.257, four separate narrations noted including narrators Ibn Abi Awfa, 'A'isha, and al-Bara' ibn 'Azib [these are described as separate narrations in the same thematic area, not claimed as the same hadith as MDR-006]; (5) Subul al-Huda wa'r-Rashad (al-Salihi al-Shami), vol.7 p.257, repeated content; (6) Adhkar wa Adab al-Sabah wa'l-Masa' (Muhammad Isma'il al-Muqaddim), vol.1 p.11 and p.17, entries 83-84, narrator Ibn Mas'ud, continuation reported present; (7) Sahih Kunuz al-Sunna al-Nabawiyya (Bari' 'Irfan Tawfiq), vol.1 p.17, matched phrase 'أصبحنا وأصبح الملك لله والحمد لله...', continuation reported present. For every item, the tool reported 'full context visible' on the search-results page itself, but no individual permalink URL could be extracted (consistent with the MDR-001 through MDR-005 pattern) — this is recorded as an indexed-lead result for all seven items, not a direct-inspection result; the direct-inspection evidence for this record instead came from the separate islamweb.net library fetch (see primaryCollection). Whether attribution was explicit: yes, Ibn Mas'ud, for six of seven items (item 1's 'from Abu Huraira' addition is an outlier, not relied upon). Source type: mix of classical hadith commentary, a musnad, and modern compilations. Confidence: moderate — consistent narrator attribution and consistent presence of all four thematic components across independent indexed works, but no individual primary page opened via this tool.\n\nSearch 2 (usul.ai/search, Arabic): 'أمسينا وأمسى الملك لله والحمد لله لا إله إلا الله وحده' — returned a further indexed results page (directly fetched) confirming Sahih Muslim's presence among the discussing works: Fath al-Mun'im sharh Sahih Muslim (Musa Shahin Lashin), vol.6 p.1871, explicit Sahih Muslim attribution, full context reported visible; Badhl al-Majhud fi Hall Sunan Abi Dawud (Khalil Ahmad al-Saharanfuri), vol.13 p.464, matched phrase 'أمسينا وأمسى الملك لله', narrator chain through 'Abdullah ibn Mas'ud; Qut al-Mughtadhi 'ala Jami' al-Tirmidhi (al-Suyuti), vol.2 p.834; al-Mafatih fi sharh al-Masabih (Mazhar al-Din al-Zaydani), vol.3 p.204; Sharh al-Tibi 'ala Mishkat al-Masabih, vol.51 p.3. Again, no individual permalink was extractable; recorded as indexed-lead corroboration, not direct inspection, for all five items.\n\nGeneral note: as for MDR-001 through MDR-005, Usul.ai's search-results index pages provided useful corroborating metadata (titles, authors, volumes, pages, narrator names) but never a directly openable per-hadith primary page in this pass; the direct-inspection evidence for MDR-006 came instead from a successful WebFetch of islamweb.net's own library hosting of Sahih Muslim.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes:
      "Editorial-launch verification (2026-07-16, corrected 2026-07-16): a tool-mediated re-fetch of islamweb.net's hosted Sahih Muslim text, cross-checked via dorar.net search-result snippets, found convergent support for 'الْمُلْكُ' (al-mulk) over fullArabicText's 'الْمَلِكُ' (al-Malik) at the opening clause. An initial pass treated this as sufficient to reclassify the whole record as 'minor-orthographic-variation' and proceed to editorial publication. On review, this was an over-claim: three further wording points remain genuinely unresolved (a possibly-missing 'لَهُ'; the presence of 'إِنِّي'; 'الْكِبْرِ' vs 'الْكِبَرِ') and were not independently confirmed in either pass. Per this project's evidence-tier discipline, this record's evidence is category B (a recognised hosting viewed through a summarising tool), not category A (raw Arabic directly inspected and mechanically compared) — 'exact match', 'character-for-character', or 'wording fully resolved' language must not be used on B-tier evidence, and a record with multiple unresolved wording points, even where one point is convergently corrected, does not meet the bar for editorial publication. wordingMatchStatus is restored to 'unresolved' and MDR-006 is withdrawn from this editorial-publication batch pending either raw-text confirmation or full resolution of all remaining points. No approved* field is populated for this record.",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-006 (446 characters) was not assumed in advance to be an evening counterpart to any other record, a complete hadith, an exact narration, Prophetic, authentic, morning-specific, evening-specific, or independently sourced — each was to be determined from direct evidence, and none of MDR-005's conclusions (narrator, collection, grading, reference, wording, timing, or authenticity) was inherited without independently inspecting MDR-006's own source. Structural note: MDR-006's own transcribed text opens with 'أَصْبَحْنَا' (morning) and references 'هَذَا الْيَوْمِ' ('this day') throughout — it is NOT the 'أَمْسَيْنَا'-opening evening wording that the MDR-005 audit's contextual lead described; that lead is treated in this pass only as a starting research pointer, not as a conclusion about MDR-006's own content. Comparison with neighbouring records: MDR-006 was checked against MDR-005 and found to be a structurally and thematically unrelated text — MDR-006 is not merged with MDR-005 or treated as its evening counterpart on the basis of both records containing 'أَصْبَحْنَا'/'أَصْبَحَ الْمَلِكُ لِلَّهِ' as a similar opening; two similar openings are not assumed to belong to the same hadith, per instruction. Segmentation decision: MDR-006 was NOT segmented into clauses, despite containing four comma-separated, thematically distinct segments (declaration; day-good/evil petition; laziness/old-age refuge; Fire/grave-punishment refuge) each opening with a fresh 'رَبِّ' vocative for the latter three — because the four thematic components occur together and in the same order in the hosted Sahih Muslim narration returned through the fetch tool (see primaryCollection), not because this has been shown to be a character-for-character continuous matn or an exactly-matching four clauses; segmenting would have implied a source plurality that the evidence does not support, so not segmenting reflects the evidence more accurately. This is a stronger basis for non-segmentation than was available for any prior record in this register (MDR-001 through MDR-005 all lacked even this level of primary-page confirmation of unity) — but it remains a tool-mediated finding, not an independently re-verified manuscript check. contentClassification and morningSpecificStatus are both recorded as 'morning-and-evening': the directly-fetched primary page's mediated quotation states the identical wording is said in the evening ('أَمْسَيْنَا...هَذِهِ اللَّيْلَةِ...') and instructs that 'the same' is said in the morning ('وَإِذَا أَصْبَحَ قَالَ ذَلِكَ أَيْضًا'), substituting the day-word — this concerns the narration's broad timing usage, not a character-level verification of every quoted word; it is not an inference from wording alone or from chapter placement. sourceResearchStatus is recorded as 'scholarly-review-required', not 'verified' and not 'in-progress': the underlying narration's identity in Sahih Muslim is well supported by direct inspection of a genuine primary-collection hosting (a first for this register — MDR-001 through MDR-005 relied only on indexed leads, modern fatwa relays, or search-index pages), but the wording relationship between MDR-006 and that narration is not yet text-critically resolved (see gradingNotes) — narration identity, authenticity of the underlying report, timing usage, and exact textual correspondence are treated as four separate conclusions, not one, and the wording differences call for scholarly judgment and raw-text comparison rather than further tool-mediated source-hunting. A hadith-number discrepancy (commonly cited as 2723 vs. the fetched page's own internal '4901') was not reconciled against a single authoritative index — numbering systems can vary by edition, but that explanation is not assumed to account for this specific discrepancy without checking. An important limitation is recorded throughout: WebFetch's own summarising model mediates every quotation taken from the directly-inspected page, so even this pass's strongest evidence is not a guaranteed character-for-character transcript — a first fetch attempt of the same page returned an elided ('...') version of the same passage before a fuller quotation was obtained on a second, more targeted fetch; this quotation must not be treated as the final critical Arabic text. Recommend scholarly review to: (a) obtain a raw, unmediated copy of the Sahih Muslim matn (e.g. a printed edition or a PDF) to compare MDR-006 against it character-for-character and resolve the al-Mulk/al-Malik, the missing 'لَهُ', the 'إِنِّي' presence, and the al-Kibar/al-Kibr questions without relying on a summarising fetch tool; (b) record the edition, volume, page, book, chapter, and hadith number, and reconcile the '2723' vs '4901' discrepancy; (c) check recognised variant editions and commentaries for each difference, and determine whether any MDR-006 form is a documented narration variant, an edition variant, or a transcription error, before this research register or the content owner's source document is asked to correct anything; this research register does not silently correct fullArabicText or originalDocumentText. See docs/dhikr/research/MDR-006-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
  },
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-007-source-audit.md
    // for the full research trail behind every field below.
    sequenceNumber: 7,
    internalId: "MDR-007",
    openingArabicWords: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا",
    fullArabicText: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النَّشُورُ",
    originalDocumentText: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النَّشُورُ",
    sourceDocumentAnnotations: [],
    transcriptionStatus: "exact",
    transcriptionNotes: "",
    proposedCategory: "",
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "A directly fetched recognised hosting of Jami' al-Tirmidhi (islamweb.net's library pages, islamweb.net/ar/library, Kitab al-Da'awat, chapter on the du'a said upon entering morning and evening), opened successfully via WebFetch (sunnah.com/tirmidhi:3391 returned HTTP 403; dorar.net/hadith/sharh/83786 also returned HTTP 403 — both consistent with every prior record's experience of these two hosts). Opening the webpage is not the same as exact textual inspection: the isnad and matn reported below are a tool-mediated quotation, mediated by WebFetch's summarising model, not independently copied from the page's raw HTML, a scan, or a print edition — raw Arabic was not inspected, and this single page was only fetched once, so no repeat-fetch consistency check was performed (unlike MDR-006). With that limitation, the tool-mediated quotation reports an isnad ('Ali ibn Hijr -> 'Abdullah ibn Ja'far -> Suhail ibn Abi Salih -> his father -> Abu Hurayrah), hadith number 3391, and a grading note reading 'حديث حسن' (hasan), which the quotation attributes to Abu 'Isa al-Tirmidhi. The same tool-mediated quotation reports two distinct forms of this narration — one said in the morning, one said in the evening — differing in both word order ('أَصْبَحْنَا...أَمْسَيْنَا' vs 'أَمْسَيْنَا...أَصْبَحْنَا') and closing word ('الْمَصِيرُ' vs 'النُّشُورُ'). A separately directly-fetched modern scholarly discussion (islamqa.info/ar/answers/543628) reports the opposite closing-word assignment (morning ending in النشور, evening ending in المصير) as its own preferred reading after comparing multiple routes — but this is not necessarily the same claim as what this specific hosted Tirmidhi page prints: islamqa.info's own discussion states four differing textual versions circulate among transmitters, and it is not established in this pass whether the tool-mediated Tirmidhi quotation and islamqa.info's discussion are even describing the same route or edition. This uncertainty, together with the unverified single-pass tool-mediation, is why this apparent disagreement is not treated as a settled two-source factual conflict — see gradingNotes for the full, unresolved comparison. MDR-007's own wording matches neither directly-fetched source's 'morning' form nor its 'evening' form exactly: it shares the 'أَصْبَحْنَا...أَمْسَيْنَا' word order reported for the morning form by both sources, combined with the 'النُّشُورُ' closing word that the two sources assign to opposite times. This specific combination is not confirmed as an established reading by either directly-fetched source in this pass.",
    primaryReference:
      "Jami' al-Tirmidhi, Kitab al-Da'awat, hadith 3391 (directly fetched, tool-mediated). A WebSearch synthesis (not directly inspected, not relied upon as fact) additionally reported this narration in Abu Dawud (5068), Ibn Majah (3868), Ahmad (8649), and Ibn Hibban (964, 965), all via the same Suhail ibn Abi Salih -> his father -> Abu Hurayrah chain — none of these was directly opened in this pass.",
    secondaryReferences: [
      "islamqa.info/ar/answers/543628 (directly fetched via WebFetch) — a modern scholarly discussion, not the primary hadith source, addressing precisely which wording (النشور or المصير) belongs to morning vs evening; states this hadith is reported by al-Tirmidhi (3391, graded hasan by him), al-Bukhari in al-Adab al-Mufrad, an-Nasa'i in 'Amal al-Yawm wa'l-Layla, and Ibn Majah; describes four differing textual versions as circulating among transmitters and states a preference (النشور=morning, المصير=evening) based on its own text-critical analysis of chains and supporting narrations — this is the discussion's own conclusion, not confirmed here by this pass's own direct inspection of those chains.",
      "usul.ai/search (directly fetched, twice) — search-results index pages only, not individual primary pages; corroborate Tirmidhi's presence among indexed works and surface further candidate leads (Badhl al-Majhud fi Hall Sunan Abi Dawud; Tahdhib Sunan Abi Dawud by Ibn al-Qayyim; Sharh Sunan Ibn Majah by al-Athiyubi; al-Sunan al-Kubra by an-Nasa'i; Sahih wa Da'if al-Jami' al-Saghir, an al-Albani grading-index work) — none of these individual works was itself opened; several index snippets themselves disagree with each other on which ending word appears with which wording, consistent with islamqa.info's description of genuine route-level variation.",
    ],
    narrator:
      "Reported as attributed to the Prophet ﷺ (as something he taught his Companions to say), via WebSearch synthesis — not independently confirmed by directly reading the matn's own introductory frame in this pass. Abu Hurayrah is the reported Companion narrator. The fetched isnad is tool-mediated, not independently re-verified against a manuscript: 'Ali ibn Hijr -> 'Abdullah ibn Ja'far -> Suhail ibn Abi Salih -> his father -> Abu Hurayrah, per a directly-fetched (tool-mediated) islamweb.net Tirmidhi page. The intermediate narrator described only as 'his father' was not independently identified by name in this pass. The exact introductory frame requires raw inspection before Prophetic attribution can be treated as more than reported.",
    sourceArabicWording:
      "Tool-mediated Arabic quotation returned from a directly fetched hosting of Jami' al-Tirmidhi (islamweb.net/ar/library); requires confirmation against a raw edition before textual comparison is final. Not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Tirmidhi wording. Two forms were returned: 'morning' — اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ; 'evening' — اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ. A separately directly-fetched source (islamqa.info) reports the opposite closing-word assignment for the same two time-forms — this contradiction is unresolved (see wordingMatchStatus and gradingNotes) and is not attributed to either source being correct without raw, unmediated evidence. This quotation must not be treated as the final critical Arabic text for comparison purposes.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Al-Tirmidhi reportedly classified the underlying narration as hasan in the tool-mediated fetched collection text (islamweb.net's hosting of Jami' al-Tirmidhi 3391, Abu Hurayrah). This reported grading is scoped to the underlying narration having a reported collection grading — it does not resolve MDR-007's exact wording, the النشور/المصير assignment, every route, or every compilation form of this hadith.",
    gradingAuthority: "Abu 'Isa al-Tirmidhi's reported classification, via a tool-mediated fetch of Jami' al-Tirmidhi's own text; not independently corroborated by a second grading authority in this pass, and not verified against a raw, unmediated edition.",
    gradingNotes:
      "Two directly-fetched sources report different closing-word assignments for this narration's morning and evening forms, but these are not necessarily comparable claims, and it is not established that they describe the same route or edition: (1) what the tool-mediated Tirmidhi hosting reportedly says — morning=المصير, evening=النشور, per a single, unrepeated WebFetch of one specific hosted page; (2) what islamqa.info says about al-Tirmidhi's version specifically — the fetched discussion cites Tirmidhi (3391, hasan) among several collections reporting the hadith, without this pass confirming islamqa.info attributes its stated النشور/المصير assignment to Tirmidhi's text specifically rather than to the hadith's transmission as a whole; (3) what islamqa.info prefers after comparing multiple routes — morning=النشور, evening=المصير, described there as the rajih (preponderant) reading based on chain strength and supporting narrations, a cross-route scholarly judgment, not a claim about one specific hosted edition; (4) what Abu Dawud, Ibn Majah, Ahmad, Ibn Hibban, or al-Adab al-Mufrad reportedly contain — reported via WebSearch synthesis only, not directly inspected; (5) what Usul.ai snippets report — a third word-order/ending combination among indexed works, further underscoring that multiple readings circulate; (6) what remains unverified — whether the tool-mediated Tirmidhi quotation accurately reflects that page's raw text, and whether MDR-007's own combination corresponds to any single attested route. Neither the tool-mediated Tirmidhi quotation's assignment nor islamqa.info's preferred assignment is treated as established over the other in this pass. This apparent disagreement is not treated as a settled two-source factual conflict — it may result from WebFetch summarisation, incomplete extraction, the two sources addressing different routes or editions, or a genuine route-level variation independently documented by islamqa.info's own four-version statement; no single explanation is selected without raw, unmediated evidence. MDR-007's own combination (أَصْبَحْنَا-first word order + النُّشُورُ closing word) was not confirmed as matching either directly-fetched source's reported 'morning' form or 'evening' form as a whole. This is not attributed to a recognised narration variant, a transcription error, an edition difference, an omission, or a fetch-tool artefact without directly inspected, raw Arabic evidence for any of those explanations specifically.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence:
      "Not populated: MDR-007 is a first-person declarative statement of dependence on Allah ('by You we enter morning/evening, by You we live/die, and to You is the return/resurrection') — not a request for protection, an explicit Prophetic promise to the reciter, or a narration describing an outcome for reciting it. No virtue or reward claim is inferred from this declarative wording, per instruction.",
    sourceUrls: [
      "https://islamqa.info/ar/answers/543628",
      "https://www.islamweb.net/ar/library/content/2/3313/%D8%A8%D8%A7%D8%A8-%D9%85%D8%A7-%D8%AC%D8%A7%D8%A1-%D9%81%D9%8A-%D8%A7%D9%84%D8%AF%D8%B9%D8%A7%D8%A1-%D8%A5%D8%B0%D8%A7-%D8%A3%D8%B5%D8%A8%D8%AD-%D9%88%D8%A5%D8%B0%D8%A7-%D8%A3%D9%85%D8%B3%D9%89",
    ],
    usulAiResearchNotes:
      "Search 1 (usul.ai/search, Arabic): 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور' — returned an indexed results page (directly fetched) listing: (1) Badhl al-Majhud fi Hall Sunan Abi Dawud (Khalil Ahmad al-Saharanfuri), vol. 13 p. 461, matched phrase ending in النشور, full context reported visible; (2) al-Dhikr al-Thamin (al-'Uthaymin), vol. 1 p. 21, matched phrase ending in النشور; (3) Tahdhib Sunan Abi Dawud (Ibn al-Qayyim), vol. 3 p. 397, matched phrase labelled 'evening version' by the tool and ending in المصير — the tool's own 'evening' label for a المصير-ending phrase is the OPPOSITE of the islamweb.net Tirmidhi fetch's assignment (which put المصير with morning), a further internal inconsistency across sources, not resolved in this pass; (4) Sharh Sunan Ibn Majah (al-Athiyubi), vol. 23 p. 92, described as documenting 'variants... with both النشور and المصير'; (5) al-Sunan al-Kubra (an-Nasa'i), vol. 12 p. 305, 'both phrase endings noted'. Jami' al-Tirmidhi itself was reported as appearing among the results with hadith number 3391 referenced, but no individual Tirmidhi permalink was extractable from this index page — the direct-inspection evidence for Tirmidhi 3391 instead came from the separate islamweb.net library fetch (see primaryCollection). Whether full context was inspected: no, for all index items (snippet/index-page level only). Whether attribution was explicit: yes, Abu Hurayrah, where a narrator was given. Source type: mix of classical hadith commentary (on Abu Dawud, Ibn Majah, an-Nasa'i) and a modern compilation. Confidence: low-to-moderate — the collection/narrator identity is corroborated, but the index itself surfaces conflicting النشور/المصير assignments across different indexed works, mirroring the unresolved disagreement found via direct fetch.\n\nSearch 2 (usul.ai/search, Arabic): 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير' — returned a further indexed results page (directly fetched) listing 11 items, including: al-Dhikr al-Thamin (al-'Uthaymin) vol.1 p.21 with a matched phrase reading 'أَصْبَحْنَا...أَمْسَيْنَا...الْمَصِيرُ' (a THIRD word-order/ending combination, distinct from both forms reported by islamqa.info and the Tirmidhi fetch); Sharh Sunan Ibn Majah li'l-Harari (al-Athiyubi) vol.23 p.92, narrator Abu Hurayrah, 'multiple hadith transmissions with variant readings regarding al-Nushur vs al-Masir'; al-Musnad al-Mawdu'i al-Jami' (Suhayb 'Abd al-Jabbar) vol.15 p.67, hadith #1712-1713, 'thematic collection showing morning and evening variants'; Sharh al-Masabih li-Ibn al-Malik (Ibn Malik al-Kirmani), matched phrase again reading 'أَصْبَحْنَا...أَمْسَيْنَا...الْمَصِيرُ'; al-Baytuta (Abu'l-'Abbas al-Sarraj) vol.10 p.352, 'discusses variant readings between al-Nushur and al-Masir'; Fiqh al-Islam ('Abd al-Qadir Shayba al-Hamd) vol.11 p.366, hadith #5366; Rawdat al-Muhaddithin, vol.3 p.397, matched phrase ending in النشور, 'includes Ibn al-Qayyim's comparative analysis'; Tahdhib Sunan Abi Dawud (Ibn al-Qayyim) entry #354, 'compares morning/evening variants across hadith collections'; Sahih wa Da'if al-Jami' al-Saghir (al-Suyuti/al-Albani grading index), vol.1 p.67, matched phrase ending in النشور, 'authentication classification included' — a candidate grading lead not itself opened in this pass. For every item across both searches, no individual permalink URL could be extracted from the search-results page, consistent with the pattern for MDR-001 through MDR-006; this is recorded as an indexed-lead result for all items, not a direct-inspection result. General note: as for every prior record in this register, Usul.ai's search-results index pages provided useful corroborating metadata but never a directly openable per-hadith primary page in this pass — and in this record's case, the index snippets themselves visibly disagree with each other and with the two directly-fetched sources on the central النشور/المصير question, reinforcing rather than resolving the unresolved-wording finding.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-007 (98 characters, the shortest entry researched in this register so far) was not assumed in advance to be one hadith, a complete narration, Prophetic, authentic, morning-specific, morning-and-evening, an exact source match, or independently sourced — each was to be determined from evidence. Structural note: the record is a single continuous sentence with no internal punctuation and no comma-separated segments; it opens with one vocative ('اللَّهُمَّ') and continues as four parallel 'بِكَ...' clauses ending in 'وَإِلَيْكَ النَّشُورُ' — no new vocative, no shift from declaration to petition (the whole text is declarative, not petitionary), and no other boundary indicator was found, so MDR-007 was NOT segmented into clauses; no clause-map file was created. An initial WebFetch attempt at a third source (hadithprophet.com/hadith-61591.html) was interrupted by the user mid-research and was not retried and is not relied upon anywhere in this record's fields; the research proceeded using the sources named in primaryCollection/secondaryReferences instead. The central research finding is that two directly-fetched (but tool-mediated) sources report different closing-word assignments (النشور or المصير) for the morning form of this narration versus its evening form, but this apparent disagreement has not been confirmed to be a settled factual conflict between claims about the same text: islamqa.info reports morning=النشور (matching MDR-007's own wording exactly, word order and closing word both) as its own preferred reading after comparing multiple routes, while a single, unrepeated tool-mediated quotation of islamweb.net's own Jami' al-Tirmidhi hosting reports the opposite (morning=المصير, evening=النشور — meaning MDR-007's النشور ending would belong to the evening form under this reading, despite MDR-007's أَصْبَحْنَا-first word order matching the morning form under the same reading). These two claims operate at different analytical levels — one specific hosted edition's printed text versus a cross-route scholarly preference — and it is not established that they describe the same route or edition. Usul.ai's own index snippets add a third combination (أَصْبَحْنَا-first with المصير ending) attributed to at least two further classical/modern works, and explicitly describe 'variant readings' and 'multiple textual versions' as a recognised feature of this hadith's transmission — consistent with islamqa.info's own statement that four differing textual versions circulate among transmitters. None of these three combinations is treated as more authoritative than another in this pass; MDR-007's own specific combination is not confirmed as an established reading by any single directly-fetched source. contentClassification and morningSpecificStatus are both recorded as 'morning-and-evening', with four caveats that must accompany that value: (1) the underlying narration is consistently reported as having morning and evening forms — every source consulted agrees on this; (2) the exact assignment of النشور and المصير to each time remains unresolved; (3) this classification concerns broad paired usage, not exact wording; (4) MDR-007's precise morning wording is not verified. Status-decision review (narrow correction, superseding this record's initial classification): sourceResearchStatus was first recorded as 'scholarly-review-required'; on review this overstated the evidence's stability. Applying the status-decision rule explicitly: 'conflicting-evidence' was considered and rejected, because the two directly-fetched sources may not be making mutually exclusive claims about the same transmitted route — the tool-mediated Tirmidhi quotation reports what one specific hosted page prints, while islamqa.info's stated النشور/المصير preference is a cross-route scholarly judgment, and it is not established that both describe the same route or edition; 'scholarly-review-required' was considered and rejected, because that value requires the underlying source evidence to be substantially stable with only a judgment call remaining, whereas here the apparent disagreement may primarily result from WebFetch summarisation, incomplete extraction, failure to inspect raw Tirmidhi Arabic, secondary-source paraphrase, or uncertainty over whether both sources quote the same route or edition — all explicitly listed triggers for 'in-progress' rather than 'scholarly-review-required'. sourceResearchStatus is therefore corrected to 'in-progress'. The underlying narration's identity remains well supported (narrator Abu Hurayrah via Suhail ibn Abi Salih; Jami' al-Tirmidhi 3391, reportedly graded hasan by al-Tirmidhi, per a directly-fetched primary-collection hosting) — narration identity, reported narrator, collection lead, and reported grading are treated as separate, more-established conclusions from broad morning/evening usage, which is in turn separate from the exact closing-word assignment and from an exact match to MDR-007 itself, which remain unresolved. Recommend further research to: (a) obtain a raw, unmediated copy of Jami' al-Tirmidhi 3391 (a printed edition or PDF) and directly compare MDR-007 against it without relying on a summarising fetch tool, including a repeat, independent fetch of the same islamweb.net page to check tool-mediation consistency; (b) directly inspect Abu Dawud 5068, Ibn Majah 3868, Ahmad 8649, and Ibn Hibban 964/965 (reported via search-engine synthesis only, not directly inspected in this pass) to see whether any independently resolves the النشور/المصير question or clarifies which route islamqa.info's preference describes; (c) directly inspect al-Albani's Sahih wa Da'if al-Jami' al-Saghir entry (an indexed lead, not opened) for its own grading and wording; (d) once the source evidence is substantially stable, revisit sourceResearchStatus against the actual resolved relationship between MDR-007 and the underlying narration; (e) decide whether MDR-007's specific combination should be preserved as transcribed, corrected toward one of the reported forms, or annotated, only after (a)-(d) are complete. See docs/dhikr/research/MDR-007-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
  },
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-008-source-audit.md
    // for the full research trail behind every field below.
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "scholarly-review-required",
    primaryCollection:
      "A directly fetched recognised hosting of Sahih al-Bukhari's collection text: islamweb.net's library pages (islamweb.net/ar/library, Kitab al-Da'awat, Bab Afdal al-Istighfar — 'the best form of seeking forgiveness'), opened successfully via WebFetch. Any quotation returned is treated as a tool-mediated quotation, not a guaranteed raw character-for-character transcription — it was not independently extracted from raw HTML, a scan, PDF, or print edition. With that limitation, the tool-mediated quotation shows: the hadith is titled 'سيد الاستغفار' (Sayyid al-Istighfar) within the source itself, not merely in a chapter heading or later commentary; an isnad (Abu Ma'mar -> 'Abd al-Warith -> al-Husayn -> 'Abdullah ibn Buraidah -> Bushair ibn Ka'b al-'Adawi -> Shaddad ibn Aws, from the Prophet ﷺ); a hadith number of 5947 on this specific hosting; the reward/outcome statement (dying before evening or morning after reciting it with certainty during the day or night respectively, entering Paradise) as part of the same narration. A separate WebSearch synthesis and multiple secondary/tertiary sources (not directly fetched: an X/Twitter post quoting the hadith, a dorar.net page title) consistently cite this hadith as Sahih al-Bukhari hadith 6306 instead — a numbering discrepancy with the '5947' shown on the directly-fetched page that was not reconciled in this pass; edition/numbering-system variation is not assumed to explain it without checking. A Wikisource fetch attempt (ar.wikisource.org, intended as a second, independently-mediated corroborating source) was interrupted by the user mid-research and was not retried and is not relied upon anywhere in this record.",
    primaryReference:
      "Sahih al-Bukhari, Kitab al-Da'awat, Bab Afdal al-Istighfar — hadith 5947 per the directly-fetched islamweb.net hosting's own numbering; commonly cross-referenced elsewhere (WebSearch synthesis and multiple secondary sources, not directly inspected for this specific claim) as hadith 6306. The two numbers were not reconciled against a single authoritative index in this pass.",
    secondaryReferences: [
      "usul.ai/search (directly fetched, twice) — search-results index pages only, not individual primary pages; the first confirms Sahih al-Bukhari's presence among general search results for this phrase; a second, more targeted search reported the phrase across al-Sunan al-Kubra (an-Nasa'i), 'Amal al-Yawm wa'l-Layla (an-Nasa'i), al-Tabarani's Kitab al-Du'a, and other commentaries, but explicitly noted 'Sahih al-Bukhari does not appear' among that specific result set — consistent with the pattern in every prior record that Usul.ai's indexed corpus has not surfaced a directly openable Sahih Bukhari/Muslim primary page.",
      "WebSearch synthesis (not directly inspected, not relied upon as fact beyond corroborating the narration's identity) — consistently attributes this hadith to Shaddad ibn Aws, Sahih al-Bukhari hadith 6306, with a reward clause for reciting it during the day or night with certainty.",
    ],
    narrator:
      "Reported: Shaddad ibn Aws, per the isnad on the directly-fetched (tool-mediated) islamweb.net Bukhari page: Abu Ma'mar -> 'Abd al-Warith -> al-Husayn -> 'Abdullah ibn Buraidah -> Bushair ibn Ka'b al-'Adawi -> Shaddad ibn Aws, from the Prophet ﷺ. This narrator identity is corroborated without exception by every secondary source consulted. The Prophetic attribution and introductory frame ('the Prophet ﷺ said: Sayyid al-Istighfar is to say...') is reported within the same tool-mediated quotation, not independently re-verified against a raw manuscript or print edition.",
    sourceArabicWording:
      "Tool-mediated Arabic quotation returned from a directly fetched hosting of Sahih al-Bukhari (islamweb.net/ar/library); requires confirmation against a raw edition before textual comparison is final. Not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Bukhari wording. Per that quotation, the clause order after 'وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ' is: 'أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ' (refuge-seeking, reported in the MIDDLE of the du'a) — then 'أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ' — then 'وَأَبُوءُ لَكَ بِذَنْبِي' (reported WITH 'لَكَ') — then 'فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ' (reported WITH the connective 'فَ'). This must not be treated as the final critical Arabic text for comparison purposes — see wordingMatchStatus and gradingNotes for the full, unresolved comparison against MDR-008's own three points of difference.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Sahih — the underlying narration is contained in Sahih al-Bukhari (Kitab al-Da'awat, Bab Afdal al-Istighfar; hadith 5947 per the directly-fetched hosting, commonly cross-referenced elsewhere as 6306), Shaddad ibn Aws; Bukhari's canonical inclusion supports the narration's authenticity. This does not authenticate MDR-008's exact ordering, spelling, vocalisation, or the three disputed particles/clause-position points (see gradingNotes) — those remain outside this grading's scope. The attached daytime/nighttime reward statement (see virtueOrRewardClaim) belongs to this same reported narration; exact raw wording of both the supplication and the reward statement remains pending against a raw, unmediated edition.",
    gradingAuthority: "Sahih al-Bukhari's own canonical status (no additional modern grading applied or sought, per instruction — Sahih al-Bukhari's inclusion is treated as sufficient); not independently corroborated against a raw, unmediated edition in this pass.",
    gradingNotes:
      "Three points of difference were observed between MDR-008's own transcription and the tool-mediated Bukhari quotation, each treated separately rather than as one undifferentiated 'contradiction', and none silently corrected in fullArabicText/originalDocumentText: (1) Clause order — MDR-008 places 'أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ' at the very end of the du'a, after 'إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ'; the tool-mediated Bukhari quotation places it in the middle, immediately after 'وَعْدِكَ مَا اسْتَطَعْتُ' and before 'أَبُوءُ لَكَ بِنِعْمَتِكَ'. This specific ordering is independently corroborated by two further sources not directly fetched in this pass (an X/Twitter quotation and a dorar.net page title, both snippet-level) and by a directly-fetched Usul.ai index page, which reported across its own indexed corpus that this refuge-seeking clause consistently appears before the acknowledgement clause — this is the most consistently corroborated of the three differences. (2) Presence of 'لَكَ' in 'وَأَبُوءُ [لَكَ] بِذَنْبِي' — the tool-mediated Bukhari quotation includes 'لَكَ'; MDR-008 does not. This point is NOT treated as a settled difference: a separately directly-fetched Usul.ai index page reported that 'وأبوء بذنبي' (without 'لَكَ') is the more common form across ITS indexed corpus — directly at odds with the single Bukhari-page fetch on this specific point. Given this internal inconsistency between two of this pass's own sources, whether MDR-008 actually differs from the (unresolved) standard reading on this point is itself unresolved. (3) Presence of 'فَ' before 'إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ' — the tool-mediated quotation and the X/Twitter quotation both show 'فَإِنَّهُ'; MDR-008 has 'إِنَّهُ' without the connective. Two consistent (but non-raw) data points against MDR-008's reading; not independently checked further. None of these three points is attributed to a recognised narration variant, a transcription error, a compilation adaptation, or a fetch-tool artefact without directly inspected, raw Arabic evidence for any of those explanations specifically — per instruction, a wording difference is not called a recognised variant merely because it looks familiar. wordingMatchStatus is 'unresolved', not 'materially-different', specifically because none of this pass's sources is a raw (non-tool-mediated, non-snippet) inspection, per the explicit rule that tool-mediated wording without raw confirmation stays unresolved.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim:
      "The same Sahih al-Bukhari narration reportedly states that whoever says this supplication during the day with certainty and dies before evening, or says it during the night with certainty and dies before morning, will be among the people of Paradise. (Reported, tool-mediated — see virtueEvidence; not an unconditional promise: saying the supplication, daytime-or-nighttime context, certainty, death before evening/morning, and the Paradise outcome are all preserved as a single conditioned statement, not shortened to 'guarantees Paradise' or 'whoever says it enters Paradise'.)",
    virtueEvidence:
      "The reward statement is narration-attached evidence, not part of the Arabic supplication transcribed in MDR-008 — it must not be inserted into fullArabicText or originalDocumentText, and is not presented as words the user recites. It is part of the wider hadith containing the supplication (the same tool-mediated quotation of the directly-fetched islamweb.net Sahih al-Bukhari hosting used for primaryCollection and sourceArabicWording), following the supplication as a Prophetic outcome statement attached to the narration as a whole, not as a separate narration. The quotation was returned through WebFetch and is tool-mediated, not a raw transcription — the exact raw Arabic wording of the reward clause itself (its precise phrasing, not merely its substance) still requires confirmation against a raw, unmediated edition, distinct from the exact-wording questions already recorded for the supplication text in gradingNotes. The claim's conditions (daytime/nighttime recitation; certainty; death before evening/morning; the Paradise outcome) must not be separated from one another or from the claim as a whole. This claim's substance (as opposed to its exact wording) is corroborated across multiple independent WebSearch-synthesis sources in addition to the tool-mediated primary-page fetch, all describing the same day/night-conditioned Paradise promise without contradiction — distinguishing this from a single, unstable data point.",
    sourceUrls: [
      "https://islamweb.net/ar/library/index.php?page=bookcontents&flag=1&bk_no=0&ID=6047",
    ],
    usulAiResearchNotes:
      "Search 1 (usul.ai/search, Arabic): 'اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك' — returned an indexed results page (directly fetched) including: al-Sunan al-Kubra (an-Nasa'i), entries 10298-10302, vol. 6 p. 121, multiple chains from Shaddad ibn Aws and Jabir, full context reported visible; al-Badr al-Tamam (commentary), al-Husayn ibn Muhammad ibn Sa'id al-La'i, vol. 10 p. 451; Fiqh al-Ad'iya wa'l-Adhkar, 'Abd al-Razzaq ibn 'Abd al-Muhsin al-Badr, full supplication text reported; 'Amal al-Yawm wa'l-Layla (an-Nasa'i), vol. 9 p. 670, entry 4055/22551; Jam' al-Jawami' (al-Suyuti), vol. 6 p. 2; Kitab al-Du'a (al-Tabarani), vol. 1 p. 246. The tool's own summary explicitly noted: 'Sahih al-Bukhari does not appear' among these results — consistent with every prior record in this register, where Usul.ai's indexed corpus has not surfaced a directly openable Bukhari/Muslim primary page. The tool's own cross-source analysis reported 'أعوذ بك من شر ما صنعت' appearing before 'أبوء لك بنعمتك' across the indexed results (matching the directly-fetched Bukhari page's order, differing from MDR-008's), and reported 'وأبوء بذنبي' (without 'لك') as the more common indexed form (differing from the directly-fetched Bukhari page's 'وأبوء لك بذنبي', not necessarily differing from MDR-008). No individual permalink was extractable, consistent with the pattern for MDR-001 through MDR-007; recorded as an indexed-lead result, not a direct-inspection result, for every item.\n\nSearch 2 (usul.ai/search, Arabic): 'من قالها من النهار موقنا بها فمات من يومه قبل أن يمسي' — this fetch attempt timed out (60 seconds) and did not complete; not retried further in this pass; no data obtained from this specific search.\n\nGeneral note: as for every prior record in this register, Usul.ai's search-results index pages provided useful corroborating metadata (narrator identity, clause-order corroboration) but never a directly openable per-hadith Bukhari primary page in this pass — the direct-inspection evidence for this record instead came from the separate islamweb.net library fetch of Sahih al-Bukhari itself (see primaryCollection).",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes:
      "Editorial-launch verification (2026-07-16, corrected 2026-07-16): a tool-mediated re-fetch of islamweb.net's hosted Sahih al-Bukhari text confirmed the isnad and the daytime/nighttime Paradise-conditioned virtue clause. An initial pass treated the clause-order point (the most consistently corroborated of three open questions) as sufficient to reclassify the whole record as 'minor-orthographic-variation' and proceed to editorial publication, applying an approved wording with the refuge-seeking clause moved to its Bukhari-attested position. On review, this was an over-claim: two further wording points ('لَكَ' presence in 'وَأَبُوءُ بِذَنْبِي'; the connective 'فَ' before 'إِنَّهُ') remain genuinely unresolved — this pass's own sources even disagree with each other on the first — and were not independently confirmed. Per this project's evidence-tier discipline, this record's evidence is category B (a recognised hosting viewed through a summarising tool), not category A (raw Arabic directly inspected and mechanically compared); a record with multiple unresolved wording points does not meet the bar for editorial publication, corroborated clause-order notwithstanding. wordingMatchStatus is restored to 'unresolved' and MDR-008 is withdrawn from this editorial-publication batch pending either raw-text confirmation or full resolution of all remaining points. No approved* field is populated for this record.",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-008 (278 characters, transcriptionNotes already flagging it as 'Widely known as Sayyid al-Istighfar' since Stage 3A) was not assumed in advance to be one hadith, a complete narration, Prophetic, authentic, morning-specific, morning-and-evening, an exact source match, a recognised variant, or independently sourced — each was to be determined from evidence, and the Stage 3A note itself was independently verified, not simply trusted. Structural note: the record is a single continuous sentence with no internal punctuation (no commas, no periods) — grammatically, it reads as one first-person declaration-plus-petition addressed to Allah, moving from tawhid affirmation ('أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ') through creation/servanthood/covenant declarations to a refuge-seeking clause, an acknowledgement-of-favour-and-sin clause, and a forgiveness plea. Comparison with neighbouring records: MDR-008 was checked against MDR-007 (a short declarative morning/evening formula from Jami' al-Tirmidhi) and MDR-009 (a testimony/oath formula with a '4x' repetition annotation) and found unrelated to both in content, source, and narrator — not merged with either. Segmentation decision: MDR-008 was NOT segmented into clauses. Although it contains several grammatically distinct sub-clauses, all of its content is drawn from one single, well-identified narration (Sahih al-Bukhari, Shaddad ibn Aws) — there is no source plurality to reflect, and the instruction was explicit not to split merely because a text contains several clauses or to imply separate source origins where none exist; no clause-map file was created. The central research finding is that MDR-008 differs from a directly-fetched (tool-mediated) hosting of Sahih al-Bukhari's own text in three specific, separately-assessed ways (see gradingNotes): most robustly, MDR-008 places the refuge-seeking clause ('أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ') at the very end of the du'a, whereas the directly-fetched Bukhari page and two further independent (though snippet-level or index-level) sources consistently place it in the middle, before the acknowledgement-of-favour clause; less certainly, MDR-008 may or may not differ on whether 'لَكَ' appears in 'وَأَبُوءُ [لَكَ] بِذَنْبِي' (this pass's own sources disagree with each other on which form is more common); and MDR-008 lacks the connective 'فَ' before 'إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ' that two consistent (non-raw) sources show. None of these points is attributed to a recognised variant, transcription error, or fetch-tool artefact without raw evidence. A hadith-number discrepancy was also found and not reconciled: the directly-fetched page shows 5947; multiple secondary sources cite 6306. Virtue-evidence correction (narrow pass, superseding the initial Stage 3B decision): virtueOrRewardClaim was first left empty on the reasoning that the reward statement is absent from MDR-008's own transcribed text. On review, per DhikrSourceResearchRecord's own JSDoc ('a reward/virtue claim, only ever populated from an explicit statement found during scholarly research — not populated from source-document text alone in Stage 3A'), this field is deliberately meant to be populated from research findings, not restricted to content literally present in fullArabicText — that restriction was too narrow. virtueOrRewardClaim is therefore now populated with the scoped, fully-conditioned reward statement (see that field), and virtueEvidence explains its narration-attached status. Three layers are distinguished throughout this record and must not be merged: (1) the recited supplication text — MDR-008's own Arabic wording only, in fullArabicText/originalDocumentText, unchanged; (2) the narrator/Prophetic frame — the statement identifying this as Sayyid al-Istighfar and attributing it to the Prophet ﷺ, reported via the same tool-mediated quotation (see narrator); (3) the narration-attached outcome statement — the conditioned daytime/nighttime Paradise promise (see virtueOrRewardClaim/virtueEvidence), which is evidence *about* the narration, not text the reciter says. Timing-semantics decision (also corrected in this pass): morningSpecificStatus was first recorded as 'not-time-specific' on the reasoning that MDR-008's own transcribed text contains no timing vocabulary. On review, per this field's own JSDoc ('whether this record is confirmed to belong in a morning-specific dhikr list') and the precedent set by MDR-006 (where morningSpecificStatus was set to 'morning-and-evening' based on the wider narration's own reported morning/evening instruction, even though that instruction is entirely absent from MDR-006's own transcribed text), this field represents authenticated/researched narration usage, not narrowly whether the literal transcribed Arabic string contains timing words. Applying that same standard here: the same Sahih al-Bukhari narration reportedly prescribes this supplication for both daytime and nighttime use (via the reward clause's own conditions), so morningSpecificStatus is corrected to 'morning-and-evening' — while it remains true, and is stated explicitly, that the recited text itself contains no internal timing wording; literal wording status and narration usage are two separate conclusions, and this field represents the latter. contentClassification is NOT changed to match, and is retained as 'general-prophetic-supplication': that field concerns the supplication's inherent genre (a first-person tawba/istighfar declaration-plus-petition), not its prescribed usage — MDR-008 is not structurally a morning-and-evening dhikr formula the way MDR-006/MDR-007 are (texts whose own wording alternates by time of day); it is a single fixed supplication reportedly efficacious whenever recited, day or night. This is a deliberate distinction, not overlooked symmetry. sourceResearchStatus is reassessed and retained as 'scholarly-review-required', not downgraded to 'in-progress': the underlying narration, the Shaddad ibn Aws attribution, and the supplication-plus-reward-clause's substance are all substantially established — the reward clause's core conditions (daytime/nighttime, certainty, death timing, Paradise outcome) are corroborated across multiple independent WebSearch-synthesis sources in addition to the tool-mediated primary fetch, not resting on one unstable data point — what remains is exact wording, ordering, and editorial treatment (the three particle/clause-position questions already recorded, plus the reward clause's own exact raw phrasing), which is scholarly/editorial judgment, not 'key sources uninspected'. wordingMatchStatus remains 'unresolved', not 'materially-different', because no source consulted in this pass is a raw, unmediated inspection — per the explicit rule, tool-mediated wording without raw confirmation stays unresolved even where the apparent difference (the clause-order point specifically) is fairly consistently corroborated; this applies equally to the reward clause's own exact wording, which has not been independently raw-verified. The 5947 vs. 6306 hadith-number discrepancy remains unreconciled; whether it reflects distinct edition/numbering systems was not directly verified and is not assumed. Recommend scholarly review to: (a) obtain a raw, unmediated copy of Sahih al-Bukhari (a printed edition, PDF, or scan) for hadith 5947/6306 and compare MDR-008's supplication AND the reward clause against it character-for-character, resolving the clause-order, 'لَكَ', 'فَ', and reward-wording questions; (b) reconcile the 5947 vs. 6306 numbering discrepancy against an authoritative index, verifying (not assuming) whether it reflects distinct edition/numbering systems; (c) decide whether MDR-008's specific combination (particularly the moved refuge-seeking clause) reflects a documented narration variant, a compilation-document transcription choice, or an unresolved transcription drift; (d) decide whether MDR-008 should be preserved as transcribed, corrected toward the Bukhari-page reading, or annotated, only after (a)-(c) are complete. See docs/dhikr/research/MDR-008-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
  },
  {
    // Stage 3B source audit — see docs/dhikr/research/MDR-009-source-audit.md
    // for the full research trail behind every field below.
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "disputed",
    primaryCollection:
      "A directly fetched recognised hosting of Sunan Abi Dawud (islamweb.net/ar/library, Kitab al-Nawm, Bab ma yaqulu idha asbaha — 'what to say upon waking'), opened successfully via WebFetch. The tool-mediated quotation returned is not a guaranteed raw character-for-character transcription — it was not independently extracted from raw HTML, a scan, PDF, or print edition. With that limitation, the quotation shows: hadith number 5069 on this specific hosting; an isnad (Ahmad ibn Salih -> Muhammad ibn Abi Fudayk -> 'Abd al-Rahman ibn 'Abd al-Majid -> Hisham ibn al-Ghaz ibn Rabi'ah -> Makhul al-Dimashqi -> Anas ibn Malik); an opening frame stating the formula is said 'hina yusbihu aw yumsi' (upon waking or upon retiring for the night); the testimony formula itself; and a graduated reward clause (see virtueOrRewardClaim) attached to the same narration. A second attempted source (al-sunan.org/vb, forum thread 3959, titled referencing weakness of the four-times version) was interrupted by the user mid-research, was not retried, and is not relied upon anywhere in this record.",
    primaryReference:
      "Sunan Abi Dawud, Kitab al-Nawm, Bab ma yaqulu idha asbaha — hadith 5069 per the directly-fetched islamweb.net hosting's own numbering. A directly-fetched islamweb.net fatwa page (34520) and a directly-fetched scholarly explanation (khaledalsabt.com) both independently cite the same '5069' reference for Abu Dawud, without a numbering discrepancy in this pass (contrast MDR-006's 2723/4901 and MDR-008's 5947/6306 discrepancies). khaledalsabt.com additionally reports this same narration's appearance in Jami' al-Tirmidhi (3501), al-Nasa'i's 'Amal al-Yawm wa'l-Layla (p.139, entry 10), and al-Bukhari's al-Adab al-Mufrad (p.682, entry 1201) — none of these three cross-references was independently opened or inspected in this pass; recorded as reported leads only. A directly-fetched supplication-commentary page (hadithcommentary.com) separately reports Abu Dawud hadith 5071 as a distinct, related narration from similar opening words promising forgiveness of the day's sins rather than Fire-emancipation — recorded as a separate narration, not merged with MDR-009's own 5069 lead.",
    secondaryReferences: [
      "A directly-fetched islamweb.net fatwa page (fatwa 34520, discussing this hadith's grading) reporting two distinct isnad routes: (a) Baqiyyah ibn al-Walid <- Muslim ibn Ziyad <- Anas ibn Malik, reported by Abu Dawud, al-Tirmidhi, and al-Diya' al-Maqdisi; (b) Muhammad ibn Isma'il ibn Abi Fudayk <- 'Abd al-Rahman <- Hisham ibn al-Ghaz <- Makhul <- Anas ibn Malik, reported by Abu Dawud, al-Nasa'i, and Ibn al-Sunni. Tool-mediated; the page does not address whether Makhul heard directly from Anas, and that connectivity question was not independently resolved in this pass.",
      "A directly-fetched scholarly explanation page (khaledalsabt.com, Sheikh Khalid al-Sabt's sharh of the morning/evening adhkar) corroborating the hadith 5069 reference, the Anas ibn Malik attribution, and the graduated quarter/half/three-quarters/complete Fire-emancipation reward structure, while reporting a named scholarly grading dispute: acceptance as hasan/sound by al-Nawawi ('isnaduhu jayyid'), Ibn al-Qayyim (in Zad al-Ma'ad), al-Diya' al-Maqdisi (in al-Mukhtarah), Ibn Hajar, and Ibn Baz, set against explicit weakening by al-Albani, reported as identifying jahala (unidentified narrators) in the chain across multiple of his own works. The same page reports a critique (attributed by the fetched summary to a name rendered 'al-Tahrani' — this name could not be independently confirmed or corrected in this pass and is recorded exactly as returned) that the hadith is not known from Anas except through this one chain, uniquely narrated by Baqiyyah ibn al-Walid, and identifies Baqiyyah as a mudallis (a narrator known to conceal defects in transmission).",
      "A directly-fetched dedicated supplication-commentary page (hadithcommentary.com, 'Supplication 9') corroborating the Arabic wording, an English rendering, the distinct 5069/5071 hadith-number split described above, the full quarter/half/three-quarters/complete reward ladder, and the morning/evening substitution (أصبحت/أمسيت).",
      "WebSearch synthesis (multiple independent queries, not a single fetched page) corroborating the Anas ibn Malik attribution, the hasan grading as reported by Ibn al-Qayyim, al-Diya' al-Maqdisi, and Ibn Hajar, and the quarter/half/three-quarters/complete-emancipation reward structure, without separately surfacing the al-Albani weakening found via khaledalsabt.com — this absence is not treated as contradicting khaledalsabt.com's report, since WebSearch synthesis is not an exhaustive survey of scholarly opinion.",
      "dorar.net (Mawsoah Hadithiyah, an entry whose title attributes a grading to Ibn Baz via Majmu' Fatawa Ibn Baz) — direct fetch returned HTTP 403 Forbidden, consistent with this register's established pattern for this domain; only the search-result list's own title snippet was seen, not page content, and is recorded as a title-level lead only. That snippet's truncated wording ('...لا إلهَ إلا أنتَ وحدك لا...') is the only source in this pass that appears to include 'وَحْدَكَ لَا شَرِيكَ لَكَ' at the same position as MDR-009's own text — see sourceArabicWording/gradingNotes for why this does not resolve the wording question.",
      "Six targeted Usul.ai searches (usul.ai, via WebSearch restricted to the usul.ai domain) returned no result plausibly related to this hadith, its narrator, or its reward structure — see usulAiResearchNotes for the full per-query log. This is a materially weaker Usul.ai showing than every prior record in this register.",
    ],
    narrator:
      "Reported: Anas ibn Malik, via two distinct chains per the directly-fetched islamweb.net fatwa page: (a) Baqiyyah ibn al-Walid <- Muslim ibn Ziyad <- Anas ibn Malik (Abu Dawud, al-Tirmidhi, al-Diya' al-Maqdisi); (b) Muhammad ibn Isma'il ibn Abi Fudayk <- 'Abd al-Rahman ibn 'Abd al-Majid <- Hisham ibn al-Ghaz ibn Rabi'ah <- Makhul al-Dimashqi <- Anas ibn Malik (Abu Dawud, al-Nasa'i, Ibn al-Sunni; this is the specific chain shown on the directly-fetched islamweb.net Sunan Abi Dawud hosting itself for hadith 5069). The Anas ibn Malik attribution is corroborated without exception by every source consulted in this pass. Both routes are reported as narrowly transmitted: khaledalsabt.com reports that Baqiyyah ibn al-Walid is a known mudallis and that (per a critique attributed in the fetched summary to a name rendered 'al-Tahrani', not independently confirmed) this hadith is not known from Anas except through Baqiyyah's own chain; whether Makhul al-Dimashqi is established to have heard directly from Anas ibn Malik (a connectivity/inqita' question specific to route (b)) was not addressed by any source consulted in this pass and remains unresolved. The Prophetic attribution and introductory frame ('man qala hina yusbihu aw yumsi...' — whoever says upon waking or upon retiring for the night...) is reported within the same tool-mediated quotations, not independently re-verified against a raw manuscript or print edition.",
    sourceArabicWording:
      "Tool-mediated Arabic quotations returned from: a directly fetched hosting of Sunan Abi Dawud (islamweb.net/ar/library, hadith 5069); a directly fetched islamweb.net fatwa page; a directly fetched khaledalsabt.com scholarly explanation; a directly fetched hadithcommentary.com page; and WebSearch synthesis. None is a raw, character-for-character transcription independently verified against a print edition, scan, or PDF. All consulted quotations agree, without exception, on: the opening ('اللهم إني أصبحت أشهدك' / 'من قال حين يصبح أو يمسي'), the witness-object ordering ('وأشهد حملة عرشك، وملائكتك، وجميع خلقك'), the tawhid clause ('أنك أنت الله لا إله إلا أنت'), and the risalah clause ('وأن محمدا عبدك ورسولك'). One consistent difference was found between MDR-009's own transcription and every tool-mediated quotation directly fetched in this pass: MDR-009 includes 'وَحْدَكَ لَا شَرِيْكَ لَكَ' ('alone, without partner') immediately after 'لَا إِلَهَ إِلَّا أَنْتَ' and before 'وَأَنَّ مُحَمَّدًا'; the islamweb.net Sunan Abi Dawud page, the islamweb.net fatwa page, khaledalsabt.com, and hadithcommentary.com all omit this phrase at that position in every quotation returned. The only source in this pass suggesting the phrase might be present is a dorar.net search-result title snippet (page itself blocked, HTTP 403, not inspected) whose truncated text includes '...وحدك لا...' at a position consistent with MDR-009's own wording — this is a title-level lead, not an inspected page, and does not resolve the question. This must not be treated as a settled addition, omission, or recognised variant without a raw, unmediated source.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Disputed among named authorities, per the directly-fetched khaledalsabt.com scholarly explanation: graded hasan/sound by al-Nawawi ('isnaduhu jayyid'), Ibn al-Qayyim (in Zad al-Ma'ad), al-Diya' al-Maqdisi (in al-Mukhtarah), Ibn Hajar, and Ibn Baz; explicitly weakened by al-Albani, reported as identifying jahala (unidentified narrators) in the chain across multiple of his own works. This is a genuine, named disagreement among recognised hadith critics about the hadith's authenticity, not merely a route or edition-numbering discrepancy (contrast MDR-006's 2723/4901 and MDR-008's 5947/6306 numbering questions, neither of which is a scholarly authenticity dispute). The dispute was not independently adjudicated in this pass — no raw inspection of al-Albani's specific stated reasoning (e.g. Da'if al-Jami' al-Saghir, Da'if Sunan Abi Dawud, or Silsilat al-Ahadith al-Da'ifa) was performed; his position is recorded as reported by khaledalsabt.com, tool-mediated, not independently verified against al-Albani's own text. The reward ladder (quarter/half/three-quarters/complete emancipation from the Fire for one/two/three/four recitations) is reported as part of the same narration across every source consulted, without any source reporting it as a separate or independently disputed addition — the grading dispute concerns the underlying isnad's reliability as a whole, not a disagreement over whether the reward clause belongs to the narration.",
    gradingAuthority:
      "Multiple named classical and modern authorities, in explicit disagreement with one another (see hadithGrading): al-Nawawi, Ibn al-Qayyim, al-Diya' al-Maqdisi, Ibn Hajar, and Ibn Baz on one side; al-Albani on the other. All positions reported via a tool-mediated secondary source (khaledalsabt.com), not independently verified against each scholar's own primary work in this pass.",
    gradingNotes:
      "Two distinct isnads are reported for this hadith from Anas ibn Malik and must not be treated as one undifferentiated chain: (1) via Baqiyyah ibn al-Walid from Muslim ibn Ziyad (Abu Dawud, al-Tirmidhi, al-Diya' al-Maqdisi) — khaledalsabt.com reports this route as uniquely narrated by Baqiyyah (tafarrud) and flags Baqiyyah ibn al-Walid as a known mudallis, a narrator-reliability concern distinct from a final authenticity verdict; (2) via Makhul al-Dimashqi from Anas (Abu Dawud, al-Nasa'i, Ibn al-Sunni) — this is the specific chain shown on the directly-fetched islamweb.net Sunan Abi Dawud hosting for hadith 5069 itself. Whether Makhul al-Dimashqi is established to have heard directly from Anas ibn Malik (an inqita'/connectivity question specific to route 2) was not addressed by any source consulted in this pass. The al-Albani/majority grading disagreement (see hadithGrading) was not traced to a specific route in this pass — it is not established whether al-Albani's weakening addresses route (1), route (2), or the hadith as generally transmitted; this is recorded as an open question, not assumed to apply evenly to both chains. Neither grading was used to authenticate the other route, and the four-times repetition/reward-ladder wording was not separately graded by any source consulted — it is reported as part of the same disputed narration, meaning the ladder's authenticity is not established independently of, and is not more secure than, the underlying isnad dispute itself.",
    repetitionCount: 4,
    repetitionEvidence:
      "The source-document '4x' annotation is corroborated by every source consulted in this pass as matching the narration's own stated repetition-and-reward structure, not an arbitrary editorial display choice: the directly-fetched islamweb.net Sunan Abi Dawud hosting (hadith 5069), the directly-fetched islamweb.net fatwa page, khaledalsabt.com, hadithcommentary.com, and WebSearch synthesis all report the same graduated ladder attributed to the same narration — reciting the formula once yields a quarter emancipation from the Fire, twice yields half, three times yields three-quarters, and four times yields complete emancipation from the Fire ('أعتقه الله من النار'). The source-document's '4x' therefore corresponds specifically to the narration's own 'complete emancipation' tier, not merely to 'a count was mentioned somewhere'. This finding is treated as narration-level evidence for the count, separate from and not dependent on the disputed isnad grading recorded in hadithGrading/gradingNotes: the repetition-and-reward structure's wording is consistently reported across independent tool-mediated sources, but the underlying chain's reliability is separately disputed among named scholars, and the repetition structure has not been independently graded apart from the narration as a whole. None of this pass's sources is a raw, unmediated inspection, so the exact wording of the reward ladder (as opposed to its substance and its attachment to the '4x' count) remains within the same tool-mediation limitation recorded in sourceArabicWording/virtueEvidence.",
    virtueOrRewardClaim:
      "The same narration reportedly states a graduated reward tied specifically to repetition count, recited upon waking or upon retiring for the night: reciting the testimony formula once yields emancipation of one quarter of the reciter from the Fire ('أعتق الله ربعه من النار'); reciting it twice yields emancipation of one half ('أعتق الله نصفه'); reciting it three times yields emancipation of three-quarters ('أعتق الله ثلاثة أرباعه'); reciting it four times yields complete emancipation from the Fire ('أعتقه الله من النار'). These four levels are corroborated, without contradiction on substance, across every source consulted in this pass (the directly-fetched islamweb.net Sunan Abi Dawud hosting, the directly-fetched islamweb.net fatwa page, khaledalsabt.com, hadithcommentary.com, and WebSearch synthesis). Each repetition level and its corresponding, distinct fraction must be preserved together and never collapsed into a single undifferentiated claim such as 'protection from Hell', 'guaranteed freedom from the Fire', or 'say it four times and you are saved' — the reward is graduated and conditional on the exact count recited, and only the four-times level yields complete emancipation. The claim is also conditioned on timing (recited upon waking or upon retiring for the night, per the narration's own opening frame 'man qala hina yusbihu aw yumsi'), a condition that must not be separated from the count-based ladder.",
    virtueEvidence:
      "The reward statement is narration-attached evidence, not part of the Arabic supplication transcribed in MDR-009 — it must not be inserted into fullArabicText or originalDocumentText, and is not presented as words the user recites; MDR-009's own transcribed text carries only the source-document's numeric '4x' annotation (see sourceDocumentAnnotations, repetitionEvidence), not the reward wording itself. The claim is corroborated across five independent sources consulted in this pass — a directly-fetched primary-collection hosting (islamweb.net, Sunan Abi Dawud 5069), a directly-fetched modern fatwa discussion (islamweb.net fatwa 34520), a directly-fetched scholarly explanation (khaledalsabt.com), a directly-fetched dedicated commentary page (hadithcommentary.com), and WebSearch synthesis — all describing the same quarter/half/three-quarters/complete emancipation ladder without contradiction on substance. All are tool-mediated quotations or AI-synthesised summaries, not raw transcriptions; none was independently checked against a raw, unmediated print edition, scan, or PDF, so the claim's exact wording (as opposed to its substance and its four-level structure) is not treated as finally established. Three separate conclusions must not be merged: (1) the reward ladder's substance and count-based structure is well corroborated across independent tool-mediated sources; (2) its exact wording is not raw-verified; (3) the isnad carrying the whole narration (formula, timing instruction, and reward ladder together) is disputed among named scholars (see hadithGrading).",
    sourceUrls: [
      "https://www.islamweb.net/ar/library/content/4/4409/%D8%A8%D8%A7%D8%A8-%D9%85%D8%A7-%D9%8A%D9%82%D9%88%D9%84-%D8%A5%D8%B0%D8%A7-%D8%A3%D8%B5%D8%A8%D8%AD",
      "https://www.islamweb.net/ar/fatwa/34520/%D8%B1%D8%AA%D8%A8%D8%A9-%D8%AD%D8%AF%D9%8A%D8%AB-%D8%A7%D9%84%D9%84%D9%87%D9%85-%D8%A5%D9%86%D9%8A-%D8%A3%D8%B5%D8%A8%D8%AD%D8%AA-%D8%A3%D8%B4%D9%87%D8%AF%D9%83-%D9%88%D8%A3%D8%B4%D9%87%D8%AF-%D8%AD%D9%85%D9%84%D8%A9-%D8%B9%D8%B1%D8%B4%D9%83-%D9%88%D9%85%D9%84%D8%A7%D8%A6%D9%83%D8%AA%D9%83",
      "https://khaledalsabt.com/index.php/explanations/365/169-%D8%A7%D8%B0%D9%83%D8%A7%D8%B1-%D8%A7%D9%84%D8%B5%D8%A8%D8%A7%D8%AD-%D9%88%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%A1-%D8%A7%D9%84%D9%84%D9%87%D9%85-%D8%A7%D9%86%D9%8A-%D8%A7%D8%B5%D8%A8%D8%AD%D8%AA-%D8%A7%D8%B4%D9%87%D8%AF%D9%83-%D9%88%D8%A7%D8%B4%D9%87%D8%AF-%D8%AD%D9%85%D9%84%D8%A9-%D8%B9%D8%B1%D8%B4%D9%83-%D9%88%D9%85%D9%84%D8%A7%D9%89%D9%83%D8%AA%D9%83-%D9%88%D8%AC%D9%85%D9%8A%D8%B9-%D8%AE%D9%84%D9%82%D9%83",
      "https://hadithcommentary.com/supplications/supp9/",
    ],
    usulAiResearchNotes:
      "Search 1 (usul.ai, Arabic): 'اللهم إني أصبحت أشهدك وأشهد حملة عرشك' — returned a results list of unrelated Usul.ai texts (al-Sahifa al-Sajjadiyya, Tuhfat al-Walhan, al-Siraj al-Wahhaj, and others); the closest snippet returned was an unrelated supplication from al-Sahifa al-Sajjadiyya sharing only the word 'أشهدك'. No collection, volume, page, or entry number was returned for MDR-009's own hadith. No usable result; not a positive lead.\n\nSearch 2 (usul.ai, Arabic): 'أعتق الله ربعه من النار أعتق الله نصفه' — returned a results list of unrelated Usul.ai texts (al-Isti'dad li'l-Mawt, Tafsir al-Jalalayn, al-Fatawa al-Bazzaziyya, Musnad Abi Umayya al-Tarsusi, and others); none matched the graduated Fire-emancipation reward ladder or MDR-009's underlying narration. No usable result.\n\nSearch 3 (usul.ai, Arabic): 'اللهم إني أمسيت أشهدك وأشهد حملة عرشك' — returned an unrelated results list (al-Sahifa al-Sajjadiyya again, Tuhfat al-Walhan, Mafatih al-Jinan, and others). The tool's own summary described a different Shi'i supplication sharing only the 'حملة العرش' phrase; no match to MDR-009's own evening form. No usable result.\n\nSearch 4 (usul.ai, Arabic): 'من قالها حين يصبح أربع مرات' — returned an unrelated results list and an unrelated result: a hadith attributed to Ja'far al-Sadiq about reciting 'الحمد لله رب العالمين' four times in the morning, from Usul al-Kafi. This is explicitly a different narration, a different Arabic phrase, and a different (Shi'i, Ja'fari) attribution chain from MDR-009's Anas-ibn-Malik testimony formula; not treated as related to or corroborating MDR-009 in any way, and recorded here only to document that it was checked and rejected as unrelated.\n\nSearch 5 (usul.ai, Arabic): 'أعتقه الله من النار سنن أبي داود' — returned an unrelated results list; the tool's own summary surfaced an unrelated wudu supplication ('اللهم اعتق رقبتي من النار', said when wiping the neck) and general information about al-Mundhiri's Mukhtasar Sunan Abi Dawud, not MDR-009's own hadith. No usable result.\n\nSearch 6 (usul.ai, Arabic): 'سنن أبي داود 5069' — returned only general Sunan Abi Dawud commentary/index titles (Awn al-Ma'bud, Sharh Ibn Ruslan, Fath al-Wadud, and others); the tool's own summary explicitly stated it could not find hadith 5069 specifically and suggested consulting islamweb.net, sunnah.com, or usul.ai directly instead. No usable result.\n\nGeneral note: unlike MDR-001 through MDR-008, where Usul.ai's own search-results index pages at least surfaced corroborating metadata (narrator identity, indexed secondary/tertiary works) even without a directly openable primary page, none of the six Usul.ai searches performed for MDR-009 in this pass surfaced any result plausibly related to this specific hadith, its narrator, or its reward structure — a materially weaker Usul.ai showing than every prior record in this register. The remaining Usul.ai queries listed in the research brief (the three individual quarter/half/three-quarters phrases in isolation) were not separately run after six consecutive non-matching searches, on the judgment that further identically-structured queries against the same non-matching index were unlikely to surface different results without a different search strategy; this is recorded as a scope limitation of this pass, not as evidence that Usul.ai's corpus lacks this hadith. All of this record's source-research evidence instead came from the directly-fetched non-Usul.ai sources listed in primaryCollection/secondaryReferences.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-009 (208 characters, sourceDocumentAnnotations already flagging '4x' since Stage 3A) was not assumed in advance to be one hadith, a complete narration, Prophetic, authentic, morning-specific, morning-and-evening, an exact source match, a recognised variant, independently sourced, or correctly repeated four times — each was to be determined from evidence, and the pre-populated repetitionCount was independently evaluated, not simply trusted (see repetitionEvidence). Structural note: the record is a single continuous sentence with six comma-separated clauses forming one first-person testimony/shahada declaration — an opening witness-summons ('أصْبَحْتُ أُشْهِدُكَ'), three further witness-objects (the Throne-bearers, the angels, all creation), a tawhid clause, and a risalah clause — followed by the source-document's '4x' annotation. Comparison with neighbouring records: MDR-009 was checked against MDR-008 (a Sahih al-Bukhari istighfar supplication) and MDR-010 (a distinct gratitude-acknowledgment formula opening 'اللَّهُمَّ مَا أصْبَحَ بِي مِنْ نِعْمَةٍ') and found unrelated to both in content, source, and narrator — not merged with either. Segmentation decision: MDR-009 was NOT segmented into clauses. Although it contains several grammatically distinct witness-object clauses, all of its content is drawn from one single, well-identified (if disputedly graded) narration reported from Anas ibn Malik, and the '4x' repetition count applies to the complete formula as one unit, not to any individual clause — every source consulted in this pass quotes the formula as one continuous unit before stating the repetition-and-reward structure. There is no source plurality to reflect, and the instruction was explicit not to split merely because a text contains several clauses; no clause-map file was created. The central research finding is a genuine, named grading dispute (see hadithGrading/gradingNotes): al-Nawawi, Ibn al-Qayyim, al-Diya' al-Maqdisi, Ibn Hajar, and Ibn Baz all graded the hadith hasan/sound, while al-Albani explicitly weakened it citing jahala (unidentified narrators) in the chain — this was distinguished from a mere route or edition-numbering discrepancy (of the kind seen in MDR-006 and MDR-008) because it is a substantive disagreement about narrator reliability, reported via a single tool-mediated secondary source (khaledalsabt.com) and not independently adjudicated against al-Albani's own primary works in this pass. Status-decision reasoning (applying the status-decision rule explicitly): 'not-started' was rejected because substantial research was completed; 'in-progress' was rejected because the sources are not thin or unstable — five independent tool-mediated sources corroborate the narrator, collection, wording substance, and reward structure without contradiction on substance; 'sourced' was rejected because a named, unresolved authenticity dispute among recognised hadith critics is a stronger unresolved question than 'sourced' implies; 'verified' was rejected because wording remains tool-mediated and unresolved on the وحدك لا شريك لك point, and grading is disputed; 'scholarly-review-required' was considered closely, but rejected in favour of 'disputed' specifically because the remaining question here is not primarily an editorial/wording judgment call (as it was for MDR-006/007/008) but a named authenticity disagreement between al-Albani and five other recognised authorities — 'disputed' exists in the controlled SourceResearchStatus enum and was not invented; this record is the first in this register to use it. A second, separate wording finding was made independently of the grading dispute: MDR-009's own transcription includes 'وَحْدَكَ لَا شَرِيْكَ لَكَ' after 'لَا إِلَهَ إِلَّا أَنْتَ', a phrase absent from every tool-mediated primary/secondary quotation directly fetched in this pass (islamweb.net's Abu Dawud page, islamweb.net's fatwa page, khaledalsabt.com, and hadithcommentary.com all omit it at that position), with only an unfetched (HTTP 403) dorar.net search-result title snippet hinting the phrase might exist in at least one indexed version — this is recorded as an unresolved wording point, not a settled addition, omission, or recognised variant, per gradingNotes/sourceArabicWording. The repetition/reward ladder ('4x' = complete emancipation from the Fire, with quarter/half/three-quarters at one/two/three recitations respectively) is treated as a separate, better-corroborated conclusion from the isnad-authenticity dispute: the ladder's substance is consistently reported across every source in this pass, while the chain carrying the whole narration (formula, timing instruction, and reward ladder together) is the specific subject of the al-Albani/majority disagreement — the reward ladder was not separately graded by any source, so it is not more secure than the underlying isnad dispute, and this distinction is preserved throughout rather than treating 'the reward is well documented' and 'the hadith is authenticated' as the same conclusion. contentClassification and morningSpecificStatus are both recorded as 'morning-and-evening': every source consulted reports the narration's own opening frame as 'man qala hina yusbihu aw yumsi' (whoever says it upon waking or upon retiring for the night), with the time-word itself substituted ('أصبحت' becomes 'أمسيت') — this is a wording-level alternation within the narration's own reported usage, directly analogous to MDR-006's own 'أَصْبَحْنَا'/'أَمْسَيْنَا' substitution (which likewise received 'morning-and-evening' for both fields) and distinguishable from MDR-008, where the day/night condition attached only to an external reward-clause condition rather than to the recited formula's own opening word; MDR-009's own transcribed fullArabicText nonetheless still records only the morning form ('أصْبَحْتُ') actually held in the source document, and the evening substitution is recorded as narration-level usage, not as a claim about MDR-009's own transcribed wording. Six targeted Usul.ai searches (see usulAiResearchNotes) returned no result plausibly related to this hadith, a materially weaker showing than any prior record in this register — this absence was not treated as evidence against the hadith's existence or the other sources' reliability, only recorded as a genuine gap in this pass's Usul.ai coverage. Recommend scholarly review to: (a) obtain and directly inspect al-Albani's own stated reasoning (Da'if Sunan Abi Dawud, Da'if al-Jami' al-Saghir, or Silsilat al-Ahadith al-Da'ifa) for this specific hadith, rather than relying on khaledalsabt.com's tool-mediated report of it; (b) determine which of the two reported isnads (via Baqiyyah ibn al-Walid, or via Makhul al-Dimashqi) al-Albani's weakening addresses, and separately assess Makhul's connectivity to Anas ibn Malik; (c) obtain a raw, unmediated copy of Sunan Abi Dawud 5069 (a printed edition, PDF, or scan) to resolve the 'وَحْدَكَ لَا شَرِيْكَ لَكَ' presence/absence question against MDR-009's own transcription; (d) decide, only after (a)-(c), whether MDR-009 should be preserved as transcribed, corrected, or annotated, and whether the disputed isnad is acceptable for any eventual import. See docs/dhikr/research/MDR-009-source-audit.md, 'Manual verification checklist'.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only (an AI-generated summary drawing on multiple indexed pages, not an inspected primary page). WebSearch synthesis consistently reports this as a hadith of 'Abdullah ibn Ghannam al-Bayadi, reported by Abu Dawud and by al-Nasa'i in 'Amal al-Yawm wa'l-Layla, with wording variation noted between the two. This must not be treated as a directly inspected primary-collection page.",
    primaryReference:
      "Reported Abu Dawud / al-Nasa'i ('Amal al-Yawm wa'l-Layla) reference for 'Abdullah ibn Ghannam al-Bayadi's report; exact hadith number not confirmed in this pass (no direct fetch performed).",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, title only — 'محدث: الألباني، مصدر: الكلم الطيب') — page itself not fetched in this pass; recorded as a title-level lead naming al-Albani as the grading scholar cited by that compilation, exact grading word not confirmed.",
    ],
    narrator: "Reported: 'Abdullah ibn Ghannam al-Bayadi, per WebSearch synthesis of multiple indexed pages; not independently verified against a directly fetched primary or secondary page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis reports the hadith's own frame as 'man qala hina yusbihu... wa man qala mithla dhalika hina yumsi' (whoever says it upon waking has fulfilled the gratitude of his day; whoever says the like upon retiring has fulfilled the gratitude of his night) — a wording-level morning/evening alternation, not merely an external condition. Exact evening-form wording was not obtained.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Reported cited by al-Albani in al-Kalim al-Tayyib per a dorar.net title only (page not fetched, exact grading word not confirmed). Not independently verified in this pass.",
    gradingAuthority: "Reportedly al-Albani (al-Kalim al-Tayyib), per an unfetched dorar.net title only — not independently confirmed.",
    gradingNotes:
      "No wording comparison was performed against a directly fetched primary text in this pass; MDR-010's own wording has not been checked character-for-character against any inspected source.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim:
      "Reportedly: whoever says it upon waking has fulfilled the gratitude (shukr) owed for his day; whoever says the like upon retiring has fulfilled the gratitude owed for his night. Both conditions (timing and the 'fulfilled gratitude' outcome) preserved together; not shortened to an unconditional 'gratitude guaranteed' claim.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-010's own transcribed text — must not be inserted into fullArabicText/originalDocumentText. Sourced from WebSearch synthesis only in this pass, not a directly fetched primary or secondary page; treated as a reported claim pending direct-source confirmation.",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-010 (135 characters) was not assumed to be one hadith, Prophetic, authentic, or morning-and-evening; each was checked against WebSearch synthesis only (no direct fetch performed in this streamlined batch pass, consistent with the batch's efficiency limits). Not segmented — one continuous conditional-declaration sentence, no source plurality indicated. Checked against MDR-009 (unrelated testimony formula) and MDR-011 (unrelated 'afiya petition); not merged with either. sourceResearchStatus is 'in-progress', not 'scholarly-review-required', specifically because no primary or secondary page was directly fetched in this pass — only WebSearch-synthesis-level evidence was obtained, which per this batch's own evidence rules ('search snippets may identify leads but are not direct source inspection') does not meet the bar for a more resolved status. Recommend: directly fetch a primary-collection hosting of Abu Dawud or al-Nasa'i's 'Amal al-Yawm wa'l-Layla for this specific report; confirm the exact evening-form wording; confirm al-Albani's exact grading wording in al-Kalim al-Tayyib.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently and specifically reports: 'Abd al-Rahman ibn Abi Bakrah asked his father Abu Bakrah why he heard him supplicating every morning with these words; Abu Bakrah answered that he heard the Messenger of Allah ﷺ supplicate with them and wished to follow his sunnah. Reported by Abu Dawud, al-Nasa'i (al-Kubra), Ahmad, and al-Bukhari in al-Adab al-Mufrad.",
    primaryReference: "Reportedly Sunan Abi Dawud 5090; Musnad Ahmad 20430; Musnad al-Tayalisi 909 — per WebSearch synthesis, not independently confirmed against a directly fetched page.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 28806 and 70157, titles only, not fetched) — both attribute the report to Abu Bakrah Nufay' ibn al-Harith, graded by al-Albani in Sahih Abi Dawud / Tamam al-Minnah per the titles; exact grading word not confirmed since the pages were not fetched.",
    ],
    narrator:
      "Reported: Abu Bakrah Nufay' ibn al-Harith, describing the Prophet's ﷺ own regular practice, transmitted via his son 'Abd al-Rahman ibn Abi Bakrah — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis reports the hadith's own wording as explicitly instructing the formula be said three times upon entering morning and three times upon entering evening ('thalathan hina tusbihu wa thalathan hina tumsi') — a repetition-and-timing instruction stated within the narration's own reported text, not merely a source-document annotation.",
    wordingMatchStatus: "minor-orthographic-variation",
    hadithGrading: "Reportedly 'hasan or close to it' per WebSearch synthesis of secondary discussion; not independently verified against a directly fetched page in this pass.",
    gradingAuthority: "Not independently confirmed in this pass — reported via WebSearch synthesis only, exact authority and wording not obtained from a directly fetched page.",
    gradingNotes:
      "No wording comparison was performed against a directly fetched primary text in this pass; MDR-011's own wording (including the 'لَا إِلَهَ إِلَّا أَنْتَ' and 'الْكُفْرِ وَالْفَقْرِ' / 'عَذَابِ الْقَبْرِ' clauses) has not been checked character-for-character against any inspected source.",
    repetitionCount: 3,
    repetitionEvidence:
      "The source-document '3x' annotation is directly consistent with WebSearch synthesis's report that the underlying narration's own wording explicitly instructs three recitations upon entering morning and three upon entering evening — this is a narration-level repetition instruction, not merely an editorial display choice, though it was not confirmed against a directly fetched primary page in this pass.",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes:
      "Editorial-launch verification (2026-07-16, corrected 2026-07-16): a tool-mediated fetch (WebFetch's summarising model) of islamweb.net's hosted Sunan Abi Dawud text (Kitab al-Nawm, Bab ma yaqulu idha asbaha) found hadith 5090, full isnad (al-'Abbas ibn 'Abd al-'Azim and Muhammad ibn al-Muthanna -> 'Abd al-Malik ibn 'Amr -> 'Abd al-Jalil ibn 'Atiyyah -> Ja'far ibn Maymun -> 'Abd al-Rahman ibn Abi Bakrah), with wording substantially consistent with fullArabicText — no difference was observed in this pass, aside from punctuation. The hadith text itself explicitly states the three-times-morning/three-times-evening repetition instruction ('تُعِيدُهَا ثَلَاثًا حِينَ تُصْبِحُ وَثَلَاثًا حِينَ تُمْسِي'). This is category B evidence (a recognised hosting viewed through a summarising tool) — not category A (raw Arabic directly inspected and mechanically compared) — so this note does not claim 'exact match' or 'character-for-character' correspondence, and exact wording is not independently confirmed against a raw, unmediated manuscript. No material wording uncertainty was identified from the single source consulted; wordingMatchStatus is editorially assessed as 'minor-orthographic-variation', not 'exact-match'. This does not constitute scholarly authentication — scholarlyDecision remains pending.",
    approvedArabicText:
      "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي لَا إِلَهَ إِلَّا أَنْتَ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ لَا إِلَهَ إِلَّا أَنْتَ",
    approvedEnglishText:
      "O Allah, grant me well-being in my body. O Allah, grant me well-being in my hearing. O Allah, grant me well-being in my sight. There is no god but You. O Allah, I seek refuge in You from disbelief and poverty. O Allah, I seek refuge in You from the punishment of the grave. There is no god but You.",
    approvedSourceReference:
      "Sunan Abi Dawud 5090, narrated by Abu Bakrah Nufay' ibn al-Harith via his son 'Abd al-Rahman ibn Abi Bakrah. Wording checked via a tool-mediated fetch of islamweb.net's hosted Sunan Abi Dawud text; not independently confirmed against a raw manuscript.",
    approvedTiming: "morning-and-evening",
    approvedRepetitionCount: 3,
    approvedVirtueText: "",
    editorialReviewer: "Luqman Hakim",
    editorialApproval: "approved",
    editorialApprovalDate: "2026-07-16",
    publicationReviewStatus: "editorially-published-pending-scholarly-review",
    editorialNotes:
      "MDR-011 (265 characters) was not assumed to be one hadith, Prophetic, authentic, or correctly repeated three times; each was checked against WebSearch synthesis only (no direct fetch performed in this streamlined batch pass). Not segmented — five parallel 'Allahumma 'afini/a'udhu' clauses drawn from one identified narration, no source plurality indicated. Checked against MDR-010 and MDR-012; unrelated to both, not merged. repetitionCount (3) is retained because WebSearch synthesis specifically reports the underlying narration's own wording states the three-times-morning/three-times-evening instruction directly, not merely a source-document display convention — this is a stronger, narration-internal basis than several other records in this batch, though still not confirmed via a directly fetched page. sourceResearchStatus is 'in-progress', not 'scholarly-review-required', because no page was directly fetched in this pass. No explicit reward/virtue statement beyond the petition itself was found; virtueOrRewardClaim is left empty rather than inferred. Recommend: directly fetch Sunan Abi Dawud 5090 or an equivalent primary hosting to confirm exact wording and the precise three-times instruction's phrasing.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently and specifically attributes this exact eight-refuge formula (hamm/hazan, 'ajz/kasal, jubn/bukhl, and a debt/men pairing) to Sahih al-Bukhari, hadith 6363, narrated by Anas ibn Malik, describing it as the Prophet's ﷺ frequent regular practice.",
    primaryReference: "Reportedly Sahih al-Bukhari, hadith 6363 — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    secondaryReferences: [],
    narrator: "Reported: Anas ibn Malik, describing the Prophet's ﷺ own frequent practice — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording for the final pair reads 'وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ' (the weight/burden of debt, and being overpowered by men); MDR-012's own transcription instead reads 'وَغَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ' (being overcome by debt, and being subdued by men) — a genuine two-word difference on this specific pairing. This is recorded as an observed difference between MDR-012's text and WebSearch-synthesis-reported wording, not confirmed against any directly fetched or raw source, and not attributed to a recognised variant without further evidence.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly Sahih (Sahih al-Bukhari's own canonical inclusion) — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    gradingAuthority: "Sahih al-Bukhari's own canonical status, as reported by WebSearch synthesis; not independently verified in this pass.",
    gradingNotes:
      "This grading, if the Bukhari 6363 identification is correct, would apply to the identified narration generally, not to MDR-012's exact letter-forms — the دَيْن/رِجَال wording pair specifically remains an open, unresolved comparison point (see sourceArabicWording), not covered by this grading without further verification.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-012 (202 characters) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — four parallel refuge-seeking clauses drawn from one identified narration, no source plurality indicated. Checked against MDR-011 and MDR-013 and found distinct from both (MDR-013 in particular has a different, non-overlapping refuge-item combination — kasal/harem/su' al-kibar/fitnat al-dunya/'adhab al-qabr — and is treated as a separate narration, not a continuation or duplicate of MDR-012). The central finding is a genuine two-word wording difference on the final pairing ('غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ' in MDR-012 versus WebSearch-synthesis-reported 'ضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ') — recorded precisely, not smoothed over or assumed to be a recognised variant. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass and the wording difference remains unconfirmed against any inspected source. Recommend: directly fetch a primary-collection hosting of Sahih al-Bukhari 6363 to confirm the exact دَيْن/رِجَال wording and resolve whether MDR-012's pairing is a documented variant, an edition difference, or a transcription drift.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis reports a Sahih Muslim hadith (narrator and exact hadith number not confirmed in this pass) with the refuge items 'al-kasal, al-haram, su' al-kibr, and miserliness' followed by refuge from the torment of the grave and the trials of life and death — but this reported combination does not exactly match MDR-013's own combination (kasal, haram, su' al-kibar, fitnat al-dunya, 'adhab al-qabr specifically). A separate Sahih al-Bukhari version was also found (dorar.net sharh 12527, title/snippet only, attributed to Anas ibn Malik) with yet another combination ('ajz/kasal/jubn/haram + fitnat al-mahya wal-mamat + 'adhab al-qabr). Neither located combination is a confirmed exact match to MDR-013.",
    primaryReference: "Not confirmed in this pass — candidate leads point to Sahih Muslim and/or Sahih al-Bukhari, but MDR-013's specific five-item combination was not matched exactly to either located quotation.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 12527, title/snippet only, not fetched) — reports a Sahih al-Bukhari version from Anas ibn Malik with a different specific combination than MDR-013's own text.",
    ],
    narrator: "Not confirmed in this pass — candidate narrators include Anas ibn Malik (for the Bukhari-attributed combination found) and an unidentified narrator for the Sahih-Muslim-attributed combination found; MDR-013's own exact combination was not matched to either.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass, and no located WebSearch-synthesis quotation exactly matches MDR-013's own five-item combination (الْكَسَلِ، وَالْهَرَمِ، وَسُوءِ الْكِبَرِ، وَفِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ). This is recorded as an open matching question, not resolved or assumed in either direction.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Not confirmed in this pass — the underlying narration was not conclusively identified, so no grading is assigned.",
    gradingAuthority: "",
    gradingNotes: "No grading is recorded because the underlying narration itself has not been conclusively identified in this pass — assigning a grading without a confirmed source would misattribute authority.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-013 (120 characters) was not assumed to be one hadith, Prophetic, authentic, or a continuation of MDR-012 merely because both are 'refuge' (a'udhu) formulas — checked against MDR-012 and found to have a non-overlapping refuge-item combination, so treated as a separate, unrelated narration, not a split or continuation of MDR-012. Not segmented — one continuous 'a'udhu bika min...' clause chain, no source plurality indicated beyond the identification question itself. The central finding is that MDR-013's specific five-item combination (kasal/haram/su' al-kibar/fitnat al-dunya/'adhab al-qabr) does not exactly match either of the two candidate hadiths located via WebSearch (a Sahih Muslim combination and a distinct Sahih al-Bukhari/Anas ibn Malik combination) — this is left as a genuinely unresolved sourcing question, not forced into either candidate. sourceResearchStatus is 'in-progress' because the underlying narration itself remains unidentified, which is a more fundamental gap than a wording-only question. Recommend: directly fetch or inspect a critical edition index (e.g. Mu'jam al-Fadh al-Hadith or a Sahih Muslim/Bukhari concordance) to identify the exact narration carrying MDR-013's specific five-item combination before any grading or narrator attribution is assigned.",
    importStatus: "research-only",
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
    contentClassification: "quranic-recitation",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "disputed",
    primaryCollection:
      "The base wording ('حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ') was directly fetched and verified against Qur'an.com (quran.com/9/129, Surah At-Tawbah, verse 129) — this is Qur'anic text, not hadith prose, and matches MDR-014's own wording exactly on this clause (the verse's own preceding frame 'فَإِن تَوَلَّوْا فَقُلْ' — 'if they turn away, then say' — is naturally not part of the recited dhikr). The '7x' repetition-and-virtue layer is separate hadith material, directly fetched via a scholarly explanation page (khaledalsabt.com, tool-mediated, not raw): reported in two forms — marfu' (raised to the Prophet ﷺ) per Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla, and mawquf (a saying of the Companion Abu al-Darda', not explicitly attributed to the Prophet) per Abu Dawud's Sunan (Kitab al-Adab).",
    primaryReference: "Qur'an 9:129 (base wording, directly verified); the '7 times' virtue-report is per Abu Dawud's Sunan (mawquf to Abu al-Darda') and Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla (marfu') — exact hadith numbers not confirmed in this pass.",
    secondaryReferences: [
      "khaledalsabt.com (Sheikh Khalid al-Sabt's sharh, directly fetched) — reports the mawquf/marfu' distinction and a named grading dispute (see hadithGrading).",
    ],
    narrator:
      "The Qur'anic clause carries no separate hadith narrator (it is scripture). The '7 times' virtue-report is attributed to Abu al-Darda' as a mawquf saying (per Abu Dawud) and separately reported marfu' to the Prophet ﷺ (per Ibn al-Sunni) — these are two distinct attribution levels and must not be collapsed into one unconditional 'the Prophet said' claim.",
    sourceArabicWording:
      "The Qur'anic portion is directly verified against Qur'an.com and matches MDR-014's own wording exactly. The '7 times' instruction and outcome clause ('sab'a marrat, kafahu Allah ma ahammahu' — 'seven times, Allah will suffice him against whatever concerns him') was returned only via a tool-mediated quotation from khaledalsabt.com, not independently checked against a raw Abu Dawud/Ibn al-Sunni edition — that specific clause's exact wording remains unconfirmed at raw-text level even though the Qur'anic base clause is confirmed.",
    wordingMatchStatus: "exact-match",
    hadithGrading:
      "Disputed among named authorities for the mawquf/marfu' hadith layer (the Qur'anic base wording itself is not subject to hadith grading): al-Mundhiri stated it 'does not fall below the grade of hasan'; Ibn Baz considered the mawquf version 'sound in chain'; separately reported that Shu'ayb and 'Abd al-Qadir al-Arna'ut authenticated its isnad. Against this, al-Albani classified it as fabricated/weak across multiple of his own works. This is a genuine, named authenticity disagreement about the hadith layer specifically — it does not affect the Qur'anic base wording's own status.",
    gradingAuthority: "al-Mundhiri, Ibn Baz, Shu'ayb and 'Abd al-Qadir al-Arna'ut (accepting) versus al-Albani (rejecting) — reported via a directly fetched but tool-mediated secondary source (khaledalsabt.com); not independently verified against each scholar's own primary work in this pass.",
    gradingNotes:
      "Two separate layers must not be conflated: (1) the recited Qur'anic clause itself, whose text is confirmed against Qur'an.com and carries no authenticity dispute as scripture; (2) the '7 times / Allah will suffice him' hadith-level virtue-report, whose grading is genuinely disputed and whose attribution level (mawquf vs marfu') differs by collection. Neither the mawquf nor the marfu' report's grading extends to establish the exact wording of the outcome clause itself, which remains tool-mediated only.",
    repetitionCount: 7,
    repetitionEvidence:
      "The source-document '7x' annotation is directly consistent with the hadith-level report (in both its mawquf and marfu' forms, per WebSearch synthesis and the khaledalsabt.com fetch) explicitly instructing seven recitations morning and evening — a narration-internal repetition instruction, not an inferred or invented count. This finding is separate from, and does not resolve, the disputed grading of the report carrying that instruction (see hadithGrading) — the count is textually consistent across sources, but the report's own authority is disputed.",
    virtueOrRewardClaim:
      "Reportedly: whoever says this seven times in the morning and seven times in the evening, Allah will suffice him against whatever concerns him ('kafahu Allah ma ahammahu'). Both the count (seven) and the timing (morning and evening) are preserved as conditions of this claim, not separated from it or reduced to an unconditional promise.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-014's own transcribed text (which carries only the Qur'anic clause plus the source-document's '7x' annotation) — must not be inserted into fullArabicText/originalDocumentText. This claim's authority is directly tied to the disputed mawquf/marfu' hadith-grading question (see hadithGrading/gradingNotes): it is reported consistently across sources on substance, but its underlying authenticity is genuinely contested by al-Albani against several other named authorities, and this claim must not be presented as more certain than that disputed status allows.",
    sourceUrls: [
      "https://quran.com/9/129",
      "https://khaledalsabt.com/explanations/368/172-%D8%A7%D8%B0%D9%83%D8%A7%D8%B1-%D8%A7%D9%84%D8%B5%D8%A8%D8%A7%D8%AD-%D9%88%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D8%A1-%D8%AD%D8%B3%D8%A8%D9%8A-%D8%A7%D9%84%D9%84%D9%87-%D9%84%D8%A7-%D8%A7%D9%84%D9%87-%D8%A7%D9%84%D8%A7-%D9%87%D9%88-%D8%B9%D9%84%D9%8A%D9%87-%D8%AA%D9%88%D9%83%D9%84%D8%AA-%D9%88%D9%87%D9%88-%D8%B1%D8%A8-%D8%A7%D9%84%D8%B9%D8%B1%D8%B4-%D8%A7%D9%84%D8%B9%D8%B8%D9%8A%D9%85",
    ],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis plus two directly fetched pages (Qur'an.com, khaledalsabt.com), per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-014 (92 characters) was not assumed to be one hadith, Prophetic, authentic, or correctly repeated seven times; each was checked from evidence. Structural note: the record is not itself hadith prose — its base clause is a direct quotation of Qur'an 9:129 (confirmed via a directly fetched Qur'an.com page), and the '7x' repetition-and-virtue layer is a separate hadith-level report about the merit of reciting this verse. Not segmented — the Qur'anic clause and the '7x' annotation form one continuous unit as transcribed, with the reward/count structure recorded as narration-attached evidence rather than a separate clause requiring its own source conclusion. contentClassification is recorded as 'quranic-recitation' because the recited text itself is scripture, not composed hadith prose — this is distinct from morningSpecificStatus, which reflects the hadith-level report's own morning-and-evening usage instruction. sourceResearchStatus is 'disputed' (the second use of this value in the register, after MDR-009) because a genuine, named authenticity disagreement exists for the hadith-level virtue-report specifically (al-Mundhiri/Ibn Baz/Arna'ut versus al-Albani), directly confirmed via a fetched secondary source, not merely a route or edition question. wordingMatchStatus is recorded as 'exact-match' for the Qur'anic base clause only, which was directly verified against Qur'an.com — this does not extend to the hadith-level outcome clause's own exact wording, which remains tool-mediated only (see gradingNotes). Recommend: directly inspect a raw edition of Abu Dawud's Sunan (Kitab al-Adab) and Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla to confirm the outcome clause's exact wording; directly inspect al-Albani's own stated reasoning for weakening this report.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently and specifically attributes this multi-clause supplication ('afiya in this world and the next; 'afw and 'afiya in din/dunya/family/wealth; conceal my faults; guard me from every direction) to 'Abdullah ibn 'Umar, stating the Messenger of Allah ﷺ never abandoned these words morning and evening. Reported by Abu Dawud, al-Nasa'i, Ibn Majah, and Ahmad.",
    primaryReference: "Reportedly Sunan Abi Dawud 5074 — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 69801 and 73176, titles only, not fetched) — attribute the report to 'Abdullah ibn 'Umar and cite al-Mundhiri/al-Albani as grading sources per the titles; exact grading wording not confirmed since the pages were not fetched.",
    ],
    narrator: "Reported: 'Abdullah ibn 'Umar, describing the Prophet's ﷺ own regular morning-and-evening practice — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording matches MDR-015's own text closely across all five clauses on substance, but was not checked character-for-character against any inspected source.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly authenticated (isnad sahih) by al-Albani, and separately by al-Nawawi and Ahmad Shakir, per WebSearch synthesis — not independently verified against a directly fetched page in this pass; no disagreement among these three was found in this pass.",
    gradingAuthority: "Reportedly al-Nawawi, Ahmad Shakir, and al-Albani, per WebSearch synthesis; not independently confirmed against each scholar's own primary work in this pass.",
    gradingNotes:
      "No wording comparison was performed against a directly fetched primary text in this pass; MDR-015's own wording (372 characters, five clauses) has not been checked character-for-character against any inspected source. No grading disagreement was found among the three authorities located in this pass, distinguishing this record from MDR-014/MDR-020's disputed gradings.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes:
      "Editorial-launch verification (2026-07-16, corrected 2026-07-16): a tool-mediated fetch of islamweb.net's hosted 'Awn al-Ma'bud commentary text (Sunan Abi Dawud 5074) found four differences from fullArabicText: 'شَمَالِي' vs 'شِمَالِي' (vocalisation only), 'بِعَظْمَتِكَ' vs 'بِعَظَمَتِكَ' (vocalisation only, though it changes the apparent word), and 'وَأَمِّنْ رَوْعَتِي' vs 'وَآمِنْ رَوْعَاتِي'. An initial pass described all four collectively as 'minor vocalisation differences' and proceeded to editorial publication. On review, this mischaracterised the last point: 'أَمِّنْ' (form II) vs 'آمِنْ' (form IV) is a genuine verb-form difference, and 'رَوْعَتِي' (singular) vs 'رَوْعَاتِي' (plural) is a genuine lexical/morphological difference — neither is mere vocalisation, and both rest on a single, uncorroborated tool-mediated fetch (category B evidence, not independently cross-checked). Per this project's evidence-tier discipline, an uncorroborated lexical/plural difference is a material wording uncertainty, not a resolved minor variant. wordingMatchStatus is restored to 'unresolved' and MDR-015 is withdrawn from this editorial-publication batch pending independent corroboration of the وَآمِنْ رَوْعَاتِي point (the شِمَالِي and بِعَظَمَتِكَ points remain, individually, good candidates for a future minor-orthographic-variation classification once this record is revisited as a whole). No approved* field is populated for this record.",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-015 (372 characters, the longest record in this batch) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — five successive petitionary clauses reported as part of one narration the Prophet ﷺ never abandoned morning and evening, per WebSearch synthesis; no source plurality indicated, so treated as one continuous unit despite internal periods. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass, notwithstanding the unusually consistent three-authority grading agreement found. No explicit reward/virtue statement beyond the petitions themselves was found; virtueOrRewardClaim is left empty rather than inferred. Recommend: directly fetch Sunan Abi Dawud 5074 or an equivalent primary hosting to confirm exact wording across all five clauses.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently and specifically reports that Abu Bakr al-Siddiq asked the Prophet ﷺ for words to say morning and evening, and was taught this formula (tawhid-witness plus refuge from the evil of one's self, Satan, and his shirk-invitation). Reported by Abu Dawud, al-Tirmidhi, al-Bukhari in al-Adab al-Mufrad, and Ahmad; narrated by Abu Hurayrah.",
    primaryReference: "Reportedly Sunan Abi Dawud 5067 and Jami' al-Tirmidhi 3392 — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 74285 and 30026, titles only, not fetched) — corroborate the Abu Bakr/Abu Hurayrah attribution and the Tirmidhi reference per the titles.",
    ],
    narrator: "Reported: Abu Hurayrah, relating the Prophet's ﷺ instruction to Abu Bakr al-Siddiq — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording matches MDR-016's own text closely on substance (the 'alim al-ghayb wa'sh-shahada, fatir as-samawat wa'l-ard, rabb kulli shay'in wa malikahu' opening and the shirk/self-evil refuge clauses), but was not checked character-for-character against any inspected source. WebSearch synthesis also reports a timing instruction of 'when you wake up, when you retire in the evening, and when you go to bed' — three named occasions, not clearly distinguished as two or three distinct timings in the synthesis obtained; this ambiguity is not resolved in this pass.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly graded hasan sahih by al-Tirmidhi himself, and separately authenticated by Ibn Hibban and al-Hakim, per WebSearch synthesis — not independently verified against a directly fetched page in this pass; no disagreement among these was found in this pass.",
    gradingAuthority: "Reportedly al-Tirmidhi (hasan sahih), Ibn Hibban, and al-Hakim, per WebSearch synthesis; not independently confirmed against each scholar's own primary work in this pass.",
    gradingNotes:
      "No wording comparison was performed against a directly fetched primary text in this pass; MDR-016's own wording (270 characters) has not been checked character-for-character against any inspected source. No grading disagreement was found among the authorities located in this pass.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-016 (270 characters) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous address-plus-witness-plus-refuge sentence reported as taught in a single instruction to Abu Bakr, no source plurality indicated. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass. The reported 'when you wake up, when you retire in the evening, and when you go to bed' timing instruction is recorded exactly as found, without resolving whether this is two occasions or three — left as an open point rather than collapsed to a simple 'morning and evening' claim beyond what morningSpecificStatus already represents. No explicit reward/virtue statement beyond being taught as good words to say was found; virtueOrRewardClaim is left empty rather than inferred. Recommend: directly fetch Jami' al-Tirmidhi 3392 or an equivalent primary hosting to confirm exact wording and resolve the two-versus-three-occasions timing question.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently reports the located hadith wording as 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ رَسُولًا' (first-person singular 'raditu', closing word 'rasula' — messenger), narrated by Abu Sa'id al-Khudri, with the outcome 'wajabat lahu al-jannah' (Paradise becomes obligatory for him). Reported by Abu Dawud, al-Nasa'i (al-Kubra), Ibn Hibban, and al-Hakim (who called it sahih by isnad).",
    primaryReference: "Reportedly Sunan Abi Dawud 1529 / 5072 (sources vary), al-Nasa'i al-Kubra 9748, Ibn Hibban's Sahih 863, al-Hakim's Mustadrak 1904 — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 28330, title only, not fetched) — attributes the report to Abu Sa'id al-Khudri and cites Sahih Abi Dawud (al-Albani) per the title.",
    ],
    narrator: "Reported: Abu Sa'id al-Khudri — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. The located WebSearch-synthesis wording ('رَضِيتُ ... رَسُولًا', singular, closing 'رسولا') does not exactly match EITHER of MDR-017's own two source-document variants: variant 1 ('رَضِينَا ... رَسُولا') matches the located wording's closing word ('رسولا') but uses the plural 'رضينا' instead of the located singular 'رضيت'; variant 2 ('رضيت ... نَبيا') matches the located wording's singular form ('رضيت') but uses the closing word 'نبيا' (prophet) instead of the located 'رسولا' (messenger). Neither MDR-017 variant is a confirmed exact match; this is recorded precisely rather than assuming either variant is simply 'the' correct wording.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly graded sahih by al-Hakim (by isnad) and included in al-Albani's Sahih Abi Dawud per a dorar.net title (not fetched) — per WebSearch synthesis, not independently verified against a directly fetched page in this pass; no disagreement found in this pass.",
    gradingAuthority: "Reportedly al-Hakim and al-Albani, per WebSearch synthesis; not independently confirmed against each scholar's own primary work in this pass.",
    gradingNotes:
      "This grading, if the located hadith's identification is correct, would apply to the identified narration's own wording ('رَضِيتُ ... رَسُولًا') specifically — it does not automatically extend to either of MDR-017's own two source-document variants, both of which differ from that located wording on at least one word (see sourceArabicWording).",
    repetitionCount: 3,
    repetitionEvidence:
      "The located WebSearch-synthesis quotation of the underlying hadith's own reward clause ('man qala: raditu billahi rabban... wajabat lahu al-jannah') does not itself state a repetition count or a morning/evening timing condition — the reward is reported as tied to saying the words, not explicitly to saying them three times. The source-document's '3x, morning and evening' framing was not confirmed as part of the primary hadith's own wording in this pass; it may reflect a later compilation's usage convention rather than the base hadith's own reward-conditioning text. repetitionCount (3) is retained from Stage 3A but is NOT treated as narration-confirmed in this pass.",
    virtueOrRewardClaim:
      "Reportedly: whoever says 'I am pleased with Allah as Lord, Islam as religion, and Muhammad as messenger,' Paradise becomes obligatory for him ('wajabat lahu al-jannah'). This claim, per the located wording, is not explicitly conditioned on a specific repetition count or on morning/evening timing in the primary report found in this pass (see repetitionEvidence) — it is recorded here exactly as found, without adding a count or timing condition not present in the located source.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-017's own transcribed text — must not be inserted into fullArabicText/originalDocumentText. Sourced from WebSearch synthesis only in this pass, not a directly fetched primary or secondary page; treated as a reported claim pending direct-source confirmation. The claim's relationship to the source-document's '3x' annotation and to either of MDR-017's two wording variants remains unresolved (see repetitionEvidence, sourceArabicWording).",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-017 (137 characters, carrying two source-document variants separated by '|' since Stage 3A) was not assumed to be one hadith, Prophetic, authentic, or correctly repeated three times; each was checked against WebSearch synthesis only (no direct fetch performed). Not segmented — the two variants are preserved side by side exactly as Stage 3A recorded them, per the existing transcriptionNotes; this Stage 3B pass did not merge, split, or choose between them, since neither was confirmed as the sole correct wording. The central finding is that the one hadith wording located via WebSearch ('رَضِيتُ ... رَسُولًا') does not exactly match either of MDR-017's own two variants — each variant matches the located wording on one dimension (person/number, or closing word) and differs on the other; this is recorded precisely (see sourceArabicWording), not resolved in favour of either variant. A second finding is that the located hadith's own reward clause does not itself specify a repetition count or morning/evening timing, raising an open question about whether the source-document's '3x, morning and evening' framing reflects the base hadith's own text or a later compilation convention (see repetitionEvidence) — repetitionCount is retained from Stage 3A but explicitly flagged as not narration-confirmed in this pass. sourceResearchStatus is 'in-progress' because no page was directly fetched and both the wording-variant and repetition-count questions remain open. Recommend: directly fetch Sunan Abi Dawud (the specific hadith number carrying this report) to resolve which variant, if either, matches the primary wording, and to confirm whether a repetition count or timing condition is part of the base hadith text.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently reports this as the Prophet's ﷺ advice to his daughter Fatimah, narrated by Anas ibn Malik: 'What prevents you from listening to what I advise you? Say when you wake up and when you go to bed: Ya Hayy, Ya Qayyum, bi-rahmatika astaghith, aslih li sha'ni kullahu, wa la takilni ila nafsi tarfata 'ayn.' Reported by al-Nasa'i (al-Sunan al-Kubra and 'Amal al-Yawm wa'l-Layla), al-Hakim (al-Mustadrak), al-Bayhaqi, and al-Bazzar.",
    primaryReference: "Reportedly al-Nasa'i's al-Sunan al-Kubra / 'Amal al-Yawm wa'l-Layla — per WebSearch synthesis, exact hadith number not confirmed in this pass.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, h/XoIdBMrF, title only, not fetched) — attributes the report to Anas ibn Malik (recounting the Prophet's ﷺ advice to Fatimah) with al-Bazzar's al-Bahr al-Zakhkhar cited as a source per the title.",
    ],
    narrator: "Reported: Anas ibn Malik, recounting the Prophet's ﷺ advice to his daughter Fatimah — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording matches MDR-018's own text closely on substance and structure, but was not checked character-for-character against any inspected source.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Not confirmed in this pass — no specific grading word was located via WebSearch synthesis for this report; recorded as an open question rather than assumed sahih or da'if.",
    gradingAuthority: "",
    gradingNotes: "No grading authority or wording was located in this pass; this is left unresolved rather than inferred from the report's inclusion in recognised collections (al-Nasa'i, al-Hakim) alone.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-018 (123 characters) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous vocative-plus-petition sentence reported as a single piece of advice, no source plurality indicated. sourceResearchStatus is 'in-progress' because no page was directly fetched and no specific grading word was located for this report — recorded as an open grading question rather than assumed authentic from collection inclusion alone. No explicit reward/virtue statement beyond the petition itself ('set right all my affairs') was found; virtueOrRewardClaim is left empty rather than inferred. Recommend: directly fetch a primary hosting of al-Nasa'i's al-Sunan al-Kubra or 'Amal al-Yawm wa'l-Layla to confirm exact wording, hadith number, and grading.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis reports this short form ('Asbahna wa asbaha al-mulk lillahi wa'l-hamdu lillahi, la sharika lahu, la ilaha illa huwa, wa ilayhi al-nushur') as a hadith of Abu Hurayrah, authenticated by al-Haythami in Majma' al-Zawa'id with a reported 'good chain' (isnad hasan). This is a DIFFERENT, shorter narration from MDR-006's own researched hadith (Sahih Muslim, 'Abdullah ibn Mas'ud, the four-part 'asbahna wa asbaha al-mulk lillahi... rabbi as'aluka khayra ma fi hadha'l-yawm' formula) — the two share only an opening phrase and are not merged or treated as the same narration.",
    primaryReference: "Reportedly via al-Haythami's Majma' al-Zawa'id (a compilation grading additional-musnad hadiths, not itself a primary collection) — per WebSearch synthesis, underlying primary collection and hadith number not confirmed in this pass.",
    secondaryReferences: [],
    narrator: "Reported: Abu Hurayrah — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording matches MDR-019's own text closely on substance, but was not checked character-for-character against any inspected source.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly graded 'good chain' (isnad hasan) by al-Haythami in Majma' al-Zawa'id per WebSearch synthesis — not independently verified against a directly fetched page in this pass. Majma' al-Zawa'id gradings apply to a hadith's presence in a specific additional musnad, not necessarily to every wording variant; this scope limitation is noted, not resolved.",
    gradingAuthority: "Reportedly al-Haythami (Majma' al-Zawa'id), per WebSearch synthesis; not independently confirmed in this pass.",
    gradingNotes:
      "No wording comparison was performed against a directly fetched primary text in this pass. This grading, if correctly identified, applies to the underlying musnad report al-Haythami reviewed, not confirmed to be character-for-character identical to MDR-019's own transcription.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-019 (100 characters, its lighter diacritization already flagged in Stage 3A transcriptionNotes) was not assumed to be one hadith, Prophetic, authentic, or the same narration as MDR-006 merely because both open with 'أَصْبَحْنَا وَأصْبح الْملك لله' — checked specifically against MDR-006's own already-researched fields (Sahih Muslim, Ibn Mas'ud, a four-part formula ending in refuge from kasal/su'al-kibr/'adhab fi'n-nar wa'l-qabr, 446 characters) and found to diverge after the opening clause: MDR-019 closes with 'لَا شريك لَهُ لَا إِلَه إِلَّا هُوَ وَإِلَيْهِ النشور' (100 characters total), a closing MDR-006's own researched wording does not contain at all. This is treated as a distinct, separately-narrated (Abu Hurayrah, per al-Haythami) short hadith, not a truncation, error, or duplicate of MDR-006 — not merged. Not segmented — one continuous declarative sentence, no source plurality indicated. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass and the underlying primary collection (as opposed to al-Haythami's grading compilation) was not identified. No explicit reward/virtue statement beyond the declaration itself was found; virtueOrRewardClaim is left empty rather than inferred. Recommend: identify the specific primary musnad al-Haythami reviewed for this report and directly fetch or inspect it to confirm exact wording and an independent grading.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "disputed",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently and specifically attributes this formula to Abu Malik al-Ash'ari: 'When one of you enters the morning, let him say: Asbahna wa asbaha al-mulk lillahi rabbi'l-'alamin. Allahumma inni as'aluka khayra hadha'l-yawm: fathahu, wa nasrahu, wa nurahu, wa barakatahu, wa hudahu, wa a'udhu bika min sharri ma fihi wa sharri ma ba'dahu. Then when evening comes, let him say the same.' Reported by Abu Dawud (isnad includes Isma'il ibn 'Ayyash, a narrator whose transmission from non-Levantine sheikhs is widely documented as weak).",
    primaryReference: "Reportedly Sunan Abi Dawud (exact number not confirmed in this pass) — per WebSearch synthesis, not independently confirmed against a directly fetched page.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, h/1yd1o9ZV, title only, not fetched) — cites al-Albani's Da'if Abi Dawud, explicitly signalling al-Albani's later weakening rather than his earlier hasan grading.",
      "hdith.com (h/0a-TZrixgy, title only, not fetched) — title itself flags 'Isma'il ibn 'Ayyash wa fihi maqal ma'ruf' (Isma'il ibn 'Ayyash is present, and there is well-known discussion of him) as the specific isnad concern.",
    ],
    narrator: "Reported: Abu Malik al-Ash'ari, describing the Prophet's ﷺ instruction — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass. The isnad's specific weak point is consistently identified as Isma'il ibn 'Ayyash (or, per one source, Muhammad ibn Isma'il ibn 'Ayyash).",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording confirms the fivefold list 'fathahu, wa nasrahu, wa nurahu, wa barakatahu, wa hudahu' (its opening, its victory, its light, its blessing, and its guidance) — this directly supports treating MDR-020's own 'وهدأيه' as a transcription irregularity for 'وَهُدَاهُ' (its guidance), consistent with the Stage 3A transcriptionNotes flag, though fullArabicText/originalDocumentText remain unedited per instruction.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Disputed among named authorities: al-Nawawi reportedly did not weaken its isnad; Ibn al-Qayyim graded it hasan; al-'Iraqi reportedly described it as having a good chain; against this, Ibn Hajar called it gharib (strange/isolated) and identified Isma'il ibn 'Ayyash's transmission as weak in this instance, and al-Albani first graded it hasan (in Sahih al-Jami') but later weakened it (in Da'if Abi Dawud). This is a genuine, named authenticity disagreement — including a documented change of position within al-Albani's own body of work — not merely a route or edition question.",
    gradingAuthority: "al-Nawawi, Ibn al-Qayyim, al-'Iraqi (accepting or not weakening) versus Ibn Hajar and al-Albani's later position (weakening) — reported via WebSearch synthesis only; not independently verified against each scholar's own primary work in this pass.",
    gradingNotes:
      "The specific isnad concern (Isma'il ibn 'Ayyash's transmission reliability, which varies by whether he narrates from Levantine or non-Levantine sheikhs) was not itself independently investigated in this pass — it is recorded as the reported basis for the dispute, not resolved. Al-Albani's own documented change of position (hasan in Sahih al-Jami', later weakened in Da'if Abi Dawud) is recorded as such, not collapsed into a single 'al-Albani said X' claim.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-020 (224 characters, its 'وهدأيه' irregularity already flagged in Stage 3A transcriptionNotes) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous declaration-plus-petition-plus-refuge sentence reported as part of one instruction, no source plurality indicated. The central finding is a genuine, named grading dispute for the underlying narration (see hadithGrading) — al-Nawawi/Ibn al-Qayyim/al-'Iraqi versus Ibn Hajar and al-Albani's later (though not earlier) position — directly comparable to MDR-014's disputed status; sourceResearchStatus is recorded as 'disputed' (the third use of this value in the register) for the same reason: a genuine authenticity disagreement among named authorities, not a route/edition question. Separately, WebSearch synthesis's consistent fivefold list ('fathahu/nasrahu/nurahu/barakatahu/hudahu') supports — but does not by itself, without a directly fetched raw source, conclusively confirm — that MDR-020's own 'وهدأيه' is a transcription irregularity for 'وَهُدَاهُ'; fullArabicText/originalDocumentText remain unedited per instruction, and this remains a flagged, not silently corrected, point. No explicit reward/virtue statement beyond the petition itself was found; virtueOrRewardClaim is left empty rather than inferred. Recommend: directly fetch the specific Sunan Abi Dawud hadith number and al-Albani's Da'if Abi Dawud entry to confirm exact wording, the 'وهدأيه'/'وَهُدَاهُ' question, and the precise scope of the isnad weakness.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently reports this as a hadith of Musnad Ahmad, narrated by 'Abd al-Rahman ibn Abza, describing the Prophet's ﷺ own practice of saying it both morning and evening ('kana yaquluhu idha asbaha wa idha amsa').",
    primaryReference: "Reportedly Musnad Ahmad (exact hadith number not confirmed in this pass) — per WebSearch synthesis, not independently confirmed against a directly fetched page.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 146837, title/snippet only, not fetched) — attributes the report to 'Abd al-Rahman ibn Abza and quotes Shu'ayb al-Arna'ut's grading (Takhrij al-Musnad) per the title.",
    ],
    narrator: "Reported: 'Abd al-Rahman ibn Abza — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording reads '...وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ' — including the word 'مُسْلِمًا' (Muslim) between 'حَنِيفًا' and 'وَمَا كَانَ'; MDR-021's own text reads '...حَنِيفًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ' without 'مُسْلِمًا'. This is recorded as an observed difference, not confirmed against any directly fetched or raw source, and not attributed to a recognised variant without further evidence.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly 'isnaduhu sahih 'ala shart al-Shaykhayn' (its isnad is sahih according to the criteria of the two Sahihs) per Shu'ayb al-Arna'ut, cited via an unfetched dorar.net title — not independently verified against a directly fetched page in this pass.",
    gradingAuthority: "Reportedly Shu'ayb al-Arna'ut (Takhrij al-Musnad), per an unfetched dorar.net title; not independently confirmed in this pass.",
    gradingNotes:
      "No wording comparison was performed against a directly fetched primary text in this pass; the 'مُسْلِمًا' presence/absence question (see sourceArabicWording) remains outside this grading's confirmed scope until a raw source is inspected.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-021 (181 characters) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous four-clause declaration of Islamic identity, no source plurality indicated. Checked against MDR-006/019/020 (other 'أَصْبَحْنَا' family records) and found textually and thematically distinct — a fitrah/millat-Ibrahim declaration, not a kingship/tahmid declaration — not merged with any of them. contentClassification/morningSpecificStatus are recorded as 'morning-and-evening' because WebSearch synthesis reports the narration's own frame as said both morning and evening ('idha asbaha wa idha amsa'), a wording-level usage instruction rather than register-placement inference. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass and the 'مُسْلِمًا' wording question remains open. Recommend: directly fetch Musnad Ahmad or an equivalent primary hosting to confirm exact wording and hadith number.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis locates a five-fold 'la ilaha illa Allah' formula matching MDR-022's own structure closely, narrated by Abu Hurayrah, graded 'sahih li-ghayrihi' by al-Albani (Sahih al-Targhib 3481), reported by al-Nasa'i in al-Sunan al-Kubra (9857), al-Isma'ili in al-Mu'jam (390), and al-Khatib in Tarikh Baghdad (2/184) 'with slight variation.' The Prophet ﷺ is reported to have counted the five phrases on his fingers ('ya'qiduhunna khamsan bi-asabi'ihi').",
    primaryReference: "Reportedly al-Nasa'i's al-Sunan al-Kubra 9857 — per WebSearch synthesis (via al-Albani's Sahih al-Targhib 3481), not independently confirmed against a directly fetched page.",
    secondaryReferences: [
      "al-Isma'ili's al-Mu'jam (390) and al-Khatib's Tarikh Baghdad (2/184) — reported as further routes 'with slight variation,' neither independently inspected in this pass.",
    ],
    narrator: "Reported: Abu Hurayrah — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording reads '...لا إلهَ إلَّا اللهُ ولا شريكَ له...' (with the connective 'و' before 'لا شريك له'); MDR-022's own text reads '...لَا إِلَهَ إِلَّا اللَّهُ لَا شَرِيكَ لَهُ...' (without 'و'). This is recorded as an observed difference, not confirmed against any directly fetched or raw source.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly 'sahih li-ghayrihi' (sahih through corroborating routes) per al-Albani, Sahih al-Targhib 3481 — per WebSearch synthesis, not independently verified against a directly fetched page in this pass.",
    gradingAuthority: "Reportedly al-Albani (Sahih al-Targhib), per WebSearch synthesis; not independently confirmed in this pass.",
    gradingNotes:
      "This grading, if the identification is correct, applies to the five-fold formula as a whole per the routes al-Albani reviewed — it does not resolve the specific 'و' wording point (see sourceArabicWording), which remains open.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim:
      "Reportedly: whoever says these five phrases in a day, a night, or a month, and dies within that day, night, or month, his sin is forgiven. The condition (dying within the stated period after reciting) is preserved together with the outcome, not shortened to an unconditional forgiveness claim.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-022's own transcribed text — must not be inserted into fullArabicText/originalDocumentText. Sourced from WebSearch synthesis only in this pass, not a directly fetched primary or secondary page; treated as a reported claim pending direct-source confirmation. The reported finger-counting gesture is a narrative detail about how the Prophet ﷺ demonstrated the formula, not part of the reward claim itself, and is not inserted into any research field beyond this note.",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-022 (250 characters) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous five-fold 'لا إله إلا الله' formula reported as a single fixed sequence in one narration, no source plurality indicated. Checked against MDR-023 (the closely related 10x tahlil formula immediately following it, per the existing Stage 3A transcriptionNotes) and found to be a structurally distinct, longer five-part formula, not a duplicate or truncation — not merged. No timing (morning/evening) instruction was located for this specific five-fold formula in this pass; morningSpecificStatus is left 'uncertain' rather than inferred from register placement among morning-dhikr entries. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass and the 'و' wording point remains open. Recommend: directly fetch al-Nasa'i's al-Sunan al-Kubra 9857 or an equivalent primary hosting to confirm exact wording.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently and specifically attributes this exact tahlil formula recited ten times to Abu Ayyub al-Ansari, Sahih Muslim 2693 (also cited as reported by al-Bukhari by one source, not independently confirmed).",
    primaryReference: "Reportedly Sahih Muslim 2693 — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 15928, title only, not fetched) — quotes the Sahih Muslim wording directly in its title, with the reward 'kana kaman a'taqa arba'ata anfusin min waladi Isma'il' (like one who freed four souls from the descendants of Isma'il). This is the PRIMARY reward claim for this record, per the identified Sahih Muslim route.",
      "dorar.net (Mawsoah Hadithiyah, sharh 75069, title only, not fetched) — a SEPARATE, SECONDARY route via al-Haythami's Majma' al-Zawa'id reports a different reward figure for what appears to be the same ten-times formula: 'ka'adli 'ashri raqabatin' (equivalent to ten slaves). Majma' al-Zawa'id is a secondary classical compilation that quotes and evaluates reports from earlier collections — it is not Sahih Muslim's own canonical text, and this route's own exact source, isnad, and grading were not inspected in this pass (title-level lead only, page not fetched). This figure is not merged into or substituted for the Sahih Muslim wording.",
    ],
    narrator: "Reported: Abu Ayyub al-Ansari — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording matches MDR-023's own text closely on substance, but was not checked character-for-character against any inspected source.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly Sahih Muslim's own canonical inclusion — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    gradingAuthority: "Sahih Muslim's own canonical status, as reported by WebSearch synthesis; not independently verified in this pass.",
    gradingNotes:
      "Source hierarchy: the Sahih Muslim route has stronger source standing because it is reported as part of Sahih Muslim's own canonical collection, directly identified in this pass (Sahih Muslim 2693) — this makes 'equivalent to freeing four souls from the descendants of Isma'il' the PRIMARY reward claim for this record. A separate, SECONDARY route via al-Haythami's Majma' al-Zawa'id (a secondary classical compilation, not Sahih Muslim's own text) reports a different figure — 'equivalent to ten slaves' — for what appears to be the same ten-times formula; this is recorded as a secondary-route report, not merged into or substituted for the Sahih Muslim wording, and its own exact source, isnad, and grading remain uninspected in this pass (title-level lead only). Both the primary and secondary figures remain tool-mediated/WebSearch-synthesis-level in this audit — the direct primary Sahih Muslim page has not yet been inspected, so 'primary' here describes the route's identified collection standing, not a raw-verified wording. This grading (Sahih Muslim's own inclusion) covers the Sahih Muslim route specifically, not the Majma' al-Zawa'id route's own separate report. A related but distinct hundred-times version of a similar formula (with a different reward: ten good deeds, a hundred good deeds written, protection from Satan) was also located in this pass and remains explicitly excluded — not conflated with either reward figure recorded for this ten-times record.",
    repetitionCount: 10,
    repetitionEvidence:
      "The source-document '10x' annotation is directly consistent with the located Sahih Muslim wording's own explicit 'ten times' ('ashra mirar') instruction — a narration-internal repetition instruction, not merely an editorial display choice, though not confirmed against a directly fetched primary page in this pass.",
    virtueOrRewardClaim:
      "Primary claim (Sahih Muslim route, identified in this pass as Sahih Muslim 2693): saying this tahlil formula ten times is equivalent to freeing four souls from the descendants of Isma'il — this is the primary reward claim for this record because it is reported as part of Sahih Muslim's own canonical collection. Secondary claim (a separate route via al-Haythami's Majma' al-Zawa'id, a secondary classical compilation, not Sahih Muslim's own text): a different figure is reported for what appears to be the same ten-times formula — equivalent to ten slaves. The secondary figure is recorded here as a distinct, separate-route report, not merged into or substituted for the primary Sahih Muslim figure, and its own source, chain, and grading remain uninspected in this pass.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-023's own transcribed text — must not be inserted into fullArabicText/originalDocumentText. Sourced from WebSearch synthesis only in this pass, not a directly fetched primary or secondary page; both the primary and secondary reward figures are treated as reported claims pending direct-source confirmation — the direct Sahih Muslim primary page has not yet been inspected, so this record's 'primary' designation reflects the identified route's canonical-collection standing (Sahih Muslim), not a raw-verified wording. The two distinct reward figures (four souls, primary Sahih Muslim route, vs. ten slaves, secondary Majma' al-Zawa'id route) are kept separate as evidence of route variation and are not merged into a single claim — the secondary figure is not presented as equal in source authority to the primary Sahih Muslim figure.",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-023 (125 characters) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous tahlil formula plus the source-document's '10x' annotation, applying to the whole formula as one unit. Checked against MDR-022 (the preceding five-fold formula) and found structurally distinct — not merged, consistent with the existing Stage 3A transcriptionNotes distinguishing the two. Narrow correction (superseding the initial Stage 3B decision): the two reward figures were first recorded as equally weighted, with neither route stated as more authoritative — on review, this understated the actual source hierarchy. The Sahih Muslim route (identified in this pass as Sahih Muslim 2693, Abu Ayyub al-Ansari) has stronger source standing because it is reported as part of Sahih Muslim's own canonical collection; 'equivalent to freeing four souls from the descendants of Isma'il' is therefore recorded as the PRIMARY reward claim. The 'ten slaves' figure, reported via a separate route (al-Haythami's Majma' al-Zawa'id, a secondary classical compilation), is recorded as a SECONDARY-route report — not discarded, but not merged into or substituted for the Sahih Muslim wording, and its own exact source, chain, and grading remain uninspected in this pass. Both figures remain tool-mediated/WebSearch-synthesis-level, and the direct Sahih Muslim primary page has not yet been inspected — 'primary' here describes route/collection standing, not raw-verified wording. A related hundred-times version of a similar tahlil formula (found during this pass but not this record's own subject) remains explicitly excluded, not conflated with either reward figure. No timing (morning/evening) instruction was located specifically for the ten-times version in this pass; morningSpecificStatus is left 'uncertain' rather than inferred from register placement. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass. Recommend: directly fetch Sahih Muslim 2693 to confirm exact wording of the primary route, and directly inspect al-Haythami's Majma' al-Zawa'id (sharh 75069) to confirm the secondary route's own isnad and grading.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis consistently attributes this four-phrase formula to Juwayriyyah bint al-Harith (a wife of the Prophet ﷺ): the Prophet ﷺ left her early in the morning after Fajr while she was in her place of prayer, and returned after mid-morning (duha) to find her still there; he said he had said four words three times since leaving her that, if weighed against everything she had said, would outweigh it. Reported by Muslim, Abu Dawud, al-Nasa'i, Ibn Majah, and al-Tirmidhi.",
    primaryReference: "Reportedly Sahih Muslim (exact hadith number not confirmed in this pass) — per WebSearch synthesis.",
    secondaryReferences: [
      "WebSearch synthesis reports a separate wording within Muslim's own routes where each of the four phrases is individually prefixed with 'سبحان الله' ('Subhan Allah 'adada khalqihi, Subhan Allah rida nafsihi, Subhan Allah zinata 'arshihi, Subhan Allah midada kalimatihi') rather than one combined opening — a documented in-collection wording variant, not independently inspected in this pass, and not assumed to be the same as or different from MDR-024's own combined-opening form without a raw comparison.",
    ],
    narrator: "Reported: Juwayriyyah bint al-Harith — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported combined-opening wording matches MDR-024's own text closely on substance, but was not checked character-for-character against any inspected source, and a separate per-phrase-prefixed variant is also reported within the same collection (see secondaryReferences).",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly Sahih Muslim's own canonical inclusion — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    gradingAuthority: "Sahih Muslim's own canonical status, as reported by WebSearch synthesis; not independently verified in this pass.",
    gradingNotes:
      "This grading, if the identification is correct, applies to the underlying narration generally, not to a specific choice between the combined-opening and per-phrase-prefixed wordings, which remain an open comparison (see sourceArabicWording).",
    repetitionCount: 3,
    repetitionEvidence:
      "The source document carries no numeric annotation for this record (sourceDocumentAnnotations is empty), unlike MDR-002/MDR-011/MDR-017. repetitionCount is nonetheless populated here because the located narration's own wording explicitly states the four-phrase formula was said three times ('thalatha kalimat... thalatha marrat') — a narration-internal repetition instruction, not a source-document display convention. This is recorded as narration-supported rather than source-document-supported, a distinction preserved explicitly rather than implied.",
    virtueOrRewardClaim:
      "Reportedly: these four words, said three times, would outweigh everything Juwayriyyah had said since the Prophet ﷺ left her that morning. The comparative/outweighing nature of the claim (not a fixed numeric reward) and the three-times condition are both preserved, not simplified to an unconditional virtue claim.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-024's own transcribed text — must not be inserted into fullArabicText/originalDocumentText. Sourced from WebSearch synthesis only in this pass, not a directly fetched primary or secondary page; treated as a reported claim pending direct-source confirmation. The narrative frame (the Prophet ﷺ leaving and returning between Fajr and duha) is context establishing when the exchange occurred, not itself treated as a morning-specific recitation instruction — this distinction is preserved in morningSpecificStatus, which is left 'uncertain' rather than inferred from this narrative timing detail.",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-024 (102 characters) was not assumed to be one hadith, Prophetic, or authentic, or correctly repeated three times merely because the underlying narration mentions a count; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous four-phrase tasbih formula, no source plurality indicated. The central finding is that the narrative frame (the Prophet ﷺ finding Juwayriyyah still in her prayer place between Fajr and duha) is a CONTEXTUAL detail about when the exchange occurred, not a prescriptive 'say this in the morning' instruction — this is explicitly not treated as timing evidence, distinguishing it from records where a narration's own opening frame directly instructs morning/evening usage; morningSpecificStatus is left 'uncertain' accordingly, per the rule against inferring timing from placement or narrative-setting details alone. repetitionCount (3) is populated from the narration's own explicit count despite the source document carrying no annotation for this record — recorded as narration-supported, not source-document-supported (see repetitionEvidence). A documented in-collection wording variant (per-phrase-prefixed 'Subhan Allah' vs. one combined opening) was found and is recorded as a genuine, evidence-based comparison point, not assumed resolved either way. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass. Recommend: directly fetch Sahih Muslim to confirm exact wording and resolve the combined-vs-per-phrase-prefixed wording question.",
    importStatus: "research-only",
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
    contentClassification: "morning-and-evening",
    morningSpecificStatus: "morning-and-evening",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis reports Sunan Abi Dawud 5075: the Prophet ﷺ taught this formula to one of his daughters (not further identified by name in the sources located in this pass), instructing 'say when you wake up: ...'; reciting it in the morning reportedly gives protection until evening, and in the evening until morning.",
    primaryReference: "Reportedly Sunan Abi Dawud 5075 — per WebSearch synthesis, not independently confirmed against a directly fetched page in this pass.",
    secondaryReferences: [
      "WebSearch synthesis also notes this hadith appears in al-Nasa'i's al-Sunan al-Kubra; not independently inspected in this pass.",
    ],
    narrator: "Reported: taught by the Prophet ﷺ to one of his daughters — per WebSearch synthesis; the specific daughter is not named in the sources located in this pass, and is not assumed to be Fatimah or any other specific daughter without further verification.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording matches MDR-025's own text closely on substance, but was not checked character-for-character against any inspected source.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Not independently confirmed in this pass — no specific grading word was located via WebSearch synthesis for hadith 5075 specifically; recorded as an open question rather than assumed sahih or da'if.",
    gradingAuthority: "",
    gradingNotes: "No grading authority or wording was located in this pass; this is left unresolved rather than inferred from the report's inclusion in Sunan Abi Dawud alone.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim:
      "Reportedly: whoever recites this in the morning is protected until evening; whoever recites it in the evening is protected until morning. Both the timing condition and the reciprocal (morning-to-evening / evening-to-morning) structure of the claim are preserved together, not simplified to an unconditional protection claim.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-025's own transcribed text — must not be inserted into fullArabicText/originalDocumentText. Sourced from WebSearch synthesis only in this pass, not a directly fetched primary or secondary page; treated as a reported claim pending direct-source confirmation.",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-025 (215 characters) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous tasbih-plus-declaration sentence, no source plurality indicated. contentClassification/morningSpecificStatus are recorded as 'morning-and-evening' because the reward claim's own reciprocal structure ('morning recitation protects until evening; evening recitation protects until morning') implies narration-level usage at both times, not because of register placement. The specific daughter the Prophet ﷺ taught this to was not identified in this pass and is not assumed to be Fatimah or otherwise; recorded precisely as 'one of his daughters' per the located sources. No specific grading was located for hadith 5075 in this pass. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass. Recommend: directly fetch Sunan Abi Dawud 5075 to confirm exact wording, the specific daughter's identity, and grading.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis locates THREE separately reported hadiths near this wording, none of which exactly matches MDR-026's own combined-and-counted form: (1) Sahih al-Bukhari 6682 / Sahih Muslim 2694, Abu Hurayrah — 'Kalimatan habibatan ila'r-Rahman, khafifatan 'ala'l-lisan, thaqilatan fi'l-mizan: Subhan Allah wa bihamdihi, Subhan Allah al-'Azim' — two words described as light on the tongue, heavy on the scale, with NO numeric repetition count stated; (2) Sahih al-Bukhari 6405 / Sahih Muslim, Abu Hurayrah — 'man qala Subhan Allah wa bihamdihi fi yawmin mi'ata marrah, huttat khatayahu wa in kanat mithla zabad al-bahr' — a hundred-times count attached to 'Subhan Allah wa bihamdihi' ALONE, not the combined two-phrase form; (3) a hadith of Umm Hani reporting a hundred-times tasbih, a hundred-times takbir, and a hundred-times tahlil as three SEPARATE hundred-times counts, not the same two phrases as MDR-026.",
    primaryReference: "Not confirmed in this pass — MDR-026's own combined 'Subhan Allah wa bihamdihi, Subhan Allah al-'Azim wa bihamdihi' phrasing with a single shared '100x' count does not exactly match any of the three located hadiths individually.",
    secondaryReferences: [],
    narrator: "Abu Hurayrah is the reported narrator for the two closest located hadiths (Bukhari 6682/Muslim 2694 and Bukhari 6405); not confirmed as the narrator of MDR-026's own specific combined-and-counted form, which was not located as a single matching report in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass, and no located WebSearch-synthesis quotation exactly matches MDR-026's own combined-and-counted structure. This is recorded as an open identification question, not resolved or assumed in either direction.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Not assigned to MDR-026's own specific combined form — the two closest located hadiths (Bukhari 6682/Muslim 2694; Bukhari 6405) are each individually sahih per their collections, but neither one, by itself, authenticates MDR-026's combined-and-100x'd form.",
    gradingAuthority: "",
    gradingNotes: "Assigning a grading to MDR-026 as transcribed would require establishing which (if either) of the closest located hadiths it actually reflects, or whether it is a later compilation's combination of both — not established in this pass.",
    repetitionCount: 100,
    repetitionEvidence:
      "The source-document '100x' annotation matches the numeric count found in one of the three located hadiths (Bukhari 6405/Muslim, 'Subhan Allah wa bihamdihi' said ALONE, a hundred times) but that located hadith does not use the combined two-phrase form MDR-026's own text carries; the closest located hadith that DOES use the combined two-phrase form (Bukhari 6682/Muslim 2694, 'two words... light on the tongue') carries NO numeric count at all. repetitionCount (100) is retained from Stage 3A but is NOT confirmed as narration-supported for the combined form specifically — this is recorded as an open question, not resolved.",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-026 (80 characters) was not assumed to be one hadith, Prophetic, or authentic, or to carry an authenticated 100x count merely because a source-document annotation states it; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — the text is transcribed as one combined two-phrase utterance with a single trailing count, and this pass's finding concerns identification, not internal clause structure. The central finding is that MDR-026's own combined-and-counted form does not exactly match any single located hadith: the 'two words, light on the tongue' hadith (Bukhari 6682/Muslim 2694) carries no count, while the '100 times' hadith (Bukhari 6405) applies its count to 'Subhan Allah wa bihamdihi' alone, not the combined two-phrase form; a third hadith (Umm Hani) reports separate hundred-times counts for tasbih, takbir, and tahlil individually, not this record's two-phrase combination. None of this is treated as evidence that MDR-026 is inauthentic — only that its specific combined-and-counted form was not matched to a single primary source in this streamlined pass. sourceResearchStatus is 'in-progress' for this reason. No explicit virtue/reward statement specific to MDR-026's own combined form was found; virtueOrRewardClaim is left empty rather than borrowed from either of the two closest located hadiths. Recommend: directly fetch Sahih al-Bukhari 6682, 6405, and Sahih Muslim 2694 to determine which, if any, MDR-026 actually reflects, or whether it is a later compilation's combination.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. MDR-027's own structure ('سُبْحَانَ اللَّهِ | الْحَمْدُ لِلَّهِ | لَا إِلَٰهَ إِلَّا اللَّهُ مَائَةَ مَرَّةٍ اللَّهُ أَكْبَرُ 100x') is structurally ambiguous: it is not established in this pass whether the '100 times' applies only to 'لا إله إلا الله', to all four words, or whether 'الله أكبر' is a separate, uncounted fourth item. Two candidate hadiths were located, neither an exact match: (a) Abu Hurayrah, 'man qala la ilaha illa Allah wahdahu la sharika lahu, lahu al-mulk wa lahu al-hamd, wa huwa 'ala kulli shay'in qadir, 100 times... equivalent to 10 slaves, 100 good deeds written, 100 bad deeds erased, protection from Satan until evening' — this uses the LONGER tahlil formula (matching MDR-022/023's family), not the single word 'لا إله إلا الله' alone as MDR-027's text appears to show; (b) Umm Hani, a hadith reporting 100 tasbih + 100 takbir + 100 tahlil as three SEPARATE counted acts (no tahmid mentioned) — closer in structure to MDR-027's multi-word-with-counts form, but omits 'الحمد لله' and does not match word-for-word.",
    primaryReference: "Not confirmed in this pass — MDR-027's own three-part structure with an embedded '100 times' does not exactly match either candidate hadith located.",
    secondaryReferences: [
      "The Qur'anic/hadith concept of 'al-baqiyat al-salihat' (Subhan Allah, Alhamdulillah, La ilaha illa Allah, Allahu Akbar as a set of four) was located as a general thematic reference, not a specific numbered-repetition hadith matching MDR-027's structure.",
    ],
    narrator: "Not confirmed in this pass — candidate narrators (Abu Hurayrah for the longer-tahlil 100x hadith; Umm Hani for the triple-100x hadith) were not matched to MDR-027's own exact structure.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass, and the scope of '100 times' within MDR-027's own three-part, '|'-separated structure remains genuinely ambiguous — not resolved by assuming it applies to all four words or to only one.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Not assigned — the underlying narration itself has not been conclusively identified in this pass; assigning a grading without a confirmed source would misattribute authority.",
    gradingAuthority: "",
    gradingNotes: "No grading is recorded because MDR-027's own specific three-part, '100-times' structure was not matched to a single identified narration in this pass.",
    repetitionCount: 100,
    repetitionEvidence:
      "The source document carries an explicit '100x' annotation AND the phrase 'مَائَةَ مَرَّةٍ' embedded within the transcribed text itself (per the existing Stage 3A transcriptionNotes), so the count of 100 is clearly document-supplied. What that count applies to WITHIN the three-part structure (تسبيح alone, all four words, or something else) was not resolved against a directly fetched or matched primary source in this pass — retained as document-supplied, not narration-confirmed for a specific scope.",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-027 (106 characters) was not assumed to be one hadith, Prophetic, or authentic, or to have a settled '100 times' scope, merely because a count is embedded in the source document; checked against WebSearch synthesis only (no direct fetch performed). Segmentation was considered given the '|'-separated three-part structure but NOT adopted as a formal clause map in this pass: the source document's own '|' marks are preserved verbatim within fullArabicText/originalDocumentText (following the MDR-017 precedent of preserving '|'-separated source-document structure without a separate clause-map file), and the genuine open question here is identification/scope, not a case of clearly-established independent source components each needing separate reconstructed proof. The central finding is that MDR-027's specific three-part-plus-100x structure does not exactly match either of the two closest located hadiths (a longer-tahlil 100x hadith attributed to Abu Hurayrah, or Umm Hani's triple-100x tasbih/takbir/tahlil hadith) — this is left genuinely unresolved, not forced into either candidate. sourceResearchStatus is 'in-progress' for this reason. Recommend: directly fetch a primary hosting of both candidate hadiths and consult a critical edition or concordance to determine whether MDR-027 reflects one of them, a compilation's combination, or a distinct third source.",
    importStatus: "research-only",
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
    contentClassification: "prophetic-evening-dhikr",
    morningSpecificStatus: "evening-only",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis locates this as ONE hadith (not two glued-together narrations, contrary to an initial structural hypothesis formed before this search): Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla, narrated by 'Abdullah ibn 'Amr ibn al-'As, reporting that saying (in the evening) 'Amsayna wa amsa al-mulk lillah, wa'l-hamdu lillah, a'udhu billahi alladhi yumsiku as-sama'a an taqa'a 'ala al-ard illa bi-idhnihi, min sharri ma khalaqa wa nashara, wa min sharri ash-shaytani wa shirkihi' three times gives protection from every sorcerer, diviner, and devil until morning (and the reciprocal for morning recitation, per the same report).",
    primaryReference: "Reportedly Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla — per WebSearch synthesis, exact entry number not confirmed in this pass.",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 20406, title only, not fetched) — this title concerns the separate, unrelated Ibn Mas'ud/Sahih Muslim 'amsayna wa amsa al-mulk lillah' hadith (MDR-006's own family); checked and explicitly NOT treated as the source of MDR-028's own text, since MDR-028's continuation ('a'udhu billahi alladhi yumsiku as-sama'a...') does not appear anywhere in that Ibn Mas'ud narration.",
    ],
    narrator: "Reported: 'Abdullah ibn 'Amr ibn al-'As — per WebSearch synthesis; not independently re-verified against a directly fetched page in this pass.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported closing reads '...min sharri ma khalaqa wa nashara, wa min sharri ash-shaytani wa shirkihi' (from the evil of what He created and spread, and from the evil of Satan and his shirk); MDR-028's own text instead reads '...مِنْ شَرِّ مَا خَلَقَ وَذَرَأَ وَبَرَأَ' (from the evil of what He created, and dispersed, and originated) — using three creation-verbs and omitting the Satan/shirk clause entirely. This is recorded as an observed difference, not confirmed against any directly fetched or raw source, and not attributed to a recognised variant without further evidence.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Reportedly a weak chain containing an unnamed ('mubham') narrator, per WebSearch synthesis — but the same synthesis notes that standards for accepting narrations in fada'il (virtues) contexts are more lenient than for rulings, and this report is treated as falling in that category by the source consulted. Not independently verified against a directly fetched page in this pass; not upgraded to 'authentic' on the basis of this leniency note.",
    gradingAuthority: "Not independently confirmed in this pass — reported via WebSearch synthesis only.",
    gradingNotes:
      "The weak-chain finding applies to the report as a whole (formula plus reward clause together, per Ibn al-Sunni) — it was not separated in this pass into a wording-only assessment versus a reward-only assessment.",
    repetitionCount: 3,
    repetitionEvidence:
      "The source document carries no numeric annotation for this record beyond the 'Evening only' heading (sourceDocumentAnnotations does not include a count). repetitionCount is nonetheless populated here because the located Ibn al-Sunni report's own wording explicitly states the formula is said three times in the evening (with a reciprocal three-times-in-the-morning form) — a narration-internal repetition instruction, not a source-document display convention. This is recorded as narration-supported rather than source-document-supported.",
    virtueOrRewardClaim:
      "Reportedly: saying this three times in the evening gives protection from every sorcerer, diviner, and devil until morning (and the reciprocal — three times in the morning protects until evening — per the same report, though MDR-028's own compiled entry is explicitly headed 'Evening only'). The count (three times), the timing, and the specific protections named (sorcerer, diviner, devil) are preserved together, not simplified to a generic 'protection' claim.",
    virtueEvidence:
      "Narration-attached evidence, not part of MDR-028's own transcribed text — must not be inserted into fullArabicText/originalDocumentText. Sourced from WebSearch synthesis only in this pass, not a directly fetched primary or secondary page; treated as a reported claim pending direct-source confirmation, and explicitly tied to the same weak-chain grading recorded in hadithGrading — not presented as more certain than that grading allows.",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-028 (207 characters, its explicit 'Evening only' heading already flagged in Stage 3A) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). An initial working hypothesis — that this entry glues together two separate narrations (the Ibn Mas'ud/Sahih Muslim evening hadith and a separate refuge clause) — was tested against search evidence and REJECTED: WebSearch synthesis locates ONE hadith (Ibn al-Sunni, 'Abdullah ibn 'Amr ibn al-'As) containing both the 'amsayna wa amsa al-mulk lillah' opening and the sky-refuge clause together as a single report, distinct from the unrelated Ibn Mas'ud/MDR-006 family (checked and explicitly not merged with it, per secondaryReferences). Not segmented — treated as one continuous unit per this finding, no clause-map file created. contentClassification/morningSpecificStatus are recorded as 'prophetic-evening-dhikr'/'evening-only' specifically because the source document's own explicit 'Evening only' heading is direct, non-inferential evidence about how this compiled entry is meant to be used — distinct from the underlying hadith's own reciprocal morning/evening structure (reported separately in virtueOrRewardClaim), which is not reflected in how this specific entry was compiled. This is a deliberate distinction: the compiled entry's own scope (evening-only, per its explicit heading) is not the same question as the underlying narration's fuller reported usage. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass, the wording differs from the located report on the closing clause (see sourceArabicWording), and the chain is reported weak (with a fada'il-leniency caveat, not a full authentication). Recommend: directly fetch Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla to confirm exact wording and assess the unnamed narrator's identity if possible.",
    importStatus: "research-only",
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
    contentClassification: "composite-text",
    morningSpecificStatus: "morning-only",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. MDR-029's own text joins TWO independently reported narrations with an explicit '|' divider in the source document, and this pass treats them as two separate source conclusions rather than one: Part 1 (before '|') — Anas ibn Malik, Jami' al-Tirmidhi, graded 'hasan gharib' by al-Tirmidhi himself; WebSearch synthesis notes 'many scholars weakened it' while others (including Ibn Baz and al-Albani, per corroborating routes) graded it hasan — 'man salla al-fajr fi jama'atin thumma qa'ada yadhkuru Allah hatta tatlu'a ash-shams thumma salla rak'atayni kanat lahu ka'ajri hajjatin wa 'umratin, tammatin tammatin tammatin' (the reward phrase 'tammatin' is reported repeated three times for emphasis in the located wording; MDR-029's own text has 'تَامَّةٍ' only once). Part 2 (after '|') — a Hadith Qudsi via Nu'aym ibn Hammar al-Ghatafani, reported by Abu Dawud and al-Tirmidhi, graded sahih by al-Albani (Sahih Abi Dawud) and by al-Nawawi (al-Khulasa) — 'yaqulu Allahu 'azza wa jalla: ya ibna Adam, la ta'jizni min arba'i raka'atin fi awwali naharika, akfika akhirahu' (MDR-029's own text uses 'ارْكَعْ لِي' — 'bow/pray for Me' — rather than the located 'لا تعجزني من' — 'do not fail Me [in]').",
    primaryReference: "Part 1: reportedly Jami' al-Tirmidhi (exact number not confirmed in this pass). Part 2: reportedly Sunan Abi Dawud / Jami' al-Tirmidhi, Musnad Ahmad (Nu'aym ibn Hammar al-Ghatafani's report; exact numbers not confirmed in this pass).",
    secondaryReferences: [
      "dorar.net (Mawsoah Hadithiyah, sharh 149938, title only, not fetched) — attributes Part 1 to Anas ibn Malik, graded by al-Albani (Sahih al-Jami') per the title.",
      "dorar.net (Mawsoah Hadithiyah, sharh 35137, title only, not fetched) — attributes Part 2 to Nu'aym ibn Hammar al-Ghatafani, graded by al-Albani (Sahih Abi Dawud) per the title.",
    ],
    narrator: "Part 1: Anas ibn Malik. Part 2: Nu'aym ibn Hammar al-Ghatafani (a Hadith Qudsi — Allah's own words reported through the Prophet ﷺ). These are two distinct narrators for two distinct narrations, not one narrator for the whole entry.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. Part 1: the located wording repeats 'تَامَّةٍ' three times ('tammatin tammatin tammatin') for emphasis; MDR-029's own text has it once. Part 2: the located wording uses the construction 'لا تعجزني من أربع ركعات' (do not fail Me [in] four rak'ahs); MDR-029's own text uses 'ارْكَعْ لِي أَرْبَعَ رَكَعَاتٍ' (bow/pray for Me four rak'ahs) — a different verb and construction. Both differences are recorded precisely, not attributed to a recognised variant without further evidence.",
    wordingMatchStatus: "unresolved",
    hadithGrading:
      "Part 1: disputed among scholars per WebSearch synthesis — al-Tirmidhi's own classification is 'hasan gharib'; 'many scholars weakened it'; others (reportedly including Ibn Baz and al-Albani via corroborating routes) graded it hasan. Part 2: reportedly sahih, graded by al-Albani (Sahih Abi Dawud) and al-Nawawi (al-Khulasa), with no disagreement located in this pass. These two gradings apply to their own respective parts only — Part 2's stronger, undisputed grading does not extend to authenticate Part 1's wording or vice versa.",
    gradingAuthority: "Part 1: al-Tirmidhi (hasan gharib, self-graded); disputed among later scholars (some weakening, others — reportedly Ibn Baz and al-Albani via supporting routes — grading hasan). Part 2: al-Albani and al-Nawawi (sahih), reported without disagreement in this pass.",
    gradingNotes:
      "The two parts must not be treated as a single graded unit: Part 1's grading is itself disputed among scholars (though this pass does not use 'disputed' as the record's overall sourceResearchStatus, since Part 2's grading is not disputed and wording remains generally unresolved across both parts — see sourceResearchStatus reasoning in editorialNotes). Neither part's grading is extended to authenticate the other part's wording, count, or reward.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim:
      "Part 1: reportedly, the person who performs Fajr in congregation, remains seated remembering Allah until sunrise, then performs two rak'ahs, receives a reward described in the located narration as comparable to ('ka-ajri', 'like the reward of') a complete Hajj and 'Umrah. All three named actions (congregational Fajr, remaining in dhikr until sunrise, the two rak'ahs) are preserved as a single conditioned sequence, not separated from the outcome. The located wording reportedly repeats 'تَامَّةٍ' ('complete') three times for emphasis; MDR-029's own protected text contains it once — this difference is preserved, not smoothed over. This is NOT restated as a guaranteed Hajj, a replacement for Hajj, an actual (literal) Hajj and 'Umrah, or an unconditional reward — the wording is comparative ('like the reward of'), not an equivalence claim, and remains contingent on performing all three actions together. Part 2: reportedly, Allah 'azza wa jalla says (a Hadith Qudsi) that the servant who performs four rak'ahs at the beginning of the day will be sufficed by Him for the remainder of that day. The four-rak'ah count, the 'beginning of the day' timing, the sufficiency outcome, and the statement's Hadith-Qudsi status (words attributed to Allah, reported through the Prophet ﷺ) are all preserved together. This is NOT simplified into 'Allah guarantees everything for the day' — the sufficiency is specifically and only tied to performing the four rak'ahs at the day's start. Part 1 and Part 2 are two separate claims about two separate narrations and must not be read as one combined promise.",
    virtueEvidence:
      "Both outcome statements are already represented within MDR-029's own protected source-document text (fullArabicText/originalDocumentText already contain 'كَأَجْرِ حَجَّةٍ وَعُمَرَةٍ تَامَّةٍ' for Part 1 and 'أَكْفِكْ آخِرَهُ' for Part 2) — virtueOrRewardClaim/virtueEvidence record this pass's research-backed provenance and precise scope for wording already present in the transcription, not new content; nothing has been inserted into originalDocumentText or fullArabicText, which remain byte-for-byte unedited. Part 1 and Part 2 belong to two separate narrations (see narrator, hadithGrading) and their evidentiary bases must not be merged: Part 1's grading is disputed among named scholars (see gradingNotes); Part 2's grading is separately reported sahih, with no disagreement located in this pass. Neither grading extends to authenticate the other clause's outcome statement — Part 1's disputed status does not weaken Part 2's reported sahih grading, and Part 2's sahih grading does not resolve Part 1's dispute. Both outcome statements' exact wording remains WebSearch-synthesis-level in this pass, not independently verified against a directly fetched or raw primary text — see src/lib/dhikr-research/audits/mdr-029-clause-map.ts for the full per-clause breakdown, including the specific wording differences recorded for each part (Part 1's single vs. triple 'تَامَّةٍ'; Part 2's 'ارْكَعْ لِي' vs. the located 'لا تعجزني من').",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-029 (236 characters, its 'ACTION' label already flagged in Stage 3A as not a recited dua in the same sense as other entries) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). contentClassification is recorded as 'composite-text' — the first and only use of this value across MDR-021–030 — specifically because MDR-029 joins TWO independently reported, differently-graded, differently-narrated hadiths with an explicit '|' divider in the source document itself (Part 1: Anas ibn Malik, Tirmidhi, disputed grading; Part 2: Nu'aym ibn Hammar al-Ghatafani, Hadith Qudsi, sahih), not merely a text with several clauses from one narration. This is distinguished from ordinary multi-clause records elsewhere in this register, which were NOT classified as composite, per the explicit rule against calling a record composite merely because it has multiple clauses. Narrow correction (superseding the initial Stage 3B decision): a formal clause map was subsequently created at src/lib/dhikr-research/audits/mdr-029-clause-map.ts (MDR-029-A, MDR-029-B), on review that the source document's own '|' divider is a genuine source-plurality boundary between two independently sourced, differently-graded narrations, not merely a within-narration pause of the kind the MDR-017 precedent (two alternative wordings of ONE reported hadith) addresses — MDR-017's precedent was too narrow a basis for leaving MDR-029 without a formal clause map. The two-clause reconstruction reproduces MDR-029.originalDocumentText exactly (236 characters; clause A 124 characters including its trailing ' | ' separator exactly as transcribed, clause B 112 characters), verified programmatically in tests/dhikr/dhikr-source-register-mdr-021-030-batch-audit.test.ts. virtueOrRewardClaim and virtueEvidence, left empty in the initial pass, are now populated: both outcome statements were already present in MDR-029's own protected transcription, and these fields now record this pass's research-backed provenance and scope for that existing wording, distinguishing Part 1's comparative, disputed-grading Hajj/'Umrah claim from Part 2's Hadith-Qudsi sufficiency claim, without merging them into one promise. morningSpecificStatus is recorded as 'morning-only' because both parts concern morning-specific practices by their own content (Part 1: Fajr through sunrise; Part 2: 'awwal al-nahar' — the beginning of the day) — not inferred from register placement. sourceResearchStatus is retained as 'in-progress', not 'disputed' at the whole-record level, even though Part 1's own grading is disputed: the record contains two components with different evidentiary states (Part 1 disputed, Part 2 undisputed-but-unfetched), and per the clause map's own part-specific sourceResearchStatus values (Clause A: 'disputed'; Clause B: 'in-progress'), a single whole-record label would obscure that distinction rather than clarify it. Recommend: directly fetch Jami' al-Tirmidhi (Part 1) and Sunan Abi Dawud (Part 2) to confirm exact wording for each part separately.",
    importStatus: "research-only",
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
    contentClassification: "general-prophetic-supplication",
    morningSpecificStatus: "uncertain",
    sourceResearchStatus: "in-progress",
    primaryCollection:
      "Not directly fetched in this streamlined batch pass — evidence is WebSearch synthesis only, not an inspected primary page. WebSearch synthesis locates a closely matching du'a reportedly taught by the Prophet ﷺ to 'Salman al-Khayr' ('سلمان الخير'), narrated by Abu Hurayrah, found in al-Hakim's Mustadrak, al-Tabarani's al-Mu'jam al-Awsat, and Musnad Ahmad. Shu'ayb al-Arna'ut is reported to have graded its isnad da'if (weak).",
    primaryReference: "Reportedly al-Mustadrak 'ala al-Sahihayn (al-Hakim), al-Mu'jam al-Awsat (al-Tabarani), Musnad Ahmad — exact numbers not confirmed in this pass.",
    secondaryReferences: [],
    narrator: "Reported (of the located hadith): Abu Hurayrah, relating that the Prophet ﷺ taught this du'a to 'Salman al-Khayr' ('سلمان الخير'). This does NOT match MDR-030's own source-document embedded attribution, which reads 'سُلَيْمَان' ('Sulaiman') — a different name from 'سلمان' ('Salman'). This discrepancy is recorded precisely, not resolved: it is not established in this pass whether MDR-030's 'سُلَيْمَان' is a transcription confusion with 'سلمان الخير', a reference to a different individual entirely (e.g. the Prophet Sulayman ibn Dawud, which would be a materially different attribution), or something else. Neither reading is assumed correct.",
    sourceArabicWording:
      "Not obtained from a directly fetched page in this pass. WebSearch synthesis's own reported wording ('اللهم إني أسألك صحة إيمان وإيماناً في خلق حسن ونجاحاً يتبعه فلاح... ورحمة منك وعافية ومغفرة منك ورضواناً') matches MDR-030's own text closely on substance, but was not checked character-for-character against any inspected source.",
    wordingMatchStatus: "unresolved",
    hadithGrading: "Reportedly da'if (weak) per Shu'ayb al-Arna'ut, cited via WebSearch synthesis — not independently verified against a directly fetched page in this pass.",
    gradingAuthority: "Reportedly Shu'ayb al-Arna'ut; not independently confirmed in this pass.",
    gradingNotes:
      "This weak-isnad grading applies to the located hadith (narrator Abu Hurayrah, recipient 'Salman al-Khayr') as a whole — it has not been separately assessed against the specific narrator-name question recorded in the narrator field, since the underlying source has not been directly fetched.",
    repetitionCount: undefined,
    repetitionEvidence: "",
    virtueOrRewardClaim: "",
    virtueEvidence: "",
    sourceUrls: [],
    usulAiResearchNotes: "Not separately searched in this streamlined batch pass; research relied on WebSearch synthesis only, per the batch's efficiency limits.",
    scholarlyReviewer: "",
    scholarlyReviewerQualification: "",
    scholarlyReviewDate: "",
    scholarlyDecision: "pending",
    scholarlyNotes: "",
    approvedArabicText: "",
    approvedEnglishText: "",
    approvedSourceReference: "",
    approvedTiming: "",
    approvedVirtueText: "",
    editorialReviewer: "",
    editorialApproval: "pending",
    editorialApprovalDate: "",
    publicationReviewStatus: "not-published",
    editorialNotes:
      "MDR-030 (203 characters, its embedded narrator-attribution opening already flagged in Stage 3A) was not assumed to be one hadith, Prophetic, or authentic; checked against WebSearch synthesis only (no direct fetch performed). Not segmented — one continuous petitionary sentence following the embedded attribution, no source plurality indicated beyond the identification question itself. The central finding is a genuine, unresolved narrator/recipient-name discrepancy: the located hadith (Abu Hurayrah, Mustadrak al-Hakim/al-Mu'jam al-Awsat/Musnad Ahmad) reports the Prophet ﷺ teaching this du'a to 'Salman al-Khayr,' while MDR-030's own source-document text embeds 'سُلَيْمَان' ('Sulaiman') — a different name. This is recorded as an open discrepancy, not silently corrected, merged, or assumed to be the same person. No explicit virtue/reward statement beyond the petition itself was found; virtueOrRewardClaim is left empty rather than inferred. sourceResearchStatus is 'in-progress' because no page was directly fetched in this pass and the narrator-name discrepancy remains unresolved. Recommend: directly fetch al-Hakim's Mustadrak or al-Tabarani's al-Mu'jam al-Awsat to confirm exact wording, resolve the Sulaiman/Salman al-Khayr discrepancy, and independently assess the reported weak grading.",
    importStatus: "research-only",
  },
];
