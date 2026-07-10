# Continuum Platform — P0: Foundations & Standards

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 0 (§19). Establishes the monorepo, standards, tooling, and the Core kernel (§4.1).
>
> **Duration:** 2 weeks · **Tier:** Kernel

Stand up the monorepo, the encoded standards, the CI/CD skeleton, and the Core kernel. Nothing institution-specific ships here; this phase makes every later phase possible and enforces the dependency law from the first commit.

---

## Objectives

- Create the monorepo skeleton (apps/, packages/, modules/, standards/, tooling/, docs/, examples/, templates/, scripts/, .github/, .cursor/) per spec §17.
- Encode the standards: TypeScript strict base, lint/format configs, commit hooks, and the token/schema config homes.
- Implement the Core kernel (§4.1): typed config, event bus, adapter registry, logger, error/Result model.
- Stand up CI/CD with all merge gates and the dependency-graph enforcement.
- Establish the ADR process and the agent guidance (.cursor rules + Claude instructions) so AI generation stays on-architecture.

## Deliverables

- A green-building monorepo that deploys an empty shell app to a preview environment.
- packages/config, packages/types, packages/adapters, and the Core kernel package.
- standards/ with tsconfig base, eslint, prettier, and the dependency-graph rules.
- GitHub Actions pipeline running the full gate set on every PR.
- ADR-0001 (modular monolith) through ADR-0003 (adapter pattern) recorded.
- .cursor/rules and CLAUDE.md encoding the dependency law, token rule, and module contract.

## Repository changes

- Initialise the monorepo with the chosen package manager workspaces and task runner.
- Add root tsconfig, eslint, prettier, and editorconfig referencing standards/.
- Add .github/workflows/ci.yml and PR/issue templates and CODEOWNERS.
- Add .cursor/ and CLAUDE.md at repo root.

## Folder structure

```
continuum/
├── apps/
│   └── shell/                 # minimal deployable app proving the pipeline
├── packages/
│   ├── config/                # typed, validated configuration
│   ├── types/                 # shared domain types + Result model
│   ├── adapters/              # vendor adapter registry (interfaces only in P0)
│   └── core/                  # Core kernel: config, events, logger, errors
├── modules/                   # (empty; populated from P2 onward)
├── standards/
│   ├── tsconfig/              # base + app/package presets
│   ├── eslint/                # shared lint config
│   ├── prettier/              # shared format config
│   └── depgraph/              # dependency-law rules
├── tooling/
│   └── scripts/               # repo scripts (verify, depgraph-check)
├── docs/
│   ├── adr/                   # Architecture Decision Records
│   └── guides/                # the ten guides (stubs seeded here)
├── examples/                  # (empty; reference institutions later)
├── templates/                 # (empty; generator templates later)
├── scripts/                   # release/migration/verification wrappers
├── .github/                   # workflows, templates, CODEOWNERS
└── .cursor/                   # agent rules
```

## Modules affected

- Core (§4.1) — implemented
- All others — interface placeholders only, not implemented

## Interfaces to implement

- config — validated, typed configuration accessor.
- events — publish(event) / subscribe(type, handler) (in-process bus).
- adapters — get('email'|'storage'|'payments'|'ai'|'search') returning an interface (no live vendor yet).
- logger, errors, and the shared Result<T,E> type.

## External services

- GitHub (source + Actions CI/CD).
- Vercel (preview + production hosting of the shell app).
- No paid third-party vendors activated in this phase.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| NODE_ENV | Runtime environment. | yes |
| APP_ENV | Institution environment tag (local/preview/prod). | yes |
| VERCEL_* | Provided by Vercel at deploy time. | auto |
| LOG_LEVEL | Structured logger verbosity. | no (defaults) |

## Acceptance criteria

- A clean checkout builds green through every gate: typecheck, lint, format, unit, dependency-graph, secret-scan, build.
- Core kernel is documented and unit-tested; config fails fast on invalid env.
- An illegal import (module → sibling internals) causes the dependency-graph gate to fail in CI.
- The shell app deploys to a Vercel preview on PR and to production on merge.
- ADR-0001..0003 exist and are linked from the Architecture Guide stub.

## Testing requirements

- Unit: config validation (valid/invalid env), event bus publish/subscribe, adapter registry resolution, Result/error model.
- Integration: CI pipeline dry-run proving all gates execute and can fail.
- Negative: a deliberately illegal import fixture proving the depgraph gate blocks merge.

## Production readiness checklist

- [ ] CI required checks enforced on main (no direct pushes).
- [ ] Secret scanning enabled; no secrets in repo or config.
- [ ] Preview deployments enabled per PR; production deploy on merge to main.
- [ ] Observability baseline: structured logs with correlation IDs emitted by Core.
- [ ] Rollback: previous deployment restorable via host; documented in Deployment Guide stub.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Tooling churn | Package-manager/monorepo-runner choices are hard to reverse later. | Record the decision in an ADR; keep tooling in standards/ so it is centrally swappable. |
| Over-building Core | Kernel accretes feature logic and violates its own boundary. | Enforce 'Core depends on nothing' in the depgraph rules; review every Core addition. |
| Gate flakiness | Flaky gates erode trust and get bypassed. | Quarantine flaky checks; keep the pipeline fast (<10 min) to protect adoption. |

## Dependencies

- None. Phase 0 is the root of the programme.

## Documentation updates

- Seed all ten guides (§18) as stubs with owners and scope.
- Author ADR-0001 (modular monolith), ADR-0002 (dependency law), ADR-0003 (adapter pattern).
- Write the Contribution Guide (definition of done, ADR process) — needed before other phases contribute.
- Populate .cursor/rules and CLAUDE.md with the dependency law, token rule, and module contract.

---

## Milestones & tasks

### Milestone 0.1 — Monorepo skeleton & workspace

**Objective.** A workspace that installs, builds, and runs an empty shell app.

#### Task 0.1.1 — Initialise monorepo workspace and task runner

- **Inputs:** Spec §17 repository structure; chosen package manager and monorepo runner (recorded in ADR).
- **Outputs:** Installable workspace; root scripts (build, lint, test, typecheck) run across packages.
- **Files created:** `package.json (root)`, `workspace/monorepo config`, `.gitignore`, `.editorconfig`
- **Files modified:** —
- **Verification steps:**
  - Fresh install succeeds.
  - Root build/lint/test/typecheck scripts run and pass on an empty tree.
- **Manual QA steps:**
  - Clone into a clean directory and confirm a single install + build works with no manual steps.

#### Task 0.1.2 — Create top-level directory structure

- **Inputs:** Spec §17 folder tree.
- **Outputs:** All top-level directories exist with README placeholders explaining their purpose.
- **Files created:** `apps/`, `packages/`, `modules/`, `standards/`, `tooling/`, `docs/`, `examples/`, `templates/`, `scripts/`, `each with README.md`
- **Files modified:** —
- **Verification steps:**
  - Directory tree matches spec §17.
  - Each directory has a purpose README.
- **Manual QA steps:**
  - Visually diff the tree against spec §17; confirm no missing or extra top-level folders.

#### Task 0.1.3 — Scaffold the minimal shell app

- **Inputs:** Chosen framework (Next.js App Router per §2.1).
- **Outputs:** apps/shell renders a single placeholder route and builds for production.
- **Files created:** `apps/shell/ (framework scaffold, one route)`
- **Files modified:** `workspace config to include the app`
- **Verification steps:**
  - Shell builds and starts locally.
  - Production build output is generated.
- **Manual QA steps:**
  - Load the shell locally and confirm the placeholder route renders without console errors.

### Milestone 0.2 — Standards & quality gates

**Objective.** Every quality standard is encoded once in standards/ and consumed everywhere.

#### Task 0.2.1 — Author TypeScript strict base configs

- **Inputs:** Spec §2.1 (TypeScript strict).
- **Outputs:** standards/tsconfig base plus app/package presets; all packages extend them.
- **Files created:** `standards/tsconfig/base.json`, `standards/tsconfig/app.json`, `standards/tsconfig/package.json`
- **Files modified:** `root tsconfig`, `apps/shell tsconfig`
- **Verification steps:**
  - Typecheck passes repo-wide in strict mode.
  - A deliberate type error is caught by the typecheck script.
- **Manual QA steps:**
  - Introduce a temporary type error and confirm the typecheck gate flags it, then revert.

#### Task 0.2.2 — Author lint & format configs

- **Inputs:** Spec §15 (linting/formatting, one canonical style).
- **Outputs:** Shared eslint + prettier configs in standards/; consumed by root.
- **Files created:** `standards/eslint/index`, `standards/prettier/index`
- **Files modified:** `root eslint/prettier references`
- **Verification steps:**
  - Lint and format checks pass repo-wide.
  - A style violation is reported by lint.
- **Manual QA steps:**
  - Run format check on a mis-formatted file and confirm it is flagged.

#### Task 0.2.3 — Configure pre-commit hooks

- **Inputs:** Spec §15 (pre-commit: lint, format, type-check, secret-scan).
- **Outputs:** Commit-time hooks running lint, format, typecheck, and secret scan on staged files.
- **Files created:** `hook configuration`, `tooling/scripts/precommit`
- **Files modified:** `root package config`
- **Verification steps:**
  - A commit with a lint error is blocked locally.
  - A staged fake secret is blocked.
- **Manual QA steps:**
  - Attempt a commit containing a dummy secret string and confirm the hook blocks it.

#### Task 0.2.4 — Implement dependency-graph (dependency law) rules

- **Inputs:** Spec §3.1 dependency law; §17 boundary enforcement.
- **Outputs:** A depgraph check that fails on illegal imports (module→sibling internals, app→module internals, Core→anything).
- **Files created:** `standards/depgraph/rules`, `tooling/scripts/depgraph-check`
- **Files modified:** `CI workflow to run the check`
- **Verification steps:**
  - Legal import graph passes.
  - A fixture with an illegal import fails the check.
- **Manual QA steps:**
  - Add a temporary illegal import fixture, confirm the check fails, then remove it.

### Milestone 0.3 — Core kernel

**Objective.** Implement Core (§4.1) — the substrate every module consumes.

#### Task 0.3.1 — Implement typed configuration & environment validation

- **Inputs:** Spec §4.1 config; §15 environment validation (fail fast).
- **Outputs:** packages/config exposes a validated, typed config accessor; boot fails with a clear message on invalid env.
- **Files created:** `packages/config/ (schema, accessor)`
- **Files modified:** `apps/shell to read config at boot`
- **Verification steps:**
  - Valid env boots.
  - Missing/invalid env fails fast with a descriptive error.
- **Manual QA steps:**
  - Remove a required env var locally and confirm the app refuses to boot with a clear message.

#### Task 0.3.2 — Implement shared types & Result/error model

- **Inputs:** Spec §4.1 (shared domain types, result/error model).
- **Outputs:** packages/types exports the Result type and canonical error taxonomy used platform-wide.
- **Files created:** `packages/types/ (Result, error taxonomy, shared primitives)`
- **Files modified:** —
- **Verification steps:**
  - Types compile and are importable.
  - Unit tests cover Result success/failure flows.
- **Manual QA steps:**
  - Review the error taxonomy against the module list to confirm coverage of expected failure modes.

#### Task 0.3.3 — Implement the in-process event bus

- **Inputs:** Spec §4.1 events; §3.1 async contract communication.
- **Outputs:** core.events with publish(event) and subscribe(type, handler); typed event contracts.
- **Files created:** `packages/core/events/`
- **Files modified:** `packages/core index`
- **Verification steps:**
  - Publish reaches subscribers.
  - Handler errors are isolated and logged, not swallowed silently.
- **Manual QA steps:**
  - Wire a temporary subscriber, publish a test event, confirm delivery and correlation-id propagation.

#### Task 0.3.4 — Implement the adapter registry (interfaces only)

- **Inputs:** Spec §2 portability rule; §4.1 adapter registry.
- **Outputs:** core.adapters.get('email'|'storage'|'payments'|'ai'|'search') returns a typed interface with a null/stub implementation.
- **Files created:** `packages/adapters/ (interfaces + stubs)`, `packages/core/adapters/`
- **Files modified:** `packages/core index`
- **Verification steps:**
  - Each adapter key resolves to its interface.
  - Calling a stub returns a clear 'not configured' result, not a crash.
- **Manual QA steps:**
  - Resolve each adapter and confirm the stub behaviour is safe and logged.

#### Task 0.3.5 — Implement structured logging & correlation IDs

- **Inputs:** Spec §4.1 (structured logging, correlation IDs, telemetry hooks).
- **Outputs:** core.logger emits structured logs with a correlation id threaded through events and requests.
- **Files created:** `packages/core/logger/`
- **Files modified:** `apps/shell request entry to attach correlation id`
- **Verification steps:**
  - Logs are structured JSON with level and correlation id.
  - A request produces a traceable correlation id end to end.
- **Manual QA steps:**
  - Trigger a request and confirm one correlation id links the request log and any event logs.

### Milestone 0.4 — CI/CD, ADRs & agent guidance

**Objective.** Automate the gates and encode the rules that keep humans and agents on-architecture.

#### Task 0.4.1 — Build the CI pipeline with the full gate set

- **Inputs:** Spec §15 gates; §2.4 GitHub Actions.
- **Outputs:** .github/workflows/ci.yml runs typecheck, lint, format, unit, integration, depgraph, secret-scan, and build on every PR.
- **Files created:** `.github/workflows/ci.yml`
- **Files modified:** `root scripts referenced by CI`
- **Verification steps:**
  - All gates run on a PR.
  - A failing gate blocks merge.
- **Manual QA steps:**
  - Open a draft PR that fails one gate and confirm merge is blocked with a clear signal.

#### Task 0.4.2 — Configure preview & production deploys

- **Inputs:** Spec §2.4 Vercel; §14 performance host.
- **Outputs:** Per-PR preview deployments and production deploy on merge to main.
- **Files created:** `deploy config`
- **Files modified:** `CI workflow to trigger deploys`
- **Verification steps:**
  - A PR produces a working preview URL.
  - Merge to main updates production.
- **Manual QA steps:**
  - Open a PR, visit the preview URL, confirm the shell renders; merge and confirm production updates.

#### Task 0.4.3 — Add GitHub templates and CODEOWNERS

- **Inputs:** Spec §15 (issue/PR templates encode the definition of done).
- **Outputs:** PR template with the DoD checklist; issue templates; CODEOWNERS routing reviews.
- **Files created:** `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/*`, `.github/CODEOWNERS`
- **Files modified:** —
- **Verification steps:**
  - New PRs render the DoD checklist.
  - CODEOWNERS requests the right reviewers.
- **Manual QA steps:**
  - Open a test PR and confirm the template and owner assignment appear.

#### Task 0.4.4 — Establish the ADR process and record ADR-0001..0003

- **Inputs:** Spec §1.2 (modular monolith), §3.1 (dependency law), §2 (adapter/portability).
- **Outputs:** docs/adr with a template and the first three ADRs capturing the founding decisions and trade-offs.
- **Files created:** `docs/adr/0000-template.md`, `docs/adr/0001-modular-monolith.md`, `docs/adr/0002-dependency-law.md`, `docs/adr/0003-adapter-pattern.md`
- **Files modified:** `Architecture Guide stub links the ADRs`
- **Verification steps:**
  - ADRs follow the template.
  - Each records context, decision, and trade-off.
- **Manual QA steps:**
  - Review ADR-0001 against spec §1.2 to confirm the recorded trade-off matches the specification.

#### Task 0.4.5 — Author agent guidance (.cursor rules + CLAUDE.md)

- **Inputs:** Spec §15 (agent guidance as first-class architecture); §3.2 module contract; §5.1 token rule.
- **Outputs:** .cursor/rules and CLAUDE.md instruct agents on the dependency law, token-only styling, and the six-part module contract.
- **Files created:** `.cursor/rules`, `CLAUDE.md`
- **Files modified:** `Developer Guide stub references agent guidance`
- **Verification steps:**
  - Rules state the dependency law, token rule, and module contract explicitly.
  - An agent prompted to break a boundary is guided to refuse.
- **Manual QA steps:**
  - Ask an agent to add a cross-module internal import and confirm the rules steer it to the interface instead.

#### Task 0.4.6 — Seed the ten documentation guides

- **Inputs:** Spec §18 documentation set.
- **Outputs:** docs/guides contains all ten guides as stubs with owner, audience, and scope.
- **Files created:** `docs/guides/{developer,architecture,platform,design,editorial,operations,security,deployment,migration,contribution}.md`
- **Files modified:** —
- **Verification steps:**
  - All ten guides exist with front-matter (owner, audience, scope).
- **Manual QA steps:**
  - Confirm each guide's scope statement matches its row in spec §18.

