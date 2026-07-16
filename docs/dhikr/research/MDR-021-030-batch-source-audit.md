# MDR-021–030 — Batch Source Audit (Stage 3B, streamlined)

## Method note (applies to every record below)

This is a streamlined batch pass, not an exhaustive per-record inspection. Evidence for all ten records is **WebSearch synthesis only** — an AI-generated summary drawn from multiple indexed pages, not an inspected primary or secondary page. No WebFetch calls were made in this pass. Per this batch's own evidence rules, "search snippets identify leads but are not direct inspection," so no record uses a status stronger than `in-progress`.

**One clause map was created, for MDR-029 only** (`src/lib/dhikr-research/audits/mdr-029-clause-map.ts`, clauses `MDR-029-A`/`MDR-029-B`) — see its own section below for the full segmentation and reconstruction record. No clause-map file exists for MDR-021–028 or MDR-030.

---

## MDR-021

**Exact text**: "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ" (181 characters, no annotations).

**Structure**: one continuous four-clause declaration of Islamic identity. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only. Consistently attributes this to Musnad Ahmad, 'Abd al-Rahman ibn Abza, said both morning and evening.

**Narrator/reference**: 'Abd al-Rahman ibn Abza; Musnad Ahmad (number not confirmed).

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: located wording includes "حَنِيفًا مُسْلِمًا وَمَا كَانَ" (with "مُسْلِمًا"); MDR-021's own text lacks "مُسْلِمًا" at that position — recorded precisely, not smoothed over.

**Timing**: narration's own frame reportedly says both morning and evening. `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: none stated.

**Virtue/reward**: none found; left empty.

**Grading**: reportedly "isnaduhu sahih 'ala shart al-Shaykhayn" per Shu'ayb al-Arna'ut (unfetched title only).

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the "مُسْلِمًا" presence/absence; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Musnad Ahmad; [ ] confirm exact wording including the "مُسْلِمًا" question.

---

## MDR-022

**Exact text**: "لَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا إِلَهَ إِلَّا اللَّهُ لَا شَرِيكَ لَهُ لَا إِلَهَ إِلَّا اللَّهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ لَا إِلَهَ إِلَّا اللَّهُ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ" (250 characters, no annotations; Stage 3A notes the absence of a repetition marker unlike neighbouring MDR-023).

**Structure**: one continuous five-fold "la ilaha illa Allah" formula. **Segmentation**: not segmented; checked against MDR-023 and found structurally distinct.

**Strongest source**: WebSearch synthesis only. A five-fold formula matching this structure closely is located, Abu Hurayrah, graded sahih li-ghayrihi by al-Albani (Sahih al-Targhib 3481).

**Narrator/reference**: Abu Hurayrah; al-Nasa'i al-Sunan al-Kubra 9857 (via al-Albani).

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: located wording has "ولا شريكَ له" (with "و"); MDR-022 has "لَا شَرِيكَ لَهُ" (without "و") — recorded precisely.

**Timing**: none located specifically for this formula. `morningSpecificStatus: uncertain`.

**Repetition**: none stated (the five phrases form one fixed sequence, not a repeated count).

**Virtue/reward**: reportedly, saying these five phrases and dying within that day/night/month brings forgiveness — populated with the condition preserved.

**Grading**: sahih li-ghayrihi (al-Albani).

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the "و" wording point; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch al-Sunan al-Kubra 9857; [ ] confirm exact wording.

---

## MDR-023

**Exact text**: "لَا إِلَهَ إِلَّا اللَّهُ، وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ 10x" (125 characters, "10x" annotation).

**Structure**: one continuous tahlil formula plus the "10x" annotation applying to the whole. **Segmentation**: not segmented; checked against MDR-022 and found distinct.

**Strongest source**: WebSearch synthesis only. Consistently attributes to Abu Ayyub al-Ansari, Sahih Muslim 2693.

**Narrator/reference**: Abu Ayyub al-Ansari; Sahih Muslim 2693.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: matches on substance; not checked character-for-character. `wordingMatchStatus: unresolved`.

**Timing**: none located specifically for the 10x version. `morningSpecificStatus: uncertain`.

**Repetition**: `repetitionCount: 10` — matches the located hadith's own explicit "ten times" instruction.

**Source hierarchy correction (narrow remediation pass)**: the two reward figures were first recorded as equally weighted, with neither route stated as more authoritative. On review, this understated the actual source hierarchy. The **Sahih Muslim route has stronger source standing** because it is reported as part of Sahih Muslim's own canonical collection (identified in this pass as Sahih Muslim 2693, Abu Ayyub al-Ansari) — "equivalent to freeing four souls from the descendants of Isma'il" is therefore the **primary** reward claim for this record. The "ten slaves" figure, reported via a separate route (al-Haythami's Majma' al-Zawa'id — a secondary classical compilation, not Sahih Muslim's own text), is a **secondary-route report**: not discarded, but not merged into or substituted for the Sahih Muslim wording, and its own exact source, isnad, and grading remain **uninspected** in this pass (title-level lead only). Both figures remain tool-mediated/WebSearch-synthesis-level — the direct Sahih Muslim primary page has not yet been inspected, so "primary" here describes route/collection standing, not raw-verified wording. A related but distinct hundred-times version of a similar formula was also found and remains explicitly excluded, not conflated with either figure.

**Grading**: Sahih Muslim's own canonical inclusion covers the primary route specifically; it does not extend to authenticate the secondary Majma' al-Zawa'id route's own report.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`; `repetitionCount: 10`.

**Unresolved issues**: the secondary route's own source, isnad, and grading; no page directly fetched for either route.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Sahih Muslim 2693 to confirm the primary route's exact wording; [ ] directly inspect al-Haythami's Majma' al-Zawa'id (dorar.net sharh 75069) to confirm the secondary route's own isnad and grading.

---

## MDR-024

**Exact text**: "سُبْحَانَ اللهِ وَبِحَمْدِهِ، عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ" (102 characters, no annotations).

**Structure**: one continuous four-phrase tasbih formula. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only. Consistently attributes to Juwayriyyah bint al-Harith; Sahih Muslim, Abu Dawud, al-Nasa'i, Ibn Majah, al-Tirmidhi.

**Narrator/reference**: Juwayriyyah bint al-Harith; Sahih Muslim.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: a documented in-collection variant exists (a per-phrase-prefixed "Subhan Allah ['adad khalqihi]... Subhan Allah [rida nafsihi]..." form within Muslim's own routes) distinct from MDR-024's combined-opening form — recorded as a genuine comparison point, not resolved. `wordingMatchStatus: unresolved`.

**Timing**: the narrative frame (Prophet ﷺ finding Juwayriyyah still praying between Fajr and duha) is a **contextual** detail about when the exchange occurred, explicitly **not** treated as a "say this in the morning" instruction. `morningSpecificStatus: uncertain`.

**Repetition**: `repetitionCount: 3` — populated from the narration's own explicit "three times" statement despite the source document carrying no annotation; recorded as narration-supported, not source-document-supported.

**Virtue/reward**: reportedly, these words said three times outweigh everything Juwayriyyah said since morning — a comparative claim, preserved with its three-times condition, not converted to a fixed numeric reward.

**Grading**: Sahih Muslim's own canonical inclusion.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`; `repetitionCount: 3`.

**Unresolved issues**: combined-vs-per-phrase-prefixed wording question; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Sahih Muslim; [ ] resolve the wording-variant question.

---

## MDR-025

**Exact text**: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ لَا قُوَّةَ إِلَّا بِاللَّهِ مَا شَاءَ اللَّهُ كَانَ وَمَا لَمْ يَشَأْ لَمْ يَكُنْ أَعْلَمُ أَنَّ اللَّهَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ وَأَنَّ اللَّهَ قَدْ أَحَاطَ بِكُلِّ شَيْءٍ عِلْمًا" (215 characters, no annotations).

**Structure**: one continuous tasbih-plus-declaration sentence. **Segmentation**: not segmented.

**Strongest source**: WebSearch synthesis only. Sunan Abi Dawud 5075, taught by the Prophet ﷺ to one of his daughters (unnamed in sources located).

**Narrator/reference**: taught to an unnamed daughter of the Prophet ﷺ; Sunan Abi Dawud 5075 — **not assumed to be Fatimah** without further verification.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: matches on substance; not checked character-for-character. `wordingMatchStatus: unresolved`.

**Timing**: the reward's own reciprocal structure ("morning recitation protects until evening; evening until morning") implies narration-level usage at both times. `morningSpecificStatus`/`contentClassification`: `morning-and-evening`.

**Repetition**: none stated.

**Virtue/reward**: reportedly, morning recitation protects until evening and vice versa — both the reciprocal structure and timing condition preserved.

**Grading**: none located in this pass — left as an open question.

**Final field values**: `contentClassification: morning-and-evening`; `morningSpecificStatus: morning-and-evening`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the specific daughter's identity; no grading located; no page directly fetched.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Sunan Abi Dawud 5075; [ ] confirm the daughter's identity and a grading.

---

## MDR-026

**Exact text**: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ, سُبْحَانَ اللَّهِ الْعَظِيمِ وَبِحَمْدِهِ 100x" (80 characters, "100x" annotation).

**Structure**: one combined two-phrase utterance plus the "100x" annotation. **Segmentation**: not segmented — the finding here is identification uncertainty, not internal clause structure.

**Strongest source**: WebSearch synthesis only, and **inconclusive** — three candidate hadiths located, none an exact match: (1) Bukhari 6682/Muslim 2694, "two words... light on the tongue," **no count**; (2) Bukhari 6405, "Subhan Allah wa bihamdihi" **alone**, 100 times; (3) Umm Hani, three **separate** hundred-times counts (tasbih/takbir/tahlil), no tahmid.

**Narrator/reference**: Abu Hurayrah for the two closest candidates; not confirmed as MDR-026's own narrator since no exact match was found.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: MDR-026's combined-and-counted form does not exactly match any of the three located hadiths. `wordingMatchStatus: unresolved`.

**Timing**: none of the three candidates specifies morning/evening. `morningSpecificStatus: uncertain`.

**Repetition**: `repetitionCount: 100` retained from Stage 3A but **explicitly not confirmed** as narration-supported for the combined two-phrase form — the located 100x hadith applies only to "Subhan Allah wa bihamdihi" alone.

**Virtue/reward**: none assigned — assigning either candidate's reward to MDR-026 without confirming identification would misattribute it.

**Grading**: not assigned to MDR-026's own form; the two closest candidates are each individually sahih but neither, by itself, authenticates MDR-026's combined-and-counted structure.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`; `repetitionCount: 100` (flagged as not narration-confirmed for this specific form).

**Unresolved issues**: which (if any) of three candidate hadiths MDR-026 actually reflects, or whether it is a later compilation's combination.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Bukhari 6682, 6405, and Muslim 2694; [ ] determine which, if any, MDR-026 reflects.

---

## MDR-027

**Exact text**: "سُبْحَانَ اللَّهِ | الْحَمْدُ لِلَّهِ | لَا إِلَٰهَ إِلَّا اللَّهُ مَائَةَ مَرَّةٍ اللَّهُ أَكْبَرُ 100x" (106 characters, "100x" and an embedded "مِائَةَ مَرَّةٍ" annotation).

**Structure**: three "|"-separated phrases plus an embedded repetition phrase plus a trailing "الله أكبر" of unclear scope. **Segmentation**: considered, not formally adopted as a clause map — the source document's own "|" marks are preserved verbatim (MDR-017 precedent); the genuine open question is identification/scope, not clearly-established independent components each needing reconstruction proof.

**Strongest source**: WebSearch synthesis only, and **inconclusive** — two candidates located, neither an exact match: (a) Abu Hurayrah's longer-tahlil 100x hadith (a different, longer formula than a bare "la ilaha illa Allah"); (b) Umm Hani's triple-100x tasbih/takbir/tahlil hadith (omits tahmid entirely).

**Narrator/reference**: not confirmed — neither candidate's narrator was matched to MDR-027's own exact structure.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: the scope of "100 times" within the three-part structure is genuinely ambiguous — not resolved by assumption. `wordingMatchStatus: unresolved`.

**Timing**: none located. `morningSpecificStatus: uncertain`.

**Repetition**: `repetitionCount: 100` — clearly document-supplied (both the "100x" annotation and the embedded "مَائَةَ مَرَّةٍ" phrase agree), but what it applies to within the three-part structure is not resolved.

**Virtue/reward**: none assigned — identification not established.

**Grading**: not assigned — the underlying narration itself has not been conclusively identified.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`; `repetitionCount: 100` (document-supplied, scope unresolved).

**Unresolved issues**: which (if any) candidate hadith this reflects; the scope of the "100 times" count within the structure.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch both candidate hadiths; [ ] consult a concordance to determine MDR-027's actual source.

---

## MDR-028

**Exact text**: "المَسَاءُ فَقَطْ أَمْسَيْنَا وَأَمْسَى الْمَلِكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ أَعُوذُ بِاللَّهِ الَّذِي يُمْسِكُ السَّمَاءَ أَن تَقَعَ عَلَى الْأَرْضِ إِلَّا بِإِذْنِهِ مِنْ شَرِّ مَا خَلَقَ وَذَرَأَ وَبَرَأَ" (207 characters; Stage 3A already records the explicit "Evening only" heading).

**Structure**: one continuous evening-declaration-plus-refuge sentence. **Segmentation**: an initial working hypothesis (that this glues together the unrelated Ibn Mas'ud/MDR-006-family hadith with a separate refuge clause) was tested against search evidence and **rejected** — WebSearch synthesis locates ONE hadith (Ibn al-Sunni) containing both parts together. Not segmented.

**Strongest source**: WebSearch synthesis only. Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla, 'Abdullah ibn 'Amr ibn al-'As.

**Narrator/reference**: 'Abdullah ibn 'Amr ibn al-'As; Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: located closing reads "...min sharri ma khalaqa wa nashara, wa min sharri ash-shaytani wa shirkihi"; MDR-028's own closing reads "...مِنْ شَرِّ مَا خَلَقَ وَذَرَأَ وَبَرَأَ" (three creation-verbs, no Satan/shirk clause) — recorded precisely, not smoothed over. `wordingMatchStatus: unresolved`.

**Timing**: the source document's own explicit "Evening only" heading is direct, non-inferential evidence for this compiled entry's scope, distinguished from the underlying hadith's own reciprocal morning/evening structure (reported separately in the virtue claim). `morningSpecificStatus: evening-only`; `contentClassification: prophetic-evening-dhikr`.

**Repetition**: `repetitionCount: 3` — narration-supported (the located report states three times), despite no numeric annotation in the source document.

**Virtue/reward**: reportedly, three times in the evening protects from every sorcerer, diviner, and devil until morning (reciprocal for morning) — preserved with count, timing, and named protections intact.

**Grading**: reportedly a weak chain (unnamed narrator), with a fada'il-leniency caveat noted by the source consulted — not upgraded to "authentic."

**Final field values**: `contentClassification: prophetic-evening-dhikr`; `morningSpecificStatus: evening-only`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`; `repetitionCount: 3`.

**Unresolved issues**: the closing-clause wording difference; the unnamed narrator's identity.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Ibn al-Sunni's 'Amal al-Yawm wa'l-Layla; [ ] confirm exact closing wording; [ ] assess the unnamed narrator.

---

## MDR-029

**Exact text**: ": ACTION فَإِذَا طَلَعَتِ الشَّمْسُ وَصَلَّى رَكْعَتَيْنِ كَانَ لَهُ كَأَجْرِ حَجَّةٍ وَعُمَرَةٍ تَامَّةٍ كَمَا تَقَدَّمَ | وَيَقُولُ اللَّهُ تَعَالَى: يَا ابْنَ آدَمَ، ارْكَعْ لِي أَرْبَعَ رَكَعَاتٍ أَوَّلَ النَّهَارِ، أَكْفِكْ آخِرَهُ" (236 characters; Stage 3A already flags the "ACTION" label as not an ordinary recited dua).

**Structure**: **two independently reported hadiths joined by an explicit "|" divider** — Part 1 (Fajr-then-two-rak'ahs reward) and Part 2 (a Hadith Qudsi about four rak'ahs). **Segmentation (narrow remediation pass, superseding the initial decision)**: on review, the "|" divider was found to mark a genuine source-plurality boundary between two independently sourced, differently-graded narrations — not a within-narration pause of the kind the MDR-017 precedent (two alternative wordings of ONE reported hadith) addresses. MDR-017's precedent was too narrow a basis for leaving MDR-029 unsegmented. A formal clause map was created: **`src/lib/dhikr-research/audits/mdr-029-clause-map.ts`**, with clauses **`MDR-029-A`** (Part 1) and **`MDR-029-B`** (Part 2).

**Reconstruction result**: concatenating `MDR-029-A` (124 characters, including its trailing `" | "` separator preserved exactly as transcribed — the documented separator rule) and `MDR-029-B` (112 characters) reproduces `MDR-029.originalDocumentText` **exactly** (236 characters total; verified programmatically, no character omitted, duplicated, or reordered). `originalDocumentText` and `fullArabicText` remain untouched — no clause was silently replaced with canonical wording.

**Strongest source**: WebSearch synthesis only. Part 1: Anas ibn Malik, Jami' al-Tirmidhi. Part 2: Nu'aym ibn Hammar al-Ghatafani, Abu Dawud/Tirmidhi.

**Narrator/reference**: Part 1 — Anas ibn Malik, Tirmidhi. Part 2 — Nu'aym ibn Hammar al-Ghatafani (Hadith Qudsi), Abu Dawud/Tirmidhi/Ahmad. Two distinct narrators for two distinct narrations.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: Part 1's located wording repeats "تَامَّةٍ" three times for emphasis; MDR-029 has it once. Part 2's located wording uses "لا تعجزني من" (do not fail Me [in]); MDR-029 uses "ارْكَعْ لِي" (bow/pray for Me) — a different verb/construction. Both recorded precisely, in each clause's own `gradingNotes`. `wordingMatchStatus: unresolved`.

**Timing**: both parts concern morning-specific practices by their own content (Fajr-to-sunrise; "awwal al-nahar") — not inferred from register placement. `morningSpecificStatus: morning-only`.

**Repetition**: none populated in `repetitionCount` (four rak'ahs and two rak'ahs are prayer counts, not dhikr-repetition counts).

**Virtue/reward (narrow remediation pass, superseding the initial empty fields)**: `virtueOrRewardClaim` is now populated with two separately scoped claims. **Part 1**: reportedly, performing Fajr in congregation, remaining in dhikr until sunrise, then two rak'ahs, brings a reward described as *comparable to* ("ka-ajri") a complete Hajj and 'Umrah — not a guarantee, not a replacement, not an actual Hajj and 'Umrah, and not unconditional; the located wording's triple-repeated "تَامَّةٍ" vs. MDR-029's single occurrence is preserved as a distinct wording point. **Part 2**: reportedly, Allah says (Hadith Qudsi) that four rak'ahs at the beginning of the day are sufficient for Him to cover the servant for the rest of that day — the count, the timing, and the sufficiency outcome are preserved together, not simplified into "Allah guarantees everything for the day." The two claims are **not merged into one combined promise**. `virtueEvidence` explains both outcomes are already present in MDR-029's own protected text (not new insertions), that nothing was added to `originalDocumentText`/`fullArabicText`, and that Part 1's disputed grading and Part 2's separately-reported sahih grading do not extend to each other.

**Grading**: Part 1 disputed among scholars (Tirmidhi's own "hasan gharib"; some scholars weakened it; others, reportedly including Ibn Baz and al-Albani via corroborating routes, graded hasan) — clause-map `sourceResearchStatus: disputed`. Part 2 sahih, undisputed in this pass (al-Albani, al-Nawawi) — clause-map `sourceResearchStatus: in-progress` (no page directly fetched, but no disagreement located). Neither part's grading extends to the other; the clause map retains both gradings and their own unresolved issues separately.

**Final field values**: `contentClassification: composite-text` (the only use of this value in this batch); `morningSpecificStatus: morning-only`; `sourceResearchStatus: in-progress` (retained at the whole-record level — the record is not marked `disputed` merely because Part 1 is, since the clause map's part-specific statuses already capture that distinction); `wordingMatchStatus: unresolved`; `scholarlyDecision: pending`; `importStatus: research-only`.

**Unresolved issues**: exact wording for both parts; Part 1's grading dispute not adjudicated; exact hadith numbers not confirmed for either part.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch Jami' al-Tirmidhi (Part 1) and Sunan Abi Dawud (Part 2) separately; [ ] confirm the "تَامَّةٍ" single-vs-triple wording point (Part 1); [ ] confirm the "ارْكَعْ لِي" vs. "لا تعجزني من" wording point (Part 2).

---

## MDR-030

**Exact text**: "دَعَا رَسُول الله ﷺ سُلَيْمَان: اللَّهُمَّ إِنِّي أَسْأَلُكَ صِحَةً فِي إِيمَانٍ وَإِيمَانًا فِي حُسْنِ خُلُقٍ وَنَجَاحًا يَتْبَعُهُ فَلَاحٌ وَرَحْمَةً مِنْكَ وَعَافِيَةً وَمَغْفِرَةً مِنْكَ وَرِضْوَانًا" (203 characters; Stage 3A already flags the embedded narrator-attribution opening).

**Structure**: one continuous petitionary sentence following the embedded attribution. **Segmentation**: not segmented beyond the identification question below.

**Strongest source**: WebSearch synthesis only. A closely matching du'a reportedly taught by the Prophet ﷺ to "Salman al-Khayr," Abu Hurayrah, al-Hakim's Mustadrak / al-Tabarani's al-Mu'jam al-Awsat / Musnad Ahmad.

**Narrator/reference**: Abu Hurayrah (of the located hadith); Mustadrak al-Hakim / al-Mu'jam al-Awsat / Musnad Ahmad.

**Source quality**: WebSearch synthesis — not directly fetched.

**Wording comparison**: matches on substance; not checked character-for-character. `wordingMatchStatus: unresolved`.

**Timing**: none located. `morningSpecificStatus: uncertain`.

**Repetition**: none stated.

**Virtue/reward**: none found beyond the petition itself; left empty.

**Grading**: reportedly da'if (weak) per Shu'ayb al-Arna'ut.

**The central finding**: MDR-030's own embedded attribution reads "سُلَيْمَان" ("Sulaiman"), but the located hadith reports the Prophet ﷺ teaching this du'a to "Salman al-Khayr" ("سلمان الخير") — a **different name**. This is recorded as an open, unresolved discrepancy — not a transcription confusion assumed resolved in either direction, and not silently corrected.

**Final field values**: `contentClassification: general-prophetic-supplication`; `morningSpecificStatus: uncertain`; `sourceResearchStatus: in-progress`; `wordingMatchStatus: unresolved`.

**Unresolved issues**: the Sulaiman/Salman al-Khayr name discrepancy; the weak grading not independently assessed.

**Import blockers**: 4 (source research, wording, scholarly approval, research-only).

**Manual verification checklist**: [ ] directly fetch al-Hakim's Mustadrak or al-Tabarani's al-Mu'jam al-Awsat; [ ] resolve the Sulaiman/Salman al-Khayr discrepancy.
