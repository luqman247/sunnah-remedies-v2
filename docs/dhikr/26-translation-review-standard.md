# 26 — Translation Review Standard

Purpose: general principles governing both `translationEn` and `translationDa` together. Language-specific guidance for Danish is in [27-danish-translation-standard.md](27-danish-translation-standard.md); this document covers what applies to both.

## Arabic is authoritative

`arabicText` is the single stored source for every item (see [03-authenticity-and-scholarly-review-policy.md](03-authenticity-and-scholarly-review-policy.md)). Both translations are derived from it, not independent content. If a discrepancy is found between a translation and the Arabic, the translation is corrected — the Arabic is never adjusted to fit a translation.

## Accuracy before smoothness

Literal accuracy against the Arabic takes precedence over idiomatic smoothing. Smoothing a translation for readability is acceptable; smoothing that changes or softens meaning is not. When in doubt, prefer a more literal rendering and note the reasoning in `boardApproval.notes` rather than silently choosing the smoother option.

## Terminology consistency

Recurring words, phrases, and standard formulas should translate the same way across items wherever the underlying Arabic is the same or closely related. This schema has no shared glossary field — maintain consistency by reviewing existing published or approved items in the same category before finalising a new translation, and consider keeping an internal reference list outside Sanity if the register grows.

## No added claims

A translation must not introduce a reward, virtue, or benefit claim that is not present in the Arabic or the verified source backing it. Translating faithfully sometimes means the English or Danish reads more plainly than a popular paraphrase elsewhere — that is expected and correct, not a deficiency to "fix" by adding emphasis.

## Both languages are mandatory, independently

`translationEn` and `translationDa` are both required by the canonical publication gate before an item can be published — a placeholder, a machine-translation draft, or a "good enough for now" entry in either field is not acceptable in either language. Each is reviewed against the Arabic on its own terms, not against the other translation.
