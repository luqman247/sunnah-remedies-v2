# 05 — Information Architecture

## Site Structure

The information architecture follows the institutional model: departments, sections, and documents. The visitor enters through the Threshold and navigates by department.

---

## Primary Hierarchy

```
/                                   → The Threshold (Homepage)
├── /the-apothecary                 → Department landing
│   ├── /the-apothecary/catalogue   → Product catalogue
│   ├── /the-apothecary/[slug]      → Product monograph
│   ├── /the-apothecary/monographs  → All monographs
│   ├── /the-apothecary/ingredients → Ingredient library
│   ├── /the-apothecary/quality-standards
│   ├── /the-apothecary/laboratory-verification
│   └── /the-apothecary/faqs
│
├── /the-academy                    → Department landing
│   ├── /the-academy/hijama-diploma → Flagship programme
│   ├── /the-academy/[slug]         → Programme page
│   ├── /the-academy/curriculum
│   ├── /the-academy/learning-outcomes
│   ├── /the-academy/practical-sessions
│   ├── /the-academy/course-handbook
│   ├── /the-academy/student-guide
│   ├── /the-academy/faculty
│   ├── /the-academy/facilities
│   ├── /the-academy/clinical-standards
│   ├── /the-academy/assessment
│   ├── /the-academy/certification
│   ├── /the-academy/entry-requirements
│   ├── /the-academy/equipment
│   ├── /the-academy/graduate-pathways
│   ├── /the-academy/testimonials
│   ├── /the-academy/gallery
│   ├── /the-academy/policies
│   ├── /the-academy/faqs
│   └── /the-academy/enrolment
│
├── /sacred-journeys                → Department landing
│   ├── /sacred-journeys/[slug]     → Journey page
│   ├── /sacred-journeys/itineraries
│   ├── /sacred-journeys/preparation
│   ├── /sacred-journeys/reading
│   ├── /sacred-journeys/packing
│   ├── /sacred-journeys/flight-guidance
│   ├── /sacred-journeys/accommodation
│   ├── /sacred-journeys/educational-sessions
│   ├── /sacred-journeys/reflection-journals
│   ├── /sacred-journeys/companionship
│   ├── /sacred-journeys/health-guidance
│   ├── /sacred-journeys/gallery
│   ├── /sacred-journeys/registration
│   ├── /sacred-journeys/policies
│   └── /sacred-journeys/faqs
│
├── /knowledge-library              → Department landing
│   ├── /knowledge-library/[slug]   → Article page
│   ├── /knowledge-library/research
│   └── /knowledge-library/patient-guides
│
├── /consultations                  → Clinical consultations
├── /charter                        → Founding Charter
├── /the-register                   → Practitioner register
├── /correspondence                 → Contact
│
└── /studio                         → Sanity Studio (editors only)
```

---

## Navigation Model

### Primary Navigation (Masthead)

Visible at all times:
- The Apothecary
- The Academy
- Sacred Journeys
- Knowledge Library
- Clinical Consultations (accent)

### Department Navigation

Each department landing page includes a `DepartmentNav` component at the bottom, listing all sections within that department with descriptions.

### Footer Navigation

Four columns:
1. The Pillars (department links)
2. Institution (charter, quality, consultations, register)
3. Connect (correspondence, enrolment, registration)
4. Legal (privacy, terms, accessibility)

### Breadcrumbs

Not currently implemented. Content hierarchy is communicated through:
- Section labels and eyebrows
- Page position within department
- DepartmentNav at page bottom

---

## Content Relationships

### Product → Related Content

Each product monograph links to:
- Related products (by ingredient family or use)
- Academy lessons (relevant educational content)
- Knowledge Library articles
- Ingredient library entries

### Programme → Supporting Content

Each programme links to:
- Faculty profiles
- Curriculum details
- Testimonials
- Related journeys or library articles

### Journey → Supporting Content

Each journey links to:
- Scholar profiles
- Reading lists
- Related library articles
- Related Academy programmes

### Article → Related Content

Each article links to:
- Author profile
- Topic pages
- Related articles
- Referenced products or programmes

---

## URL Strategy

### Conventions

- Lowercase, hyphenated slugs
- Department prefix for all department content
- No date-based URLs (content is evergreen)
- No category prefixes beyond department
- Slugs are human-readable and permanent

### Examples

| Content | URL |
|---|---|
| Sidr Honey monograph | `/the-apothecary/sidr-honey` |
| Hijama Diploma | `/the-academy/hijama-diploma` |
| Umrah Journey | `/sacred-journeys/umrah` |
| Article on black seed | `/knowledge-library/black-seed-research` |

### Redirect Policy

- Slugs must not change once published
- If a slug must change, a 301 redirect is mandatory
- Old URLs must never 404

---

## Search Architecture

Content is structured for future institutional search:

| Searchable Type | Fields Indexed |
|---|---|
| Products | name, botanicalName, nature, ingredients |
| Courses | name, description, curriculum topics |
| Journeys | name, location, educational sessions |
| Articles | title, excerpt, body, topics, authors |
| Faculty | name, qualifications, departments |
| Ingredients | name, botanicalName, traditional uses |
| Downloads | title, description, file type |

---

## Content Hierarchy Within Pages

Every page follows a consistent vertical hierarchy:

1. **Hero** — cinematic or simple, one statement
2. **Introduction** — section label, folio, title, lede
3. **Primary content** — editorial features, curriculum, itinerary
4. **Supporting content** — trust grid, testimonials, FAQ
5. **Closing** — pull quote or founding statement
6. **Department navigation** — links to all sections

This hierarchy is consistent across all departments. Visitors develop navigation intuition through repetition.

---

## Content Governance

### Ownership

| Content Type | Owner |
|---|---|
| Products | Apothecary editorial team |
| Programmes | Academy faculty |
| Journeys | Sacred Journeys coordinator |
| Articles | Knowledge Library editorial |
| Institution pages | Institutional governance |
| Navigation | Platform administrator |

### Publication Authority

No content is published without:
- Factual verification
- Source citation check
- Tone and voice review
- SEO metadata completion
- Alt text for all images
