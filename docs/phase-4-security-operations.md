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

*This document should be reviewed annually and immediately after any
security incident or regulatory change.*
