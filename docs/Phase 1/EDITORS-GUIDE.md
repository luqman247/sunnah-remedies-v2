# Editors Guide — Sunnah Remedies CMS

## Accessing the Studio

The editorial studio is available at:

```
https://your-domain.com/studio
```

Log in with your Sanity credentials to manage all website content.

---

## Studio Organisation

The studio is organised by institutional department:

| Section | What You Can Edit |
|---|---|
| **Editorial** | Homepage, Navigation, Announcements |
| **The Apothecary** | Products, Collections, Categories, Ingredients |
| **The Academy** | Programmes, Faculty |
| **Sacred Journeys** | Journeys |
| **Knowledge Library** | Articles, Authors, Topics |
| **Clinical** | Consultations page |
| **Institution** | Charter, Settings, Footer, SEO |
| **Testimonials & FAQs** | Cross-department testimonials and questions |

---

## How to Edit the Homepage

1. Navigate to **Editorial → Homepage**
2. Use the tabs at the top to edit specific sections:
   - **Hero** — the main photograph and statement
   - **Institution** — the founding introduction
   - **Three Pillars** — the three department features
   - **Trust** — the trust grid items
   - **Featured Remedies** — editorial product features
   - **Academy** — the Academy highlight
   - **Knowledge Library** — the Library highlight
   - **Sacred Journeys** — the journeys highlight
   - **Founding Statement** — the dark section
   - **Invitation** — the closing call-to-action
   - **SEO** — page metadata

3. Click **Publish** when ready

---

## How to Add a Product

1. Navigate to **The Apothecary → Products**
2. Click **Create new**
3. Fill in the required fields:
   - **Product Name** — the English name
   - **Slug** — auto-generated from the name (this becomes the URL)
   - **Botanical Name** — Latin binomial
   - **Nature** — short catalogue description
4. Use the tabs to add:
   - **Monograph** content (historical context, references, scholarship)
   - **Provenance & Quality** (origin, lab verification)
   - **Usage & Storage** (suggested use, contraindications)
   - **Commerce** (price, volume, stock status)
   - **Media** (photographs, gallery)
   - **Relations** (related products, ingredients)
   - **SEO** (meta title, description)
5. Click **Publish**

---

## How to Add an Academy Programme

1. Navigate to **The Academy → Programmes**
2. Click **Create new**
3. Fill in the overview (name, tier, duration, fee)
4. Add curriculum modules in the **Curriculum** tab
5. Link faculty members
6. Add assessment details, clinical standards
7. Publish

---

## How to Add a Sacred Journey

1. Navigate to **Sacred Journeys**
2. Click **Create new**
3. Fill in the overview (name, location, duration, fee)
4. Add itinerary days in the **Itinerary** tab
5. Add educational sessions
6. Add preparation materials and reading list
7. Publish

---

## How to Publish an Article

1. Navigate to **Knowledge Library → Articles**
2. Click **Create new**
3. Enter the title and excerpt
4. Write the body using the rich text editor
5. Assign an author and topics
6. Set the published date
7. Add a main image with alt text
8. Fill in SEO fields
9. Publish

---

## How to Edit Navigation

1. Navigate to **Editorial → Navigation**
2. Reorder items by dragging
3. Hide items by toggling the **Hidden** flag
4. Add dropdown children to any item
5. Mark items as **Highlighted** for accent styling
6. Publish

---

## How to Edit the Footer

1. Navigate to **Institution → Footer**
2. Edit the pre-footer statement
3. Modify footer columns and their links
4. Update the closing statement and colophon
5. Publish

---

## Rich Text Editing

The body editor supports:

- **Headings** (H2, H3, H4)
- **Bold** and *italic*
- **Links** (external and internal)
- **Arabic text blocks** — with transliteration and translation
- **Qur'an references** — with surah, ayah, and translator
- **Hadith references** — with source, grade, and narrator
- **Academic citations** — author, title, publication, DOI
- **Evidence panels** — for research summaries
- **Clinical notes** — for medical information
- **Scholar notes** — for scholarly commentary
- **Callout boxes** — for highlighted information
- **Warning blocks** — for important warnings
- **Images** — with required alt text
- **Downloads** — file attachments

---

## Image Guidelines

When uploading images:

1. **Always** add alt text (required)
2. Add a caption if the image needs context
3. Credit the photographer
4. Use the hotspot tool to set the focal point
5. Recommended sizes:
   - Hero images: 2400px wide minimum
   - Editorial features: 1600px wide
   - Portraits: 800px wide
   - Products: 1200px wide

---

## SEO

Every content type has an SEO section:

- **Meta Title** — keep under 60 characters
- **Meta Description** — keep between 120-160 characters
- **Social Image** — 1200×630px recommended
- **Keywords** — add as tags
- **No Index** — only check if you want to hide from search

If you leave SEO fields empty, sensible defaults are generated from the page title and content.

---

## Editorial Workflow

Content states:

| State | Meaning |
|---|---|
| Draft | Being written, not visible on the website |
| In Review | Under editorial review |
| Published | Live on the public website |
| Scheduled | Approved, waiting for publication date |
| Archived | Removed from public view |

Use the **Editorial** tab on any document to set the workflow state.

---

## Publishing Changes

After editing content:

1. Review your changes in the studio
2. Click **Publish** to make changes live
3. Changes appear on the website within seconds (automatic revalidation)

To schedule content:
1. Set the editorial status to **Scheduled**
2. Set the **Scheduled Publish Date**
3. Publish the document (it will become visible at the scheduled time)

---

## Adding Testimonials

1. Navigate to **Testimonials & FAQs → Testimonials**
2. Click **Create new**
3. Enter the statement, name, context, and year
4. Select the department
5. Confirm consent was obtained
6. Toggle **Featured** if it should appear on landing pages
7. Publish

---

## Adding FAQs

1. Navigate to **Testimonials & FAQs → FAQs**
2. Click **Create new**
3. Enter the question and answer
4. Select the department
5. Set the order number (lower = appears first)
6. Publish

---

## Important Rules

1. **Never** delete a published product, programme, or article without creating a redirect
2. **Never** change a slug after publication (breaks existing links)
3. **Always** add alt text to images
4. **Always** cite sources for Prophetic references with grades
5. **Always** state contraindications for products
6. **Never** use marketing language (see Editorial Style Guide)
7. **Never** make medical claims

---

## Getting Help

If you need technical support:
- Consult the documentation in `/docs/`
- Contact the platform administrator
- Do not modify code — all content changes are through the Studio
