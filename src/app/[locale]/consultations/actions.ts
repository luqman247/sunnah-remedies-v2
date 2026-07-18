"use server";

import {
  submitConsultationRequest,
  clinicById,
} from "@/lib/booking/service";
import type {
  BookingState,
  BookingSubmitResult,
  PatientDetails,
  PractitionerGender,
} from "@/lib/booking/types";

export interface ConsultationRequestPayload {
  practitioner: PractitionerGender | null;
  clinicId: string | null;
  dateIso: string | null;
  time: string | null;
  patient: PatientDetails;
}

/**
 * Server-side submit so ENABLE_MOCK_BOOKING_FLOW is evaluated on the server
 * and never invents a live booking reference in production.
 */
export async function submitConsultationAction(
  payload: ConsultationRequestPayload,
): Promise<BookingSubmitResult> {
  const clinic = payload.clinicId ? clinicById(payload.clinicId) ?? null : null;
  const date = payload.dateIso ? new Date(payload.dateIso) : null;

  const booking: BookingState = {
    practitioner: payload.practitioner,
    clinic,
    date,
    time: payload.time,
    patient: payload.patient,
  };

  return submitConsultationRequest(booking);
}
