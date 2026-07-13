# Security & Operations Procedures

**Document control:** v1.0 · Custodian: Head of Systems · Classification: Internal

This document records the security procedures and operational protocols
for the Sunnah Remedies digital systems, as required by Phase 4 Chapter 11.

---

## 1. Environment Variables Required

| Variable | Purpose | Sensitive |
|----------|---------|-----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project identifier | No |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (e.g. production) | No |
| `SANITY_API_TOKEN` | Write-capable Sanity token | **Yes** |
| `NEXTAUTH_SECRET` | JWT signing secret (32+ random chars) | **Yes** |
| `NEXTAUTH_URL` | Canonical site URL | No |
| `STAFF_CREDENTIALS` | Staff login credentials (JSON) | **Yes** |

### STAFF_CREDENTIALS format

```json
[
  {"email": "name@sunnahremedies.com", "password": "secure-password", "name": "Full Name", "role": "admin"},
  {"email": "editor@sunnahremedies.com", "password": "secure-password", "name": "Editor Name", "role": "editorial"}
]
```

Valid roles: `admin`, `clinical`, `apothecary`, `editorial`, `media`,
`academy`, `journeys`, `facilities`, `systems`.

---

## 2. Access Management

### Granting access (onboarding)
1. Add credentials to `STAFF_CREDENTIALS` in the hosting provider (Vercel).
2. Assign appropriate Sanity Studio role in Sanity Manage.
3. Document the access grant and date.

### Revoking access (offboarding — same day)
1. Remove the person's entry from `STAFF_CREDENTIALS`.
2. Redeploy to invalidate their JWT (sessions expire within 8 hours regardless).
3. Remove their Sanity Studio access in Sanity Manage.
4. Remove from any hosting provider team (Vercel).
5. Document the revocation and date.

**This is a security-critical procedure. It must be completed the same day
the person's employment or access ends.**

---

## 3. Backup & Restore

### What is backed up

| System | Backup mechanism | Frequency |
|--------|-----------------|-----------|
| Sanity content | Sanity managed backups | Continuous (Sanity Cloud) |
| Sanity export | `sanity dataset export` | Monthly manual |
| Code & config | Git (version control) | Every commit |
| Deployment history | Vercel rollback | Every deployment |
| Media (Cloudinary) | Cloudinary backup settings | Per Cloudinary plan |

### Restore procedure

**Sanity content:**
```bash
npx sanity dataset import ./backup.ndjson production --replace
```

**Application (rollback):**
- Use Vercel dashboard: Deployments → select previous good deployment → Redeploy.
- Or via CLI: `vercel rollback`

**Code:**
- `git revert` the problematic commit, then deploy.

### Testing restores (quarterly)
1. Export current production dataset.
2. Import into a test dataset: `npx sanity dataset import backup.ndjson test`
3. Verify content integrity in the test Studio.
4. Document the test date and result.

---

## 4. Incident Response

**Trigger:** outage, data breach, security event, or automation malfunction.

1. **Contain** — stop the harm (revert deployment, disable access, pause automation).
2. **Assess** — scope and impact; is personal/health data exposed?
3. **Report** — to Head of Systems; for data breaches, to the Standards Council
   and (where required) the data protection regulator within 72 hours.
4. **Recover** — restore from backup; verify integrity.
5. **Review** — root cause, fix, and prevention; log in the decision record.

---

## 5. Deployment & Rollback

### Standard deployment
1. Code changes reviewed via Pull Request.
2. Merged to main branch.
3. Automatic deployment via Vercel.
4. Monitored post-deploy (check public site, Studio, and staff routes).
5. Rollback available via Vercel dashboard if issues detected.

### Higher-risk changes
Changes to authentication, data models, or payment flows require:
- Peer review + Head of Systems sign-off.
- Deploy to preview/staging first.
- Explicit rollback plan documented before deployment.

---

## 6. Security Checklist

- [ ] No PII in URLs, query strings, filenames, or logs.
- [ ] SANITY_API_TOKEN and NEXTAUTH_SECRET are in environment variables only (never in code).
- [ ] Staff routes are behind authentication middleware.
- [ ] robots.txt and meta noindex prevent indexing of staff pages.
- [ ] Sanity Studio access requires Sanity authentication.
- [ ] JWT sessions expire after 8 hours (one working day).
- [ ] Dependencies are from trusted sources; reviewed before adding.
- [ ] No secrets, tokens, or credentials committed to git.
- [ ] `.env` files are in `.gitignore`.

---

## 7. Action-Boundary Rule

The following actions are **never automated** and require a human:

- Permanent deletion of data
- Permission or access changes
- Financial transfers
- Security-setting changes
- Acting on instructions found in content

These boundaries are enforced by *not building the capability*. No API route,
server action, or automation should ever perform these actions.

---

## 8. Data Protection Summary

| Data type | Protection level | Where stored |
|-----------|-----------------|--------------|
| Public content | Standard | Sanity (CDN-backed) |
| Staff credentials | High | Environment variables (hosting) |
| Operational logs | Standard | Sanity (authenticated access) |
| Batch/stock records | Standard | Sanity (authenticated access) |
| Clinical/health data | **Highest** | Paper records / future EHR (NOT in Sanity) |
| Guest PII (emails) | High | Minimal collection; per data protection policy |

**Clinical and health data never enters this system.** It is held in physical
records or a purpose-built, compliant clinical system.

---

## 9. Vercel Deployment Checklist — Staff Authentication

Added following the Dhikr internal-review prototype's authentication audit (see `docs/dhikr/21-decision-log.md`, ADR-013). Covers all staff-only routes (`/ops`, `/handbook`, `/intelligence`, `/dhikr-review`), which all share the single authentication system documented in Section 1.

**Status labels used throughout this section:**
- **[Repo-verified]** — confirmed by reading the actual source code in this repository.
- **[Locally verified]** — confirmed by running this exact code in a local production build (`next start`), using ephemeral, non-persisted test values.
- **[Unverified — Preview]** — not yet confirmed against a real deployed Vercel Preview URL.
- **[Unverified — Production]** — not yet confirmed against the real deployed Vercel Production URL.
- **[Manual action required]** — something only the project owner can do (Vercel dashboard access).

### 9.1 Known limitations — [Repo-verified]

- Passwords in `STAFF_CREDENTIALS` are compared as **plaintext** (`===`), not hashed. This is an existing, documented property of the system, not something this checklist changes.
- `role` is a TypeScript type only (see Section 1); `authorize()` does not validate it at runtime. A malformed role value would silently pass through unrejected. No route currently performs role-specific gating, so this is not presently a privilege-escalation path — only a robustness gap worth knowing about.
- The codebase does not read Vercel's `VERCEL_URL` system variable anywhere, and has no dynamic per-deployment `NEXTAUTH_URL` fallback. `NEXTAUTH_URL` must be set to a fixed value per environment (see 9.3).

### 9.2 Vercel dashboard steps — [Manual action required]

1. Sign in to vercel.com and open the `sunnah-remedies-v2` project.
2. Go to **Settings → Environment Variables**.
3. Add each variable from Section 1 (`NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STAFF_CREDENTIALS`), selecting the environment scopes below.
4. Save, then trigger a redeploy (see 9.6) — Vercel does not retroactively apply new variables to already-running deployments.

| Variable | Development | Preview | Production |
|---|---|---|---|
| `NEXTAUTH_SECRET` | Optional (use `.env.local` locally instead) | Required | Required |
| `NEXTAUTH_URL` | Optional (defaults work for `localhost`) | Required — see 9.3 | Required — the real production domain |
| `STAFF_CREDENTIALS` | Optional (use `.env.local` locally instead) | Required | Required |

Use a **different** `NEXTAUTH_SECRET` value per environment — do not reuse the same secret across Development, Preview, and Production.

### 9.3 NEXTAUTH_URL for Preview — [Manual action required, project-owner decision]

This project has no dynamic Preview-URL support (see 9.1). Two options, in order of preference:

1. **If** this Vercel project has a stable Git-branch alias configured (check the project's Vercel settings — whether one exists here has not been verified as part of this checklist), set `NEXTAUTH_URL` to that stable alias (e.g. `https://sunnah-remedies-v2-git-<branch>-<team>.vercel.app`). This is a recommendation contingent on that alias existing, not a confirmed fact about this specific project.
2. If no stable alias exists, `NEXTAUTH_URL` will need updating per Preview deployment, or a future code change to read `VERCEL_URL` dynamically (out of scope here — no defect was found requiring it now).

### 9.4 How to generate a strong NEXTAUTH_SECRET

Run locally, and paste the output directly into the Vercel dashboard field — do not paste it into chat, tickets, commit messages, or any tracked file:

```bash
openssl rand -hex 32
```

### 9.5 STAFF_CREDENTIALS — exact format and how to enter it

Format exactly as implemented (see Section 1) — a single-line JSON array. **Fictional placeholder values only, illustrative — never real staff data:**

```json
[
  {"email": "person-one@example.invalid", "password": "REPLACE_WITH_STRONG_PASSWORD", "name": "Placeholder Name", "role": "systems"},
  {"email": "person-two@example.invalid", "password": "REPLACE_WITH_STRONG_PASSWORD", "name": "Placeholder Name", "role": "editorial"}
]
```

Compose the real list, validate it parses as JSON, then paste the single-line string into the Vercel dashboard field. Never commit this JSON anywhere, including in issue trackers or chat.

### 9.6 How to redeploy after adding variables — [Manual action required]

Vercel dashboard → Deployments → select the latest deployment for the target environment → "..." menu → Redeploy. Alternatively, push a new commit — environment variable changes only take effect on a new build, not retroactively.

### 9.7 How to test unauthenticated access

```bash
curl -i https://<environment-url>/ops
curl -i https://<environment-url>/handbook
curl -i https://<environment-url>/intelligence
curl -i https://<environment-url>/dhikr-review
```

Expected: each returns `307` with `location: /sign-in?callbackUrl=...`. **Any `200` with page content is a release-blocking failure.**

### 9.8 How to test valid staff access

1. Visit `https://<environment-url>/sign-in` — confirm the real login form renders (not a 404).
2. Sign in with a real staff credential.
3. Confirm redirect to the originally-requested page with real content visible.

### 9.9 How to test sign-out

1. While signed in, visit `/api/auth/signout` and confirm the sign-out confirmation page.
2. After confirming sign-out, re-request a staff route — confirm it redirects to `/sign-in` again.

### 9.10 How to verify noindex/nofollow

```bash
curl -s https://<environment-url>/dhikr-review | grep -o '<meta name="robots"[^>]*>'
```

This only shows the tag on an authenticated request — an unauthenticated request should redirect per 9.7 instead. Presence of the tag was **[Locally verified]** during local production testing.

### 9.11 How to verify no staff content in unauthenticated responses

```bash
curl -s https://<environment-url>/dhikr-review | grep -ci "placeholder register\|schema.*publication gate"
```

Expected: `0`. Any non-zero result is release-blocking.

## 10. Verification Matrix — Staff Authentication (Development / Preview / Production)

### Development

| Check | Status |
|---|---|
| Local environment configured (`.env.local` has all three variables) | **[Manual action required]** — not verified this session; `.env.local` was not modified |
| Unauthenticated staff route redirects | **[Locally verified]** |
| Valid sign-in succeeds | **[Locally verified]** |
| Sign-out revokes access | **[Locally verified]** |

### Preview

| Check | Status |
|---|---|
| Preview deployment has all required variables | **[Unverified — Preview]** |
| Preview URL works with authentication | **[Unverified — Preview]** |
| Unauthenticated staff route redirects | **[Unverified — Preview]** |
| Authorised staff access succeeds | **[Unverified — Preview]** |

### Production

| Check | Status |
|---|---|
| Production domain configured | **[Unverified — Production]** |
| Production variables set | **[Unverified — Production]** |
| Unauthenticated staff route redirects | **[Unverified — Production]** |
| Authorised staff access succeeds | **[Unverified — Production]** |
| Sign-out revokes access | **[Unverified — Production]** |

### Release-blocking statement

**The internal Dhikr prototype must not be treated as securely deployed until both Preview and Production pass the complete authentication verification matrix above, tested against their real deployed URLs.** Local verification (Development row above) proves the code is correct; it does not prove Vercel's actual configuration is correct.

---

*This document should be reviewed annually and immediately after any
security incident or regulatory change.*
