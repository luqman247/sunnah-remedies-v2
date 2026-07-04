# 10 — Product Standards (The Apothecary)

## Philosophy

Products at Sunnah Remedies are remedies — not merchandise. Each is documented in a monograph before it is offered. The monograph is the product page. Commerce is secondary to knowledge.

Every remedy must answer:
1. What is it? (botanical identity, origin)
2. What does the Prophetic tradition say? (graded, cited)
3. What does classical scholarship say?
4. What does modern evidence suggest? (bounded, cited)
5. What are the limits? (contraindications stated plainly)
6. Where does it come from? (traceable provenance)
7. Has it been verified? (laboratory analysis)

If these questions cannot be answered, the remedy is not offered.

---

## Product Schema

### Required Fields

| Field | Type | Purpose |
|---|---|---|
| `name` | String | English product name |
| `slug` | Slug | URL identifier (permanent) |
| `transliteration` | String | Arabic transliteration |
| `botanicalName` | String | Latin binomial |
| `nature` | String | Short catalogue line |
| `institutionalSummary` | Text | Museum-label summary |
| `folio` | String | Catalogue reference number |
| `mainImage` | Image | Primary product photograph |
| `volume` | String | Package size |
| `price` | Number | Price in GBP |
| `priceNote` | String | Context for price |
| `inStock` | Boolean | Current availability |

### Monograph Content

| Field | Type | Purpose |
|---|---|---|
| `historicalContext` | Array of text | Historical documentation |
| `propheticReferences` | Array of `propheticReference` | Graded Prophetic citations |
| `traditionalScholarship` | Array of text | Classical scholarly commentary |
| `traditionalUsage` | Array of text | Historical usage documentation |
| `evidence.established` | Array of text | Established scientific evidence |
| `evidence.emerging` | Array of text | Emerging research |
| `provenance.origin` | Array of text | Geographic origin |
| `provenance.cultivation` | Array of text | Growing/production method |
| `provenance.harvesting` | Array of text | Harvest documentation |
| `laboratoryVerification` | Array of text | Lab analysis details |
| `qualityAssurance` | Array of text | Quality standards applied |
| `contraindications` | Array of text | When NOT to use |
| `suggestedUse` | Array of text | Usage guidance |
| `storage` | Array of text | Storage instructions |
| `preparation` | Array of text | Preparation guidance |

### Relationships

| Field | Type | Purpose |
|---|---|---|
| `relatedProducts` | References to `product` | Related remedies |
| `ingredients` | References to `ingredient` | Ingredient library links |
| `academyLessons` | Array of links | Related Academy content |
| `knowledgeLibrary` | Array of links | Related Library articles |
| `pathways` | Array of links | Cross-department connections |
| `faq` | Array of Q&A | Product-specific questions |

### Commerce (Future)

| Field | Type | Purpose |
|---|---|---|
| `futureShopifyProductId` | String | Shopify sync ID |
| `futureShopifyVariantId` | String | Variant ID |

### Media

| Field | Type | Purpose |
|---|---|---|
| `mainImage` | `institutionalImage` | Hero product image |
| `gallery` | Array of `institutionalImage` | Additional images |
| `videos` | Array of `institutionalVideo` | Product videos |
| `downloads` | Array of `downloadFile` | Certificates, monographs |

---

## Monograph Structure (Display Order)

The product page presents information in this order:

1. **Hero** — Product image + name + nature line
2. **Prophetic References** — Graded citations with scholarly standing
3. **Historical Context** — How this remedy sits in tradition
4. **Traditional Scholarship** — Classical commentary
5. **Traditional Usage** — How it has been used historically
6. **Evidence** — Modern research, clearly bounded
7. **Provenance** — Origin, cultivation, harvest
8. **Laboratory Verification** — Independent analysis
9. **Quality Assurance** — Standards applied
10. **Suggested Use** — Guidance (not prescription)
11. **Contraindications** — Stated plainly and prominently
12. **Storage** — Care instructions
13. **FAQ** — Common questions
14. **Related Remedies** — Cross-links
15. **Pathways** — Connected Academy/Library content
16. **Acquisition** — Price, volume, availability (last, not first)

---

## Grading System

Every Prophetic reference carries a grade:

| Grade | Meaning | Display |
|---|---|---|
| Established | Sahih (authentic) hadith, agreed upon | Full confidence, cited |
| Reported | Hasan (good) hadith, scholarly acceptance | Cited with note on standing |
| Tried | Classical use without specific Prophetic text | Traditional standing stated |

Grades are never hidden. They appear alongside every citation.

---

## Ingredient Library

Each ingredient in the Apothecary has an entry in the Ingredient Library:

| Field | Purpose |
|---|---|
| `name` | Common English name |
| `botanicalName` | Latin binomial |
| `arabicName` | Arabic name |
| `family` | Botanical family |
| `description` | Botanical description |
| `traditionalUses` | Historical uses in tradition |
| `propheticBasis` | Referenced in Prophetic medicine? |
| `preparation` | How traditionally prepared |
| `contraindications` | Known contraindications |
| `interactions` | Drug interactions if known |

---

## Quality Standards

Every product must meet:

1. **Traceability** — origin traceable to farm/grove/source
2. **Laboratory verification** — independent analysis available
3. **Certificate of analysis** — downloadable as PDF
4. **Storage compliance** — stored per documented requirements
5. **Packaging integrity** — food-grade, light-protective where needed
6. **Expiry documentation** — shelf life stated, batch dated

---

## Photography Standards

Product photography follows the institutional photography manual:

- Presented as botanical specimens, not lifestyle products
- Natural materials: glass, wood, stone, linen
- Natural light
- No hands, no lifestyle staging
- Provenance visible where possible (labels, origins)
- Consistent visual treatment across all products

---

## Pricing Display

- Price displayed last, after all monograph content
- No strikethrough pricing
- No "was £X, now £Y"
- No urgency ("only 3 left")
- Price note provides context (e.g. "laboratory-verified · 250ml")
- Availability stated honestly

---

## Future: Shopify Integration

When Shopify is integrated:
- Product editorial content remains in Sanity
- Inventory, stock levels, and shipping from Shopify
- Cart and checkout via Shopify Storefront API
- Price may sync from Shopify (source of truth for commerce)
- Sanity remains source of truth for content
- No Shopify branding visible to visitors
