# Changelog

All notable changes to the Digital Institution Operating System (DIOS) are recorded here.
Evolution is **additive and tombstoned, never silently deleted** (`00`, §12.4). Versioning
follows `00`, §12.1: MAJOR for a change to a Part 3 invariant or the Part 5 layer model;
MINOR for additive clauses, principles or roles; PATCH for non‑normative clarification.

## [1.0.0] — Ratifiable draft

### Added
- **`00 Institution Constitution`** — the root authority: five convictions, twelve
  invariants (Part 3), the decision framework, the layer model, the authority model, and the
  derivation and amendment rules. Distilled from the Continuum Platform Constitution and the
  Sunnah Remedies Engineering Playbook vision.
- **`01`–`13`** — the discipline standards, each deriving explicitly from `00`:
  Design & Interaction Language; Engineering Standards; Subsystem & Contract Standards;
  Documentation & Editorial Standards; Context & Knowledge Standards; Interface & Motion
  Standards; Accessibility & Legibility Standards; Performance & Scale Standards;
  Discoverability & Traceability Standards; AI Agent Standards; Extension & Ecosystem
  Standards; Telemetry & Analytics Standards; Security Standards.
- **`14 Review Checklist`** and **`15 Release Checklist`** — the enforcement gates
  (`00`, §13.2).
- **`Digital Institution Constitution`** — the plain‑language master charter.
- `README.md`, `VERSION.md`, this changelog.

### Synthesis decisions (contradictions resolved)
- **Domain reconciled.** The source corpus contained both a platform‑class specification set
  (Continuum) and the institution's applied engineering practice (Sunnah Remedies). Rather
  than force the platform's abstractions or a generic web‑agency template onto the
  institution, DIOS adopts **Continuum's governance rigor as the backbone** and the
  **Playbook's applied standards as the practice**, unified under one constitution. Where the
  original prompt's section list assumed a storefront‑only site (e.g. photography/commerce as
  standalone), those concerns were folded into the standards where the real material supports
  them (design, editorial, discoverability, telemetry) rather than invented as hollow
  documents — honouring `00`'s rule against headings implying content that was never written.
- **"Engine" demoted to worker.** Following Continuum D‑18, engines/workers own no truth;
  reflected in `03` and `05`.
- **Verification unified.** The Playbook's "verify before success" and Continuum's
  out‑of‑process trust boundary are merged into one uniform‑verification invariant
  (`00`, §3.5) enforced by `02 §4`, `14` and `15`.
- **Human oversight reconciled.** The Playbook's founder‑approval workflow and Continuum's
  "irreversible ⇒ human approval" become one invariant (`00`, §3.6) with reserved human
  authority (`00`, §8.4).

### Notes
- Status is *ratifiable draft*. The transition to a frozen `1.0.0` is performed by the
  governing authority (`00`, §12.1) and, once done, this operating system changes only by
  Amendment.

[1.0.0]: initial ratifiable draft
