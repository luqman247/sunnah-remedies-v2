# MDR-007 — Source Audit (Stage 3B)

## 1. Status

**Underlying narration identified (Jami' al-Tirmidhi 3391, Abu Hurayrah, reportedly graded hasan) — raw Tirmidhi wording and the النشور/المصير assignment remain unverified.** `sourceResearchStatus` is `in-progress` (corrected in this pass from an initial `scholarly-review-required` — see §21, §23, and the register's `editorialNotes` for the full status-decision rationale). Not scholarly-approved. Not import-ready. `scholarlyDecision` remains `pending` and `importStatus` remains `research-only`. See [Import gate result](#24-import-gate-result) below.

MDR-007 was not assumed in advance to be one hadith, a complete narration, Prophetic, authentic, morning-specific, morning-and-evening, an exact source match, or independently sourced — each was determined from evidence. This report distinguishes **seven separate conclusions, not one**: (1) the underlying narration's identity (well supported — Jami' al-Tirmidhi 3391); (2) the reported Companion narrator (Abu Hurayrah, via a tool-mediated isnad); (3) the collection lead (Jami' al-Tirmidhi 3391, plus reported-but-uninspected leads in Abu Dawud, Ibn Majah, Ahmad, and Ibn Hibban); (4) the reported grading (hasan, per a tool-mediated quotation attributing this to al-Tirmidhi himself); (5) broad morning-and-evening usage (directly reported by every source consulted as a paired formula); (6) the exact closing-word assignment (النشور vs. المصير for morning vs. evening — **unresolved**, and not confirmed to be a settled conflict between the two directly-fetched sources rather than a difference in what each source is actually claiming — see §12); and (7) exact textual correspondence between MDR-007 and any specific primary wording (**not established**).

A note on method: an initial `WebFetch` attempt at a third corroborating source (hadithprophet.com/hadith-61591.html) was interrupted by the user mid-research. It was not retried and is not relied upon anywhere in this record. A second note: the islamweb.net Tirmidhi page was fetched only once in this pass (unlike MDR-006, where a repeat fetch of the same page was used to check tool-mediation consistency) — this is recorded as a specific limitation on how much confidence this report places in that quotation.

## 2. Exact source-document wording

```
اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النَّشُورُ
```

(`originalDocumentText`/`fullArabicText`, unchanged from Stage 3A — 98 characters, the shortest record researched in this register so far.)

## 3. Structural inspection

1. **Character count**: 98.
2. **Punctuation structure**: none — no commas, no other punctuation.
3. **Visible repetition marker**: none. `sourceDocumentAnnotations` is an empty array.
4. **Source-document annotations**: none.
5. **Grammatical structure**: one continuous sentence; a single vocative ("اللَّهُمَّ") opens four parallel "بِكَ..." clauses ("by You we enter morning, by You we enter evening, by You we live, by You we die"), closing with "وَإِلَيْكَ النَّشُورُ" ("and to You is the resurrection/return"). Entirely declarative throughout — there is no petition, no request, no shift in grammatical person or subject.
6. **Genre assessment (pre-research)**: reads as one continuous declaration of dependence on Allah, not several joined invocations, not a declaration-plus-petition structure (there is no petition), not an obvious direct Qur'anic quotation, though "المصير"/"النشور" echo Qur'anic vocabulary generally. This impression is **not** treated as confirmed until §5/§13.
7. **Morning/evening counterpart check**: the text itself contains both "أَصْبَحْنَا" (morning) and "أَمْسَيْنَا" (evening) within the same sentence — unlike MDR-006, which required an external narration instruction to establish morning/evening pairing, MDR-007's own transcribed text already names both times directly. No other record in the register was identified as an exact counterpart to this specific wording during this pass (see §4).

## 4. Neighbouring-record comparison

MDR-007 was checked against MDR-006 (the preceding record, also researched as `morning-and-evening`) and found to be a structurally and thematically unrelated text: different vocabulary throughout, different grammatical form (MDR-006 is a tahlil/tahmid declaration plus three "رَبِّ" petitions; MDR-007 is a single unbroken "بِكَ..." declaration with no petition at all), different length (446 vs. 98 characters). MDR-007 is not merged with MDR-006 or any other record on the basis of shared morning/evening vocabulary ("أَصْبَحْنَا"/"أَمْسَيْنَا" appear in several records in this register) — shared vocabulary is not treated as evidence of a shared hadith. No other record elsewhere in the register (MDR-001 through MDR-030) was identified as an exact counterpart to MDR-007's specific wording in this pass.

## 5. Segmentation decision

MDR-007 was **not** segmented into clauses. The text has no comma-separated segments and no internal punctuation at all; it opens with one vocative ("اللَّهُمَّ") that governs the entire sentence, and none of the listed boundary indicators applies — there is no new vocative partway through, no shift from declaration to petition (there is no petition anywhere in the text), no shift from declaration to refuge, no change in grammatical person or subject, no repeated opening formula, no separate protection request, no Qur'anic quotation, no virtue/outcome statement, and no narrator-frame phrase embedded in the text. MDR-007 is not segmented merely because it contains four parallel "بِكَ..." clauses — parallel structure within one sentence is not, by itself, a meaningful grammatical, thematic, or source boundary. No clause-map file was created.

## 6. Clause map

Not applicable — no clause-map file was created, per §5.

## 7. Reconstruction-integrity result

Not applicable — MDR-007 was not segmented, so there is no clause reconstruction to verify. `originalDocumentText` and `fullArabicText` remain identical and untouched (98 characters each).

## 8. Source hierarchy

| Candidate/reported item | Hierarchy label |
|---|---|
| islamweb.net library hosting of Jami' al-Tirmidhi (Kitab al-Da'awat) | A directly fetched recognised hosting of Jami' al-Tirmidhi's collection text — the webpage itself was opened, but the isnad/matn quoted throughout this report was mediated by `WebFetch`'s summarising model, not independently copied from the page's raw HTML, a scan, or a print edition; opening the page is not the same as exact textual inspection |
| islamqa.info/ar/answers/543628 | Directly inspected modern scholarly discussion — not the primary hadith source |
| sunnah.com/tirmidhi:3391 | Location unverified / inaccessible (HTTP 403) |
| dorar.net/hadith/sharh/83786 | Location unverified / inaccessible (HTTP 403) |
| hadithprophet.com/hadith-61591.html | Not inspected — fetch attempt interrupted by the user; not relied upon |
| Usul.ai search-results index pages (×2) | Indexed secondary discussion — directly inspected as index pages; not equivalent to inspecting the individual primary/commentary works listed |
| Badhl al-Majhud fi Hall Sunan Abi Dawud; al-Dhikr al-Thamin; Tahdhib Sunan Abi Dawud; Sharh Sunan Ibn Majah; al-Sunan al-Kubra; al-Musnad al-Mawdu'i al-Jami'; Sharh al-Masabih li-Ibn al-Malik; al-Baytuta; Fiqh al-Islam; Rawdat al-Muhaddithin; Sahih wa Da'if al-Jami' al-Saghir | Indexed classical commentary / indexed secondary discussion — none individually opened |
| Abu Dawud 5068; Ibn Majah 3868; Ahmad 8649; Ibn Hibban 964, 965 | Reported underlying source, not directly inspected — known only via a WebSearch synthesis, not relied upon as fact |

No phrase in this report says "source located," "confirmed source," or presents any indexed item above as directly inspected when it was not.

## 9. Source table

| Reported source | Reported narrator | Directly inspected? |
|---|---|---|
| Jami' al-Tirmidhi, hadith 3391 | Abu Hurayrah, via Suhail ibn Abi Salih -> his father -> ... | Yes — tool-mediated quotation of a directly fetched primary-collection hosting |
| Abu Dawud 5068, Ibn Majah 3868, Ahmad 8649, Ibn Hibban 964/965 | Abu Hurayrah (reported, same chain) | No — WebSearch synthesis only |

No whole-record source is claimed from a partial match: the directly-fetched Tirmidhi quotation was checked to contain the full content of MDR-007 (all five clauses' vocabulary), not merely the opening declaration — but see §12 for the unresolved closing-word question.

## 10. Evidence-quality table

| Source | Evidence level | Detail |
|---|---|---|
| islamweb.net Jami' al-Tirmidhi library page | Directly fetched recognised hosting of a primary collection | Fetched successfully via `WebFetch`; isnad, hadith number, and grading obtained, but mediated by the tool's summarising model |
| islamqa.info/ar/answers/543628 | Directly inspected modern scholarly discussion | Fetched successfully via `WebFetch`; discusses the same narration's textual variants and states its own preferred reading — a conclusion, not a primary source |
| sunnah.com/tirmidhi:3391 | Location unverified / inaccessible | HTTP 403 on direct `WebFetch` |
| dorar.net/hadith/sharh/83786 | Location unverified / inaccessible | HTTP 403 on direct `WebFetch` |
| hadithprophet.com/hadith-61591.html | Not inspected | Fetch interrupted by the user; not relied upon |
| Usul.ai search-results pages (×2) | Indexed secondary discussion | Corroborates narrator/collection identity; index snippets themselves disagree with each other on the النشور/المصير question |

Search-result titles and snippets are not treated as equivalent to direct inspection anywhere in this report.

## 11. Arabic source wording and provenance

`sourceArabicWording` is populated, but explicitly labelled tool-mediated and non-final, exactly as for MDR-006:

- **"Morning" form** (per the directly-fetched Tirmidhi quotation): `اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ`
- **"Evening" form** (per the same quotation): `اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ`

A separately directly-fetched source (islamqa.info) reports the **opposite** closing-word assignment for the same two time-forms (morning ends النشور; evening ends المصير). This is not a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Tirmidhi wording — it must not be treated as the final critical Arabic text for comparison purposes, and the contradiction between the two directly-fetched sources is recorded, not resolved.

## 12. Wording comparison

`wordingMatchStatus` is **`unresolved`** — not `exact-match`, `minor-orthographic-variation`, `recognised-narration-variant`, `composite-of-multiple-sources`, or `materially-different`. MDR-007 reads: `اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النَّشُورُ` — its word order ("أَصْبَحْنَا" before "أَمْسَيْنَا") matches the word order both directly-fetched sources report for the *morning* form, but its closing word ("النَّشُورُ") matches what islamqa.info assigns to *morning* while the tool-mediated Tirmidhi quotation assigns that same closing word to *evening*. MDR-007's specific combination (this word order with this closing word) is therefore not confirmed as matching either directly-fetched source's reported morning form or evening form as a whole.

**Before calling this a direct contradiction, five distinct levels of claim are separated** (per the instruction not to conflate them):

1. **What the tool-mediated Tirmidhi hosting reportedly says**: morning ends المصير, evening ends النشور — from a single, unrepeated `WebFetch` of one specific hosted page (islamweb.net), not independently checked for internal consistency by a second fetch (unlike MDR-006).
2. **What islamqa.info says al-Tirmidhi's version specifically says**: the fetched discussion cites Tirmidhi (3391, hasan) as one of several collections reporting this hadith; it is **not established in this pass** whether islamqa.info's stated النشور/المصير assignment is presented as Tirmidhi's own specific wording, or as the discussion's overall conclusion across collections.
3. **What islamqa.info prefers after comparing multiple routes**: morning=النشور, evening=المصير, explicitly described as the rajih (preponderant) reading based on chain strength and supporting narrations — a cross-route scholarly judgment, not a direct quotation of any single hosted edition.
4. **What Abu Dawud, Ibn Majah, Ahmad, Ibn Hibban, or al-Adab al-Mufrad reportedly contain**: reported via WebSearch synthesis only (§8), not directly inspected in this pass.
5. **What Usul.ai snippets report**: a third word-order/ending combination ("أَصْبَحْنَا"-first with "الْمَصِيرُ" ending) attributed to at least two further indexed works — not itself a claim about Tirmidhi specifically.
6. **What remains unverified**: whether the tool-mediated Tirmidhi quotation (item 1) and islamqa.info's stated preference (item 3) are describing the same route or edition at all; whether the tool-mediation introduced an extraction error in either fetch; and whether MDR-007's own combination corresponds to any single attested route.

Because items 1 and 3 answer different questions (a specific edition's printed text vs. a cross-route preference), this is **not confirmed to be a direct, mutually exclusive contradiction** between two sources describing the same thing — it may be that, or it may be that the two sources simply are not comparable claims, or that one or both tool-mediated fetches introduced an extraction artefact. Usul.ai's own index snippets reinforce that genuine textual variation is a documented feature of this hadith's transmission (per islamqa.info's own statement that four differing textual versions circulate among transmitters), which is independent evidence that route-level variation is real, without confirming which specific claim in items 1–5 is accurate. **No explanation is selected without directly inspected, raw Arabic evidence**: this may reflect a recognised transmission variant, a source-document transcription choice reflecting one attested route, a `WebFetch` summarisation artefact in one or both fetches, the two sources addressing different routes or editions, or an unresolved textual question — none is preferred.

## 13. Attribution analysis

Reported as something the Prophet ﷺ taught his Companions to say (per WebSearch synthesis, not independently confirmed by directly reading the matn's own introductory frame in this pass), narrated by Abu Hurayrah. The isnad on the directly-fetched Tirmidhi page reads: 'Ali ibn Hijr -> 'Abdullah ibn Ja'far -> Suhail ibn Abi Salih -> his father -> Abu Hurayrah — a tool-mediated reading of that isnad, not an independently re-verified manuscript check. The intermediate narrator described only as "his father" (i.e., Suhail ibn Abi Salih's father) was not independently named in this pass.

## 14. Timing analysis

- **Direct timing wording in MDR-007 itself**: yes — "أَصْبَحْنَا" (morning) and "أَمْسَيْنَا" (evening) both appear directly in the transcribed text, not merely in a reported narrator-frame or chapter heading.
- **Direct timing wording in the narration**: yes — the directly-fetched Tirmidhi quotation reports two forms of the narration, one explicitly for morning and one explicitly for evening, differing in word order and closing word (see §11, §12).
- **Chapter/compilation placement only**: not the sole basis — the timing evidence comes from the narration's own two reported forms, though the chapter title ("du'a said upon entering morning and evening") independently corroborates this.
- This is directly-fetched (tool-mediated) timing evidence for the broad morning-and-evening pairing; it is **not** a character-level verification of which exact wording belongs to which time (see §12).

## 15. Morning/evening counterpart analysis

Every source consulted — the directly-fetched Tirmidhi quotation, islamqa.info, and the Usul.ai index snippets — agrees that this narration is used as a paired morning-and-evening formula, with two related-but-different wordings for the two times. MDR-007 is therefore evidenced as belonging to one such paired narration, not two separate narrations, and not merged with any other register entry. Which of the narration's two reported wordings MDR-007's own text corresponds to is the specific unresolved question in §12 — the *pairing itself* is well evidenced; the *exact match* is not.

## 16. Repetition analysis

No repetition marker is present in `sourceDocumentAnnotations` (empty array), and no repetition count was located in any directly-inspected or indexed source. `repetitionCount` is left unset. This is not derived from familiarity, convention, or the source document alone.

## 17. Virtue/protection analysis

MDR-007 is a first-person declarative statement of dependence on Allah — it contains no request for protection, no explicit Prophetic promise to the reciter, and no described outcome for reciting it. Unlike MDR-006 (which contains explicit refuge-seeking petitions), MDR-007 contains no petition at all. No virtue or reward claim is inferred from this declarative wording, per instruction. `virtueOrRewardClaim` is left empty.

## 18. Grading/authenticity analysis

`hadithGrading` is populated: **"Al-Tirmidhi reportedly classified the underlying narration as hasan in the tool-mediated fetched collection text (islamweb.net's hosting of Jami' al-Tirmidhi 3391, Abu Hurayrah). This reported grading is scoped to the underlying narration having a reported collection grading — it does not resolve MDR-007's exact wording, the النشور/المصير assignment, every route, or every compilation form of this hadith."** `gradingAuthority` reads: **"Abu 'Isa al-Tirmidhi's reported classification, via a tool-mediated fetch of Jami' al-Tirmidhi's own text; not independently corroborated by a second grading authority in this pass, and not verified against a raw, unmediated edition."** Four separate conclusions are distinguished, not conflated:

1. The underlying narration is found in Jami' al-Tirmidhi, hadith 3391 (§8–§10, §13).
2. Al-Tirmidhi reportedly grades it hasan, per a tool-mediated fetch (§18) — not independently re-verified against a raw edition.
3. This does **not** authenticate MDR-007's exact closing word or word order over the narration's other reported form.
4. The unresolved النشور/المصير question in §12 remains outside the character-level authentication claim, and remains open regardless of the grading.

The grading blocker on `computeImportGate` is cleared only because the underlying narration has a reported collection grading — not because MDR-007's exact transcription is authenticated. It does **not** mean Jami' al-Tirmidhi's reported hasan grading automatically validates MDR-007's exact transcription.

## 19. Compilation provenance

Jami' al-Tirmidhi (3rd century AH) predates Hisn al-Muslim and Hisn al-Hasin by many centuries; neither compilation's own inclusion (or non-inclusion, or wording) of MDR-007 was checked in this pass. This is recorded as an open question, not assumed either way.

## 20. Usul.ai search log

| Query (Arabic) | Returned title | Author | Vol/Page | Entry/№ | Matched phrase | Full context inspected? | Attribution explicit? | Type | Confidence | Remaining verification |
|---|---|---|---|---|---|---|---|---|---|---|
| اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور | Badhl al-Majhud fi Hall Sunan Abi Dawud | Khalil Ahmad al-Saharanfuri | vol.13 p.461 | — | Ends in النشور | No — index/snippet only | Not itemised | Classical commentary (on Abu Dawud) | Low | Full entry unread |
| (same) | Al-Dhikr al-Thamin | Muhammad ibn Salih al-'Uthaymin | vol.1 p.21 | — | Ends in النشور | No | Not itemised | Modern compilation | Low | Full entry unread |
| (same) | Tahdhib Sunan Abi Dawud | Ibn al-Qayyim al-Jawziyya | vol.3 p.397 | — | Labelled "evening version" by the tool; ends in المصير — the opposite of the Tirmidhi fetch's own morning/evening assignment | No | Not itemised | Classical commentary (on Abu Dawud) | Low | Full entry unread — a further internal inconsistency, not resolved |
| (same) | Sharh Sunan Ibn Majah | Muhammad Amin 'Abdullah al-Athiyubi | vol.23 p.92 | — | "Variants documented with both النشور and المصير" | No | Yes (Abu Hurayrah) | Classical commentary (on Ibn Majah) | Low | Full entry unread |
| (same) | al-Sunan al-Kubra | an-Nasa'i | vol.12 p.305 | — | "Both phrase endings noted" | No | Not itemised | Classical hadith collection | Low-moderate | Full entry unread — a genuine primary-collection lead |
| اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير | Al-Dhikr al-Thamin | al-'Uthaymin | vol.1 p.21 | — | "أَصْبَحْنَا...أَمْسَيْنَا...الْمَصِيرُ" — a third word-order/ending combination | No | Not itemised | Modern compilation | Low | Full entry unread |
| (same) | Sharh Sunan Ibn Majah li'l-Harari | al-Athiyubi | vol.23 p.92 | — | "Multiple hadith transmissions with variant readings regarding al-Nushur vs al-Masir" | No | Yes (Abu Hurayrah) | Classical commentary | Low | Full entry unread |
| (same) | al-Musnad al-Mawdu'i al-Jami' | Suhayb 'Abd al-Jabbar | vol.15 p.67 | Hadith #1712-1713 | "Thematic collection showing morning and evening variants" | No | Not itemised | Modern thematic compilation | Low | Full entry unread |
| (same) | Sharh al-Masabih li-Ibn al-Malik | Ibn Malik al-Kirmani | — | — | "أَصْبَحْنَا...أَمْسَيْنَا...الْمَصِيرُ" | No | Not itemised | Classical commentary | Low | Full entry unread |
| (same) | al-Baytuta | Abu'l-'Abbas al-Sarraj | vol.10 p.352 | — | "Discusses variant readings between al-Nushur and al-Masir" | No | Not itemised | Classical work | Low | Full entry unread |
| (same) | Fiqh al-Islam | 'Abd al-Qadir Shayba al-Hamd | vol.11 p.366 | Hadith #5366 | "Jurisprudential treatment with complete variant forms" | No | Not itemised | Modern fiqh work | Low | Full entry unread |
| (same) | Rawdat al-Muhaddithin | Collective authorship | vol.3 p.397 | — | Ends in النشور; "includes Ibn al-Qayyim's comparative analysis" | No | Not itemised | Modern hadith compilation | Low | Full entry unread |
| (same) | Tahdhib Sunan Abi Dawud | Ibn al-Qayyim al-Jawziyya | — | Entry #354 | "Compares morning/evening variants across hadith collections" | No | Not itemised | Classical commentary | Low | Full entry unread |
| (same) | Sahih wa Da'if al-Jami' al-Saghir | al-Suyuti / al-Albani (grading index) | vol.1 p.67 | — | Ends in النشور; "authentication classification included" | No | Not itemised | Modern grading-index work | Low-moderate | Full entry unread — a candidate grading lead |

For every item above, no individual permalink URL was extractable from the search-results page (consistent with the pattern for MDR-001 through MDR-006) — this record's direct-inspection evidence came instead from separate, successful `WebFetch` calls to islamweb.net's Tirmidhi library page and islamqa.info, not from Usul.ai.

## 21. Unresolved issues

1. Two directly-fetched sources report different closing-word assignments (النشور or المصير) for the morning wording versus the evening wording of this narration — but it is not established that they are making mutually exclusive claims about the same route or edition (§12).
2. MDR-007's own combination (أَصْبَحْنَا-first word order + النشور closing word) is not confirmed as matching either directly-fetched source's reported morning form or evening form as a whole.
3. Usul.ai's own index snippets add a third word-order/ending combination attributed to at least two further indexed works, not resolved.
4. Abu Dawud 5068, Ibn Majah 3868, Ahmad 8649, and Ibn Hibban 964/965 were reported via WebSearch synthesis only, not directly inspected.
5. Al-Albani's Sahih wa Da'if al-Jami' al-Saghir entry (an indexed grading lead) was not itself opened.
6. The intermediate narrator described only as "his father" in the fetched isnad was not independently named.
7. Whether Hisn al-Muslim or Hisn al-Hasin include this wording, and in what form, was not checked in this pass.
8. No independently re-verified manuscript or printed critical edition was consulted to confirm the isnad or matn beyond tool-mediated fetches.
9. A third corroborating source (hadithprophet.com/hadith-61591.html) was not inspected — the fetch attempt was interrupted by the user and not retried.
10. The islamweb.net Tirmidhi page was fetched only once; unlike MDR-006, no repeat-fetch consistency check was performed on the tool-mediated quotation.
11. It is not established whether islamqa.info's stated النشور/المصير preference is presented there as al-Tirmidhi's own specific wording or as a conclusion drawn across multiple collections.

## 22. Overall classification

`contentClassification: "morning-and-evening"`; `morningSpecificStatus: "morning-and-evening"`. Four caveats accompany this value, none of which is optional: (1) the underlying narration is consistently reported as having morning and evening forms — every source consulted agrees on this; (2) the exact assignment of النشور and المصير to each time remains unresolved; (3) this classification concerns broad paired usage, not exact wording; (4) MDR-007's precise morning wording is not verified. Both values rest on every consulted source's agreement that this narration is a paired morning/evening formula with two related wordings — a tool-mediated but directly-fetched conclusion (§14, §15), not an inference from wording alone or from chapter placement alone (though the chapter title independently corroborates it).

## 23. Scholarly-review recommendation

**Status-decision rationale** (why `sourceResearchStatus` is `in-progress`, not `conflicting-evidence` or `scholarly-review-required`): `conflicting-evidence` was considered and rejected because the two directly-fetched sources may not be making mutually exclusive claims about the same transmitted route (§12) — it is not established that the tool-mediated Tirmidhi quotation and islamqa.info's stated preference describe the same route or edition. `scholarly-review-required` was considered and rejected because that value requires the underlying source evidence to be substantially stable with only a judgment call remaining; here the apparent disagreement may primarily result from `WebFetch` summarisation, incomplete extraction, failure to inspect raw Tirmidhi Arabic, secondary-source paraphrase, or uncertainty over whether both sources quote the same route or edition — the explicit triggers for `in-progress`.

Further research (not merely scholarly judgment) is recommended to:

1. Obtain a raw, unmediated copy of Jami' al-Tirmidhi 3391 (a printed edition or PDF, not a `WebFetch`-summarised page) to resolve the النشور/المصير assignment without relying on a summarising tool, including a repeat, independent fetch of the same islamweb.net page to check tool-mediation consistency.
2. Directly inspect Abu Dawud 5068, Ibn Majah 3868, Ahmad 8649, and Ibn Hibban 964/965 to see whether any independently resolves the question or clarifies which route islamqa.info's preference describes.
3. Directly inspect al-Albani's Sahih wa Da'if al-Jami' al-Saghir entry for its own grading and wording.
4. Once the source evidence is substantially stable, revisit `sourceResearchStatus` against the actual resolved relationship between MDR-007 and the underlying narration — only then does the remaining question become a scholarly judgment call rather than an unresolved factual question.
5. Decide whether MDR-007's specific combination should be preserved as transcribed, corrected toward one of the reported forms, or annotated — only after 1–4 above are complete.

## 24. Import gate result

`computeImportGate(MDR-007)` returns `canImport: false`, blocked by four independent conditions: `sourceResearchStatus` is `"in-progress"`, not `"verified"`; `wordingMatchStatus` (`"unresolved"`) is not an accepted resolved state; `scholarlyDecision` remains `"pending"`; `importStatus` remains `"research-only"`. `hadithGrading` (populated, "Al-Tirmidhi reportedly classified the underlying narration as hasan... scoped to the underlying narration") does not independently block the gate — the underlying narration has a reported collection grading, which is a separate conclusion from MDR-007's exact transcription being authenticated; this is not a weakening of the gate's logic. `computeImportGate` itself was not modified.

## 25. Manual verification checklist

- [ ] Obtain a raw Arabic edition or scan of Jami' al-Tirmidhi 3391.
- [ ] Record the edition, volume, page, book, chapter and hadith number.
- [ ] Compare MDR-007 character-for-character against the raw Arabic.
- [ ] Determine which closing word (النشور or المصير) the raw text assigns to the morning wording.
- [ ] Determine which closing word the raw text assigns to the evening wording.
- [ ] Directly inspect Abu Dawud 5068, Ibn Majah 3868, Ahmad 8649, and Ibn Hibban 964/965 for corroboration.
- [ ] Directly inspect al-Albani's Sahih wa Da'if al-Jami' al-Saghir entry for its own grading and wording.
- [ ] Check recognised variant editions and commentaries for the النشور/المصير question specifically.
- [ ] Determine whether islamqa.info's stated preference describes al-Tirmidhi's own text specifically or a cross-collection conclusion.
- [ ] Repeat the islamweb.net Tirmidhi fetch (or use a raw source) to check tool-mediation consistency.
- [ ] Determine whether MDR-007's combination is a documented narration variant, a transcription choice, or an unresolved question.
- [ ] Obtain scholarly approval before correcting or publishing the source document wording.
- [ ] Confirm no repetition or reward claim is inferred.
- [ ] Obtain scholarly judgment before marking `sourceResearchStatus: verified`.
- [ ] Decide whether MDR-007 should be preserved as transcribed, corrected, or annotated.
