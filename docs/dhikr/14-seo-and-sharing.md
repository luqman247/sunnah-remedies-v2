# 14 — SEO & Sharing

## Approach

Follow the existing SEO schema-helper pattern (`src/lib/seo/schema/*` — `product.ts`, `article.ts`, `medical.ts`, `course.ts`, `content.ts`; see [00-existing-system-audit.md](00-existing-system-audit.md)) rather than building a parallel metadata system. Dhikr pages would need a new helper (e.g. alongside the existing `content.ts` helpers such as `faqPageSchema`/`howToSchema`) rather than reusing `medicalPageSchema` or `productSchema`, since a dhikr item is neither a product nor medical content.

## Structured data considerations

- Category index and item reader pages are candidates for `BreadcrumbList` structured data, consistent with `composeGraph`/`breadcrumbList` already used elsewhere.
- An individual dhikr item is not well-modelled by any existing schema type in `src/lib/seo/schema/content.ts` (`faqPageSchema`, `howToSchema`, `videoSchema`, `eventSchema`) — a decision on whether to model it as generic `Article`-style structured data, or omit item-level rich structured data in v1, is left open (logged in [21-decision-log.md](21-decision-log.md)) rather than assumed.
- Any audio recitation, once it exists, may be a candidate for `videoSchema`/audio-object structured data — not decided here.

## Sharing

- Standard Open Graph/meta tags per page (title, description) follow the existing metadata localisation pattern (`scripts/localize-page-metadata.ts`, see [00](00-existing-system-audit.md)) once real pages exist.
- Given the reflective/personal nature of the memorisation progress view ([08](08-memorisation-system.md)), that view specifically should not be indexed or socially shareable — it reflects an individual visitor's private local state, not shareable public content.

## Validation

New Dhikr structured-data helpers, once built, should be added to `scripts/validate-schema.ts`'s coverage (see [12-sanity-integration-plan.md](12-sanity-integration-plan.md) and [17-test-and-validation-plan.md](17-test-and-validation-plan.md)) rather than validated ad hoc.

## Explicit non-goals

- No actual page metadata, title, or description copy is written here.
- No structured-data helper code is created by this document.
