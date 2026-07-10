# 14 · Review Checklist

**Implements:** DIOS‑§3.5 (uniform verification), §13.1–§13.2 (conformance enforced at the
gate). **Depends on:** all of `00`–`13`.

> This is the gate every change passes before merge — feature, page, article, product,
> course, image, video, component, schema. It applies identically to human‑ and
> agent‑authored work (§3.5). A change that fails any applicable section does not merge.
> "Verify before reporting success" is law, not aspiration.

## How to use it

Run the sections that apply to the change. Each unchecked box that applies is a blocker. The
completed checklist is recorded as verification evidence (§3.3), not a private note.

## 1. Understanding & scope *(§4.1, §4.2, §4.8)*
- [ ] Business and engineering objective understood and stated.
- [ ] Existing implementation and content audited; reuse identified.
- [ ] Dependencies and affected modules identified.
- [ ] Scope defined: what is included and explicitly what is not. No scope creep.

## 2. Architecture & standards *(§3.2, §3.12, Doc 02, 03)*
- [ ] Change aligns with architecture, ADRs, module boundaries and this operating system.
- [ ] No new authoritative copy of the model introduced (§5.3).
- [ ] Contracts respected; no undeclared capability (§3.4).
- [ ] Reuse over creation; single responsibility; simplicity over cleverness.

## 3. Content boundary *(§3.11, Doc 05)*
- [ ] No hardcoded business content (products, prices, courses, ingredients, articles,
      testimonials, team). Content lives in the content model.

## 4. Engineering verification gate *(Doc 02 §4)*
- [ ] Build passes. [ ] Typecheck passes. [ ] Lint passes. [ ] Tests pass.
- [ ] Dev server runs; behaviour confirmed.
- [ ] Visual/browser verification against baseline (for UI).

## 5. Design & interaction *(Doc 01, 06)*
- [ ] Composes institution tokens and primitives; no ad‑hoc values.
- [ ] Interaction patterns predictable; feedback for every action.
- [ ] Motion purposeful and within timing tokens; reduced‑motion honoured.

## 6. Accessibility *(Doc 07)*
- [ ] One H1; semantic structure; logical headings.
- [ ] Keyboard operable; focus visible; screen‑reader verified.
- [ ] Forms labelled; errors specific and announced.
- [ ] Contrast sufficient; meaning never carried by colour alone; alt text correct.
- [ ] WCAG review completed.

## 7. Performance *(Doc 08)*
- [ ] Performance budgets respected; no Core Web Vitals regression.
- [ ] Images/video within budget; lazy loading / code splitting applied where relevant.

## 8. Discoverability *(Doc 09)*
- [ ] Metadata present (title, description, canonical).
- [ ] Structured data accurate; internal links coherent.
- [ ] Content accurate, well‑sourced and AI‑readable.

## 9. Editorial & sourcing *(Doc 04)*
- [ ] Voice and reading level appropriate; no overclaiming.
- [ ] Qur'an/Hadith/Arabic formatting correct; attributions verified; no invented citations.
- [ ] Clinical/medical claims sourced and appropriately disclaimered.

## 10. Security *(Doc 13)*
- [ ] Every mutating action authorised and attributable; dual gate satisfied.
- [ ] No secrets in Git; inputs validated; outputs sanitised.
- [ ] Dependencies reviewed for vulnerabilities; least privilege throughout.

## 11. AI participant conduct *(Doc 10)* — where an agent authored the change
- [ ] No self‑attestation; verification is independent evidence.
- [ ] Action attributed to agent identity (model + version) and granted authority.
- [ ] No invented requirements or citations; escalated on conflict rather than guessing.

## 12. Documentation & traceability *(§3.3, Doc 04)*
- [ ] Affected docs (generated projections) current; ADR recorded for significant decisions.
- [ ] Change references its WorkItem and the evidence that verified it.

## Outcome
- [ ] All applicable sections pass → eligible to merge.
- [ ] Any applicable box unchecked → **blocked**; record the reason, resolve, re‑verify.

### Related documents
`15 Release Checklist` (the production gate), `00 §13` (conformance), `02 §4` (the gate),
`10` (agent conduct).

*Version 1.0.0.*
