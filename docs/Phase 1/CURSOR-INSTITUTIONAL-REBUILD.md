# Cursor Instruction — Sunnah Remedies Institutional Rebuild

You are rebuilding the Sunnah Remedies website into a single, coherent institutional experience. This is a **restructure and refinement of an existing codebase**, not a greenfield build. Preserve all working functionality; change structure, hierarchy, design language, and copy.

---

## 0. Before you touch anything

1. **Read every document inside `/docs`, completely, before making a single change.** `/docs` is the source of truth. Where anything in this instruction conflicts with `/docs`, `/docs` wins — surface the conflict in your notes rather than silently choosing.
2. **Map the current codebase.** List every route/page, every shared component, every layout, and every place the four areas (shop, clinic, academy, blog) are currently treated as separate things. Produce this map as `/docs/_audit/current-state.md` before editing.
3. **Do not begin editing until steps 1 and 2 are complete.** No partial work, no "I'll read the rest later."

---

## 1. The mental model — read this until it is instinctive

Sunnah Remedies is **one institution**, not four products with a shared header.

It is **not** an online shop, a clinic, an academy, or a blog. It is a single Institute of Prophetic Medicine expressed through **four interconnected pillars**. Every page must make the visitor feel they have entered *one trusted organisation*, never that they are moving between different websites.

Stop thinking in pages. Think in **institution → pillar → page**. Every page inherits its authority from the institution above it and must point outward to the other pillars beside it.

**The Four Pillars (use these names exactly):**

- **The Institute** — research, education, publications, courses, scholarship, articles, classical Islamic learning, scientific collaboration. *Feels like a university faculty. Not an online-course storefront.*
- **The Clinic** — consultations, Hijama, Prophetic Medicine, patient care, clinical governance, practitioners, documented standards, booking. *Feels like a respected private medical institution. Not a wellness spa.*
- **The Apothecary** — curated prophetic remedies, traditional botanicals, clinical-grade natural products, evidence-informed formulations, quality assurance, and the webshop. *Feels like a historic apothecary where every product was selected by an expert. Not a supplement shop.*
- **The Community** — events, conferences, retreats, public education, courses, volunteer and public-benefit initiatives, news, outreach. *Feels like an institution serving society. Not a social feed.*

---

## 2. The single-institution rules

These are the mechanics that turn four areas into one institution. Implement them structurally, not cosmetically.

- **One design system.** All four pillars share typography, colour, spacing scale, component library, navigation, imagery treatment, tone, and motion. Only **imagery and content** distinguish them. If a component exists in two variants because two pillars styled it separately, unify it.
- **One navigation model.** The primary navigation presents the institution first and the four pillars as its structure. A visitor on any page can always see how it sits inside the whole. No pillar gets its own disconnected nav.
- **Every page declares its pillar.** Each page visibly signals which pillar it belongs to (a masthead label / running head), and does so consistently across all four.
- **Cross-reference by default. Nothing exists in isolation.** Products in the Apothecary reference the Institute's research and the Clinic's practitioners. Courses in the Institute reference the Clinic. Knowledge articles reference the Apothecary where a remedy is relevant. Community connects to all three. Build these as real, structural links — related-item modules, "referenced in", "prescribed by our practitioners", "studied in module X" — not as footer link-dumps.
- **Content hierarchy test.** Every page must answer, through its layout and copy: (1) How does this serve the institution's mission? (2) Which pillar does it belong to? (3) How does it connect to the other pillars? If a page cannot answer all three, redesign its hierarchy.

---

## 3. The anti-AI mandate — the headline requirement

The finished site must show **no signs that it was designed by an AI or assembled from a template.** This is not a vibe; it is a checklist. AI-generated sites cluster around recognisable defaults. Eliminate all of them.

### 3a. The trap specific to this brand

The single most common "made by AI" look right now is: **a warm-cream background, a high-contrast serif display face, and a warm metallic/terracotta accent.** That is almost exactly this brand's palette (Warm Ivory, Cormorant/EB Garamond, Antique Gold). **Keep the brand palette** — but understand that the palette alone will *not* rescue the site from looking generic. The distinction must come from **real institutional substance**, not colour. If the emerald-and-gold execution could be swapped onto any wellness startup without anyone noticing, you have failed.

### 3b. Kill these AI/template tells wherever they appear

- Hero = big centred headline + subhead + two buttons ("Get Started" / "Learn More"). **Remove.** The hero is a thesis; open with the most characteristic thing in the institution's world (a named publication, a governance standard, a practitioner, a remedy with provenance).
- Three evenly-spaced feature cards, each with a decorative icon and identical structure. **Remove** the mechanical triptych; use editorial, asymmetric composition with real content of varying weight.
- Decorative icons/emoji standing in for meaning. Icons only where they genuinely aid navigation.
- Gradient blobs, glassmorphism, heavy drop shadows, everything rounded. **Remove.**
- Vague superlative marketing copy: "empowering," "seamless," "elevate," "unlock," "transform," "journey," "holistic wellness solution." **Rewrite** in specific, plain, institutional language.
- The "It's not just X, it's Y" construction, rhetorical-question section headers, and relentless rule-of-three lists. **Remove.**
- Fabricated social proof: star ratings, "10,000+ happy customers," fake "as seen in" logo strips, generic testimonial cards with invented names. **Remove.** Replace trust signals with *verifiable* substance (credentials, governance documents, named practitioners, dated publications, references).
- Fade-up-on-scroll applied to every element. Motion becomes an AI tell when it is everywhere. Keep it rare, purposeful, and honour `prefers-reduced-motion`.
- Mechanically perfect, uniform grids with no editorial rhythm. Real institutions have hierarchy, emphasis, and intentional asymmetry.
- Placeholder/lorem-style filler and content-free stat counters. Every number and claim must be true and sourced.

### 3c. What "not AI" looks like here — do these instead

- **Editorial, print-inspired craft.** Mastheads, running heads, considered type hierarchy, footnotes/citations, indices, real captions. Draw from the world of academic journals, private-institution reports, and historic apothecary reference books.
- **Named, dated, sourced everything.** Authors on articles. Dates on publications. Credentials on practitioners. References on therapeutic claims. Provenance on remedies. Specificity is the strongest anti-AI signal there is.
- **Restraint, spent boldly in one place.** Pick a single signature element (a masthead treatment, a citation system, a specimen-style product plate) and let everything else stay quiet and disciplined. Then remove one more thing.
- **Real photography.** The restrained design depends on it. Where real imagery is missing, flag it in your notes as a blocker — **do not** paper over it with generic stock or AI imagery, which is itself a tell.

---

## 4. Brand system (baseline — defer to `/docs` on any conflict)

- **Palette:** Deep Emerald `#0E3B2E`, Antique Gold `#C7A25A`, Warm Ivory `#F6F3EE`. Storefront variant: warm off-white `#FAF8F4`, deep charcoal `#1A1A1A`, muted olive `#6B705C`.
- **Typography:** Cormorant Garamond / EB Garamond (brand); Instrument Serif + Inter (storefront/utility). Set a real type scale with intentional weights and spacing.
- **Design principles:** quiet luxury, restraint, spaciousness, trust. Benchmarks are Aesop, Aman, Jo Malone, Muji — not faith-institutional or clinical-clip-art references.
- **Explicitly prohibited:** mosque iconography, crescents, calligraphy-as-decoration, "Islamic pattern" motifs, gold gradients, carousels, badges, and excessive animation.
- **Tagline:** *Traditional Healing · Modern Excellence.*
- **Tone:** secular-luxury and institutional, never faith-institutional and never clinical-regulated in a way that implies statutory status.

---

## 5. Voice and copy

- Write in the voice of the institution: measured, specific, confident without selling. Plain verbs, sentence case, no filler.
- Trust is earned through evidence, not adjectives. Show governance, credentials, references, and documented standards rather than claiming excellence.
- Name things by what the visitor controls and recognises. Buttons say exactly what happens ("Book a consultation," not "Get Started").
- Empty states and errors speak in the institution's voice and tell the visitor what to do next.

---

## 6. Compliance and safety — must survive every edit

These constraints travel with every page, component, and piece of copy. They are not optional and not afterthoughts.

- **Honest positioning.** The institution must not claim, or imply through design, equivalence to a statutorily regulated healthcare qualification or regulated clinical status. The Clinic should look respected and professional without implying it is an NHS/CQC-equivalent regulated body unless `/docs` documents that status.
- **ASA/CAP discipline.** Every therapeutic claim carries its evidence grade (Green / Amber / Red) and appropriate disclaimers, exactly as defined in `/docs`. No unqualified medical claims.
- **On "world's leading."** Unverifiable superlatives ("world's leading," "the best," "#1") create ASA/CAP exposure and, tellingly, real institutions rarely self-declare this way — it reads as marketing, the very thing we are removing. Prefer expressing authority through demonstrable substance (scholarship, governance, named experts, documented standards). If a leadership claim is used, it must be substantiated and sit within `/docs` guidance.
- **The two non-negotiable product-safety rules** (apply wherever the Institute/certification and Clinic training are expressed):
  1. Wet cupping competence is assessed **only** via supervised in-person assessment — never certifiable through online study alone.
  2. Logbook entries count toward certification **only** when a named supervisor has digitally signed them.
- All legal, clinical, and certification content remains subject to review by a qualified UK solicitor and a registered clinician before publication. Do not present unreviewed compliance copy as final.

---

## 7. The institutional audit — required pass

Walk **every page** of the site. For each, answer all ten questions and record the results in `/docs/_audit/institutional-audit.md`:

1. Which of the Four Pillars does this belong to?
2. Is that immediately obvious to the visitor?
3. Does this page strengthen the perception of one unified institution?
4. Does it feel like it belongs to the same organisation as every other page?
5. Does it increase trust?
6. Does it communicate authority?
7. Does it feel academic?
8. Does it feel clinically professional?
9. Does it feel timeless?
10. Does it feel AI-generated or templated?

**If the answer to any question is wrong (any "no" on 1–9, or a "yes" on 10), redesign that page's information hierarchy and user experience** — preserving functionality and following the design principles above — and re-run the ten questions until it passes. Log the before/after reasoning for each page you change.

---

## 8. Execution protocol

- Work **pillar by pillar**, then do a whole-site coherence pass. Do not scatter half-finished changes across the tree.
- **Preserve all functionality:** booking, e-commerce/checkout, auth, forms, course/logbook logic. Refactor presentation and structure, not behaviour. If a change risks behaviour, isolate and verify it.
- **Shared code lives in `lib/` or `components/`.** Never import into route-group (parenthesised) directories; relocate shared logic.
- Run the build after each pillar and fix errors before moving on. Keep commits scoped and described.
- Where you are blocked (missing real photography, unreviewed legal copy, an unresolved `/docs` conflict), stop and record it in `/docs/_audit/blockers.md` rather than inventing a workaround.
- Do not introduce new dependencies, animation libraries, or design patterns that aren't justified by this instruction or `/docs`.

---

## 9. Definition of done

- Every page passes the ten-question audit.
- The four pillars are visibly one institution: shared system, one navigation model, real cross-references, no orphan pages.
- No item from the anti-AI tell list (§3b) survives anywhere.
- All compliance and safety constraints (§6) hold on every relevant page.
- `/docs/_audit/` contains: `current-state.md`, `institutional-audit.md`, and `blockers.md`.
- A visitor leaves believing they have discovered **the digital campus of a single, trusted Institute of Prophetic Medicine** — authoritative, scholarly, clinically serious, heritage-rooted, quietly confident. Nothing feels transactional. Nothing feels like marketing. Nothing feels generated.
