# 05 — Category Taxonomy (Draft)

This document proposes an **organisational label set only** — category names used for navigation and grouping, not religious rulings or content. Every label below is a working draft pending editorial/scholarly review before being finalised; none should be treated as final copy.

## Draft category set

| Draft label (EN) | Draft label (DA) | Organisational intent |
|---|---|---|
| Morning | Morgen | Items associated with the start of the day |
| Evening | Aften | Items associated with the end of the day |
| After Prayer | Efter bøn | Items associated with the period following ritual prayer |
| Before Sleep | Før søvn | Items associated with retiring for the night |
| Travel | Rejse | Items associated with journeys |
| Distress / Difficulty | Nød / Vanskelighed | Items associated with hardship or anxiety |
| General Remembrance | Generel ihukommelse | Items not tied to a specific occasion |

These labels describe *when or why* a category of dhikr is traditionally recited — they are structural/organisational, not a citation of any specific text, grading, or count. No hadith reference or authenticity claim is attached to a category itself; that verification happens per-item under [03](03-authenticity-and-scholarly-review-policy.md).

## Taxonomy rules

- Every `dhikrItem` belongs to exactly one primary `category` in v1 (see [04](04-dhikr-content-schema.md)); cross-category tagging via the optional `tags` field can be considered post-v1.
- Category `order` follows the same numeric-order convention as `department-card.order` (see [00](00-existing-system-audit.md)) for consistent editorial control.
- Category labels are localised through the existing i18n system (see [13](13-localisation-plan.md)), not a new mechanism.

## Open decision

Final category names, count, and Danish phrasing should be reviewed alongside the authenticity policy owner before this taxonomy is locked — logged as an open item in [21-decision-log.md](21-decision-log.md).
