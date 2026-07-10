# Continuum Platform — P7: Community, Courses & Membership

> **Part of:** Continuum Platform Master Implementation Programme
>
> **Specification reference:** Spec Phase 7 (§19), §12 (Community/Membership/Portals), and module specs §4.13 (Courses), §4.14 (Community & Membership).
>
> **Duration:** 2 weeks · **Tier:** Engagement

Turn audiences into members and learners. Membership tiers and entitlements, role-specific portals (Student, Practitioner, Research), Courses with progress and certificates, forums/events, and recognition — all composed from existing primitives.

---

## Objectives

- Implement Membership (§4.14): tiers, entitlements, and lifecycle (join, renew, lapse).
- Implement role-specific portals (Student, Practitioner, Research) as configured surfaces over shared primitives.
- Implement Courses (§4.13): curriculum, enrolment, progress, assessment, and certificates.
- Implement Community: forums/discussion, events, and recognition/badging, with AI moderation.
- Compose — not rebuild — using Identity, Payments, Courses, Community, and Notifications.

## Deliverables

- modules/membership with tiers, entitlements, and lifecycle.
- modules/courses with enrolment, progress, assessment, and certificate issuance.
- modules/community with forums, events, and recognition.
- Student/Practitioner/Research portal surfaces differentiated by entitlement, not code.
- Community/Courses content and interfaces documented.

## Repository changes

- Add modules/membership, modules/courses, modules/community.
- Add portal surfaces to apps/shell composed from primitives + entitlements.
- Wire course enrolment to Commerce/Payments and certificates to recognition.
- Wire forum content through AI moderation (Phase 4).

## Folder structure

```
modules/
├── membership/
│   ├── tiers/          # tiers + entitlements
│   ├── lifecycle/      # join, renew, lapse
│   └── interface/      # membership.tier / entitlements + events
├── courses/
│   ├── structure/      # course/module/lesson, prerequisites
│   ├── enrolment/      # enrol, progress
│   ├── assessment/     # assessment + certificates
│   ├── assistant/      # course-scoped AI assistant
│   └── interface/      # courses.enrol / progress + events
└── community/
    ├── forums/         # discussion (AI-moderated)
    ├── events/         # gatherings (online/in person)
    ├── recognition/    # certificates, badges
    └── interface/      # community events
```

## Modules affected

- Membership (§4.14)
- Courses (§4.13)
- Community (§4.14)
- Identity — auth/roles
- Payments/Commerce — enrolment/membership billing
- Notifications — lifecycle emails
- AI — course assistant + moderation
- CMS/Media — course content

## Interfaces to implement

- membership.tier(user) / membership.entitlements(user).
- Events: member.joined, member.lapsed, badge.awarded.
- courses.enrol(user, course) / courses.progress(user, course).
- Events: lesson.completed, course.completed, certificate.issued.
- Community: forum, events, and recognition surfaces (composed).

## External services

- No new external vendors — composes Identity, Payments/Commerce, Notifications, AI, CMS/Media.
- Optional: a calendar/events integration for community events.

## Environment variables

| Variable | Purpose | Required |
| --- | --- | --- |
| CERTIFICATE_SIGNING_KEY | Signs issued certificates (secret manager). | yes |
| COMMUNITY_MODERATION_ENABLED | Toggles AI moderation on forums. | no (defaults on) |
| EVENTS_CALENDAR_API_KEY | Optional calendar integration. | no |

## Acceptance criteria

- Members join, renew, and are recognised; entitlements gate access correctly.
- Portals differ by entitlement and content, not by bespoke code.
- Learners enrol, progress, and receive certificates on completion.
- Forums are AI-moderated; events schedule and notify; recognition/badging works.
- Enrolment/membership billing composes Commerce/Payments without duplicating logic.

## Testing requirements

- Unit: entitlement resolution, tier lifecycle, progress tracking, certificate issuance, badge rules.
- Integration: purchase → membership.joined → portal access; enrol → progress → course.completed → certificate.issued.
- Access control: a lapsed member loses gated access; portal surfaces reflect entitlements.
- Moderation: a forum post violating policy is screened.

## Production readiness checklist

- [ ] Certificates signed and verifiable; issuance is idempotent.
- [ ] Entitlement checks route through Identity.authorize().
- [ ] Membership lifecycle emails consent-aware via Notifications.
- [ ] Forum moderation enforced; abuse-reporting path exists.
- [ ] Portal performance within budgets; no N+1 entitlement checks.

## Risks

| Risk | Description | Mitigation |
| --- | --- | --- |
| Entitlement sprawl | Ad-hoc access checks bypass Membership. | Resolve all access via membership.entitlements + authorize(); review for direct checks. |
| Portal duplication | Portals fork into bespoke code. | One portal engine parameterised by entitlement/content; forbid per-portal logic. |
| Certificate integrity | Forged or unverifiable certificates. | Signed certificates with a verification endpoint; idempotent issuance. |
| Moderation gaps | Harmful forum content slips through. | AI moderation + human reporting/queue; escalation path. |

## Dependencies

- Phase 3 (identity/roles/authorize).
- Phase 4 (AI moderation + course assistant).
- Phase 5 (notifications, workflows).
- Phase 6 (payments/commerce for paid membership/courses).

## Documentation updates

- Document Membership, Courses, and Community interfaces.
- ADR: portal-as-configuration pattern; certificate signing/verification.
- Update Platform Guide with community/courses activation and portal configuration.
- Update Editorial Guide with course-content authoring.

---

## Milestones & tasks

### Milestone 7.1 — Membership & entitlements

**Objective.** Tiered membership with entitlement-based access.

#### Task 7.1.1 — Implement membership tiers and entitlements

- **Inputs:** Spec §4.14 tiers/entitlements.
- **Outputs:** membership.tier(user)/entitlements(user); entitlement checks integrate with authorize().
- **Files created:** `modules/membership/tiers/`, `modules/membership/interface/`
- **Files modified:** `identity authorize() entitlement source`, `prisma (membership)`
- **Verification steps:**
  - Entitlements resolve per tier.
  - authorize() honours entitlements.
- **Manual QA steps:**
  - Assign a tier; confirm gated resources open/close accordingly.

#### Task 7.1.2 — Implement membership lifecycle

- **Inputs:** Spec §4.14 lifecycle (join, renew, lapse); Payments.
- **Outputs:** Join/renew/lapse transitions; member.joined/lapsed events; billing via Payments.
- **Files created:** `modules/membership/lifecycle/`
- **Files modified:** `membership interface`, `payments integration`
- **Verification steps:**
  - Join grants entitlements; lapse revokes them.
  - Events emitted.
- **Manual QA steps:**
  - Simulate a lapse; confirm access revocation and event.

### Milestone 7.2 — Courses

**Objective.** Structured learning with progress and certificates.

#### Task 7.2.1 — Implement course structure and prerequisites

- **Inputs:** Spec §4.13 (course/module/lesson, sequencing, prerequisites); CMS course content.
- **Outputs:** Course/module/lesson model with sequencing and prerequisites, sourced from CMS/Media.
- **Files created:** `modules/courses/structure/`, `modules/courses/interface/`
- **Files modified:** `prisma (courses)`
- **Verification steps:**
  - Courses render structured lessons.
  - Prerequisites gate progression.
- **Manual QA steps:**
  - Attempt a locked lesson; confirm prerequisite gating.

#### Task 7.2.2 — Implement enrolment and progress

- **Inputs:** Spec §4.13 enrolment/progress; Commerce/Payments for paid courses.
- **Outputs:** courses.enrol/progress; lesson.completed events; paid enrolment via Commerce/Payments.
- **Files created:** `modules/courses/enrolment/`
- **Files modified:** `courses interface`, `commerce/payments integration`
- **Verification steps:**
  - Enrolment grants access.
  - Progress persists; lesson.completed emitted.
- **Manual QA steps:**
  - Enrol (free and paid), complete a lesson; confirm progress and events.

#### Task 7.2.3 — Implement assessment and certificate issuance

- **Inputs:** Spec §4.13 assessment/certificates; CERTIFICATE_SIGNING_KEY.
- **Outputs:** Assessment + signed certificate on completion; course.completed/certificate.issued events.
- **Files created:** `modules/courses/assessment/`
- **Files modified:** `courses interface`, `community recognition link`
- **Verification steps:**
  - Completion issues a signed certificate.
  - Certificate verifies via endpoint.
- **Manual QA steps:**
  - Complete a course; confirm certificate issuance and verification.

#### Task 7.2.4 — Wire the course-scoped AI assistant

- **Inputs:** Spec §4.13, §10 (Course Assistant scoped to materials).
- **Outputs:** A course assistant answering within the course's scope via the AI RAG pipeline.
- **Files created:** `modules/courses/assistant/`
- **Files modified:** `courses interface`, `ai persona config`
- **Verification steps:**
  - Assistant answers from course materials with citations.
  - It refuses out-of-scope questions.
- **Manual QA steps:**
  - Ask in-scope and out-of-scope questions; confirm grounding and boundaries.

### Milestone 7.3 — Community, portals & recognition

**Objective.** Participation surfaces and recognition, composed from primitives.

#### Task 7.3.1 — Implement forums with AI moderation

- **Inputs:** Spec §4.14 forums; §10 moderation.
- **Outputs:** Forum discussion screened by ai.moderate(); reporting queue for humans.
- **Files created:** `modules/community/forums/`, `modules/community/interface/`
- **Files modified:** `ai moderation integration`
- **Verification steps:**
  - Posts are moderated.
  - Reported content enters a review queue.
- **Manual QA steps:**
  - Post disallowed content; confirm moderation and reporting path.

#### Task 7.3.2 — Implement events

- **Inputs:** Spec §12 events; CMS Event type; Booking/Notifications.
- **Outputs:** Event scheduling (online/in person) with notifications; optional calendar integration.
- **Files created:** `modules/community/events/`
- **Files modified:** `community interface`, `notifications integration`
- **Verification steps:**
  - Events schedule and notify attendees.
  - Calendar integration optional and non-blocking.
- **Manual QA steps:**
  - Create an event; confirm attendee notification.

#### Task 7.3.3 — Implement recognition and badging

- **Inputs:** Spec §4.14 recognition; certificate link.
- **Outputs:** Badges/recognition with badge.awarded events; tied to course/membership milestones.
- **Files created:** `modules/community/recognition/`
- **Files modified:** `community interface`
- **Verification steps:**
  - Badges award on milestones.
  - badge.awarded emitted.
- **Manual QA steps:**
  - Trigger a milestone; confirm badge award and event.

#### Task 7.3.4 — Assemble Student/Practitioner/Research portals

- **Inputs:** Spec §12 (portals as configured surfaces over shared primitives).
- **Outputs:** Three portals differentiated by entitlement/content configuration, no per-portal logic.
- **Files created:** `apps/shell portal surfaces (configured)`
- **Files modified:** `membership/community/courses composition`
- **Verification steps:**
  - Each portal shows the right surfaces per entitlement.
  - No bespoke per-portal code exists.
- **Manual QA steps:**
  - Log in as each role; confirm the correct portal composition appears.

