# 12 — Sacred Journeys

## Philosophy

Sacred Journeys are educational pilgrimages — not holidays, not tours, not "experiences." Every journey is ordered by purpose rather than itinerary. Preparation precedes departure. A reading list, a faculty companion, and a clear statement of difficulty accompany every group.

The institution does not sell travel. It provides structured, scholarly pilgrimage with accountability and care.

---

## Journey Schema

### Core Fields

| Field | Type | Purpose |
|---|---|---|
| `name` | String | Journey title |
| `slug` | Slug | URL path (permanent) |
| `subtitle` | String | One-line description |
| `folio` | String | Catalogue reference |
| `meaning` | Array of text | Purpose and significance |
| `season` | String | Time of year |
| `duration` | String | Journey length |
| `location` | String | Destination |
| `groupSize` | String | Maximum participants |
| `fee` | String | Fee with context |
| `feeNote` | String | What the fee includes/excludes |
| `nextDeparture` | String | Next departure date |

### Journey Content

| Field | Type | Purpose |
|---|---|---|
| `forWhom` | Array of text | Who should apply |
| `whatItAsks` | Array of text | Physical/spiritual demands |
| `preparation` | Array of text | Pre-departure preparation |
| `flightGuidance` | Array of text | Flight coordination |
| `accommodationPhilosophy` | Array of text | Lodging standards |
| `learning` | Array of text | Educational framework |
| `educationalSessions` | Array of sessions | Structured teaching |
| `companionship` | Array of text | Group dynamics and adab |
| `guidance` | Array of text | On-ground guidance |
| `spiritualGrowth` | Array of text | Reflective framework |
| `reflection` | Array of text | Reflection practice |
| `reflectionJournals` | Array of text | Journaling guidance |
| `healthGuidance` | Array of text | Health requirements |
| `safety` | Array of text | Safety protocols |
| `organisation` | Array of text | Logistics and coordination |

### Itinerary

Each day of the journey:

| Field | Purpose |
|---|---|
| `day` | Day identifier (e.g. "Day 1") |
| `title` | Day title |
| `focus` | Primary educational focus |
| `activities` | Array of planned activities |

### Scholars

Faculty accompanying the journey:

| Field | Purpose |
|---|---|
| `name` | Scholar name |
| `role` | Role on the journey |
| `grounding` | Scholarly basis |
| `biography` | Background (array of paragraphs) |

### Relationships

| Field | Type | Purpose |
|---|---|---|
| `reading` | Array of reading items | Pre-departure reading list |
| `packing` | Array of text | Packing guidance |
| `gallery` | Array of `institutionalImage` | Journey photography |
| `faq` | Array of Q&A | Journey-specific questions |
| `policies` | Array of `policyItem` | Terms and policies |
| `pathways` | Array of links | Related content |

---

## Journey Types

| Type | Purpose | Example |
|---|---|---|
| Umrah | Educational pilgrimage to Makkah and Madinah | Annual Umrah programme |
| Heritage | Scholarly travel to sites of Islamic learning | Andalusia, Fez, Cairo |
| Agricultural | Visit to sources of remedies | Palestinian olive groves |
| Retreat | Focused study and reflection | Desert retreat |

---

## Preparation Framework

Every journey requires preparation that begins weeks before departure:

### Reading List

Assigned texts relevant to the journey's educational purpose. Published in full on the journey page.

### Fitness Assessment

Physical requirements stated honestly:
- Walking distances per day
- Climate conditions
- Altitude considerations
- Vaccination requirements

### Documentation

Travel documents required:
- Valid passport
- Visa (where applicable)
- Travel insurance (mandatory)
- Medical disclosure form
- Emergency contacts

### Spiritual Preparation

Guidance on:
- Intentions and purpose
- Recommended worship
- Reflection exercises
- Community preparation

---

## Educational Sessions

Each journey includes structured educational content:

| Field | Purpose |
|---|---|
| `title` | Session title |
| `format` | Lecture / Discussion / Field study / Circle |
| `description` | What the session covers |

Sessions are led by named scholars and documented in advance.

---

## Accommodation Standards

The institution states accommodation honestly:
- Proximity to key sites (measured, not implied)
- Room sharing arrangements
- Facilities available
- What is and is not included
- No false luxury claims
- No tourism-standard star ratings

---

## Registration Process

```
1. Expression of Interest
   ↓
2. Reading List Sent
   ↓
3. Application Form
   ↓
4. Interview (group suitability)
   ↓
5. Medical Disclosure
   ↓
6. Offer of Place
   ↓
7. Fee Payment (deposit + balance)
   ↓
8. Preparation Programme Begins
   ↓
9. Pre-Departure Gathering
   ↓
10. Departure
```

---

## Policies

| Policy | Coverage |
|---|---|
| Cancellation | Refund schedule (tiered by timing) |
| Insurance | Travel insurance mandatory |
| Conduct | Expected behaviour, Islamic adab |
| Health | Medical disclosure, fitness requirements |
| Safety | Emergency procedures, group safety |
| Postponement | Institutional right to postpone |
| Amendments | Right to amend itinerary for safety |

---

## Group Standards

| Principle | Application |
|---|---|
| Group size | Maximum stated (typically 15-25) |
| Gender arrangements | Separate or family groups as appropriate |
| Age requirements | Minimum age stated where applicable |
| Fitness | Physical requirements stated honestly |
| Companionship | Adab of travel, mutual care |

---

## Photography

Journey photography documents:
- Sacred architecture (mosques, historic sites)
- Landscape and environment
- Group in transit (no individual identification without consent)
- Educational settings
- Natural environment

Never:
- Tourist-style posed photographs
- Inside sacred spaces where photography is prohibited
- Individual faces without consent
- Luxury staging
- Drone footage of sacred sites

---

## Communication Standards

Journey pages communicate:
- Purpose before logistics
- Demands before delights
- Limits before promises
- Preparation requirements before booking

The tone is inviting without urgency:
- No "limited places remaining"
- No countdown timers
- No early-bird pricing psychology
- Registration opens; places are allocated by suitability, not speed

---

## Future: Payment Integration

When Stripe is integrated:
- Deposit payment online
- Balance payment by instalment (where offered)
- Refund processing per cancellation policy
- Invoice generation for the full journey
- Group booking coordination
- No payment processing branding visible to participants
