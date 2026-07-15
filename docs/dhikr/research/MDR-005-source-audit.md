# MDR-005 — Source Audit (Stage 3B)

## 1. Status

**Combined narration lead located — complete source unity, wording and closing phrase remain unresolved.** `sourceResearchStatus` is `in-progress`. Not scholarly-approved. Not import-ready. `scholarlyDecision` remains `pending` and `importStatus` remains `research-only`. See [Import gate result](#22-import-gate-result) below.

MDR-005 was not assumed in advance to be one hadith, a composite of independently-sourced components, Prophetic, morning-specific, authentic, exact source wording, or independently sourced — each was to be determined from evidence. Segmentation into two clauses (A: declaration; B: petition) is **structurally reliable**: reconstruction reproduces the source document exactly, character for character. This segmentation is kept for research precision, but **it does not by itself prove separate origins** — a combined declaration-plus-petition lead exists (indexed leads associate closely related wording with one reported narration, Ibn Abi Awfa via Abu al-Warqa'), so both clauses may belong to a single reported narration. **Composite sourcing (independently-sourced components) is not established.** Two things remain genuinely unresolved: a disagreement among indexed snippets over whether clause A should include "وَالْحَمْدُ لِلَّهِ", and clause B's final phrase ("أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ"), which remains unsourced. Neither of these establishes two independently-sourced components; both are recorded as open wording/source-unity questions within what may be a single reported narration. This is because no primary hadith or classical-compilation page was itself directly opened and read in this pass. Every evidentiary claim in this report is search-engine-synthesis or indexed-lead level unless explicitly marked as directly fetched via `WebFetch` — sunnah.com/mishkat:2414 returned HTTP 403, and a direct usul.ai per-hadith URL attempt returned HTTP 404. **Classification correction (this pass, superseding the initial Stage 3B classification):** `contentClassification` was first recorded as `composite-text`; on review this overstated the evidence, since demonstrating a composite record requires showing at least two actually-established independently-sourced components, which has not been done. `contentClassification` is corrected to `unclassified` — the closest existing controlled value that does not assert a specific classification the evidence does not yet support (neither `uncertain` nor `general-remembrance` exists in `ContentClassification`; no new enum member was added). See §20 for the full rationale.

## 2. Exact source-document wording

```
أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ وَالْكِبْرِيَاءِ وَالْعَظْمَةِ وَالْخَلْقِ وَالْأَمْرِ وَاللَّيْلِ وَالنَّهَارِ وَمَا يُضْحَى فِيهِمَا لِلَّهِ وَحْدَهُ، اللَّهُمَّ اجْعَلْ أَوَّلَ هَذَا النَّهَارِ صَلَاحًا وَأَوْسَطَهُ فَلَاحًا وَآخِرَهُ نَجَاحًا أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ
```

(`originalDocumentText`/`fullArabicText`, unchanged from Stage 3A — 324 characters.)

## 3. Structural inspection

1. **Character count**: 324.
2. **Punctuation structure**: 1 comma (،), no other punctuation.
3. **Visible repetition marker**: none. `sourceDocumentAnnotations` is an empty array.
4. **Source-document annotations**: none.
5. **Grammatical continuity**: each of the two clauses (declaration; petition) is internally grammatically continuous; the record as a whole reads as continuous prose with one clear thematic pivot at the comma.
6. **Genre assessment (pre-research)**: the text visibly contains a declarative tawhid-style statement about Allah's exclusive dominion and attributes, followed by a first-person petition asking for a good day and for worldly/hereafter good. This impression is **not** treated as confirmed by the research in §7–§13; it remains a working hypothesis supported by indexed leads, not proof of a single verified origin.

## 4. Segmentation decision

Segmentation was judged necessary on structural grounds: a single comma marks a clean thematic pivot from declaration to petition, coinciding with a new vocative ("اللَّهُمَّ"). This is a meaningful boundary, not segmentation merely because the text is long — MDR-005 (324 characters) is one of the shorter records in the register. **A grammatical boundary is distinguished throughout from a source-attribution claim, which is in turn distinguished from proof of separate origins** — indexed leads associate a closely related combined declaration-plus-petition wording with a single reported narration, so the A→B boundary below is not itself treated as evidence of two separate origins.

- **A→B**: the declarative clause ("أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ...لِلَّهِ وَحْدَهُ") ends at the comma; the vocative "اللَّهُمَّ" opens a second-person petition ("اللَّهُمَّ اجْعَلْ...") that continues to the end of the record.

Full clause map: `src/lib/dhikr-research/audits/mdr-005-clause-map.ts` (`MDR_005_CLAUSE_MAP`).

## 5. Clause map

| Clause | Opening words | Boundary confidence | Apparent genre |
|---|---|---|---|
| MDR-005-A | أَصْبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ | High | Divine praise (reported, unverified) |
| MDR-005-B | اللَّهُمَّ اجْعَلْ أَوَّلَ هَذَا النَّهَارِ | High | Prophetic supplication (reported, unverified) |

## 6. Reconstruction-integrity result

Concatenating both clauses' `exactArabicClause` values in order (`reconstructMdr005FromClauses()`) reproduces `MDR-005.originalDocumentText` **exactly** — verified programmatically. **Documented separator-handling rule**: clause A's slice runs from index 0 up to and including the comma; clause B's slice starts immediately after the comma and therefore includes the source document's single space character that follows it. Sum of clause lengths (161 + 163 = 324) equals the original text's length (324); no character is omitted or duplicated. This reconstruction proof establishes that **segmentation is structurally reliable** — it does not, by itself, establish anything about source attribution. See `tests/dhikr/dhikr-source-register-mdr-005-audit.test.ts` for the automated proof.

## 7. Source hierarchy

| Candidate/reported item | Hierarchy label |
|---|---|
| Mishkat al-Masabih (al-Tabrizi, hadith 38/2414) | Indexed primary page located but inaccessible (sunnah.com/mishkat:2414 → HTTP 403; usul.ai/t/mishkat-masabih/2414 → HTTP 404) |
| Mirqat al-Mafatih sharh Mishkat al-Masabih (al-Mulla 'Ali al-Qari, vol. 14 p. 107) | Indexed secondary discussion; requires direct inspection |
| al-Matalib al-'Aliyya bi-Zawa'id al-Masanid al-Thamaniyya (Ibn Hajar al-'Asqalani) | Indexed secondary discussion; requires direct inspection |
| 'Amal al-Yawm wa'l-Layla (Ibn al-Sunni) | Indexed primary page located but inaccessible |
| al-Muntakhab min Musnad 'Abd ibn Humayd | Indexed primary page located but inaccessible |
| Takhrij Ahadith Ihya' 'Ulum al-Din (al-'Iraqi) | Compilation provenance only — not directly inspected; known only via a modern fatwa's relay |
| Subul al-Huda wa'l-Rashad (al-Salihi al-Shami) | Indexed secondary discussion; requires direct inspection |
| islamweb.net fatwa 437644 (grading discussion) | Directly inspected recognised secondary discussion — modern takhrij article |
| islamweb.net fatwa 103482 (negative check for closing phrase) | Directly inspected recognised secondary discussion — modern fatwa article |
| dorar.net/hadith/sharh/20406 (Sahih Muslim/Ibn Mas'ud hadith, used to check an unrelated attribution claim) | Contextual resemblance only — search-result title/snippet, not fetched |
| Usul.ai search-results index page | Indexed secondary discussion (directly inspected as a search-index page; not equivalent to inspecting the primary works it lists) |
| Hisn al-Muslim, Hisn al-Hasin | No source located (not checked in this pass) |

No phrase in this report says "source located," "confirmed source," "confirmed narration," or presents any of the above as an established "primary collection" without qualification. Every reference to a collection above is a **candidate underlying collection or indexed lead requiring direct inspection**, not an established fact.

## 8. Source table

| Clause(s) | Reported source lead | Reported narrator |
|---|---|---|
| A | Indexed attribution to a report combining declaration and petition (Mishkat al-Masabih and commentaries) | 'Abdullah ibn Abi Awfa, via Abu al-Warqa' (reported) |
| B (up to "نجاحا") | Same indexed lead as A; separately, a directly-inspected modern fatwa relays a weak-graded report (via 'Abd ibn Humaid/al-Tabarani) covering closely related wording up to "نجاحا" only | 'Abdullah ibn Abi Awfa (reported, via the Mishkat lead); narrator not named in the fatwa's relay of the 'Abd ibn Humaid/al-Tabarani report |
| B (closing phrase "أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ") | No source located | Not established |

No whole-record source is claimed from a partial phrase match. The closing phrase of clause B is explicitly recorded as unsourced, not silently absorbed into the reported lead for the rest of the record.

## 9. Evidence-quality table

| Source | Evidence level | Detail |
|---|---|---|
| Mishkat al-Masabih / Mirqat al-Mafatih / al-Matalib al-'Aliyya / 'Amal al-Yawm wa'l-Layla / al-Muntakhab min Musnad 'Abd ibn Humayd / Subul al-Huda wa'l-Rashad | Indexed primary/secondary leads, not directly inspected | Known only via a directly-fetched Usul.ai search-results index page's title/author/volume-page/hadith-number/matched-phrase metadata — no individual primary page could be opened (no permalink URLs were present on the page; a follow-up fetch requesting raw href values returned none). |
| Takhrij Ahadith Ihya' (al-'Iraqi) | Compilation provenance only | The grading "إسناده ضعيف" attributed to al-'Iraqi is known only via a directly-fetched modern fatwa's relay (islamweb.net/ar/fatwa/437644/), not by opening al-'Iraqi's own work. |
| islamweb.net fatwa 437644 | Directly inspected recognised secondary discussion (modern takhrij article) | Fetched successfully via `WebFetch`; explicitly scopes its finding to a closely related wording ("يَوْمِنَا هَذَا") up to "نجاحا" only. |
| islamweb.net fatwa 103482 | Directly inspected recognised secondary discussion (modern fatwa article) | Fetched successfully via `WebFetch`; used as a negative check — confirmed it does not contain MDR-005's closing phrase. |
| dorar.net/hadith/sharh/20406 | Contextual resemblance only | Seen only as a WebSearch result title/snippet, not fetched with `WebFetch`; used only to challenge (not confirm) an unrelated attribution claim — see §12. |
| sunnah.com/mishkat:2414 | Location unverified / inaccessible | HTTP 403 on direct `WebFetch`. |
| usul.ai/t/mishkat-masabih/2414 | Location unverified / inaccessible | HTTP 404 on direct `WebFetch` (guessed URL pattern; no working permalink found). |

Search snippets and WebSearch's own synthesized prose are not treated as equivalent to direct inspection anywhere in this report; two WebSearch synthesis claims in particular were checked and one was found unsupported (see §12).

## 10. Arabic source wording

`sourceArabicWording` is deliberately left **empty**. No primary or classical-compilation page's own Arabic text was directly inspected (WebFetch-read) for any part of MDR-005 in this pass. The closest directly-inspected material is a modern fatwa's own quotation of a closely related (not identical) wording ("اللَّهُمَّ اجْعَلْ أَوَّلَ يَوْمِنَا هَذَا صَلَاحًا..."), which is not MDR-005's own wording and is not substituted for it here. Populating `sourceArabicWording` now would misrepresent the evidentiary basis.

## 11. Wording comparison

No wording comparison against a directly-inspected *primary* source was possible for either clause in this pass. `wordingMatchStatus` is **`unresolved`** at both the clause level and the record level. Two specific, unresolved divergences were identified against indexed/secondary leads (neither lead was itself directly inspected as a primary page):

1. **Clause A** — three indexed matched-phrase snippets (via the directly-inspected Usul.ai search-results page) disagree with each other on whether "وَالْحَمْدُ لِلَّهِ" appears between "لِلَّهِ" and "وَالْكِبْرِيَاءِ": one (Mirqat al-Mafatih) omits it, matching MDR-005; two (al-Matalib al-'Aliyya; Mishkat al-Masabih itself, per the index) include it, diverging from MDR-005. Because the sources disagree with each other and none was directly opened, this is recorded as unresolved, not as a confirmed omission or error.
2. **Clause B** — the directly-inspected fatwa (437644) explicitly states only the wording up to "نجاحا" was located in the collections it discusses; MDR-005's closing phrase "أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ" was not found or corroborated anywhere in this pass, including in a second directly-inspected fatwa page checked specifically for it.

Given these two unresolved divergences and the absence of any directly-inspected primary text, `wordingMatchStatus: unresolved` is the only honestly supportable value — not `exact-match`, `recognised-narration-variant`, or `materially-different`, any of which would overstate the current evidentiary basis.

## 12. Attribution analysis

The one reported narrator located, 'Abdullah ibn Abi Awfa (via Abu al-Warqa'), rests on indexed Usul.ai metadata, not a directly-inspected chain. A WebSearch synthesis (not directly inspected, not relied upon) additionally framed the report as something the Prophet ﷺ said specifically upon entering the morning — this framing was not independently verified against any primary page in this pass.

A separate WebSearch synthesis claimed the "الكبرياء والعظمة" wording belongs to the Sahih Muslim hadith from Ibn Mas'ud. This claim was checked: a WebSearch result's own page title for the actual Sahih Muslim/Ibn Mas'ud hadith sharh (dorar.net/hadith/sharh/20406 — title only, not a `WebFetch` page read) already quotes that hadith's wording as "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له..." — matching MDR-006, not MDR-005's "الكبرياء والعظمة" wording. Even at this snippet-only evidentiary level, the claimed Sahih Muslim attribution for MDR-005's wording is treated as an unverified/likely-incorrect conflation of two distinct reports and is **not relied upon** anywhere in this record's fields.

No Prophetic attribution is treated as authenticated in this report; it remains reported and unresolved for both clauses.

## 13. Timing analysis

No chapter heading was located anywhere in this pass, since no primary collection page was opened. Timing evidence rests on the source document's own text:

- **Both clauses**: the record's own transcribed wording contains direct timing vocabulary — "أَصْبَحْنَا" ("we have entered the morning") and "أَوَّلَ هَذَا النَّهَارِ" ("the beginning of this day/daytime") — within the text itself, not merely in a reported narrator-frame or a chapter heading. `timingStatus: morning-only` for both clauses, and `morningSpecificStatus: morning-only` at the record level, on this basis.
- This conclusion rests specifically on **direct timing wording within the transcribed document text**, which is a stronger basis than the reported-narrator-frame or chapter-heading bases used elsewhere in this register. It does **not** rest on confirmation that no evening-parallel ("أَمْسَيْنَا") version of this exact wording exists elsewhere in the wider hadith literature — no evening-parallel was located in this pass, but this absence was not exhaustively verified, and no primary page was directly inspected to check.

## 14. Repetition analysis

No repetition marker is present in `sourceDocumentAnnotations` (empty array), and no repetition count was located in any research for either clause. `repetitionCount` is left unset. This is not derived from the source document's annotation alone (there is none) or from any narration text located.

## 15. Virtue/protection analysis

Clause B's request that Allah make the day's beginning, middle, and end good, and the request for the good of this world and the hereafter, is the content of the petition itself — a first-person request, not a third-person "whoever recites this will receive X" promise, and not a chapter-title or compilation-placement inference. No virtue or reward claim is inferred from this petition's own content, per instruction. `virtueOrRewardClaim` is left empty.

## 16. Grading analysis

No single grading applies to MDR-005 as a whole, and no grading below is treated as directly verified in its primary source:

| Component | Reported grading | Reported authority | Directly inspected? | Applies to |
|---|---|---|---|---|
| Closely related wording up to "نجاحا" (a variant of clause B, per a modern fatwa) | "إسناده ضعيف" (its chain is weak) | al-Hafiz al-'Iraqi (Takhrij Ahadith Ihya' 'Ulum al-Din) | No — known only via a directly-inspected modern fatwa's (islamweb.net 437644) relay, not al-'Iraqi's own work | The wording up to "نجاحا" only, as quoted in that fatwa ("يَوْمِنَا هَذَا", not MDR-005's "هَذَا النَّهَارِ") — not confirmed to be the identical report behind clause A or the Ibn Abi Awfa/Mishkat lead |
| Clause A; clause B's closing phrase | No grading located | — | — | Ungraded in this pass |

The fatwa's grading is explicitly **not** extended to MDR-005's closing phrase ("أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ"), which that fatwa does not mention. Whether the 'Abd ibn Humaid/al-Tabarani weak report and the Ibn Abi Awfa/Mishkat al-Masabih report are the same underlying narration is unresolved. No scholar's wording is converted into a universal consensus claim anywhere in this record.

## 17. Compilation provenance

Neither Hisn al-Muslim nor Hisn al-Hasin's own inclusion (or non-inclusion) of MDR-005 was checked in this pass. This is recorded as an open question, not assumed either way.

## 18. Usul.ai search log

| Query (Arabic) | Returned title | Author | Vol/Page | Entry/№ | Matched phrase | Full context inspected? | Attribution explicit? | Type | Confidence | Remaining verification |
|---|---|---|---|---|---|---|---|---|---|---|
| أصبحنا وأصبح الملك لله والكبرياء | Mirqat al-Mafatih sharh Mishkat al-Masabih | al-Mulla 'Ali al-Qari | vol.14 p.107 | Hadith 2414 | "أصبحنا وأصبح الملك لله والكبرياء والعظمة والخلق والليل والنهار" (no "والحمد لله") | No — index/snippet only; no permalink obtainable | Yes (Ibn Abi Awfa named) | Classical hadith commentary | Low-moderate | Directly open this entry to resolve the "والحمد لله" discrepancy |
| (same) | al-Matalib al-'Aliyya bi-Zawa'id al-Masanid al-Thamaniyya | Ibn Hajar al-'Asqalani | — | Hadith 2414 | "أصبحنا وأصبح الملك لله والحمد لله والكبرياء" (includes "والحمد لله") | No | Yes (Ibn Abi Awfa named) | Classical hadith collection (zawa'id work) | Low-moderate | Directly open this entry — a genuine primary-collection lead |
| (same) | Mishkat al-Masabih | Muhammad al-Khatib al-Tabrizi | — | Hadith 38 | "أصبحنا وأصبح الملك لله عز وجل والحمد لله والكبرياء" (includes "عز وجل" and "والحمد لله") | No | Yes (Ibn Abi Awfa, via Abu al-Warqa') | Classical hadith collection | Low-moderate | Directly open hadith 38 / cross-referenced 2414 |
| (same) | 'Amal al-Yawm wa'l-Layla | Ibn al-Sunni | — | — | Not itemised in detail | No | Not confirmed | Classical hadith collection | Low | Full entry unread |
| (same) | Takhrij Ahadith Ihya' 'Ulum al-Din | al-'Iraqi (Murtada al-Zabidi edition per index) | — | — | Not itemised in detail | No | Not confirmed | Modern-era takhrij compilation of a classical work | Low | Full entry unread |
| (same) | al-Muntakhab min Musnad 'Abd ibn Humayd | 'Abd ibn Humayd al-Kusi | — | — | Not itemised in detail | No | Not confirmed | Candidate underlying collection (a musnad) | Low | Full entry unread — a genuine primary-collection lead requiring follow-up |
| (same) | Subul al-Huda wa'l-Rashad | Muhammad ibn Yusuf al-Salihi al-Shami | — | — | Not itemised in detail | No | Not confirmed | Classical sira/hadith compilation | Low | Full entry unread |
| (follow-up, non-Arabic instruction) | *(request for raw href values on the same search-results page)* | — | — | — | — | No permalinks present | — | — | — | Confirms no individual primary-page permalink was accessible from this search UI in this pass |

General note: as for MDR-001 through MDR-004, Usul.ai's search results for this record skewed toward classical commentary/collection index metadata rather than a directly openable per-hadith primary page with full context and its own grading.

## 19. Unresolved issues

1. No primary hadith or classical-compilation page was directly inspected for either clause (sunnah.com/mishkat:2414 → HTTP 403; usul.ai/t/mishkat-masabih/2414 → HTTP 404).
2. The three indexed snippets for clause A's opening disagree on whether "وَالْحَمْدُ لِلَّهِ" appears — MDR-005 omits it, matching one of three snippets and diverging from two.
3. MDR-005's closing phrase "أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ" was not located or corroborated by any source directly inspected in this pass, including a fatwa page checked specifically for it — it remains unsourced. Possible explanations, none preferred or decided in this pass: a longer, unlocated version of the same reported narration; a recognised transmission variation; a later compilation addition; a later devotional extension; transcription drift; or an unresolved transcription/attribution error. This unsourced status is not, by itself, evidence that clause B combines two independently-sourced texts.
4. Whether the al-'Iraqi-graded 'Abd ibn Humaid/al-Tabarani report (fatwa 437644) and the Ibn Abi Awfa/Mishkat al-Masabih report (Usul.ai index) are the same underlying narration, a shared-formula variant, or two distinct reports is unresolved.
5. The lexical variant between the fatwa's quoted "يَوْمِنَا هَذَا" and MDR-005's "هَذَا النَّهَارِ" was not resolved.
6. Whether an evening-parallel ("أَمْسَيْنَا") version of this exact combined wording exists elsewhere in the hadith literature was not exhaustively checked.
7. The Prophetic-attribution framing ("something the Prophet ﷺ said upon entering the morning") rests on a WebSearch synthesis, not a directly-inspected primary page.
8. Whether Mishkat al-Masabih's own internal numbering (hadith 38) and the commentary cross-reference (hadith 2414) genuinely refer to the same entry was not independently confirmed.

## 20. Overall classification

**`contentClassification: "unclassified"`** (corrected in this pass from an initial `"composite-text"`).

**Why `composite-text` overstated the evidence**: `composite-text` asserts that a record combines independently-sourced components. What this pass actually established is narrower: (1) MDR-005 has two grammatical/thematic clauses (declaration; petition) — real, and structurally proven by exact reconstruction; (2) indexed leads associate a closely related *combined* declaration-plus-petition wording with *one* reported narration (Ibn Abi Awfa via Abu al-Warqa') — a significant lead toward source unity, not against it; (3) the directly-inspected grading discussion (islamweb.net fatwa 437644) covers closely related wording only through "نجاحا"; (4) MDR-005's final phrase ("أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ") was not located in any source directly inspected; (5) no complete original or classical source text was directly inspected, and no direct Arabic-to-Arabic comparison was completed. None of these five facts demonstrates that MDR-005 actually combines two or more independently-sourced texts — grammatical segmentation is not proof of composite sourcing, an unsourced closing phrase is not proof of a second independent source (it may be, among other explanations, a longer unlocated version of the same narration, a recognised transmission variant, a later compilation addition, a later devotional extension, transcription drift, or an unresolved error — none preferred or decided in this pass), and the one combined-wording lead located points toward single-narration unity, not away from it.

**Selected value and rationale**: `contentClassification` is corrected to `"unclassified"` — MDR-005 is structurally segmented into two research clauses, but its source unity remains unresolved. Indexed leads associate a closely related combined declaration-and-petition wording with one reported narration, while the final closing phrase remains unsourced. The record is therefore not classified as a confirmed composite. `"unclassified"` is the closest existing value in `ContentClassification` (`src/lib/dhikr-research/types.ts`) that does not assert a classification the evidence does not yet support; `"uncertain"` and `"general-remembrance"` were considered but do not exist as values of that type, and no new enum member has been added. `"general-prophetic-supplication"` and the other named/attributed values were not used because Prophetic attribution itself remains reported, not confirmed.

`morningSpecificStatus: "morning-only"` is retained, based on direct timing wording within the transcribed document text itself ("أَصْبَحْنَا" / "أَوَّلَ هَذَا النَّهَارِ") — not on a directly-inspected narrator-frame, not on authentication of the reported narration, and not on a confirmed absence of an evening-parallel version. This field describes the explicit timing of the transcribed text itself, nothing more.

Both values describe reported/indexed sourcing and structural findings as located in this pass, not authenticated status or established source unity.

## 21. Scholarly-review recommendation

Scholarly review is recommended only **after**, not instead of, the direct-inspection work below:

1. Directly inspect Mishkat al-Masabih hadith 38/2414 and Mirqat al-Mafatih vol. 14 p. 107, to resolve the "وَالْحَمْدُ لِلَّهِ" discrepancy and confirm the Ibn Abi Awfa/Abu al-Warqa' narrator chain.
2. Directly inspect al-'Iraqi's Takhrij Ahadith Ihya' 'Ulum al-Din itself, to confirm the "إسناده ضعيف" grading and its exact scope and wording.
3. Attempt to locate a source for the closing phrase "أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ", or classify it as currently unsourced.
4. Determine whether the 'Abd ibn Humaid/al-Tabarani weak report and the Ibn Abi Awfa/Mishkat al-Masabih report are the same underlying narration.
5. Once source unity is resolved one way or another, revisit `contentClassification` against the actual established relationship between clause A and clause B — do not retain `composite-text` (or assign it) unless at least two independently-sourced components are actually established.
6. Decide whether MDR-005 should be corrected, preserved as compilation wording, split, or excluded — only after the above direct inspection is complete.

## 22. Import gate result

`computeImportGate(MDR-005)` returns `canImport: false`, blocked by five independent conditions: `sourceResearchStatus` is `"in-progress"`, not `"verified"`; `wordingMatchStatus` (`"unresolved"`) is not an accepted resolved state; `hadithGrading` is empty at the record level; `scholarlyDecision` remains `"pending"`; `importStatus` remains `"research-only"`. The canonical gate itself is unchanged.

## 23. Manual verification checklist

- [ ] Directly inspect Mishkat al-Masabih hadith 38/2414 (al-Tabrizi's own page, not a commentary's quotation of it).
- [ ] Directly inspect Mirqat al-Mafatih vol. 14 p. 107 and al-Matalib al-'Aliyya's own entry to resolve the "وَالْحَمْدُ لِلَّهِ" discrepancy.
- [ ] Confirm or refute the Ibn Abi Awfa/Abu al-Warqa' narrator chain by direct inspection.
- [ ] Directly inspect al-'Iraqi's Takhrij Ahadith Ihya' 'Ulum al-Din for the "إسناده ضعيف" grading and its precise scope.
- [ ] Record exact hadith numbers, volumes, pages, editions, and Arabic wording once a primary page is opened.
- [ ] Search further for the closing phrase "أَسْأَلُكَ خَيْرَ الدُّنْيَا وَالْآخِرَةِ يَا أَرْحَمَ الرَّاحِمِينَ" or classify it as unsourced.
- [ ] Determine whether the 'Abd ibn Humaid/al-Tabarani report and the Ibn Abi Awfa/Mishkat al-Masabih report are the same narration.
- [ ] Resolve the "يَوْمِنَا هَذَا" vs. "هَذَا النَّهَارِ" lexical variant.
- [ ] Check whether an evening-parallel ("أَمْسَيْنَا") version of this exact wording exists elsewhere.
- [ ] Obtain scholarly judgment before retaining any weak, disputed, or unsourced component.
- [ ] Revisit `contentClassification` (currently `unclassified`) once source unity is resolved — do not assign `composite-text` unless at least two independently-sourced components are actually established.
- [ ] Decide whether MDR-005 should be corrected, preserved as compilation wording, split, or excluded.
