# Good Example — Release Notes

## Purpose

A well-formed set of release notes for a real platform release, written for two audiences at once: the editorial team who need to know what changed, and future engineers who need a durable record. Worked counterpart to `templates/release-notes.md`.

---

# Release v1.4.0 — Hijama Booking

**Date:** 2026-02-15
**Status:** Released to production

---

# Summary

Practitioners can now be booked for Hijama sessions directly on the site, with availability computed in real time and confirmation emails sent automatically.

---

# Added

- Server-side availability for Hijama services, respecting duration and buffer time.
- Pre-screening questionnaire (CMS-editable) that blocks unsafe bookings.
- Automatic confirmation email via Resend.

# Changed

- Service and practitioner records are now CMS-managed; previously hardcoded values were migrated.

# Fixed

- Resolved a double-booking race by re-validating the selected slot at the API boundary.

---

# Editorial Notes (non-technical)

The Academy and Apothecary teams can now edit services, practitioners, and screening questions in Sanity with no developer involvement. Changes appear on the site after publish.

---

# Migration and Rollback

- **Migration:** existing service data moved from code to CMS in commit `a1b2c3d`. No manual step required.
- **Rollback:** revert to `v1.3.2`; CMS documents remain intact and are ignored by the previous version.

---

# Related Documents

- Release Notes Template
- Release Checklist
- Deployment Workflow

---

## Document Metadata

**Document Type:** Example (Good)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual
