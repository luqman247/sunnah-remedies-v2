"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookingHero } from "@/components/booking/BookingHero";
import { PractitionerSelector } from "@/components/booking/PractitionerSelector";
import { ClinicSelector } from "@/components/booking/ClinicSelector";
import { DateSelector } from "@/components/booking/DateSelector";
import { TimeSelector } from "@/components/booking/TimeSelector";
import { PatientForm } from "@/components/booking/PatientForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingSuccess } from "@/components/booking/BookingSuccess";
import {
  CLINICS,
  getAvailableDates,
  getAvailableTimeSlots,
  getSessionPrice,
  getSessionDuration,
  submitBooking,
} from "@/lib/booking/service";
import type {
  PractitionerGender,
  Clinic,
  PatientDetails,
  BookingState,
} from "@/lib/booking/types";

export interface ConsultationsPageData {
  consultationTypes?: { name: string; description?: string; duration?: string; fee?: string }[];
  practitioners?: { name: string; title?: string; gender?: string }[];
}

const INITIAL_PATIENT: PatientDetails = {
  firstName: "",
  surname: "",
  email: "",
  telephone: "",
  reason: "",
  medicalConditions: "",
  consentGiven: false,
};

export default function ConsultationsClient({ cmsData }: { cmsData: ConsultationsPageData | null }) {
  const [practitioner, setPractitioner] = useState<PractitionerGender | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientDetails>(INITIAL_PATIENT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [referenceId, setReferenceId] = useState<string>();

  const dates = useMemo(() => {
    if (!clinic) return [];
    return getAvailableDates(clinic.id);
  }, [clinic]);

  const timeSlots = useMemo(() => {
    if (!clinic || !date) return [];
    return getAvailableTimeSlots(clinic.id, date);
  }, [clinic, date]);

  const price = clinic ? getSessionPrice(clinic.id) : "";

  const canSubmit =
    practitioner !== null &&
    clinic !== null &&
    date !== null &&
    time !== null &&
    patient.firstName.trim() !== "" &&
    patient.surname.trim() !== "" &&
    patient.email.trim() !== "" &&
    patient.telephone.trim() !== "" &&
    patient.consentGiven;

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!patient.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!patient.surname.trim()) newErrors.surname = "Surname is required.";
    if (!patient.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
      newErrors.email = "A valid email address is required.";
    }
    if (!patient.telephone.trim()) newErrors.telephone = "Telephone is required.";
    if (!patient.consentGiven) newErrors.consent = "You must agree to proceed.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    if (!canSubmit) return;

    setSubmitting(true);

    const booking: BookingState = {
      practitioner,
      clinic,
      date,
      time,
      patient,
    };

    const result = await submitBooking(booking);

    setSubmitting(false);

    if (result.success) {
      setReferenceId(result.referenceId);
      setSuccess(true);
    }
  }

  function handleBookAnother() {
    setPractitioner(null);
    setClinic(null);
    setDate(null);
    setTime(null);
    setPatient(INITIAL_PATIENT);
    setErrors({});
    setSuccess(false);
    setReferenceId(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleClinicChange(newClinic: Clinic) {
    setClinic(newClinic);
    setDate(null);
    setTime(null);
  }

  function handleDateChange(newDate: Date) {
    setDate(newDate);
    setTime(null);
  }

  if (success) {
    return <BookingSuccess referenceId={referenceId} onBookAnother={handleBookAnother} />;
  }

  return (
    <>
      <BookingHero />

      <div className="booking-layout">
        <motion.div
          className="booking-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <PractitionerSelector value={practitioner} onChange={setPractitioner} />

          <AnimatePresence>
            {practitioner && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ClinicSelector
                  clinics={CLINICS}
                  value={clinic}
                  onChange={handleClinicChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {clinic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <DateSelector dates={dates} value={date} onChange={handleDateChange} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {date && timeSlots.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <TimeSelector slots={timeSlots} value={time} onChange={setTime} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {time && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <PatientForm value={patient} onChange={setPatient} errors={errors} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <BookingSummary
            data={{
              practitioner,
              clinicName: clinic?.name || null,
              date,
              time,
              duration: getSessionDuration(),
              price,
            }}
            canSubmit={canSubmit}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </div>

      {canSubmit && (
        <div className="booking-mobile-cta">
          <button
            type="button"
            className={`booking-cta ${submitting ? "booking-cta--loading" : ""}`}
            disabled={submitting}
            onClick={handleSubmit}
          >
            Book My Appointment
          </button>
        </div>
      )}
    </>
  );
}
