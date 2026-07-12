# 03 — Authenticity & Scholarly Review Policy

This document defines the *process* by which Dhikr content will be sourced, verified, and approved before it can ever be published. It contains no verdicts on any specific text — it is a policy skeleton, to be operated by qualified reviewers, not a religious ruling in itself.

## Why this document exists

Every other document in this pack assumes content arrives already verified. This is the document that defines what "verified" means and who is authorized to say so. No content schema field, register entry, or reader-experience decision overrides this policy — if content hasn't cleared this process, it does not ship.

## Review roles (to be assigned by the project owner, not by this architecture)

- **Source compiler** — locates candidate adhkar from recognised, citable collections and prepares them for review. Does not have publish authority.
- **Scholarly reviewer** — a qualified individual (or panel) responsible for confirming source authenticity, grading, and translation accuracy. Has sole authority to move an item from "pending" to "approved."
- **Editorial reviewer** — checks tone, transliteration consistency, and presentation quality after scholarly approval. Cannot approve content on authenticity grounds.
- **Publisher** — technical role that flips an approved item's CMS status to live. Requires scholarly-approved status as a precondition, enforced by the content schema's status field (see [04](04-dhikr-content-schema.md)).

## Required review stages, per item

1. **Sourced** — item drafted with a specific citation (collection, reference), no public visibility.
2. **Scholarly review** — reviewer confirms source authenticity and translation accuracy; can approve, reject, or return for revision.
3. **Editorial review** — tone/presentation pass, does not touch authenticity.
4. **Approved** — eligible for publish.
5. **Published** — live on the site.

This maps directly to the `reviewStatus` field proposed in [04-dhikr-content-schema.md](04-dhikr-content-schema.md) and the register in [18-v1-content-register.md](18-v1-content-register.md), where every v1 candidate is currently logged as `[Pending scholarly input]`.

## Arabic as the authoritative source

`arabicText` is the authoritative source for every item; `translationEn`/`translationDa` (see [04-dhikr-content-schema.md](04-dhikr-content-schema.md)) are derived translation layers, not independent content. Scholarly review of "translation accuracy" means checking the translation against the Arabic, not reviewing it as a parallel authority. If a discrepancy is ever found between the Arabic and a translation, the translation is corrected to match the Arabic — the Arabic is never adjusted to match a translation.

## Reward and virtue claims

Any statement asserting a specific spiritual reward, virtue, or benefit for reciting an item — a common feature of traditional dhikr collections — is treated as content requiring the same sourcing and scholarly-review rigor as the core text. It is not editorial commentary, and must not be introduced through a loosely-reviewed field such as a category `description` or item `tags` (see [04](04-dhikr-content-schema.md)). No such claim ships in v1 unless it is independently sourced and cleared through the review stages above.

## What "verified" requires, at minimum

- A specific, checkable source citation (not "commonly known" or "widely recited").
- Scholarly confirmation of translation accuracy, not just source authenticity.
- A recorded reviewer identity and review date in the CMS (see [12](12-sanity-integration-plan.md)) for auditability.

## Handling disagreement or uncertainty

If a scholarly reviewer flags a source as disputed, weak, or contested, the item does not proceed to editorial review or publish, regardless of how commonly it circulates elsewhere. There is no "publish with a caveat" state in v1 — an item is either fully cleared or not published.

## Relationship to this architecture pack

This policy is why:
- [04](04-dhikr-content-schema.md) includes a `reviewStatus` and `sourceCitation` field rather than only content fields.
- [18](18-v1-content-register.md) lists only placeholder slots, not real entries — no content in this pack has been through this process yet.
- [12](12-sanity-integration-plan.md) proposes CMS-level status gating so unapproved content cannot be queried into the live site by accident.
