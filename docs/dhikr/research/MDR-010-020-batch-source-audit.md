# MDR-010–020 — Batch Source Audit (Stage 3B, streamlined)

## Method note (applies to every record below)

This is a streamlined batch pass, not an exhaustive per-record inspection. Evidence for MDR-010, 011, 012, 013, 015, 016, 017, 018, 019, and 020 is **WebSearch synthesis only** — an AI-generated summary drawn from multiple indexed pages, not an inspected primary or secondary page. Per this batch's own evidence rules, "search snippets may identify leads but are not direct source inspection," so no record in this batch (other than MDR-014) uses a status stronger than `in-progress`/`disputed`. MDR-014 additionally includes two directly fetched pages (Qur'an.com and one scholarly-explanation page); those are labelled precisely where used. Two initially-planned WebFetch calls (to a site the user asked not be used) were not made; research for the affected records proceeded on WebSearch synthesis alone instead, consistent with the batch's "try one recognised alternative, then continue" rule.

No clause-map file was created for any of MDR-010–020: none required segmentation under the batch's own rule (independent source components, a distinct appended text, or clauses requiring different source conclusions). MDR-017's two source-document variants (separated by "|") are a Stage 3A transcription feature, not a Stage 3B segmentation decision, and were preserved unchanged.

---

## MDR-010

**Exact text**: "اللَّهُمَّ مَا أصْبَحَ بِي مِنْ نِعْمَةٍ، أوْ بِأحَدٍ مِنْ خَلقِكَ، فَمِنْكَ وَحْدَكَ لا شَرِيْكَ لَكَ، فَلَكَ الحَمْدُ ولَكَ الشُّكْرُ" (135 characters, no annotations).

**Structural conclusion**: one continuous conditional-declaration sentence. **Segmentation**: not segmented — no source plurality indicated.

**Strongest source**: WebSearch synthesis only (no direct fetch). Consistently attributes the hadith to 'Abdullah ibn Ghannam al-Bayadi, reported by Abu Dawud and al-Nasa'i ('Amal al-Yawm wa'l-Layla).

**Narrator/reference**: 'Abdullah ibn Ghannam al-Bayadi; exact hadith number not confirmed.

**Source quality**: WebSearch synthesis (indexed secondary discussion) — not directly fetched.

**Wording comparison**: not performed against any inspected source; `wordingMatchStatus: unresolved`.

**Timing**: the hadith's own reported frame instructs "the like" upon retiring in the evening, substituting the time-word — a wording-level alternation, not merely an external condition. `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: none stated; `repetitionCount` unset.

**Virtue/reward**: reportedly, saying it upon waking fulfils the day's gratitude; the like in the evening fulfils the night's — populated as narration-attached evidence, not part of the recited text.

**Grading**: reportedly cited by al-Albani in al-Kalim al-Tayyib per an unfetched dorar.net title only; exact grading word not confirmed.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: no page directly fetched; exact evening-form wording and al-Albani's precise grading word not obtained.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch a primary hosting of Abu Dawud / al-Nasa'i for this report; [ ] confirm exact evening-form wording; [ ] confirm al-Albani's exact grading wording.

---

## MDR-011

**Exact text**: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْت، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ لَا إِلَهَ إِلَّا أَنْتَ" (265 characters, "3x" annotation).

**Structural conclusion**: five parallel 'afini/a'udhu clauses from one narration. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only. Consistently and specifically reports 'Abd al-Rahman ibn Abi Bakrah asking his father Abu Bakrah why he supplicated with these words every morning; Abu Bakrah answered he heard the Prophet ﷺ say them and wished to follow his sunnah.

**Narrator/reference**: Abu Bakrah Nufay' ibn al-Harith; reportedly Sunan Abi Dawud 5090, Musnad Ahmad 20430, Musnad al-Tayalisi 909.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: not performed; `wordingMatchStatus: unresolved`.

**Timing**: the hadith's own wording explicitly instructs three recitations upon entering morning and three upon entering evening. `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: `repetitionCount: 3` retained — directly consistent with the narration's own stated "three times morning, three times evening" instruction (a narration-internal basis, not merely a source-document display convention), though not confirmed via a directly fetched page.

**Virtue/reward**: none found beyond the petition itself; left empty.

**Grading**: reportedly "hasan or close to it" per WebSearch synthesis; not independently verified.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`; `repetitionCount: 3`.

**Unresolved issues**: no page directly fetched; exact wording of all five clauses not confirmed.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Sunan Abi Dawud 5090 or equivalent; [ ] confirm exact wording of the three-times instruction.

---

## MDR-012

**Exact text**: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ" (202 characters, no annotations).

**Structural conclusion**: four parallel refuge clauses from one narration. **Segmentation**: not segmented; checked against MDR-013 and found to be a distinct, non-overlapping narration (not a split of one hadith).

**Strongest source**: WebSearch synthesis only. Consistently attributes this exact eight-refuge formula to Sahih al-Bukhari, hadith 6363, Anas ibn Malik, as the Prophet's ﷺ frequent regular practice.

**Narrator/reference**: Anas ibn Malik; reportedly Sahih al-Bukhari 6363.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: WebSearch synthesis's own reported closing pair reads "وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ"; MDR-012's own text reads "وَغَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ" — a genuine two-word difference, recorded precisely, not smoothed over or called a recognised variant without further evidence. `wordingMatchStatus: unresolved`.

**Timing**: none stated in the text itself; `morningSpecificStatus: uncertain`.

**Repetition**: none stated.

**Virtue/reward**: none found as an explicit reward clause (only scholarly benefit-explanation, which is not the same as a Prophetic promise); left empty.

**Grading**: reportedly Sahih (Bukhari's own canonical inclusion), if the identification is correct; not independently confirmed.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the دَيْن/رِجَال wording pair difference is unresolved; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Sahih al-Bukhari 6363; [ ] resolve the دَيْن/رِجَال wording difference.

---

## MDR-013

**Exact text**: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ، وَالْهَرَمِ، وَسُوءِ الْكِبَرِ، وَفِتْنَةِ الدُّنْيَا وَعَذَابِ الْقَبْرِ" (120 characters, no annotations).

**Structural conclusion**: one continuous refuge-clause chain. **Segmentation**: not segmented; checked against MDR-012 and found non-overlapping, not a continuation of it.

**Strongest source**: WebSearch synthesis only, and inconclusive — two candidate hadiths were located (a Sahih Muslim combination and a distinct Sahih al-Bukhari/Anas ibn Malik combination), and **neither exactly matches** MDR-013's own five-item combination.

**Narrator/reference**: not confirmed — candidates only, not matched to MDR-013's exact wording.

**Source quality**: WebSearch synthesis — not directly fetched; underlying narration itself not conclusively identified.

**Wording comparison**: no located quotation exactly matches MDR-013's combination; `wordingMatchStatus: unresolved`.

**Timing**: none stated; `morningSpecificStatus: uncertain`.

**Repetition**: none stated.

**Virtue/reward**: none found; left empty.

**Grading**: none assigned — assigning a grading without a confirmed source would misattribute authority.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the underlying narration itself is unidentified — the most fundamental open question in this batch.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] identify the exact narration carrying this five-item combination via a concordance or critical index before assigning any grading or narrator.

---

## MDR-014

**Exact text**: "حَسْبِيَ اللهُ لاَ إلَهَ إلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ، وَهُوَ رَبُّ العَرْشِ العَظِيمِ 7x" (92 characters, "7x" annotation).

**Structural conclusion**: the base clause is Qur'anic text (Qur'an 9:129), not composed hadith prose; the "7x" is a separate hadith-level virtue-report. **Segmentation**: not segmented — recorded as one continuous unit.

**Strongest source**: **directly fetched** — Qur'an.com (quran.com/9/129) for the base wording, and khaledalsabt.com (a scholarly explanation page, tool-mediated) for the hadith-level report.

**Narrator/reference**: the Qur'anic clause has no hadith narrator. The "7 times" report is mawquf to Abu al-Darda' (per Abu Dawud, Kitab al-Adab) and separately marfu' to the Prophet ﷺ (per Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla) — two distinct attribution levels, not collapsed into one.

**Source quality**: Qur'anic clause — directly fetched and verified, exact match. Hadith-level report — directly fetched but tool-mediated secondary source (khaledalsabt.com), not a raw Abu Dawud/Ibn al-Sunni edition.

**Wording comparison**: `wordingMatchStatus: exact-match` for the Qur'anic clause only (verified against Qur'an.com); the hadith-level outcome clause's exact wording remains tool-mediated only.

**Timing**: seven times morning and seven times evening, per the hadith-level report's own stated instruction. `morningSpecificStatus: morning-and-evening`.

**Repetition**: `repetitionCount: 7` retained — textually consistent across sources reporting this narration (in both its mawquf and marfu' forms), though the report's own authority is separately disputed.

**Virtue/reward**: reportedly, saying it seven times morning and evening means Allah will suffice the reciter against whatever concerns him ("kafahu Allah ma ahammahu") — populated with both conditions (count and timing) preserved.

**Grading**: **disputed** — al-Mundhiri ("not below hasan"), Ibn Baz ("sound in chain," mawquf), Shu'ayb and 'Abd al-Qadir al-Arna'ut (authenticated isnad) versus al-Albani (classified fabricated/weak across multiple works). A genuine, named authenticity disagreement, directly confirmed via a fetched source.

**Final field values**: `contentClassification: quranic-recitation`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: disputed`; `wordingMatchStatus: exact-match`; `repetitionCount: 7`.

**Unresolved issues**: the hadith-level outcome clause's exact raw wording; al-Albani's own specific stated reasoning not directly inspected.

**Import blockers**: 3 (source research disputed, scholarly approval, research-only) — `wordingMatchStatus: exact-match` does not block, reflecting the directly-verified Qur'anic base text, not a weakening of the gate.

**Manual verification checklist**: [ ] directly inspect a raw edition of Abu Dawud's Sunan and Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla for the outcome clause's exact wording; [ ] directly inspect al-Albani's own stated reasoning.

---

## MDR-015

**Exact text**: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ. اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي, وَدُنْيَايَ وَأَهْلِي وَمَالِي. اللَّهُمَّ اسْتُرْ عَوْرَتِي وَأَمِّنْ رَوْعَتِي. اللَّهُمَّ احْفَظْنِي مِن بَيْنِ يَدَيَّ وَمِن خَلْفِي, وَعَنْ يَمِينِي وَعَنْ شَمَالِي, وَمِن فَوْقِي, وَأَعُوذُ بِعَظْمَتِكَ أَنْ أُغْتَالَ مِن تَحْتِي" (372 characters, no annotations — the longest record in this batch).

**Structural conclusion**: five successive petitionary clauses, reported as one narration the Prophet ﷺ never abandoned morning and evening. **Segmentation**: not segmented despite internal periods — no source plurality indicated.

**Strongest source**: WebSearch synthesis only. Consistently attributes this to 'Abdullah ibn 'Umar; reported by Abu Dawud, al-Nasa'i, Ibn Majah, and Ahmad.

**Narrator/reference**: 'Abdullah ibn 'Umar; reportedly Sunan Abi Dawud 5074.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: matches on substance across all five clauses per WebSearch synthesis; not checked character-for-character. `wordingMatchStatus: unresolved`.

**Timing**: explicit morning-and-evening usage reported. `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: none stated.

**Virtue/reward**: none found beyond the petitions themselves; left empty.

**Grading**: reportedly authenticated (isnad sahih) by al-Nawawi, Ahmad Shakir, and al-Albani — no disagreement found among these three in this pass, distinguishing this record from MDR-014/020's disputed gradings.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: no page directly fetched, notwithstanding the unusually consistent three-authority grading agreement found.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Sunan Abi Dawud 5074 or equivalent to confirm exact wording across all five clauses.

---

## MDR-016

**Exact text**: "اللَّهُمَّ عَالِمَ الغَيْبِ والشَّهَادَةِ، فَاطِرَ السَّموَاتِ والأرْضِ، رَبَّ كُلِّ شَيءٍ ومَلِيْكَهُ، أشْهَدُ أنْ لا إلَهَ إلاَّ أنْتَ، أعُوذُ بِكَ مِنْ شَرِّ نَفْسِي، وَمِنْ شَرِّ الشَّيْطَانِ وَشِرْكهِ، وأنْ أقْتَرِفَ عَلَى نَفْسِي سُوءًا، أوْ أجُرَّهُ إلَى مُسْلِمٍ" (270 characters, no annotations).

**Structural conclusion**: one continuous address-plus-witness-plus-refuge sentence, taught in a single instruction. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only. Consistently reports Abu Bakr al-Siddiq asking the Prophet ﷺ for morning-and-evening words and being taught this formula; narrated by Abu Hurayrah.

**Narrator/reference**: Abu Hurayrah; reportedly Sunan Abi Dawud 5067, Jami' al-Tirmidhi 3392.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: matches on substance per WebSearch synthesis; not checked character-for-character. `wordingMatchStatus: unresolved`.

**Timing**: reported as "when you wake up, when you retire in the evening, and when you go to bed" — three named occasions, ambiguously two-or-three distinct timings; not resolved in this pass, recorded exactly as found. `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: none stated.

**Virtue/reward**: none found beyond being taught as good words to say; left empty.

**Grading**: reportedly hasan sahih (al-Tirmidhi's own classification), and separately authenticated by Ibn Hibban and al-Hakim — no disagreement found in this pass.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the two-versus-three-occasions timing question; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Jami' al-Tirmidhi 3392 or equivalent; [ ] resolve the timing-occasions question.

---

## MDR-017

**Exact text**: two source-document variants separated by "|": "رَضِينَا بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا وَبِمُحَمَّدٍ رَسُولا" and "رضيت بِاللَّه رَبًّا وَبِالْإِسْلَامِ دينا وَبِمُحَمَّدٍ نَبيا" (137 characters total, "3x" annotation).

**Structural conclusion**: both variants preserved side by side exactly as Stage 3A recorded them; this pass did not merge, split, or choose between them. **Segmentation**: not applicable — the "|" divide is a Stage 3A transcription feature, not a Stage 3B clause map.

**Strongest source**: WebSearch synthesis only. Consistently locates one specific hadith wording: "رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ رَسُولًا" (Abu Sa'id al-Khudri; Abu Dawud, al-Nasa'i al-Kubra, Ibn Hibban, al-Hakim).

**Narrator/reference**: Abu Sa'id al-Khudri; reportedly Sunan Abi Dawud, al-Nasa'i al-Kubra 9748, Ibn Hibban 863, al-Hakim's Mustadrak 1904.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: the located wording ("رَضِيتُ ... رَسُولًا", singular, closing "رسولا") does not exactly match **either** of MDR-017's own two variants: variant 1 matches the closing word but uses the plural "رضينا"; variant 2 matches the singular form but uses "نبيا" instead of "رسولا". Neither variant is a confirmed exact match — recorded precisely, not resolved in favour of either. `wordingMatchStatus: unresolved`.

**Timing**: none stated in the located hadith's own reward clause; `morningSpecificStatus: uncertain`.

**Repetition**: `repetitionCount: 3` retained from Stage 3A but explicitly **not** narration-confirmed — the located hadith's own reward clause does not state a repetition count or morning/evening timing; the source-document's "3x, morning and evening" framing may be a later compilation convention rather than part of the base hadith's own text.

**Virtue/reward**: reportedly, saying the formula makes Paradise obligatory for the reciter ("wajabat lahu al-jannah") — recorded exactly as found, without adding a count or timing condition not present in the located source.

**Grading**: reportedly sahih by isnad (al-Hakim) and included in al-Albani's Sahih Abi Dawud per an unfetched title; no disagreement found in this pass.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`; `repetitionCount: 3` (flagged as not narration-confirmed).

**Unresolved issues**: which variant (if either) matches the primary wording; whether a repetition count/timing condition is part of the base hadith text.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch the specific Abu Dawud hadith number; [ ] determine which variant (if either) matches; [ ] confirm whether a count/timing condition belongs to the base text.

---

## MDR-018

**Exact text**: "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ" (123 characters, no annotations).

**Structural conclusion**: one continuous vocative-plus-petition sentence. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only. Consistently reports this as the Prophet's ﷺ advice to his daughter Fatimah, narrated by Anas ibn Malik.

**Narrator/reference**: Anas ibn Malik; reportedly al-Nasa'i (al-Sunan al-Kubra, 'Amal al-Yawm wa'l-Layla), al-Hakim, al-Bayhaqi, al-Bazzar.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: matches on substance and structure per WebSearch synthesis; not checked character-for-character. `wordingMatchStatus: unresolved`.

**Timing**: "when you wake up and when you go to bed" per the report. `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: none stated.

**Virtue/reward**: none found beyond the petition itself ("set right all my affairs"); left empty.

**Grading**: no specific grading word located in this pass — left as an open question rather than assumed from collection inclusion alone.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: no grading located; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch al-Nasa'i's al-Sunan al-Kubra or 'Amal al-Yawm wa'l-Layla; [ ] confirm exact wording, hadith number, and grading.

---

## MDR-019

**Exact text**: "أَصْبَحْنَا وَأصْبح الْملك لله وَالْحَمْد لله لَا شريك لَهُ لَا إِلَه إِلَّا هُوَ وَإِلَيْهِ النشور" (100 characters, no annotations; lighter diacritization already flagged in Stage 3A).

**Structural conclusion**: one continuous declarative sentence. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only, and a critical comparison against MDR-006's own already-researched fields (see below).

**Narrator/reference**: reportedly Abu Hurayrah, via al-Haythami's Majma' al-Zawa'id (a grading compilation, not itself the primary collection).

**Source quality**: WebSearch synthesis — not directly fetched; underlying primary collection not identified.

**Wording comparison**: MDR-019 was checked specifically against MDR-006 (Sahih Muslim, Ibn Mas'ud, a four-part 446-character formula) because both open with "أَصْبَحْنَا وَأصْبح الْملك لله." They diverge immediately after the opening clause: MDR-019 closes with "لَا شريك لَهُ لَا إِلَه إِلَّا هُوَ وَإِلَيْهِ النشور," a closing MDR-006's own researched wording does not contain at all. Treated as a **distinct, separately-narrated** short hadith, not a truncation or duplicate of MDR-006 — not merged. `wordingMatchStatus: unresolved`.

**Timing**: not independently confirmed beyond the register's own morning placement; treated as `morning-and-evening` on the same basis as the wider "أصبحنا/أمسينا" family, pending direct confirmation.

**Repetition**: none stated.

**Virtue/reward**: none found; left empty.

**Grading**: reportedly "good chain" (isnad hasan) per al-Haythami in Majma' al-Zawa'id — a compilation grading, whose scope (this specific wording vs. the underlying musnad report generally) was not resolved.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the underlying primary musnad (as opposed to al-Haythami's grading compilation) not identified; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] identify and directly fetch the specific primary musnad al-Haythami reviewed; [ ] confirm exact wording and an independent grading.

---

## MDR-020

**Exact text**: "أصَبَحْنَا وَأَصْبَحَ الْمَلِكُ لِلَّهِ رَبِّ الْعَالَمِينَ، اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذَا الْيَوْمِ فَتْحَهُ، وَنَصْرَهُ، وَنُورَهُ، وَبَرَكَتَهُ، وهدأيه، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِيهِ وَشَرِّ مَا بَعْدَهُ" (224 characters, no annotations; "وهدأيه" irregularity already flagged in Stage 3A).

**Structural conclusion**: one continuous declaration-plus-petition-plus-refuge sentence. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only. Consistently and specifically attributes this to Abu Malik al-Ash'ari, reported by Abu Dawud.

**Narrator/reference**: Abu Malik al-Ash'ari; reportedly Sunan Abi Dawud (exact number not confirmed).

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: WebSearch synthesis's own reported fivefold list ("fathahu, wa nasrahu, wa nurahu, wa barakatahu, wa hudahu") supports — but does not, without a directly fetched raw source, conclusively confirm — that MDR-020's own "وهدأيه" is a transcription irregularity for "وَهُدَاهُ." `fullArabicText`/`originalDocumentText` remain unedited per instruction. `wordingMatchStatus: unresolved`.

**Timing**: explicit morning-and-evening usage ("then when evening comes, let him say the same"). `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: none stated.

**Virtue/reward**: none found beyond the petition itself; left empty.

**Grading**: **disputed** — al-Nawawi (did not weaken its isnad), Ibn al-Qayyim (hasan), al-'Iraqi (good chain) versus Ibn Hajar (gharib; identified Isma'il ibn 'Ayyash's transmission as weak here) and al-Albani (hasan in Sahih al-Jami', later weakened in Da'if Abi Dawud — a documented change of position). A genuine, named authenticity disagreement.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: disputed`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the "وهدأيه"/"وَهُدَاهُ" question; the precise scope of Isma'il ibn 'Ayyash's transmission weakness; no page directly fetched.

**Import blockers**: 4 (source research disputed, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch the specific Sunan Abi Dawud hadith number and al-Albani's Da'if Abi Dawud entry; [ ] confirm the "وهدأيه"/"وَهُدَاهُ" question; [ ] confirm the precise scope of the isnad weakness.
