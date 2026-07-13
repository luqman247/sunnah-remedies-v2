# 09 — Arabic Content Presentation

## Scope restriction

This document specifies **how** Arabic text would be rendered — typography, direction, sizing, diacritic handling. It contains **no actual Arabic text**. Real content is populated only after clearing the review policy in [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md).

## Rendering requirements

- **Direction**: Arabic text blocks render right-to-left (`dir="rtl"` at the block level), independent of the site's current locale (EN/DA), which remain left-to-right. Arabic is a content field, not a locale switch — see [13-localisation-plan.md](13-localisation-plan.md) for how this differs from page-level i18n.
- **Script and diacritics**: full diacritical marking (tashkeel) must be supported end-to-end (font, encoding, line-height) since accurate recitation depends on diacritics — this is a rendering-capability requirement, not a claim about any specific text.
- **Typeface**: use an Arabic typeface consistent with the existing design manual's typographic system (see [00-existing-system-audit.md](00-existing-system-audit.md)); this document does not select a specific font file, that's an implementation/design decision made against the existing manual, not a new decision made here.
- **Line height and spacing**: Arabic script with full diacritics needs more vertical breathing room than Latin text at equivalent point size — layout must accommodate this rather than reusing Latin line-height values unmodified.

## Companion fields

- Transliteration renders left-to-right in Latin script, positioned as a secondary field beneath or beside the Arabic block (see [06-reader-experience-specification.md](06-reader-experience-specification.md) for togglability).
- Translation (EN/DA) renders in the site's standard body typography, following existing localisation, not a new type system.

## Accessibility interaction (detailed fully in 15)

- Arabic text must be exposed to screen readers with correct `lang="ar"` attribution so assistive tech uses correct pronunciation rules, distinct from the surrounding page's `lang` attribute.
- Font must not rely on images-of-text — real selectable/searchable Unicode Arabic text only, both for accessibility and so verified text isn't silently altered by an image asset.

## Explicit non-goals

- Does not select a final font file or specify exact CSS values — that's a design-system-level decision using existing tokens/manuals.
- Does not include any actual Arabic string, diacritic sample, or transliteration example.
