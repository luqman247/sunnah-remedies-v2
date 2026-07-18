# Sunnah Remedies — User Journeys

Verified paths for principal visitors. English uses unprefixed URLs; **canonical Danish uses `/dk/…`**. Internal App Router locale id `da` is not a public URL — `/da` permanently redirects to `/dk`.

## Interaction counts (homepage → destination)

| Task | Before (desktop / mobile) | After (desktop / mobile) |
|------|---------------------------|--------------------------|
| Book a consultation | 1 / 2 | **1** / **1** (hero) or 2 via Navigation |
| Browse remedies | 1 / 2 | **1** / **1** |
| Explore programmes | 1 / 2 | **1** / **1** |
| Find Duʿa & Dhikr | 2+ / 3+ | **1** / **1** |
| Explore the Institute | 2+ / 2+ | **1** / **1–2** |

## 1. Book a Hijama session

1. Land on `/`  
2. Choose **Book a consultation** (hero primary, masthead accent, mobile primary, or pathway “I want to book Hijāma”)  
3. `/consultations` — read hero (qualified practitioners, separate clinics)  
4. Select practitioner gender  
5. Select clinic — summary updates (location, price, duration)  
6. Select date — if none, correspondence fallback  
7. Select time — if none, correspondence fallback  
8. Enter patient details (autocomplete fields); optional medical notes stay local to form only  
9. Consent → **Book my appointment**  
10. Success: reference id + email expectation  

**Analytics (anonymous):** `consultation_view`, `booking_start` — never medical field values.  
**Phase 2B note:** Booking *flow* UI unchanged; only discovery/entry clarity improved.

## 2. Purchase a remedy

1. `/` → **Browse remedies** (hero quiet link, pathway, or nav **The Apothecary**)  
2. Catalogue or featured remedy  
3. Distinguish monograph (scholarship) vs purchase control  
4. If available: quantity → counter/checkout handoff  
5. If unavailable/forthcoming: truthful state, no false purchase  

## 3. Apply to the Academy

1. `/` → **Explore programmes** (hero, pathway “I want to study”, or nav **The Academy**)  
2. `/the-academy` → Hijāma Diploma (or Foundations)  
3. Read decision summary (when present): dates, fee, requirements, primary action  
4. Entry requirements → enrolment / foundations enrol  
5. Submit application → confirmation of review process  

## 4. Register for a Sacred Journey

1. `/` → pathway **I am considering a Sacred Journey** (shown only when public journeys exist) or nav **Sacred Journeys**  
2. Open journey detail  
3. Interest / registration surface as published — do not present registration as open unless source of truth confirms  
4. Confirmation + preparation links  

## 5. Find Morning Dhikr

1. `/` → **Find Duʿa & Dhikr** (hero quiet link, pathway, or mobile Common tasks)  
2. `/knowledge-library/dua-dhikr` hub  
3. Quick access / Morning Dhikr (published collections only as live links)  
4. Read Arabic (authoritative), translation, source — no autoplay  

## 6. Explore the Institute

1. `/` → pathway **I want to understand the Institute** or masthead **The Institute**  
2. `/institute` — purpose, charter, standards  

## 7. Find a Knowledge Library publication

1. `/knowledge-library` (nav or department card)  
2. Search or browse collection  
3. Open publication; note publication status  
4. Related material / return to library  

## Language parity

At any step: EN ↔ DA via language switcher preserves pathname and lands on `/dk` for Danish. New Phase 2B chrome and pathway labels have EN/DA catalogue parity. Remaining editorial CMS body gaps are deferred (see Danish content gap register).
