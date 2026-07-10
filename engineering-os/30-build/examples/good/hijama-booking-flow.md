# Good Example — Hijama Booking Flow

## Purpose

Demonstrates a well-architected booking flow for a Hijama (cupping) therapy appointment, showing correct separation of concerns, CMS-driven content, server-side validation, and verifiable acceptance criteria.

This is the reference implementation for any practitioner-booking feature across the platform.

---

# Why This Is a Good Example

- Practitioner, service, and availability data live in the CMS, not in code.
- Business rules (buffer times, contraindication screening) are expressed once, server-side.
- The UI is a thin, accessible presentation layer over a typed booking service.
- Every state — loading, empty, error, success — is handled explicitly.
- The flow is verifiable against clear acceptance criteria.

---

# User Journey

Select Service (from CMS)

↓

Select Practitioner (filtered by service and location)

↓

Select Available Slot (computed server-side)

↓

Complete Pre-Screening (contraindications)

↓

Confirm and Pay

↓

Receive Confirmation (email via Resend)

---

# Separation of Concerns

| Layer | Responsibility | Owns |
|---|---|---|
| Sanity CMS | Editorial + configuration | Services, practitioners, locations, screening questions |
| Booking service | Business logic | Availability computation, buffer rules, validation |
| API route | Boundary + validation | Request validation, auth, orchestration |
| React components | Presentation | Rendering, local UI state, accessibility |

No layer reaches across a boundary. A component never computes availability; the service never renders.

---

# Content Model (CMS)

Service, practitioner, location, and the pre-screening questionnaire are all Sanity documents. Adding a new service or editing a contraindication question is an editorial action, never a code change.

```ts
// sanity/schemas/service.ts (illustrative)
export default {
  name: 'service',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'slug' },
    { name: 'durationMinutes', type: 'number' },
    { name: 'bufferMinutes', type: 'number' },
    { name: 'practitioners', type: 'array', of: [{ type: 'reference', to: [{ type: 'practitioner' }] }] },
    { name: 'screeningQuestions', type: 'array', of: [{ type: 'reference', to: [{ type: 'screeningQuestion' }] }] },
  ],
}
```

---

# Business Logic (server-side, single source of truth)

```ts
// lib/booking/availability.ts (illustrative)
export function computeSlots(
  practitioner: Practitioner,
  service: Service,
  existingBookings: Booking[],
  date: Date,
): Slot[] {
  // Availability is derived, never stored pre-expanded.
  // Buffer time and service duration are applied here, once.
  const working = practitioner.workingHoursFor(date);
  return working
    .toSlots(service.durationMinutes + service.bufferMinutes)
    .filter((slot) => !slot.collidesWith(existingBookings));
}
```

---

# API Boundary (validation lives here)

```ts
// app/api/bookings/route.ts (illustrative)
export async function POST(req: Request) {
  const parsed = createBookingSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 422 });
  }
  // Re-validate availability server-side — never trust the client's slot.
  const stillAvailable = await verifySlot(parsed.data);
  if (!stillAvailable) {
    return Response.json({ error: 'SLOT_TAKEN' }, { status: 409 });
  }
  const booking = await createBooking(parsed.data);
  await sendConfirmation(booking); // Resend
  return Response.json({ booking }, { status: 201 });
}
```

The client's chosen slot is **re-validated on the server**. This prevents the classic double-booking race where two users select the same slot before either confirms.

---

# Acceptance Criteria

- [ ] Services, practitioners, and screening questions are editable in the CMS without deployment.
- [ ] Available slots are computed server-side and respect service duration + buffer.
- [ ] A slot taken between selection and confirmation returns a clear `409` and the UI recovers gracefully.
- [ ] Pre-screening contraindications block confirmation with an explained message.
- [ ] Confirmation email is sent on successful booking.
- [ ] All interactive elements are keyboard-navigable and screen-reader labelled.
- [ ] Loading, empty, error, and success states are each handled.

---

# Related Anti-pattern

See `examples/bad/hardcoded-products.md` and `examples/bad/mixed-business-logic.md` — the wrong version of this flow hardcodes services in the component and computes availability in the browser, producing double-bookings and un-editable content.

→ **Do this instead:** keep content in the CMS, compute availability server-side, and re-validate at the boundary.

---

# Related Documents

- Sanity Workflow
- Feature Specification Template
- Security Checklist
- Accessibility Checklist

---

## Document Metadata

**Document Type:** Example (Good)
**Version:** 1.0.0
**Status:** Approved
**Owner:** Sunnah Remedies Engineering
**Review Cycle:** Annual
