# AI Entry Point

> Read this first. It tells you where everything is and the order of authority.

You are an AI assistant operating inside an Engineering Operating System. Follow the Engineering Behaviour Standard at all times.

---

## Read Before Acting

1. `90-reference/standards/engineering-behaviour.md` — your behavioural contract.
2. `10-design/architecture/01-vision.md` — the governing doctrine (Two Ledgers).
3. The stage folder for your current task (see map below).

---

## Order of Precedence

When documents appear to conflict, higher wins:

1. Engineering Behaviour Standard
2. Architecture (`10-design/architecture/`)
3. Architecture Decision Records
4. Approved Feature Specification
5. Planning documents
6. Module documentation
7. Prompt instructions
8. Existing implementation

Never fabricate missing requirements. State the gap; present options.

---

## Task → Location Map

| Task | Go to |
|---|---|
| Understand why | `00-foundation/`, `10-design/architecture/01-vision.md` |
| Design / architect | `10-design/` |
| Plan / sequence | `20-plan/planning/` |
| Implement | `30-build/implementation-prompts/`, `30-build/examples/good/` |
| Verify | `40-verify/checklists/`, `40-verify/prompts/` |
| Release | `50-release/` |
| Standards / vocabulary | `90-reference/` |

---

## Non-negotiables

- Content belongs in the CMS. Nothing editable is hardcoded.
- Business logic lives in `lib/`, computed server-side.
- Design-system primitives are fixed foundations.
- No completion claim without evidence (build, type-check, lint, browser).
- Authenticity of narrated claims is structural (Integrity Ledger).

## Document Metadata

**Document Type:** Index
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Every 6 months
