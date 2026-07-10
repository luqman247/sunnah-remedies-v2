# 15 · Release Checklist

**Implements:** DIOS‑§3.6 (human gate on irreversible), §3.7 (append‑only record), §3.10
(fail closed), §13.2 (conformance at release). **Depends on:** `00`–`14`.

> Exactly what must be verified before production. **No exceptions.** Production deploy is an
> irreversible action: machine evidence is necessary but not sufficient — a recorded human
> approval is mandatory (§3.6). A release that fails conformance does not ship (§13.2).

## Pre‑release gate

- [ ] **Review Checklist (Document 14) passed** for every change in the release.
- [ ] All verification evidence present and signed; no unverified claim in scope (§3.5).
- [ ] Full gate green: build, typecheck, lint, tests, visual, accessibility, performance,
      security, documentation.
- [ ] Performance budgets and Core Web Vitals within target (Doc 08).
- [ ] Security review complete; no secrets, no known critical vulnerabilities (Doc 13).
- [ ] Accessibility review complete (Doc 07).
- [ ] Discoverability verified: metadata, structured data, sitemap, robots (Doc 09).

## Release integrity

- [ ] Version bumped per policy; changelog assembled from the decision/work history.
- [ ] Release notes generated as a projection of the model (Doc 04), not hand‑written truth.
- [ ] Migrations (if any) are reversible, verified, with a snapshot taken before (Doc 03 §5,
      Doc 11).
- [ ] Rollback path confirmed and tested.

## The human gate *(§3.6, §8.4)*

- [ ] A human with release authority has reviewed the evidence.
- [ ] Founder / governing‑authority approval recorded for the production deploy.
- [ ] Approval is immutably logged (who approved, on what evidence, when) (§3.7).

> An AI agent MUST NOT give this approval under any circumstances (§8.4). Machine evidence
> informs the human; it never replaces the human gate for an irreversible action.

## Deploy & confirm

- [ ] Deploy executed as a verified transaction; tag applied.
- [ ] Post‑deploy healthcheck and smoke verification pass.
- [ ] Monitoring and alerting active; budgets watched (Doc 08, Doc 12).
- [ ] If any check fails post‑deploy → roll back to the prior verified state; record the
      failure with evidence.

## Outcome
- [ ] All boxes checked and approval recorded → released.
- [ ] Any box unchecked → **not released.** There are no exceptions (§3.10).

### Related documents
`14 Review Checklist`, `00 §3.6/§8.4` (the human gate), `13` (security), `08` (performance),
`11` (migrations & rollback).

*Version 1.0.0.*
