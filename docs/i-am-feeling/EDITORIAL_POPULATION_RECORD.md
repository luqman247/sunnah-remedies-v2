# Editorial Population Record — "I am feeling…"

Records the actual state of content preparation as of this implementation session, for `docs/i-am-feeling/SPEC.md` Phase 9. This reflects what was genuinely done, not an idealised target.

## What exists and where

- **Taxonomy (code, complete):** `src/lib/feeling/taxonomy.ts` — 6 families, 20 feeling states (17 `launch`, 3 `deferred`), with English and Danish labels/descriptions, aliases, tone, and safeguarding level for every state.
- **Seed data (code, reviewable, NOT yet applied to Sanity):** `scripts/i-am-feeling-content-seed-data.ts` + `scripts/seed-i-am-feeling-content.ts`. Verified via `npm run seed:i-am-feeling:dry-run` in this session — the dry-run log is reproduced below. **No write was performed against the live dataset** — creating live CMS documents is a production-content change outside this implementation session's authority (see the final report's "No release actions" section).

## Reuse-first sourcing — what was actually checked

Before writing any seed data, the live Sanity dataset was queried **read-only** (no writes) to find existing `duaDhikrEntry` documents to reference, per SPEC §7.4:

- **425** `duaDhikrEntry` documents exist in the live dataset.
- **0** currently have `reviewStatus == "published"` (the canonical scholarly-approved pathway is unused site-wide).
- All **425** are reachable only via the `owner-approved-english-first` pathway — meaning every entry this feature could reference will render with the existing "Content-owner approved · scholarly review pending" badge (`DuaDhikrEntryCard`'s existing, unmodified behaviour), never a false claim of scholarly review.
- **Direct, material consequence for this feature: zero `duaDhikrEntry` documents currently pass the Danish eligibility gate** (`isDuaDhikrEntryDanishPubliclyEligible`), because that gate requires the canonical or editorial-bypass pathway, neither of which any entry currently satisfies. This means **no `feelingState` page can become Danish-publication-ready today, regardless of how complete its own Danish curatorial copy is** — the blocker is upstream, in the existing Duʿā & Dhikr content's review state, not in anything this feature's implementation controls. This is a genuine, pre-existing site-wide content-maturity gap, reported here rather than worked around.

## Feeling-state-by-feeling-state status

| State | Featured entries | Curatorial copy (En/Da) | Status |
|---|---|---|---|
| Grieving a Loss | 2 (real, existing) | Drafted | Ready for editorial review |
| Feeling Alone | 0 | — | **Needs entry sourcing** — no confident title-based match found |
| Weighed Down by Guilt or Regret | 2 (real, existing) | Drafted | Ready for editorial review |
| Anxious or Worried | 2 (real, existing) | Drafted | Ready for editorial review |
| Overwhelmed | 2 (real, existing) | Drafted | Ready for editorial review |
| Restless at Night | 1 (real, existing) | Drafted | Ready for editorial review |
| Feeling Weary | 1 (real, existing — reused from Overwhelmed, distinct reflection) | Drafted | Ready for editorial review |
| Angry or Frustrated | 1 (real, existing) | Drafted | Ready for editorial review |
| Struggling with Envy | 0 | — | **Needs entry sourcing** — no confident title-based match found |
| Distant from Allah | 1 (real, existing) | Drafted | Ready for editorial review |
| Struggling with Sincerity | 1 (real, existing) | Drafted | Ready for editorial review |
| Troubled by Doubts *(deferred)* | 2 (real, existing — strong title match) | Drafted | Architected only — must not launch without the dedicated scholarly working group (SPEC §4) |
| Grateful | 2 (real, existing) | Drafted | Ready for editorial review |
| At Peace | 2 (real, existing) | Drafted | Ready for editorial review |
| Hopeful | 1 (real, existing — imperfect fit, flagged) | Drafted | Needs editor confirmation of thematic fit |
| Facing a Difficult Decision | 1 (real, existing — strong match) | Drafted | Ready for editorial review |
| Facing Illness | 2 (real, existing) | Drafted | Ready for editorial review |
| Afraid of What Lies Ahead | 1 (real, existing — imperfect fit, flagged) | Drafted | Needs editor confirmation of thematic fit |
| Feeling Let Down *(deferred)* | 0 | — | Deferred, no sourcing attempted (matches SPEC §4's own deferral reasoning) |
| Impatient *(deferred)* | 0 | — | Deferred, no sourcing attempted (matches SPEC §4's own deferral reasoning) |

**13 of 17 launch states** have a real, existing entry pairing and drafted introduction/reflection/practical-next-step copy (English and Danish). **4 states** (2 launch: Feeling Alone, Struggling with Envy; 2 deferred: Feeling Let Down, Impatient) have no content prepared — consistent with SPEC §24's own rule that a state without adequate content must remain unpublished rather than ship thin.

## What "drafted" means here, precisely

Every piece of introduction/reflection/practical-next-step/professional-support-note copy in the seed data is a **genuine first-pass draft**, written in the compassionate, descriptive-not-corrective register SPEC §7.2 requires — not scholarly-reviewed, not clinically reviewed, and not asserted as final. It is secular/editorial framing only: no Arabic, no hadith attribution, no virtue claim, and no authenticity grading appears anywhere in this seed data — that content lives exclusively on the referenced `duaDhikrEntry` documents, already governed by the existing Duʿā & Dhikr review pipeline.

Every seeded `feelingState` document has `reviewStatus: "sourced"` and `boardApprovals: []` — **nothing goes live from this seed alone**. The publication gate (`src/sanity/lib/feeling-publication-gate.ts`) requires `reviewStatus == "published"`, which only a human editor can set after real review.

## Entry-pairing caveat

Entry-to-feeling pairings above were made by matching `duaDhikrEntry.titleEn` text to each feeling's theme — a reasonable, honest starting point, but **not** a scholarly confirmation that the pairing is doctrinally sound (SPEC §7.6 requires that separately, recorded as a `"scholarly"` board approval on the `feelingState` document). Two pairings (Hopeful, Afraid of What Lies Ahead) are flagged in the seed data itself as imperfect fits needing explicit editor confirmation before publish.

## Next steps for a human editor

1. Run `npm run seed:i-am-feeling:dry-run` again to re-confirm the plan, then apply it with `CONFIRM_SANITY_DATASET=<dataset> npm run seed:i-am-feeling` once ready.
2. In Studio, for each seeded `feelingState`: review the drafted copy, confirm the entry pairing, record a `"scholarly"` board approval, and — for `safeguardingLevel: "heightened"` states — a `"clinical"` board approval, then set `reviewStatus: "published"`.
3. Source entries for Feeling Alone and Struggling with Envy (no match currently exists) before those two states can ever publish.
4. Complete Danish content for the underlying `duaDhikrEntry` documents themselves (site-wide gap, not specific to this feature) before any feeling page can become Danish-eligible.
5. Once at least one `feelingState` is genuinely published, enable the `homepageHighlight-i-am-feeling`(`-da`) documents (`enabled: false` by default in the seed) and consider unpinning/pinning per editorial judgement.

## Dry-run verification log (this session, read-only)

```
{
  "mode": "dry-run",
  "projectId": "u106t68x",
  "dataset": "production",
  "force": false
}
○ dry-run feelingFamily-heart-feels-heavy would create
○ dry-run feelingFamily-mind-wont-settle would create
○ dry-run feelingFamily-emotions-feel-intense would create
○ dry-run feelingFamily-faith-feels-distant would create
○ dry-run feelingFamily-heart-feels-open would create
○ dry-run feelingFamily-facing-change-or-difficulty would create
○ dry-run feelingState-grieving-a-loss would create — 2 featured entries
○ dry-run feelingState-feeling-alone would create — 0 featured entries — NEEDS EDITOR
○ dry-run feelingState-weighed-down-by-guilt would create — 2 featured entries
○ dry-run feelingState-feeling-anxious would create — 2 featured entries
○ dry-run feelingState-feeling-overwhelmed would create — 2 featured entries
○ dry-run feelingState-restless-at-night would create — 1 featured entry
○ dry-run feelingState-feeling-weary would create — 1 featured entry — NEEDS EDITOR
○ dry-run feelingState-feeling-angry would create — 1 featured entry
○ dry-run feelingState-struggling-with-envy would create — 0 featured entries — NEEDS EDITOR
○ dry-run feelingState-feeling-distant-from-allah would create — 1 featured entry
○ dry-run feelingState-struggling-with-sincerity would create — 1 featured entry
○ dry-run feelingState-troubled-by-doubts would create — 2 featured entries — NEEDS EDITOR (deferred)
○ dry-run feelingState-feeling-grateful would create — 2 featured entries
○ dry-run feelingState-feeling-at-peace would create — 2 featured entries
○ dry-run feelingState-feeling-hopeful would create — 1 featured entry — NEEDS EDITOR
○ dry-run feelingState-facing-a-decision would create — 1 featured entry
○ dry-run feelingState-facing-illness would create — 2 featured entries
○ dry-run feelingState-afraid-of-what-lies-ahead would create — 1 featured entry — NEEDS EDITOR
○ dry-run feelingState-feeling-disappointed would create — 0 featured entries — NEEDS EDITOR (deferred)
○ dry-run feelingState-feeling-impatient would create — 0 featured entries — NEEDS EDITOR (deferred)
○ dry-run homepageHighlight-i-am-feeling (en) would create — enabled: false
○ dry-run homepageHighlight-i-am-feeling-da (da) would create — enabled: false
Dry-run complete — no writes performed.
```
