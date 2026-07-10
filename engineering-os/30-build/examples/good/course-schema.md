# Good Example — Course Schema

## Purpose

Represents one educational course within the Sunnah Remedies Academy.

Courses may be:

- Online
- In-person
- Hybrid

---

# Relationships

Course

↓

Instructor

↓

Lessons

↓

Resources

↓

Certificates

↓

Categories

↓

Prerequisites

↓

Assessments

---

# Fields

Name

Slug

Description

Level

Duration

Delivery Method

Instructor

Lessons

Resources

Certificate

Price

Availability

SEO

---

# Responsibilities

The Course schema should:

- Describe the course.
- Organise lessons.
- Manage enrolment information.
- Connect to instructors.
- Connect to downloadable resources.

---

# Validation

- Course name required.
- Slug unique.
- At least one lesson.
- Instructor required.
- Duration required.

---

# Benefits

Editors can build entire courses without developer involvement.

Future LMS functionality is supported.

Certificates remain reusable.

Lessons remain reusable.

Resources remain reusable.

---

## Document Metadata

**Document Type:** Example (Good)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual

## Change History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Release | Migrated and standardised into the Engineering Operating System |
