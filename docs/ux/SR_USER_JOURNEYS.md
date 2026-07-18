# Sunnah Remedies — User Journeys

Verified paths for principal visitors. Routes use English unprefixed URLs; Danish equivalents under `/dk/…`.

## 1. Book a Hijama session

1. Land on `/`  
2. Choose **Book a Hijama session** (task pathway or masthead Clinical Consultations / mobile book link)  
3. `/consultations` — read hero (qualified practitioners, separate clinics)  
4. Select practitioner gender  
5. Select clinic — summary updates (location, price, duration)  
6. Select date — if none, correspondence fallback  
7. Select time — if none, correspondence fallback  
8. Enter patient details (autocomplete fields); optional medical notes stay local to form only  
9. Consent → **Book my appointment**  
10. Success: reference id + email expectation  

**Analytics (anonymous):** `consultation_view`, `booking_start` — never medical field values.

## 2. Purchase a remedy

1. `/` → **Browse remedies** or nav **The Apothecary**  
2. Catalogue or featured remedy  
3. Distinguish monograph (scholarship) vs purchase control  
4. If available: quantity → counter/checkout handoff  
5. If unavailable/forthcoming: truthful state, no false purchase  

## 3. Apply to the Academy

1. `/` → **Explore Academy programmes**  
2. `/the-academy` → Hijāma Diploma (or Foundations)  
3. Read decision summary (when present): dates, fee, requirements, primary action  
4. Entry requirements → enrolment / foundations enrol  
5. Submit application → confirmation of review process  

## 4. Register for a Sacred Journey

1. `/` → **Explore Sacred Journeys** or nav  
2. Open journey detail  
3. If registration open: register; else interest list  
4. Confirmation + preparation links  

## 5. Find Morning Dhikr

1. `/` → **Find duʿa and dhikr** or Knowledge Library → Duʿa & Dhikr  
2. Quick access / discovery: beginning my day  
3. `/knowledge/dhikr/morning` or collection slug  
4. Read Arabic (authoritative), translation, source — no autoplay  

## 6. Find a Knowledge Library publication

1. `/knowledge-library`  
2. Search or browse collection  
3. Open publication; note publication status  
4. Related material / return to library  

## Language parity

At any step: EN ↔ DA via language switcher preserves pathname; Danish served at `/dk` + path.
