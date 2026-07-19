# "I am feeling…" — Product & Technical Specification

Status: Draft for review. Not yet implemented. **Revision 2** — supersedes Revision 1 in place (this remains the single, canonical specification for this feature; no competing document exists).
Owner: Sunnah Remedies editorial + engineering.
Grounded against the repository at branch `how-i-feel` (commit `8852b8b`), audited 2026-07-18. Revision 2 incorporates the owner's final content-direction approval of 2026-07-19.

Public URL (English): `https://www.sunnahremedies.co.uk/i-am-feeling`
Public URL (Danish): `https://www.sunnahremedies.co.uk/dk/i-am-feeling`
Feeling page (English): `https://www.sunnahremedies.co.uk/i-am-feeling/[feelingSlug]`

**Revision 2 changes, at a glance** (full detail throughout, and repeated in the chat message accompanying this revision):
1. **Route corrected to top-level `/i-am-feeling`**, not `/knowledge-library/i-am-feeling`. The feature remains conceptually and navigationally part of the Knowledge Library (breadcrumb, department styling, cross-links) but its URL is short and independent, with a permanent redirect from the previously-specified path.
2. **Reference-source policy recorded explicitly** (§7.1) — the two named sites are owner-approved for taxonomy discovery, coverage comparison, and identifying which duʿās are thematically relevant to which feelings. They are **not** approved as a source of Arabic text, translation, or transliteration *content* to copy into this product — that remains governed by the site's existing, unchanged Source Policy. The reasoning for this distinction is stated in full in §7.1, applied conservatively without asking, per the owner's own instruction to resolve non-blocking matters without repeated questions.
3. **Taxonomy revised**: 17 launch states (was 14), the excluded "Holding Doubts" category reinstated in the architecture as "Troubled by Doubts" — deferred pending scholarly review, not removed — plus two new launch states ("Weighed Down by Guilt or Regret," "Feeling Weary") added after comparing coverage against `mydailyduas.com/i-am-feeling/`'s category list (§4).
4. Safeguarding pathway now requires a documented, dated verification of every crisis contact before release, with staleness blocking publication (§8).
5. `feelingSlug` param naming adopted throughout (was `emotionSlug`), matching the user's specification and the `feelingState` schema name.

---

## Owner-Approved Reference Sources — Stated Unambiguously

The following two public pages have been reviewed and approved by the project owner as **content-discovery and taxonomy-comparison references** for this project:

- `https://mydailyduas.com/i-am-feeling/`
- `https://www.islamestic.com/i-am-feeling/`

**What this approval covers, without case-by-case re-approval:** using these pages to identify which feelings/emotional states a comparable resource covers, which duʿā *themes* are associated with which feelings, and general structural ideas about the feeling-to-remembrance relationship. Editorial and engineering may draw on this freely during taxonomy and content-mapping work (§4, §7.1) without stopping to ask per-item.

**What this approval does not cover, and why:** it does not extend to copying these sites' specific Arabic text, English translation wording, transliteration spelling, or displayed source citations directly into Sunnah Remedies content. That distinction — and the reasoning for holding it even under a broad content-direction approval — is explained in full in §7.1. In short: the *idea* that "Surah al-Baqarah's closing verses suit someone who feels anxious" is not anyone's property and is freely usable; a specific website's *particular wording* of a translation is that website's own creative expression, which Sunnah Remedies has not been licensed to reproduce, and copying it would also bypass the source-verification discipline (`docs/dua-dhikr/SOURCE_POLICY.md`) this codebase already enforces for exactly this reason. This is a production-safety and legal-exposure matter resolved conservatively here, not a question requiring the owner's further input — see §7.1 for the full reasoning and the compliant alternative workflow, which does not block content population.

Both sites are reviewed for **functional and taxonomy pattern only** otherwise — no visual, structural, layout, branding, iconography, or page-structure element from either site is to be reused (§3, §10).

---

## 1. Product Vision

### Purpose

A visitor arrives not knowing which duʿā they need, but knowing how they feel. "I am feeling…" is a second entry point into the same authoritative Duʿā & Dhikr library that `dua-dhikr` already exposes by ritual/topic — this one organised by internal state instead. It converts an emotional starting point into a short, dignified path: **feeling → remembrance → reflection → a concrete next step**.

### Audience

Visitors who do not yet know Islamic terminology for what they're seeking — new Muslims, visitors returning to practice after a gap, or anyone mid-feeling who searched "dua for anxiety" rather than "difficulties and happiness collection." Secondary audience: existing Duʿā & Dhikr users who want a faster route into a specific collection by naming their state rather than browsing categories.

### The problem it solves

The `dua-dhikr` hub organises content the way a scholar or librarian would — by ritual occasion, parent group, canonical collection. That's correct and should not change. But it presumes the visitor already has a name for what they're looking for ("Istighfar," "Ruqyah & Illness"). "I am feeling…" presumes nothing except that the visitor knows their own state. It's a second index over the same data, not a second body of content.

### Relationship to the Duʿā & Dhikr library

Strictly additive and strictly non-duplicating. Every duʿā, dhikr, Arabic text, translation, source reference, and authenticity grading a visitor sees on a feeling page is the same `duaDhikrEntry` document rendered by the same `DuaDhikrEntryCard` component already live at `/knowledge-library/dua-dhikr/[collectionSlug]`. Feeling pages hold **curatorial and interpretive** content only — which entries apply here, why, and what a compassionate next step looks like. They never fork or restate religious text. A correction to an entry's Arabic, translation, or source reference propagates to every feeling page referencing it, automatically, because nothing is copied. This principle is unchanged by, and applies equally to, any content originally discovered via the owner-approved reference sites (§7.1): once mapped and independently verified, it becomes an ordinary `duaDhikrEntry`, governed exactly like every other entry in the library.

### What makes it distinctively Sunnah Remedies

- It is editorial, not gamified. No streaks, no mood-tracking history, no emoji-reaction UI, no "your mood over time" chart.
- It never diagnoses. Every feeling label describes a human state, not a clinical condition.
- Restraint over coverage: a focused, governed taxonomy (§4) rather than an exhaustive tile wall — notably smaller than either reference site's own category count, by deliberate editorial choice, not oversight.
- It sits inside the same masthead, breadcrumb, folio-mark, and `SectionPage` shell as the rest of the Knowledge Library — not a themed micro-site with its own visual language, and not a copy of either reference site's layout, branding, icons, or graphic assets (§3, §7.3, §10).
- Every religious claim carries the same source-and-authenticity discipline as the rest of the library (§7) — no separate, lighter-touch content standard for this surface, and no exception made for content that started life as a discovery lead from a reference site.

### What it must not become

- A mood tracker or a wellness app with saved history, badges, or check-in streaks.
- A mental-health diagnostic or self-assessment tool ("you may have anxiety disorder").
- A copy of either reference site's tile wall, colour system, layout, or copy voice. (Direct evidence for why this matters: `mydailyduas.com/i-am-feeling/`'s own category list, reviewed for this spec, includes "Suicidal" as one tile among roughly fifty ordinary feeling labels including "Bored" and "Aroused" — exactly the anti-pattern this spec's safeguarding design (§8) exists to rule out. That site is a useful discovery reference; it is not a governance model.)
- A dumping ground for every conceivable emotion word — the taxonomy is governed and deliberately incomplete at launch (§4).
- A place where a duʿā is framed as guaranteed to remove a feeling, cure a condition, or substitute for medical or mental-health care.
- A place where "how are you feeling" quietly becomes a self-harm intake form. The crisis pathway (§8) is separate, calm, and never presented as one tile among many.

---

## 2. Information Architecture

### Route decision — corrected

The primary public route is the short, top-level path the owner has specified:

| Route | File | Notes |
|---|---|---|
| `/i-am-feeling` | `src/app/[locale]/i-am-feeling/page.tsx` | Landing page. **Primary, canonical, indexable route.** |
| `/i-am-feeling/[feelingSlug]` | `src/app/[locale]/i-am-feeling/[feelingSlug]/page.tsx` | One statically generated route per launch-taxonomy slug. **Primary, canonical, indexable route.** |
| `/i-am-feeling/urgent-support` | `src/app/[locale]/i-am-feeling/urgent-support/page.tsx` | The safeguarding pathway (§8). `noIndex`. |

This sits as a sibling to `src/app/[locale]/knowledge-library/`, not nested inside it — a new top-level segment under `[locale]`, exactly the same tier as `knowledge-library` itself, `the-apothecary`, `the-academy`, etc. It is **conceptually** a Knowledge Library feature (breadcrumb, department colour/label, cross-links) without being **structurally** nested under that URL prefix — the same distinction the site already draws elsewhere between URL hierarchy and departmental grouping (`getDepartmentByPath` already maps several non-nested prefixes to the same department; this feature adds one more, below).

### Redirects from the superseded route

The route `/knowledge-library/i-am-feeling` appeared in Revision 1 of this specification and must never become a second, competing indexable page. Add permanent redirects in `next.config.ts`, following the exact precedent already in place for `/knowledge-library/dhikr` → `/knowledge-library/dua-dhikr`:

```ts
{
  source: "/knowledge-library/i-am-feeling",
  destination: "/i-am-feeling",
  permanent: true,
},
{
  source: "/knowledge-library/i-am-feeling/:feelingSlug",
  destination: "/i-am-feeling/:feelingSlug",
  permanent: true,
},
```

Verify at implementation time (Phase 0/3) exactly how the existing `dhikr` → `dua-dhikr` redirect entry interacts with the `/dk` ⇄ `/da` locale bridge and the unprefixed-English catch-all rewrite already documented in `next.config.ts`, and mirror that same mechanism precisely rather than inventing a second redirect strategy — both locale variants of the old path must redirect to the correct locale variant of the new path. **No route file should ever exist at `src/app/[locale]/knowledge-library/i-am-feeling/`** — the redirect is configuration-only; there is exactly one canonical page per URL, never two renderable pages for the same content.

### Single-slash rule

Every route above uses exactly one path segment per level, no double slashes, all lower-case, hyphenated — consistent with `Sunnah-Remedies-Design-Manual.md` §8.2's URL standard.

### Breadcrumbs

Unchanged in substance from Revision 1 — the breadcrumb still reads as a Knowledge Library feature, regardless of URL structure:

```
Knowledge Library  →  I am feeling…                              (landing page)
Knowledge Library  →  I am feeling…  →  Anxious or Worried        (feeling page)
```

Rendered via `SectionPage`'s `breadcrumb` prop with `department={knowledgeLibrary}` passed explicitly (not inferred from the URL prefix, since the URL no longer starts with `/knowledge-library`) — the same explicit-prop pattern `dua-dhikr/page.tsx` already uses.

### Canonical URLs

`pageMetadata("iAmFeeling", "/i-am-feeling")` for the landing page, and `pageMetadata`-style helper for each feeling page using `/i-am-feeling/[feelingSlug]`. `localeUrl()` continues to handle `/` vs `/dk` prefixing with no change to that helper.

### Localisation strategy

Unchanged from Revision 1 in every respect except the path prefix: English unprefixed (`/i-am-feeling`), Danish under the public `/dk` prefix (`/dk/i-am-feeling`) — the repository's confirmed, live convention (`src/i18n/locales.ts`, `middleware.ts`, `next.config.ts`'s `/dk`⇄`/da` bridge). Internally this is still the `/da` App Router segment — never expose `/da` publicly. Content-level localisation remains the `xxxEn`/`xxxDa` field-pair convention on `feelingFamily`/`feelingState`, with the same "no silent fallback for editorial copy" rule already established for `duaDhikrEntry`/`duaDhikrCollection`.

### Related-content routes

Unchanged — no separate URL family for "related feelings"; they render as in-page cross-links (`Link` to `/i-am-feeling/[relatedSlug]`). "Related Duʿā & Dhikr collections" link into the existing `/knowledge-library/dua-dhikr/[collectionSlug]` routes, which remains the primary connective tissue back into the ritual/topic-organised library.

### Navigation placement

Add one `NavItem` to `knowledgeLibrary.sections` in `src/lib/navigation/site-structure.ts`, pointing at the new top-level path:

```ts
{
  label: "I am feeling…",
  href: "/i-am-feeling",
  description: "Find remembrance and reflection that meets you where you are.",
},
```

Because the `href` no longer starts with `/knowledge-library`, `getDepartmentByPath` (same file) needs one additional line so masthead/breadcrumb department detection still resolves correctly for a direct visit or deep link:

```ts
if (path.startsWith("/i-am-feeling")) return knowledgeLibrary;
```

Add this alongside the existing `/knowledge-library` / `/knowledge/dhikr` line, not in place of it. The CMS-driven `navigation` singleton (top masthead dropdown) should get the same `/i-am-feeling` entry added editorially in Sanity Studio.

### Where else the feature is linked from

Per the owner's direction, in addition to primary navigation:

- **Knowledge Library landing page** (`/knowledge-library`) — add a card/link in its existing showcase area pointing to `/i-am-feeling`, framed as "a second way in, by feeling rather than by occasion."
- **Duʿā & Dhikr library** (`/knowledge-library/dua-dhikr`) — a small reciprocal callout near the existing "Begin here"/"Browse by occasion" sections: "Prefer to start from how you feel? Try I am feeling…" → `/i-am-feeling`. This is the mirror image of §3.6's link back the other way.
- **Homepage** — via the existing "Latest Additions" mechanism (§11), destination pathname updated to `/i-am-feeling`.
- **Related-content sections** — every feeling page's "Related Duʿā & Dhikr collections" links (§5 #14), and, over time, reciprocal links from relevant `duaDhikrCollection` pages back to the feeling(s) that reference them (a Phase 10/post-launch enrichment, per §12's internal-linking note, unchanged from Revision 1).

---

## 3. Landing-Page Structure

Unchanged from Revision 1 in every section's purpose, layout, copy, and interaction detail — only the URL and its file location have moved. Reproduced here for completeness with the corrected route.

Built on the existing `SectionPage` shell (masthead, breadcrumb, department, folio mark, footer) — the same shell `dua-dhikr/page.tsx` uses, with `department={knowledgeLibrary}` passed explicitly per §2.

### 3.1 Editorial hero

**Purpose:** Set tone immediately — this is a considered institutional resource, not a quiz. State the core premise in one sentence.

**Layout:** Full-width `intro` slot inside `SectionPage`, matching the existing `dua-dhikr-hero` block structure (eyebrow → heading → lede → supporting line → primary interaction). No hero photography, no illustrated mood characters, no gradient blob — a quiet paper-textured panel consistent with `--paper`/`--ink` tokens, an optional single restrained line-icon motif, never a stock photo of a person looking pensive.

**Desktop:** Eyebrow, serif heading, single-column lede (max `--measure-reading`), search field directly below, left-aligned, generous top/bottom `--space-*` padding matching the dua-dhikr hero's proportions.

**Mobile:** Same stack, full-width search field, heading drops to the mobile serif scale already defined for other department heroes.

**Recommended copy:**
- Eyebrow: `KNOWLEDGE LIBRARY · GUIDED DISCOVERY`
- Heading: `How are you feeling?`
- Lede: `You may not know which duʿā you need. You may only know how you feel. Begin there.`
- Supporting: `A short path from what you're carrying to a remembrance that meets it — drawn from the same sourced Duʿā & Dhikr library, gathered by feeling rather than by ritual.`

**CTA language:** none required in the hero itself beyond the search field's own affordance (placeholder: `Try "anxious", "grateful", "facing a decision"…`).

**Interaction:** search field is the only interactive element in the hero; see §9 for full search behaviour.

**Accessibility:** `<h1>` is the heading text exactly; eyebrow is a `<p>` not a heading; search input has a visible `<label>` (may be visually hidden via `.sr-only`, not `placeholder`-only per WCAG 3.3.2); hero region has no autoplaying motion.

### 3.2 Feeling search

**Purpose:** Fastest path for a visitor who already has a word in mind.

**Layout:** Single text input, restrained (hairline border, `--radius: 2px`, no rounded pill), inline "search" affordance icon, positioned directly under the hero lede — reusing the visual language (not the component) of `DuaDhikrSearch`.

**Desktop:** Inline, ~480px max width, results appear as an unobtrusive dropdown/listbox below the field (combobox pattern) rather than navigating away.

**Mobile:** Full-width input; results render inline below the field, pushing page content down (no modal overlay).

**Interaction details:** see §9 in full (synonyms, typo tolerance, zero-results, keyboard behaviour).

**Accessibility:** implemented as an ARIA combobox (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`); results list uses `role="listbox"`/`role="option"`.

### 3.3 Featured emotional states

**Purpose:** A small, editorially curated set (not the full taxonomy) surfaced before the full family breakdown.

**Layout:** A restrained grid (3–4 cards desktop, single column mobile) of `FeelingCard` components — label, one-line description, quiet hover state (§10).

**Desktop:** 3–4 column CSS grid, equal-height cards. **Mobile:** single column, full-width cards.

**Recommended copy:** Section label `Where visitors begin`. Card copy is the feeling's own `oneLineDescriptionEn` (§4).

**CTA:** each card is a full-card `<Link>`; no separate button repeated per card.

**Interaction:** editorially ordered via `featuredOrder` (§6), never algorithmically re-ranked by click data at launch.

**Accessibility:** grid is a `<ul>`/`<li>` list of links, each with an accessible name equal to the visible label plus enough context to be distinguishable in a screen-reader link list.

### 3.4 Grouped emotion families

**Purpose:** The full governed taxonomy (§4), organised by family.

**Layout/desktop/mobile:** mirrors `dua-dhikr-parent-group` exactly — family heading, then card grid, stacking on mobile with an `IsnadRule` divider between families.

**Recommended copy:** Section label `Browse by what you're carrying`. Family headings exactly as in §4.

**Accessibility:** each family section has its own `aria-labelledby` heading id.

### 3.5 Gentle explanation of how to use the resource

**Purpose:** Set expectations honestly — the section doing the most work to prevent the "mood tracker" or "self-diagnosis tool" misreading.

**Layout:** A single restrained text block, not a numbered "how it works" stepper.

**Copy (recommended, full):**

> This is not a diagnosis, and it does not replace medical or mental-health care. Each entry gathers a duʿā, a reflection, and a small next step drawn from the same sourced Duʿā & Dhikr library used across the Knowledge Library — every Arabic text, translation, and reference carries the same authenticity standard you'll find there. If what you're carrying feels heavier than a page can hold, the Knowledge Library is not the right place to carry it alone — see below.

### 3.6 Links into the broader Duʿā & Dhikr library

**Purpose:** Explicitly close the loop back to the ritual/topic-organised hub.

**Copy:** `Prefer to browse by occasion instead? Visit the Duʿā & Dhikr library.` → links to `/knowledge-library/dua-dhikr`.

### 3.7 Safety and professional-support notice

**Purpose:** A calm, permanent, non-alarming line present on every visit.

**Layout:** Directly above the footer, inside the page body — quiet typographic treatment.

**Copy (recommended, full):**

> If you are struggling with your mental health, a duʿā is a companion to care, not a substitute for it. Speak to a doctor, a trusted person, or a qualified professional. If you or someone you know is in immediate danger, [see urgent support](/i-am-feeling/urgent-support) or contact emergency services.

### 3.8 Homepage / newsletter connection

No dedicated newsletter capture block on this page at launch, per Revision 1's reasoning (unchanged) — see §11 for the homepage-integration design.

---

## 4. Emotion Taxonomy — Revised

Structured as families → feeling states. Families are a first-class Sanity document (`feelingFamily`); states are `feelingState` documents referencing one family each (§6).

### What changed in this revision, and why

Per the owner's direction, the taxonomy was compared against both reference sites' coverage. `mydailyduas.com/i-am-feeling/` was successfully reviewed (category-label list only, no dua content examined or reproduced); `islamestic.com/i-am-feeling/` returned an HTTP 403 and could not be reviewed programmatically — editorial should review it manually before Phase 9 and flag any further coverage gaps it surfaces, but its absence here does not block this revision.

`mydailyduas.com` organises roughly fifty labels, including many that are condemnatory ("Hypocritical," "Weak," "Defeated," "Lazy"), overly granular near-duplicates ("Uneasy," "Irritated," "Offended," "Rage" alongside "Angry"), out-of-register for this product ("Aroused," "Bored"), or a bare list with "Suicidal" presented as one ordinary tile among the rest. Reviewing it validated three decisions already latent in Revision 1 and one correction:

- **Validated:** the compassionate-relabelling requirement — "Hypocritical" is exactly the case this spec's "Struggling with Sincerity" label was already designed to replace.
- **Validated:** near-duplicate granularity should be handled as *search aliases* on a smaller set of tiles, not as separate tiles — see each state's alias list below.
- **Validated:** a crisis category must never be an ordinary tile — direct evidence for why §8's separation is correct, not merely cautious.
- **Corrected:** two genuine coverage gaps identified — guilt/regret, and weariness/exhaustion — neither adequately served by the Revision 1 taxonomy's nearest neighbours. Added as new launch states below.

The prior exclusion of "Holding Doubts" is also corrected per the owner's direction: it is reinstated as an architected state, reframed compassionately, and deferred (not removed) pending scholarly review.

### Family A — When the Heart Feels Heavy (`heart-feels-heavy`)

| Label | Slug | Description | Tone | Launch | Related | Content types | Safeguarding |
|---|---|---|---|---|---|---|---|
| Grieving a Loss | `grieving-a-loss` | For when someone or something dear has gone. | Heavy | **Launch** | Feeling Alone; Distant from Allah | `death`, `janazah` collections | Heightened — professional-support note required (bereavement support), no crisis flag by default |
| Feeling Alone | `feeling-alone` | For when the people around you don't feel close enough. | Heavy | **Launch** | Grieving a Loss; Distant from Allah | `difficulties-and-happiness`; duʿās of companionship and reliance on Allah | Heightened — persistent loneliness is a recognised risk factor; professional-support note required. Aliases: `unloved`, `isolated` |
| Weighed Down by Guilt or Regret | `weighed-down-by-guilt` | For when something you did — or didn't do — won't leave you alone. | Heavy | **Launch** *(new)* | Struggling with Sincerity; Distant from Allah | `istighfar` collection; tawbah-themed duʿās | Standard — tone must be relieving, never scolding; this is precisely the state most at risk of accidentally reading as a rebuke. Aliases: `guilty`, `regret`, `ashamed`, `humiliated` |
| Feeling Let Down | `feeling-disappointed` | For when someone or something didn't meet what you hoped for. | Heavy | Deferred | Grieving a Loss | — | Standard. Reason deferred, unchanged from Revision 1: insufficient content differentiation at launch; revisit with usage data. Reviewed again against `mydailyduas.com`'s "Hurt" label — folded as a future alias candidate for this same deferred state rather than justifying a separate tile. |

### Family B — When the Mind Will Not Settle (`mind-wont-settle`)

| Label | Slug | Description | Tone | Launch | Related | Content types | Safeguarding |
|---|---|---|---|---|---|---|---|
| Anxious or Worried | `feeling-anxious` | For when your thoughts won't stop turning something over. | Unsettled | **Launch** | Overwhelmed; Restless at Night | `difficulties-and-happiness` | Heightened — professional-support note required. Aliases: `worried`, `nervous`, `insecure`, `on edge`, `uneasy` |
| Overwhelmed | `feeling-overwhelmed` | For when there's simply too much at once. | Unsettled | **Launch** | Anxious or Worried; Feeling Weary | `difficulties-and-happiness`; istighfar | Standard. Aliases: `weak`, `defeated`, `discouraged` |
| Restless at Night | `restless-at-night` | For when sleep won't come, or brings bad dreams. | Unsettled | **Launch** | Anxious or Worried | `nightmares`, `before-sleep` collections | Standard |
| Feeling Weary | `feeling-weary` | For when you're simply tired — in a way rest alone doesn't fix. | Unsettled | **Launch** *(new)* | Overwhelmed; Facing Illness | `difficulties-and-happiness`; duʿās of ease and relief | Standard. Aliases: `tired`, `exhausted`, `drained` |

### Family C — When Emotions Feel Intense (`emotions-feel-intense`)

| Label | Slug | Description | Tone | Launch | Related | Content types | Safeguarding |
|---|---|---|---|---|---|---|---|
| Angry or Frustrated | `feeling-angry` | For when something has stirred real anger. | Intense | **Launch** | Struggling with Envy | Prophetic guidance on anger; istighfar | Standard — copy must never moralise. Aliases: `frustrated`, `irritated`, `rage`, `offended` |
| Struggling with Envy | `struggling-with-envy` | For when you notice envy and don't want to carry it. | Intense | **Launch** | Struggling with Sincerity | Prophetic guidance on envy/ḥasad; istighfar, gratitude duʿās | Standard — compassionate reframing mandatory (§7.2); never "jealous" as the public label. Alias: `jealous`, `envious` |
| Impatient | `feeling-impatient` | For when waiting feels unbearable. | Intense | Deferred | Facing a Difficult Decision | — | Standard. Reason deferred, reaffirmed after comparison: `mydailyduas.com` also lists it as a thin, low-distinctiveness category; parking it for a v2 taxonomy review remains the right call rather than forcing a thin page live. |

### Family D — When Faith Feels Distant (`faith-feels-distant`)

| Label | Slug | Description | Tone | Launch | Related | Content types | Safeguarding |
|---|---|---|---|---|---|---|---|
| Distant from Allah | `feeling-distant-from-allah` | For when worship feels far away, or hard to feel. | Distant | **Launch** | Struggling with Sincerity; Troubled by Doubts | `protection-of-iman`, istighfar, names-of-allah | Standard — must never read as an accusation |
| Struggling with Sincerity | `struggling-with-sincerity` | For when you're unsure your heart is in what you're doing. | Distant | **Launch** | Distant from Allah; Weighed Down by Guilt | `protection-of-iman`, istighfar | Standard — never "hypocritical"/nifāq-adjacent language as the public label; sincerity is a struggle everyone faces, not a verdict. Alias: `hypocritical` (a deliberate compassionate-reframing alias — see §7.2) |
| Troubled by Doubts | `troubled-by-doubts` | For when questions about faith feel unsettling to sit with. | Distant | **Deferred — architected, not excluded** | Distant from Allah | `protection-of-iman` | **Heightened.** See "Reinstating this category" below. Aliases: `doubtful`, `uncertain about faith`, `waswas`, `intrusive thoughts`, `struggling to trust`, `spiritually unsettled`, `disbelief` |

**Reinstating "Troubled by Doubts."** Revision 1 excluded this category outright. Per the owner's direction, ordinary doubt, uncertainty, intrusive thoughts, and waswas are a real and common user need, and permanently removing them from the architecture because they require careful treatment was the wrong response to that risk — the right response is precise scoping and a genuinely stronger gate, not deletion. This state is therefore:

- **Retained in the architecture** as a first-class `feelingState` document, family-assigned, alias-mapped, and cross-linked, so it is never an afterthought bolt-on if and when it launches.
- **Deferred, not published, at first launch** (`launchStatus: "deferred"`) until a named scholarly working group has reviewed its introduction/reflection copy specifically — this is a larger and more specialised review than the standard `"scholarly"` board-approval sign-off other states receive, given how easily a poorly worded page on doubt could reinforce rather than settle it.
- **Gated at `safeguardingLevel: "heightened"`**, meaning even once scholarly review completes, the existing publication gate (§6) additionally requires an approved `"clinical"` board approval before it can go live — the same mechanism protecting every other sensitive state, applied here at full strength rather than as a special case.
- Content for this state, once written, must frame doubt as a normal part of faith many people experience, never as a failure — the same descriptive-not-corrective tone rule (§7.2) that governs "Struggling with Sincerity" and "Weighed Down by Guilt" applies with particular weight here.

### Family E — When the Heart Feels Open (`heart-feels-open`)

| Label | Slug | Description | Tone | Launch | Related | Content types | Safeguarding |
|---|---|---|---|---|---|---|---|
| Grateful | `feeling-grateful` | For when you want to mark a blessing properly. | Open | **Launch** | At Peace | `difficulties-and-happiness` (gratitude); praises-of-allah | Standard |
| At Peace | `feeling-at-peace` | For when things feel settled, and you want that to last. | Open | **Launch** | Grateful; Hopeful | Names of Allah; istighfar as maintenance | Standard. Aliases: `content`, `satisfied`, `peaceful` |
| Hopeful | `feeling-hopeful` | For when you're looking forward to something. | Open | **Launch** | At Peace; Facing a Difficult Decision | Praises of Allah; duʿās of provision and ease | Standard. Aliases: `confident`, `determined`, `anticipation` |

`mydailyduas.com`'s "Love," "Curious," "Desire," and "Aroused" labels were reviewed and deliberately not added: "Love" is ambiguous between devotional and romantic register and needs its own scoping decision rather than a rushed launch tile; "Curious"/"Desire" lack a clear, sufficient Islamic-remembrance content base to support a full page; "Aroused" is out of register for this product entirely and its presence on the reference site is treated as evidence of that site's own unfiltered breadth, not as a category to emulate.

### Family F — When Facing Change or Difficulty (`facing-change-or-difficulty`)

| Label | Slug | Description | Tone | Launch | Related | Content types | Safeguarding |
|---|---|---|---|---|---|---|---|
| Facing a Difficult Decision | `facing-a-decision` | For when you don't yet know which way to go. | Transitional | **Launch** | Hopeful | `istikharah` collection | Standard. Aliases: `indecisive`, `confused`, `lost`, `uncertain` |
| Facing Illness | `facing-illness` | For when sickness — yours or a loved one's — is on your mind. | Transitional | **Launch** | Grieving a Loss; Feeling Weary | `ruqyah-and-illness` collection | Heightened — must state plainly that ruqyah is not a substitute for medical treatment; professional-support note required |
| Afraid of What Lies Ahead | `afraid-of-what-lies-ahead` | For when the future feels uncertain. | Transitional | **Launch** | Facing a Difficult Decision; Anxious or Worried | Protection-of-iman; tawakkul-themed duʿās | Standard. Aliases: `scared`, `nervous` |

### Launch summary

**17 launch states** (was 14) across **6 families**. **2 deferred pending usage/content maturity** (Feeling Let Down, Impatient). **1 deferred pending a dedicated scholarly working group** (Troubled by Doubts — architected, not excluded). **0 permanently excluded from the architecture.** No tile anywhere in this taxonomy names self-harm, suicide, or a clinical diagnosis; any matching search input is routed to §8's pathway instead of a taxonomy match (§9), unchanged.

---

## 5. Individual Feeling-Page Template

Unchanged in structure from Revision 1 — only the route and the internal parameter name (`feelingSlug`, not `emotionSlug`) have changed. Route: `/i-am-feeling/[feelingSlug]`, rendered inside the same `SectionPage` shell, `department={knowledgeLibrary}` (§2), breadcrumb three levels deep.

**1. Editorial heading** — `<h1>` is the feeling's public label exactly as written in §4, not the slug, not a generic "Results for…" pattern. Eyebrow above it: `I AM FEELING…`.

**2. Compassionate introductory copy** — `introductionEn`/`introductionDa`, 2–4 sentences, editorial voice, never clinical, never presuming the visitor's cause.

**3. Optional grounding moment** — `groundingMomentEn`/`Da`, optional, a single short instruction requiring no reading beyond the page itself. Omitted entirely (not rendered as an empty section) when not authored.

**4. Featured duʿā(s)** — one or more `duaDhikrEntry` documents referenced by this `feelingState` (§6 `featuredEntries`), rendered with the **existing, unmodified** `DuaDhikrEntryCard` component. No new card component reimplements Arabic display, translation reveal, memorise mode, or citation rendering — including for any entry originally identified via the owner-approved reference sites (§7.1): by the time it reaches this page it is an ordinary, independently-sourced `duaDhikrEntry`, indistinguishable in rendering or governance from any other.

**5–9. Arabic text, transliteration, English translation, Danish translation, source and authenticity information** — all rendered by the existing `DuaDhikrEntryCard`/`ArabicText` components, unchanged.

**10. Qurʾānic verse or hadith** — covered by #4–9; a featured entry may itself be a Qurʾānic duʿā.

**11. Gentle reflection** — `reflectionEn`/`Da`, the feeling page's own editorial field, kept separate from the entry's own `explanationText` so the same entry can carry a different reflection on each feeling page that features it.

**12. Practical next step** — `practicalNextStepEn`/`Da`, one concrete, small, achievable action. Never a multi-step programme, never framed as a guarantee of resolution.

**13. Related feeling states** — `relatedFeelingStates` references, rendered via a compact `FeelingCard` variant.

**14. Related Duʿā & Dhikr collections** — the featured entries' own `collections` references, surfaced as "Explore the full [Collection Name] collection →" links into `/knowledge-library/dua-dhikr/[collectionSlug]`.

**15. Bookmarks / local progress** — not included at launch; reuse `DuaDhikrEntryCard`'s existing local-storage-only learning-state toggle rather than inventing a second mechanism.

**16. Professional-help notice** — appears on every `safeguardingLevel: "heightened"` feeling page, drawn from a shared, reviewed message pool (§7).

### Non-guarantee rule (applies to every field above)

No copy anywhere on this template may state or imply that reciting the featured duʿā will remove the feeling, cure an illness, or resolve the situation. This applies identically regardless of whether the underlying entry was originally discovered via the owner-approved reference sites or sourced independently — the non-guarantee rule is a content-governance rule, not a provenance-dependent one.

---

## 6. Sanity CMS Architecture

### Design principle

Unchanged from Revision 1: two new document types, `feelingFamily` and `feelingState`. Neither stores religious text. `feelingState` references existing `duaDhikrEntry` and `duaDhikrCollection` documents; it never duplicates `arabicText`, `translationEn/Da`, `sourceReferences`, or any field already governed by the Duʿā & Dhikr publication gate — including for content whose *discovery lead* came from an owner-approved reference site (§7.1). Once mapped and independently verified, it is an ordinary `duaDhikrEntry`.

**Reused verbatim, no new fields:** `duaDhikrEntry`, `duaDhikrCollection`, `sourceReference` object, `boardApproval` object (including its existing `"clinical"` board value), `seo` object, `provenanceNote` object — the last of these now doing double duty for this feature: any `duaDhikrEntry` created as a result of reference-site-led discovery records that lineage in its existing `contentProvenance` field (§7.1's workflow), not in a new field.

### `feelingFamily`

New file: `src/sanity/schemas/documents/feeling/feeling-family.ts`. Unchanged from Revision 1 (see that revision's field table) — `internalTitle`, `titleEn`/`titleDa`, `slug` (constrained to canonical family slugs from `src/lib/feeling/taxonomy.ts`), `descriptionEn`/`Da`, `order`.

### `feelingState`

New file: `src/sanity/schemas/documents/feeling/feeling-state.ts`. Field table unchanged from Revision 1 in structure; the canonical slug list it validates against now includes the 17 launch states plus the 3 deferred states from §4 (all present in `src/lib/feeling/taxonomy.ts` so the architecture is complete even where `launchStatus` keeps a route from being generated):

| Field | Type | Notes |
|---|---|---|
| `internalTitle` | string, required, max 96 | Studio-only |
| `labelEn` | string, required, max 60 | Public heading |
| `labelDa` | string, max 60 | Required-when-published |
| `slug` | slug, source `labelEn` | Constrained to `CANONICAL_FEELING_STATE_SLUGS` |
| `family` | reference → `feelingFamily`, required | |
| `oneLineDescriptionEn` / `Da` | string, max 140 | |
| `tone` | enum: `heavy`/`unsettled`/`intense`/`distant`/`open`/`transitional` | |
| `launchStatus` | enum: `launch`/`deferred`/`not-suitable`, required | `deferred` now explicitly means "architected, not excluded" (§4) — Studio field description updated accordingly. `not-suitable` reserved for content that should never become a public tile at all (crisis terms), not for content that merely needs more review time. |
| `safeguardingLevel` | enum: `standard`/`heightened`/`crisis-adjacent`, required, initial `standard` | |
| `featuredEntries` | array of `{ entry: reference → duaDhikrEntry, reflectionEn: text, reflectionDa: text }`, min 1 | |
| `relatedFeelingStates` | array of reference → `feelingState` | |
| `relatedCollectionsOverride` | array of reference → `duaDhikrCollection`, optional | |
| `introductionEn` / `Da` | text, rows 4 | |
| `groundingMomentEn` / `Da` | text, rows 2, optional | |
| `practicalNextStepEn` / `Da` | text, rows 2 | |
| `professionalSupportNoteEn` / `Da` | text, rows 3 | Required when `safeguardingLevel != "standard"` |
| `featuredOrder` | number, optional | |
| `seo` | `seo` object | |
| `reviewStatus` | enum: `sourced`→`editorial-review`→`approved`→`published`, required, initial `sourced` | |
| `boardApprovals` | array of `boardApproval` | `heightened`+ requires an approved `"clinical"` approval; `troubled-by-doubts` specifically also requires its dedicated scholarly-working-group sign-off recorded as a `"scholarly"` approval with a note referencing that review, before `boardApprovals`-based gating alone would otherwise allow it to publish |
| `lastReviewedAt` | date | |

### Publication gate

`src/sanity/lib/feeling-publication-gate.ts`, independent of `dua-dhikr-publication-gate.ts`, unchanged in mechanism from Revision 1:

```ts
export const FEELING_STATE_ELIGIBILITY_GROQ = `
  reviewStatus == "published"
  && launchStatus == "launch"
  && length(labelEn) > 0
  && length(introductionEn) > 0
  && length(practicalNextStepEn) > 0
  && count(featuredEntries) > 0
  && (
    safeguardingLevel == "standard"
    || (
      length(professionalSupportNoteEn) > 0
      && count(boardApprovals[board == "clinical" && approved == true]) > 0
    )
  )
`.trim();
```

`launchStatus == "launch"` in the gate means `troubled-by-doubts`, `feeling-disappointed`, and `feeling-impatient` cannot pass this gate and get a live route regardless of any other field state — the deferral is enforced structurally, not just by convention. Danish eligibility mirrors this with the `Da` fields substituted, no silent fallback, unchanged from Revision 1.

**Each `featuredEntries[].entry` still independently passes `isDuaDhikrEntryPubliclyEligibleForLocale`** before rendering — unchanged. A `feelingState` with zero currently-eligible featured entries renders its structural shell with the featured-duʿā section quietly omitted.

**Crisis-adjacent gate:** unchanged — no launch state uses it; documented placeholder only, requiring `"standards-council"` approval alongside `"clinical"` if ever used.

### Studio structure

Unchanged from Revision 1 — new top-level Studio list item "I am feeling…" with `Families`/`Feeling States` sub-lists, sibling to the Duʿā & Dhikr block in `src/sanity/structure/index.ts`.

---

## 7. Content Governance

### 7.1 Reference-source policy — the distinction that matters

This subsection exists specifically to resolve, in writing and without further back-and-forth, exactly what "owner-approved reference source" permits and what it does not. It is written to be actionable directly by an editor or by Cursor with no further approval round-trip required for ordinary use.

**Approved without case-by-case sign-off — idea-level use:**
- Using either reference site's category list as a checklist when reviewing taxonomy coverage (§4 already reflects this exercise having been done for `mydailyduas.com`; do the same for `islamestic.com` when it becomes accessible).
- Treating "this site associates feeling X with a duʿā theme Y" as a lead worth investigating — e.g. "their anxious/worried category features a duʿā from Surah al-Baqarah" is a pointer to go verify, not a citation to reproduce.
- General structural inspiration at the level of "a feeling-to-remembrance discovery pattern is a good idea" — already established as in-scope in the original brief and unchanged here.

**Not approved, regardless of the owner's content-direction approval — expression-level use:**
- Copying either site's specific English translation wording verbatim into any `duaDhikrEntry.translationEn`/`Da` field.
- Copying either site's specific transliteration spelling/rendering verbatim.
- Copying either site's written virtue claims, explanations, or editorial framing verbatim or near-verbatim.
- Treating either site's displayed source citation as sufficient sourcing on its own, without independent verification against the site's existing approved sources.

**Why this line is held even under a broad approval, resolved conservatively rather than asked about:** two independent reasons, either alone sufficient.

1. **Copyright.** A specific translation of a duʿā, a specific transliteration rendering, and a specific piece of explanatory editorial writing are each that website's own creative expression, not the underlying religious text itself (which is not anyone's property). "The project owner approves using this" does not create a licence from the actual copyright holder — the two reference sites — to reproduce their expression in a commercial product. This is true regardless of internal approval, and is the kind of legal-exposure question this specification resolves conservatively by design rather than by escalating.
2. **The codebase's own existing standard.** `docs/dua-dhikr/SOURCE_POLICY.md` already establishes exactly this distinction for a structurally identical situation: it names `lifewithallah.com` as a site "consulted only as a UX/information-architecture reference for this project… never as a source for any religious claim," with the explicit rule that "no text, translation, virtue, or reference from it appears anywhere in this codebase," and separately lists "unsourced duʿa compilation websites" among sources that are "never used as evidence." `mydailyduas.com` and `islamestic.com` are, structurally, exactly this category of site relative to this codebase's own governance — general-audience compilation sites, not primary or scholarly sources. Treating them as content sources for this feature while the rest of the library holds the line against exactly that would create an inconsistent, weaker standard for one corner of the site, undermining the source-integrity discipline the whole Duʿā & Dhikr product is built on.

**The compliant workflow this produces — and why it does not block content population:**

1. Editorial reviews the reference sites' feeling categories and duʿā *themes* (approved, freely, no per-item sign-off) to build a discovery worklist: "for 'Facing Illness,' both sites point toward ruqyah-related duʿās; for 'Grateful,' toward gratitude duʿās from Surah Ibrahim," etc.
2. For each item on that worklist, editorial performs the reuse-first search required by §7.4 below against the existing `duaDhikrEntry` library. In most cases, given the library's existing breadth, a matching or closely related entry already exists and can be referenced directly — no new content, no sourcing question at all.
3. Where no equivalent entry exists, editorial sources the Arabic text, translation, transliteration, and authenticity grading independently, through the site's existing, unchanged Source Policy (`quran.com`, `sunnah.com`, `usul.ai`, in that priority order) — using the reference site's *theme pointer* to know what to look for, never its displayed text as the thing typed in. This is the same amount of editorial work the Duʿā & Dhikr library's existing content already required; the reference sites simply make the discovery/triage step faster, which is exactly the efficiency the owner's approval is intended to unlock.
4. The resulting `duaDhikrEntry` carries a `contentProvenance` note recording, plainly, that its discovery lead came from one of the two approved reference sites and was independently verified against the listed primary source — an honest, auditable record, not a hidden dependency.

This workflow does not require stopping to ask the owner about any individual duʿā, translation, or transliteration — consistent with the owner's explicit instruction — because the gate that matters (independent source verification) was already the existing, unchanged standard for every piece of content in this library, reference-site-inspired or not. Nothing about this revision slows content population relative to Revision 1; it removes an ambiguity, it does not add a new approval queue.

### 7.2 Compassionate-label rule

Unchanged from Revision 1, with the taxonomy comparison in §4 now serving as direct supporting evidence rather than a hypothetical:

- "Hypocritical" / nifāq language → **"Struggling with Sincerity."** (`mydailyduas.com` uses "Hypocritical" as a bare tile label — direct confirmation this reframing is necessary, not overcautious.)
- "Jealous" → **"Struggling with Envy."**
- "Guilty"/condemning framing → **"Weighed Down by Guilt or Regret,"** framed as relief-oriented, never scolding.
- "Depressed" (as a public tile label) → not used at launch; if ever added, only after clinical review, framed as "Struggling with Low Mood."
- "Suicidal," "self-harm," or any crisis term → **never a tile.** Routes to §8 only. (Direct confirmation this separation matters: `mydailyduas.com` presents "Suicidal" as one ordinary tile among fifty; this specification's entire safeguarding design (§8) exists precisely to not repeat that.)

Test for every label and every introduction: read it aloud as if said to a friend — if it would sound like a rebuke, rewrite it.

### 7.3 Design-copying prohibition

Explicit, standalone rule, unchanged in substance from the original brief and restated here per the owner's direction that it survive alongside the new content-sourcing permission: owner approval of the two sites as content-discovery references does **not** extend to their visual design, layout, page structure, branding, icons, or graphic assets. This feature's visual system is specified in full in §10 and is drawn exclusively from the existing Sunnah Remedies design tokens and components — nothing about §7.1's content permission changes §10 in any way.

### 7.4 Reuse-first religious-content policy

Before creating any new `duaDhikrEntry`:

1. Search the existing Sanity Duʿā & Dhikr content (by collection, by `occasion`/`searchAliases` tags, by free-text search across `titleEn`/`translationEn`) for an equivalent entry.
2. Determine whether the same duʿā or dhikr already exists, even under different framing or a different collection.
3. If it exists, reference it directly via `featuredEntries` — do not create a near-duplicate.
4. If it exists but needs enrichment or correction (e.g. a missing `occasion` tag that would help it surface for this feeling), route that change through the existing editorial workflow on the entry itself, governed by the existing Duʿā & Dhikr publication gate — never by forking a second copy.
5. Create a new entry only where no equivalent approved entry exists, following §7.1's workflow above.

A single approved `duaDhikrEntry` may be referenced by several `feelingState` documents, several `duaDhikrCollection`s, and several related-content pathways simultaneously — this is the intended, normal case, not an edge case to guard against. Corrections propagate from the one authoritative entry to everywhere it is referenced, automatically.

### 7.5 Production-integrity checks — distinct from owner/editorial approval

For any content whose discovery lead came from the two reference sites (or any bulk-import/mapping exercise), the following are **mechanical integrity checks performed once, at ingestion, by whoever is entering the content** — not a second owner-approval gate, not a subjective-wording review, and not something Cursor or an editor should treat as blocking on further sign-off once satisfied:

- The Arabic text and the translation being paired genuinely belong to the same duʿā (no cross-matched pairing from handling multiple items at once).
- No accidental truncation (a translation or Arabic string that plausibly continues past a sentence boundary should be checked against the primary source, not assumed complete).
- No duplicated phrases (a common copy-paste artefact when moving between fields).
- Correct text direction preserved (`arabicText` renders RTL; no directionality-control characters accidentally carried over from a source page's markup).
- Transliteration stored in `transliteration`, never accidentally placed in `translationEn`/`Da` or vice versa.
- Source information is not mismatched (a `sourceReference` genuinely describes the entry it's attached to, not a neighbouring item from a source page's list).
- No website-navigation text, cookie-banner copy, advertisement text, or unrelated page chrome accidentally captured alongside the intended content during extraction.
- No obvious typographical or extraction artefacts (stray HTML entities, broken diacritics, mid-word line breaks).
- Formatting conforms to the existing Sunnah Remedies `duaDhikrEntry` schema exactly (field lengths, tag formatting, no markdown/HTML leaking into plain-text fields).

These checks are a normal, one-time QA pass — the kind any content-import process needs regardless of source — not a reason to reopen already-approved content for subjective wording debate, and not a gate that should block population for extended periods. They sit alongside, and do not replace, the existing scholarly/editorial board-approval workflow already required before any `duaDhikrEntry` reaches `published` (§6, and `docs/dua-dhikr/REVIEW_BYPASS.md` for the existing pathways).

### 7.6 Everything else — unchanged from Revision 1

Qurʾān/hadith sourcing, authenticity grading, Arabic accuracy, and no-fabricated-virtue/no-promise-of-cure rules are all inherited entirely from the featured `duaDhikrEntry` and the site's existing Source Policy — untouched by this revision. English/Danish parity remains enforced structurally by the publication gate (§6), not by editorial discipline alone. Scholarly review remains required for which entries are featured on which feeling page and for any doctrinally-sensitive reflection copy, recorded via the existing `boardApproval` object. Versioning/correction discipline (`lastReviewedAt`) is unchanged. The anti-gaming rule on `featuredOrder` (never set by click-through data or seasonal traffic-chasing) is unchanged.

---

## 8. Safeguarding and Crisis Experience

### Design principle

Unchanged from Revision 1: the pathway is a **quiet exit**, never a category, never selectable from the feeling grid, never a `feelingState` document. It is reached only via the permanent, calmly-worded entry points below.

### Entry points

Unchanged from Revision 1: the permanent footer-area notice (§3.7), the mandatory professional-support note on every `heightened` feeling page (§5 #16), and the search-input crisis-keyword interception (§9).

### Wording

Entry-point link text: **"See urgent support."**

### `/i-am-feeling/urgent-support` page content

Content requirements unchanged in substance from Revision 1 — heading, opening non-substitute statement, UK-default emergency block (999 / NHS 111), UK-default crisis-line block (Samaritans 116 123, Shout to 85258), an optional faith-specific option only if independently verified and appropriately licensed at time of writing, a "contact a trusted person" block, a repeated non-replacement statement, and a static "outside the UK" link — see Revision 1's full copy draft, unchanged, reproduced in this document's git history and available on request; not duplicated here a second time to avoid two slightly-diverging copies of the same safety-critical text existing in this file.

### Verification and staleness — new, per the owner's direction

This is the one place in this revision where a genuinely new mechanism is added, because the owner's instructions raise the bar here specifically:

- Every phone number, text short-code, and named organisation on the urgent-support page must be checked against a current official source **immediately before production publication** — not verified once at spec-writing time and assumed still correct at launch.
- The date of that verification must be recorded, in-repo, as a `crisisInfoVerifiedAt` value (a simple constant or CMS field — implementation detail for Phase 5) — not merely asserted in a commit message.
- **Stale or unverified crisis information blocks release.** Define staleness conservatively: verification older than 90 days at the time of any production deploy that touches this route, or any deploy at all if no verification has ever been recorded, must fail a release check (a CI assertion or a manual go/no-go item in the Phase 10 checklist — implementation detail, either is acceptable, but it must be a checked gate, not a documented intention).
- The page must state plainly, in its own text, that the website cannot provide emergency assistance itself and exists only to point toward services that can.
- Spiritual guidance on this page or anywhere this feature links from must never be framed as replacing urgent professional help — this is already the rule throughout §3.7/§5/§8; restated here because it is the single most important sentence in this entire specification.
- **The two owner-approved reference sites must never be used as a source for this page's content.** They were approved for duʿā/taxonomy discovery only (§7.1); emergency and clinical information has its own, separate, higher verification bar (official service websites, e.g. samaritans.org, nhs.uk, and equivalents) and is explicitly out of scope for anything the reference-source approval covers.

### Governance requirements before launch

Unchanged from Revision 1: legal/compliance sign-off on final wording; a named clinical/safeguarding reviewer performing the verification above; `robots: { index: false, follow: false }`; no A/B testing, no personalisation, no analytics event beyond a simple non-identifying page-view count (§14).

---

## 9. Search and Discovery Behaviour

Unchanged from Revision 1 in mechanism; taxonomy references updated to the revised §4 state list and the `feelingSlug` naming.

**Core input:** matched against `feelingState.labelEn/Da`, `oneLineDescriptionEn/Da`, and `searchAliases` (the alias lists now expanded per §4's revision — e.g. `feeling-anxious` carries `worried`, `nervous`, `insecure`, `on edge`, `uneasy`; `struggling-with-sincerity` carries `hypocrite`/`hypocrisy` so a visitor typing the very word the taxonomy avoids as a public label is still routed compassionately).

**Synonyms:** resolved via `resolveFeelingSlug(term)` in `src/lib/feeling/taxonomy.ts`, mirroring `resolveCollectionSlug`.

**Typo tolerance, crisis-keyword interception, related-feeling suggestions, keyboard behaviour, zero-results state, no multiple-selection, no filtering beyond family grouping, progressive disclosure, analytics events, privacy-respecting implementation:** all unchanged from Revision 1 — see that revision's full detail, reproduced in file history. One addition: the `troubled-by-doubts` alias set (`doubtful`, `waswas`, `uncertain about faith`, etc.) resolves to that state's page once it has a route; until then (while `launchStatus: "deferred"`), a search match against those aliases should resolve to the nearest published neighbour — "Distant from Allah" — with a quiet, honest note rather than a dead end: *"We're still developing dedicated guidance for this — here's a related starting point."* This is a deliberate UX decision to avoid a zero-results dead end on a sensitive query while the dedicated page is still in scholarly review, and must not overstate what the neighbouring page actually covers.

---

## 10. Design System Specification

Unchanged from Revision 1 in every token, component-reuse rule, and anti-pattern. Restated in brief: Deep Emerald `#0E3B2E` / Antique Gold `#C7A25A` / Warm Ivory `#F6F3EE` brand triad; live styling from `src/app/globals.css` CSS custom properties (`--paper`, `--ink`, `--sage`/`--sage-deep`, `--brass`/`--gilt`, `--radius: 2px`, 8px-base spacing scale); existing `DuaDhikrEntryCard`, `ArabicText`, `IsnadRule`, `SectionPage` components reused unmodified; no rounded corners, no gradients, no per-feeling colour-coding, no coloured "alert" styling anywhere including the urgent-support page; full dark-mode inheritance via the existing `[data-theme="dark"]` block; reduced-motion support via the existing media query.

The design-copying prohibition (§7.3) applies here with full force: nothing about either reference site's visual system, iconography, or layout informs this section in any way, at any point in implementation.

---

## 11. Homepage Integration

Mechanism unchanged from Revision 1 — the existing `homepageHighlight` document type and `HomepageLatestAdditions`/`LatestAdditionsRail` pipeline, no new component. **Destination path corrected:**

- **`destinationType`:** `pathname`; **`pathname`:** `/i-am-feeling` (was `/knowledge-library/i-am-feeling`).

All other recommended field values (`eyebrow`: `NEW IN THE KNOWLEDGE LIBRARY`; `title`: `How are you feeling?`; `summary`; `contentArea`: `knowledge-library`; `ctaLabel`; image/`visualTheme` guidance; `showNewMarker`/`pinned`/`priority` editorial judgement) are unchanged from Revision 1.

The optional `visualTheme` enum addition (`"feeling"`) remains optional and unchanged. The recommendation against a second, separate homepage entry point beyond the nav + Latest Additions pattern (§2, §11) is unchanged.

---

## 12. SEO and Social Sharing

Unchanged in mechanism from Revision 1; paths corrected throughout.

**Metadata:** `pageMetadata("iAmFeeling", "/i-am-feeling")` for the landing page; feeling pages source `title`/`description` from the `feelingState`'s own `seo` object when present, falling back to a generated pattern using `/i-am-feeling/[feelingSlug]`.

**Title pattern:** Landing — `I am feeling… | Sunnah Remedies Knowledge Library`. Feeling page — `{labelEn} | I am feeling… | Sunnah Remedies`.

**Canonical strategy:** `localeUrl(locale, "/i-am-feeling")` / `localeUrl(locale, "/i-am-feeling/[feelingSlug]")`, `/` for English, `/dk` for Danish, `x-default` → English.

**Redirect/indexing rule, new:** `/knowledge-library/i-am-feeling(/*)` issues a 301 to the corresponding `/i-am-feeling(/*)` path (§2) and is never itself indexable or crawlable as a separate page — search engines should only ever discover and index the canonical top-level route. No `noIndex` tag is needed on the old path since it never renders a page to tag; the redirect itself is the indexing control.

**Schema markup, internal-linking strategy, image-sharing/Open Graph, clinically-sensitive-phrase avoidance, English/Danish SEO parity:** all unchanged in substance from Revision 1 — see that revision's detail for the full reasoning (no medical/clinical structured data; no per-feeling stock imagery; no clinical terms in indexable titles/descriptions).

---

## 13. Accessibility

Unchanged from Revision 1 in every requirement — WCAG 2.1 AA target, semantic heading structure, screen-reader labelling, colour contrast on both themes, full keyboard navigation, `ArabicText`'s existing RTL handling (now verified in its first out-of-context usage, per Phase 4), `prefers-reduced-motion` support, 44×44px minimum touch targets (with the urgent-support page's larger targets remaining a deliberate exception), `aria-live` search announcements, and the family-grouping/featured-subset design choice as a cognitive-load accessibility measure, not merely a visual one. See `docs/i-am-feeling/ACCESSIBILITY_CHECKLIST.md` (Phase 8) for the itemised checklist, unchanged in scope by this revision.

---

## 14. Analytics and Privacy

Unchanged from Revision 1 — same GTM/Clarity pipeline, same event list (`feeling_select`, `feeling_search`, `feeling_search_zero_result`, `feeling_related_open`, `feeling_entry_expand`, `feeling_urgent_support_open`), same hard prohibitions (no raw query-string capture, no cross-session emotional-history profiling, no per-visitor traceability into the urgent-support page, search-input masking in session-replay tooling). None of this revision's changes alter the privacy posture of the feature.

---

## 15. Technical Implementation Plan

Phased for Cursor, paths corrected throughout to the top-level route. Each phase should be completed, self-verified against its acceptance criteria, and reported before moving to the next.

### Phase 0 — Audit current architecture
**Objective:** Confirm this specification's factual claims still match the working tree at implementation time, including the corrected route, the `feelingSlug` naming, and the reference-source policy in §7.1.
**Acceptance criteria:** written confirmation (or list of discrepancies) before Phase 1 begins.

### Phase 1 — Schemas and content model
**Objective:** Ship `feelingFamily`, `feelingState` (with the revised 17-launch/3-deferred taxonomy from §4 encoded in `src/lib/feeling/taxonomy.ts`), the publication gate, and Studio registration.
**Files:** unchanged from Revision 1's Phase 1 file list — `src/sanity/schemas/documents/feeling/feeling-family.ts`, `feeling-state.ts`; `src/sanity/schemas/index.ts`; `src/lib/feeling/taxonomy.ts`; `src/sanity/lib/feeling-publication-gate.ts`; `src/sanity/structure/index.ts`; `src/sanity/validation/governance.ts` additions.
**Acceptance criteria:** unchanged, plus: the gate correctly excludes `troubled-by-doubts`/`feeling-disappointed`/`feeling-impatient` from eligibility regardless of `reviewStatus` while `launchStatus != "launch"`.

### Phase 2 — Public queries and data layer
**Objective, files, dependencies, acceptance criteria, tests, risks:** unchanged from Revision 1.

### Phase 3 — Landing page and route correction
**Objective:** `/i-am-feeling` built per §3, at the corrected top-level path, plus the redirect configuration from §2.
**Files:** `src/app/[locale]/i-am-feeling/page.tsx` (note: **not** nested under `knowledge-library/`); `.../i-am-feeling.css`; `src/components/feeling/FeelingSearch.tsx`, `FeelingCard.tsx`, `FeelingFamilySection.tsx`; `src/lib/navigation/site-structure.ts` (nav entry **and** the `getDepartmentByPath` addition, §2); `next.config.ts` (the two redirect entries, §2); `src/messages/en.json`/`da.json`.
**Acceptance criteria:** page renders at `/i-am-feeling` correctly; `/knowledge-library/i-am-feeling` returns a 301 to `/i-am-feeling` (both locale variants); breadcrumb and masthead department styling correctly resolve to Knowledge Library despite the non-nested URL; nav link present.
**Tests:** route smoke test at the new path; explicit redirect test for the old path (both locales); empty-state test; search-interaction test; accessibility test.
**Risks:** forgetting the `getDepartmentByPath` addition, causing a silent breadcrumb/masthead regression only visible on direct navigation to the new URL rather than via in-site links.

### Phase 4 — Feeling detail pages
**Objective:** `/i-am-feeling/[feelingSlug]` built per §5, statically generated for all `launch`-status taxonomy slugs (17 at launch).
**Files:** `src/app/[locale]/i-am-feeling/[feelingSlug]/page.tsx`.
**Acceptance criteria, tests, risks:** unchanged in substance from Revision 1, path-corrected; additionally confirm `ArabicText`'s RTL handling renders correctly in this new hosting context (first use outside `dua-dhikr`'s own collection-page tree).

### Phase 5 — Safeguarding pathway
**Objective:** `/i-am-feeling/urgent-support` per §8, including the new verification-date/staleness mechanism.
**Files:** `.../urgent-support/page.tsx`; `src/components/feeling/UrgentSupportNotice.tsx`; `src/lib/feeling/crisis-terms.ts`; a `crisisInfoVerifiedAt` constant or CMS field plus the staleness-check mechanism (implementation detail: a CI assertion or an explicit manual gate in Phase 10).
**Acceptance criteria:** unchanged from Revision 1, plus: verification date is recorded and checked; a build/deploy fails or is manually blocked if verification is stale or absent at release time.
**Risks:** unchanged — the single highest-risk phase in this plan. **Do not mark this phase complete on code-compiles-and-tests-pass alone.**

### Phase 6 — Localisation
**Objective, files, dependencies, acceptance criteria, tests, risks:** unchanged from Revision 1, path-corrected.

### Phase 7 — Homepage and cross-link integration
**Objective:** §11's homepage highlight (path-corrected to `/i-am-feeling`) **plus** the additional cross-links specified in §2: a link from `/knowledge-library` and a reciprocal link from `/knowledge-library/dua-dhikr`.
**Files:** possibly `src/sanity/schemas/documents/pages/homepage-highlight.ts` (optional `visualTheme` addition); `src/app/[locale]/knowledge-library/page.tsx` (new cross-link); `src/app/[locale]/knowledge-library/dua-dhikr/page.tsx` (new reciprocal callout, §3.6's mirror).
**Acceptance criteria:** all three link placements present and correctly targeting `/i-am-feeling`.

### Phase 8 — Tests and accessibility
**Objective, files, dependencies, acceptance criteria:** unchanged from Revision 1, plus redirect and staleness-gate test coverage.

### Phase 9 — Editorial population
**Objective:** Real content authored for the 17 launch states, following §7's revised governance in full, using the §7.1 discovery-then-verify workflow where reference-site leads are used.
**Files:** content only; optionally `src/sanity/components/feeling/FeelingReadinessPanel.tsx`.
**Acceptance criteria:** all 17 launch states reach `published` with full board approvals per their `safeguardingLevel`; every entry sourced via §7.1's workflow carries an honest `contentProvenance` note; zero states published with placeholder or fixture copy; `troubled-by-doubts` explicitly remains unpublished pending its dedicated scholarly working group, and this is not treated as a launch blocker for the other 17.
**Risks:** unchanged — launch pressure to rush review must be resisted.

### Phase 10 — Production verification
**Objective, acceptance criteria:** §17 in full, including the crisis-info staleness gate.

---

## 16. Test Plan

Unchanged from Revision 1 in category and depth, with additions:

- **Redirect tests (new):** `/knowledge-library/i-am-feeling` and `/knowledge-library/i-am-feeling/[feelingSlug]` both 301 to the corresponding `/i-am-feeling` path, in both locales, and neither old path renders any page content directly.
- **Taxonomy-gate tests (updated):** all 17 launch states individually pass the eligibility gate under correct conditions; `troubled-by-doubts`, `feeling-disappointed`, and `feeling-impatient` are confirmed unreachable via `generateStaticParams` regardless of their document's `reviewStatus`.
- **Content-provenance tests (new):** a `duaDhikrEntry` fixture with a populated `contentProvenance` referencing reference-site-led discovery renders identically to one without — provenance must never leak into or alter public rendering.
- **Crisis-info staleness test (new):** a build/CI check (or documented manual Phase 10 gate) that fails when `crisisInfoVerifiedAt` is absent or older than the defined threshold.
- All other categories (unit, schema validation, GROQ, locale, mobile, keyboard, no-JS, crisis-pathway keyword interception, publication-gate, content-reference, visual regression, production-mode) unchanged from Revision 1 — see that revision's full detail, path-corrected.

---

## 17. Definition of Done

Unchanged from Revision 1's 16-item checklist, with the following corrections/additions:

1–8. Unchanged in substance — dev server; every route in §2's corrected table visited; visual confirmation against §3/§5/§8; English and Danish route trees at the corrected `/i-am-feeling` paths; mobile and desktop; every link (including the two new cross-links from Phase 7, and both directions of the `/knowledge-library/i-am-feeling` → `/i-am-feeling` redirect); CMS content in Studio; empty/error states including a 404 check for `troubled-by-doubts`/deferred slugs.
9–13. Unchanged — typecheck, lint, full test suite, production build, production-mode verification.
14. **New:** crisis-info verification date confirmed present and within the staleness threshold (§8) before this feature is considered release-ready — checked explicitly, not inferred.
15. If any item fails, continue fixing and re-verifying — do not report completion with a known-failing item deferred silently.
16. Do not report success merely because the code compiled or tests passed — every item requires an actual observed check.
17. Do not commit, push, merge, or deploy any part of this work without explicit user approval — unchanged, applies with particular weight to Phase 5/item 14 above.

---

## 18. Cursor Handoff Prompt — Revised

Paste the block below into Cursor together with this specification document (`docs/i-am-feeling/SPEC.md`, Revision 2). This replaces the Revision 1 prompt in full.

```
You are implementing the "I am feeling…" feature for the Sunnah Remedies
website, specified in full in docs/i-am-feeling/SPEC.md (Revision 2). Read
that entire document before writing any code — it is the source of truth
for every route, schema field, copy string, and governance rule below.
This message is a supplement to it, not a replacement. If anything here
conflicts with the spec document, the spec document wins — flag the
conflict and ask rather than silently picking one.

BEFORE YOU TOUCH ANYTHING

1. Confirm you are on the correct feature branch. Do not implement this on
   `main`, and do not assume the current branch is correct — ask the user
   to confirm or create the intended branch before writing code, and stay
   on it for the whole task.
2. Re-run the audit in Phase 0 of the spec: confirm current schema field
   names, route structure, navigation source-of-truth files, and design
   tokens still match what the spec describes. If anything has changed
   since the spec was written, STOP and report the discrepancy before
   proceeding.
3. Do not touch, refactor, or "clean up" any file outside this feature's
   scope. Leave unrelated in-progress work on this branch untouched.

ROUTE — THIS IS THE CORRECTED, FINAL DECISION

- Primary route: /i-am-feeling — implement at
  src/app/[locale]/i-am-feeling/page.tsx (a TOP-LEVEL segment, sibling to
  src/app/[locale]/knowledge-library/, NOT nested inside it).
- Feeling detail route: /i-am-feeling/[feelingSlug] — note the param name
  is feelingSlug, not emotionSlug.
- Add a permanent redirect from /knowledge-library/i-am-feeling and
  /knowledge-library/i-am-feeling/:feelingSlug to the corresponding
  /i-am-feeling path, in next.config.ts, mirroring the existing
  /knowledge-library/dhikr → /knowledge-library/dua-dhikr redirect
  pattern exactly, including correct behaviour under both the /dk and
  unprefixed-English locale conventions. Never create a renderable page
  at the old, superseded path — redirect only, so there is exactly one
  canonical, indexable route per piece of content.
- The feature is still conceptually part of the Knowledge Library
  (breadcrumb reads "Knowledge Library → I am feeling…", department
  styling matches) even though its URL is top-level — pass
  department={knowledgeLibrary} explicitly to SectionPage, and add
  `if (path.startsWith("/i-am-feeling")) return knowledgeLibrary;` to
  getDepartmentByPath in src/lib/navigation/site-structure.ts.
- Link the feature from: primary navigation, the Knowledge Library
  landing page, the Duʿā & Dhikr library landing page (a reciprocal
  callout), and the homepage's existing Latest Additions mechanism. Do
  not build a second, separate homepage module for this beyond that.

CORE RULES, NON-NEGOTIABLE

- Reuse, never duplicate, the existing Duʿā & Dhikr architecture. New
  feelingFamily/feelingState Sanity documents REFERENCE existing
  duaDhikrEntry/duaDhikrCollection documents — they never copy Arabic
  text, translations, or source references into a new field. Render
  featured duʿās with the existing, unmodified DuaDhikrEntryCard and
  ArabicText components.
- Reuse the existing publication-gate PATTERN but write a new,
  independent gate file for feelingState. Follow the length(field) > 0
  GROQ convention, not defined(field) — a previously-shipped bug in this
  exact codebase came from using defined() on long text fields; do not
  reintroduce it.
- English routes are unprefixed; Danish public routes use /dk (never /da
  publicly). Never let a Danish route silently render English editorial
  copy.

REFERENCE-SOURCE CONTENT POLICY — READ THIS CAREFULLY, IT IS DELIBERATE

The owner has approved https://mydailyduas.com/i-am-feeling/ and
https://www.islamestic.com/i-am-feeling/ as references for DISCOVERING
which feelings to cover and which duʿā THEMES are associated with which
feelings. Use them freely for this, without asking per item.

The owner's approval does NOT extend to copying either site's specific
Arabic text, translation wording, or transliteration spelling directly
into this codebase — this is a deliberate, spec-documented limit (see
spec §7.1 for the full reasoning: copyright exposure, and this
codebase's own existing Source Policy, which already treats general
duʿā-compilation websites as discovery-only, never as evidence, for
exactly this reason). Follow the compliant workflow in spec §7.1
instead:
  1. Use the reference sites to build a discovery worklist of
     feeling-to-duʿā-theme pointers.
  2. For each item, search the EXISTING duaDhikrEntry library first
     (spec §7.4) — most themes already have a matching or related entry;
     reference it, do not create a near-duplicate.
  3. Only where no equivalent entry exists, source the Arabic text,
     translation, and transliteration independently through the
     existing Source Policy (quran.com, sunnah.com, usul.ai, in that
     order) — using the reference site's theme as a pointer to what to
     look for, never typing in its displayed text directly.
  4. Record the discovery lineage honestly in the resulting entry's
     existing contentProvenance field.
This does not require asking the owner about each individual duʿā,
translation, or transliteration — the workflow above IS the approval
mechanism. It does require the mechanical production-integrity checks in
spec §7.5 (correct Arabic/translation pairing, no truncation, no
duplicated phrases, correct RTL direction, transliteration in the
correct field, source not mismatched, no page-chrome/navigation text
accidentally imported, no extraction artefacts, schema conformance) as a
normal one-time QA pass on ingestion — not a second approval queue.

Do not, under any circumstance, apply this reference-source content
policy to the urgent-support page (spec §8) — emergency/crisis contact
information must come only from official, currently-verified sources
(e.g. samaritans.org, nhs.uk), never from either reference site.

TAXONOMY

Implement the 17-launch-state, 6-family taxonomy in spec §4 exactly,
including the compassionate label choices (§7.2) and alias lists. Do not
invent additional tiles beyond what §4 specifies without asking first.
"Troubled by Doubts" is an architected but DEFERRED state — build its
schema entry, taxonomy entry, and alias resolution fully, but its
launchStatus must be "deferred" so it never gets a generateStaticParams
route or appears in the public grid at launch; do not publish it, and do
not silently drop it from the architecture either — both are spec
violations.

SAFEGUARDING (spec §8) — HIGHEST STAKES PART OF THIS FEATURE

Build /i-am-feeling/urgent-support, the professional-support notices, and
the crisis-keyword search interception per spec §8. Additionally
implement the verification-date mechanism: a recorded, dated
crisisInfoVerifiedAt value, and a release-blocking check (CI assertion or
an explicit manual Phase-10 gate — your choice, but it must actually
block, not just be documented) if that date is absent or older than 90
days at deploy time. Do NOT invent, guess, or carry over a plausible-
sounding phone number or organisation name — if you cannot get a
verified, dated confirmation from the user for the crisis contact
details, implement the page with clearly-marked placeholder values and
flag this explicitly as an unresolved blocker before this route is
considered launch-ready. This is exactly the kind of genuine production-
safety blocker that should stop you and prompt a question, unlike
ordinary implementation decisions elsewhere in this task.

DESIGN

No new visual system: reuse existing design tokens (--paper, --ink,
--sage/--sage-deep, --brass/--gilt, --radius: 2px, existing spacing/
motion tokens) exactly as spec §10 documents. No rounded corners, no
gradients, no per-feeling colour-coding, no coloured "alert" styling
anywhere, including the urgent-support page. Nothing about either
reference site's visual design, layout, or branding may inform any part
of the implementation — the content-discovery approval above does not
extend to design in any way (spec §7.3).

IMPLEMENTATION APPROACH

Work through spec §15's phases (0–10) in order. After each phase, run its
acceptance criteria and tests, start the dev server and visit the
affected route(s) in a real browser to confirm the UI matches the spec —
do not infer correctness from reading your own code — and report what was
done and verified before moving on.

If you encounter anything that conflicts with the existing dua-dhikr
architecture, the site's navigation structure, or the existing Sanity
schema in a way this spec did not anticipate, STOP and report the
conflict rather than resolving it unilaterally.

MAINTAIN THROUGHOUT

English/Danish parity (spec §2, §6, §7.6); Sunnah Remedies branding and
descriptive-not-corrective tone (spec §7.2, §10); accessibility
requirements (spec §13) as launch requirements, not a follow-up pass.

BEFORE REPORTING COMPLETION

Run through spec §17 (Definition of Done) item by item, including the new
item 14 (crisis-info verification-date check). Test both the new
/i-am-feeling routes AND confirm the /knowledge-library/i-am-feeling
redirect works correctly, in both English and Danish. Run typecheck,
lint, the full test suite, a production build, and production-mode
verification (not dev-server behaviour only). If any item fails, keep
fixing and re-verifying — do not report success on a passing compile or
passing tests alone if you have not actually observed the running
feature.

Do NOT commit, push, merge, or deploy any of this work at any point
without the user explicitly asking you to, even after all of the above
passes. Stop and hand back to the user for review once implementation and
verification are complete.
```
