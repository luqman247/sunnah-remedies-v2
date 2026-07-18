/**
 * sessionStorage draft for consultation booking.
 * Never writes medical notes or other patient fields to the URL.
 * Cleared on successful confirmation.
 */
import type {
  BookingStepId,
  PatientDetails,
  PractitionerGender,
} from "./types";
import { CLINICS, clinicById } from "./service";

const STORAGE_KEY = "sr_booking_draft_v1";

export interface BookingDraft {
  step: BookingStepId;
  practitioner: PractitionerGender | null;
  clinicId: string | null;
  dateIso: string | null;
  time: string | null;
  patient: PatientDetails;
}

export function readBookingDraft(): BookingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BookingDraft;
    if (parsed.clinicId && !clinicById(parsed.clinicId)) return null;
    if (parsed.clinicId && !CLINICS.some((c) => c.id === parsed.clinicId && c.available)) {
      parsed.clinicId = null;
      parsed.dateIso = null;
      parsed.time = null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeBookingDraft(draft: BookingDraft): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Quota or private mode — ignore; flow remains usable in memory.
  }
}

export function clearBookingDraft(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
