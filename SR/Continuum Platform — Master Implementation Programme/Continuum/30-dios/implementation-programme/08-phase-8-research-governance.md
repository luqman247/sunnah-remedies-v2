# Continuum Platform — P8: Research, Governance & Internationalisation

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 8 (§19), §4.18 (Research), §4.19 (Governance / Integrity Ledger), §4.10 (Translation & i18n), and §1.3 (Two-Ledgers principle).
>
> **Duration:** 2 weeks · **Tier:** Intelligence

Add scholarship, the integrity constraint, and full multi-locale support. Governance activates the Integrity-Ledger veto over commercial and AI actions; the previously inert Governance hooks become live. Content localises fully, including RTL and multi-jurisdiction.

---

## Objectives

- Implement Research (§4.18): outputs, datasets, citations, and provenance/source-grading metadata.
- Implement Governance (§4.19): the Integrity Ledger, assertions, and permit()/veto over commercial and AI actions.
- Activate the Governance hooks seeded inert in Phases 2, 4, and 6.
- Implement full Translation & i18n (§4.10): locale routing, catalogues, formatting, RTL, and jurisdiction profiles.
- Complete AI-assisted translation coordinated with the CMS workflow.

## Deliverables

- modules/research with outputs, citations, and the Research portal surface.
- modules/governance with the Integrity Ledger and permit() decision.
- modules/i18n with locale routing, message catalogues, formatting, and RTL.
- Translation workflow (human + AI-assisted) integrated with CMS.
- Live Governance veto across AI, Commerce, and Research; audit of decisions.

## Repository changes

- Add modules/research, modules/governance, modules/i18n.
- Replace inert Governance no-op hooks (Phases 2/4/6) with live permit() calls.
- Add locale routing and RTL support to apps/shell and the design system.
- Wire translation jobs through Operations and the AI adapter.

## Folder structure

```
modules/
├── research/
│   ├── outputs/        # publications, datasets, downloads
│   ├── citations/      # citation + provenance
│   ├── profiles/       # researcher profiles + portal
│   └── interface/      # research.output / cite
├── governance/
│   ├── ledger/         # integrity assertions (Integrity Ledger)
│   ├── policy/         # grading rubrics (clinical/legal/scholarly)
│   ├── decision/       # permit(commercialAction) → allow/veto
│   └── interface/      # governance.assert / permit
└── i18n/
    ├── routing/        # locale routing
    ├── catalogues/     # message catalogues
    ├── formatting/     # dates, numbers, currency
    ├── rtl/            # RTL layout support
    └── interface/      # i18n.t / format ; translation.request
```

## Modules affected

- Research (§4.18)
- Governance (§4.19)
- Translation & i18n (§4.10)
- AI/Commerce/Research — now subject to live veto
- CMS — translation workflow + localised content
- Operations — translation jobs

## Interfaces to implement

- research.output(id) / research.cite(id).
- governance.assert(claim, grade, provenance).
- governance.permit(commercialAction) — allow/veto with reason.
- i18n.t(key, vars) / i18n.format(value, kind).
- translation.request(document, targetLocale).

## External services

- The AI adapter (assisted translation) — already provisioned in Phase 4.
- Multi-currency formatting data; optional professional-translation vendor via a translation adapter.
- No new money vendors — currency display only; charging remains Commerce/Payments.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| DEFAULT_LOCALE | Institution default locale. | yes |
| SUPPORTED_LOCALES | Enabled locales (incl. RTL). | yes |
| DEFAULT_JURISDICTION | Default jurisdiction profile. | yes |
| TRANSLATION_VENDOR_API_KEY | Optional professional translation (secret manager). | no |
| GOVERNANCE_MODE | off \| advisory \| enforcing (default off; enforcing where integrity precedence is required). | yes |

## Acceptance criteria

- Integrity assertions can veto commercial/AI actions with a recorded reason and audit trail.
- The Governance hooks seeded in Phases 2/4/6 are now live and honoured.
- Content localises across locales including RTL; formatting is locale-correct.
- Multi-jurisdiction configuration applies the right compliance copy and rules.
- AI-assisted translation is coordinated with the CMS workflow; human review is preserved.

## Testing requirements

- Unit: assertion grading, permit() allow/veto logic, locale formatting, RTL layout resolution, catalogue lookup.
- Integration: a commercial action conflicting with an integrity assertion is vetoed and audited; an AI answer failing grounding is blocked when enforcing.
- i18n: RTL rendering fidelity; currency/date formatting per locale; missing-key fallback.
- Governance modes: off (no effect), advisory (warn+log), enforcing (block) behave correctly.

## Production readiness checklist

- [ ] GOVERNANCE_MODE per institution; enforcing mode audited and reversible.
- [ ] No user-facing string is hardcoded; all pass through i18n.t.
- [ ] RTL verified visually in Storybook + visual-regression.
- [ ] Translation jobs durable via Operations; failures re-drivable.
- [ ] Integrity-Ledger decisions immutable in the audit log.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Over-blocking | Enforcing governance halts legitimate commerce/AI. | Advisory mode first; tune rubrics; require reason on every veto; human override with audit. |
| Hardcoded strings | Untranslated literals ship. | i18n-lint rule forbidding literal user-facing strings; catch in CI. |
| RTL breakage | Layouts break under RTL. | RTL as a first-class direction in the design system; visual-regression for RTL. |
| Provenance gaps | Research claims lack sources. | Require provenance on assertions; grade sources; surface ungraded content. |

## Dependencies

- Phase 2 (CMS content + Governance review hook).
- Phase 4 (AI RAG + Governance hook).
- Phase 6 (Commerce + Governance permit hook).
- Phase 5 (Operations for translation jobs).

## Documentation updates

- Document Research, Governance, and i18n interfaces.
- ADR: Integrity-Ledger enforcement model and governance modes; i18n/RTL approach.
- Update Security Guide with governance audit and jurisdiction handling.
- Update Editorial Guide with translation workflow and localised authoring.

---

## Milestones & tasks

### Milestone 8.1 — Research

**Objective.** Scholarship as first-class, provenance-aware content.

#### Task 8.1.1 — Implement research outputs and datasets

- **Inputs:** Spec §4.18 (outputs, datasets, downloads); CMS Research/Download types.
- **Outputs:** research.output(id) exposing publications, datasets, and downloadable artefacts.
- **Files created:** `modules/research/outputs/`, `modules/research/interface/`
- **Files modified:** `cms Research/Download usage`
- **Verification steps:**
  - Research outputs render with linked datasets/downloads.
  - Access respects entitlements.
- **Manual QA steps:**
  - Publish a research output with a dataset; confirm it renders and downloads.

#### Task 8.1.2 — Implement citations and provenance

- **Inputs:** Spec §4.18 (citation, provenance, source-grading); Reference type (§6.1).
- **Outputs:** research.cite(id); provenance and source-grade metadata attached to outputs.
- **Files created:** `modules/research/citations/`
- **Files modified:** `research interface`, `cms Reference linkage`
- **Verification steps:**
  - Citations resolve.
  - Ungraded sources are flagged.
- **Manual QA steps:**
  - Cite a graded and an ungraded source; confirm the flagging.

#### Task 8.1.3 — Build researcher profiles and the Research portal

- **Inputs:** Spec §4.18 profiles; §12 portal-as-configuration.
- **Outputs:** Researcher profiles and a Research portal surface composed from primitives.
- **Files created:** `modules/research/profiles/`
- **Files modified:** `portal composition (from Phase 7)`
- **Verification steps:**
  - Research portal shows outputs/profiles per entitlement.
  - No bespoke portal code.
- **Manual QA steps:**
  - View the Research portal as a researcher; confirm composition.

### Milestone 8.2 — Governance & the Integrity Ledger

**Objective.** Make integrity able to veto commerce and AI, auditable and reversible.

#### Task 8.2.1 — Implement the Integrity Ledger and assertions

- **Inputs:** Spec §1.3, §4.19 (assert claim, grade, provenance).
- **Outputs:** governance.assert(claim, grade, provenance) recording integrity assertions immutably.
- **Files created:** `modules/governance/ledger/`, `modules/governance/interface/`
- **Files modified:** `audit integration`
- **Verification steps:**
  - Assertions persist immutably with grade and provenance.
  - Ledger is queryable.
- **Manual QA steps:**
  - Record an assertion; confirm immutability and retrieval.

#### Task 8.2.2 — Implement grading rubrics (policy sets)

- **Inputs:** Spec §4.19 (domain rubrics: clinical/legal/scholarly plug in as policy sets).
- **Outputs:** Pluggable grading rubrics selectable per institution.
- **Files created:** `modules/governance/policy/`
- **Files modified:** `governance interface`
- **Verification steps:**
  - A rubric grades a claim consistently.
  - Rubrics swap by configuration.
- **Manual QA steps:**
  - Grade the same claim under two rubrics; confirm different, consistent outcomes.

#### Task 8.2.3 — Implement permit(commercialAction) with governance modes

- **Inputs:** Spec §4.19 permit(); GOVERNANCE_MODE (off/advisory/enforcing).
- **Outputs:** governance.permit() returns allow/veto with reason, honouring the mode.
- **Files created:** `modules/governance/decision/`
- **Files modified:** `governance interface`
- **Verification steps:**
  - Off = no effect; advisory = warn+log; enforcing = block.
  - Every veto carries a reason.
- **Manual QA steps:**
  - Exercise all three modes on a conflicting action; confirm behaviour and audit.

#### Task 8.2.4 — Activate live Governance hooks in AI/Commerce/Research

- **Inputs:** Inert hooks from Phases 2/4/6; permit().
- **Outputs:** AI RAG, Commerce actions, and Research publishing call live permit(); conflicts vetoed and audited.
- **Files created:** —
- **Files modified:** `ai rag pipeline`, `commerce action paths`, `research publish`, `cms review hook`
- **Verification steps:**
  - A conflicting AI answer is blocked when enforcing.
  - A conflicting commercial action is vetoed.
- **Manual QA steps:**
  - Assert an integrity constraint, then attempt a conflicting AI answer and a conflicting sale; confirm both are vetoed with reasons.

### Milestone 8.3 — Translation & internationalisation

**Objective.** Full multi-locale, multi-currency, RTL, multi-jurisdiction support.

#### Task 8.3.1 — Implement locale routing and message catalogues

- **Inputs:** Spec §4.10 (locale routing, catalogues).
- **Outputs:** i18n.t(key, vars); locale routing; catalogues with missing-key fallback.
- **Files created:** `modules/i18n/routing/`, `modules/i18n/catalogues/`, `modules/i18n/interface/`
- **Files modified:** `apps/shell routing`
- **Verification steps:**
  - Locale switches via routing.
  - Missing keys fall back gracefully.
- **Manual QA steps:**
  - Switch locale; confirm strings and fallback behaviour.

#### Task 8.3.2 — Implement locale-aware formatting and add the i18n-lint rule

- **Inputs:** Spec §4.10 formatting; §8.x multi-currency display.
- **Outputs:** i18n.format for dates/numbers/currency; a lint rule forbidding hardcoded user-facing strings.
- **Files created:** `modules/i18n/formatting/`, `standards/eslint i18n-lint rule`
- **Files modified:** `CI lint config`
- **Verification steps:**
  - Formatting is locale-correct.
  - A hardcoded string is flagged by lint.
- **Manual QA steps:**
  - Introduce a literal string; confirm lint fails; then localise it.

#### Task 8.3.3 — Implement RTL support in the design system

- **Inputs:** Spec §4.10 RTL; §5 design system; visual-regression.
- **Outputs:** RTL as a first-class direction; locale-aware typography; RTL visual-regression baselines.
- **Files created:** `modules/i18n/rtl/`
- **Files modified:** `packages/design-system (direction)`, `visual-regression baselines`
- **Verification steps:**
  - RTL layouts mirror correctly.
  - Arabic typography renders faithfully.
- **Manual QA steps:**
  - Render key patterns in Arabic RTL; confirm mirroring and glyph fidelity.

#### Task 8.3.4 — Implement the translation workflow (human + AI-assisted)

- **Inputs:** Spec §4.10 (translation workflow with CMS); AI adapter; Operations jobs.
- **Outputs:** translation.request(document, locale) runs AI-assisted translation as durable jobs, preserving human review in CMS.
- **Files created:** `i18n translation workflow`, `operations translation jobs`
- **Files modified:** `cms workflow integration`, `i18n interface`
- **Verification steps:**
  - A document translates via job with a human-review step.
  - Failures are re-drivable.
- **Manual QA steps:**
  - Request a translation; confirm the draft awaits human approval before publish.

#### Task 8.3.5 — Apply multi-jurisdiction configuration

- **Inputs:** Spec §13 jurisdiction profiles (from Phase 3); §4.10.
- **Outputs:** Per-jurisdiction legal/compliance copy and rules applied by locale/market.
- **Files created:** —
- **Files modified:** `settings/jurisdictions integration`, `i18n catalogues`
- **Verification steps:**
  - Switching jurisdiction changes compliance copy and rules.
  - Defaults are sane.
- **Manual QA steps:**
  - Switch jurisdiction; confirm the correct legal copy and consent behaviour.

