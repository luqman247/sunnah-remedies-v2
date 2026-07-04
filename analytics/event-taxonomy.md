# Event Taxonomy — Sunnah Remedies Intelligence Platform

## Naming Convention
- `snake_case`, `object_action` order
- GA4 reserved names used where they exist
- Max 25 parameters per event, 500 distinct event names
- No PII in any parameter, ever

## Events by Domain

### Editorial (Knowledge Library)
| Event | Trigger | Source | Ledger |
|-------|---------|--------|--------|
| `article_view` | User lands on article page | Client | Integrity |
| `article_read_25` | Scroll past 25% | Client | Integrity |
| `article_read_50` | Scroll past 50% | Client | Integrity |
| `article_read_75` | Scroll past 75% | Client | Integrity |
| `article_read_100` | Scroll past 100% | Client | Integrity |
| `article_complete` | End of article + minimum time | Client | Integrity |
| `citation_click` | Click citation reference | Client | Integrity |
| `reference_click` | Click reference link | Client | Integrity |
| `internal_link_click` | Click internal content link | Client | Integrity |
| `topic_view` | View topic/category page | Client | Integrity |

### Knowledge / Search
| Event | Trigger | Source | Ledger |
|-------|---------|--------|--------|
| `search` | Perform a search | Client | Both |
| `search_refine` | Refine search query | Client | Both |
| `search_zero_result` | Search returns zero results | Client | Both |
| `entity_view` | View knowledge entity | Client | Integrity |
| `graph_traverse` | Navigate between entities | Client | Integrity |
| `faq_expand` | Expand FAQ item | Client | Integrity |

### Commerce (Enhanced Ecommerce)
| Event | Trigger | Source | Ledger | Key Event |
|-------|---------|--------|--------|-----------|
| `view_item` | View product page | Client | Commercial | |
| `view_item_list` | View product listing | Client | Commercial | |
| `select_item` | Click product from list | Client | Commercial | |
| `gallery_interact` | Interact with product gallery | Client | Commercial | |
| `add_to_cart` | Add to cart | Client | Commercial | |
| `remove_from_cart` | Remove from cart | Client | Commercial | |
| `begin_checkout` | Start checkout | Client | Commercial | |
| `add_shipping_info` | Add shipping details | Client | Commercial | |
| `add_payment_info` | Add payment details | Client | Commercial | |
| `purchase` | Order confirmed | **Server** | Commercial | **Yes** |
| `refund` | Refund processed | **Server** | Commercial | |

### Academy (Courses)
| Event | Trigger | Source | Ledger | Key Event |
|-------|---------|--------|--------|-----------|
| `course_view` | View course page | Client | Both | |
| `curriculum_view` | View curriculum details | Client | Both | |
| `course_application_start` | Begin application | Client | Commercial | |
| `course_enrol` | Student enrolled | **Server** | Commercial | **Yes** |
| `lesson_start` | Start lesson | **Server** | Integrity | |
| `lesson_complete` | Complete lesson | **Server** | Integrity | |
| `video_progress` | Video milestone (25/50/75/100%) | Client | Integrity | |
| `quiz_attempt` | Begin quiz | **Server** | Integrity | |
| `quiz_complete` | Complete quiz | **Server** | Integrity | |
| `certificate_issued` | Certificate generated | **Server** | Integrity | **Yes** |
| `revision_open` | Revisit course material | Client | Integrity | |
| `tutor_query` | Use AI tutor | **Server** | Integrity | |

### Clinical (Consultations)
| Event | Trigger | Source | Ledger | Key Event |
|-------|---------|--------|--------|-----------|
| `consultation_view` | View consultation page | Client | Integrity | |
| `booking_start` | Begin booking | Client | Integrity | |
| `intake_start` | Begin intake form | Client | Integrity | |
| `intake_complete` | Complete intake form | **Server** | Integrity | |
| `appointment_booked` | Appointment confirmed | **Server** | Integrity | **Yes** |
| `appointment_attended` | Patient attends | **Server** | Integrity | |

### Sacred Journeys
| Event | Trigger | Source | Ledger | Key Event |
|-------|---------|--------|--------|-----------|
| `journey_view` | View journey page | Client | Both | |
| `programme_view` | View programme | Client | Both | |
| `journey_booking_start` | Begin booking | Client | Commercial | |
| `journey_deposit` | Deposit paid | **Server** | Commercial | **Yes** |
| `preparation_open` | Open preparation materials | Client | Integrity | |

### AI
| Event | Trigger | Source | Ledger |
|-------|---------|--------|--------|
| `ai_query` | Submit question | **Server** | Integrity |
| `ai_response` | AI returns response | **Server** | Integrity |
| `ai_citation_shown` | Response includes cited source | **Server** | Integrity |
| `ai_fallback` | AI declines/defers | **Server** | Integrity |
| `ai_recommendation` | AI recommends product/course | **Server** | Both |
| `ai_feedback` | User provides feedback | Client | Integrity |
| `translation_used` | Language switch | Client | Integrity |

### Trust / System
| Event | Trigger | Source | Ledger | Key Event |
|-------|---------|--------|--------|-----------|
| `newsletter_signup` | Subscribe to newsletter | **Server** | Integrity | **Yes** |
| `account_create` | Create account | **Server** | Both | |
| `error_boundary` | Error caught | Client | Commercial | |
| `consent_update` | Update consent preferences | Client | Integrity | |

## Key Events (Conversions) — Two-Ledger Pairing
| Key Event | Ledger | Integrity Guard Shown Alongside |
|-----------|--------|-------------------------------|
| `purchase` | Commercial | Refund rate, product review recency |
| `course_enrol` | Commercial | Completion rate, knowledge-gap rate |
| `appointment_booked` | Integrity | Intake completion, attendance rate |
| `journey_deposit` | Commercial | Preparation-material engagement |
| `newsletter_signup` | Integrity | Subsequent article completion |
| `certificate_issued` | Integrity | Average mastery score |
