# MDR-006 — Source Audit (Stage 3B)

## 1. Status

**Authentic Sahih Muslim narration identified — raw Arabic comparison and wording differences remain unresolved.** `sourceResearchStatus` is `scholarly-review-required`. Not scholarly-approved. Not import-ready. `scholarlyDecision` remains `pending` and `importStatus` remains `research-only`. See [Import gate result](#24-import-gate-result) below.

MDR-006 was not assumed in advance to be an evening counterpart to any other record, a complete hadith, an exact narration, Prophetic, authentic, morning-specific, evening-specific, or independently sourced — each was determined from direct evidence. A prior research pass on MDR-005 surfaced a snippet-level lead pointing toward an "أَمْسَيْنَا"-opening Ibn Mas'ud hadith in Sahih Muslim; that lead was treated only as a starting pointer in this pass, not inherited as a conclusion. **MDR-006's own transcribed text is morning-worded ("أَصْبَحْنَا" / "هَذَا الْيَوْمِ"), not the evening wording the lead described.** A direct fetch of islamweb.net's own hosted Sahih Muslim library pages returned, through the fetch tool's summarising model, an isnad (Ibn Mas'ud) and a matn in which all four of MDR-006's thematic components occur together and in the same order, framed as an evening formula with an instruction that "the same" is said in the morning. This report treats four things as **separate conclusions, not one**: (a) the underlying narration's identity (well supported — Sahih Muslim, Ibn Mas'ud); (b) the authenticity of that underlying report (Sahih Muslim's own canonical status); (c) the narration's broad timing usage (morning-and-evening, per the narration's own instruction); and (d) exact textual correspondence between MDR-006 and the primary wording (**not yet established** — the fetch tool's summarising layer means the returned quotation is not a guaranteed character-for-character transcript, and four specific wording differences from MDR-006 were observed and are not resolved as any particular explanation).

## 2. Exact source-document wording

```
أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ الْمَلِكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ إِنِّي أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ وَأَعُوذُ بِكَ مِن شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبْرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ
```

(`originalDocumentText`/`fullArabicText`, unchanged from Stage 3A — 446 characters, with a trailing space preserved exactly.)

## 3. Structural inspection

1. **Character count**: 446.
2. **Punctuation structure**: 3 commas (،), no other punctuation.
3. **Visible repetition marker**: none. `sourceDocumentAnnotations` is an empty array.
4. **Source-document annotations**: none.
5. **Grammatical continuity**: grammatically continuous Arabic prose; four comma-separated segments, the latter three each opening with a fresh vocative "رَبِّ".
6. **Genre assessment (pre-research)**: opens with a tahlil/tahmid declaration (dominion, praise, oneness), then three successive "رَبِّ" petitions (day's good/evil; laziness and bad old age; punishment of the Fire and the grave). Reads as either one continuous narration or several joined invocations — this impression is **not** treated as confirmed until §5/§13.
7. **Morning counterpart check**: the record's own wording is explicitly morning-oriented ("أَصْبَحْنَا"; "هَذَا الْيَوْمِ" — "this day", twice) — it is not the "أَمْسَيْنَا"/evening wording that MDR-005's contextual lead referenced. No other record in the register visibly duplicates this exact wording as a separate "evening version" entry (see §4).

## 4. Comparison with neighbouring records

MDR-006 was checked against MDR-005 (the preceding record) and found to be structurally and thematically unrelated: different opening formula beyond the shared "أَصْبَحْنَا وَأَصْبَحَ" fragment, different vocabulary throughout, different theme (MDR-005 is a two-clause declaration-and-petition text about the day's success, with an unresolved closing phrase; MDR-006 is a four-part declaration-plus-three-petitions text about laziness, old age, and punishment). **MDR-006 is not merged with MDR-005 and is not treated as its evening counterpart** merely because both records open with "أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ" — two similar openings are not assumed to belong to the same hadith. No other record elsewhere in the register (MDR-001 through MDR-030) was identified as an exact "evening version" of MDR-006's specific wording during this pass; the directly-inspected primary source itself supplies the evening/morning pairing internally (see §15), so no external register-internal counterpart search was necessary.

## 5. Segmentation decision

MDR-006 was **not** segmented into clauses. It contains four comma-separated, thematically distinct segments (declaration; day-good/evil petition; laziness/old-age refuge; Fire/grave-punishment refuge), each of the latter three opening with a fresh "رَبِّ" vocative — real grammatical/thematic boundaries that could support segmentation on structural grounds alone, as was done for MDR-003, MDR-004, and MDR-005. However, the four thematic components occur together and in the same order in the hosted Sahih Muslim narration returned through the fetch tool (§8, §11) — not as separately-sourced components. This is **not** a claim of a character-for-character continuous matn, an exact match of four clauses, or a complete exact match between MDR-006 and that narration — only that the components co-occur, in order, in one narration rather than appearing as distinct source leads. On that basis, segmenting into a clause map would have implied a source plurality that the evidence does not support; not segmenting reflects the evidence more accurately than segmenting would have. This is a stronger basis for non-segmentation than was available for any prior record in this register — MDR-001 through MDR-005 all lacked even this level of primary-page confirmation — but it remains a tool-mediated finding, not an independently re-verified manuscript check.

## 6. Clause map

Not applicable — no clause-map file was created, per §5.

## 7. Reconstruction-integrity result

Not applicable — MDR-006 was not segmented, so there is no clause reconstruction to verify. `originalDocumentText` and `fullArabicText` remain identical and untouched (446 characters each).

## 8. Source hierarchy

| Candidate/reported item | Hierarchy label |
|---|---|
| islamweb.net library hosting of Sahih Muslim (Kitab al-Dhikr wa'l-Du'a) | A directly fetched recognised hosting of Sahih Muslim's collection text — the webpage itself was opened, but the isnad/matn quoted throughout this report was mediated by `WebFetch`'s summarising model, not independently copied from the page's raw HTML, a scan, or a print edition; opening the page is not the same as exact textual inspection (see §11) |
| sunnah.com/tirmidhi:3390, sunnah.com/abudawud:5071 | Location unverified / inaccessible (HTTP 403) |
| surahquran.com/Hadith-26083.html ("Sahih Abi Dawud" 5071 claim) | Directly inspected secondary corroboration — tertiary aggregator; hadith-number claim flagged as unreliable (see §9) |
| hadithprophet.com/hadith-61590.html (Tirmidhi 3390 claim) | Directly inspected secondary corroboration — tertiary aggregator |
| Usul.ai search-results index pages (×2) | Indexed secondary discussion — directly inspected as index pages; not equivalent to inspecting the individual primary/commentary works listed |
| Fath al-Mun'im sharh Sahih Muslim; Badhl al-Majhud fi Hall Sunan Abi Dawud; al-Kalim al-Tayyib; Musnad al-Bazzar; Masabih al-Sunna; Subul al-Huda wa'r-Rashad; al-Dhikr al-Thamin; Adhkar wa Adab al-Sabah wa'l-Masa'; Sahih Kunuz al-Sunna al-Nabawiyya; other Usul.ai-indexed commentaries | Indexed classical commentary / indexed secondary discussion — none individually opened |

No phrase in this report says "source located," "confirmed source," or presents any indexed item above as directly inspected when it was not. The islamweb.net library page is the only item in this table labelled a directly inspected *primary* source.

## 9. Source table

| Segment(s) | Reported source | Reported narrator |
|---|---|---|
| All four (declaration; day petition; laziness/old-age refuge; Fire/grave refuge) | One continuous narration, directly inspected on islamweb.net's Sahih Muslim library page | 'Abdullah ibn Mas'ud (isnad ending "عبد الله", corroborated by every secondary source consulted) |

No whole-record source is claimed from a partial opening match: the directly-inspected page's matn was checked to contain all four segments' content, not merely the opening declaration. A hadith-number discrepancy was found and is not resolved: the directly-fetched page's own reference reads "4901" in its internal numbering, while every secondary/tertiary source consulted (surahquran.com, hadithprophet.com's differently-numbered Tirmidhi claim, general search synthesis) cites "2723" — these were not reconciled against a single authoritative index in this pass.

## 10. Evidence-quality table

| Source | Evidence level | Detail |
|---|---|---|
| islamweb.net Sahih Muslim library page | A directly fetched recognised hosting of Sahih Muslim's collection text | Fetched successfully via `WebFetch` (twice); isnad and matn obtained, but mediated by the tool's summarising model, not independently copied from raw HTML, a scan, or a print edition (see §11) |
| surahquran.com/Hadith-26083.html | Directly inspected secondary corroboration | Attributes wording to "Sahih Abi Dawud" 5071 (al-Albani); this specific number is contradicted by a separate search result quoting a different matn for "Abu Dawud 5071" — flagged, not relied upon |
| hadithprophet.com/hadith-61590.html | Directly inspected secondary corroboration | Attributes closely related wording to Tirmidhi 3390, "hasan sahih"; corroborates content, not itself a primary page |
| Usul.ai search-results pages (×2) | Indexed secondary discussion | Seven + five indexed works respectively; consistent Ibn Mas'ud attribution across all but one outlier item; no individual permalink extractable |
| sunnah.com (tirmidhi:3390; abudawud:5071) | Location unverified / inaccessible | HTTP 403 on direct `WebFetch`, consistent with every prior record in this register |

Search-result titles and snippets are not treated as equivalent to direct inspection anywhere in this report; the one item in this table not directly fetched (a dorar.net search-result title, seen only via a prior WebSearch result list) is not cited as evidence here.

## 11. Tool-mediated Arabic quotation (not yet a raw-text comparison)

`sourceArabicWording` is populated (unlike every prior record in this register), but it is a **tool-mediated Arabic quotation returned from a directly fetched hosting of Sahih Muslim; it requires confirmation against a raw edition before textual comparison is final.** It must not be described as a raw transcription, exact primary Arabic, character-for-character primary text, or definitive Sahih Muslim wording:

```
أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ
```

Morning-substitution instruction, quoted the same way: `وَإِذَا أَصْبَحَ قَالَ ذَلِكَ أَيْضًا أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ`.

**Limitation**: this quotation was obtained via `WebFetch`, which passes page content through a summarising model — it is not a guaranteed lossless, character-for-character transcript of the primary page's raw HTML/text, and the Arabic was not independently copied from raw HTML, a scan, or a print edition. A first fetch attempt of the same page returned an elided ("...") version of this same passage; a second, more targeted fetch returned the fuller quotation reproduced above. Direct webpage access is not treated as equivalent to exact textual inspection: this quotation must not be treated as the final critical Arabic text for comparison purposes.

## 12. Wording comparison

`wordingMatchStatus` is **`unresolved`** — not `exact-match`, `minor-orthographic-variation`, `recognised-narration-variant`, or `materially-different`, until MDR-006 and a raw Sahih Muslim text have been compared character-for-character. The current evidence establishes that MDR-006 corresponds closely, in structure and content, to the Sahih Muslim narration; it does **not** establish that every observed difference is a recognised transmission variant. Four unresolved wording differences were observed between MDR-006 and the tool-mediated quotation in §11:

1. **الْمَلِكُ vs الْمُلْكُ**: MDR-006 reads "الْمَلِكُ" (al-Malik, "the King") twice; the tool-mediated quotation reads "الْمُلْكُ" (al-Mulk, "the dominion") in the same two places.
2. **Missing "لَهُ"**: MDR-006 has one "لَهُ" before "الْمَلِكُ وَلَهُ الْحَمْدُ"; the quotation has two ("لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ").
3. **"إِنِّي" presence**: MDR-006 reads "رَبِّ إِنِّي أَسْأَلُكَ"; the quotation reads "رَبِّ أَسْأَلُكَ" — observed consistently across two separate fetches of the same page.
4. **الْكِبْرِ vs الْكِبَرِ**: MDR-006 vocalises "وَسُوءِ الْكِبْرِ" (sukun); the quotation vocalises "وَسُوءِ الْكِبَرِ" (fatha).

Each of these is an **unresolved wording difference** — a possible vocalisation or transmission difference, a possible transcription or edition issue — that requires raw-text comparison. Each may reflect: a recognised transmission variant; a source-document transcription error; a vocalisation error; an edition difference; an omission; a `WebFetch` summarisation artefact; or an unresolved textual error. **No single explanation is selected without directly inspected, raw Arabic evidence.** The fact that a type of difference (word presence/absence, vocalisation) is individually common in hadith transmission does not prove that any one of these four specific differences is a recognised transmitted variant, is not yet established as one, and none has been silently corrected in `fullArabicText` or `originalDocumentText`.

To be clear about what the evidence *does* support: the narration identity (Sahih Muslim, Ibn Mas'ud) is strongly supported by the structural and content correspondence documented in §8–§10. What is not yet text-critically resolved is the precise wording relationship between MDR-006 and that narration's own primary text.

## 13. Attribution analysis

Reported as the Prophet's ﷺ own regular practice ("كان النبي ﷺ إذا أمسى قال...", per the directly-inspected page's framing and every corroborating secondary source), narrated by 'Abdullah ibn Mas'ud. The isnad on the directly-fetched page ends with "عبد الله" — a well-established shorthand for Ibn Mas'ud in this specific Kufan chain (Ibrahim ibn Suwayd -> 'Abd al-Rahman ibn Yazid -> 'Abdullah), corroborated without exception by every secondary source consulted. This is the strongest attribution basis obtained for any record in this register so far, resting on a directly-inspected primary isnad rather than an indexed lead alone — but it remains a tool-mediated reading of that isnad, not an independently re-verified manuscript check.

## 14. Timing analysis

- **Direct evening wording in the transcribed text**: not applicable to MDR-006 itself — MDR-006's own transcribed wording is the morning form ("أَصْبَحْنَا" / "هَذَا الْيَوْمِ").
- **Direct timing wording in the narration**: yes — the directly-inspected primary page's own matn states the wording is said in the evening ("أَمْسَيْنَا...هَذِهِ اللَّيْلَةِ...") with an explicit instruction that "the same" is said in the morning ("وَإِذَا أَصْبَحَ قَالَ ذَلِكَ أَيْضًا"), substituting the day-word for the night-word.
- **Chapter/compilation placement only**: not the basis used here — the timing evidence comes from the narration's own explicit instruction, not merely from where the hadith is filed.
- This is directly-inspected timing evidence (via a tool-mediated quotation), not an unverified evening adaptation or an inference from wording alone. This conclusion concerns the narration's **broad timing usage** — that it is reported for both morning and evening — not a character-level verification of every quoted word in that instruction.

## 15. Morning/evening counterpart analysis

The tool-mediated quotation of the primary narration supplies both the evening form and the morning-substitution instruction within a single matn — MDR-006 is therefore evidenced as belonging to a paired morning/evening narration, not two separate narrations, at the level of broad timing usage. Because MDR-006's own transcribed content is the morning-form wording, and the evidence shows this is one narration covering both times (not two independently sourced texts), `contentClassification` and `morningSpecificStatus` are both recorded as `morning-and-evening` (§22) — while the exact wording of that narration, and therefore of the timing phrases themselves, remains subject to the same unresolved wording questions as §12. No separate "evening version" entry elsewhere in the register was identified as this narration's counterpart in this pass (§4); if one exists, it was not located.

## 16. Repetition analysis

No repetition marker is present in `sourceDocumentAnnotations` (empty array), and no repetition count was located in the directly-inspected narration or any secondary source. `repetitionCount` is left unset. This is not derived from familiarity or compilation convention.

## 17. Virtue/protection analysis

Every clause of MDR-006 is first-person petition or refuge-seeking wording ("أَسْأَلُكَ...", "أَعُوذُ بِكَ...") describing what is being asked for — not a third-person "whoever recites this will receive X" promise, an explicit Prophetic promise to the reciter, or a narration describing an outcome. No virtue or reward claim is inferred from this petition wording, per instruction. `virtueOrRewardClaim` is left empty.

## 18. Grading/authenticity analysis

`hadithGrading` is populated (unlike every prior record in this register): **"Sahih — the underlying four-part narration is contained in Sahih Muslim. This grading applies to the identified narration, not to every unresolved letter-form or vocalisation in MDR-006."** `gradingAuthority` reads: **"Sahih Muslim's canonical inclusion, with textual comparison still pending."** No additional modern grading has been added or sought, per instruction. Four separate conclusions are distinguished, not conflated:

1. The underlying narration is found in Sahih Muslim (§8–§10, §13).
2. The four-part structure and overall wording correspond to that narration (§9, §15).
3. This does **not** authenticate every MDR-006 letter-form or vocalisation.
4. The unresolved wording differences in §12 remain outside the character-level authentication claim.

No extra MDR-006 wording was found to be absent from the tool-mediated quotation — every segment has a structural counterpart — so this differs from a case where authenticity would need to be scoped to only part of the record. It does **not** mean Sahih Muslim automatically validates MDR-006's exact transcription.

## 19. Compilation provenance

Sahih Muslim (3rd century AH) predates Hisn al-Muslim and Hisn al-Hasin by many centuries; neither compilation's own inclusion (or non-inclusion, or wording) of MDR-006 was checked in this pass. This is recorded as an open question, not assumed either way. MDR-006's wording is treated as tracing to Sahih Muslim's own text (subject to §12's unresolved variant points), not to a later compilation's paraphrase.

## 20. Usul.ai search log

| Query (Arabic) | Returned title | Author | Vol/Page | Entry/№ | Matched phrase | Full context inspected? | Attribution explicit? | Type | Confidence | Remaining verification |
|---|---|---|---|---|---|---|---|---|---|---|
| أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله وحده | Al-Dhikr al-Thamin | Muhammad ibn Salih al-'Uthaymin | vol.1 p.20 | Entry 10 | "أصبحنا وأصبح الملك لله والحمد لله لا إله إلا الله..." | No — index/snippet only | Yes, but names "Ibn Mas'ud (from Abu Huraira)" — an outlier inconsistent with every other source, not relied upon | Modern compilation | Low | Full entry unread |
| (same) | Musnad al-Bazzar | Abu Bakr al-Bazzar | — | Entry 18 (marked authentic by the index) | "أمسينا وأمسى الملك لله والحمد لله لا إله إلا الله..." | No | Yes (Ibn Mas'ud) | Musnad (candidate primary collection) | Low-moderate | Full entry unread — a genuine primary-collection lead requiring follow-up |
| (same) | Al-Kalim al-Tayyib | Ibn Taymiyyah | vol.2 p.186 | Entry 1715 | "أمسينا وأمسى الملك لله والحمد لله..." (variant "سوء الكفر" noted) | No | Yes (Ibn Mas'ud, as "'Abdullah") | Classical compilation | Low | Full entry unread |
| (same) | Masabih al-Sunna | al-Baghawi | vol.7 p.257 | (4 entries) | Not itemised in detail | No | Narrators: Ibn Abi Awfa, 'A'isha, al-Bara' ibn 'Azib — separate narrations, not claimed as MDR-006's own | Classical compilation | Low | Not followed up — different narrations in the same thematic area |
| (same) | Subul al-Huda wa'r-Rashad | al-Salihi al-Shami | vol.7 p.257 | — | Repeated content to Masabih al-Sunna | No | Not confirmed | Classical sira/hadith compilation | Low | Full entry unread |
| (same) | Adhkar wa Adab al-Sabah wa'l-Masa' | Muhammad Isma'il al-Muqaddim | vol.1 p.11, p.17 | Entries 83-84 | Entry 84: "أمسينا وأمسى الملك لله والحمد لله..." | No | Yes (Ibn Mas'ud) | Modern compilation | Low | Full entry unread |
| (same) | Sahih Kunuz al-Sunna al-Nabawiyya | Bari' 'Irfan Tawfiq | vol.1 p.17 | — | "أصبحنا وأصبح الملك لله والحمد لله..." | No | Not confirmed | Modern compilation | Low | Full entry unread |
| أمسينا وأمسى الملك لله والحمد لله لا إله إلا الله وحده | Fath al-Mun'im sharh Sahih Muslim | Musa Shahin Lashin | vol.6 p.1871 | — | Explicit Sahih Muslim attribution | No | Yes | Classical commentary (on Sahih Muslim specifically) | Moderate | Full entry unread |
| (same) | Badhl al-Majhud fi Hall Sunan Abi Dawud | Khalil Ahmad al-Saharanfuri | vol.13 p.464 | — | "أمسينا وأمسى الملك لله" | No | Yes, narrator chain through Ibn Mas'ud | Classical commentary (on Abu Dawud) | Low-moderate | Full entry unread |
| (same) | Qut al-Mughtadhi 'ala Jami' al-Tirmidhi | al-Suyuti | vol.2 p.834 | — | Full context reported | No | Not itemised | Classical commentary (on Tirmidhi) | Low | Full entry unread |
| (same) | al-Mafatih fi sharh al-Masabih | Mazhar al-Din al-Zaydani | vol.3 p.204 | — | Full context, grammatical analysis reported | No | Not itemised | Classical commentary | Low | Full entry unread |
| (same) | Sharh al-Tibi 'ala Mishkat al-Masabih | Sharaf al-Din al-Tibi | vol.51 p.3 | — | Detailed commentary reported | No | Not itemised | Classical commentary | Low | Full entry unread |

For every item above, no individual permalink URL was extractable from the search-results page (consistent with the pattern for MDR-001 through MDR-005) — this record's direct-inspection evidence came instead from a separate, successful `WebFetch` of islamweb.net's own Sahih Muslim library hosting (§11), not from Usul.ai.

## 21. Unresolved issues

1. Four specific wording differences between MDR-006 and the directly-inspected primary quotation remain unresolved (§12): الْمَلِكُ/الْمُلْكُ; a missing "لَهُ"; "إِنِّي" presence; الْكِبْرِ/الْكِبَرِ vocalisation.
2. The hadith-number discrepancy (commonly-cited "2723" vs. the fetched page's own internal "4901") was not reconciled against a single authoritative index. Numbering systems can vary by edition, but that explanation is not assumed to account for this specific discrepancy without checking.
3. The directly-inspected quotation was obtained through `WebFetch`'s summarising model, not a guaranteed lossless transcript — a first fetch attempt returned an elided version of the same passage.
4. Musnad al-Bazzar (entry 18, marked authentic by the Usul.ai index) is a candidate primary-collection lead that was not itself opened.
5. surahquran.com's "Sahih Abi Dawud 5071" numbering claim conflicts with a separately observed matn for "Abu Dawud 5071" that does not match MDR-006 at all — not resolved, not relied upon.
6. Al-Dhikr al-Thamin's "Ibn Mas'ud (from Abu Huraira)" narrator note is an outlier inconsistent with every other source and was not investigated further.
7. Whether Hisn al-Muslim or Hisn al-Hasin include this wording, and in what form, was not checked in this pass.
8. No independently re-verified manuscript or printed critical edition was consulted to confirm the isnad or matn beyond the single WebFetch-mediated page.

## 22. Overall classification

`contentClassification: "morning-and-evening"`; `morningSpecificStatus: "morning-and-evening"`. Both values rest on a tool-mediated but directly-fetched statement within the narration itself (the evening matn plus its morning-substitution instruction — §14, §15), not on wording alone, chapter placement, or compilation placement. This is a materially stronger evidentiary basis than any morning/evening classification recorded elsewhere in this register to date, because the pairing is stated inside the directly-fetched primary text rather than inferred or reported second-hand — but this conclusion concerns the narration's broad timing usage, not a character-level verification of every quoted word (see §12, §14).

## 23. Scholarly-review recommendation

Scholarly review is recommended to:

1. Obtain a raw, unmediated copy of the Sahih Muslim matn (a printed edition or PDF, not a `WebFetch`-summarised page) to resolve the four wording points in §12 without relying on a summarising tool.
2. Reconcile the "2723" vs. "4901" hadith-number discrepancy against an authoritative index or edition.
3. Confirm or correct MDR-006's own vocalisation of "الْمَلِكُ" (vs. "الْمُلْكُ") and "الْكِبْرِ" (vs. "الْكِبَرِ") against the resolved primary wording, without this research register itself silently correcting `fullArabicText` or `originalDocumentText`.
4. Decide whether the content-owner's source document should be flagged for a possible transcription point on those same two vocalisation questions.
5. Decide whether MDR-006 should be preserved as transcribed, corrected, or annotated — only after 1–3 above are complete.

## 24. Import gate result

`computeImportGate(MDR-006)` returns `canImport: false`, blocked by four independent conditions: `sourceResearchStatus` is `"scholarly-review-required"`, not `"verified"`; `wordingMatchStatus` (`"unresolved"`) is not an accepted resolved state; `scholarlyDecision` remains `"pending"`; `importStatus` remains `"research-only"`. Unlike every prior record in this register, `hadithGrading` (populated, "Sahih — applies to the identified narration") no longer independently blocks the gate — this reflects genuinely stronger direct-inspection evidence of the underlying narration's identity and authenticity for this record, not a weakening of the gate's logic; `computeImportGate` itself was not modified.

## 25. Manual verification checklist

- [ ] Obtain a raw Arabic edition or scan of Sahih Muslim for this narration.
- [ ] Record the edition, volume, page, book, chapter and hadith number.
- [ ] Reconcile the 2723 and 4901 numbering systems.
- [ ] Compare MDR-006 character-for-character against the raw Arabic.
- [ ] Verify whether the source reads الْمُلْكُ or الْمَلِكُ at each position.
- [ ] Verify whether the second لَهُ is present.
- [ ] Verify whether إِنِّي appears before أَسْأَلُكَ.
- [ ] Verify whether the source reads الْكِبَرِ or الْكِبْرِ.
- [ ] Check recognised variant editions and commentaries for each difference.
- [ ] Determine whether any MDR-006 form is a documented narration variant, an edition variant, or a transcription error.
- [ ] Directly inspect Musnad al-Bazzar entry 18 (marked authentic by the Usul.ai index) as a further corroborating primary lead.
- [ ] Check Hisn al-Muslim and Hisn al-Hasin for their own inclusion and wording of this dhikr.
- [ ] Obtain scholarly approval before correcting or publishing the source document wording.
- [ ] Confirm no repetition or reward claim is inferred.
- [ ] Obtain scholarly judgment before marking `sourceResearchStatus: verified`.
- [ ] Decide whether MDR-006 should be preserved as transcribed, corrected, or annotated.
