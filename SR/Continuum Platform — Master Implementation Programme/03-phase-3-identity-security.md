# Continuum Platform — P3: Identity, Security & Settings

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 3 (§19), §4.2 (Identity), §4.20 (Settings & API), and §13 (Security & Compliance).
>
> **Duration:** 2 weeks · **Tier:** Foundation

Provide authentication, centralised RBAC, the security baseline, and institution configuration with jurisdiction profiles. Every protected action now routes through one authorization decision point.

---

## Objectives

- Implement Identity (§4.2): auth/sessions, the user/org/role model, and the central authorize() decision point.
- Implement the security baseline (§13): CSRF/XSS defences, rate limiting, secrets, and immutable audit logs.
- Implement Settings (§4.20): institution config, module activation toggles, feature flags, and the outward API gateway skeleton.
- Provide jurisdiction profiles (UK GDPR, EU GDPR, KSA PDPL) with consent, retention, and erasure mechanisms.
- Introduce the sensitive-data category with stricter access and audit (clinical/legal/personal).

## Deliverables

- modules/identity with auth, RBAC, and authorize(subject, action, resource).
- Security middleware (CSRF, headers/CSP, rate limiting) and the audit-log service.
- modules/settings with config, module toggles, feature flags, and the versioned API gateway shell.
- Jurisdiction profile mechanisms and a sensitive-data handling policy.
- Security Guide published (§18).

## Repository changes

- Add modules/identity and modules/settings.
- Add security middleware to apps/shell and the API gateway.
- Wire a secret manager; remove any interim env-file secrets from non-secret stores.
- Add deny-by-default routing so protected routes require an authorization check.

## Folder structure

```
modules/
├── identity/
│   ├── auth/           # OAuth/OIDC + email sessions
│   ├── model/          # user, organisation, role
│   ├── rbac/           # roles, permissions, authorize()
│   └── interface/      # auth / authorize / events
└── settings/
    ├── config/         # institution config, module toggles, flags
    ├── jurisdictions/  # UK GDPR / EU GDPR / KSA PDPL profiles
    ├── api-gateway/    # versioned outward surface, rate limiting
    └── interface/      # settings.get / settings.modules
packages/
└── security/           # csrf, headers/CSP, rate-limit, audit-log
```

## Modules affected

- Identity (§4.2) — implemented
- Settings & API (§4.20) — implemented
- Security baseline (§13) — implemented as packages/security
- Core — consumed

## Interfaces to implement

- auth — signIn / signOut / getSession.
- authorize(subject, action, resource) — the single policy decision function.
- Events: user.created, user.role_changed, session.revoked.
- settings.get(key) / settings.modules().
- Versioned REST/GraphQL gateway shell over module interfaces.

## External services

- Auth.js with OAuth/OIDC providers (email + at least one social/enterprise provider).
- A managed IdP option (Clerk/WorkOS) behind the same auth interface for enterprise SSO/SAML.
- A secret manager (platform-provided or cloud KMS).

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| AUTH_SECRET | Session/JWT signing secret (secret manager). | yes |
| AUTH_OAUTH_CLIENT_ID | OAuth provider client id. | yes |
| AUTH_OAUTH_CLIENT_SECRET | OAuth provider secret (secret manager). | yes |
| DATABASE_URL | PostgreSQL for identity/audit data. | yes |
| RATE_LIMIT_REDIS_URL | Store backing rate limiting (or platform equivalent). | yes |
| SECRET_MANAGER_* | Secret manager access configuration. | yes |

## Acceptance criteria

- Protected actions enforce authorize(subject, action, resource); deny-by-default holds.
- An immutable audit trail records security- and integrity-relevant events.
- GDPR/PDPL mechanisms (consent, retention, erasure, DSAR) are configurable per institution.
- Secrets are externalised to the secret manager; none remain in code or plain config.
- Rate limiting protects auth and API endpoints; CSRF/XSS defences are active.

## Testing requirements

- Unit: role/permission resolution, authorize() decisions (allow/deny), consent state transitions.
- Integration: sign-in flow, session lifecycle, protected-route denial without authorization, audit write on sensitive actions.
- Security: CSRF rejection on state-changing requests, rate-limit trip, CSP header presence, secret-scan clean.
- Compliance: erasure request removes/anonymises data; retention policy enforced.

## Production readiness checklist

- [ ] MFA-capable auth; secure, http-only, rotated session tokens.
- [ ] Audit log immutable and queryable; retention configured.
- [ ] Secrets in the secret manager with rotation supported.
- [ ] Rate limits and CSP tuned and enforced in production.
- [ ] Jurisdiction profile selected per institution; DSAR/erasure runbook in the Security Guide.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Scattered authz | Authorization logic leaks into routes/features. | Force all decisions through authorize(); lint/review for direct role checks. |
| Secret exposure | Secrets slip into client bundles or logs. | Secret manager + secret-scan gate + log redaction; review env boundaries. |
| Compliance gaps | Erasure/retention incomplete across modules. | Model data ownership per module; central erasure orchestration; test DSAR end to end. |
| Session vulnerabilities | Weak session handling enables hijack. | Standards-based sessions, rotation, http-only/secure cookies, MFA. |

## Dependencies

- Phase 0 (Core, config, events).
- Phase 2 (content to protect; users may author content).

## Documentation updates

- Publish the Security Guide (§18): controls, RBAC, secrets, compliance profiles, data handling.
- Document the Identity and Settings interfaces.
- ADR: authorization model (RBAC decision point), secret management, jurisdiction-profile approach.
- Update Deployment Guide with secret-manager and environment setup.

---

## Milestones & tasks

### Milestone 3.1 — Authentication & session lifecycle

**Objective.** Users can securely authenticate; sessions are safe and revocable.

#### Task 3.1.1 — Provision PostgreSQL and the identity data model

- **Inputs:** Spec §2.3 (Postgres/Prisma); §4.2 model.
- **Outputs:** user, organisation, and role tables via Prisma; migrations versioned.
- **Files created:** `modules/identity/model/`, `prisma schema (identity)`
- **Files modified:** `packages/config (DATABASE_URL)`
- **Verification steps:**
  - Migrations apply cleanly.
  - Types generate from schema.
- **Manual QA steps:**
  - Run migration on a fresh DB; confirm tables and generated types.

#### Task 3.1.2 — Implement OAuth/OIDC + email authentication

- **Inputs:** Spec §4.2 auth; Auth.js; provider credentials.
- **Outputs:** auth.signIn/signOut/getSession works with email and one external provider.
- **Files created:** `modules/identity/auth/`
- **Files modified:** `identity interface`, `apps/shell auth entry`
- **Verification steps:**
  - Sign-in/out works.
  - Sessions are http-only, secure, and rotated.
- **Manual QA steps:**
  - Sign in via provider and email; confirm session cookie attributes.

#### Task 3.1.3 — Add session revocation and emit identity events

- **Inputs:** Spec §4.2 events (session.revoked, user.created).
- **Outputs:** Sessions can be revoked; user.created and session.revoked events emitted.
- **Files created:** —
- **Files modified:** `modules/identity/auth`, `identity interface`
- **Verification steps:**
  - Revoked session is rejected on next request.
  - Events emitted with subject refs.
- **Manual QA steps:**
  - Revoke an active session; confirm immediate lockout on next call.

### Milestone 3.2 — RBAC & authorization

**Objective.** One decision point governs every protected action.

#### Task 3.2.1 — Model roles and permissions

- **Inputs:** Spec §4.2 RBAC; §13 permissions model (least privilege).
- **Outputs:** Role→permission→resource model with least-privilege defaults.
- **Files created:** `modules/identity/rbac/model`
- **Files modified:** `prisma schema (roles/permissions)`
- **Verification steps:**
  - Roles map to permissions.
  - Default role has minimal rights.
- **Manual QA steps:**
  - Inspect the seeded roles; confirm no over-broad defaults.

#### Task 3.2.2 — Implement authorize(subject, action, resource)

- **Inputs:** Spec §4.2 (single policy decision function).
- **Outputs:** A central authorize() returning allow/deny with reason.
- **Files created:** `modules/identity/rbac/authorize`
- **Files modified:** `identity interface`
- **Verification steps:**
  - Allowed action passes.
  - Disallowed action is denied with a reason.
- **Manual QA steps:**
  - Call authorize() for several role/action pairs; confirm decisions match the model.

#### Task 3.2.3 — Enforce deny-by-default routing

- **Inputs:** Spec §13 (deny-by-default routing).
- **Outputs:** Protected routes require an authorization check; unchecked protected routes fail a lint/review guard.
- **Files created:** `security route guard`
- **Files modified:** `apps/shell protected routes`
- **Verification steps:**
  - A protected route without authorize() is blocked/flagged.
  - Public routes remain accessible.
- **Manual QA steps:**
  - Add a protected route without a check; confirm the guard flags it; then wire authorize().

#### Task 3.2.4 — Emit user.role_changed and audit authorization decisions

- **Inputs:** Spec §13 audit logs; §4.2 events.
- **Outputs:** Role changes emit events; sensitive authorize() denials/allows are audited.
- **Files created:** —
- **Files modified:** `modules/identity/rbac`, `packages/security/audit`
- **Verification steps:**
  - Role change emits event and audit entry.
  - Sensitive decisions are recorded immutably.
- **Manual QA steps:**
  - Change a user's role; confirm the audit entry is immutable and complete.

### Milestone 3.3 — Security baseline

**Objective.** Platform-wide defences: CSRF/XSS, rate limiting, secrets, audit.

#### Task 3.3.1 — Implement CSRF and XSS defences

- **Inputs:** Spec §13 (anti-CSRF, output encoding, strict CSP).
- **Outputs:** Anti-CSRF on state-changing requests; strict CSP and output sanitisation.
- **Files created:** `packages/security/csrf`, `packages/security/headers`
- **Files modified:** `apps/shell middleware`
- **Verification steps:**
  - State-changing request without CSRF token is rejected.
  - CSP headers present and strict.
- **Manual QA steps:**
  - Forge a state-changing request without a token; confirm rejection.

#### Task 3.3.2 — Implement rate limiting

- **Inputs:** Spec §13 (per-identity and per-IP limits).
- **Outputs:** Rate limits on auth and API endpoints, per identity and per IP.
- **Files created:** `packages/security/rate-limit`
- **Files modified:** `apps/shell + API gateway`
- **Verification steps:**
  - Exceeding the limit returns a throttled response.
  - Normal traffic is unaffected.
- **Manual QA steps:**
  - Hammer the sign-in endpoint; confirm throttling engages and recovers.

#### Task 3.3.3 — Wire the secret manager and remove interim secrets

- **Inputs:** Spec §13 secrets management (no secrets in code/config).
- **Outputs:** Runtime secrets sourced from the secret manager; rotation supported; secret-scan clean.
- **Files created:** `secret-manager integration`
- **Files modified:** `packages/config secret resolution`
- **Verification steps:**
  - Secrets load at runtime from the manager.
  - No secrets remain in the repo or plain config.
- **Manual QA steps:**
  - Rotate a secret in the manager; confirm the app picks up the new value on redeploy.

#### Task 3.3.4 — Implement the immutable audit-log service

- **Inputs:** Spec §13 audit logs.
- **Outputs:** An append-only, structured audit trail for security/integrity events, queryable with retention.
- **Files created:** `packages/security/audit`
- **Files modified:** `identity + settings to emit audit entries`
- **Verification steps:**
  - Audit entries cannot be mutated/deleted through the interface.
  - Entries are queryable.
- **Manual QA steps:**
  - Attempt to modify an audit entry; confirm it is immutable.

### Milestone 3.4 — Settings, jurisdictions & API gateway

**Objective.** Institution configuration, compliance profiles, and the outward API shell.

#### Task 3.4.1 — Implement institution config, module toggles, and feature flags

- **Inputs:** Spec §4.20 (activated modules, flags, config).
- **Outputs:** settings.get/modules() expose config, module activation, and feature flags.
- **Files created:** `modules/settings/config/`
- **Files modified:** `settings interface`
- **Verification steps:**
  - Toggling a module changes availability.
  - A feature flag gates a capability.
- **Manual QA steps:**
  - Disable an optional module via settings; confirm its surface disappears.

#### Task 3.4.2 — Implement jurisdiction profiles (UK GDPR / EU GDPR / KSA PDPL)

- **Inputs:** Spec §13 compliance by configuration.
- **Outputs:** Selectable jurisdiction profiles wiring consent, retention, and erasure policy.
- **Files created:** `modules/settings/jurisdictions/`
- **Files modified:** `settings interface`, `packages/security (consent/retention)`
- **Verification steps:**
  - Selecting a profile applies its consent/retention rules.
  - Erasure honours the profile.
- **Manual QA steps:**
  - Switch profiles; confirm consent copy and retention behaviour change accordingly.

#### Task 3.4.3 — Add the sensitive-data category and handling

- **Inputs:** Spec §13 clinical/sensitive privacy.
- **Outputs:** A sensitive-data classification with stricter access and mandatory audit.
- **Files created:** `packages/security/sensitive-data`
- **Files modified:** `identity authorize() for sensitive resources`, `audit`
- **Verification steps:**
  - Sensitive resources require elevated authorization.
  - All access is audited.
- **Manual QA steps:**
  - Access a sensitive resource with and without rights; confirm gating and audit.

#### Task 3.4.4 — Stand up the versioned API gateway shell

- **Inputs:** Spec §4.20 (versioned outward surface, auth, rate limiting).
- **Outputs:** A versioned gateway routing to module interfaces, with auth and rate limiting; webhooks seam present.
- **Files created:** `modules/settings/api-gateway/`
- **Files modified:** `settings interface`
- **Verification steps:**
  - A versioned endpoint routes to a module interface.
  - Auth and rate limits apply at the gateway.
- **Manual QA steps:**
  - Call a v1 endpoint with and without auth; confirm behaviour and version isolation.

#### Task 3.4.5 — Publish the Security Guide and interface docs

- **Inputs:** Spec §18 Security Guide.
- **Outputs:** Security Guide published; Identity/Settings interfaces documented; DSAR/erasure runbook included.
- **Files created:** —
- **Files modified:** `docs/guides/security.md`, `module interface docs`
- **Verification steps:**
  - Guide covers controls, RBAC, secrets, compliance, data handling.
  - Runbook is actionable.
- **Manual QA steps:**
  - Follow the DSAR runbook against a test user; confirm erasure completes.

