# 27 — Danish Translation Standard

Purpose: Danish-specific guidance, additional to the shared principles in [26-translation-review-standard.md](26-translation-review-standard.md). `translationDa` is checked against `arabicText` directly — it is not a translation of `translationEn`.

## Register and tone

Match the tone already established across the site's existing Danish copy (`src/messages/da.json` and the Knowledge Library Danish landing page): direct address using "du," sentence-case headings, plain and precise wording, and avoidance of unnecessary anglicisms where a natural Danish term exists.

## Terminology already in use

- "Dhikr" itself is not translated — this already matches the convention used for other transliterated Islamic terms across the Danish site (for example, "Hijama" is not translated either).
- Where a category or item touches remembrance generally, "ihukommelse" is the term already used in the draft taxonomy ([05-category-taxonomy.md](05-category-taxonomy.md)) and the Danish landing-page copy — prefer it over inventing an alternative.
- Check existing published Danish category and item labels for a matching term before introducing a new one for the same concept.

## Second-reader review

Where practicable, have a second, independently fluent Danish speaker check the translation before scholarly and editorial sign-off. This is a recommended process step, not a schema requirement — there is no dedicated second-reviewer field. If performed, record it in `boardApproval.notes` on the relevant approval entry so the check is visible in the audit trail.

## Accuracy check

`translationDa` must go through the same accuracy-against-Arabic check described for English in [26-translation-review-standard.md](26-translation-review-standard.md) and in the scholarly review form ([24-scholarly-review-form.md](24-scholarly-review-form.md)) — it is reviewed on its own merits, not assumed correct because the English translation was approved.
