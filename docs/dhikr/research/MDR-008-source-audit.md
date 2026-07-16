# MDR-008 — Source Audit (Stage 3B)

## 1. Status

**Underlying narration identity well established (Sahih al-Bukhari, Shaddad ibn Aws, "Sayyid al-Istighfar") — MDR-008's own wording shows several unresolved points of difference from a directly-fetched (tool-mediated) reading, and a hadith-number discrepancy remains unreconciled.** `sourceResearchStatus` is `scholarly-review-required`. Not scholarly-approved. Not import-ready. `scholarlyDecision` remains `pending` and `importStatus` remains `research-only`. See [Import gate result](#24-import-gate-result) below.

MDR-008 was not assumed in advance to be one hadith, a complete narration, Prophetic, authentic, morning-specific, morning-and-evening, an exact source match, a recognised variant, or independently sourced — each was determined from evidence, including the Stage 3A `transcriptionNotes` flag identifying this as "Sayyid al-Istighfar," which was independently verified rather than simply trusted. This report distinguishes **three layers** that must not be merged: (1) the **recited supplication text** — MDR-008's own Arabic wording only, in `fullArabicText`/`originalDocumentText`, unchanged; (2) the **narrator/Prophetic frame** — the statement identifying this as Sayyid al-Istighfar and attributing it to the Prophet ﷺ; (3) the **narration-attached outcome statement** — the conditioned daytime/nighttime Paradise promise, which is evidence *about* the narration, not text the reciter says (§17). It also distinguishes several separate conclusions: (a) the underlying narration's identity (well supported — Sahih al-Bukhari, Shaddad ibn Aws); (b) the authenticity of that underlying report (Sahih al-Bukhari's own canonical inclusion); (c) the reward clause's substance, corroborated across multiple independent sources (§17); and (d) exact textual correspondence between MDR-008 and the primary wording (**not established** — three specific points of difference were observed, discussed at different confidence levels in §12).

A note on method: an initial `WebFetch` attempt at a second, independently-mediated corroborating source (ar.wikisource.org) was interrupted by the user mid-research. It was not retried and is not relied upon anywhere in this record.

## 2. Exact source-document wording

```
اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ
```

(`originalDocumentText`/`fullArabicText`, unchanged from Stage 3A — 278 characters. `transcriptionNotes` already recorded in Stage 3A: "Widely known as Sayyid al-Istighfar; transcribed exactly as it appears in the source document, not corrected or compared against a reference wording in this stage.")

## 3. Structural inspection

1. **Character count**: 278.
2. **Punctuation structure**: none — no commas, no periods, no other punctuation.
3. **Visible repetition marker**: none. `sourceDocumentAnnotations` is an empty array.
4. **Source-document annotations**: none.
5. **Grammatical structure**: one continuous first-person sentence addressed to Allah, moving through: tawhid affirmation ("أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ"); creation/servanthood declaration ("خَلَقْتَنِي وَأَنَا عَبْدُكَ"); covenant declaration ("وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ"); acknowledgement of favour and sin ("أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي"); a forgiveness plea ("فَاغْفِرْ لِي إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ"); and a refuge-seeking clause ("أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ").
6. **Genre assessment (pre-research)**: reads as a declaration-plus-petition structure with an embedded refuge-seeking clause — not obviously Qur'anic, not obviously later-devotional. This impression is **not** treated as confirmed until §13.
7. **Neighbouring-record relation**: checked against MDR-007 (§4) and found unrelated.
8. **Morning/evening counterpart check**: MDR-008's own transcribed text contains no morning/evening timing vocabulary at all (no "أَصْبَحْنَا"/"أَمْسَيْنَا" or similar) — unlike MDR-006 and MDR-007.

## 4. Neighbouring-record comparison

MDR-008 was checked against MDR-007 (a short declarative morning/evening formula from Jami' al-Tirmidhi, Abu Hurayrah) and MDR-009 (a testimony/oath formula bearing a "4x" repetition annotation) and found unrelated to both in content, source, and narrator. MDR-008 is not merged with either. No other record elsewhere in the register was identified as an exact counterpart to MDR-008's specific wording in this pass.

## 5. Segmentation decision

MDR-008 was **not** segmented into clauses. Although the text contains several grammatically distinct sub-clauses (tawhid affirmation; creation/servanthood; covenant; acknowledgement; forgiveness plea; refuge-seeking), all of its content is drawn from **one single, well-identified narration** (Sahih al-Bukhari, Shaddad ibn Aws) — there is no source plurality to reflect in a clause map. Segmenting merely because the text contains several clauses, or where all parts occur within one continuous narration, would have implied a source plurality the evidence does not support. No clause-map file was created.

## 6. Clause map

Not applicable — no clause-map file was created, per §5.

## 7. Reconstruction-integrity result

Not applicable — MDR-008 was not segmented, so there is no clause reconstruction to verify. `originalDocumentText` and `fullArabicText` remain identical and untouched (278 characters each).

## 8. Source hierarchy

| Candidate/reported item | Hierarchy label |
|---|---|
| islamweb.net library hosting of Sahih al-Bukhari (Kitab al-Da'awat, Bab Afdal al-Istighfar) | A directly fetched recognised hosting of Sahih al-Bukhari's collection text — the webpage was opened, but the isnad/matn quoted throughout this report is a tool-mediated quotation, not independently copied from raw HTML, a scan, or a print edition |
| ar.wikisource.org (Sahih al-Bukhari, Kitab al-Da'awat) | Not inspected — fetch attempt interrupted by the user; not relied upon |
| Usul.ai search-results index pages (×2 attempted; 1 completed, 1 timed out) | Indexed secondary discussion — directly inspected as an index page; not equivalent to inspecting the individual primary/commentary works listed |
| al-Sunan al-Kubra (an-Nasa'i); al-Badr al-Tamam; Fiqh al-Ad'iya wa'l-Adhkar; 'Amal al-Yawm wa'l-Layla (an-Nasa'i); Jam' al-Jawami' (al-Suyuti); Kitab al-Du'a (al-Tabarani) | Indexed classical/modern commentary — none individually opened |
| X/Twitter post quoting the hadith; dorar.net page title | Contextual resemblance only — seen as WebSearch snippets/titles, not fetched with `WebFetch` |
| WebSearch synthesis (narrator identity, hadith 6306 numbering, reward-clause description) | Not directly inspected; used only as corroborating context, not relied upon as fact |

No phrase in this report says "source located," "confirmed source," or presents any indexed item above as directly inspected when it was not.

## 9. Source table

| Reported source | Reported narrator | Directly inspected? |
|---|---|---|
| Sahih al-Bukhari, hadith 5947 (per the fetched page) / commonly cited 6306 | Shaddad ibn Aws, via the isnad Abu Ma'mar -> 'Abd al-Warith -> al-Husayn -> 'Abdullah ibn Buraidah -> Bushair ibn Ka'b al-'Adawi | Yes — tool-mediated quotation of a directly fetched primary-collection hosting |

No whole-record source is claimed from a partial match: the directly-fetched Bukhari quotation was checked to contain the full content of MDR-008 (every clause has a counterpart in the fetched reading), not merely the opening declaration — but see §12 for the three specific, separately-assessed points of difference.

## 10. Evidence-quality table

| Source | Evidence level | Detail |
|---|---|---|
| islamweb.net Sahih al-Bukhari library page | Directly fetched recognised hosting of a primary collection | Fetched successfully via `WebFetch`; isnad, hadith number, full matn, and reward clause obtained, mediated by the tool's summarising model |
| ar.wikisource.org | Not inspected | Fetch attempt interrupted by the user; not relied upon |
| Usul.ai search-results page 1 | Indexed secondary discussion | Confirms narrator identity and clause-order corroboration across indexed works; explicitly notes Sahih al-Bukhari does not appear among the indexed results |
| Usul.ai search-results page 2 (reward clause) | Not obtained | Fetch timed out after 60 seconds; not retried |
| X/Twitter post; dorar.net page title | Contextual resemblance only | Seen only as WebSearch snippets/titles, not independently fetched |

Search-result titles and snippets are not treated as equivalent to direct inspection anywhere in this report.

## 11. Arabic source wording and provenance

`sourceArabicWording` is populated, explicitly labelled tool-mediated and non-final: it was returned from a directly fetched hosting of Sahih al-Bukhari (islamweb.net/ar/library), and is **not** a raw transcription, not exact primary Arabic, not a character-for-character primary text, and not definitive Bukhari wording. Per that tool-mediated quotation, the clause order after "وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ" is: "أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ" (in the middle) — then "أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ" — then "وَأَبُوءُ لَكَ بِذَنْبِي" (with "لَكَ") — then "فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ" (with "فَ"). This quotation must not be treated as the final critical Arabic text for comparison purposes.

## 12. Wording comparison

`wordingMatchStatus` is **`unresolved`** — not `exact-match`, `minor-orthographic-variation`, `recognised-narration-variant`, `composite-of-multiple-sources`, or `materially-different`, because no source consulted in this pass is a raw (non-tool-mediated, non-snippet) inspection, per the explicit rule that tool-mediated wording without raw confirmation stays unresolved. Three points of difference were observed, each assessed at a **different confidence level** rather than treated as one undifferentiated contradiction:

1. **Clause order (most robustly corroborated)**: MDR-008 places "أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ" at the very end of the du'a, after the forgiveness plea. The directly-fetched Bukhari page places it in the middle, before "أَبُوءُ لَكَ بِنِعْمَتِكَ". This ordering is independently corroborated by two further sources not directly fetched (an X/Twitter quotation; a dorar.net page title, both snippet-level) and by a directly-fetched Usul.ai index page, which reported this clause consistently appearing before the acknowledgement clause across its own indexed corpus.
2. **Presence of "لَكَ" in "وَأَبُوءُ [لَكَ] بِذَنْبِي" (least certain)**: the directly-fetched Bukhari page includes "لَكَ"; MDR-008 does not. However, the same Usul.ai index page reported "وأبوء بذنبي" (without "لَكَ") as the *more common* form across its own indexed corpus — directly at odds with the Bukhari-page fetch on this specific point. Because this pass's own sources disagree with each other here, whether MDR-008 actually differs from "the" standard reading on this point is itself unresolved.
3. **Presence of "فَ" before "إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ" (two consistent but non-raw data points)**: the Bukhari-page fetch and the X/Twitter quotation both show "فَإِنَّهُ"; MDR-008 has "إِنَّهُ" without the connective. Not independently checked further.

None of these three points is attributed to a recognised narration variant, a transcription error, a compilation adaptation, or a fetch-tool artefact without directly inspected, raw Arabic evidence for any of those explanations specifically — a wording difference is not called a recognised variant merely because it looks familiar.

## 13. Attribution analysis

Reported as the Prophet's ﷺ own instruction ("سيد الاستغفار أن تقول..." — "the best form of seeking forgiveness is to say..."), narrated by Shaddad ibn Aws. The isnad on the directly-fetched page reads: Abu Ma'mar -> 'Abd al-Warith -> al-Husayn -> 'Abdullah ibn Buraidah -> Bushair ibn Ka'b al-'Adawi -> Shaddad ibn Aws — a tool-mediated reading, not independently re-verified against a manuscript. This narrator identity is corroborated without exception by every secondary source consulted, and the underlying narration's authenticity is about as well-established as any record audited in this register — but the introductory Prophetic frame itself was read only via the tool-mediated quotation, not independently confirmed against a raw edition.

## 14. Timing analysis

Two separate conclusions, per the field-semantics review in §22: literal wording status, and authenticated narration usage.

- **Direct timing wording in MDR-008 itself**: none. No "أَصْبَحْنَا"/"أَمْسَيْنَا" or similar vocabulary appears anywhere in MDR-008's own transcribed text. This remains true and is not revised.
- **Direct timing wording in the narration**: the wider hadith (per the tool-mediated Bukhari quotation) contains a day/night-conditioned reward clause ("whoever says it during the day with certainty and dies before evening... whoever says it at night with certainty and dies before morning...") which prescribes the supplication for both daytime and nighttime use. This clause is narration-attached evidence, not part of MDR-008's own recited text (§17), but it is directly relevant to `morningSpecificStatus`, which represents authenticated narration usage rather than only the literal transcribed string (§22).
- **Chapter/compilation placement only**: not used as a basis here — this record's placement within a "morning dhikr" register is explicitly not treated as timing evidence, consistent with every prior record in this register. The `morning-and-evening` conclusion below rests on the narration's own reported reward-clause conditions, not on register placement.
- No timing evidence was found within MDR-008's own recited document text — this literal-wording finding is preserved distinctly from the narration-usage finding (§22).

## 15. Morning/evening counterpart analysis

MDR-008's own recited text contains no timing vocabulary and was not identified as a counterpart to any other record in the register (§4). The wider hadith's reward clause conditions its promise on both day-time and night-time recitation — per the field-semantics review in §22, this is treated as authenticated narration usage supporting `morningSpecificStatus: morning-and-evening`, distinct from MDR-006/MDR-007's pattern where the *recited text itself* alternates by time of day. MDR-008 is not a fixed morning-and-evening dhikr formula in that structural sense — its own wording does not change between morning and evening recitation — but the narration nevertheless authenticates its use at both times.

## 16. Repetition analysis

No repetition marker is present in `sourceDocumentAnnotations` (empty array), and no repetition count was located in any directly-inspected or indexed source for this specific du'a. `repetitionCount` is left unset. This is not derived from familiarity, convention, or the source document alone.

## 17. Virtue/protection analysis

**Correction (narrow pass, superseding the initial Stage 3B decision)**: `virtueOrRewardClaim` was first left empty on the reasoning that the reward statement is absent from MDR-008's own transcribed text. On review, per `DhikrSourceResearchRecord`'s own JSDoc ("a reward/virtue claim, only ever populated from an explicit statement found during scholarly research — not populated from source-document text alone in Stage 3A"), this field is deliberately meant to be populated from research findings, not restricted to content literally present in `fullArabicText`. That restriction was too narrow and has been corrected.

`virtueOrRewardClaim` is now populated: **"The same Sahih al-Bukhari narration reportedly states that whoever says this supplication during the day with certainty and dies before evening, or says it during the night with certainty and dies before morning, will be among the people of Paradise."** All five conditions are preserved as a single conditioned statement, never separated or shortened: (1) saying this supplication; (2) daytime-or-nighttime context; (3) certainty; (4) death before evening or before morning; (5) the stated Paradise outcome. It is explicitly **not** shortened to "guarantees Paradise," "whoever says it enters Paradise," "protection from Hell," or any unconditional outcome.

`virtueEvidence` states: this is **narration-attached evidence, not part of the Arabic supplication transcribed in MDR-008** — it must not be inserted into `fullArabicText` or `originalDocumentText`, and is not presented as words the user recites. It follows the supplication as a Prophetic outcome statement attached to the narration as a whole, obtained from the same tool-mediated quotation of the directly-fetched islamweb.net Sahih al-Bukhari hosting used for §8–§11. The quotation was returned through `WebFetch` and is tool-mediated — the exact raw Arabic wording of the reward clause itself still requires confirmation against a raw, unmediated edition, a question distinct from the three wording points already recorded for the supplication text (§12). The claim's substance (as opposed to its exact wording) is corroborated across multiple independent WebSearch-synthesis sources in addition to the tool-mediated primary-page fetch, all describing the same day/night-conditioned Paradise promise without contradiction — this is not a single, unstable data point.

## 18. Grading/authenticity analysis

`hadithGrading` is populated: **"Sahih — the underlying narration is contained in Sahih al-Bukhari (Kitab al-Da'awat, Bab Afdal al-Istighfar; hadith 5947 per the directly-fetched hosting, commonly cross-referenced elsewhere as 6306), Shaddad ibn Aws; Bukhari's canonical inclusion supports the narration's authenticity. This does not authenticate MDR-008's exact ordering, spelling, vocalisation, or the three disputed particles/clause-position points — those remain outside this grading's scope. The attached daytime/nighttime reward statement belongs to this same reported narration; exact raw wording of both the supplication and the reward statement remains pending against a raw, unmediated edition."** `gradingAuthority` reads: **"Sahih al-Bukhari's own canonical status (no additional modern grading applied or sought, per instruction); not independently corroborated against a raw, unmediated edition in this pass."** Five separate conclusions are distinguished, not conflated:

1. The underlying narration is found in Sahih al-Bukhari (§8–§10, §13).
2. Sahih al-Bukhari's own canonical inclusion supports the narration's authenticity, per instruction — no additional modern grading was sought.
3. This does **not** authenticate MDR-008's exact clause order or the "لَكَ"/"فَ" points over the tool-mediated reading's reported form.
4. The attached reward statement (§17) belongs to this same reported narration — it is not a separately-sourced claim, but its exact raw wording is likewise not authenticated by this grading.
5. The unresolved wording points in §12 remain outside the character-level authentication claim, and remain open regardless of the grading.

It does **not** mean every MDR-008 letter-form is Sahih merely because the narration is in Bukhari, and it does **not** mean Sahih al-Bukhari's canonical status automatically validates MDR-008's exact transcription.

## 19. Compilation provenance

Sahih al-Bukhari (3rd century AH) predates Hisn al-Muslim and Hisn al-Hasin by many centuries; neither compilation's own inclusion (or non-inclusion, or wording) of MDR-008 was checked in this pass. This is recorded as an open question, not assumed either way. MDR-008's wording is treated as tracing to Sahih al-Bukhari's own text (subject to §12's unresolved points), not to a later compilation's paraphrase.

## 20. Usul.ai search log

| Query (Arabic) | Returned title | Author | Vol/Page | Entry/№ | Matched phrase | Full context inspected? | Attribution explicit? | Type | Confidence | Remaining verification |
|---|---|---|---|---|---|---|---|---|---|---|
| اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك | al-Sunan al-Kubra | an-Nasa'i | vol.6 p.121 | Entries 10298-10302 | Multiple chains from Shaddad ibn Aws and Jabir | No — index/snippet only | Yes (Shaddad ibn Aws) | Classical hadith collection | Low-moderate | Full entry unread — a genuine primary-collection lead |
| (same) | al-Badr al-Tamam (commentary) | al-Husayn ibn Muhammad ibn Sa'id al-La'i | vol.10 p.451 | — | Detailed exegetical analysis reported | No | Not itemised | Classical commentary | Low | Full entry unread |
| (same) | Fiqh al-Ad'iya wa'l-Adhkar | 'Abd al-Razzaq ibn 'Abd al-Muhsin al-Badr | — | — | Full supplication text reported | No | Not itemised | Modern compilation | Low | Full entry unread |
| (same) | 'Amal al-Yawm wa'l-Layla | an-Nasa'i | vol.9 p.670 | Entry 4055/22551 | Not itemised in detail | No | Not itemised | Classical hadith collection | Low-moderate | Full entry unread |
| (same) | Jam' al-Jawami' | al-Suyuti | vol.6 p.2 | — | "Includes fatwa interpretation" | No | Not itemised | Classical compilation | Low | Full entry unread |
| (same) | Kitab al-Du'a | al-Tabarani | vol.1 p.246 | — | Not itemised in detail | No | Not itemised | Classical hadith collection | Low | Full entry unread |
| من قالها من النهار موقنا بها فمات من يومه قبل أن يمسي | *(fetch timed out)* | — | — | — | — | — | — | — | — | Not obtained — fetch attempt timed out after 60 seconds, not retried |

The tool's own cross-source summary explicitly stated "Sahih al-Bukhari does not appear" among the first search's results, and reported that "أعوذ بك من شر ما صنعت" consistently appears before "أبوء لك بنعمتك" across the indexed corpus, while "وأبوء بذنبي" (without "لك") was reported as the more common indexed form. No individual permalink was extractable for any item, consistent with the pattern for MDR-001 through MDR-007 — this record's direct-inspection evidence came instead from the separate islamweb.net library fetch of Sahih al-Bukhari itself.

## 21. Unresolved issues

1. MDR-008 places the refuge-seeking clause at the end of the du'a; the directly-fetched Bukhari page and two further corroborating sources place it in the middle — the most robustly corroborated of the three wording points.
2. Whether "لَكَ" belongs in "وَأَبُوءُ [لَكَ] بِذَنْبِي" is itself unresolved — this pass's own sources (the Bukhari-page fetch vs. the Usul.ai index) disagree with each other.
3. MDR-008 lacks "فَ" before "إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ", where two consistent (non-raw) sources show "فَإِنَّهُ" — not independently checked further.
4. The hadith-number discrepancy (5947 on the directly-fetched page vs. 6306 commonly cited elsewhere) was not reconciled against a single authoritative index; edition/numbering-system variation is not assumed to explain it without checking.
5. A second Usul.ai search (for the reward-clause phrasing) timed out and was not completed.
6. A second, independently-mediated corroborating source (ar.wikisource.org) was not inspected — the fetch attempt was interrupted by the user and not retried.
7. Whether Hisn al-Muslim or Hisn al-Hasin include this wording, and in what form, was not checked in this pass.
8. No independently re-verified manuscript or printed critical edition was consulted to confirm the isnad or matn beyond tool-mediated fetches.

## 22. Overall classification

**Field-semantics review**: `src/lib/dhikr-research/types.ts` was inspected directly. `MorningSpecificStatus`'s own JSDoc reads "whether this record is confirmed to belong in a morning-specific dhikr list" — this describes confirmed/authenticated *belonging*, not narrowly whether the literal transcribed Arabic string contains timing vocabulary. Precedent within this register supports the same reading: MDR-006's `morningSpecificStatus` was set to `morning-and-evening` based on the wider narration's own reported morning/evening instruction, even though that instruction is entirely absent from MDR-006's own transcribed text. The field therefore represents **authenticated narration usage**, not internal timing words in isolation, register placement alone, or a mixture decided ad hoc.

**Timing-status decision**: `morningSpecificStatus` is corrected to **`"morning-and-evening"`** (an existing enum value; none was invented). The recited text contains no internal timing wording — this remains true and is stated explicitly (§14) — but the same Sahih al-Bukhari narration reportedly prescribes the supplication for both daytime and nighttime use via the reward clause's own conditions (§17). Literal wording status and narration usage are two separate conclusions; this field represents the latter.

**Classification decision**: `contentClassification` is **retained** as `"general-prophetic-supplication"` — not changed to `morning-and-evening` for symmetry with `morningSpecificStatus`. This field concerns the supplication's inherent genre (a first-person tawba/istighfar declaration-plus-petition), not its prescribed usage. MDR-008 is not structurally a morning-and-evening dhikr formula the way MDR-006/MDR-007 are — texts whose own wording alternates by time of day. It is a single fixed supplication reportedly efficacious whenever recited, day or night; its content does not change with the time of recitation. This is a deliberate distinction between genre and usage, not overlooked symmetry.

## 23. Scholarly-review recommendation

**sourceResearchStatus reassessment**: reviewed narrowly and **retained** as `"scholarly-review-required"` — not downgraded to `"in-progress"` and not raised to `"verified"`. The underlying narration, the Shaddad ibn Aws attribution, and the supplication-plus-reward-clause's substance are all substantially established: the reward clause's core conditions (daytime/nighttime, certainty, death timing, Paradise outcome) are corroborated across multiple independent WebSearch-synthesis sources in addition to the single tool-mediated primary-page fetch, not resting on one unstable data point. What remains is exact wording, ordering, and editorial treatment — the three particle/clause-position questions (§12) plus the reward clause's own exact raw phrasing — which is scholarly/editorial judgment, not "key sources uninspected."

Scholarly review is recommended to:

1. Obtain a raw, unmediated copy of Sahih al-Bukhari (a printed edition, PDF, or scan) for hadith 5947/6306 and compare MDR-008's supplication **and** the reward clause against it character-for-character, resolving the clause-order, "لَكَ", "فَ", and reward-wording questions without relying on a summarising fetch tool.
2. Reconcile the "5947" vs. "6306" hadith-number discrepancy against an authoritative index or edition, verifying (not assuming) whether it reflects distinct edition/numbering systems.
3. Directly inspect al-Sunan al-Kubra (an-Nasa'i, entries 10298-10302) as a further corroborating primary-collection lead.
4. Decide whether MDR-008's specific combination (particularly the moved refuge-seeking clause) reflects a documented narration variant, a compilation-document transcription choice, or an unresolved transcription drift.
5. Decide whether MDR-008 should be preserved as transcribed, corrected toward the Bukhari-page reading, or annotated — only after 1–4 above are complete.

## 24. Import gate result

`computeImportGate(MDR-008)` returns `canImport: false`, blocked by four independent conditions: `sourceResearchStatus` is `"scholarly-review-required"`, not `"verified"`; `wordingMatchStatus` (`"unresolved"`) is not an accepted resolved state; `scholarlyDecision` remains `"pending"`; `importStatus` remains `"research-only"`. `hadithGrading` (populated, scoped to the identified underlying narration) does not independently block the gate — this reflects the underlying narration's well-established identity and canonical inclusion, not a weakening of the gate's logic. Populating `virtueOrRewardClaim` in this pass did not introduce a new blocker: `virtueEvidence` was populated in the same pass, satisfying `computeImportGate`'s "a virtue or reward claim has no supporting evidence" condition — the blocker count remains four, unchanged from before this correction. `computeImportGate` itself was not modified.

## 25. Manual verification checklist

- [ ] Obtain a raw Arabic edition or scan of Sahih al-Bukhari for hadith 5947/6306.
- [ ] Record the edition, volume, page, book, chapter, and hadith number.
- [ ] Reconcile the 5947 and 6306 numbering systems.
- [ ] Compare MDR-008 character-for-character against the raw Arabic.
- [ ] Determine whether "أَعُوذُ بِكَ مِن شَرِّ مَا صَنَعْتُ" belongs in the middle or at the end of the du'a in the raw text.
- [ ] Determine whether "لَكَ" is present in "وَأَبُوءُ [لَكَ] بِذَنْبِي" in the raw text.
- [ ] Determine whether "فَ" appears before "إِنَّهُ لَا يَغْفِرُ الذُّنُوبَ" in the raw text.
- [ ] Verify the raw Arabic daytime reward clause.
- [ ] Verify the raw Arabic nighttime reward clause.
- [ ] Confirm that certainty is an explicit condition of the reward clause.
- [ ] Confirm the "before evening" and "before morning" conditions.
- [ ] Confirm the stated outcome wording concerning Paradise.
- [ ] Keep the reward statement separate from the recited supplication text.
- [ ] Directly inspect al-Sunan al-Kubra (an-Nasa'i, entries 10298-10302) for corroboration.
- [ ] Check recognised variant editions and commentaries (e.g. Fath al-Bari) for each of the three wording points specifically.
- [ ] Determine whether any MDR-008 form is a documented narration variant, a compilation-document transcription choice, or an unresolved textual question.
- [ ] Obtain scholarly approval before correcting or publishing MDR-008.
- [ ] Confirm no repetition count is inferred.
- [ ] Obtain scholarly judgment before marking `sourceResearchStatus: verified`.
- [ ] Decide whether MDR-008 should be preserved as transcribed, corrected, or annotated.
