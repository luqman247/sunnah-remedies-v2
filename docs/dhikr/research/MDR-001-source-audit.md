# MDR-001 — Source Audit (Stage 3B)

**Status**: Research partially complete — primary-text verification outstanding. Not scholarly-approved. Not import-ready. See [Import gate result](#import-gate-result) below.

## Exact source-document wording

```
آيَة ٱلْكُرْسِيّ | ٱلْإِخْلَاص 3x | ٱلْفَلَق 3x| ٱلنَّاس  3x
```

Displayed audit notation: `…النَّاس  3x␠` — here `␠` represents one literal trailing space present at the very end of the source document's `originalDocumentText`, immediately after the final `3x`. This marker is editorial notation added for this report only; it is not part of the recited Arabic text and is not present in the fenced code block above (which is trimmed for Markdown formatting). `originalDocumentText`/`fullArabicText` themselves are unchanged and still contain the literal trailing space.

(`originalDocumentText`/`fullArabicText`, unchanged from Stage 3A — see [docs/dhikr/32-morning-dhikr-source-register.md](../32-morning-dhikr-source-register.md).)

This is a **reference line**, not the recited Arabic text of any of the four items it names. It lists, in order: Ayat al-Kursi (no repetition marker), then al-Ikhlas, al-Falaq, and an-Nas, each individually annotated `3x` in the source document.

## Component breakdown

MDR-001 names four distinct Qur'anic references and implicitly two distinct prophetic instructions. **No single narration containing the full combined MDR-001 entry was located during this audit.** The evidence located supports the components separately, not the combined entry as one narration — see [Composite-entry finding](#composite-entry-finding) below for the precise scope of that statement.

| # | Component | Qur'anic identity | Repetition marker in source doc? |
|---|---|---|---|
| A | آية الكرسي (Ayat al-Kursi) | Qur'an, Surah al-Baqarah 2:255 | No |
| B1 | الإخلاص (al-Ikhlas) | Qur'an, Surah 112 | Yes — 3x |
| B2 | الفلق (al-Falaq) | Qur'an, Surah 113 | Yes — 3x |
| B3 | الناس (an-Nas) | Qur'an, Surah 114 | Yes — 3x |

B1–B3 are treated as one component ("the three Quls") throughout this audit because every hadith located for them treats all three together, with a single shared instruction and repetition count.

## Evidence-quality labels

Applied individually to every source cited for MDR-001. "Directly inspected" means this pass fetched and read the actual page's content; every non-Qur'anic hadith citation below still requires a human researcher to open the primary sunnah.com page directly, since this environment's `WebFetch` tool received HTTP 403 from sunnah.com on every attempt.

| Source | Evidence level | Detail |
|---|---|---|
| Abu Dawud 5082 | Indexed primary-source page located but inaccessible in this environment | `sunnah.com/abudawud:5082` located and its existence/indexing confirmed via web search; direct `WebFetch` returned HTTP 403. Metadata (wording paraphrase, narrator, grading) corroborated through an independent secondary source (islamqa.info, directly fetched and read). |
| Tirmidhi 3575 | Indexed primary-source page located but inaccessible in this environment | Same pattern as Abu Dawud 5082: `sunnah.com/tirmidhi:3575` located, direct fetch 403'd, metadata corroborated through islamqa.info (directly fetched and read). |
| Tirmidhi 2879 | Metadata corroborated through an independent secondary source | `sunnah.com/tirmidhi:2879` located, direct fetch 403'd. However, `islamqa.org/hanafi/hadithanswers/122483/...` was directly fetched and its full quoted English translation, narrator, source citation, and grading statement were read in full — a fuller inspection than a search snippet, though still not the primary sunnah.com page itself. |
| Ibn al-Sunni no. 77 | Classical-source location still unverified | Only known via a citation embedded in the islamqa.org page above ("*'Amal al-Yawm wal-Layla*, Hadith 77"). No independent location, edition, or page for this citation was found or inspected in this pass. |
| Bukhari 5010 | Indexed primary-source page located but inaccessible in this environment | `sunnah.com/bukhari:5010` located, direct fetch 403'd. A fairly complete English quotation was obtained via web search aggregation (multiple mirror/aggregator sites, not one single directly-fetched canonical page). |
| Qur'an 2:255 (Ayat al-Kursi) | Directly inspected Qur'anic text | `quran.com/2/255` directly fetched in this pass; opening Arabic text and verse identity confirmed from the live page. |
| Qur'an 112 (al-Ikhlas) | Directly inspected Qur'anic text | `quran.com/112` directly fetched in this pass; surah number, name, and opening-verse Arabic text confirmed from the live page. |
| Qur'an 113 (al-Falaq) | Directly inspected Qur'anic text | `quran.com/113` directly fetched in this pass; surah number, name, and opening-verse Arabic text confirmed from the live page. |
| Qur'an 114 (an-Nas) | Directly inspected Qur'anic text | `quran.com/114` directly fetched in this pass; surah number, name, and opening-verse Arabic text confirmed from the live page. |

Search-result snippets (as opposed to a directly-fetched and read page) are **not** treated as equivalent to direct inspection anywhere in this audit; every field and note above that relies on a snippet says so explicitly.

## Component verification table

| Component | Proposed source | Direct Arabic inspected? | Arabic wording captured? | Timing wording inspected? | Repetition wording inspected? | Grading inspected? | Remaining action |
|---|---|---|---|---|---|---|---|
| A. Ayat al-Kursi | Qur'an 2:255 (verse itself, directly inspected); its inclusion as morning dhikr rests on Tirmidhi 2879 (not directly inspected) | Yes (Qur'anic text only) | Opening words only, from quran.com | No — Tirmidhi 2879's exact Arabic timing wording not directly inspected | No — this component carries no repetition claim to inspect | No — Tirmidhi 2879's grading is reported via islamqa.org, not read on sunnah.com itself | Open `sunnah.com/tirmidhi:2879` directly; inspect full Arabic hadith text and displayed grading |
| B. al-Ikhlas | Qur'an 112 (verse, directly inspected); its 3x/morning-evening instruction rests on Abu Dawud 5082 / Tirmidhi 3575 (not directly inspected) | Yes (Qur'anic text only) | Opening words only, from quran.com | No — hadith's exact Arabic timing wording not directly inspected | No — hadith's exact Arabic repetition wording not directly inspected | No — grading reported via islamqa.info, not read on sunnah.com itself | Open `sunnah.com/abudawud:5082` and `sunnah.com/tirmidhi:3575` directly |
| C. al-Falaq | Qur'an 113 (verse, directly inspected); same hadith as component B | Yes (Qur'anic text only) | Opening words only, from quran.com | Same as B | Same as B | Same as B | Same as B |
| D. al-Nas | Qur'an 114 (verse, directly inspected); same hadith as component B | Yes (Qur'anic text only) | Opening words only, from quran.com | Same as B | Same as B | Same as B | Same as B |
| E. Narration combining Ayat al-Kursi with the opening of Surah Ghafir/al-Mu'min | Tirmidhi 2879 (primary, not directly inspected); Ibn al-Sunni no. 77 (parallel, location unverified) | No | No | No | N/A (no repetition claim) | No — see row A | Open `sunnah.com/tirmidhi:2879` directly; locate and inspect an edition or Usul.ai work-location for Ibn al-Sunni no. 77 |
| F. The combined MDR-001 arrangement itself | No single narration located combining all of A–D as one text | No | No — `sourceArabicWording` deliberately left empty | N/A | N/A | N/A | Obtain scholarly judgment on whether the combined arrangement should remain composite, be split, or drop a component (see checklist below) |

## Narrator

Two different narrators are reported, one per component: **Abdullah ibn Khubayb** (three-Quls component) and **Abu Hurairah** (Ayat al-Kursi + al-Mu'min component, and separately the Bukhari bedtime narration). Both names are as reported by secondary corroboration in this pass, not yet confirmed against a directly-inspected primary isnad. No single narrator supports the combined entry.

## Collection and reference

- Three Quls: Sunan Abi Dawud 5082; Jami' at-Tirmidhi 3575 (indexed pages located, not directly inspected).
- Ayat al-Kursi (morning-paired with al-Mu'min): Jami' at-Tirmidhi 2879 (indexed page located, not directly inspected; metadata read via a directly-fetched secondary page); Ibn al-Sunni, *'Amal al-Yawm wal-Layla* no. 77 (location unverified).
- Ayat al-Kursi (bedtime protection, related context): Sahih al-Bukhari 5010 (indexed page located, not directly inspected).

## Arabic source wording

`sourceArabicWording` is deliberately left **empty**. MDR-001 is a reference list, not recited text, and because it is composite, this field is not populated from memory or from an indirect English summary — it will remain empty until each component's Arabic source text has been directly inspected on its primary page. The Qur'anic opening-verse Arabic for all four referenced items (2:255, 112, 113, 114) was directly inspected and is recorded above, but that is verse-identity confirmation, not a captured "source Arabic wording" for this composite entry.

## Grading

No single grading value is recorded at the record level (`hadithGrading`/`gradingAuthority` left empty), because doing so would imply one grading covers the whole entry, which would be false, and because neither component's grading has been directly inspected on its primary page in this pass.

| Narration | Grading claimed (as reported) | Grading authority named | Directly inspected or indirectly reported? | Manual verification still required? |
|---|---|---|---|---|
| Abu Dawud 5082 / Tirmidhi 3575 (three Quls) | Hasan sahih gharib; isnad separately reported sahih | Imam at-Tirmidhi; Imam an-Nawawi (*al-Adhkar*, p. 107) | Indirectly reported — via search-indexed sunnah.com content and islamqa.info | Yes — provisional metadata, verify against the original collection page or edition |
| Tirmidhi 2879 (Ayat al-Kursi + al-Mu'min) | Da'if (weak) | Imam at-Tirmidhi (self-graded, as reported) | Indirectly reported — via a directly-fetched islamqa.org page quoting the grading, not sunnah.com's own page | Yes — provisional metadata, verify against the original collection page or edition |
| Ibn al-Sunni no. 77 (parallel to Tirmidhi 2879) | Weak chain | Not named beyond "a weak chain" | Indirectly reported — via the islamqa.org page's summary only | Yes — location itself is unverified, let alone the grading |
| Bukhari 5010 (bedtime, contextual) | Sahih (by virtue of inclusion in Sahih al-Bukhari) | Sahih al-Bukhari's own compiled status | Indirectly reported — via search-aggregated quotation, not a single directly-fetched primary page | Yes — provisional metadata, verify against the original collection page or edition |

## Timing

Per the required distinction (explicit morning / explicit morning-and-evening / general / inferred-only-from-later-compilations / unsupported), and kept narrowly scoped per component:

- **Three Quls**: reported as explicitly **morning and evening** — the hadith text is reported to state "in the evening and in the morning, three times" (Abu Dawud 5082 / Tirmidhi 3575). This is the most strongly and consistently reported timing claim in the whole entry, though the exact Arabic wording has not yet been directly inspected.
- **Ayat al-Kursi (paired with al-Mu'min, Tirmidhi 2879)**: reported to claim morning-recitation protects until evening (and vice versa) — the hadith making this claim is reported weak, and this weak report must remain clearly separate from the stronger, better-attested three-Quls timing claim above; it is not to be treated as equally reliable.
- **Ayat al-Kursi (Bukhari 5010)**: reported as a **bedtime** practice ("when you go to your bed"), with protection lasting "until the morning" — morning is the *endpoint* of overnight protection, not the *time of recitation*. This is reported sahih but is contextual evidence only; it does not establish a morning repetition or a morning-recitation practice, and a later compilation's placement of Ayat al-Kursi near morning adhkar is not treated here as primary timing evidence.
- **Overall record**: no single timing label can honestly cover all of MDR-001. `morningSpecificStatus` is kept `uncertain` rather than `morning-and-evening`, because doing so would extend the three-Quls component's more strongly reported timing to the Ayat al-Kursi component — which this audit explicitly avoids doing.

## Repetition

- **Three Quls**: a repetition count of 3 is reported stated in the same hadith that establishes the timing and virtue claim (Abu Dawud 5082 / Tirmidhi 3575: "three times"), matching the source document's own `3x` annotations on al-Ikhlas/al-Falaq/an-Nas exactly. `repetitionCount: 3` and `repetitionEvidence` are populated, scoped explicitly to this component only, and explicitly noted as not yet verified against a directly-inspected primary page.
- **Ayat al-Kursi**: the source document itself attaches **no** repetition marker to this item (checked directly against `originalDocumentText` — the three `3x` tokens in the text follow الإخلاص, الفلق, and الناس respectively; none follows آية الكرسي). No repetition-count claim exists to source or refute for this component, and the three-Quls repetition count must not be, and has not been, extended to it.

## Virtue / protection evidence

- **Three Quls**: reported "they will suffice you against all things" (*kafathu min kulli shay'*) — stated within the same hadith as the repetition and timing instruction, indirectly reported (not yet directly inspected on the primary page).
- **Ayat al-Kursi + al-Mu'min pairing**: reported that recitation in the morning brings protection until evening (and vice versa) — stated within a hadith reported graded weak, and this weaker claim is kept clearly distinguished from the more strongly reported three-Quls claim above, not presented as equivalent in strength.

## Wording comparison

MDR-001 does not contain recited dua/dhikr text to compare word-for-word against a primary source — it is a reference line naming four items. `wordingMatchStatus` is set to **`composite-of-multiple-sources`**: the entry legitimately combines material from more than one independently-sourced component, and forcing it into `exact-match` or any single-source category would misrepresent it. `originalDocumentText` was not altered.

## Unresolved issues

1. Whether MDR-001 should remain one combined register entry or be split into two (Ayat al-Kursi vs. the three Quls) once scholarly review occurs — not decided in this stage.
2. Whether a stronger primary source exists for pairing Ayat al-Kursi with morning dhikr, beyond the weak Tirmidhi 2879 / Ibn al-Sunni no. 77 pairing located in this pass — not ruled out, only not found.
3. Every non-Qur'anic hadith citation in this audit (Abu Dawud 5082, Tirmidhi 3575, Tirmidhi 2879, Ibn al-Sunni no. 77, Bukhari 5010) still requires direct inspection of its primary page — see the checklist below.
4. The Ibn al-Sunni no. 77 citation's location itself is unverified, not merely its content.
5. Whether "3x" for al-Ikhlas/al-Falaq/an-Nas means each surah is recited three times individually, or the set of three is recited as a group three times through — the reported hadith wording most naturally reads as the latter, but this is an interpretive reading pending direct inspection and scholarly confirmation, not a settled fact.
6. Usul.ai's interactive search/chat tooling was not used in this pass beyond a basic keyword search — a researcher with more targeted use of the platform may surface material this pass did not.

## Provisional classification

`contentClassification: "composite-text"` — reflects that this entry combines Qur'anic references with hadith-sourced practice instructions of differing, and not-yet-directly-verified, grading strength, and is not itself a single dua or hadith text.

## Composite-entry finding

No single narration containing the full combined MDR-001 entry (Ayat al-Kursi + three Quls, as printed together in the source document) was located during this audit. This is a statement about what was found, not a claim of exhaustive non-existence — a broader or more targeted search than this pass performed might locate a compilation source that groups them under one citation (e.g. within Hisn al-Muslim's own editorial apparatus, which was not itself directly inspected in this pass). What this audit does establish: two components were identified and sourced independently, with differently-reported grading strength (three Quls: reported hasan sahih gharib / sahih isnad; Ayat al-Kursi's morning pairing: reported da'if) — and no field in this record asserts a single citation covers the whole entry.

## Manual primary-source verification required

- [ ] Open Abu Dawud 5082 directly and verify Arabic, narrator, morning/evening wording, repetition, and grading metadata.
- [ ] Open Tirmidhi 3575 directly and verify Arabic, narrator, wording, and displayed grading.
- [ ] Open Tirmidhi 2879 directly and verify Arabic, timing wording, and displayed grading.
- [ ] Verify the Ibn al-Sunni citation against an accessible edition or Usul.ai work location.
- [ ] Open Bukhari 5010 directly and confirm it is contextual bedtime evidence only.
- [ ] Verify Qur'anic text against Quran.com or a recognised Mushaf source. *(Partially complete: opening verses of 2:255, 112, 113, and 114 were directly inspected on quran.com in this pass; full verse text and any variant-reading notes remain unverified.)*
- [ ] Obtain scholarly judgment on whether MDR-001 should remain composite, be split for publication, or retain only selected components.
- [ ] Verify that no repetition count has been transferred between components.

## Recommendation for scholarly review

1. Confirm or correct the grading assessment of Tirmidhi 2879 and the Ibn al-Sunni parallel — is there a stronger primary source for pairing Ayat al-Kursi with morning dhikr that this pass did not locate?
2. Decide whether MDR-001 should remain a single composite register entry (as filed) or be split at the point content is mapped into `dhikrItem`, given the two components' differently-reported grading strength.
3. If retained as composite, decide what (if any) grading/virtue claim may be publicly stated for the Ayat al-Kursi component given its weakly-reported sourcing — options include omitting the claim, presenting it explicitly as weak, or retaining only the Bukhari 5010 bedtime framing instead of a morning framing.
4. Complete the manual primary-source verification checklist above before treating any grading in this document as final.

## Import gate result

`computeImportGate(MDR-001)` returns `canImport: false`, blocked by five independent conditions: `sourceResearchStatus` is `"scholarly-review-required"`, not `"verified"`; `wordingMatchStatus` (`"composite-of-multiple-sources"`) is not an accepted resolved state; `hadithGrading` is empty while `contentClassification: "composite-text"` requires grading; `scholarlyDecision` remains `"pending"`; `importStatus` remains `"research-only"`. This record cannot become import-ready until the manual verification checklist above is completed and a scholarly reviewer resolves the open questions.
