export type PractitionerGender = "male" | "female";

export type BookingStepId =
  | "practitioner"
  | "clinic"
  | "schedule"
  | "details"
  | "review";

export const BOOKING_STEPS: BookingStepId[] = [
  "practitioner",
  "clinic",
  "schedule",
  "details",
  "review",
];

export interface Clinic {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  availability: string;
  available: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface PatientDetails {
  firstName: string;
  surname: string;
  email: string;
  telephone: string;
  reason?: string;
  medicalConditions?: string;
  consentGiven: boolean;
}

export interface BookingState {
  practitioner: PractitionerGender | null;
  clinic: Clinic | null;
  date: Date | null;
  time: string | null;
  patient: PatientDetails;
}

export interface BookingSummaryData {
  practitioner: PractitionerGender | null;
  clinicName: string | null;
  clinicCountry: string | null;
  date: Date | null;
  time: string | null;
  duration: string;
  price: string;
  paymentTiming: string;
  cancellation: string;
}

export type BookingSubmitError =
  | "network"
  | "stale_slot"
  | "server"
  | "validation";

/** Production-safe outcomes — never invent a live booking reference. */
export type BookingSubmitResult =
  | { outcome: "contact_fallback" }
  | { outcome: "mock_confirmation"; referenceId: string }
  | { outcome: "error"; error: BookingSubmitError };

export type AvailabilityStatus =
  | "idle"
  | "loading"
  | "ready"
  | "empty"
  | "error";
