/**
 * Consultation production-safety — mock gate and truthful outcomes.
 * node --import tsx --test tests/ux/booking-production-safety.smoke.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { isMockBookingFlowEnabled } from "../../src/lib/booking/mock-gate";
import {
  CLINICS,
  submitConsultationRequest,
} from "../../src/lib/booking/service";

const en = JSON.parse(readFileSync(resolve("src/messages/en.json"), "utf8"));
const da = JSON.parse(readFileSync(resolve("src/messages/da.json"), "utf8"));
const client = readFileSync(
  resolve("src/app/[locale]/consultations/ConsultationsClient.tsx"),
  "utf8",
);
const page = readFileSync(
  resolve("src/app/[locale]/consultations/page.tsx"),
  "utf8",
);
const actions = readFileSync(
  resolve("src/app/[locale]/consultations/actions.ts"),
  "utf8",
);
const success = readFileSync(
  resolve("src/components/booking/BookingSuccess.tsx"),
  "utf8",
);
const fallback = readFileSync(
  resolve("src/components/booking/BookingContactFallback.tsx"),
  "utf8",
);

function nextWeekday(day: number): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  for (let i = 1; i <= 14; i++) {
    const candidate = new Date(d);
    candidate.setDate(d.getDate() + i);
    if (candidate.getDay() === day) return candidate;
  }
  throw new Error(`No weekday ${day}`);
}

const baseBooking = {
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

test("mock booking flow is disabled by default and blocked in production", () => {
  assert.equal(
    isMockBookingFlowEnabled({ NODE_ENV: "development" }),
    false,
  );
  assert.equal(
    isMockBookingFlowEnabled({
      NODE_ENV: "development",
      ENABLE_MOCK_BOOKING_FLOW: "false",
    }),
    false,
  );
  assert.equal(
    isMockBookingFlowEnabled({
      NODE_ENV: "production",
      ENABLE_MOCK_BOOKING_FLOW: "true",
    }),
    false,
  );
  assert.equal(
    isMockBookingFlowEnabled({
      NODE_ENV: "development",
      ENABLE_MOCK_BOOKING_FLOW: "true",
    }),
    true,
  );
  assert.equal(
    isMockBookingFlowEnabled({
      NODE_ENV: "test",
      ENABLE_MOCK_BOOKING_FLOW: "true",
    }),
    true,
  );
});

test("production submit returns contact_fallback — never a live SR reference", async () => {
  const result = await submitConsultationRequest(baseBooking, {
    NODE_ENV: "production",
    ENABLE_MOCK_BOOKING_FLOW: "true",
  });
  assert.equal(result.outcome, "contact_fallback");

  const defaulted = await submitConsultationRequest(baseBooking, {
    NODE_ENV: "development",
  });
  assert.equal(defaulted.outcome, "contact_fallback");
});

test("local mock submit yields TEST-SR reference only when flag enabled", async () => {
  const result = await submitConsultationRequest(baseBooking, {
    NODE_ENV: "development",
    ENABLE_MOCK_BOOKING_FLOW: "true",
  });
  assert.equal(result.outcome, "mock_confirmation");
  if (result.outcome === "mock_confirmation") {
    assert.match(result.referenceId, /^TEST-SR-/);
    assert.doesNotMatch(result.referenceId, /^SR-[^-]/);
  }

  const stale = await submitConsultationRequest(
    {
      ...baseBooking,
      patient: { ...baseBooking.patient, email: "a+stale@example.com" },
    },
    { NODE_ENV: "test", ENABLE_MOCK_BOOKING_FLOW: "true" },
  );
  assert.equal(stale.outcome, "error");
  if (stale.outcome === "error") assert.equal(stale.error, "stale_slot");
});

test("production UI wiring uses server action and contact fallback", () => {
  assert.match(page, /isMockBookingFlowEnabled/);
  assert.match(page, /mockFlowEnabled/);
  assert.match(actions, /"use server"/);
  assert.match(actions, /submitConsultationRequest/);
  assert.match(client, /submitConsultationAction/);
  assert.match(client, /BookingContactFallback/);
  assert.match(client, /contact_fallback/);
  assert.match(fallback, /\/correspondence/);
  assert.match(success, /isMockConfirmation/);
  assert.match(success, /testBanner/);
  assert.doesNotMatch(client, /referenceId: `SR-/);
});

test("EN/DA production-safe wording is present", () => {
  assert.equal(en.booking.summary.submit, "Submit consultation request");
  assert.equal(da.booking.summary.submit, "Indsend konsultationsanmodning");
  assert.equal(en.booking.success.title, "Your request has been received");
  assert.equal(da.booking.success.title, "Din anmodning er modtaget");
  assert.equal(
    en.booking.success.notConfirmed,
    "This is not yet a confirmed appointment",
  );
  assert.equal(
    da.booking.success.notConfirmed,
    "Dette er endnu ikke en bekræftet aftale",
  );
  assert.equal(
    en.booking.success.clinicWillContact,
    "The clinic will contact you to confirm availability",
  );
  assert.equal(
    da.booking.success.clinicWillContact,
    "Klinikken kontakter dig for at bekræfte ledighed",
  );
  assert.match(en.booking.summary.date, /Preferred/i);
  assert.match(da.booking.summary.date, /Foretrukken/i);
  assert.match(en.booking.contactFallback.message, /No booking reference/i);
  assert.match(da.booking.contactFallback.message, /bookingreference/i);
  assert.doesNotMatch(en.booking.summary.submit, /Book my appointment/i);
  assert.doesNotMatch(en.booking.summary.paymentTimingValue, /Complete payment/i);
});

console.log("booking-production-safety.smoke.ts: ok");
