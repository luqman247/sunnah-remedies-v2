# MDR-003 — Source Audit (Stage 3B)

## 1. Status

**Complete wording located in a secondary classical compilation — original al-Tabarani source and wording variants still require scholarly verification.** `sourceResearchStatus` is `scholarly-review-required`, not `verified`. Not scholarly-approved. Not import-ready. `scholarlyDecision` remains `pending` and `importStatus` remains `research-only`. See [Import gate result](#19-import-gate-result) below.

This report does not call Majma' al-Zawa'id the primary source, does not describe al-Tabarani as directly inspected, does not describe Prophetic attribution as authenticated, and does not describe the وَ/أَوْ timing wording as resolved. MDR-003 was initially treated as a likely composite of independently-sourced clauses, per its length and apparent thematic shifts. Direct inspection of al-Haythami's Majma' al-Zawa'id — a recognised **secondary** classical compilation that quotes and evaluates reports from earlier collections, not al-Tabarani's own primary collection — found that the complete sequence of all six MDR-003 clauses was located together, in the same broad order, in one quoted narration there, attributed to al-Tabarani and reported as narrated from Abu Umama al-Bahili through a chain al-Haythami grades weak. This report retains the clause-by-clause segmentation for wording-comparison precision. The composite-clauses hypothesis is not supported by the located quotation, but confirmation from al-Tabarani's own original entry remains outstanding.

## 2. Exact full source-document wording

```
أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ، وَأَحَقُّ مِنْ عَبْدٍ، وَانْصُرْ مَنِ ابْتَغَى، وَأَرْأَفُ مِنْ مَلِكٍ، وَأَجْوَدُ مِنْ سُئِلَ، وَأَوْسَعُ مِنْ أَعْطَى أَنْتَ الْمَالِكُ لَا شَرِيكَ، وَالْفَرْدُ لَا نِدَّ لَكَ، كُلُّ شَيْءٍ هَالِكٌ إِلَّا وَجْهَكَ، لَنْ تُطَاعَ إِلَّا بِإِذْنِكَ، وَلَنْ تُعْصَى إِلَّا بِعِلْمِكَ، تُطَاعُ فَتُشْكَرُ، وَتُعْصَى فَتُغْفَرُ، أَقْرَبُ شَـهِيدٌ، وَأَدْنَى حَفِيظٌ، حَلَتْ دُونَ النُّفُوسِ، وَأَخَذَتْ بِالنَّوَاصِي، وَكَتَبَتْ الْآثَارَ، وَنَسَخَتْ الْآجَالَ، الْقُلُوبُ لَكَ مَفْضِيَةٌ، وَالسِّرُّ عِندَكَ عَلَانِيَةٌ، الْحَلَالُ مَا أَحْلَلْتَ، وَالْحَرَامُ مَا حَرَّمْتَ، وَالدِّينُ مَا شَرَعْتَ، وَالْأَمْرُ مَا قَضَيْتَ، الْخَلْقَ خَلْقَكَ، وَالْعَبْدُ عَبْدُكَ، وَأَنتَ اللَّـهُ الرَّؤُوفُ الرَّحِيمُ، أَسْأَلُكَ بِنُورِ وَجْهِكَ الَّذِي أَشْرَقَ لَهُ السَّمَاوَاتُ وَالْأَرْضُ، وَبِكُلِّ حَقٍّ هُوَ لَكَ، وَبِحَقِّ السَّائِلِينَ عَلَيْكَ، أَنْ تَقِيلَنِي فِي هَذِهِ الْغَدَاةِ، وَفِي هَذِهِ الْعَشِيَّةِ، وَأَنْ تَجِيرَنِي مِنَ النَّارِ بِقُدْرَتِكَ 
```

(`originalDocumentText`/`fullArabicText`, unchanged from Stage 3A — 996 characters.)

## 3. Segmentation method

Boundaries were drawn on grammatical/thematic grounds — shifts in verb form, predicate structure, or grammatical subject — not merely because the passage is long, per instruction. Six clauses (`MDR-003-A` through `MDR-003-F`) were identified:

- **A→B**: comparative (*af'al min*) constructions end; plain noun-predicate declarative sentences begin.
- **B→C**: noun-predicate sentences end; negated second-person passive verbs begin (لن تُطاع / لن تُعصى).
- **C→D**: verb-based obedience/disobedience statements end; elative predicate-adjective declarations begin (أقرب شهيد / أدنى حفيظ).
- **D→E**: implied-subject verb chain ends; a new explicit grammatical subject ("القلوب") opens a fresh run of parallel declarations.
- **E→F**: the clearest boundary in the record — third-person declarative praise about Allah ends; first-person petition ("أَسْأَلُكَ", "I ask You") begins.

Each clause's exact text is **computed programmatically** from the register's own `originalDocumentText` (via `String.indexOf` on the opening-word marker, in `src/lib/dhikr-research/audits/mdr-003-clause-map.ts`) rather than hand-transcribed, eliminating manual transcription risk between the clause map and the authoritative register text.

## 4. Clause map

| Clause | Opening words | Boundary confidence | Apparent genre |
|---|---|---|---|
| MDR-003-A | أَاللَّهُمَّ أَنْتَ أَحَقُّ مِنْ ذِكْرٍ | High | Reported as a prophetic supplication (weak chain) |
| MDR-003-B | أَنْتَ الْمَالِكُ لَا شَرِيكَ | High | Divine praise |
| MDR-003-C | لَنْ تُطَاعَ إِلَّا بِإِذْنِكَ | High | Divine praise |
| MDR-003-D | أَقْرَبُ شَـهِيدٌ | High | Divine praise |
| MDR-003-E | الْقُلُوبُ لَكَ مَفْضِيَةٌ | High | Divine praise |
| MDR-003-F | أَسْأَلُكَ بِنُورِ وَجْهِكَ | High | Reported as a prophetic supplication (weak chain) |

"Apparent genre" records the claimed/transmitted genre, not an authenticated classification. Full boundary reasoning, exact clause text, and per-clause research findings are in `src/lib/dhikr-research/audits/mdr-003-clause-map.ts` (`MDR_003_CLAUSE_MAP`).

## 5. Reconstruction-integrity result

Concatenating all six clauses' `exactArabicClause` values in order (`reconstructMdr003FromClauses()`) reproduces `MDR-003.originalDocumentText` **exactly** — verified programmatically, with no separator-insertion logic required (each non-final clause's slice already includes its own trailing comma-space or space, exactly as it appears in the source document; there is no comma between clauses A and B in the original text — a bare space separates them). Sum of clause lengths (996) equals the original text's length (996); no character is omitted or duplicated. See `tests/dhikr/dhikr-source-register-mdr-003-audit.test.ts` for the automated proof.

## 6. Source table per clause

| Clause | Located together in | Reported collection | Reported narrator |
|---|---|---|---|
| A–F | One quoted narration in al-Haythami's Majma' al-Zawa'id (a recognised secondary classical compilation) | Attributed there to al-Tabarani (al-Mu'jam al-Kabir / Kitab al-Du'a) — al-Tabarani's own original entry not directly inspected | Abu Umama al-Bahili, reported as narrating from the Prophet ﷺ, through a chain graded weak |

No clause was found to have a separately-sourced origin distinct from the others within the located quotation — the initial composite-clause hypothesis is not supported by this quotation. This is distinct from saying the hypothesis is disproven at al-Tabarani's original-source level, which was not directly inspected.

## 7. Evidence-quality table

| Source | Evidence level | Detail |
|---|---|---|
| al-Haythami, Majma' al-Zawa'id | Directly inspected recognised secondary classical compilation | Fetched via `WebFetch` from a recognised classical-text hosting page (islamweb.net); the complete Arabic quotation, reported narrator, reported collection attribution, and al-Haythami's own grading statement were extracted directly from the page's content, processed through this environment's fetch/summarization tooling rather than read as raw untouched source. This is al-Haythami's quotation and evaluation, not al-Tabarani's own primary text. |
| al-Tabarani, al-Mu'jam al-Kabir / Kitab al-Du'a | Reported underlying source; exact original entry not directly inspected | Named as the source in both Majma' al-Zawa'id and the independent islamqa.info corroboration, but al-Tabarani's own original page/edition was not located or read in this pass. |
| islamqa.info fatwa (ar/answers/549819) | Directly inspected secondary corroboration | Fetched directly in this pass; quotes the opening and closing of the same hadith (with an ellipsis for the middle), independently states the narrator chain (Fudail ibn Jubair, alternate spelling), reported collection (al-Tabarani, "al-Du'a" and "al-Mu'jam al-Kabir"), and the same weak verdict. |
| Usul.ai — commentary works (Sharh Bulugh al-Maram, Subul al-Salam, Mir'at al-Mafatih, etc.) | Indexed classical commentary located, with precise caveats | Secondary corroboration that this hadith is recognised and discussed in classical commentary literature; full context of each entry not independently inspected beyond the search tool's summary — surfaced via search index, not directly read in full. |
| Usul.ai — rijal-criticism works (Ibn 'Adi's al-Kamil, al-Dhahabi's al-Mughni, Ibn al-Mulaqqin's Mukhtasar) | Indexed classical rijal source located, with precise caveats | Corroborates Faddal/Fudail ibn Jubair's documented weakness via a different literature genre than the commentary works above; surfaced via search index and summarized by the fetch tool, not read in full. |
| al-Tabarani's own al-Mu'jam al-Kabir / Kitab al-Du'a, as an independently browsed primary entry | No source located | Not surfaced as a directly browsable primary entry via Usul.ai's keyword search in this pass; remains a manual-verification item. |

Partial phrase matches are not treated as proof of a full clause's sourcing anywhere in this audit — every clause's sourcing conclusion rests on the full-text comparison in §8 against al-Haythami's quotation specifically, not on isolated keyword hits and not on an assumption that al-Tabarani's original reads identically.

## 8. Arabic wording comparisons

Complete wording directly inspected in al-Haythami's Majma' al-Zawa'id (a recognised secondary classical compilation, relayed through this environment's fetch tooling — not al-Tabarani's own primary text, which was not directly inspected):

```
اللهم أنت أحق من ذُكِر، وأحق من عُبِد، وأنصر من ابتُغِي، وأرأف من ملك، وأجود من سُئِل، وأوسع من أعطى، أنت الملك لا شريك لك، والفرد لا يهلك، كل شيء هالك إلا وجهك، لن تُطاع إلا بإذنك، ولن تُعصى إلا بعلمك، تُطاع فتشكر، وتُعصى فتغفر، أقرب شهيد، وأدنى حفيظ، حلت دون الثغور، وأخذت بالنواصي، وكتبت الآثار، ونسخت الآجال، القلوب لك مفضية، والسر عندك علانية، الحلال ما أحللت، والحرام ما حرمت، والدين ما شرعت، والأمر ما قضيت، والخلق خلقك، والعبد عبدك، وأنت الله الرءوف الرحيم. أسألك بنور وجهك الذي أشرقت له السماوات والأرض، بكل حق هو لك، وبحق السائلين عليك، أن تقبلني في هذه الغداة - أو في هذه العشية - وأن تجيرني من النار بقدرتك.
```

| Clause | Wording match (against al-Haythami's quotation) | Key differences |
|---|---|---|
| A | Materially different | MDR-003: "مِنْ ذِكْرٍ"/"مِنْ عَبْدٍ" (genitive nouns) vs. quotation: "مَنْ ذُكِرَ"/"مَنْ عُبِدَ" (relative-clause passive verbs) — real grammatical-construction difference; MDR-003's imperative "وَانْصُرْ" vs. quotation's comparative "وَأَنْصَرُ" breaks MDR-003's own parallel structure. |
| B | Materially different | MDR-003: "الْمَالِكُ" (Owner) vs. quotation: "الْمَلِكُ" (King) — different word; MDR-003's "لَا شَرِيكَ" omits the quotation's trailing "لَكَ"; MDR-003's "لَا نِدَّ لَكَ" vs. quotation's "لَا يَهْلِكُ" — different predicate entirely, most significant variant in the record. |
| C | **Exact match against the inspected quotation** (not established as exact against every transmission of the hadith, or against al-Tabarani's uninspected original) | No difference identified. |
| D | Materially different | MDR-003: "النُّفُوسِ" (souls) vs. quotation: "الثُّغُورِ" (frontier-posts) — different noun. |
| E | Materially different | MDR-003 omits the "وَ" conjunction before "الْخَلْقَ" that the quotation has before every parallel item in this list. |
| F | Materially different | MDR-003: "أَشْرَقَ" (masculine verb) vs. quotation: "أَشْرَقَتْ" (feminine, standard agreement); MDR-003: "تَقِيلَنِي" (release/pardon) vs. quotation: "تَقْبَلَنِي" (accept) — different root; MDR-003: "وَ" ("and") vs. quotation: "أَوْ" ("or") between "هذه الغداة" and "هذه العشية" — a meaning-changing timing variant, discussed in §10 and kept explicitly unresolved. |

Each identified difference may reflect source-document transcription drift, a genuine transmission variant, edition variation between printings of Majma' al-Zawa'id, or an unresolved error in either text — this audit does not decide which explanation is correct for any clause.

**Record-level finding**: `wordingMatchStatus` is set to **`materially-different`**. Five of six clauses contain real wording variants from al-Haythami's quoted wording; several (§B, §F) change meaning, not merely orthography. The located narration is recognisably the same supplication as MDR-003, but MDR-003 is not an exact transcription of al-Haythami's quotation. No word is treated as present where it is missing, nor is any missing word silently added to `originalDocumentText`, and the portal must not silently replace MDR-003's document wording with al-Haythami's quoted wording — scholarly review must decide whether to preserve, correct, replace, or exclude it.

## 9. Attribution analysis

Reported as a Prophetic supplication through a weak chain — attributed to the Prophet ﷺ, via the Companion narrator Abu Umama al-Bahili, but the chain from Abu Umama onward includes Faddal/Fudail ibn Jubair, whom al-Haythami states is weak and agreed upon as weak (§13). Prophetic attribution is recorded here as transmitted, not authenticated, and is not inferred from Hisn al-Muslim/Hisn al-Hasin placement — neither compilation was checked or relied upon in this pass. The attribution comes from the isnad quoted in Majma' al-Zawa'id and is corroborated by islamqa.info, both directly inspected; it does not come from, and is not corroborated by, any direct inspection of al-Tabarani's own original entry.

## 10. Timing analysis

Not derived from a chapter heading alone, and not treated as textually resolved. Two pieces of evidence relate to a morning/evening association: (1) Majma' al-Zawa'id places this hadith in the chapter "ما يقول إذا أصبح وإذا أمسى" ("what to say when entering morning and evening"); (2) clause F's own wording references "هذه الغداة" ("this morning") and "هذه العشية" ("this evening"). However, al-Haythami's quotation uses **"أَوْ" (or)** between these two references — "in this morning **or** in this evening" — implying the du'a is said at whichever occasion currently applies, not necessarily both. MDR-003's own document text uses **"وَ" (and)** at this exact point, implying both together.

**This variant is kept explicitly unresolved, in either direction.** `morningSpecificStatus` is set to **`uncertain`**, not `morning-and-evening`. The field's documented meaning is whether a record is *confirmed* to belong in a morning-specific dhikr list — that confirmation is not present here: the exact textual formulation is unresolved (وَ vs. أَوْ), and the underlying primary source (al-Tabarani's original) has not been inspected to settle it. A broad usage association with morning/evening dhikr is plausible from the chapter context alone, but usage category is explicitly distinguished here from exact textual wording, and the chapter heading alone is not relied upon to settle either. The record is not marked morning-specific merely because one clause carries a timing reference — clauses A–E carry no timing marker of their own.

## 11. Repetition analysis

No repetition marker is present in `sourceDocumentAnnotations` (empty array), and no repetition count was found in al-Haythami's quotation. `repetitionCount` is left unset.

## 12. Virtue/reward analysis

Al-Haythami's quoted wording is a first-person petition ("I ask You... that You pardon/accept me... and save me from the Fire by Your power"), not a third-person promise of virtue for reciting it (contrast MDR-002's explicit "nothing will harm him"). No "whoever recites this will receive X" framing was found in the quotation, and no virtue or reward claim is inferred from the supplication wording itself. `virtueOrRewardClaim` is left empty.

## 13. Grading analysis

Unlike MDR-001 and MDR-002, this record is not a composite of differently-graded components — the complete quoted narration in Majma' al-Zawa'id carries one grading verdict covering all six clauses, so `hadithGrading`/`gradingAuthority` are populated at the record level. This is al-Haythami's grading of the quotation he presents; it is not an independently re-derived grading of al-Tabarani's original entry.

| Source | Statement | Directly inspected? |
|---|---|---|
| al-Haythami, Majma' al-Zawa'id | "وفيه فضّال بن جبير، وهو ضعيف مجمع على ضعفه" — al-Haythami states that Faddal ibn Jubair is weak and agreed upon as weak | Yes, directly inspected in al-Haythami's own text |
| Ibn 'Adi, al-Kamil fi Du'afa' al-Muhaddithin (via Usul.ai) | Separate, distinct criticism: Faddal/Fudail ibn Jubair's [example] hadiths are "غير محفوظة" (unpreserved/unreliable) | Surfaced via search index and summarized by the fetch tool, not read in full |
| islamqa.info | Independently states "هذا الدعاء إسناده ضعيف لا يصح" (this dua's chain is weak, not authentic) | Yes, directly inspected |

Al-Haythami's "ضعيف مجمع على ضعفه" is attributed here to al-Haythami's own statement specifically, directly inspected in his text — it is not converted into an independent claim of broader modern scholarly consensus. It is separately corroborated (not merged into one claim) by Ibn 'Adi's own, distinct criticism and by islamqa.info's own independent verdict. No disagreement was found between these three sources on the weak verdict.

## 14. Compilation provenance

Al-Tabarani (d. 360 AH) significantly predates both Ibn al-Jazari's 'Amal al-Yawm wal-Layla/Hisn al-Hasin (d. 833 AH) and Sa'id al-Qahtani's modern Hisn al-Muslim. Neither Hisn compilation's own inclusion (or non-inclusion) of this hadith was checked in this pass — they are not being used as the source, per instruction, and their compilation provenance (if any) is a separate, unresolved question.

## 15. Usul.ai searches and exact locations

Full detail recorded in the register's `usulAiResearchNotes` field; summarized:

- **Search 1** (`اللهم أنت أحق من ذكر وأحق من عبد`): Sharh Bulugh al-Maram (al-Khudayr) vol. 2 p.213; Subul al-Salam (al-San'ani) vol. 7 p.3169 and vol. 1 p.109; al-Tabsira li'l-Lakhmi vol. 3 p.191; Mir'at al-Mafatih Sharh Mishkat al-Masabih (al-Mubarakfuri) vol. 1 p.269; Tuhfat al-Dhakirin (al-Shawkani) vol. 5 p.41; Masabih al-Jami' (al-Damamini) vol. 1 p.199. All indexed commentary/sharh works, not al-Tabarani's own primary page; surfaced via search index, not directly read in full.
- **Search 2** (`فضال بن جبير عن أبي أمامة`): Ibn 'Adi's al-Kamil fi Du'afa' al-Muhaddithin vol. 6 p.21 / vol. 7 p.131 / vol. 8 p.586 (entry 1568); al-Dhahabi's al-Mughni fi al-Du'afa' vol. 2 p.510 (entry 4904); Ibn al-Mulaqqin's Mukhtasar Talkhis al-Dhahabi vol. 1 p.463 (entry 156); al-Sudasiyyat (al-Farawi) vol. 1 p.81 (entry 24). Indexed rijal-criticism works, corroborating the weak-narrator finding via a different literature genre than Search 1 — surfaced via search index, not directly read in full.

Neither search surfaced al-Tabarani's own al-Mu'jam al-Kabir or Kitab al-Du'a as a directly browsable primary entry with its own hadith number.

## 16. Unresolved clauses

None of the six clauses is unsourced within the located quotation — all six were found together in the same quoted narration. What remains unresolved is wording-level, not sourcing-level: clauses A, B, D, E, and F each carry one or more wording variants (§8) not yet resolved as source-document transcription drift, a genuine transmission variant, edition variation, or an unresolved error — and, separately, al-Tabarani's own original entry remains uninspected for every clause.

## 17. Overall classification

`contentClassification: "general-prophetic-supplication"` (changed from the default expectation of `composite-text`, since the located quotation does not support a composite-of-independently-sourced-fragments reading). This classification describes the claimed genre and reported attribution as transmitted in a weak chain, not an authenticated fact. `morningSpecificStatus: "uncertain"` (kept at the Stage 3A default, not changed to `morning-and-evening`) — see §10 for the full rationale: the وَ/أَوْ textual variant is unresolved, and the field's "confirmed to belong" standard is not met by chapter placement alone.

## 18. Scholarly-review recommendation

1. Determine whether MDR-003's clause-level wording variants (§8) reflect source-document transcription drift, a genuine transmission variant, edition variation, or an unresolved error, and whether any correction is warranted before future publication use.
2. Resolve the وَ/أَوْ (and/or) variant in clause F and its effect on the intended morning/evening framing.
3. Decide whether this narration's weak grading should exclude it from the final published register regardless of wording resolution.
4. Locate and directly inspect al-Tabarani's own al-Mu'jam al-Kabir / Kitab al-Du'a entry, rather than relying solely on Majma' al-Zawa'id's quotation of it.
5. Decide whether MDR-003 should be corrected, preserved as compilation wording, or excluded — the portal must not silently substitute al-Haythami's quoted wording for MDR-003's document wording without an explicit scholarly decision.

## 19. Import gate result

`computeImportGate(MDR-003)` returns `canImport: false`, blocked by four independent conditions: `sourceResearchStatus` is `"scholarly-review-required"`, not `"verified"`; `wordingMatchStatus` (`"materially-different"`) is not an accepted resolved state; `scholarlyDecision` remains `"pending"`; `importStatus` remains `"research-only"`. `hadithGrading` does not independently block, since one grading verdict genuinely covers the whole quoted narration (§13) — this is not a weakening of the canonical gate; the populated weak grading does not clear any of the four blockers above, and the gate is not relaxed to make the record appear more resolved than it is.

## 20. Manual verification checklist

- [ ] Locate al-Tabarani's exact original entry in al-Mu'jam al-Kabir or Kitab al-Du'a.
- [ ] Record its hadith number, volume, page, edition, and full Arabic.
- [ ] Compare al-Tabarani's original wording against al-Haythami's quotation.
- [ ] Verify whether the original reads وَ or أَوْ in the morning/evening clause.
- [ ] Verify each of the five materially different MDR-003 clauses against the original collection.
- [ ] Confirm al-Haythami's exact grading statement and narrator spelling.
- [ ] Review Faddal/Fudail ibn Jubair's status from directly inspected rijal sources rather than search summaries alone.
- [ ] Obtain scholarly judgment on whether a weak narration should be included in the public Morning Dhikr collection.
- [ ] Decide whether MDR-003 should be corrected, preserved as compilation wording, or excluded.
- [ ] Confirm no virtue or reward claim is inferred from the supplication wording itself.
