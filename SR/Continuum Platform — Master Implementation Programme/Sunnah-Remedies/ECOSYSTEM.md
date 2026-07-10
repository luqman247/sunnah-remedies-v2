# THE ECOSYSTEM

How the repositories of this organisation relate. **Canonical copy: `Sunnah-Remedies/ECOSYSTEM.md`. The copy in `Continuum/` is a mirror — change both together.**

---

## The three repositories

| Repository | What it is | One-line test for what belongs in it |
|---|---|---|
| **Continuum** | An independent, brand-agnostic AI-native software engineering platform: methodology, runtime platform, and the DIOS institution generator. Could be commercialised on its own. | "Would this document still make sense if Sunnah Remedies never existed?" → Continuum. |
| **Sunnah-Remedies** | The institution: governance, brand, academy, clinical practice, website, commerce, operations. | "Is this about *Tibb al-Nabawi*, the academy, the brand, or the Sunnah Remedies business?" → Sunnah-Remedies. |
| **Archive** | Append-only history of both, plus the record of the founding consolidation. | "Is it superseded?" → Archive. |

## The value chain

```
CONTINUUM
│
├── 10-methodology   The Engineering OS — how software is designed, planned,
│                    built, verified, released (brand-agnostic, rebrandable)
├── 20-platform      The Continuum runtime — architecture, 34 RFCs,
│                    constitutional specifications (the AI-native engine)
└── 30-dios          The Digital Institution Operating System — the generator:
                     constitution, 16 standards, 23-module starter platform,
                     10-phase build programme
        │
        │  generates & governs
        ▼
   A DIGITAL INSTITUTION PLATFORM
   (design system, CMS, identity, search, operations,
    commerce, community — institution-agnostic)
        │
        │  instantiated as
        ▼
SUNNAH REMEDIES  (first and reference instantiation)
│
├── 00-institution   constitution · operations handbook · governance
├── 10-brand         the brand tokens & manuals supplied to the platform
├── 20-academy       framework · certification · SRA-001 course
└── 30-digital-estate  website · commerce · intelligence · community specs
        │
        │  produces
        ▼
   Website · Apothecary shop · Academy & courses · Clinic operations ·
   Knowledge base · Community & alumni network · Governed AI assistants
```

## The contract between the repositories

1. **Sunnah Remedies consumes; Continuum provides.** SR work follows the Engineering OS method, builds on DIOS standards, and supplies only brand tokens, content, and institution-specific rules.
2. **Nothing Sunnah-Remedies-specific may be added to Continuum.** SR requirements that need platform capability are raised as platform requirements in brand-agnostic language.
3. **Nothing platform-generic may be added to Sunnah-Remedies.** If a standard would serve any institution, it belongs in DIOS.
4. **Versioned dependency.** SR pins the DIOS handbook version it builds against (`Continuum/30-dios/operating-system/VERSION.md`). Upgrades are deliberate, logged in SR's CHANGELOG.
5. **The archive is shared history.** Both repositories cite `Archive/` for provenance; neither duplicates it.

## Where a new document goes — decision procedure

1. Superseded? → **Archive**.
2. Meaningful without Sunnah Remedies? → **Continuum** (methodology → 10, runtime → 20, institution-generation → 30).
3. Otherwise → **Sunnah-Remedies**, in the domain the register defines.
4. Ambiguous → split it: the generic principle to Continuum, the SR application to Sunnah-Remedies. Log the split in both DECISION_LOGs.
