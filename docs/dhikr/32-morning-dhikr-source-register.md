# 32 — Morning Dhikr Source Register (Stage 3A)

## Purpose

A typed, version-controlled **research** structure holding a verbatim transcription of the 30 Arabic entries supplied by the content owner in `Project_Sadaqah_M:E Dua_Arabic_Only.docx`. It exists to let transcription happen once, safely, and be reused by every later research stage — without touching the approved `dhikrItem` Sanity schema or any public/staff route before scholarly research is complete.

This is **not** a Sanity document type, is **not** imported anywhere Sanity reads from, and is **not** referenced by any public route, projection, or the canonical eligibility gate (`src/sanity/lib/dhikr-publication-gate.ts`). See [ADR-020](21-decision-log.md#adr-020) for why it lives outside Sanity.

## Files

- `src/lib/dhikr-research/types.ts` — `DhikrSourceResearchRecord` interface (31 fields) and six controlled-value union types.
- `src/lib/dhikr-research/morning-dhikr-register.ts` — `MORNING_DHIKR_SOURCE_REGISTER`, the 30-record array, stored in exact source-document order.
- `src/lib/dhikr-research/validation.ts` — `assertCompleteSequence`, `assertRegisterStoredInAuthoritativeOrder`, `getOrderedRegisterView`, `computeImportGate`.
- `tests/dhikr/dhikr-source-register.test.ts` — 14 content-integrity tests, run via `npx tsx`.

## Transcription methodology

The source `.docx` cannot be read directly (binary format). Two independent extraction methods were used and cross-checked against each other:

1. **`textutil -convert txt`** (macOS built-in) — produced a clean plain-text conversion.
2. **Raw OOXML parsing** — the `.docx` was unzipped and `word/document.xml`'s `<w:p>`/`<w:t>` paragraph structure was parsed directly, independent of any rendering or visual layout.

Both methods agreed exactly: 31 total paragraphs, 30 non-empty, identical content and order. An initial visual scan of the companion PDF raised a concern that two very long entries (sequence 3 and 4, 996 and 1697 characters respectively) might be positioned differently than the DOCX order suggested — this was resolved by the raw XML parse, which confirmed both entries' text and position are correct. The apparent discrepancy was a misreading of vertical page position against very uneven entry lengths, not a real ordering fault. Because the DOCX's own paragraph structure gave clean, complete, unambiguous text for all 30 entries, no visual PDF reconstruction was ultimately required for any entry, and every `transcriptionStatus` is `"exact"`.

## Transcription rules applied

Per the authorised Stage 3A scope: sequence numbers, wording, punctuation, diacritics, and repetition/heading annotations were preserved exactly as they appear in the source document. No entry was merged, split, reordered, removed, or normalised. Minor irregularities visible in the source itself (inconsistent diacritisation density between entries, a probable typo, a dual-wording entry) were preserved verbatim and flagged in `transcriptionNotes` rather than corrected.

## Field population in this stage

**Populated**: `sequenceNumber`, `internalId`, `openingArabicWords`, `fullArabicText`, `originalDocumentText`, `sourceDocumentAnnotations`, `transcriptionStatus`, `transcriptionNotes`, and `proposedCategory` (only for entry 28, where the document itself states an explicit "Evening only" heading — no other entry contains an explicit category statement).

**Left unclaimed** (Stage 3A default value): `contentClassification` (`unclassified`), `morningSpecificStatus` (`uncertain` — including entry 28; the field is deliberately kept uniform pending formal review even though the source hints at a timing label), `sourceResearchStatus` (`not-started`), `primaryCollection`/`primaryReference`/`secondaryReferences`/`narrator`/`sourceArabicWording` (empty), `wordingMatchStatus` (`unresolved`), `hadithGrading`/`gradingAuthority`/`gradingNotes` (empty), `repetitionEvidence` (empty), `virtueOrRewardClaim`/`virtueEvidence` (empty), `sourceUrls` (empty), `usulAiResearchNotes` (empty), `scholarlyReviewer` (empty), `scholarlyDecision` (`pending`), `editorialNotes` (empty), `importStatus` (`research-only`).

**Repetition counts**: where a repetition marker (`3x`, `4x`, `7x`, `10x`, `100x`) is visible in the source, it is recorded in `repetitionCount` as document-supplied, unauthenticated data, per the explicit Stage 3A rule. `repetitionEvidence` is left empty for every such record, and `computeImportGate` blocks any record with a set `repetitionCount` and no `repetitionEvidence`. Nine of the 30 records carry a visible repetition count (entries 1, 2, 9, 11, 14, 17, 23, 26, 27).

**Virtue/reward claims**: entry 29 (the "ACTION" note) contains an explicit reward statement in its transcribed text ("like a complete Hajj and Umrah"). Rather than treating this ambiguous case as licence to populate `virtueOrRewardClaim`, it was left empty for every record, consistent with the "keep unclaimed" instruction for the fields immediately adjacent to it (`virtueEvidence`) — the claim itself remains fully visible within `fullArabicText`/`originalDocumentText`, and is called out in that entry's `transcriptionNotes`.

## Order protection

Two separate mechanisms guard document order, not one sorting helper:

- `assertCompleteSequence` fails if any number 1–30 is missing, duplicated, or out of range.
- `assertRegisterStoredInAuthoritativeOrder` inspects the register's **physical array order** and fails unless it is exactly `1, 2, 3, ... 30` — this catches a register that contains the right 30 numbers but stored out of sequence, which `assertCompleteSequence` alone would not catch.
- `getOrderedRegisterView` returns a sequence-ordered copy for display, built with `[...register].sort(...)`, which never mutates the source array.

## Import gate

`computeImportGate(record)` blocks import into `dhikrItem` whenever any of the following hold: source research is not `verified`; wording is not resolved to an accepted match state; a classification requiring hadith grading has none; a visible repetition count has no `repetitionEvidence`; a virtue/reward claim has no `virtueEvidence`; an `action-reminder`-classified record has not received a scholarly decision; scholarly approval (`scholarlyDecision`) is still `pending`; or `importStatus` is still `research-only`. Every one of the 30 Stage 3A records is currently blocked by multiple of these conditions simultaneously — this is expected and is asserted directly by the test suite (`testNoRecordIsImportReady`).

## Transcription audit

| Seq | Internal ID | Opening Arabic words | Visible annotation | Status | Uncertainty note |
|---|---|---|---|---|---|
| 1 | MDR-001 | آيَة ٱلْكُرْسِيّ | 3x (al-Ikhlas), 3x (al-Falaq), 3x (an-Nas) | exact | Reference line naming Ayat al-Kursi + 3 Quls, not their full Qur'anic text. |
| 2 | MDR-002 | بسْمِ اللَّهِ الَّذِي لَا يَضُرُّ | 3x | exact | — |
| 3 | MDR-003 | أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ | — | exact | Long entry (996 chars); cross-verified via raw XML parse after an initial visual-scan ordering concern, now resolved. |
| 4 | MDR-004 | لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ | — | exact | Long entry (1697 chars); same cross-verification as #3. Contains two mid-paragraph undiacritized words ("وشوقا", "شهيدا") preserved as-is. |
| 5 | MDR-005 | أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْكِبْرِيَاءِ | — | exact | — |
| 6 | MDR-006 | أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ | — | exact | — |
| 7 | MDR-007 | اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا | — | exact | — |
| 8 | MDR-008 | اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ | — | exact | Commonly known as Sayyid al-Istighfar; not compared against a reference wording in this stage. |
| 9 | MDR-009 | اللَّهُمَّ إنِّي أصْبَحْتُ أُشْهِدُكَ | 4x | exact | — |
| 10 | MDR-010 | اللَّهُمَّ مَا أصْبَحَ بِي مِنْ نِعْمَةٍ | — | exact | — |
| 11 | MDR-011 | اللَّهُمَّ عَافِنِي فِي بَدَنِي | 3x | exact | — |
| 12 | MDR-012 | اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ | — | exact | — |
| 13 | MDR-013 | اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَالْهَرَمِ | — | exact | — |
| 14 | MDR-014 | حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ | 7x | exact | — |
| 15 | MDR-015 | اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ | — | exact | — |
| 16 | MDR-016 | اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ | — | exact | — |
| 17 | MDR-017 | رَضِينَا بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا | 3x | exact | Contains two "\|"-separated wording variants in one entry (رَضِينَا...رَسُولا and رضيت...نَبيا); preserved as one record, not split. |
| 18 | MDR-018 | يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ | — | exact | — |
| 19 | MDR-019 | أَصْبَحْنَا وَأصْبح الْملك لله | — | exact | Lighter diacritisation than similar neighbouring entries; not normalised. |
| 20 | MDR-020 | أصَبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ رَبِّ الْعَالَمِينَ | — | exact | Contains "وهدأيه", a possible source-document typo; preserved as-is, flagged for Stage 3B. |
| 21 | MDR-021 | أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ | — | exact | — |
| 22 | MDR-022 | لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ | — | exact | No repetition marker, unlike the closely related entry 23. |
| 23 | MDR-023 | لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ | 10x | exact | — |
| 24 | MDR-024 | سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ | — | exact | — |
| 25 | MDR-025 | سُبْحَانَ اللَّهِ وَبِحَمْدِهِ لَا قُوَّةَ إِلَّا بِاللَّهِ | — | exact | — |
| 26 | MDR-026 | سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ | 100x | exact | — |
| 27 | MDR-027 | سُبْحَانَ اللَّهِ \| الْحَمْدُ لِلَّهِ | 100x, "مَائَةَ مَرَّةٍ" embedded in text | exact | Both annotation and embedded text agree on the same count. |
| 28 | MDR-028 | المَسَاءُ فَقَطْ أَمْسَيْنَا وَأَمْسَى الْمَلِكُ لِلَّهِ | "المَسَاءُ فَقَطْ" ("Evening only") heading | exact | Only entry with an explicit document-stated timing/category heading; recorded in `proposedCategory`, `morningSpecificStatus` still kept `uncertain` per Stage 3A rule. |
| 29 | MDR-029 | : ACTION فَإِذَا طَلَعَتِ الشَّمْسُ | "ACTION" heading | exact | Action/practice note, not a recited dua in the same sense as other entries; contains an embedded reward statement, deliberately not copied into `virtueOrRewardClaim`. |
| 30 | MDR-030 | دَعَا رَسُول الله ﷺ سُلَيْمَان | Narrator attribution embedded in text | exact | Narrative frame ("The Messenger of Allah ﷺ supplicated for Sulaiman") introduces the dua within the same paragraph. |

**Summary**: 30/30 `exact`, 0 requiring manual visual re-check, 0 `layout-reconstructed`, 0 `ambiguous-needs-manual-check`. Entries warranting extra scrutiny during transcription: 3 and 4 (length-driven ordering re-verification), 17 (dual wording), 20 (possible typo), 28 (evening marker), 29 (action note), 30 (narrator frame).

## What this stage does not do

No source collection, reference, narrator, hadith grading, or grading authority was added. No wording was compared against a verified primary source. No repetition count or virtue/reward claim was authenticated. No scholarly or editorial decision was recorded. No record's `importStatus` left `research-only`. No Sanity schema was created. No public route, projection, or the canonical eligibility gate (`src/sanity/lib/dhikr-publication-gate.ts`) was modified — confirmed both by direct inspection and by `tests/dhikr/dhikr-source-register.test.ts`'s static checks.

## Proposed Stage 3B — source-audit process

Not authorised by this stage; proposed for a future approval:

1. For each of the 30 records, search verified hadith/Qur'an reference works (e.g. Sahih al-Bukhari, Sahih Muslim, Sunan Abi Dawud, Hisn al-Muslim's own citation apparatus) for a matching primary source, recording `primaryCollection`/`primaryReference`/`narrator`/`gradingAuthority`/`hadithGrading` only from a cited, checkable source — never inferred.
2. Compare `fullArabicText` against the verified source's wording; set `wordingMatchStatus` and, if divergent, populate `sourceArabicWording` with the verified text without altering `originalDocumentText`.
3. For records with a `repetitionCount` already present (9 records), locate textual evidence for that specific count in a verified source before populating `repetitionEvidence`; if no evidence is found, record that finding rather than leaving the field silently empty.
4. Resolve entry 1's compound reference (Ayat al-Kursi + 3 Quls) and entry 17's dual-wording pair with source compilers before deciding whether either becomes one register entry, multiple, or a documented either/or.
5. Obtain a scholarly ruling on entry 20's "وهدأيه" irregularity before any corrected wording is proposed.
6. Classify entry 28 (evening-marked), entry 29 (action note), and entry 30 (narrated frame) explicitly, since their `contentClassification` will differ from the other 27 dua-only entries.
7. Only once `sourceResearchStatus: verified`, `wordingMatchStatus` resolved, required grading present, and evidence supplied for any repetition/virtue claim should any record's `scholarlyDecision` move away from `pending` — `computeImportGate` continues to gate `importStatus` transition away from `research-only` until then.
