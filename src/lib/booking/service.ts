import type {
  Clinic,
  TimeSlot,
  BookingState,
  BookingSubmitResult,
} from "./types";
import { isMockBookingFlowEnabled } from "./mock-gate";

export { isMockBookingFlowEnabled } from "./mock-gate";

export const CLINICS: Clinic[] = [
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    availability: "Available this week",
    available: true,
  },
  {
    id: "aarhus",
    name: "Aarhus",
    country: "Denmark",
    countryCode: "DK",
    flag: "🇩🇰",
    availability: "Available next week",
    available: true,
  },
  {
    id: "riyadh",
    name: "Riyadh",
    country: "Saudi Arabia",
    countryCode: "SA",
    flag: "🇸🇦",
    availability: "Coming soon",
    available: false,
  },
];

/** Illustrative dates for the request journey — preferences, not reserved slots. */
export function getAvailableDates(clinicId: string): Date[] {
  if (!CLINICS.find((c) => c.id === clinicId)?.available) return [];

  const dates: Date[] = [];
  const today = new Date();

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      dates.push(date);
    }
  }

  return dates;
}

/**
 * Illustrative slots for the request journey.
 * Mondays return no open times so the UI can show a truthful empty state.
 * Some times are marked unavailable on other days.
 */
export function getAvailableTimeSlots(
  clinicId: string,
  date: Date,
): TimeSlot[] {
  if (!CLINICS.find((c) => c.id === clinicId)?.available) return [];

  if (date.getDay() === 1) {
    return [];
  }

  return [
    { time: "09:00", available: true },
    { time: "09:45", available: false },
    { time: "10:30", available: true },
    { time: "11:15", available: true },
    { time: "12:00", available: false },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:00", available: true },
  ];
}

/** First fetch on a Tuesday fails once so retry can be verified safely. */
const availabilityAttempts = new Map<string, number>();

export async function fetchAvailability(
  clinicId: string,
  date: Date,
): Promise<{ status: "ready" | "empty" | "error"; slots: TimeSlot[] }> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const dayKey = `${clinicId}:${date.toISOString().slice(0, 10)}`;
  if (date.getDay() === 2) {
    const attempt = (availabilityAttempts.get(dayKey) ?? 0) + 1;
    availabilityAttempts.set(dayKey, attempt);
    if (attempt === 1) {
      throw new Error("mock_availability_error");
    }
  }

  const slots = getAvailableTimeSlots(clinicId, date);
  return {
    status: slots.length === 0 ? "empty" : "ready",
    slots,
  };
}

/** Test helper — resets Tuesday mock error counter. */
export function resetAvailabilityAttempts(): void {
  availabilityAttempts.clear();
}

export function getSessionPrice(clinicId: string): string {
  switch (clinicId) {
    case "london":
      return "£60";
    case "aarhus":
      return "450 DKK";
    case "riyadh":
      return "250 SAR";
    default:
      return "£60";
  }
}

export function getSessionDuration(): string {
  return "45 minutes";
}

/**
 * Submit a consultation request.
 *
 * Production (default): no appointment, payment, email, or fabricated reference.
 * Returns `contact_fallback` — the UI must direct the visitor to correspondence.
 *
 * Local mock only when `ENABLE_MOCK_BOOKING_FLOW=true` and NODE_ENV ≠ production.
 * Mock references are prefixed `TEST-SR-` and must be labelled as test data in the UI.
 *
 * Mock failure hooks (mock mode only):
 * - `*+stale@*` → stale_slot
 * - `*+fail@*` → network
 */
export async function submitConsultationRequest(
  booking: BookingState,
  env: NodeJS.ProcessEnv = process.env,
): Promise<BookingSubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!booking.practitioner || !booking.clinic || !booking.date || !booking.time) {
    return { outcome: "error", error: "validation" };
  }

  if (!isMockBookingFlowEnabled(env)) {
    return { outcome: "contact_fallback" };
  }

  const email = booking.patient.email.toLowerCase();
  if (email.includes("+stale@")) {
    return { outcome: "error", error: "stale_slot" };
  }
  if (email.includes("+fail@")) {
    return { outcome: "error", error: "network" };
  }

  return {
    outcome: "mock_confirmation",
    referenceId: `TEST-SR-${Date.now().toString(36).toUpperCase()}`,
  };
}

/** @deprecated Use submitConsultationRequest */
export const submitBooking = submitConsultationRequest;

export function clinicById(id: string): Clinic | undefined {
  return CLINICS.find((c) => c.id === id);
}
