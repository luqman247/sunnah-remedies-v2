# Bad Example — Verification

## Anti-Pattern

Declaring work complete without performing proper verification.

---

# Example

Developer finishes coding.

↓

Commits code.

↓

Reports:

"Everything is working."

No build.

No type check.

No lint.

No browser testing.

No documentation updates.

No verification report.

---

# Problems

❌ Code may not compile.

❌ Type errors remain hidden.

❌ Linting issues ignored.

❌ UI may be broken.

❌ Responsive layouts untested.

❌ Accessibility unknown.

❌ Performance unknown.

❌ Security unchecked.

❌ Documentation outdated.

❌ High production risk.

---

# Example of a Poor Completion Message

"Done."

or

"I've finished implementing the feature."

No supporting evidence is provided.

---

# Violated Engineering Principles

- Verify Before Reporting Success
- Definition of Done
- Quality Assurance
- Engineering Behaviour Standard
- Documentation Standards

---

# Better Workflow

Implementation

↓

Build

↓

Type Check

↓

Lint

↓

Development Server

↓

Visit Changed Pages

↓

Verify UI

↓

Responsive Testing

↓

Accessibility Review

↓

Performance Review

↓

Documentation Update

↓

Verification Report

↓

Ready for Review

---

# Minimum Verification Checklist

✓ Build passes

✓ Type Check passes

✓ Lint passes

✓ Development server runs

✓ Browser tested

✓ Desktop verified

✓ Tablet verified

✓ Mobile verified

✓ No console errors

✓ Documentation updated

✓ Verification report completed

---

# Better Completion Message

Feature successfully implemented.

Verification Summary

✓ Build Passed

✓ Type Check Passed

✓ Lint Passed

✓ Browser Verified

✓ Responsive Verified

✓ Documentation Updated

✓ Ready for Review

---

# Lessons Learned

Implementation is not completion.

Verification is part of implementation.

Never report success without evidence.


---

# Do This Instead

See the correct approach in `examples/good/verification-report.md` — an evidence-backed verification report.

---

## Document Metadata

**Document Type:** Example (Bad)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual

## Change History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Release | Migrated and standardised into the Engineering Operating System |
