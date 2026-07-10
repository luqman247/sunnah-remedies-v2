# Continuum Platform — P5: Operations & Notifications

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 5 (§19), §11 (Operations & Automation), and module specs §4.17 (Operations), §4.15 (Notifications), §4.11 (CRM).
>
> **Duration:** 2 weeks · **Tier:** Intelligence

Automate back-office work and communications. A durable job runner, scheduler, and declarative workflow engine drive indexing, embeddings, emails, and syncs; Notifications delivers consent-aware messages; CRM holds the canonical relationship record.

---

## Objectives

- Implement Operations (§4.17): the workflow engine, durable jobs/queues, and scheduling.
- Move Phase 4's interim inline indexing/embedding onto durable background jobs.
- Implement Notifications (§4.15): channel adapters (email via Resend), templated in the design system, consent-enforced.
- Implement CRM (§4.11): the canonical relationship record, segments, tags, and consent state.
- Provide operational dashboards and job/workflow health with alerting.

## Deliverables

- modules/operations with jobs, scheduler, and a declarative workflow engine.
- modules/notifications with email (Resend) and an in-app channel, consent-aware.
- modules/crm with contacts/organisations, segments, and consent.
- Operational dashboards; Operations Guide published (§18).

## Repository changes

- Add modules/operations, modules/notifications, modules/crm.
- Implement the queue/scheduler infrastructure and the email adapter (Resend).
- Migrate content/media indexing+embedding subscriptions to durable jobs.
- Add CRM sync satellite pattern (canonical in-platform; marketing tools as satellites).

## Folder structure

```
modules/
├── operations/
│   ├── jobs/           # durable job runner + retries
│   ├── scheduler/      # cron-style scheduled tasks
│   ├── workflows/      # declarative, event-triggered workflows
│   ├── dashboards/     # job/workflow health
│   └── interface/      # ops.enqueue / schedule / workflow
├── notifications/
│   ├── channels/       # email (Resend), in-app
│   ├── templates/      # design-system-based templates
│   ├── consent/        # preference/consent enforcement
│   └── interface/      # notify.send
└── crm/
    ├── model/          # contacts, organisations, timeline
    ├── segments/       # segments, tags
    ├── consent/        # consent + preferences
    └── interface/      # crm.contact / segment / events
```

## Modules affected

- Operations (§4.17)
- Notifications (§4.15)
- CRM (§4.11)
- Search/Knowledge/Media — job consumers
- i18n — used by templates (basic here; full in Phase 8)

## Interfaces to implement

- ops.enqueue(job) / ops.schedule(cron, job) / ops.workflow(def).
- notify.send(template, audience, data).
- Events: notification.sent, notification.failed.
- crm.contact(id) / crm.segment(query).
- Events: contact.created, consent.changed.

## External services

- A managed queue + scheduler (durable jobs, retries, cron).
- Resend (transactional/lifecycle email) via the email adapter.
- A marketing/CRM satellite (e.g. HubSpot) fed by sync jobs (optional).

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| QUEUE_URL | Managed queue connection. | yes |
| SCHEDULER_* | Scheduler configuration. | yes |
| RESEND_API_KEY | Email provider key (secret manager). | yes |
| EMAIL_FROM | Default sender identity. | yes |
| CRM_SATELLITE_API_KEY | Marketing tool sync (optional, secret manager). | no |

## Acceptance criteria

- Workflows run reliably with retries and observability; failed jobs are re-drivable.
- Indexing/embedding now runs as durable jobs, off the editorial critical path.
- Email is templated in the design system and respects consent/preferences.
- CRM holds the canonical relationship record; marketing tools are satellites, not the source of truth.
- Operational dashboards show job/workflow health with alerting on failure.

## Testing requirements

- Unit: job serialisation/retry logic, workflow definition parsing, consent enforcement, segment queries.
- Integration: event → workflow → job → notification; failed job retried then dead-lettered; CRM sync round-trip.
- Reliability: job runner survives restart; scheduled task fires on time; idempotent re-runs.
- Consent: a message to an opted-out contact is suppressed.

## Production readiness checklist

- [ ] Dead-letter handling and re-drive tooling for failed jobs.
- [ ] Scheduler idempotency (no duplicate runs on redeploy).
- [ ] Email deliverability configured (SPF/DKIM); bounce/complaint handling.
- [ ] Dashboards + alerts wired to on-call.
- [ ] CRM canonical record backed up; satellite sync failures alert but don't corrupt the canon.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Job storms | Retries or fan-out overwhelm the system. | Backoff, concurrency limits, dead-letter queues, and rate control. |
| Duplicate scheduling | Redeploys double-fire cron. | Idempotent scheduling with run locks/keys. |
| Consent violations | Messages sent without consent. | Consent check inside notify.send; suppress and log on opt-out. |
| CRM divergence | Satellite becomes de facto source of truth. | One-way canonical→satellite sync; conflict resolution favours the canon. |

## Dependencies

- Phase 0 (Core, events).
- Phase 2 (content/media events to process).
- Phase 3 (identity/consent, secrets).
- Phase 4 (indexing/embedding to move onto jobs).

## Documentation updates

- Publish the Operations Guide (§18): workflows, jobs, monitoring, incident response.
- Document Operations, Notifications, and CRM interfaces.
- ADR: queue/scheduler choice and the canonical-CRM/satellite pattern.
- Update Deployment Guide with queue/scheduler and email DNS setup.

---

## Milestones & tasks

### Milestone 5.1 — Jobs, queues & scheduler

**Objective.** Durable background execution the platform can rely on.

#### Task 5.1.1 — Implement the durable job runner

- **Inputs:** Spec §4.17 (durable, retryable jobs); QUEUE_URL.
- **Outputs:** ops.enqueue(job) with retries, backoff, and dead-lettering.
- **Files created:** `modules/operations/jobs/`, `modules/operations/interface/`
- **Files modified:** `operations interface`
- **Verification steps:**
  - A job runs and completes.
  - A failing job retries then dead-letters.
- **Manual QA steps:**
  - Enqueue a failing job; confirm retries then dead-letter; re-drive it.

#### Task 5.1.2 — Implement the scheduler

- **Inputs:** Spec §4.17 scheduling (cron).
- **Outputs:** ops.schedule(cron, job) with idempotent runs.
- **Files created:** `modules/operations/scheduler/`
- **Files modified:** `operations interface`
- **Verification steps:**
  - A scheduled task fires on time.
  - Redeploy does not double-fire.
- **Manual QA steps:**
  - Schedule a short-interval task; redeploy; confirm no duplicate runs.

#### Task 5.1.3 — Migrate indexing/embedding to durable jobs

- **Inputs:** Phase 4 interim inline handlers; Spec §9.2.
- **Outputs:** content.published/media.uploaded enqueue index/embed jobs instead of inline work.
- **Files created:** —
- **Files modified:** `search/knowledge event subscriptions`, `operations jobs`
- **Verification steps:**
  - Publish enqueues jobs, not inline work.
  - Editorial actions are not blocked by indexing.
- **Manual QA steps:**
  - Publish under load; confirm the editor is not blocked and indexing completes async.

### Milestone 5.2 — Workflow engine

**Objective.** Declarative, event-triggered automation across modules.

#### Task 5.2.1 — Implement the declarative workflow engine

- **Inputs:** Spec §4.17, §11 (event-triggered workflows).
- **Outputs:** ops.workflow(def) runs multi-step, event-triggered flows via module interfaces.
- **Files created:** `modules/operations/workflows/`
- **Files modified:** `operations interface`
- **Verification steps:**
  - A defined workflow executes its steps in order.
  - Steps call module interfaces, not internals.
- **Manual QA steps:**
  - Define a two-step workflow; trigger it; confirm ordered execution.

#### Task 5.2.2 — Author reference workflows

- **Inputs:** Spec §11 example (order.created → provision → notify → update CRM).
- **Outputs:** Reference workflow definitions demonstrating cross-module orchestration (some steps stubbed until their modules exist).
- **Files created:** `examples/workflows/`
- **Files modified:** —
- **Verification steps:**
  - Reference workflows validate.
  - Stubbed steps are clearly marked pending their phase.
- **Manual QA steps:**
  - Dry-run a reference workflow; confirm it validates and logs each step.

### Milestone 5.3 — Notifications

**Objective.** Consent-aware, design-system-templated messaging.

#### Task 5.3.1 — Implement the email adapter (Resend)

- **Inputs:** Spec §4.15, §2.4; Resend credentials.
- **Outputs:** The email adapter resolves to Resend behind the notifications interface.
- **Files created:** `packages/adapters/email-resend/`, `modules/notifications/channels/email`
- **Files modified:** `adapters index`, `notifications interface`
- **Verification steps:**
  - A test email sends.
  - No Resend SDK leaks outside the adapter.
- **Manual QA steps:**
  - Send a test email; confirm delivery and sender identity.

#### Task 5.3.2 — Build design-system email templates

- **Inputs:** Spec §4.15 (templates reuse the design system); Phase 1 tokens.
- **Outputs:** Reusable email templates composed from design-system tokens/components.
- **Files created:** `modules/notifications/templates/`
- **Files modified:** —
- **Verification steps:**
  - Templates render with tokens.
  - Rendered emails degrade gracefully across clients.
- **Manual QA steps:**
  - Preview templates in major email clients; confirm layout and branding.

#### Task 5.3.3 — Implement consent enforcement and notify.send

- **Inputs:** Spec §4.15 (preference/consent enforcement).
- **Outputs:** notify.send(template, audience, data) enforces consent and logs delivery; emits sent/failed events.
- **Files created:** `modules/notifications/consent/`
- **Files modified:** `notifications interface`
- **Verification steps:**
  - Opted-out recipients are suppressed.
  - sent/failed events emitted.
- **Manual QA steps:**
  - Send to a list including an opted-out contact; confirm suppression and logging.

#### Task 5.3.4 — Add an in-app notification channel

- **Inputs:** Spec §4.15 (in-app channel).
- **Outputs:** An in-app channel behind the same notify.send interface.
- **Files created:** `modules/notifications/channels/in-app`
- **Files modified:** `notifications interface`
- **Verification steps:**
  - In-app notifications deliver and mark read.
  - Channel selection routes correctly.
- **Manual QA steps:**
  - Trigger an in-app notification; confirm delivery and read state.

### Milestone 5.4 — CRM & dashboards

**Objective.** Canonical relationship record and operational visibility.

#### Task 5.4.1 — Implement the CRM data model and timeline

- **Inputs:** Spec §4.11 (contacts, organisations, timeline).
- **Outputs:** crm.contact(id) with a canonical relationship timeline; contact.created event.
- **Files created:** `modules/crm/model/`, `modules/crm/interface/`
- **Files modified:** `prisma schema (crm)`
- **Verification steps:**
  - Contacts/organisations persist with a timeline.
  - contact.created emitted.
- **Manual QA steps:**
  - Create a contact via interface; confirm the timeline records activity.

#### Task 5.4.2 — Implement segments, tags, and consent state

- **Inputs:** Spec §4.11 (segments, tags, consent).
- **Outputs:** crm.segment(query); tags and consent state with consent.changed events.
- **Files created:** `modules/crm/segments/`, `modules/crm/consent/`
- **Files modified:** `crm interface`
- **Verification steps:**
  - Segments resolve from queries.
  - Consent changes emit events.
- **Manual QA steps:**
  - Build a segment; change a contact's consent; confirm segment and event update.

#### Task 5.4.3 — Implement the satellite sync pattern

- **Inputs:** Spec §11 (canonical in-platform; marketing tools as satellites).
- **Outputs:** One-way canonical→satellite sync job; failures alert without corrupting the canon.
- **Files created:** `modules/crm sync job`
- **Files modified:** `operations jobs`
- **Verification steps:**
  - Canonical changes propagate to the satellite.
  - Satellite failure does not mutate the canon.
- **Manual QA steps:**
  - Break the satellite; confirm the canon is untouched and an alert fires.

#### Task 5.4.4 — Build operational dashboards and publish the Operations Guide

- **Inputs:** Spec §4.17 dashboards; §18 Operations Guide.
- **Outputs:** Job/workflow health dashboards with alerting; Operations Guide published; interfaces documented.
- **Files created:** `modules/operations/dashboards/`
- **Files modified:** `docs/guides/operations.md`, `interface docs`
- **Verification steps:**
  - Dashboards show job/workflow status.
  - Alerts fire on failure.
- **Manual QA steps:**
  - Force a job failure; confirm the dashboard reflects it and an alert is raised.

