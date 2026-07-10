# Bad Example — Products API

Endpoint

GET /api/products

---

## Problems

Returns every product.

No pagination.

No filtering.

No validation.

No error handling.

No documentation.

No authentication.

No rate limiting.

Exposes internal IDs.

Returns inconsistent responses.

---

## Engineering Problems

Poor scalability.

Security risks.

Slow responses.

Hard to maintain.

Impossible to extend.

---

## Better Solution

Add:

Pagination

Filtering

Validation

Authentication

Documentation

Consistent response format

Logging

Rate limiting


---

# Do This Instead

See the correct approach in `examples/good/good-api.md` — a typed, validated, single-responsibility API.

---

## Document Metadata

**Document Type:** Example (Bad)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual

## Change History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Release | Migrated and standardised into the Engineering Operating System |
