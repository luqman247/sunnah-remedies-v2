/**
 * Consultation booking journey — Phase 2C smoke.
 * node --import tsx --test tests/ux/booking-journey.smoke.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import {
  BOOKING_STEPS,
  type BookingStepId,
} from "../../src/lib/booking/types";
import {
  CLINICS,
  fetchAvailability,
  getAvailableDates,
  getAvailableTimeSlots,
  resetAvailabilityAttempts,
  submitConsultationRequest,
} from "../../src/lib/booking/service";

const client = readFileSync(
  resolve("src/app/[locale]/consultations/ConsultationsClient.tsx"),
  "utf8",
);
const draft = readFileSync(resolve("src/lib/booking/draft-storage.ts"), "utf8");
const schedule = readFileSync(
  resolve("src/components/booking/ScheduleStep.tsx"),
  "utf8",
);
const patient = readFileSync(
  resolve("src/components/booking/PatientForm.tsx"),
  "utf8",
);
const summary = readFileSync(
  resolve("src/components/booking/BookingSummary.tsx"),
  "utf8",
);
const success = readFileSync(
  resolve("src/components/booking/BookingSuccess.tsx"),
  "utf8",
);
const progress = readFileSync(
  resolve("src/components/booking/BookingProgress.tsx"),
  "utf8",
);
const en = JSON.parse(readFileSync(resolve("src/messages/en.json"), "utf8"));
const da = JSON.parse(readFileSync(resolve("src/messages/da.json"), "utf8"));

const mockEnv = {
  NODE_ENV: "test",
  ENABLE_MOCK_BOOKING_FLOW: "true",
} as NodeJS.ProcessEnv;

function nextWeekday(day: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const candidate = new Date(d);
    candidate.setDate(d.getDate() + i);
    if (candidate.getDay() === day) return candidate;
  }
  throw new Error(`No weekday ${day} in next fortnight`);
}

test("booking steps are ordered and named", () => {
  assert.deepEqual(BOOKING_STEPS, [
    "practitioner",
    "clinic",
    "schedule",
    "details",
    "review",
  ]);
  for (const step of BOOKING_STEPS) {
    assert.equal(typeof en.booking.progress.steps[step], "string");
    assert.equal(typeof da.booking.progress.steps[step], "string");
  }
  assert.match(progress, /BOOKING_STEPS/);
  assert.match(progress, /aria-current/);
  assert.match(client, /BookingProgress/);
  assert.match(client, /BookingStepNav/);
});

test("continue is gated; back and retain selections are wired", () => {
  assert.match(client, /continueDisabled=\{!canContinuePractitioner\}/);
  assert.match(client, /continueDisabled=\{!canContinueClinic\}/);
  assert.match(client, /continueDisabled=\{!canContinueSchedule\}/);
  assert.match(client, /handleBack/);
  assert.match(client, /writeBookingDraft/);
  assert.match(client, /readBookingDraft/);
  assert.match(client, /medicalConditions: ""/);
  assert.doesNotMatch(client, /searchParams|URLSearchParams|router\.push\(`.*email/);
  assert.match(draft, /sessionStorage/);
  assert.doesNotMatch(draft, /localStorage|location\.|history\.|href/);
});

test("appointment summary and gender labels are localised", () => {
  assert.match(summary, /paymentTiming/);
  assert.match(summary, /cancellation/);
  assert.match(summary, /booking-appointment-summary/);
  assert.equal(en.booking.summary.male, "Male practitioner");
  assert.equal(da.booking.summary.male, "Mandlig behandler");
  assert.equal(en.booking.summary.female, "Female practitioner");
  assert.equal(da.booking.summary.female, "Kvindelig behandler");
  assert.equal(en.booking.viewSummary, "View appointment summary");
  assert.equal(da.booking.viewSummary, "Se aftaleoversigt");
  assert.equal(en.booking.summary.submit, "Submit consultation request");
});

test("availability: loading, empty Monday, unavailable slots, Tuesday error+retry", async () => {
  assert.match(schedule, /availability\.loading/);
  assert.match(schedule, /availability\.empty/);
  assert.match(schedule, /availability\.error/);
  assert.match(schedule, /availability\.retry/);
  assert.match(schedule, /\/correspondence/);
  assert.match(schedule, /aria-disabled/);
  assert.match(schedule, /time-pill__state/);

  const monday = nextWeekday(1);
  assert.equal(getAvailableTimeSlots("london", monday).length, 0);
  const empty = await fetchAvailability("london", monday);
  assert.equal(empty.status, "empty");

  resetAvailabilityAttempts();
  const tuesday = nextWeekday(2);
  await assert.rejects(() => fetchAvailability("london", tuesday));
  const recovered = await fetchAvailability("london", tuesday);
  assert.equal(recovered.status, "ready");
  assert.ok(recovered.slots.some((s) => s.available));
  assert.ok(recovered.slots.some((s) => !s.available));

  const dates = getAvailableDates("london");
  assert.ok(dates.length > 0);
  assert.ok(CLINICS.find((c) => c.id === "riyadh" && !c.available));
});

test("patient form validation and autocomplete", () => {
  assert.match(patient, /autoComplete="given-name"/);
  assert.match(patient, /autoComplete="family-name"/);
  assert.match(patient, /autoComplete="email"/);
  assert.match(patient, /autoComplete="tel"/);
  assert.match(patient, /booking-error-summary/);
  assert.match(patient, /aria-invalid/);
  assert.match(patient, /aria-describedby/);
  assert.match(client, /validateDetails/);
  assert.equal(en.booking.validation.firstName, "Enter your first name");
  assert.equal(da.booking.validation.firstName, "Angiv dit fornavn");
});

test("submit resilience: double-submit lock and mock failure hooks", async () => {
  assert.match(client, /submittingLock/);
  assert.match(client, /setSubmitting\(true\)/);
  assert.match(client, /stale_slot/);
  assert.match(client, /mapSubmitError/);
  assert.match(summary, /aria-busy/);
  assert.match(success, /notConfirmed/);
  assert.match(success, /clinicWillContact/);

  const base = {
    practitioner: "female" as const,
    clinic: CLINICS[0],
    date: nextWeekday(3),
    time: "10:30",
    patient: {
      firstName: "Test",
      surname: "User",
      email: "ok@example.com",
      telephone: "+44000000000",
      consentGiven: true,
    },
  };

  const ok = await submitConsultationRequest(base, mockEnv);
  assert.equal(ok.outcome, "mock_confirmation");
  if (ok.outcome === "mock_confirmation") {
    assert.match(ok.referenceId, /^TEST-SR-/);
  }

  const stale = await submitConsultationRequest(
    {
      ...base,
      patient: { ...base.patient, email: "user+stale@example.com" },
    },
    mockEnv,
  );
  assert.equal(stale.outcome, "error");
  if (stale.outcome === "error") assert.equal(stale.error, "stale_slot");

  const fail = await submitConsultationRequest(
    {
      ...base,
      patient: { ...base.patient, email: "user+fail@example.com" },
    },
    mockEnv,
  );
  assert.equal(fail.outcome, "error");
  if (fail.outcome === "error") assert.equal(fail.error, "network");
});

test("EN/DA booking catalogue parity for phase chrome", () => {
  const keys = [
    "nav.back",
    "nav.continue",
    "availability.empty",
    "availability.retry",
    "errors.staleSlot",
    "errors.network",
    "success.notConfirmed",
    "review.title",
  ];
  for (const path of keys) {
    const [a, b] = path.split(".");
    assert.equal(typeof en.booking[a][b], "string", `en ${path}`);
    assert.equal(typeof da.booking[a][b], "string", `da ${path}`);
  }
  assert.equal(en.booking.progress.steps.schedule, "Date and time");
  assert.equal(da.booking.progress.steps.schedule, "Dato og tid");
});

test("step id type covers journey without URL health data", () => {
  const steps: BookingStepId[] = [...BOOKING_STEPS];
  assert.equal(steps.length, 5);
  assert.doesNotMatch(client, /medicalConditions.*search|reason=.*encodeURIComponent/);
  assert.match(client, /clearBookingDraft/);
});

console.log("booking-journey.smoke.ts: ok");
