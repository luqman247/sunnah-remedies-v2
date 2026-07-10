# 11 — Academy Standards

## Philosophy

The Academy transmits *Tibb al-Nabawi* through close reading, citation, and supervised clinical practice. It is an educational institution, not a training company. Every programme is structured by:

1. Chain of transmission (*isnad*)
2. Faculty qualification
3. Independent assessment
4. Published standards

The teacher is named before the subject. The chain is stated before the curriculum. Assessment criteria are published before enrolment opens.

---

## Programme Schema

### Core Fields

| Field | Type | Purpose |
|---|---|---|
| `name` | String | Programme title |
| `slug` | Slug | URL path (permanent) |
| `subtitle` | String | One-line description |
| `tier` | Selection | Essential / Professional / Advanced / Licensed |
| `duration` | String | Programme length |
| `format` | String | Delivery format |
| `fee` | String | Fee with context |
| `feeNote` | String | What the fee includes |
| `nextCohort` | String | Next available start date |
| `folio` | String | Catalogue reference |

### Programme Content

| Field | Type | Purpose |
|---|---|---|
| `whatItIs` | Array of text | Programme description (3-5 paragraphs) |
| `forWhom` | Array of text | Who should apply |
| `whatItAsks` | Array of text | Requirements of the student |
| `curriculum` | Array of `curriculumModule` | Full module list |
| `learningOutcomes` | Array of `learningOutcome` | Assessed outcomes |
| `assessment` | Array of text | Examination methods |
| `certification` | Array of text | What certification means |
| `clinicalPractice` | Array of text | Clinical hour requirements |
| `clinicalStandards` | Array of `policyItem` | Safety and clinical standards |
| `entryRequirements` | Array of text | Admission criteria |
| `practicalSessions` | Array of `practicalSession` | Session schedule |
| `equipmentList` | Array of `equipmentItem` | Required equipment |
| `graduatePathways` | Array of `graduatePathway` | Post-graduation options |
| `enrolmentJourney` | Array of `enrolmentStep` | Application process |
| `courseHandbook` | Array of `policyItem` | Handbook policies |
| `studentGuide` | Array of `policyItem` | Student guidance |

### Relationships

| Field | Type | Purpose |
|---|---|---|
| `faculty` | References to `faculty` | Teaching staff |
| `testimonials` | Array of `testimonial` | Graduate attestations |
| `faq` | Array of Q&A | Programme-specific questions |
| `gallery` | Array of `institutionalImage` | Teaching spaces |
| `policies` | Array of `policyItem` | Formal policies |
| `pathways` | Array of links | Related content |

---

## Curriculum Module Structure

Each module documents:

| Field | Purpose |
|---|---|
| `number` | Module position (e.g. "01") |
| `title` | Module title |
| `hours` | Teaching hours |
| `description` | Module description |
| `sources` | Primary sources for this module |
| `practical` | Practical component (if any) |

---

## Faculty Schema

### Required Fields

| Field | Type | Purpose |
|---|---|---|
| `name` | String | Full name |
| `slug` | Slug | URL path |
| `title` | String | Formal title and qualifications |
| `licence` | String | Professional licence |
| `chain` | String | Chain of transmission |
| `biography` | Array of text | Professional biography |
| `portrait` | Image | Professional photograph |
| `departments` | Array of strings | Which departments they serve |

### Accountability

Every faculty member is listed publicly with:
- Name (never anonymous)
- Qualification (verifiable)
- Chain of transmission (traceable)
- Licence (where applicable)
- Department accountability

---

## Programme Tiers

| Tier | Meaning | Example |
|---|---|---|
| Essential | Foundational knowledge, open access | Foundations of Prophetic Medicine |
| Professional | Career-track qualification with assessment | Hijāma Diploma |
| Advanced | Post-qualification specialisation | Materia Medica |
| Licensed | Practice licence with clinical hours | Clinical Practice & Ethics |

---

## Assessment Standards

The Academy publishes assessment criteria before enrolment:

### Methods

| Method | Purpose |
|---|---|
| Written examination | Theoretical knowledge |
| Clinical log | Documented supervised hours |
| OSCE | Observed clinical competency |
| Viva | Oral examination on sources and reasoning |
| Portfolio | Evidence of professional development |

### Transparency

- Assessment criteria published on programme page
- Marking rubrics available on request
- Pass/fail thresholds stated clearly
- Resit policies documented in course handbook

---

## The Register

Graduates who meet institutional standards are entered on the Register:

- Public listing of qualified practitioners
- Continuing Professional Development requirements
- Annual renewal
- Removal for non-compliance with standards
- The institution stands behind every listed practitioner

---

## Enrolment Journey

```
1. Expression of Interest
   ↓
2. Information Pack Sent
   ↓
3. Application Form
   ↓
4. Interview (where required)
   ↓
5. Safeguarding Check (DBS)
   ↓
6. Offer Letter
   ↓
7. Fee Payment
   ↓
8. Student Handbook Issued
   ↓
9. Induction
   ↓
10. Programme Commences
```

Each step is documented in the CMS with:
- Step number
- Title
- Description
- Expected duration

---

## Policies

The Academy maintains the following published policies:

| Policy | Coverage |
|---|---|
| Cancellation | Refund schedule and conditions |
| Conduct | Expected behaviour and consequences |
| Clinical responsibility | Patient safety requirements |
| Attendance | Minimum attendance for certification |
| Safeguarding | Protection of vulnerable persons |
| Complaints | Formal complaints procedure |
| Appeals | Assessment appeal process |
| Equality | Non-discrimination commitment |
| Data protection | Student data handling |

All policies are editable in the CMS and published on the website.

---

## Testimonials

Graduate attestations are:
- Published with explicit consent
- Attributed by name and year
- Contextualised (what programme, what outcome)
- Never used as marketing claims
- Not called "reviews" or "ratings"
- Labelled "Graduate attestations" — honest testimony, not promotion

---

## Photography

Academy photography documents:
- Teaching spaces (reading room, clinical suite)
- Equipment and materials
- Clinical practice (anonymised or consented)
- Faculty portraits
- Architecture

Never:
- Students in vulnerable positions
- Patients receiving treatment (without explicit consent)
- Posed "graduation" photos
- Stock photography of classrooms

---

## Future: Payment Integration

When Stripe is integrated:
- Programme fees payable online
- Instalment plans where offered
- Invoice generation
- Refund processing per cancellation policy
- No Stripe branding visible to students
- Payment page maintains institutional design
