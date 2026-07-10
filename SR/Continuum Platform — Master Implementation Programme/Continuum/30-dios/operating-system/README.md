# Digital Institution Operating System (DIOS)

**The permanent operating system for every digital product Sunnah Remedies ever builds.**

Status: Ratifiable draft (awaiting Freeze) · Version 1.0.0 · Authority: highest

---

## What this is

This repository is the **constitution and operating system** of the Sunnah Remedies
digital institution. It is not documentation *about* a project. It is the fixed frame of
reference that every project is judged against — the equivalent, for us, of what Apple's
Human Interface Guidelines, Stripe's engineering principles, the GOV.UK Design System and
IBM Carbon are for their institutions, unified into one coherent handbook.

It is distilled from the complete body of specification work produced for the institution:

- the **Continuum platform architecture** — a runtime-first, AI-native engineering
  platform with a ratified constitution, twenty-nine numbered architectural decisions
  (D‑01…D‑29), an eleven-contract interoperability spine and a formal security model;
- the **Sunnah Remedies Engineering Playbook** and **Engineering Operating System** —
  the institution's applied engineering practice on a real Next.js / Sanity / Vercel
  platform spanning an apothecary, an academy, a clinic and an editorial arm.

Those documents are no longer the product. They are the **source material**. This
operating system extracts the timeless principles behind them, removes duplication,
resolves contradictions, and states the result once, at the highest authority.

## The two-sentence thesis

> The **institution's product is a governed, verifiable model of truth** — about a
> project, a remedy, a course, a clinical claim — of which every website, application,
> document and interface is a *projection*. Human engineers and AI agents are co-equal,
> governed participants who may **propose** change freely, but change is admitted to the
> truth only through **verification the proposer cannot influence**, recorded immutably,
> under **authority that is always granted, never assumed**.

Everything in this repository follows from that thesis.

## How authority flows

```
00  Institution Constitution  ── the single root; everything below derives from it
     │
     ├── 01  Design & Interaction Language
     ├── 02  Engineering Standards
     ├── 03  Subsystem & Contract Standards
     ├── 04  Documentation & Editorial Standards
     ├── 05  Context & Knowledge Standards
     ├── 06  Interface & Motion Standards
     ├── 07  Accessibility & Legibility Standards
     ├── 08  Performance & Scale Standards
     ├── 09  Discoverability & Traceability Standards
     ├── 10  AI Agent Standards
     ├── 11  Extension & Ecosystem Standards
     ├── 12  Telemetry & Analytics Standards
     ├── 13  Security Standards
     ├── 14  Review Checklist
     └── 15  Release Checklist
```

No document below `00` may contradict `00`. Where any two documents disagree, the
higher-numbered authority yields to the lower, and `00` prevails over all. This is the
same non-contradiction rule Continuum's constitution enforces (`CON‑§10.2.1`), applied to
the whole institution.

## How to read it

1. **Start with `00 Institution Constitution.md`.** It contains the mission, the
   invariants that can never be violated, the decision framework, and the derivation
   rules that bind everything else. If you read only one document, read this one.
2. **Then read the standard for your discipline** (design, engineering, editorial, AI,
   security). Each opens by declaring which constitutional clauses it implements.
3. **Use `14 Review Checklist.md` and `15 Release Checklist.md` on every change.** These
   are the gates. Nothing reaches production without passing them.
4. **`Digital Institution Constitution.md`** at the root is the plain-language master
   charter: how every future website, application, AI system, engineer, designer, editor
   and coding assistant is expected to work. It is the same authority as `00`, written for
   a reader who wants the whole picture in one pass.

## Who and what this governs

Everyone and everything that touches a Sunnah Remedies digital product:

- **Human engineers, designers, editors and product owners** — the standards are their
  shared practice.
- **AI assistants** — Claude, Cursor, Claude Code, GitHub Copilot, Codex and their
  successors — which are **governed participants**, not privileged tools (see `10`).
- **Every project** — greenfield or brownfield, website or platform, apothecary storefront
  or clinical booking system — inherits this operating system by reference, so that every
  future product automatically belongs to the same institution.

## The non-negotiables (in one breath)

Truth is derived, never asserted · Verification precedes trust · The model is the source
of truth and text is a view · No ambient authority · Irreversible actions always keep a
human gate · Content is content, not code · Reversibility over cleverness · Nothing is
ever silently deleted — it is tombstoned · Every change is traceable to who, what,
why, and on what evidence.

## Repository contents

| File | Purpose |
|---|---|
| `00 Institution Constitution.md` | Root authority: mission, invariants, decision framework, derivation rules |
| `01 Design & Interaction Language.md` | The institution's visual and interaction language |
| `02 Engineering Standards.md` | Architecture, folders, naming, testing, deployment, technical-debt rules |
| `03 Subsystem & Contract Standards.md` | The stable contracts and reusable subsystems every product composes |
| `04 Documentation & Editorial Standards.md` | Voice, Islamic and clinical references, citation, documentation-as-projection |
| `05 Context & Knowledge Standards.md` | The knowledge model: freshness, inheritance, the content/CMS boundary |
| `06 Interface & Motion Standards.md` | Interface surfaces (CLI/API/UI), motion, feedback, reduced motion |
| `07 Accessibility & Legibility Standards.md` | WCAG, keyboard, ARIA, contrast, legibility for humans and agents |
| `08 Performance & Scale Standards.md` | Web Vitals, budgets, caching, ten-year scale properties |
| `09 Discoverability & Traceability Standards.md` | SEO/AEO/GEO, structured data, and internal traceability |
| `10 AI Agent Standards.md` | How every AI participant must behave, be governed, and be overseen |
| `11 Extension & Ecosystem Standards.md` | Plugins, third parties, and how the institution is extended safely |
| `12 Telemetry & Analytics Standards.md` | What is measured, how, and the privacy rules that bound it |
| `13 Security Standards.md` | Identity, authority, isolation, revocation, data protection, clinical data |
| `14 Review Checklist.md` | The gate every feature, page, article, product and release passes |
| `15 Release Checklist.md` | Exactly what must be verified before production. No exceptions. |
| `Digital Institution Constitution.md` | The plain-language master charter |
| `CHANGELOG.md` · `VERSION.md` | Evolution record and version registry |

## Amending this operating system

This operating system evolves the way Continuum's constitution does: **by addition, and
by tombstone, never by silent deletion.** Changing an ordinary clause is routine and
recorded. Changing a non-negotiable (an invariant) is a constitutional amendment requiring
the heightened procedure in `00`, Part 12. See `CHANGELOG.md` for the record and
`VERSION.md` for the current version of every document.

---

*"Engineering excellence is defined not only by what is built, but by how it is built."*
— Engineering Behaviour Standard, Sunnah Remedies Engineering Playbook.
