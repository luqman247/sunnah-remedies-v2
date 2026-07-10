# KNOWLEDGE MAP — Continuum

## Authority and derivation

```
20-platform/specifications/000-platform-constitution.md   ← platform law (L0)
│   ├── 011-security-model.md (authored) · 001–015 pending (SPECIFICATION-PROGRAMME.md)
│   ├── rationale: 20-platform/architecture/continuum-platform-architecture.md
│   └── reference: 20-platform/rfc/ (34 RFCs, v1.0; CONSOLIDATED.md generated)
30-dios/operating-system/00 Institution Constitution.md   ← DIOS law (L0, peer plain-language edition)
│   ├── standards 01–15 + review/release checklists (versioned: VERSION.md, CHANGELOG.md)
│   ├── platform-specification/ (23-module starter platform, approved)
│   └── implementation-programme/ (phases 0–9; generated-docx/ renderings)
10-methodology/ — self-contained lifecycle spine:
    00-foundation → 10-design → 20-plan → 30-build → 40-verify → 50-release → 90-reference
    (own README, CONTRIBUTING, CI; templates and prompt library in-tree)

Lineage: Engineering Playbook (archived) → 10-methodology
         EOS-v2 (archived) → architecture → rfc v1.0 → specifications (active)
         methodology + platform + practice → 30-dios
```

## Reading orders
- **Adopt the method:** `10-methodology/README.md` → 00-foundation → your lifecycle stage → 90-reference as needed.
- **Implement the platform:** architecture → `rfc/README.md` (start RFC-000) → contracts (RFC-111, 100–101) → your subsystem → 000 constitution → 011 security.
- **Author a pending spec:** `specifications/SPECIFICATION-PROGRAMME.md` → its RFC sources → the 000/011 front-matter pattern.
- **Instantiate an institution:** DIOS 00 → standards 01–15 → platform specification → implementation programme phase order.
