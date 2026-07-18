# Phase 2C — Consultation booking journey

**Branch:** `feat/sr-comprehensive-ux-improvement`  
**Worktree:** `/Users/nikmaljabarzai/Desktop/sunnah-remedies-ux`  
**Date:** 18 July 2026  
**Status:** Production-safety correction applied — ready for Phase 2C commits  

**Scope boundary:** UX improvement of the existing mock consultation journey only. No Academy, commerce, Sacred Journeys registration, analytics, broad CMS translation, or visual rebrand.

---

## Production-safety correction (mandatory)

Public submission is a **consultation request**, not a confirmed booking.

| Mode | Behaviour |
|------|-----------|
| Production / default | Server action returns `contact_fallback`. UI shows correspondence path. **No** fabricated `SR-…` reference, **no** claim a slot is reserved, **no** claim an email was sent, **no** payment confirmation. |
| Local mock | Only when `ENABLE_MOCK_BOOKING_FLOW=true` **and** `NODE_ENV !== "production"`. References are `TEST-SR-…` and labelled as test data. |

Gate: `src/lib/booking/mock-gate.ts`. Submit: server action `submitConsultationAction` so the flag is never trusted from the client alone.

---

## Synchronisation (pre-Phase 2C)

| Item | Result |
|------|--------|
| Upstream on `origin/main` | `4e5f1f4` fix(dua-dhikr): enforce stable collection references; `11cc46a` Merge PR #13 |
| Overlap with UX branch | None |
| Social-sharing work | Not present in those commits |
| Rebase | `git rebase origin/main` — **succeeded, zero conflicts** |
| Backup | `backup/sr-ux-pre-main-sync` → pre-rebase tip `48c1d23676b485eec260852b848e414bc58b765d` |
| External safety files | Present: `~/Desktop/sr-ux-preapproval-snapshot.patch`, `~/Desktop/sr-eslint-next16-temp.config.mjs` |

### Six UX commits after rebase (new hashes)

| Hash | Subject |
|------|---------|
| `ebf33d502a63ce3b1a52d4b79be1e1ca1062a779` | fix: correct locale routing and static asset resolution |
| `68fe819d8032011ea62ee503b90b185a81a9bc67` | fix: protect public fixtures and publication states |
| `d2e6909b871f89451f2b9e27e9220054664fb82d` | feat: localise Danish global chrome and system states |
| `026a5658b6091d73993620d46875c1ad501f396d` | docs: record ux audit and phase verification |
| `57834955e2042f6ea807b8aaa4df3b6afa058008` | feat: clarify homepage tasks and global navigation |
| `55a4e28e5071204f7ec001e083141fe079dd9c9d` | docs: record homepage task clarity verification |

---

## Baseline (before edit)

Public booking is a **single-route progressive disclosure** at `/consultations` (`/dk/consultations`), fully **mocked** in `src/lib/booking/service.ts` — no Cal.com, Stripe, or customer email on this path.

| Aspect | Baseline |
|--------|----------|
| Step count | Progressive sections without discrete wizard chrome (~4 disclosure stages + submit) |
| Progress | None named |
| Back / Continue | Implicit scroll / progressive reveal only |
| Validation | Hardcoded English strings |
| Empty availability | Weak / unclear |
| Submit failures | Always succeeded |
| Refresh | Lost progress |
| Sensitive data in URL | Not present, but no intentional refresh policy |
| Safety | Mock-only — safe for local end-to-end |

### Major friction

1. Visitor could not see where they were in the journey.  
2. No clear Back/Continue.  
3. No-availability and API-error states were incomplete.  
4. Double-submit and recoverable failure were unhandled.  
5. Summary and success omitted payment timing / cancellation / preparation honesty.

---

## Architecture (after)

Five coherent steps on one route (data model already gender → clinic → schedule → details):

1. **Practitioner** (gender)  
2. **Clinic**  
3. **Date and time** (combined schedule)  
4. **Your details**  
5. **Review** → submit  

| Requirement | Implementation |
|-------------|----------------|
| Visible progress | `BookingProgress` + live status |
| Back / Continue | `BookingStepNav`; gated Continue |
| Retained selections | In-memory + `sessionStorage` draft `sr_booking_draft_v1` |
| Refresh | Restores draft; optional health notes **not** persisted; note in UI |
| URL | No patient/health query params |
| Summary | Live `BookingSummary`; mobile jump link; sticky CTA only on review (does not permanently obscure form) |
| Availability | Loading / ready / empty (Monday) / error (Tuesday first fetch) / unavailable slots (text + disabled) / correspondence fallback |
| Validation | Labels, required/optional, autocomplete, error summary, focus |
| Submit | Idle / submitting / success / failure; lock; stale → return to schedule; network keeps input |
| Confirmation | Server-issued mock reference; email expectation; preparation; cancellation → correspondence |
| EN / DA | Full `booking.*` catalogue parity for new chrome |

### Information deliberately not collected / not stored

- No address (not required for this mock clinic booking).  
- Optional reason + medical notes: collected for the request only; **medical notes and reason are stripped from session draft**.  
- No waiting-list promise.  
- No fabricated live payment or email.

### Safe test hooks (mock only)

| Trigger | Behaviour |
|---------|-----------|
| Normal email | Success + `SR-…` reference |
| Email containing `+stale@` | Stale slot |
| Email containing `+fail@` | Network failure |
| Monday date | Empty times + contact fallback |
| Tuesday date (first fetch) | Availability error; retry succeeds |

---

## Files touched (uncommitted)

- `src/app/[locale]/consultations/ConsultationsClient.tsx`  
- `src/components/booking/*` (progress, step nav, schedule, form, summary, success, clinic, practitioner, CSS)  
- Removed unused `DateSelector.tsx`, `TimeSelector.tsx`  
- `src/lib/booking/{types,service,draft-storage}.ts`  
- `src/messages/en.json`, `src/messages/da.json`  
- `tests/ux/booking-journey.smoke.ts`  
- Docs under `docs/ux/`

---

## Deferred

- Live Cal.com / payment / email wiring  
- Using Sanity CMS consultation payload in the wizard (fetched but still unused)  
- Named practitioner identities beyond gender pathways  
- Waiting lists  
- Academy / Apothecary / Sacred Journeys / analytics / broad DA CMS body  

---

## Verification summary

See `SR_UX_VERIFICATION_REPORT.md` Phase 2C section for routes, viewports, a11y, quality gates, and interaction sequence.
