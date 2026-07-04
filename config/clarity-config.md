# Microsoft Clarity Configuration

## Project Settings

| Setting | Value |
|---------|-------|
| Project ID | Set via `NEXT_PUBLIC_CLARITY_PROJECT_ID` |
| Input masking | **Strict** (all text inputs masked) |
| Recording | Consent-gated (`analytics_storage` = granted) |
| Cookie consent | Integrated with Consent Mode v2 |

## Privacy Configuration

### Excluded from Recording
- `/handbook/*` — Staff handbook (internal)
- `/ops/*` — Operations pages (internal)
- `/sign-in` — Authentication pages
- `/studio/*` — Sanity Studio (CMS)
- `/intelligence` — Analytics dashboard (internal)

### Masking Rules
- All text input fields: **masked**
- All form fields in booking/clinical pages: **masked**
- All checkout form fields: **masked**
- Student portal authenticated fields: **masked**

### PII Scrubbing
- Enabled globally
- Email addresses: scrubbed
- Phone numbers: scrubbed
- Postal codes: scrubbed

## Integration

### GA4 ↔ Clarity Link
Clarity is linked to GA4 so that GA4 segments (e.g. cart abandoners, course considerers) can be opened as Clarity session recordings for root-cause analysis.

### Segment Mapping
| GA4 Segment | Clarity Tag |
|-------------|-------------|
| Cart Abandoners | `user_segment: cart_abandoner` |
| Course Considerers | `user_segment: course_considerer` |
| Engaged Readers | `user_segment: engaged_reader` |
| Researchers | `user_segment: researcher` |

## Custom Tags
| Tag | Values |
|-----|--------|
| `pillar` | apothecary, academy, journeys, knowledge, clinical, institute |
| `content_type` | article, product, course, entity, consultation, journey |
| `user_segment` | visitor, patient, student, researcher, customer |
