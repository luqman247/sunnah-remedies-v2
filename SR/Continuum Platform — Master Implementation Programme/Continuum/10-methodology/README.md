# Engineering Operating System

> A reusable, enterprise-grade engineering methodology.
> Clone it, replace the organisation name, and start building.

This repository is not documentation *about* a project. It is the **operating system** for how software is designed, planned, built, verified, and released — organised along the engineering lifecycle so that any engineer or AI assistant can navigate it predictably.

It is currently instantiated for **Sunnah Remedies**, but is designed to be rebranded for any organisation in minutes (see `CONTRIBUTING.md` → Rebranding).

---

## The Lifecycle Spine

The repository is organised along the flow that work actually follows:

```
00-foundation   →  Why we build the way we do (start here)
10-design       →  Architecture, system design, templates
20-plan         →  Roadmaps, milestones, sprints, risk
30-build        →  Implementation prompts and worked examples (good & bad)
40-verify       →  Checklists and review prompts — evidence before completion
50-release      →  Shipping, versioning, release notes
90-reference    →  Standards, workflows, glossary, prompt library
```

Each stage hands off to the next. Nothing at a later stage may contradict an approved decision from an earlier one.

---

## Where To Start

| You are… | Start here |
|---|---|
| New to this OS | `00-foundation/` then `90-reference/standards/engineering-behaviour.md` |
| An AI assistant | `AI_ENTRYPOINT.md` |
| Designing a feature | `10-design/` and `10-design/templates/feature-spec.md` |
| Planning delivery | `20-plan/planning/master-planning.md` |
| Implementing | `30-build/implementation-prompts/` + the good examples |
| Verifying work | `40-verify/checklists/` |
| Releasing | `50-release/` |

---

## Governing Doctrine

**Two Ledgers, One Standard.** An Integrity Ledger (accuracy, authenticity) and a Commercial Ledger (revenue, growth) are held to a single standard, with the Integrity Ledger holding veto power. See `10-design/architecture/01-vision.md`.

**Evidence before completion.** No work is done until a verification report backs it with build, type-check, lint, and browser evidence.

**Fixed foundations.** Design-system primitives are composed by later work, never altered.

---

## Repository Conventions

- All files are Markdown, `kebab-case.md`, no spaces or colons in paths.
- Every document carries a metadata block (type, version, status, owner, review cycle).
- Bad examples link to their good twin via a "Do This Instead" section.
- Run `./docs-lint.sh` before committing.

---

## Related Documents

- `CONTRIBUTING.md` — how to maintain and rebrand this OS
- `CHANGELOG.md` — version history of the OS itself
- `AI_ENTRYPOINT.md` — the map an AI assistant should read first

## Document Metadata

**Document Type:** Index
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual
