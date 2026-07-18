# Danish Content Gap Register

**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Date:** 18 July 2026  
**Scope:** Phase 2A — audit only for body content; architectural A/C fixes applied where noted.

## Classification key

| Code | Meaning |
|------|---------|
| A | Approved Danish CMS content exists but is not selected |
| B | Danish field empty; English fallback intentional |
| C | Localisation query / projection / wiring bug |
| D | Content migration required (hardcoded → CMS or messages) |
| E | Editorial translation required |
| F | Proper name or intentionally untranslated term |

## Intentionally retained terms (F)

| Term | Rationale |
|------|-----------|
| Sunnah Remedies | Brand |
| Hijāma / Hijāma Diploma | Transliteration; DA: “Hijāma Diplom” |
| Umrah | Rite name |
| Duʿa & Dhikr | Collection name |
| Tibb al-Nabawi, isnād, bimāristān, amānah, waqf | Scholarly / Arabic terms |
| Arabic display (مكتبة العلم, Qurʾān ayah) | Source language |
| London, Aarhus, Riyadh | Place names |

## Architectural fixes applied in Phase 2A (C)

| Route | Fix |
|-------|-----|
| All departments | Extended `DEPARTMENT_SECTION_MESSAGE_KEYS` + `DepartmentNav` / `Breadcrumb` resolvers for Academy, Journeys, Knowledge, Institution |
| `/dk/knowledge-library` | `DepartmentHero.nameEn` + skip link from `nav.*` |
| `/dk/consultations` | Mobile CTA uses `booking.summary.submit` |
| Shared | Consent banner fully message-driven; locale error boundary; shared loading via `common.loading` |

## Class A

| Finding | Count |
|---------|-------|
| Approved DA CMS present but not selected on department landings | **0** (production has no `language == "da"` department landing docs for these surfaces) |

When DA CMS documents are published: use homepage pattern (`fallbackToDefault: false` for landing prose).

## Register — department landings

### `/dk/the-apothecary`

| Section | Doc / source | Field | EN (short) | DA status | Class | Editorial action | EN fallback OK? | Severity |
|---------|--------------|-------|------------|-----------|-------|------------------|-----------------|----------|
| Hero / intro | hardcoded TSX | statement, lede, body | “The ordered cabinet”… | No DA CMS | D→E | Migrate to messages or `departmentPage`; translate | No | P0 |
| Featured remedies | hardcoded | titles, body, CTA | Sidr Honey… | No DA | D→E | Migrate+translate; Latin taxa stay F | Partial | P0 |
| Pull quotes | `apothecary-declarations.ts` | statements | EN | EN-only | D→E | Localise module or CMS | No | P1 |
| Product lists | Sanity | product fields | EN catalogue | 0 DA products | B | Keep EN catalogue until DA products exist | Yes | — |
| Secondary nav | messages | section labels | — | **Wired (DA)** | — | — | — | — |

### `/dk/the-academy`

| Section | Source | Field | EN (short) | DA status | Class | Action | EN OK? | Sev |
|---------|--------|-------|------------|-----------|-------|--------|--------|-----|
| Hero / intro | hardcoded | all | “Transmission through study”… | — | D→E | Migrate+translate | No | P0 |
| Flagship programme | static `hijama-diploma.ts` | name, fee, cohort | Hijāma Diploma… | No DA programme | B→E | Publish DA programme or message overlay; keep Hijāma F | Temporary | P0 |
| Trust grid / declarations | hardcoded / `academy-declarations.ts` | — | EN | — | D→E | Migrate+translate | No | P1 |
| Secondary nav | messages | section labels | — | **Wired (DA)** | C fixed | — | — | — |

### `/dk/sacred-journeys`

| Section | Source | Field | EN (short) | DA status | Class | Action | EN OK? | Sev |
|---------|--------|-------|------------|-----------|-------|--------|--------|-----|
| Hero / intro / columns | hardcoded | all | “Educational pilgrimage”… | — | D→E | Migrate+translate | No | P0 |
| Featured journey | hardcoded | prose | Umrah with the Institute… | Umrah F; prose EN | D→E | Translate prose | Partial | P0 |
| Interest form chrome | next-intl | labels | — | DA OK | — | — | — | — |
| Journey listings | Sanity/static | — | — | no DA journeys | B | EN fallback OK for lists | Yes | — |
| Secondary nav | messages | — | — | **Wired (DA)** | C fixed | — | — | — |

### `/dk/knowledge-library`

| Section | Source | Field | EN (short) | DA status | Class | Action | EN OK? | Sev |
|---------|--------|-------|------------|-----------|-------|--------|--------|-----|
| Hero name | `nav.knowledgeLibrary` | nameEn | Vidensbiblioteket | **Selected** | C fixed | — | — | — |
| Hero standfirst / statement / features | hardcoded | body | EN publishing programme copy | — | D→E | Migrate+translate; keep Arabic name F | No | P0 |
| Declarations | `library-declarations.ts` | — | EN | — | D→E | Localise | No | P1 |
| Articles list | Sanity | — | — | 0 articles either locale | B | Empty OK; EN fallback when EN only | Yes | — |
| Duʿa nav | `duaDhikr.breadcrumb` | — | Duʿa & Dhikr | Retained F | F | Keep | — | — |

### `/dk/consultations`

| Section | Source | Field | EN (short) | DA status | Class | Action | EN OK? | Sev |
|---------|--------|-------|------------|-----------|-------|--------|--------|-----|
| Booking chrome | `booking.*` | most UI | — | Mostly DA | — | — | — | — |
| Mobile CTA | `booking.summary.submit` | — | Book min aftale | **Wired** | C fixed | — | — | — |
| `consultationsPage` CMS | Sanity singleton | title/statement | unused fetch | 0 DA docs; singleton shape | C (remaining) | languageGroupedList; `fallbackToDefault: false`; wire or remove fetch | N/A | P1 |
| Validation errors | hardcoded in client | errors | “First name is required.” | EN | E | Use `form.validation` / booking keys | No | P1 |
| Clinic meta | `booking/service.ts` | country, availability | “United Kingdom”… | no i18n | E | Message map by clinic id | No | P1 |

### `/dk/institute`

| Section | Source | Field | EN (short) | DA status | Class | Action | EN OK? | Sev |
|---------|--------|-------|------------|-----------|-------|--------|--------|-----|
| Entire article | hardcoded TSX | all | “A bimāristān reborn…” | no page CMS | D→E | Migrate; keep Arabic loanwords F | No | P0 |
| Pillar titles | could use `nav.*` | titles | The Apothecary… | DA keys exist | C (deferred body) | Wire `nav.*` in a later approved page pass | No | P1 |

## Counts (page-body focus)

| Class | Count (approx.) | Notes |
|-------|-----------------|-------|
| A | 0 | No missed DA CMS selection |
| B | 4 | Catalogue, programmes, journeys, articles — EN fallback acceptable until DA entities exist |
| C | 2 remaining | consultations singleton; institute pillar title wiring (deferred to body pass) |
| C fixed this phase | 4 | Dept nav maps; knowledge hero name; booking CTA; consent/system chrome |
| D→E | 20+ | Hardcoded department landing prose |
| F | documented above | Do not invent translations |

## Required editorial / Sanity actions

1. Create or migrate department landing documents (or message namespaces) for Apothecary, Academy, Journeys, Knowledge, Institute — Danish fields.
2. Publish DA `programme` / `journey` / `article` / product documents when ready; until then EN fallback on listings is acceptable (B).
3. Restructure `consultationsPage` for language-grouped documents; stop silent EN body fallback for DA.
4. Translate booking validation strings and clinic availability labels via message keys (no clinical invention — institutional chrome only).
5. Do **not** invent clinical, Islamic, or institutional body translations outside editorial process.
