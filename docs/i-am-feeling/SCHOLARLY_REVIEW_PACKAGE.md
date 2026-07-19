# Scholarly & Editorial Review Package — "I am feeling…"

The single practical document a qualified Islamic reviewer, an editorial reviewer, and (where marked) a clinical/safeguarding reviewer can use to review this feature's content without needing Sanity Studio access first. Every field below is either drawn directly from the live `duaDhikrEntry` dataset (read-only, unmodified) or from the draft copy in `scripts/i-am-feeling-content-seed-data.ts` (not yet written to Sanity — see `docs/i-am-feeling/EDITORIAL_POPULATION_RECORD.md`).

**Nothing in this document is an approval.** Every "Reviewer decision" field below is intentionally blank. Where a "Recommended decision" is shown, it is this session's own honest assessment of the pairing — a suggestion for the reviewer to test, not a substitute for their judgement.

## How to use this document

1. Read the definitive taxonomy table below to see the full shape of the architecture.
2. Work through the per-state sections in whatever order you prefer — §"Fastest path" at the end suggests a low-friction starting order.
3. For each state, fill in **Reviewer decision**, **Reviewer comments**, and **Review date**. Leave states you haven't reached blank — a blank field means "not yet reviewed," never "approved by omission."
4. Once a state has scholarly + editorial (+ clinical, where required) sign-off recorded here, an editor transcribes it into the `feelingState` document in Studio and sets `reviewStatus: "published"` — see `SCHOLARLY_REVIEW_PACKAGE.md`'s companion, `docs/i-am-feeling/REVIEW_DECISION_REGISTER.md`, for the master tracking sheet across all reviewers.

## Definitive taxonomy table

The single authoritative count. If any other document in this repository states a different number, that document is stale — this table wins (cross-checked against `src/lib/feeling/taxonomy.ts` and `tests/feeling/feeling-taxonomy-and-aliases.test.ts`, both of which assert these exact counts).

| Category | Count | States |
|---|---|---|
| **Total architected feeling states** | **20** | Every state in `src/lib/feeling/taxonomy.ts`, regardless of status |
| **Launch candidates** (`launchStatus: "launch"`) | **17** | Rows 1–17 in the table below |
| **Deferred states** (`launchStatus: "deferred"`) | **3** | Feeling Let Down, Impatient, Troubled by Doubts |
| — of which architected-but-content-not-attempted | 2 | Feeling Let Down, Impatient (SPEC §4's own deferral reasoning — not a content gap to close, a deliberate v2 scope decision) |
| — of which architected-and-content-drafted, but requiring a dedicated process before it can ever launch | 1 | Troubled by Doubts (SPEC §4: needs its own scholarly working group, not ordinary per-state review) |
| **Launch candidates with a real entry pairing + drafted copy** | **13** | See table — ready for ordinary scholarly/editorial review |
| **Launch candidates currently blocked by missing content** | **2** | Feeling Alone, Struggling with Envy — see `docs/i-am-feeling/CONTENT_GAP_REGISTER.md` |
| **Families** | **6** | Heart Feels Heavy, Mind Won't Settle, Emotions Feel Intense, Faith Feels Distant, Heart Feels Open, Facing Change or Difficulty |

**13 + 2 = 15** launch candidates have *some* documented status this session (10 clean, 2 flagged imperfect fit, 2 blocked, 1 with a genuine duplicate-content note — see row 4 below); all 17 launch candidates are accounted for; nothing is silently missing.

## A note that applies to every entry below, once, rather than 23 times

Every `duaDhikrEntry` referenced in this document currently has `editorialPublicationStatus: "owner-approved-english-first"` and `sourceReferences[].verifiedStatus: "unverified"`, `hadithGrading: null` — confirmed by a read-only query against the live dataset this session. This is **not specific to any one entry** — it is the current state of all 425 entries in the Duʿā & Dhikr library, and it is **not something this feature's review process can or should fix**: that authenticity/grading work belongs to the existing Duʿā & Dhikr library's own review pipeline (`docs/dua-dhikr/SOURCE_POLICY.md`, `docs/dua-dhikr/REVIEW_BYPASS.md`), tracked separately from this feature. What *this* review package is asking a scholarly reviewer to judge is narrower and answerable today: **is this specific entry a doctrinally sound thing to offer someone feeling this specific way** — not "has this hadith been independently graded" (that is tracked elsewhere, and this feature's own publication gate does not require it to already be resolved — see SPEC §7.6).

Where an entry's structured `sourceReferences.citation` field literally reads "See citation within the Virtue text above" or "No source reference displayed," that is not this document under-reporting the source — it is what the live Sanity document actually contains. The real citation, where it exists, is written in prose inside that document's own `virtueText` field, visible only in Studio. This is flagged per-entry below as a **source concern** so it isn't mistaken for a clean citation.

---

## Launch candidates ready for review

### 1. Grieving a Loss — `grieving-a-loss`
- **English label:** Grieving a Loss · **Danish label:** Sorg over et tab
- **Family:** When the Heart Feels Heavy · **Launch status:** Launch · **Safeguarding level:** Heightened
- **Danish eligibility:** Not yet — blocked upstream (see "Danish eligibility" note below)
- **Introduction (draft):** "Grief can feel like it rearranges everything, even the things that used to feel steady. Islam does not ask you to rush through it — it gives you words for the moment loss first lands, and for the days after."
- **Practical next step (draft):** "Say this the next time grief catches you off guard this week, rather than waiting until you feel ready."
- **Professional-support note (draft, required — heightened):** "Grief that stays heavy for a long time, or that starts to affect your sleep, eating, or ability to function, is worth speaking to a doctor or a grief counsellor about — alongside, not instead of, this remembrance."

**Featured entry 1 — `duaDhikrEntry-lwa-336`, "After Someone's Death #1"**
- Arabic opening: اللَّهُمَّ اغْفِرْ لَهُ ، وَارْفَعْ دَرَ...
- English meaning: "O Allah, forgive him and raise his station among those who are guided. Take care of his future generations in his place…"
- Source: Muslim #920 (as cited in the entry's own Virtue text)
- Authenticity status: Not yet independently graded (see the note above — applies here)
- Reason for pairing: Direct, literal match — this is the taught duʿā for the moment after a death.
- Thematic concern: None. **Source concern:** citation is a bare "Muslim 920" reference; confirm the fuller narrator chain is recorded in the Virtue text. **Wording concern:** None.
- Reflection (draft): "This is what was taught for the moment after someone has gone — a short, steadying return to what is true: that we belong to Allah, and to Him we return."

**Featured entry 2 — `duaDhikrEntry-lwa-337`, "After Someone's Death #2"**
- Arabic opening: اَللّٰهُمَّ اغْفِرْ لِيْ وَلَهُ وَأَعْقِ...
- English meaning: "O Allah, forgive me and him, and give me good after him…"
- Source: Muslim #919. Authenticity status: as above.
- Reason for pairing: Direct match, companion duʿā to entry 1.
- Concerns: none beyond the sitewide note above.
- Reflection (draft): "A second remembrance for the days that follow, when grief doesn't leave all at once."

**Required reviewer role(s):** Scholarly, Editorial, Clinical (heightened) · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 2. Weighed Down by Guilt or Regret — `weighed-down-by-guilt`
- **English label:** Weighed Down by Guilt or Regret · **Danish label:** Tynget af skyld eller fortrydelse
- **Family:** When the Heart Feels Heavy · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Guilt can sit heavily long after the moment itself has passed. Istighfar — turning back to Allah in honesty — is not about proving you deserve forgiveness. It's simply what's offered."
- **Practical next step (draft):** "Say this once, slowly, before you sleep tonight — not as a task to finish, but as a door to walk through."

**Featured entry 1 — `duaDhikrEntry-lwa-177`, "Sayyid al-Istighfar: The Best Way of Seeking Forgiveness"**
- Arabic opening: (سيد الاستغفار) اَللّٰهُمَّ أَنْتَ رَبِّ...
- English meaning: "(Sayyid al-Istighfār) O Allah, You are my Lord. There is no god worthy of worship except You. You have created me, and I am…"
- Source: Bukhārī #6306. Authenticity status: as sitewide note.
- Reason for pairing: This is the canonically named "master of ways to seek forgiveness" — as direct a match as exists in the library for this feeling.
- Concerns: none beyond the sitewide note.
- Reflection (draft): "Known as the master of ways to seek forgiveness — a complete, honest acknowledgement, said as it is, not to earn relief but to receive it."

**Featured entry 2 — `duaDhikrEntry-lwa-179`, "Comprehensive Forgiveness"**
- Arabic opening: اَللّٰهُمَّ اغْفِرْ لِيْ خَطِيْئَتِيْ وَ...
- English meaning: "O Allah, forgive my mistakes, ignorance, transgression in my matters, and what You are more Knowledgeable of than me…"
- Source: Muslim #2719. Reason for pairing: broadens entry 1 to unknown/unrecognised faults, which regret often carries alongside known ones.
- Reflection (draft): "A broader form of the same turning back, gathering forgiveness for what's known and unknown."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 3. Anxious or Worried — `feeling-anxious`
- **English label:** Anxious or Worried · **Danish label:** Ængstelig eller bekymret
- **Family:** When the Mind Will Not Settle · **Launch status:** Launch · **Safeguarding level:** Heightened
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Worry can sit in the chest long before it finds words. This is not about talking yourself out of it — it's somewhere to put it."
- **Practical next step (draft):** "Keep this close and say it the next time your thoughts start circling, rather than waiting for a quiet moment."
- **Professional-support note (draft, required):** "If anxiety is affecting your sleep, your ability to eat, or your daily life for more than a couple of weeks, speaking to a doctor is a sensible next step alongside this — not instead of it."

**⚠ Content concern before reviewing further:** the two featured entries below are, on inspection, **the same duʿā stored as two separate Sanity documents** — identical Arabic text and identical English translation (both cite Aḥmad #3712, the well-known duʿā of "O Allah, I am Your slave and the son of Your male slave…"). This is a data-duplication issue in the underlying Duʿā & Dhikr library, not something introduced by this feature, but it means this state currently only has **one distinct duʿā**, not two, despite showing two cards. Flagging for the editor to either genuinely source a second, different duʿā for anxiety, or accept a single-entry state and remove the duplicate reference.

**Featured entry 1 — `duaDhikrEntry-lwa-215`, "The Qur'an: the Banisher of Grief & Anxiety"**
- Arabic opening: اَللّٰهُمَّ إِنِّيْ عَبْدُكَ ، وَابْنُ ع...
- English meaning: "O Allah, I am Your slave and the son of Your male slave and the son of Your female slave. My forehead is in Your Hand…"
- Source: Aḥmad (Musnad) #3712. Reason for pairing: this is the specific, well-known hadith duʿā taught by the Prophet ﷺ explicitly for grief and anxiety.
- Reflection (draft): "A description of the Qurʾān itself as something that lifts grief and anxiety when it's read and held onto." *(Note: this reflection text describes the Qurʾān's role, which reads slightly mismatched to this specific entry's own content — a wording concern worth a second look.)*

**Featured entry 2 — `duaDhikrEntry-lwa-378`, "Grief & Anxiety #1"**
- Identical Arabic/English/source to entry 1 — see the duplication concern above.
- Reflection (draft): "A short, direct remembrance for exactly this — carried by many, for a very long time."

**Required reviewer role(s):** Scholarly, Editorial, Clinical (heightened) · **Recommended decision:** Additional source verification required (resolve the duplicate-entry issue first)
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 4. Overwhelmed — `feeling-overwhelmed`
- **English label:** Overwhelmed · **Danish label:** Overvældet
- **Family:** When the Mind Will Not Settle · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "There's a particular kind of tired that comes from too much at once. This was said by people who felt exactly that."
- **Practical next step (draft):** "Say this once, then do the smallest next thing on your list — not all of it."

**Featured entry 1 — `duaDhikrEntry-lwa-389`, "When Overwhelmed With Difficulties"**
- Arabic opening: حَسْبِيَ اللّٰهُ وَنِعْمَ الْوَكِيْلُ
- English meaning: "Allah is enough for me and He is the Best Protector."
- Source: Bukhārī #4564. Reason for pairing: title-exact match, the Qurʾānic phrase famously associated with being overwhelmed by circumstances (used by Ibrāhīm ﷺ).
- Concerns: none. This entry is also used for "Feeling Weary" below (row 6) — a deliberate, permitted reuse (SPEC §7.4), not a duplication error like row 3's.
- Reflection (draft): "A direct remembrance for when difficulty stacks up faster than you can process it."

**Featured entry 2 — `duaDhikrEntry-lwa-376`, "When One is in a Difficult Situation"**
- Arabic opening: اَللّٰهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْ...
- English meaning: "O Allah, there is no ease except in that which You have made easy, and You make the difficulty easy when You wish."
- Source: citation reads "See citation within the Virtue text above" — **source concern**, check Studio directly for the underlying hadith reference.
- Reflection (draft): "For the specific feeling of being caught in a hard situation with no clear way through yet."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 5. Restless at Night — `restless-at-night`
- **English label:** Restless at Night · **Danish label:** Urolig om natten
- **Family:** When the Mind Will Not Settle · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Some nights the mind won't settle, or sleep brings something unsettling with it. There is a specific remembrance for exactly that."
- **Practical next step (draft):** "Keep this by your bed and say it if a bad dream wakes you, rather than lying with it in silence."

**Featured entry 1 — `duaDhikrEntry-lwa-276`, "After a Nightmare"**
- Arabic opening: أَعُوْذُ بِكَلِمَاتِ اللّٰهِ التَّامَّات...
- English meaning: "I seek protection in the perfect words of Allah from His anger and punishment, and from the evil of His servants, and from…"
- Source: Tirmidhī #3528; Bukhārī #6986. Reason for pairing: this is precisely, canonically the taught remembrance for a nightmare.
- Concerns: only one entry for this state — confirm sufficiency, or consider sourcing a second (e.g. a general before-sleep duʿā) if editorial wants more depth.
- Reflection (draft): "What was taught to say after a nightmare — a short way of putting it down rather than carrying it into the morning."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 6. Feeling Weary — `feeling-weary`
- **English label:** Feeling Weary · **Danish label:** At føle sig udmattet
- **Family:** When the Mind Will Not Settle · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Some tiredness isn't solved by sleep. This is for that kind."
- **Practical next step (draft):** "Say this before you rest today, even if rest itself doesn't feel like enough right now."

**Featured entry 1 — `duaDhikrEntry-lwa-389`, "When Overwhelmed With Difficulties"** *(same entry as row 4, deliberate reuse — SPEC §7.4)*
- See row 4 for full source detail.
- Reason for pairing: the same "Allah is enough for me" duʿā applies to depletion as much as to acute overwhelm — confirm this stretch is acceptable, or this state may need its own entry.
- Reflection (draft, distinct from row 4's): "The same remembrance that answers being overwhelmed also answers this — difficulty and depletion often arrive together."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved with wording revision (confirm the reused entry genuinely serves this distinct feeling, or source a dedicated one)
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 7. Angry or Frustrated — `feeling-angry`
- **English label:** Angry or Frustrated · **Danish label:** Vred eller frustreret
- **Family:** When Emotions Feel Intense · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Anger is not something to be ashamed of — it's what you do with it that this remembrance gently interrupts."
- **Practical next step (draft):** "Say this the next time anger rises, before you speak or act, not instead of feeling it."

**Featured entry 1 — `duaDhikrEntry-lwa-181`, "Forgiveness, Anger and Trials"**
- Arabic opening: اَللّٰهُمَّ رَبَّ مُحَمَّدٍ اغْفِرْ لِيْ...
- English meaning: "O Allah, Lord of Muḥammad forgive my sins, remove the anger of my heart and protect me from misleading trials."
- Source: citation reads "See citation within the Virtue text above" — **source concern**, check Studio.
- Reason for pairing: explicitly names "the anger of my heart" — a strong, direct match.
- Concerns: only one entry for this state.
- Reflection (draft): "A remembrance that names forgiveness, anger, and hardship together — not as unrelated things, but as often arriving in the same breath."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 8. Distant from Allah — `feeling-distant-from-allah`
- **English label:** Distant from Allah · **Danish label:** Fjern fra Allah
- **Family:** When Faith Feels Distant · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Worship can start to feel like a routine rather than a connection. That's not a sign you've failed — it's a sign to ask for the thing itself back."
- **Practical next step (draft):** "Say this once today, without expecting an immediate feeling — steadiness often returns quietly, not all at once."

**Featured entry 1 — `duaDhikrEntry-lwa-368`, "For Firmness of the Heart"**
- Arabic opening: يَا مُقَلِّبَ الْقُلُوْبِ ثَبِّتْ قَلْبِ...
- English meaning: "O Changer of the hearts, make my heart firm upon Your religion."
- Source: Tirmidhī #3522. Reason for pairing: this is one of the Prophet's ﷺ own most frequently repeated duʿās, addressing heart-steadiness directly — a very strong match.
- Concerns: only one entry.
- Reflection (draft): "A remembrance asking directly for a firm heart — steadiness in faith is something to ask for, not something you're expected to already have secured."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 9. Struggling with Sincerity — `struggling-with-sincerity`
- **English label:** Struggling with Sincerity · **Danish label:** Kæmper med oprigtighed
- **Family:** When Faith Feels Distant · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Wondering whether your heart is really in what you're doing is, itself, often a sign of sincerity rather than its absence."
- **Practical next step (draft):** "Say this before your next prayer, as a quiet check-in rather than a test to pass."
- **Priority tone check for the scholarly/editorial reviewer:** this is the state SPEC §7.2 names as most at risk of reading as an accusation — read the introduction aloud as if said to a friend before approving.

**Featured entry 1 — `duaDhikrEntry-lwa-371`, "When One Fears Shirk & Riya'"**
- Arabic opening: اَللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ أَنْ أ...
- English meaning: "O Allah, I seek Your protection from knowingly committing shirk and seek Your forgiveness for unknowingly (committing it)…"
- Source: Aḥmad (Musnad) #3731. Reason for pairing: riyāʾ (showing off in worship) is the classical term most directly adjacent to "sincerity" as a struggle — strong conceptual match.
- Concerns: confirm the public label "Struggling with Sincerity" and this duʿā's shirk/riyāʾ framing don't together read as more doctrinally weighty than the compassionate intent — a scholar's read is valuable here specifically.
- Reflection (draft): "A remembrance that asks directly for protection from showing off and from associating anything with Allah in worship — a request, not an accusation."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved with wording revision (tone-check the introduction specifically)
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 10. Grateful — `feeling-grateful`
- **English label:** Grateful · **Danish label:** Taknemmelig
- **Family:** When the Heart Feels Open · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Naming a blessing properly is its own small act of worship."
- **Practical next step (draft):** "Say this today for the specific thing you're grateful for, naming it rather than leaving it general."

**Featured entry 1 — `duaDhikrEntry-lwa-164`, "Duʿa of Prophet Sulayman for Gratitude to Allah & Doing Good Deeds"**
- Arabic opening: رَبِّ أَوْزِعْنِيْٓ أَنْ أَشْكُرَ نِعْمَ...
- English meaning: "My Lord, enable me to be grateful for Your favour which You have bestowed upon me and upon my parents, and to do good deeds…"
- Source: Qurʾānic (citation shows "No source reference displayed" — **source concern**, confirm the surah/āyah reference is recorded properly in Studio; this is a Qurʾānic duʿā and should have a clean `surah`/`ayah` field, not a blank one).
- Reason for pairing: direct, named gratitude duʿā of a prophet — strong match.
- Reflection (draft): "A prophet's own words of gratitude, paired with a request to keep doing good — thanks that moves outward, not just inward."

**Featured entry 2 — `duaDhikrEntry-lwa-165`, "Duʿa for Gratitude, Good Deeds & Pious Children"**
- Same opening Arabic as entry 1, continuing further — confirm this is genuinely a distinct (longer) version rather than a near-duplicate of entry 1 (similar concern to row 3, but less severe — the English differs by extending to "pious children").
- Source: "No source reference displayed" — same concern as above.
- Reflection (draft): "A fuller request for gratitude alongside good deeds and a good household."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Additional source verification required (confirm entries 1 and 2 are genuinely distinct, and that the Qurʾānic surah/āyah reference is properly recorded)
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 11. At Peace — `feeling-at-peace`
- **English label:** At Peace · **Danish label:** I fred
- **Family:** When the Heart Feels Open · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "When things feel settled, this is worth marking too — not just carried through hard moments."
- **Practical next step (draft):** "Say this once today simply because things feel settled, not only when you need it to."

**Featured entry 1 — `duaDhikrEntry-lwa-245`, "Contentment & Allah's Protection"**
- Arabic opening: اَللّٰهُمَّ قَنِّعْنِيْ بِمَا رَزَقْتَنِ...
- English meaning: "O Allah, make me content with what You have granted me, bless me in it and be a protector for me in that which is absent…"
- Source: "See citation within the Virtue text above" — **source concern**.
- Reflection (draft): "A short remembrance of contentment held together with Allah's protection."

**Featured entry 2 — `duaDhikrEntry-lwa-156`, "Duʿa of Prophet Musa for Inner Peace & Strength"**
- Arabic opening: رَبِّ اشْرَحْ لِيْ صَدْرِيْ ، وَيَسِّرْ ...
- English meaning: "My Lord, put my heart at peace for me, and make my task easy for me." (Qurʾān 20:25–26)
- Source: "No source reference displayed" despite this being an identifiable Qurʾānic verse with a citation already present in the English meaning text (20:25–26) — **source concern**: the structured field should carry this, not just the free-text translation.
- Reflection (draft): "A prophet's own request for inner peace and strength — asked for even in ease, so it has somewhere to return to later."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved with wording revision (fix the missing structured Qurʾān citation on entry 2)
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 12. Hopeful — `feeling-hopeful`
- **English label:** Hopeful · **Danish label:** Håbefuld
- **Family:** When the Heart Feels Open · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Looking forward to something is worth placing in Allah's hands from the start, not just when it's uncertain."
- **Practical next step (draft):** "Say this before the thing you're looking forward to, as a way of holding it with open hands."
- **⚠ Flagged imperfect fit (carried over from the implementation session):** the only featured entry is tawakkul-themed (trust/reliance), not hope-specific. Read this row skeptically.

**Featured entry 1 — `duaDhikrEntry-lwa-198`, "Entrust All Your Matters to Allah"**
- Arabic opening: يَا حَيُّ يَا قَيُّوْمُ ، بِرَحْمَتِكَ أ...
- English meaning: "O The Ever Living, The Sustainer of all. I seek assistance through Your mercy. Rectify all of my affairs and do not en…"
- Source: An-Nasā'ī, ʿAmal al-Yawm wa-l-Laylah #570.
- Reason for pairing: closest available thematic neighbour (forward-looking trust in Allah), not a direct "hope" duʿā — genuinely a stretch.
- Reflection (draft): "A short handing-over of your affairs to Allah — hope held loosely rather than gripped tightly."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Additional source verification required (confirm fit is acceptable, or source a more direct hope/anticipation duʿā)
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 13. Facing a Difficult Decision — `facing-a-decision`
- **English label:** Facing a Difficult Decision · **Danish label:** Står over for en svær beslutning
- **Family:** When Facing Change or Difficulty · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Not knowing which way to go is exactly what this prayer was taught for."
- **Practical next step (draft):** "Pray Istikharah before you decide, and give yourself permission not to have an instant answer afterward."

**Featured entry 1 — `duaDhikrEntry-lwa-298`, "Istikharah (Seeking Allah's Help in Making a Decision)"**
- Arabic opening: اَللّٰهُمَّ إِنِّيْ أَسْتَخِيْرُكَ بِعِل...
- English meaning: "O Allah, I ask you for the best through Your knowledge, I seek strength through Your power, and I ask You from Your majesty…"
- Source: Bukhārī #6382. Reason for pairing: exact, canonical — this is *the* Istikharah duʿā, and "Facing a Difficult Decision" is exactly what it's for. The single strongest pairing in this entire taxonomy.
- Concerns: none.
- Reflection (draft): "Istikharah — asking Allah directly for what is good, when you genuinely don't know which path that is."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 14. Facing Illness — `facing-illness`
- **English label:** Facing Illness · **Danish label:** Står over for sygdom
- **Family:** When Facing Change or Difficulty · **Launch status:** Launch · **Safeguarding level:** Heightened
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "Sickness — your own or someone you love's — can be frightening to sit with. This is a companion for that, never a replacement for medical care."
- **Practical next step (draft):** "Say this today, and keep your medical appointments exactly as planned — both matter."
- **Professional-support note (draft, required):** "Ruqyah and duʿā are a companion to medical treatment, never a substitute for it. Please continue to see a doctor for diagnosis and treatment."

**Featured entry 1 — `duaDhikrEntry-lwa-092`, "What The Sick Should Say & What Should Be Said For Them"**
- Arabic opening: اَللّٰهُمَّ رَبَّ النَّاسِ ، أَذْهِبِ ال...
- English meaning: "O Allah, the Lord of mankind, remove this disease. Cure, for You are the One who cures. There is no cure except for Your…"
- Source: Bukhārī #5743. Reason for pairing: direct, canonical illness duʿā.
- Reflection (draft): "What was taught to say, and to say for someone who is sick — words for both sides of the bed."

**Featured entry 2 — `duaDhikrEntry-lwa-232`, "Protection from Physical & Spiritual Illnesses"**
- Arabic opening: اَللّٰهُمَّ إنِّيْ أَعُوْذُ بِكَ مِنَ ال...
- English meaning: "O Allah, I seek Your protection from inability, laziness, cowardice, miserliness, senility, hard heartedness, heedlessness…"
- Source: "See citation within the Virtue text above" — **source concern**.
- Reason for pairing: broadens illness to spiritual weakness alongside physical — confirm this breadth is wanted for this specific feeling state, or whether it's better suited elsewhere.
- Reflection (draft): "A broader request for protection from illness, physical and spiritual both."

**Required reviewer role(s):** Scholarly, Editorial, Clinical (heightened) · **Recommended decision:** Approved
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

### 15. Afraid of What Lies Ahead — `afraid-of-what-lies-ahead`
- **English label:** Afraid of What Lies Ahead · **Danish label:** Bange for det, der venter
- **Family:** When Facing Change or Difficulty · **Launch status:** Launch · **Safeguarding level:** Standard
- **Danish eligibility:** Not yet (upstream)
- **Introduction (draft):** "The future can feel uncertain in a way that's hard to sit with. This is for handing that uncertainty somewhere."
- **Practical next step (draft):** "Say this the next time your mind runs ahead to what might happen, and gently bring it back to today."
- **⚠ Flagged imperfect fit**, same entry and same caveat as row 12 (Hopeful).

**Featured entry 1 — `duaDhikrEntry-lwa-198`, "Entrust All Your Matters to Allah"** *(same entry as row 12)*
- See row 12 for full source detail.
- Reflection (draft, distinct from row 12's): "The same handing-over of your affairs to Allah that answers hope also answers fear of what's ahead — the two are closer than they seem."

**Required reviewer role(s):** Scholarly, Editorial · **Recommended decision:** Additional source verification required (same reasoning as row 12)
**Reviewer decision:** ☐ Approved ☐ Approved with wording revision ☐ Replace religious-content pairing ☐ Additional source verification required ☐ Clinical or safeguarding review required ☐ Keep unpublished ☐ Deferred
**Reviewer comments:** _______________________________________________ **Review date:** ____________

---

## Launch candidates blocked by missing content (16–17 of 17)

### 16. Feeling Alone — `feeling-alone`
No featured entry exists. **See `docs/i-am-feeling/CONTENT_GAP_REGISTER.md` for the full search record.** Family: When the Heart Feels Heavy. Safeguarding level: Heightened.
**Recommended decision:** Keep unpublished. **Reviewer decision:** ☐ Keep unpublished ☐ Deferred (other options not applicable until content exists) **Comments:** _______________ **Date:** _______

### 17. Struggling with Envy — `struggling-with-envy`
No featured entry exists; one direction-mismatched candidate was found and deliberately not used. **See `docs/i-am-feeling/CONTENT_GAP_REGISTER.md`.** Family: When Emotions Feel Intense. Safeguarding level: Standard.
**Recommended decision:** Keep unpublished. **Reviewer decision:** ☐ Keep unpublished ☐ Deferred ☐ Replace religious-content pairing (if a scholar identifies a better-fitting existing entry) **Comments:** _______________ **Date:** _______

---

## Deferred states (not launch candidates — reviewed differently or not yet)

### 18. Troubled by Doubts — `troubled-by-doubts`
- **English label:** Troubled by Doubts · **Danish label:** Plaget af tvivl · **Family:** When Faith Feels Distant · **Launch status:** Deferred (architected, not excluded) · **Safeguarding level:** Heightened
- **Do not review via the standard workflow above.** SPEC §4 requires a *dedicated scholarly working group* — beyond ordinary per-state review — before `launchStatus` may move from `deferred` to `launch`. Content is fully drafted (introduction, practical step, professional-support note, two featured entries: `duaDhikrEntry-lwa-369` "When One Experiences Doubt in Faith #1", `duaDhikrEntry-lwa-370` "#2") and ready for that group's review, not for an individual sign-off.
**Recommended decision:** Deferred (unconditionally, pending the working group). **Reviewer decision:** ☐ Deferred (only valid option here) **Comments:** _______________ **Date:** _______

### 19. Feeling Let Down — `feeling-disappointed`
Deferred per SPEC §4's own reasoning (insufficient differentiation from Grieving a Loss at launch) — not a content gap, a scope decision. No content drafted. Not in scope for this review round.

### 20. Impatient — `feeling-impatient`
Deferred per SPEC §4's own reasoning (marginal distinctiveness from Overwhelmed/Anxious) — not a content gap, a scope decision. No content drafted. Not in scope for this review round.

---

## Decision options (reference)

- **Approved** — pairing and copy are sound as drafted; ready to publish once formal board approvals are recorded in Studio.
- **Approved with wording revision** — pairing is sound, but specific text needs a change before publish (state what, in comments).
- **Replace religious-content pairing** — the featured entry itself should be swapped for a different one.
- **Additional source verification required** — something about the entry's source/citation/authenticity needs checking before a decision can be made.
- **Clinical or safeguarding review required** — applies automatically to every "Heightened" row; also usable to flag a standard-tone row that turned out to need it.
- **Keep unpublished** — no acceptable content exists yet; do not publish under any pairing currently available.
- **Deferred** — matches this state's own `launchStatus`; not in scope for a launch decision right now.

## Fastest path to a first review pass

Rows **1, 2, 4, 5, 7, 8, 13, 14** have no flags at all beyond the sitewide unverified-grading note — these are the lowest-friction to clear first. Rows **3, 6, 9, 10, 11, 12, 15** each have one specific, named concern to resolve or accept. Rows **16, 17** need content sourcing before they're reviewable. Row **18** is out of scope for this round entirely.
