# 02 · Engineering Standards

**Implements:** DIOS‑§1.5 (govern change, not attention), §3.2 (model primacy), §3.3
(traceability), §3.5 (uniform verification), §3.7 (append‑only record), §3.11 (content is
content), §4.1–§4.8 (understand, audit, reuse, simplicity, scope), §5 (layers), §6
(dependency law).
**Layer:** spans L1–L5. **Depends on:** `00`, `03`, `05`, `13`, `14`, `15`.

> Engineering excellence is defined not only by what is built, but by *how* it is built.
> These standards are technology‑independent and remain stable as tools evolve.

## 1. Engineering invariants

- **ENG‑INV‑1 — Architecture is authoritative.** Implementation never contradicts
  architecture, ADRs, module boundaries or this operating system. Where they disagree, the
  architecture governs and the implementation is the defect (§3.2).
- **ENG‑INV‑2 — Verify before success.** No work is "done" until it has passed the full
  verification gate (§4). "It should work" is never a completion state (§3.5).
- **ENG‑INV‑3 — Every significant change is traceable.** A change references a WorkItem, the
  context it was built against, and the evidence that verified it (§3.3).
- **ENG‑INV‑4 — Reuse before creation.** New components, services, schemas or utilities are
  introduced only after confirming no existing one serves (§4.6).

## 2. Architecture & folder structure

The repository structure is **derived from the architecture, not from documentation habit.**
Each top‑level unit exists because a subsystem requires it. Structure encodes the layer model
(§5): substrate, model/content, reasoning, extension, experience. Business content is never a
folder of hardcoded data — it lives in the content model (§3.11).

The reference stack for institution web products is **Next.js (App Router) + TypeScript +
Tailwind + Sanity (content) + Vercel (delivery)**, but the stack is a *plugin* over stable
contracts (`03`): the standards below outlive any particular framework.

## 3. Naming & components

- Naming is explicit and predictable; a maintainer can infer purpose from name alone (§4.4).
- Components have one responsibility (§4.7); business logic, presentation, data access and
  content are separated. Large multi‑purpose components and mixed‑concern modules are
  defects.
- Reusable systems (design primitives, data‑access, schema types, hooks, queries) are shared,
  versioned and documented — never duplicated (§4.6).

## 4. Testing, verification & error handling

**The mandatory verification gate.** Every implementation MUST pass, in order:

```
Build → Typecheck → Lint → Tests → Run dev server → Visual/browser verification
      → Accessibility review → Performance review → Security review → Documentation review
```

Verification is run **out of process** and its result is evidence, not the author's word
(§3.5, and `10 AI Agent Standards`). For UI, visual verification against a baseline is
part of the gate, not optional. Error handling is explicit, typed and observable (§4.10);
failures surface with actionable context, never silent swallowing.

## 5. Performance, security, scalability

- Performance budgets are defined and enforced per Document 08; a change that regresses a
  budget does not merge.
- Security standards (Document 13) are engineering standards: no secrets in Git, inputs
  validated, outputs sanitised, dependencies scanned, least‑authority throughout (§3.4).
- Scalability follows the ten‑year properties (§5, Document 08): stable contracts, small
  core, replaceable edges, partitionable state.

## 6. Review, deployment & technical‑debt rules

- **Review process.** Every change is reviewed against its governing Contracts before merge
  (Document 14). Human‑ and agent‑authored changes face the identical review (§3.5).
- **Deployment.** Deploy is a verified, reversible transaction; production deploy is
  irreversible and therefore carries a recorded human approval (§3.6). The path is
  build → verify → tag → deploy, with rollback always available (Document 15).
- **Technical debt.** Debt is declared, recorded and bounded, never hidden. An exception is a
  debt with an owner and a repayment plan; a composition is an asset (§4.11). Undeclared
  divergence from architecture is not "debt" — it is a defect.

## 7. The engineering laws (in one place)

1. Understand before acting. 2. Audit before modifying. 3. Respect the architecture.
4. Stay within scope. 5. Prefer reuse. 6. Prefer simplicity. 7. Separate responsibilities.
8. Treat content as content. 9. Write for humans. 10. Verify before reporting success.

These laws are the applied form of the Part 3 invariants and Part 4 principles. Every
Participant, human or agent, is bound by them.

### Related documents
`03` (contracts & subsystems), `05` (context/content model), `08` (performance), `13`
(security), `14`/`15` (the gates), `10` (how agents implement these standards).

*Version 1.0.0.*
