# Engineering Operating System — Version 2

## An AI-Native Software Delivery Platform

> Version 1 was a body of knowledge. Version 2 is a machine that turns that knowledge into projects.
> This document designs Version 2. It does not implement it.

**Document type:** Architecture Specification
**Status:** Design — for approval
**Author:** Lead Architect
**Date:** 2026-07-05
**Supersedes:** none (V1 remains the knowledge source V2 consumes)

---

## Grounding: what V1 actually is

Before designing V2, the single most important fact from the V1 audit:

> **118 of 145 documents (81%) are already organisation-independent.** Only 27 (19%) are deeply specific to Sunnah Remedies (the architecture instance, the worked examples, the domain glossary). The org name otherwise appears only in a boilerplate metadata footer.

This ratio is the thesis of V2. The Core almost already exists inside V1 — it is simply *entangled* with one organisation's instance. V2 is, at its heart, an **extraction**: pull the 81% generic doctrine into a versioned Core, turn the 19% specific content into a *seed template* plus *generated output*, and insert a generation layer between them.

Everything below follows from that.

---

# 1. Vision for Version 2

## 1.1 One sentence

Version 2 is a platform that generates a complete, enterprise-grade, AI-ready software project from roughly twenty structured answers, where every generated project inherits a shared, versioned engineering methodology it can never silently drift from.

## 1.2 The shift

| | Version 1 | Version 2 |
|---|---|---|
| **Is a** | Repository of documents | Platform that produces repositories |
| **Unit of value** | A document you read | A project you run |
| **Reuse mechanism** | Copy the folder, find-and-replace the name | Answer questions, inherit the Core |
| **Relationship to a project** | *Is* one project's handbook | *Is the parent of* every project |
| **Consistency** | Maintained by discipline | Enforced by generation + inheritance |
| **Drift** | Silent and inevitable | Detectable and upgradeable |

## 1.3 The governing analogy

V1 is to V2 as **a well-written Rails guide** is to **the `rails new` command**. The guide is necessary and good; but the command is what makes ten thousand consistent applications exist. V2 is the `rails new` of AI-native software delivery — with the crucial addition that the "framework" being inherited is not just code scaffolding but an **engineering methodology and an AI operating contract**.

## 1.4 Design tenets (non-negotiable)

1. **The Core is generic.** No organisation, domain, or vocabulary leaks into it. Ever.
2. **Projects inherit; they do not fork.** A project references a Core version, it does not copy it.
3. **Generation is deterministic and idempotent.** The same answers produce the same project; re-running repairs drift rather than duplicating.
4. **Nothing is duplicated.** Anything true for all projects lives in the Core exactly once.
5. **The AI contract travels with the project.** Every generated project ships the rules, prompts, and entry points its AI assistants must obey.
6. **Everything is upgradeable.** A project can pull a newer Core version through a migration path, not a rewrite.

---

# 2. Repository Architecture

V2 is a **monorepo of the platform itself**, cleanly separated from the projects it generates. The projects live elsewhere (their own repos); the platform only *produces* them.

```
engineering-os/                        # THE PLATFORM (this repo)
│
├── core/                              # (§3) The generic, versioned methodology — the 81%
│   ├── doctrine/                      #   behaviour, principles, decision hierarchy
│   ├── standards/                     #   engineering, AI, prompt, quality standards
│   ├── workflows/                     #   design→plan→build→verify→release (tool-agnostic)
│   ├── lifecycle/                     #   the stage model + gates
│   ├── glossary/                      #   shared vocabulary (generic terms only)
│   └── core.manifest.json             #   version, contents, hashes
│
├── engines/                           # (§4,§6,§7) The active machinery
│   ├── generator/                     #   turns answers → a project (§4)
│   ├── prompt-engine/                 #   compiles + versions prompts (§7)
│   ├── verification-engine/           #   runs evidence-based gates (§6)
│   ├── release-engine/                #   versioning, notes, tags
│   ├── documentation-engine/          #   generates + validates docs
│   ├── quality-engine/               #   docs-lint, drift detection, health scores
│   └── architecture-engine/           #   scaffolds architecture from answers
│
├── templates/                         # (§8) Project templates (blueprints)
│   ├── _base/                         #   the universal project skeleton
│   ├── saas/                          #   archetype: Healthcare SaaS, Internal Tool
│   ├── marketplace/                   #   archetype: Marketplace
│   ├── booking/                       #   archetype: Booking Platform
│   ├── academy/                       #   archetype: Academy
│   ├── content-institution/           #   archetype: Sunnah Remedies, Mindful Muslim
│   └── professional-services/         #   archetype: Law Firm
│
├── plugins/                           # (§10) Optional capabilities
│   ├── cms-sanity/
│   ├── auth-clerk/
│   ├── payments-stripe/
│   ├── compliance-gdpr/
│   ├── compliance-pdpl/
│   └── ...
│
├── knowledge/                         # The example corpus (good/bad), tagged by archetype
│   ├── good/
│   └── bad/
│
├── schema/                            # Machine contracts
│   ├── project.schema.json            #   the ~20-question answer file
│   ├── plugin.schema.json
│   └── template.schema.json
│
├── cli/                               # The entry point: `eos new`, `eos upgrade`, `eos verify`
│
└── meta/                              # The platform's own governance
    ├── README.md
    ├── CONTRIBUTING.md
    ├── CHANGELOG.md
    └── ROADMAP.md
```

## 2.1 What generated projects look like

A generated project is a **separate repository** that never contains a copy of the Core. It contains a lockfile pointing at the Core version it inherits, plus only its own specifics:

```
my-project/
├── eos.lock.json          # { coreVersion, template, plugins[], answers }
├── .eos/                   # generated inheritance surface (regenerable, git-ignored source of truth = eos.lock.json)
│   ├── AI_ENTRYPOINT.md    #   compiled from Core doctrine + this project's answers
│   ├── cursor.rules
│   ├── claude.instructions.md
│   └── resolved-standards/ #   Core standards, resolved for this project
├── docs/                   # THIS project's generated + living docs (vision, ADRs, roadmap…)
├── src/                    # the actual application
└── ...                     # CI, CMS config, tests — all generated, then owned
```

The `.eos/` directory is the **inheritance surface**: the compiled-down view of the Core that this project's humans and AIs read. It is regenerated on upgrade. The project *owns* `docs/` and `src/`; it *inherits* `.eos/`.

---

# 3. Separation of Core and Project

This is the heart of the design. Every V1 document is classified into exactly one of four buckets. The rule for classification:

> **Ask: "Is this true for every organisation, or only for one?"**
> Universal → Core. Organisation-specific → Template seed or Generated output. Active machinery → Engine.

## 3.1 CORE — the generic methodology (extract from V1's 81%)

These move into `core/` with all organisation references removed. They are the inheritance every project receives unchanged.

| V1 location | → Core |
|---|---|
| `90-reference/standards/engineering-behaviour.md` | `core/doctrine/` (the flagship — already generic) |
| `90-reference/standards/ai-collaboration.md`, `ai-quality.md`, `prompt-writing.md`, `prompt-versioning.md` | `core/standards/` |
| `90-reference/workflows/*` (claude, cursor, deployment, release) | `core/workflows/` — **de-tooled** (see §3.5) |
| `40-verify/checklists/*` (all 17) | `core/lifecycle/gates/` |
| `40-verify/prompts/*` review prompts | `engines/verification-engine/prompts/` |
| `90-reference/prompts/documentation/*` | `engines/documentation-engine/prompts/` |
| `30-build/implementation-prompts/*` | `engines/prompt-engine/library/build/` |
| `90-reference/glossary/ai-terms.md` | `core/glossary/` (strip domain terms) |
| `AI_ENTRYPOINT.md`, decision-hierarchy | `core/doctrine/` (becomes a *template* for the compiled per-project entrypoint) |
| Lifecycle spine (`00`–`90` concept) | `core/lifecycle/model.md` |

## 3.2 PROJECT TEMPLATE — the reusable blueprints

The *shape* of a kind of project, with variables where specifics go. Derived by **abstracting** V1's Sunnah-specific instances.

| V1 organisation-specific file | → becomes a template with variables |
|---|---|
| `10-design/architecture/01-vision.md` | `templates/_base/vision.md.tmpl` — "Two Ledgers" generalises to a **configurable governing doctrine** |
| `10-design/architecture/02-system-architecture.md` | `templates/_base/architecture.md.tmpl` — stack becomes a variable set |
| `10-design/architecture/03-content-model.md` | archetype-specific content-model templates |
| `10-design/architecture/04–07` | `_base` architecture templates with `{{stack}}`, `{{folders}}` |
| `10-design/templates/*` (adr, feature-spec, release-notes…) | these are *already* templates — they become **template-of-templates** the generator emits into each project |
| `20-plan/planning/*` | planning-document templates |

## 3.3 GENERATED OUTPUT — produced per project, never authored by hand

Emitted by the generator from the answers. Never lives in the platform repo.

- The project's `README`, `vision.md`, `roadmap.md`, seeded `DECISION_LOG.md`, `CHANGELOG.md`
- Folder structure and `src/` scaffold
- `cursor.rules`, `claude.instructions.md`, compiled `AI_ENTRYPOINT.md`
- GitHub config, CI/CD workflows, verification + release wiring
- CMS schema scaffold, testing structure, deployment docs
- The initial ADR ("ADR-0001: adopt EOS Core vX, template Y, plugins Z")

## 3.4 AUTOMATION / ENGINES — the active machinery (new in V2)

V1's *static* prompts and checklists become *callable* by engines. The prompt text is Core/library; the thing that runs it is an engine.

- `docs-lint.sh` → grows into the **Quality Engine** (adds drift detection, health score, inheritance validation).
- Verification checklists + review prompts → **Verification Engine** (runs gates, demands evidence).
- Release workflow + notes template → **Release Engine**.
- Documentation prompts → **Documentation Engine**.

## 3.5 The de-tooling rule (critical)

V1's workflows are named after tools: `claude-workflow`, `cursor-workflow`, `sanity-workflow`. Tools churn; doctrine doesn't. In V2 the **Core workflow is by role** (`architect`, `implementer`, `content`, `releaser`), and the **tool binding is a plugin**:

```
core/workflows/architect.md          # generic: "the architect audits before designing"
plugins/ai-claude/bind-architect.md  # "Claude fulfils the architect role thus…"
plugins/ai-cursor/bind-implementer.md
plugins/cms-sanity/bind-content.md
```

This means when a new AI tool or CMS arrives in 2028, you add a plugin — you never touch the Core.

---

# 4. Generator Architecture

## 4.1 The ~20 questions (the entire manual input surface)

The generator's input is a single validated answer file conforming to `schema/project.schema.json`. The interview is grouped:

**Identity (4)**
1. Organisation name
2. Project name + slug
3. One-line purpose
4. Governing doctrine (the generalised "Two Ledgers": what non-negotiable holds veto over commerce?)

**Archetype & domain (3)**
5. Archetype (SaaS / Marketplace / Booking / Academy / Content-Institution / Professional-Services / Internal-Tool)
6. Primary domain nouns (e.g. "product, practitioner, course" — seeds the content model)
7. Audiences / portals (e.g. student, practitioner, alumni)

**Stack (4)**
8. Framework (default Next.js 14 App Router)
9. Language (default TypeScript)
10. CMS (Sanity / none / other → plugin)
11. Hosting (Vercel / other)

**Capabilities → plugins (4)**
12. Auth? (which provider)
13. Payments? (which provider)
14. Booking/scheduling?
15. Compliance regimes (UK GDPR / EU GDPR / KSA PDPL / HIPAA…) → compliance plugins

**Delivery & governance (3)**
16. AI assistants in use (Claude / Cursor / …) → AI-binding plugins
17. Phasing style (single roadmap vs phased A–J)
18. Release cadence & versioning policy

**Design (2)**
19. Design language reference (e.g. "Aesop / Aman restraint", anchor colour, motion cap)
20. Typography stack (the "five-typeface" slot generalised)

## 4.2 The pipeline

```
answers.json
   │  validate against project.schema.json  ── fail fast on invalid input
   ▼
RESOLVE  ── pick template archetype + required plugins from answers
   ▼
COMPOSE  ── layer: _base template  ⊕  archetype template  ⊕  each plugin's contributions
   ▼
BIND     ── inject variables ({{org}}, {{stack}}, {{doctrine}}, {{nouns}}…)
   ▼
COMPILE  ── render the AI inheritance surface (.eos/): entrypoint, cursor rules, claude instructions
   ▼
EMIT     ── write files: repo, docs, ADR-0001, CI, CMS scaffold, tests, release wiring
   ▼
LOCK     ── write eos.lock.json (coreVersion, template, plugins, answers hash)
   ▼
VERIFY   ── run Quality + Verification engines on the fresh project; must pass green
```

## 4.3 Determinism & idempotence

- **Deterministic:** answers + Core version + plugin versions fully determine output. No hidden state, no timestamps in content (only in changelog).
- **Idempotent:** re-running the generator on an existing project *reconciles* — it regenerates the inheritance surface and untouched scaffolds, and refuses to clobber files the project now owns (anything under `docs/` and `src/` that has diverged) without an explicit `--force` and a diff.
- **Three-way merge on upgrade:** (Core-old, Core-new, project-current) so a project can absorb a Core upgrade like a well-behaved dependency.

## 4.4 Layering (how "no duplication" is guaranteed)

The generator never copies Core content into a project. It **compiles a resolved view**. If two archetypes need the same behaviour standard, both reference the one Core file; the generator resolves it into each project's `.eos/` at generation time. The single source stays single.

---

# 5. Automation Architecture

Automation spans three moments: **generation-time**, **development-time**, and **CI-time**.

| Moment | Automation | Powered by |
|---|---|---|
| Generation | scaffold, bind, compile, lock, first-verify | Generator |
| Development | prompt retrieval, review-on-demand, doc generation, drift check on save | Prompt / Documentation / Quality engines via CLI + editor integration |
| CI | docs-lint, inheritance validation, verification gates, release automation | Quality / Verification / Release engines via GitHub Actions |

**Standing automations shipped into every generated project:**
- `eos verify` — runs the verification gates locally (evidence-based; no green without build+types+lint+browser proof).
- `eos doctor` — health score + drift report against the inherited Core version.
- `eos upgrade` — pulls a newer Core, runs the migration, produces a diff PR.
- CI workflow that fails the build if inheritance is broken or gates are unmet.

**The evidence principle, automated:** V1's "verify before reporting success" doctrine becomes an actual gate. The Verification Engine will not emit a passing report without machine-checkable evidence artifacts (build log, typecheck, lint, test results, and where relevant a rendered screenshot). This is V1's most important doctrine turned from an instruction into an enforced mechanism.

---

# 6. AI Architecture

## 6.1 The AI contract travels with the project

Every generated project ships a compiled **AI inheritance surface** so any assistant, now or future, is bound identically:

```
.eos/AI_ENTRYPOINT.md        # order of precedence, task→location map, non-negotiables
.eos/claude.instructions.md  # Claude binding
.eos/cursor.rules            # Cursor binding
.eos/resolved-standards/     # the Core standards, resolved for this project
```

These are **generated, not authored** — compiled from `core/doctrine/` + the project's answers. When the Core's doctrine improves, every project regenerates a better contract on upgrade.

## 6.2 Model-agnostic by construction

The Core speaks in **roles and standards**, never in model names. Model-specific quirks live in `plugins/ai-*/`. Adding "Gemini support" or "the 2029 model" is a plugin, not a Core change. This directly extends V1's already-present principle that its standards are "technology-independent."

## 6.3 Three layers of AI involvement

1. **AI as generator input** — the interview can itself be AI-assisted (turn a founder's paragraph into the 20 answers), but the answer file remains the deterministic contract.
2. **AI as builder** — assistants operate *inside* a generated project, bound by its `.eos/` contract, using the Prompt Engine's library.
3. **AI as reviewer** — the Verification Engine invokes review prompts and requires evidence, keeping AI honest about completion.

## 6.4 Safety & governance of AI actions

- The inherited contract encodes the decision hierarchy and "never fabricate requirements / surface risks early" from V1.
- Destructive or irreversible actions (deploys, migrations, permission changes) are gated behind explicit human approval in the workflow, never auto-executed by an assistant.

---

# 7. Prompt Architecture

## 7.1 From documents to a compiled library

V1's prompts are excellent static markdown but are copy-paste artifacts. V2 makes them a **versioned, parameterised library** with one responsibility each (V1 already mandates this) plus machine-readable front-matter:

```yaml
---
id: build.feature-implementation
version: 2.1.0
role: implementer
inputs: [feature_spec, architecture, adrs]
outputs: [code, verification_report]
acceptance_criteria: [...]
requires_core: ">=2.0.0"
related: [verify.code-review, doc.release-notes]
---
```

## 7.2 The Prompt Engine

- **Retrieval:** `eos prompt build.feature-implementation` resolves the prompt, injects project context from `.eos/`, and returns a ready-to-run prompt.
- **Composition:** prompts can declare `related`/`next`, so the engine can chain design→build→verify.
- **Versioning:** prompts version independently but declare `requires_core`, so incompatibilities are caught, not discovered.
- **Provenance:** every AI action can record which prompt id+version produced it, into the Decision Log — closing V1's loop where the Decision Log was demanded but rarely lived.

## 7.3 Good/bad examples become prompt fixtures

V1's good/bad example corpus (`knowledge/`) is tagged by archetype and attached to prompts as few-shot fixtures, so an assistant implementing a booking flow is automatically shown the *good* booking example and the *bad* one to avoid.

---

# 8. Template Architecture

## 8.1 Three-layer composition

Every project is `_base ⊕ archetype ⊕ plugins`:

- **`_base`** — the universal skeleton every project has (lifecycle, doctrine surface, docs structure, CI, verification wiring). Derived from V1's generic 81%.
- **archetype** — the shape of a *kind* of business (SaaS, Marketplace, Booking, Academy, Content-Institution, Professional-Services, Internal-Tool). Derived by abstracting V1's Sunnah instance into the Content-Institution archetype, then generalising siblings.
- **plugins** — bolt-on capabilities (auth, payments, CMS, compliance, AI bindings).

## 8.2 Templates are data-driven, not forks

A template is a directory of `*.tmpl` files + a `template.schema.json` declaring its variables, required plugins, and archetype defaults. Templates **never duplicate** `_base`; they overlay it. This is how V1's "reuse over duplication" principle becomes structural.

## 8.3 Sunnah Remedies as the reference instance

Sunnah Remedies becomes the **canonical example of the Content-Institution archetype** — proof the abstraction is faithful. Its "Two Ledgers" doctrine is the reference implementation of the generalised *governing-doctrine* variable; its five-typeface stack is the reference of the *typography* variable. V1 is preserved, in full, as `templates/content-institution/examples/sunnah-remedies/` — nothing is lost, it is *reparented*.

---

# 9. Lifecycle Architecture

The V1 lifecycle spine (`design → plan → build → verify → release`) is promoted from a *folder layout* to an **executable state machine** with gates.

```
DESIGN ──▶ PLAN ──▶ BUILD ──▶ VERIFY ──▶ RELEASE ──▶ (operate) ──▶ improve
   │         │         │          │           │
  gate      gate      gate       gate        gate
```

Each gate is a Core-defined, engine-enforced quality bar:

| Transition | Gate (must pass to advance) |
|---|---|
| DESIGN→PLAN | approved spec + ADR for significant decisions |
| PLAN→BUILD | dependency-aware milestone plan, risks surfaced |
| BUILD→VERIFY | code compiles, types pass, lint clean |
| VERIFY→RELEASE | evidence-backed verification report (the V1 doctrine, enforced) |
| RELEASE→operate | release notes (dual-audience) + rollback path recorded |

The lifecycle is the same for every project because it lives in the Core. Archetypes and plugins can *add* gates (e.g. compliance plugin adds a DPIA gate) but cannot *remove* Core gates.

---

# 10. Plugin Architecture

## 10.1 Why plugins

Capabilities that some—but not all—projects need must not bloat the Core or duplicate across templates. Plugins are the extension point, and the mechanism by which V2 survives a decade of tool churn.

## 10.2 Plugin contract

A plugin conforms to `plugin.schema.json` and may contribute:
- **scaffold** — files/folders it adds to a generated project
- **variables** — questions it adds to the interview (only when selected)
- **bindings** — how it fulfils a Core role (e.g. `ai-claude` binds the `architect` role)
- **gates** — lifecycle gates it adds (e.g. `compliance-gdpr` adds a data-handling gate)
- **prompts** — prompt-library entries it registers
- **requires** — Core version range + other plugin dependencies

## 10.3 Plugin categories (initial set)

- **AI bindings:** `ai-claude`, `ai-cursor`, (future: any model)
- **CMS:** `cms-sanity`, `cms-none`
- **Auth:** `auth-clerk`, `auth-authjs`
- **Payments:** `payments-stripe`
- **Scheduling:** `booking-cal`
- **Compliance:** `compliance-gdpr-uk`, `compliance-gdpr-eu`, `compliance-pdpl-ksa`, `compliance-hipaa`
- **Ops backbone:** `orchestration-inngest`, `email-resend`, `email-loops`, `crm-postgres`

Each is a home for one of V1's stack choices — de-hardcoding the Sunnah stack into optional, swappable units.

## 10.4 Governance

Plugins are versioned and reviewed; a plugin cannot weaken a Core gate or the AI safety contract. The Quality Engine validates plugin conformance at generation time.

---

# 11. Versioning Strategy

Three independently versioned axes, each SemVer, bound by declared compatibility ranges:

1. **Core version** — the methodology. `2.3.1`.
2. **Template versions** — each archetype. `saas@1.4.0`.
3. **Plugin versions** — each capability. `cms-sanity@2.0.0`.

A generated project's `eos.lock.json` pins all three:

```json
{
  "coreVersion": "2.3.1",
  "template": "content-institution@1.2.0",
  "plugins": ["cms-sanity@2.0.0", "compliance-pdpl-ksa@1.1.0", "ai-claude@3.0.0"],
  "answersHash": "sha256:…"
}
```

**Compatibility rules**
- Templates and plugins declare `requires_core`.
- The CLI refuses incompatible combinations at generation and at upgrade.
- **Core breaking change → major bump → migration required.** Never a silent break.

**The platform's own governance** (V1's `meta/`) versions the whole platform release train in `meta/CHANGELOG.md`.

---

# 12. Migration Strategy from Version 1

V1 is not thrown away; it is **decomposed and reparented**. Six phases, each independently shippable.

**M1 — Freeze & fingerprint.** Tag V1 as `v1.0.0`, hash every file, run `docs-lint`. This is the extraction baseline. *(V1 already passes lint — starting from green.)*

**M2 — Extract the Core (the 81%).** Move the 118 generic files into `core/`, stripping the org from metadata footers (replace `Sunnah Remedies Engineering` with `{{org}}`). De-tool the workflows (§3.5). Output: a Core that mentions no organisation.

**M3 — Abstract the instance (the 19%).** Turn the 27 org-specific files into `templates/content-institution/` with variables, and preserve the literal Sunnah versions under that template's `examples/`. "Two Ledgers" → governing-doctrine variable; five-typeface → typography variable; hijama/apothecary examples → archetype knowledge corpus.

**M4 — Build the generator + `_base`.** Implement the pipeline (§4) and the `_base` template. Milestone: `eos new` can regenerate *Sunnah Remedies itself* from ~20 answers and the output matches V1 (the **fidelity test** — see §16).

**M5 — Stand up engines & plugins.** Promote `docs-lint`→Quality Engine, checklists→Verification Engine, release workflow→Release Engine. Extract the Sunnah stack into plugins (`cms-sanity`, `ai-claude`, `ai-cursor`, compliance regimes).

**M6 — Generalise siblings.** Add the remaining archetypes (SaaS, Marketplace, Booking, Academy, Professional-Services, Internal-Tool) by abstracting from `_base` + the Content-Institution reference. Prove reuse by generating *Mindful Muslim* and one non-Islamic archetype (e.g. Healthcare SaaS).

**Migration invariant:** at every phase, V1's knowledge remains fully recoverable and lint-green. Nothing is deleted; everything is moved with provenance.

---

# 13. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Over-abstraction** — generalising until templates say nothing useful | High | High | Keep Sunnah as a concrete fidelity anchor (§16); a template must be able to regenerate a real project or it's too abstract |
| R2 | **Generated projects drift from Core**, defeating the point | High | High | `eos doctor` drift detection + CI inheritance gate + three-way upgrade merge |
| R3 | **Interview can't capture real complexity** in 20 questions | Med | High | Answers are a *starting contract*, not the whole project; archetypes carry sensible defaults; escape hatch to extend post-generation |
| R4 | **Core becomes a bottleneck** — every project blocked on Core changes | Med | Med | Plugins absorb most change; Core changes are rare and deliberate by design |
| R5 | **Tool churn breaks bindings** (Cursor/Claude/Sanity evolve) | High | Med | De-tooling rule (§3.5): bindings are plugins, Core is stable |
| R6 | **Merge hell on upgrade** for divergent projects | Med | High | Clear owned-vs-inherited boundary (`.eos/` inherited, `docs/`+`src/` owned); upgrades only touch inherited surface by default |
| R7 | **Determinism erodes** as engines add hidden state | Med | High | Answers+versions fully determine output; forbid timestamps/randomness in content; snapshot tests |
| R8 | **The platform out-scopes a small team** | Med | Med | Ship M1–M4 first (generator + one archetype); everything after is incremental value, not prerequisite |
| R9 | **AI safety contract weakened by a careless plugin** | Low | High | Plugins cannot remove Core gates; Quality Engine validates conformance |

Two risks are strategic, not technical: **R1 and R8**. The whole design is arranged so you get value at M4 (regenerate Sunnah) long before the full platform exists — so if the ambition outruns the team, you still hold a working `eos new`.

---

# 14. Opportunities

- **Compounding quality.** Every improvement to the Core lifts every project on next upgrade. Fixing a doctrine once fixes it everywhere — the opposite of V1's copy-and-drift.
- **Institutional memory as an asset.** The good/bad corpus and prompt library become a moat: the more projects run through it, the better the fixtures.
- **AI-assisted interview.** A founder describes their business in prose; an assistant produces the 20 answers; the platform produces the project. Minutes from idea to enterprise-grade scaffold.
- **Marketplace of archetypes & plugins.** Others can publish archetypes (a "Fintech" or "Clinic" archetype) and plugins, with the schema guaranteeing they compose.
- **Compliance as a plugin** turns a painful cross-cutting concern (V1 already juggles UK/EU GDPR + KSA PDPL) into a reusable, auditable unit.
- **Provenance & audit.** Because generation is deterministic and prompt-versioned, every project can prove *how* it was built — valuable for regulated domains (healthcare, legal).
- **Onboarding collapses.** A new engineer or AI reads one inherited `.eos/AI_ENTRYPOINT.md` and is productive, in any project, immediately.

---

# 15. Ten-Year Roadmap

**Year 1 — Extraction & first generation.**
Migration M1–M4. Core extracted, generator live, `_base` + Content-Institution archetype. Fidelity test passes (regenerate Sunnah). Ship `eos new`, `eos verify`, `eos doctor`.

**Year 2 — Breadth & engines.**
M5–M6. All seven archetypes, core plugin set (auth, payments, CMS, compliance, AI bindings). Verification/Release/Quality engines enforced in CI. Second and third real projects generated (Mindful Muslim + a SaaS).

**Year 3 — Upgrade path matures.**
Robust `eos upgrade` with three-way merge. Drift dashboards. Prompt library versioned and chainable. AI-assisted interview (prose → answers).

**Years 4–5 — Ecosystem.**
Public archetype/plugin schema and registry. Third parties publish archetypes. Provenance/audit reports for regulated domains. Platform becomes multi-team.

**Years 6–7 — Autonomy.**
The lifecycle runs semi-autonomously: an assistant can take a spec through build→verify with human approval only at gates. The Verification Engine's evidence requirement makes this safe.

**Years 8–10 — Model & tool independence proven.**
Two or three generations of AI models and at least one full CMS/framework migration absorbed entirely through plugins, Core untouched — the ultimate proof of the de-tooling thesis. The Core doctrine, first written for Sunnah Remedies, still governs every project unchanged.

---

# 16. Definition of Version 2 Complete

Version 2 is complete when **all** of the following hold:

**Generation**
- [ ] A new project is created from a validated ~20-answer file with no other manual authoring.
- [ ] Generation is deterministic (same answers+versions → identical output) and idempotent (re-run reconciles, never duplicates).
- [ ] The generated project includes every listed artifact: repo, folder structure, architecture, vision, docs, templates, feature-spec system, ADR system, seeded Decision Log, prompt library reference, Cursor rules, Claude instructions, GitHub config, CI/CD, verification system, release system, standards, engineering handbook, README, roadmap, CMS structure, testing structure, deployment docs.

**Separation**
- [ ] `core/` contains zero organisation-specific references (automated check).
- [ ] No content is duplicated between Core and any template (single-source check passes).
- [ ] Every generated project inherits the Core by reference (lockfile), not by copy.

**Fidelity (the anchor test)**
- [ ] The platform can regenerate **Sunnah Remedies** from ~20 answers, and the output is functionally equivalent to V1 — proving the abstraction lost nothing.
- [ ] The platform generates **at least two more distinct archetypes** (e.g. Mindful Muslim + Healthcare SaaS) that a reviewer accepts as enterprise-grade.

**Enforcement**
- [ ] The lifecycle gates are engine-enforced; VERIFY→RELEASE cannot pass without evidence.
- [ ] CI fails a project whose inheritance is broken or whose Core version is unsupported.
- [ ] `eos upgrade` moves a project to a newer Core via migration + diff, without a rewrite.

**Extensibility**
- [ ] A new AI model or CMS can be supported by adding a plugin, with **no change to the Core**.
- [ ] Templates and plugins declare and honour Core compatibility ranges.

**Governance**
- [ ] The platform versions itself (Core/templates/plugins independently, SemVer, with a changelog).
- [ ] Every generated project can prove its provenance (Core+template+plugin+prompt versions).

When these hold, the Engineering Operating System has stopped being a repository you read and become the **parent of every project you build** — an AI-native software delivery platform.

---

## Appendix A — V1 → V2 disposition (every V1 area classified)

| V1 area | Files | V2 disposition |
|---|---|---|
| `standards/*` | 5 | **Core** (`core/standards`, `core/doctrine`) — generic |
| `workflows/*` | 5 | **Core**, de-tooled to roles; tool bindings → **plugins** |
| `checklists/*` | 17 | **Core** lifecycle gates, run by **Verification Engine** |
| verify `prompts/*` | 15 | **Verification Engine** library |
| doc `prompts/*` | 14 | **Documentation Engine** library |
| implementation-prompts | 11 | **Prompt Engine** build library |
| `glossary` | 1 | **Core** (generic terms) + template (domain terms) |
| `architecture/01–07` | 7 | **Template** `_base` (variabilised) + Sunnah reference |
| `templates/*` | 10 | **Generated output** templates the generator emits |
| `planning/*` | 11 | **Template** planning docs (variabilised) |
| examples good/bad | 30 | **Knowledge** corpus, archetype-tagged, prompt fixtures |
| root governance | 7 | **Generated output** per project; platform keeps its own in `meta/` |
| `docs-lint.sh` + CI | 2 | **Quality Engine** foundation |
| Sunnah `.docx`, domain examples | — | **Content-Institution** archetype `examples/` |

Total: nothing discarded. 81% → Core/engines, 19% → template + reference, plus a new generation layer that did not exist in V1.
