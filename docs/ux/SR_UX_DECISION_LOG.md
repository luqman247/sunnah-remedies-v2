# UX Decision Log

| Date | Decision | Alternatives | Why | Gate check |
|------|----------|--------------|-----|------------|
| 2026-07-18 | Isolate UX on `feat/sr-comprehensive-ux-improvement` in sibling worktree from `origin/main` | Edit social-sharing branch | Protect `feat/premium-social-sharing-preview` | N/A |
| 2026-07-18 | Fix locale routing with `next.config` `beforeFiles` rewrites | Rely only on middleware/proxy; `localePrefix: always` | Next 16 middleware/proxy matchers unreliable in local Turbopack; rewrites restore as-needed EN + `/dk` DA without SEO URL change | Oxford/Mayo: correct routing is clinical hygiene |
| 2026-07-18 | Keep “Enter the institution”; add editorial task list | Replace hero CTA; marketing card grid | Preserve institutional voice; add task layer | Aesop: restraint; no cards |
| 2026-07-18 | Preserve department names; add mobile task shortcuts | Rename nav to verbs | Spec: do not necessarily rename departments | Oxford: declaration over persuasion |
| 2026-07-18 | Progressive booking + progress chrome (not full wizard rewrite) | Multi-page stepped wizard | Lower risk; retain selections; add progress/empty/i18n | Mayo: clarity without spectacle |
| 2026-07-18 | Booking analytics without medical fields | Full funnel with reason text | Ethics + spec | Mayo dignity |
| 2026-07-18 | Defer middleware→proxy migration | Force proxy.ts now | Proxy manifest empty in local Next 16.2.10; keep middleware for auth | Resilience |
| 2026-07-18 | Stop after baseline audit + fixture P0 containment; no further P1/P2 without approval | Continue full UX brief uninterrupted | User gate: audit first, only P0 fixture/misleading containment authorised | Process |
| 2026-07-18 | Contain “Do Not Buy” verification product via fetch/GROQ guard (not CMS delete) | Delete Sanity document; leave visible | Immediate public safety without CMS write access in this session | Mayo: do not expose test inventory |
| 2026-07-18 | Leave Duʿa “Preparing for publication” link behaviour for approval (F3/F4) | Immediately disable all zero-entry collection links | Empty states are honest; changing link behaviour is IA work needing sign-off | Oxford: declare limits; don’t silently hide scholarship structure |
| 2026-07-18 | Phase 2A only: consent + secondary nav + system chrome + breadcrumbs + switcher + CMS gap register; no body translation | Continue into homepage/booking/academy UX | User authorised controlled phase; editorial DA body requires Sanity/editorial | Oxford/Mayo: declare limits; no invented clinical/Islamic copy |
| 2026-07-18 | Consent storage `sr_consent_v1` remains locale-agnostic | Separate consent per language | Legal continuity across language switch; semantics unchanged | Mayo: dignity; truthful consent |
| 2026-07-18 | Locale catch-all + client `NotFoundContent` for DA/EN 404 | Server `getTranslations` alone | Cookie could disagree with URL rewrite; client follows layout provider locale | Resilience; correct `lang` surface |
| 2026-07-18 | Retain Hijāma, Umrah, Duʿa & Dhikr untranslated in nav | Auto-translate proper names | Editorial architecture preserves rite/collection names | Wellcome: provenance before spectacle |
| 2026-07-18 | Replace unavailable `next lint` with `eslint .` + official flat `eslint.config.mjs` | Invent custom rules; leave lint claimed “unavailable” | Next 16 removed CLI lint; repo already had eslint-config-next | Process honesty; no invented rule set |
| 2026-07-18 | Raise masthead nav breakpoint 768→1024 | Keep desktop links at tablet; truncate Danish | At 768 Danish department labels overflowed horizontally | Aesop: material honesty; usable chrome |
| 2026-07-18 | Document soft HTTP 200 on `notFound()` under `[locale]` as known limit; ship institutional UI | Block Phase 2A until middleware 404 fixed | Pre-existing sitewide (ADR-017); out of Phase 2A chrome scope | Mayo: state limits plainly |
| 2026-07-18 | Phase 2A closure pass only — no Phase 2B | Start homepage/booking/academy UX | User: approved in principle, not complete until closure | Process |
