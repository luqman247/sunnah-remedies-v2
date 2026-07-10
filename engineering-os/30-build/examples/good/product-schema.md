# Good Example — Product Schema

## Purpose

The Product schema represents a single purchasable item within the Sunnah Remedies Apothecary.

It is designed to support:

- Physical products
- Digital products
- Product bundles
- Future subscriptions
- Multilingual content
- Rich SEO
- Editorial workflows

The schema is the authoritative source for product information and should never be duplicated elsewhere.

---

# Business Responsibilities

A Product document is responsible for:

- Product identity
- Pricing
- Inventory status
- SEO
- Images
- Categories
- Collections
- Ingredients
- Certifications
- Related products

---

# Relationships

Product

↓

Category

↓

Collection

↓

Ingredient(s)

↓

Brand

↓

Certifications

↓

Research Articles

↓

Protocols

Every relationship uses references.

No information is duplicated.

---

# Example Fields

| Field | Type | Required |

|----------|---------|---------|

| Name | String | ✅ |

| Slug | Slug | ✅ |

| Description | Portable Text | ✅ |

| Price | Number | ✅ |

| Compare At Price | Number | ❌ |

| Images | Array | ✅ |

| Category | Reference | ✅ |

| Collections | References | ❌ |

| Ingredients | References | ❌ |

| Certifications | References | ❌ |

| Related Products | References | ❌ |

| Stock Status | Enum | ✅ |

| Featured | Boolean | ❌ |

| SEO | Object | ✅ |

---

# Validation

- Name required.
- Slug unique.
- Price must be positive.
- Featured image required.
- Category required.
- Duplicate ingredients prohibited.

---

# Editorial Workflow

Create Product

↓

Upload Images

↓

Assign Category

↓

Assign Ingredients

↓

Assign Collections

↓

Complete SEO

↓

Preview

↓

Publish

---

# Why This Is Good

✓ Single Source of Truth

✓ Strong relationships

✓ No duplicated data

✓ Editor friendly

✓ Future proof

✓ Supports internationalisation

✓ Supports AI search

✓ Supports structured data

---

# Engineering Principles Demonstrated

- Normalisation
- Reusability
- Scalability
- Maintainability
- Editorial independence

---

## Document Metadata

**Document Type:** Example (Good)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual

## Change History

| Version | Date | Summary |
|---------|------|---------|
| 1.0.0 | Initial Release | Migrated and standardised into the Engineering Operating System |
