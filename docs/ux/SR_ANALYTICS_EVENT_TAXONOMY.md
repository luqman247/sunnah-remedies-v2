# UX Analytics Event Taxonomy

Extends `analytics/lib/events.ts` and `analytics/lib/types.ts`.  
**Never send:** medical notes, duʿa search free text that may expose private circumstances, form field values, names, emails, phones, application statements.

## Consent

Client events require `analytics_storage` granted (existing consent gate).

## Journey events (UX priority)

| Event | When | Params (allowed) | Notes |
|-------|------|------------------|-------|
| `consultation_view` | Consultations page mount | `consultation_type` | Wired |
| `booking_start` | First practitioner selection | `consultation_type` | Wired; no PII |
| `booking_step_complete` | Optional future | `step` (1–5) | Do not include clinic address free text if sensitive |
| `booking_submit` | Successful submit | `consultation_type` | Reference id only if non-identifying |
| `booking_no_availability` | Empty dates/slots | `step`: `date` \| `time` | Wired later if needed |
| `homepage_task_select` | Task pathway click | `task_id` | Add when Link instrumentation available |
| `nav_primary_select` | Masthead dept click | `href` | Optional |
| `language_changed` | Switcher | `from_language`, `to_language` | Use existing `translation_used` or alias |
| `course_view` / `course_application_start` | Academy | Existing types | |
| `journey_view` / `journey_booking_start` | Sacred Journeys | Existing | |
| `view_item` / `begin_checkout` | Commerce | Ecommerce item ids | No health claims in params |
| `search` / `search_zero_result` | Knowledge search | Prefer category facets over raw query when query may be sensitive | Dhikr search: avoid logging raw query |
| `entity_view` | Knowledge entity | `entity_id`, type | |

## Implementation notes

- Prefer existing emitters in `analytics/lib/events.ts`  
- New names must be added to `AnalyticsEventName` before use  
- Document GTM trigger mapping in `analytics/docs/` when promoting to production
