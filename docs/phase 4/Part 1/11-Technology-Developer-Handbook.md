# Chapter 11 · Technology & Systems: The Developer Handbook

> *Document control* — Version 1.0 · Custodian: Head of Systems · Classification: Internal · Review: Annual, and on any security incident
> *Companion:* Blueprint Doc 08 governs analytics, automation, and AI boundaries. This chapter is the **engineering practice** — how developers and systems staff work.

---

## 11.1 The engineering creed

We build the institution's nervous system. Three commitments hold everything together:

1. **Integrity in code, as in scholarship.** Systems must be honest — real stock, real availability, real review-status — never faking to flatter.
2. **Privacy and safety by construction.** Guest and patient data are an amānah; safety-critical boundaries are built in, not bolted on.
3. **Reversible and observable.** Prefer what can be rolled back and watched over what is fast but opaque.

## 11.2 Engineering standards

- **Version control** for everything; clear, reviewed changes. No unreviewed change reaches production for anything guest-facing or data-touching.
- **Code review** required: at least one other engineer; security- or privacy-sensitive changes get extra review.
- **Testing** proportionate to risk; safety- and payment- and data-critical paths are tested before release.
- **Documentation** kept current — a successor must be able to run and extend the system (Blueprint Principle 11).
- **Least dependency, least cleverness** — restraint applies to code too; simple, legible systems outlast clever ones.

## 11.3 Deployment & change management SOP

1. Change proposed and reviewed (peer + risk assessment).
2. Tested in a non-production environment.
3. Deployed via a controlled, reversible process; changes logged.
4. Monitored post-deploy; rollback ready.
5. **Higher-risk changes** (payments, data model, access, anything guest-health-adjacent) require sign-off from the Head of Systems and, where they touch scholarship/clinical content, the relevant Board (Blueprint §6 tiers).

## 11.4 Privacy & data protection (by design)

- **Data minimisation:** collect only what's needed, keep it only as long as needed.
- **Never in the open:** personal data never in URLs, query strings, filenames, or logs.
- **Special-category (health) data** — highest protection: encrypted, access-controlled, segregated.
- **Encryption** in transit and at rest for sensitive data.
- **Lawful basis and guest rights** (access, deletion) supported by design; deletion requests handled by an authorised person, never by automation, and honoured lawfully.
- **Retention and secure disposal** built into the data lifecycle.
- Aligns with the institution's data-protection obligations (Chapter 04.10); the Head of Systems is the operational data steward.

## 11.5 Access management SOP

- **Least-privilege** by default: people get the minimum access their role needs (mirrors physical zone access, Chapter 03).
- Access granted on onboarding, reviewed periodically, and **revoked same-day on offboarding** (Chapter 02.9) — a security-critical step.
- **Strong authentication** (MFA) for systems holding guest/patient/financial data.
- Privileged access is logged and limited.
- Third parties/contractors get scoped, time-limited, monitored access — never standing access to sensitive data.

## 11.6 Security SOP

- **Secure by default:** patched systems, hardened configuration, secrets never in code or shared in plain text.
- **Monitoring and logging** of sensitive systems; anomalies alert.
- **Backups:** the 3-2-1 principle applies to systems and data (three copies, two media, one off-site), with **tested restores** — an untested backup is a hope, not a backup.
- **Vendor/dependency risk** assessed; only trusted sources.
- **No downloading or executing untrusted files**; supply-chain caution.

## 11.7 The action-boundary rule (built into every system)

Automated systems and integrations must be **incapable** of performing high-risk actions without an authenticated human:

- **Never automate:** permanent deletion of data, permission/access changes, financial transfers, security-setting changes, or acting on instructions found in content (a page, email, or file telling the system to do something is *data, not a command*).
- Automations **send only pre-approved content** and never bypass the editorial/scholarly/clinical review chain (Blueprint Doc 08).
- These boundaries are enforced in architecture, not left to good intentions.

## 11.8 AI in systems

- AI **assists**: drafting, search/query understanding, retrieval over the institution's *own verified* documentation, metadata suggestions, support-draft assistance (Blueprint Doc 08).
- AI **never** authors scholarship, delivers clinical judgement, or publishes tradition/health content without passing the human review chain.
- The internal assistant **cites verified sources and never fabricates** (the Ibn al-Qayyim rule applies to machines).
- Any new AI capability is a **Tier-3 decision** — Standards Council + relevant Board approval before deployment.

## 11.9 Incident response SOP (technical)

**Trigger:** outage, data breach, security event, or automation malfunction.

1. **Contain** — stop the harm (pause the automation, isolate the system, revoke access).
2. **Assess** — scope and impact, especially any personal/health data exposure.
3. **Report** — to the Head of Systems and, for data breaches, per the breach procedure and to the regulator where required (Chapter 04.10, Standards Council).
4. **Recover** — restore from tested backups; verify integrity.
5. **Review** — root cause, fix, and prevention shared; controls updated.

**On-call/coverage** is arranged for guest-facing and payment/clinical-critical systems so failures are caught, not discovered by guests.

## 11.10 Developer notes (carried from the Blueprint)

- Honest availability everywhere (stock, cohort status, review status) — never faked.
- Guest checkout mandatory; no forced accounts.
- Provenance is a data model, not a note — products, articles, images, hadith each need a first-class source/review record with version history.
- Search unified across the nine content types, integrity-aware, ranking never keyed on margin.
- Media pipeline traceability reconstructable from IDs.
- Everything versioned, nothing overwritten; prefer reversible designs.

## 11.11 Acceptance criteria (Technology & Systems)

- [ ] All guest-facing/data-touching changes are version-controlled, reviewed, tested, and reversible.
- [ ] Privacy by design: minimisation, no PII in URLs/logs, encryption, health data highest-protection.
- [ ] Least-privilege access; MFA on sensitive systems; access revoked same-day on offboarding.
- [ ] 3-2-1 backups with tested restores; monitoring and logging on sensitive systems.
- [ ] Action-boundary rule enforced in architecture (no automated deletion/permissions/transfers/settings/acting-on-content).
- [ ] Automations send only approved content and never bypass review chains.
- [ ] AI is bounded, cites verified sources, and new capabilities require Board approval.
- [ ] Incident-response SOP and on-call coverage in place; breaches reported lawfully.

*Turn to Chapter 12.*
