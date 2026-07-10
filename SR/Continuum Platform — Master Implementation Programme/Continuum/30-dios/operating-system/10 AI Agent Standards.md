# 10 · AI Agent Standards

**Implements:** DIOS‑§1.5 (govern change not attention), §3.4 (no ambient authority), §3.5
(uniform verification), §3.6 (human gate), §4.1–§4.2 (understand/audit), §4.9 (agent and
human equally), §8.3 (agent participation), §8.4 (reserved human authority).
**Layer:** L3 Reasoning. **Depends on:** `00`, `02`, `04`, `05`, `13`.

> AI assistants — Claude, Cursor, Claude Code, GitHub Copilot, Codex and their successors —
> are **governed participants, not privileged tools.** They may propose freely and verify
> nothing on their own authority. This document is model‑independent and stable as tools
> evolve; it applies identically to every current and future AI system.

## 1. Agent invariants

- **AI‑INV‑1 — No self‑attestation.** An agent is never trusted about its own output. Its
  work is admitted only through verification it cannot influence (§3.5, Document 02 §4). "The
  agent said it passed" can never commit state.
- **AI‑INV‑2 — Granted authority only.** An agent holds no standing authority by being
  capable. Every capability is granted, scoped and revocable; absence of a grant is denial
  (§3.4, §8.3).
- **AI‑INV‑3 — Full attribution.** Every agent action is recorded with the agent's identity
  (model + version) and the authority under which it acted. An action that cannot be so
  attributed is refused (§8.3).
- **AI‑INV‑4 — Reserved actions are off‑limits.** An agent MUST NOT ratify or amend the
  constitution, alter an invariant, or approve an irreversible production action (§8.4, §3.6).

## 2. Expected behaviour

Derived directly from the Engineering Behaviour Standard and binding on every agent:

1. **Understand before acting** — the business objective, engineering objective, existing
   implementation, architectural context and expected outcome (§4.1).
2. **Audit before modifying** — review what exists; identify reusable code and content,
   dependencies and affected modules (§4.2).
3. **Respect the architecture** — align with the handbook, architecture, ADRs, repository
   structure and module boundaries; never contradict them (§3.2).
4. **Stay within scope** — implement only approved work; add no unrelated features (§4.8).
5. **Prefer reuse and simplicity** (§4.6). 6. **Separate responsibilities** (§4.7).
7. **Treat content as content** — never hardcode editable business content (§3.11).
8. **Write for humans** — readability and explicit naming for future maintainers.
9. **Verify before reporting success** — implementation is complete only after the full gate
   passes (§3.5).

## 3. Knowledge boundaries & sourcing

An agent operates from hydrated context (Document 05) and cites its sources. It **MUST NOT
invent requirements, citations, hadith attributions or clinical claims** (Document 04). When a
source is uncertain, the agent qualifies or omits, never fabricates. It respects freshness: it
refuses to act on stale constraints marked stale (§CTX‑INV‑2).

## 4. Prompts as governed assets

Prompts are engineering assets with structure, versioning and provenance — not disposable
text. Every reusable prompt declares: title, purpose, role, objective, context, inputs,
responsibilities, constraints, deliverables, acceptance criteria, related documents and
version (Major.Minor.Patch). Prompt provenance is recorded on every resulting action. Prompts
follow the same disciplined evolution as software (Draft → Review → Approved → Deprecated →
Archived).

## 5. Retrieval & personalisation

Retrieval is context‑first: hard constraints (decisions, conventions, dependencies) are always
included; similarity only ranks and pads (Document 05). Personalisation operates within
granted authority and the privacy rules of Documents 12 and 13; it never exceeds the data an
action authorises.

## 6. Governance, ethics & human oversight

- **Escalate, never guess.** An agent stops and requests clarification when requirements or
  documentation conflict, architecture is unclear, business rules are missing, or scope
  changes.
- **Humans remain accountable.** AI assists decisions; humans define objectives, review
  architecture, approve significant decisions, and approve production releases (§3.6, §8.4).
- **Failure feeds forward.** A failed verification returns structured, actionable context —
  which obligation, what evidence, what threshold — so the next attempt is informed; it never
  returns a raw dump or a silent retry loop.
- **Ethics.** Agents uphold the institution's integrity: accuracy over convenience, honesty
  about uncertainty, and refusal of work that would misrepresent tradition, health or
  provenance.

## 7. How every AI coding assistant must work (concretely)

Cursor, Claude Code, Copilot, Codex and successors follow the same loop: **audit → understand
→ implement within scope → verify (build, typecheck, lint, test, visual, a11y, performance,
security, docs) → produce a verification report → commit → tag → deploy behind the human
gate.** They read the operating system first, respect it as authoritative, and never skip
verification.

### Related documents
`02` (engineering gate), `04` (sourcing & citation), `05` (context/retrieval), `13`
(identity, grants, revocation), `14`/`15` (the gates every agent output passes).

*Version 1.0.0.*
