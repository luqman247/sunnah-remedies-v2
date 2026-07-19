# Content Gap Register — "I am feeling…"

Every genuine content gap discovered during this implementation, recorded in full rather than papered over. A "gap" here means: a launch-taxonomy state (`launchStatus: "launch"`) with no `duaDhikrEntry` pairing that a reasonable search turned up — not a state that was never searched.

---

## Feeling Alone (`feeling-alone`)

**Family:** When the Heart Feels Heavy · **Safeguarding level:** Heightened · **Publication status:** Cannot publish — no featured entry exists.

**Search performed** (read-only, against the live 425-document `duaDhikrEntry` dataset, two separate rounds):
1. Round 1 — `titleEn` substring match against: "alone", "lonel(y)", "isolat(ed)".
2. Round 2 (wider) — the same terms plus "companion(ship)", matched against `titleEn`, `whatItIsFor`, `occasion`, `searchAliases`, `explanationText`, and `virtueText` combined.

**Result:** "lonely" and "isolated" returned **zero** hits in both rounds. "alone" and "companionship" returned hits only because those substrings appear inside generic salah-context boilerplate (e.g. "Recited in the context of: Salah.") — no thematic connection to loneliness. No candidate entry was found.

**Why the existing entries were rejected:** there is nothing to reject — no entry exists that addresses loneliness or the absence of companionship, directly or adjacently, under a reasonable search.

**The type of Qur'anic verse, duʿā, or dhikr needed:** something addressing companionship with Allah in the absence of human company — candidates a scholar might consider include duʿās around Allah's nearness (e.g. "And when My servants ask you concerning Me, indeed I am near," Qurʾān 2:186), duʿās of the Prophet ﷺ during isolation or difficulty (e.g. his duʿā at Ṭāʾif), or dhikr specifically framed around not being alone because Allah is present (rather than a generic protection or gratitude duʿā repurposed).

**Suggested themes to investigate:** companionship with Allah; the Prophet's ﷺ own experiences of isolation and rejection; duʿās recited when among strangers or far from family (travel-adjacent themes already exist in the library under "Travel" — worth checking whether any of those touch loneliness specifically); dhikr of remembrance that emphasises Allah's nearness (qurb).

**Required source standard:** identical to the rest of the library — `quran.com`, `sunnah.com`, or `usul.ai` only (per `docs/dua-dhikr/SOURCE_POLICY.md`), never the two "I am feeling…" reference sites for actual religious text (SPEC §7.1).

**Review requirement:** once a candidate is sourced, it needs the same scholarly + editorial review as every other row in `SCHOLARLY_REVIEW_PACKAGE.md`, plus clinical sign-off (this state is "heightened").

**Publication status:** **Keep unpublished** until content is sourced. Do not force-fit an unrelated entry to avoid an empty state — an honest "being prepared" page (already the app's default behaviour for a launch-status state with no eligible content) is preferable to a mismatched pairing.

---

## Struggling with Envy (`struggling-with-envy`)

**Family:** When Emotions Feel Intense · **Safeguarding level:** Standard · **Publication status:** Cannot publish — no featured entry exists.

**The Muʿawwidhat candidate:** a wider field search (same method as above) surfaced `duaDhikrEntry-lwa-080`, "Muʿawwidhat: Best Words to Seek Allah's Protection" (Sūrahs al-Falaq and an-Nās), against the search terms "envy," "envious," and "jealous."

**The distinction that matters:** Sūrat al-Falaq's closing verse seeks refuge "min sharri ḥāsidin idhā ḥasad" — "from the evil of an envier when he envies" (Qurʾān 113:5). This is protection **from another person's envy directed at you** — an external-threat framing. "Struggling with Envy" as architected in this taxonomy is about **a person's own envy of someone else**, and wanting to let go of it — an internal-disposition framing. These are related by the same root word but are not the same request.

**Why it was not force-fitted:** offering the Muʿawwidhat to someone who says "I feel envious of my friend" would answer a question they didn't ask (protecting them from envy aimed at them) rather than the one they did (help with the envy they're feeling toward someone else). This is exactly the kind of mismatch `docs/dua-dhikr/SOURCE_POLICY.md`'s citation-precision discipline exists to prevent extending into curatorial pairing, not just source citation.

**What kind of content would be more directly appropriate:** duʿās or dhikr addressing the *internal* disposition of envy — classical guidance texts on ḥasad often recommend istighfār, gratitude practice (recognising the blessing in one's own situation), and specific prophetic guidance against envy as a disease of the heart (e.g. the hadith "Beware of envy, for envy devours good deeds as fire devours wood," Abū Dāwūd). None of these specific texts were confirmed present in the current 425-entry set under this search.

**Whether a Qur'anic, prophetic, or scholarly reflection pathway may be needed:** likely a **prophetic-hadith pathway** specifically (the "beware of envy" hadith and its surrounding guidance), rather than a Qurʾānic-verse pathway — this is a scholar's call, not an engineering one, and is exactly what row 17 of the review package asks them to make.

**Required review:** scholarly confirmation of whichever candidate is eventually sourced, plus editorial review of tone (compassionate framing per SPEC §7.2 — envy is common and human, not shameful).

**Publication status:** **Keep unpublished** until a direction-matched entry is sourced or the Muʿawwidhat pairing is explicitly scholar-approved as acceptable despite the direction difference (a legitimate possible outcome — this register does not presume the answer, only documents the concern honestly).

---

## Other weak, provisional, or imperfect pairings (not full gaps — see `SCHOLARLY_REVIEW_PACKAGE.md` for full detail on each)

These are **not** empty like the two above — each has a real featured entry — but carry a specific, named concern that stops short of a clean pairing:

| State | Entry | Concern | Package row |
|---|---|---|---|
| Anxious or Worried (`feeling-anxious`) | `-215` / `-378` | The two featured entries are the same duʿā stored as two separate Sanity documents (identical Arabic/English/source) — a data-duplication issue in the underlying library, not a new gap, but it means this state effectively has one duʿā, not two. | 3 |
| Feeling Weary (`feeling-weary`) | `-389` (shared with Overwhelmed) | Deliberate reuse under SPEC §7.4, not a defect — but worth a reviewer's explicit confirmation that "Allah is enough for me" genuinely serves depletion/weariness as well as acute overwhelm. | 6 |
| Grateful (`feeling-grateful`) | `-164` / `-165` | Near-identical opening Arabic between the two entries — confirm they are genuinely distinct duʿās, not a near-duplicate pair. Both also have a blank structured source-reference field despite being Qurʾānic. | 10 |
| At Peace (`feeling-at-peace`) | `-156` | Qurʾānic verse (20:25–26) whose citation is only present in the free-text English meaning, not in the structured `sourceReferences` fields — a data-completeness issue, not a pairing issue. | 11 |
| Hopeful (`feeling-hopeful`) | `-198` | Entry is tawakkul-themed (trust/reliance), not hope-specific — the closest available thematic neighbour, not a direct match. | 12 |
| Afraid of What Lies Ahead (`afraid-of-what-lies-ahead`) | `-198` (same as above) | Same imperfect fit, reused. | 15 |

None of the six rows above are recommended "Keep unpublished" outright — each is recommended in the review package as either "Approved" pending a quick confirmation, or "Additional source verification required," which is a lighter bar than the two true gaps above.
