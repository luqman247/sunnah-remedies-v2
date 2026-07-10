# Contributing to the Engineering Operating System

How to maintain this OS, and how to rebrand it for a new organisation.

---

## Document Rules

- Markdown only, `kebab-case.md`. No spaces, colons, or numeric `N.` prefixes in paths.
- Every document carries a `## Document Metadata` block (type, version, status, owner, review cycle).
- Prefer prose; use lists where they aid scanning. Avoid loose lists (no blank line between adjacent list items).
- Bad examples must link to their good twin via a `# Do This Instead` section.
- Run `./docs-lint.sh` before every commit. It must pass.

## Adding a Document

1. Place it in the correct lifecycle stage (`00`–`90`).
2. Give it a metadata block (copy from any existing file).
3. Cross-link related documents at the foot.
4. If it supersedes another, note it in `CHANGELOG.md`.

## Versioning

- The OS is versioned in `CHANGELOG.md` using Semantic Versioning.
- Individual documents version independently in their metadata block.

---

## Rebranding This OS for a New Organisation

This OS is designed to be reused. To instantiate it for a new organisation:

1. **Global replace the organisation name.** Replace `Sunnah Remedies` with your organisation everywhere:
   ```bash
   grep -rl "Sunnah Remedies" . | xargs sed -i 's/Sunnah Remedies/Your Org/g'
   ```
2. **Review the domain-specific examples.** The files under `30-build/examples/` use realistic Sunnah Remedies scenarios (Hijama, apothecary, academy). Keep them as-is for teaching value, or replace the scenarios with your own domain — but preserve the *structure*, since that is what teaches.
3. **Replace the governing doctrine.** `10-design/architecture/01-vision.md` encodes the "Two Ledgers" doctrine. Substitute your own governing principle.
4. **Adjust the stack.** `10-design/architecture/02-system-architecture.md` names a specific stack (Next.js, Sanity, Vercel…). Update it to yours.
5. **Reset versions.** Set `CHANGELOG.md` to `1.0.0` for your instance.
6. **Run the linter.** `./docs-lint.sh` should pass with zero errors.

What you should *not* change: the lifecycle spine, the metadata convention, the evidence-before-completion rule, and the good/bad example pattern. These are the reusable engine.

## Document Metadata

**Document Type:** Reference
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual
