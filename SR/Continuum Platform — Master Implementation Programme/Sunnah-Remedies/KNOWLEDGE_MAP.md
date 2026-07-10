# KNOWLEDGE MAP — Sunnah Remedies

The guided tour and the dependency graph in one document. (The v1 repository kept these separate; the review board merged them — see `DECISION_LOG.md` D-019.)

## Authority chain

```
00-institution/constitution/00-institution-constitution.md      ← highest authority
│
├── 00-institution/operations-handbook/      daily law of the physical institution
├── 10-brand/identity/brand-manual.md        expression law
│     └── design-system → photography → editorial → assets (SVG = logo truth)
├── 20-academy/academy-framework-v3.pdf      teaching law (every course builds on it)
│     └── blueprint → academy-standards → certification/assessment/workbook systems
│           └── courses/hijama-practitioner-programme (SRA-001)
└── 30-digital-estate/standards/             digital product law
      └── phase specifications → audits (evidence)

External authority consumed (never duplicated here):
Continuum/10-methodology (how we build) · Continuum/30-dios (platform standards, version-pinned)
```

## Folder by folder

**`00-institution/`** — the constitution (founding law), the Academy's Three Foundational Constitutions (styled edition), the fourteen-chapter Operations Handbook plus security-operations annex (welcome, mission and *adab*, people, headquarters, health & safety & safeguarding, dispensary, clinic, academy, Sacred Journeys, editorial desk, photography studio, technology, governance & escalation, quality, reference), and the IP protection system.

**`10-brand/`** — brand manual and Brand Bible; design system, 150-page Institutional Design Manual, Academy Design Bible, icon library; photography manuals; editorial style guide and editors' guide; the complete logo package (`assets/` — SVG masters are the source of truth, PNGs are generated exports).

**`20-academy/`** — Academy Framework v3.0 (definitive, every course builds upon it), Phase 1 Blueprint v2.0, Academy Standards, and the certification / assessment / workbook / presentation-design / medical-illustration systems. `courses/hijama-practitioner-programme/` holds SRA-001 complete: production package (governs all deck production), master deck, seventeen module decks, instructor guides (01, 02, 16, 17), student workbooks (01, 02, 17).

**`30-digital-estate/`** — the phased website & product programme. `standards/` binds all work: information architecture, CMS architecture, engineering standards, SEO, accessibility, product standards, Sacred Journeys, bilingual i18n guide, the institutional review checklist, and the Cursor rebuild directive. `experience/` (homepage v2, Phase 3 implementation, Institute Vision, SEO knowledge spec) · `commerce/` (13-document Phase 4 implementation, Stripe to fulfilment) · `operations/` (Phase 8 backbone & automation) · `intelligence/` (Phase 6 AI engineering, Phase 7 intelligence platform) · `community/` (Phase 9 — membership & alumni; carries the **Two Ledgers, One Standard** rule: clinical, religious, and above-threshold financial decisions are never automated) · `audits/` (Phases 2 and 6, point-in-time evidence).

**`production/`** — the command centre: PRODUCTION_BOARD (readiness scores + gaps), IMPLEMENTATION_BACKLOG, CRITICAL_PATH, NEXT_90_DAYS, LAUNCH_CHECKLIST, POST_LAUNCH_PLAN. All planning updates land here.

## Reading orders

- **Whole institution:** START_HERE → this map → constitution → brand manual → academy framework → digital-estate standards → production board.
- **Build task:** standards (all) → your phase spec → cited audits → review checklist before merge.
- **New course:** academy framework → blueprint → production package of an existing course as the pattern.
