# Owner Review Guide — "I am feeling…"

Plain-language guide for reviewing this feature locally. No engineering knowledge required to use this document. If something here doesn't match what you see, that's worth reporting — everything else in this guide describes the actual, current, tested state of the branch, not an aspiration.

## What has been built

A new part of the Knowledge Library: a way to find a duʿā by naming how you feel, rather than by browsing occasions (the existing Duʿā & Dhikr section is unchanged and still there). It has three pages:
- A landing page listing feelings, grouped into six families, with a search box.
- One page per feeling, designed to show a real duʿā from the existing library, a short reflection, and a small practical suggestion.
- A dedicated, calm "urgent support" page with UK crisis contact information, reachable from a quiet link on every page — never presented as one feeling among others.

None of it is live. Nothing has been published to the CMS, nothing has been committed. This is a local build you can review before any of that happens.

**Important — what you will actually see locally right now:** the drafted duʿā content, reflections, and next-step text described in this guide have **not** been written to the CMS — doing that was intentionally out of scope for this session (writing to the CMS, even in draft form, wasn't authorised). So every feeling page you open locally will honestly show its "being prepared" message rather than the real content, exactly as it should for content that hasn't been published. **To read the actual drafted text, open `docs/i-am-feeling/SCHOLARLY_REVIEW_PACKAGE.md`** — it contains every word that would appear on each page, laid out for review without needing the CMS step first. Once you and the reviewers are ready, an editor runs `npm run seed:i-am-feeling` (details in `EDITORIAL_POPULATION_RECORD.md`) to load this draft content into the CMS as unpublished drafts — at which point the local pages will start showing it, still not published to the live site.

## Which routes to open

Start the app locally (see "Local review environment" — a companion message in this session gives you the exact running URLs). Once running:

| What | English | Danish |
|---|---|---|
| Landing page | `/i-am-feeling` | `/dk/i-am-feeling` |
| Anxious or Worried | `/i-am-feeling/feeling-anxious` | `/dk/i-am-feeling/feeling-anxious` |
| Grieving a Loss | `/i-am-feeling/grieving-a-loss` | `/dk/i-am-feeling/grieving-a-loss` |
| Grateful | `/i-am-feeling/feeling-grateful` | `/dk/i-am-feeling/feeling-grateful` |
| Weighed Down by Guilt or Regret | `/i-am-feeling/weighed-down-by-guilt` | `/dk/i-am-feeling/weighed-down-by-guilt` |
| Facing Illness | `/i-am-feeling/facing-illness` | `/dk/i-am-feeling/facing-illness` |
| Urgent support | `/i-am-feeling/urgent-support` | `/dk/i-am-feeling/urgent-support` |
| A deferred state (should not be a real page) | `/i-am-feeling/troubled-by-doubts` | — |
| A made-up slug (should not be a real page) | `/i-am-feeling/not-a-real-feeling` | — |
| Knowledge Library entry point | `/knowledge-library` (see the new line near the Duʿā & Dhikr feature) | `/dk/knowledge-library` |
| Duʿā & Dhikr reciprocal link | `/knowledge-library/dua-dhikr` (see the new line near the bottom) | `/dk/knowledge-library/dua-dhikr` |

The five feeling pages above were deliberately chosen to cover: anxiety/worry, sadness/heaviness (grief), gratitude/hope, guilt/regret, and illness/difficulty — one from each requested category.

## What to review visually

- Does it look and feel like the rest of the site? (Same fonts, same restrained spacing, no rounded corners, no colour gimmicks, no icons/emoji.)
- Does the urgent-support page feel calm rather than alarming? It's the one page where legibility is deliberately prioritised (larger text for the phone numbers) — check that still reads as "this site, being extra careful," not "a different, louder site."
- Mobile: resize your browser narrow, or open on a phone. Nothing should overflow sideways.
- There's a small "PREVIEW ONLY — review status" chip built to appear at the top of each feeling page, showing at a glance what still needs attention (sourced / needs scholarly review / needs safeguarding review / Danish unavailable / blocked / deferred). **It only appears in development mode (`npm run dev`), not in the production mode this guide otherwise recommends** — confirmed by inspecting the actual production build output, where it's compiled out entirely, not merely hidden. If you want to see it, ask for a `npm run dev` session specifically; for everyday review, production mode is more representative of the real experience and is the recommended default.

## What to review editorially

Every feeling page's introduction, reflection, and "practical next step" text is a **first draft**, written to match the calm, non-diagnostic tone requested throughout — not final, reviewed copy. Read it the way you'd read a first draft from a new writer: is the *voice* right, even before anyone checks the religious content underneath it? The full text of every draft, organised by feeling, is in `docs/i-am-feeling/SCHOLARLY_REVIEW_PACKAGE.md` — you don't need to click through every page to read it.

## Which content is provisional

**All of it.** No feeling page has been reviewed or approved by anyone. Specifically:
- Every duʿā shown carries the same "Content-owner approved · scholarly review pending" badge the rest of the Duʿā & Dhikr library already uses for unreviewed content — you'll recognise it, it's not new.
- Every introduction/reflection/next-step is a draft (see above).
- The pairing between a feeling and its duʿā(s) has not been scholar-confirmed. `SCHOLARLY_REVIEW_PACKAGE.md` names two pairings as imperfect fits and one page (Anxious or Worried) as accidentally showing the same duʿā twice under two different titles — worth your own eyes on those three specifically.

## Which pages cannot yet publish

- **Feeling Alone** and **Struggling with Envy** — no suitable duʿā was found in the existing library after two rounds of searching. These pages render honestly as "being prepared," not broken, not empty-looking, not a dead link. Full detail: `docs/i-am-feeling/CONTENT_GAP_REGISTER.md`.
- **Troubled by Doubts** — deliberately not a public page at all right now (visiting its URL correctly shows a normal "not found" page). This one needs a dedicated scholarly working group before it can ever go live, not just an ordinary review — that was a specific decision from earlier in this project, carried forward unchanged.
- **Feeling Let Down** and **Impatient** — parked for a future version, not part of this launch at all.
- **Every Danish page** — see "Danish limitations" below. This isn't a per-page issue; it's a whole-library issue.

## What the scholarly reviewer must approve

For each of the 15 feeling states that have real content (see `SCHOLARLY_REVIEW_PACKAGE.md`): is the specific duʿā a doctrinally sound thing to offer someone feeling this way, and does the drafted reflection avoid overstating what it does. They are **not** being asked to re-grade the underlying hadith/Qurʾān sourcing — that's the existing Duʿā & Dhikr library's own separate, ongoing process. `REVIEW_DECISION_REGISTER.md` is where their decision gets recorded, one row per feeling.

## What the safeguarding/clinical reviewer must approve

Five feeling states are marked "Heightened" (Grieving a Loss, Anxious or Worried, Troubled by Doubts, Facing Illness — plus Feeling Alone once it has content): these carry a mandatory "professional support" note, and need a clinical reviewer to confirm that note's wording is appropriate before the page can go live. They should also independently glance at `docs/i-am-feeling/SAFEGUARDING_VERIFICATION.md` — the crisis-line information itself is a separate, already-verified track (see below), but a second pair of eyes there is always welcome.

## What Danish limitations remain

This is the single most important structural fact to understand before reviewing:

**Every duʿā currently in the library — all 425 entries — is only approved through an "English-first" pathway. Zero of them are independently eligible for Danish yet** (confirmed by directly querying the live database this session). This is not something this feature can fix by itself — it's a property of the underlying Duʿā & Dhikr library, which predates this feature.

**Practical effect:** even once you (and the scholarly/safeguarding reviewers) approve the English side of a feeling page, the Danish version of that same page will not go live until the underlying duʿās it references separately earn Danish approval. The Danish UI itself (headings, buttons, the "being prepared" message) is fully translated and works today — visit `/dk/i-am-feeling` and you'll see natural Danish throughout — but the actual religious content underneath stays in an honest "being prepared" state in Danish until that separate work happens.

This was checked carefully this session, not assumed:
- A Danish feeling page never silently shows English religious text — it shows the honest "being prepared" message instead.
- Danish pages are never linked as if they were ready (the feeling cards render as plain, non-clickable "in preparation" tiles on the Danish landing page, not broken links).
- Search-engine signals (the technical `hreflang` tags that tell Google "this page also exists in Danish") only ever point at a Danish page once it's genuinely ready — a defect where this wasn't true was found and fixed this session.

**Recommended release model:**
- **English can go live** once: scholarly approval + editorial approval + (where marked) safeguarding approval + you sign off, per state, independently. Publishing five approved English states while eight are still in review is fine — this feature is built to allow that.
- **Danish stays unavailable** until the referenced duʿās themselves become Danish-eligible in the wider library — a separate content programme, not a blocker specific to this feature.

## Homepage integration — exact current status

**Prepared, but not applied anywhere yet — nothing has been written to the CMS.** During this session, the homepage promotional card ("How are you feeling?") was fully drafted (English and Danish copy, correct destination link) but deliberately set to **disabled** in that draft, and the draft itself has not been sent to the live database — it exists only as a reviewable file (`scripts/i-am-feeling-content-seed-data.ts`) plus a dry-run log proving it's ready to apply (`docs/i-am-feeling/EDITORIAL_POPULATION_RECORD.md`).

- **Controlled by:** the CMS (same mechanism as every other homepage card — an editor toggles a single "Show on homepage" switch once ready). Not a code feature flag.
- **Right now:** nothing renders on the homepage from this feature — verified by loading the homepage locally and confirming no "I am feeling…" card and no console errors.
- **Activation process, once you're ready:**
  1. An editor runs the existing seed script (`npm run seed:i-am-feeling`, after the safety checks described in `EDITORIAL_POPULATION_RECORD.md`) to create the homepage card in the CMS, still disabled.
  2. Once at least one feeling state is genuinely published, an editor flips that one card's "Show on homepage" switch on, in Studio — a normal content edit, no deploy required.
  3. English and Danish activate **independently** — they're two separate CMS documents by design, so you (or an editor) can turn on the English homepage card without the Danish one, matching the staged release model above.
- No empty card can ever appear: the homepage's existing rules (already in place before this feature, unchanged) simply omit any card that's missing required fields — this feature's card was drafted with every required field filled in from the start.

## What decisions you need to make

1. Does the overall experience feel right — tone, pacing, visual restraint? (Visual/editorial review, above.)
2. Are you comfortable with the 15 reviewable states going to scholarly/safeguarding review as drafted, or do any need rewriting first?
3. For the two imperfect-fit pairings and the one duplicate-entry issue (all named above): direct the fix now, or leave it for the scholarly reviewer to decide?
4. Timing: do you want to wait for all 17 launch states before any go live, or release approved states incrementally as they clear review? (The system supports either.)
5. When to start the separate Danish content programme, given it's now clearly the long pole.

## What not to change unless there's a genuine problem

Per this session's instructions, the following are **accepted and should not be redesigned, replaced, or rebuilt** without a specific, named defect: the three routes and their URLs, the `/dk` Danish convention, the redirects from the old proposed URL, the `feelingFamily`/`feelingState` content model, the publication gates, the 90-day crisis-information recheck requirement, the rule that duʿās are always referenced from the existing library rather than copied, the locale-safe translation pattern, how deferred states are kept off the live site, the homepage-gating mechanism, the Knowledge Library integration points, and the existing test suite. If you spot something that looks wrong in one of these areas, that's worth flagging explicitly as a suspected defect rather than a design opinion — the two are handled differently.

## Page-by-page checklist

Reminder: since no content is in the CMS yet (see above), items below marked *(reads "being prepared")* are checking the honest placeholder state, not final content — for the actual drafted words, read the matching section of `SCHOLARLY_REVIEW_PACKAGE.md` alongside the page.

- [ ] `/i-am-feeling` (English) — hero, search box, family groupings (each showing "in preparation" tiles for now), safety notice at the bottom all present and readable
- [ ] `/dk/i-am-feeling` (Danish) — same, in Danish, no English text leaking through
- [ ] `/i-am-feeling/feeling-anxious` *(reads "being prepared")* — cross-check against `SCHOLARLY_REVIEW_PACKAGE.md` row 3; note the duplicate-entry issue described there
- [ ] `/i-am-feeling/grieving-a-loss` *(reads "being prepared")* — cross-check row 1; confirm the professional-support note text (in the package doc) reads appropriately
- [ ] `/i-am-feeling/feeling-grateful` *(reads "being prepared")* — cross-check row 10; a "standard" (non-heightened) state, for contrast
- [ ] `/i-am-feeling/weighed-down-by-guilt` *(reads "being prepared")* — cross-check row 2; confirm the tone doesn't read as scolding
- [ ] `/i-am-feeling/facing-illness` *(reads "being prepared")* — cross-check row 14; confirm the medical-non-substitute wording is clear
- [ ] `/i-am-feeling/urgent-support` — this page's content **is** fully live locally (it doesn't depend on CMS content) — check it feels calm, not alarming; check the numbers are legible
- [ ] `/i-am-feeling/troubled-by-doubts` — confirm this shows a normal "not found" page, not an error
- [ ] `/knowledge-library` and `/knowledge-library/dua-dhikr` — confirm the two small new cross-links are present and point to the right place
- [ ] Homepage (`/`) — confirm nothing new appears yet (correct, expected)
- [ ] Mobile width — spot-check at least the landing page and one detail page
