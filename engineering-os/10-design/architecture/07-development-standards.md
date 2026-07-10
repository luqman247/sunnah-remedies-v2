# Architecture 07 — Development Standards

## Purpose

The architectural-level development standards that bind all code. Detailed coding rules live in `90-reference/standards/`; this document sets the non-negotiables.

## Scope

All production code across all phases.

---

# Non-negotiables

1. **Content in the CMS.** Nothing editable is hardcoded.
2. **Logic in `lib/`.** Presentation renders; it does not decide.
3. **Server-side truth.** Business rules and validation execute server-side and are re-validated at the boundary.
4. **Fixed foundations.** Design-system primitives are composed, never altered.
5. **Verify by evidence.** No work is complete without a verification report backed by build, type-check, lint, and browser evidence.
6. **Authenticity is structural.** Claims from narrations carry graded source references (Integrity Ledger).
7. **Compliance by design.** UK GDPR, EU GDPR, and KSA PDPL are designed in, not retrofitted.

---

# Quality Gates (every change)

✓ Build ✓ Type check ✓ Lint ✓ Browser verification ✓ Documentation updated

---

# Related Documents

- Engineering Behaviour Standard
- Definition of Done
- Coding Standards
- Security Standards

## Document Metadata

**Document Type:** Architecture
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Every 6 months
