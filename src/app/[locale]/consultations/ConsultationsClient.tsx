"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { BookingHero } from "@/components/booking/BookingHero";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingStepNav } from "@/components/booking/BookingStepNav";
import { PractitionerSelector } from "@/components/booking/PractitionerSelector";
import { ClinicSelector } from "@/components/booking/ClinicSelector";
import { ScheduleStep } from "@/components/booking/ScheduleStep";
import { PatientForm } from "@/components/booking/PatientForm";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { BookingSuccess } from "@/components/booking/BookingSuccess";
import { BookingContactFallback } from "@/components/booking/BookingContactFallback";
import {
  CLINICS,
  getAvailableDates,
  getSessionPrice,
  fetchAvailability,
  clinicById,
} from "@/lib/booking/service";
import { submitConsultationAction } from "./actions";
import {
  clearBookingDraft,
  readBookingDraft,
  writeBookingDraft,
} from "@/lib/booking/draft-storage";
import type {
  AvailabilityStatus,
  BookingStepId,
  BookingSubmitError,
  Clinic,
  PatientDetails,
  PractitionerGender,
  TimeSlot,
} from "@/lib/booking/types";
import { BOOKING_STEPS } from "@/lib/booking/types";

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

function stepIndex(step: BookingStepId): number {
  return BOOKING_STEPS.indexOf(step);
}

export default function ConsultationsClient({
  cmsData,
  mockFlowEnabled = false,
}: {
  cmsData: ConsultationsPageData | null;
  /** Server-evaluated: true only when local mock flag is on and not production. */
  mockFlowEnabled?: boolean;
}) {
  void cmsData;
  const t = useTranslations("booking");
  const tValidation = useTranslations("booking.validation");
  const tErrors = useTranslations("booking.errors");
  const panelRef = useRef<HTMLDivElement>(null);
  const submittingLock = useRef(false);
  const slotsRequestId = useRef(0);

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<BookingStepId>("practitioner");
  const [practitioner, setPractitioner] = useState<PractitionerGender | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientDetails>(INITIAL_PATIENT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [availability, setAvailability] = useState<AvailabilityStatus>("idle");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [contactFallback, setContactFallback] = useState(false);
  const [referenceId, setReferenceId] = useState<string>();
  const [isMockConfirmation, setIsMockConfirmation] = useState(false);

  // Restore draft once on mount (client only). sessionStorage is an external store.
  useEffect(() => {
    const draft = readBookingDraft();
    /* eslint-disable react-hooks/set-state-in-effect -- one-shot sessionStorage hydrate */
    if (draft) {
      setStep(draft.step);
      setPractitioner(draft.practitioner);
      if (draft.clinicId) setClinic(clinicById(draft.clinicId) ?? null);
      if (draft.dateIso) setDate(new Date(draft.dateIso));
      setTime(draft.time);
      setPatient(draft.patient);
    }
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Persist draft (never to URL). Optional health notes stay in memory only.
  useEffect(() => {
    if (!hydrated || success || contactFallback) return;
    writeBookingDraft({
      step,
      practitioner,
      clinicId: clinic?.id ?? null,
      dateIso: date?.toISOString() ?? null,
      time,
      patient: {
        ...patient,
        reason: "",
        medicalConditions: "",
      },
    });
  }, [hydrated, success, contactFallback, step, practitioner, clinic, date, time, patient]);

  const dates = useMemo(() => {
    if (!clinic) return [];
    return getAvailableDates(clinic.id);
  }, [clinic]);

  async function loadSlots(clinicId: string, selected: Date) {
    const requestId = ++slotsRequestId.current;
    setAvailability("loading");
    setSlots([]);
    try {
      const result = await fetchAvailability(clinicId, selected);
      if (requestId !== slotsRequestId.current) return;
      setSlots(result.slots);
      setAvailability(result.status);
    } catch {
      if (requestId !== slotsRequestId.current) return;
      setSlots([]);
      setAvailability("error");
    }
  }

  // Load slots when schedule step has a clinic+date. Updates run after async boundaries.
  useEffect(() => {
    if (!clinic || !date || step !== "schedule") return;
    let cancelled = false;
    const clinicId = clinic.id;
    const selected = date;
    const requestId = ++slotsRequestId.current;

    void (async () => {
      await Promise.resolve();
      if (cancelled || requestId !== slotsRequestId.current) return;
      setAvailability("loading");
      setSlots([]);
      try {
        const result = await fetchAvailability(clinicId, selected);
        if (cancelled || requestId !== slotsRequestId.current) return;
        setSlots(result.slots);
        setAvailability(result.status === "empty" ? "empty" : "ready");
      } catch {
        if (cancelled || requestId !== slotsRequestId.current) return;
        setSlots([]);
        setAvailability("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clinic, date, step]);

  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true });
  }, [step]);

  const price = clinic ? getSessionPrice(clinic.id) : "";
  const duration = t("summary.durationValue");

  const summaryData = {
    practitioner,
    clinicName: clinic?.name || null,
    clinicCountry: clinic?.country || null,
    date,
    time,
    duration,
    price,
    paymentTiming: t("summary.paymentTimingValue"),
    cancellation: t("summary.cancellationValue"),
  };

  const canContinuePractitioner = practitioner !== null;
  const canContinueClinic = clinic !== null && clinic.available;
  const canContinueSchedule = date !== null && time !== null;
  const canContinueDetails =
    patient.firstName.trim() !== "" &&
    patient.surname.trim() !== "" &&
    patient.email.trim() !== "" &&
    patient.telephone.trim() !== "" &&
    patient.consentGiven;

  const canSubmit =
    canContinuePractitioner &&
    canContinueClinic &&
    canContinueSchedule &&
    canContinueDetails;

  function goTo(next: BookingStepId) {
    setStep(next);
    setSubmitError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleBack() {
    const i = stepIndex(step);
    if (i <= 0) return;
    goTo(BOOKING_STEPS[i - 1]);
  }

  function validateDetails(): boolean {
    const newErrors: Record<string, string> = {};
    if (!patient.firstName.trim()) newErrors.firstName = tValidation("firstName");
    if (!patient.surname.trim()) newErrors.surname = tValidation("surname");
    if (!patient.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) {
      newErrors.email = tValidation("email");
    }
    if (!patient.telephone.trim()) newErrors.telephone = tValidation("telephone");
    if (!patient.consentGiven) newErrors.consent = tValidation("consent");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      requestAnimationFrame(() => {
        document.getElementById("booking-error-summary")?.focus();
      });
      return false;
    }
    return true;
  }

  function handleContinue() {
    if (step === "practitioner" && canContinuePractitioner) {
      goTo("clinic");
      return;
    }
    if (step === "clinic" && canContinueClinic) {
      goTo("schedule");
      return;
    }
    if (step === "schedule" && canContinueSchedule) {
      goTo("details");
      return;
    }
    if (step === "details") {
      if (!validateDetails()) return;
      goTo("review");
    }
  }

  function handlePractitionerChange(gender: PractitionerGender) {
    setPractitioner(gender);
  }

  function handleClinicChange(next: Clinic) {
    setClinic(next);
    setDate(null);
    setTime(null);
    setSlots([]);
    setAvailability("idle");
  }

  function handleDateChange(next: Date) {
    setDate(next);
    setTime(null);
  }

  function mapSubmitError(code: BookingSubmitError): string {
    switch (code) {
      case "stale_slot":
        return tErrors("staleSlot");
      case "network":
        return tErrors("network");
      case "validation":
        return tErrors("validation");
      default:
        return tErrors("server");
    }
  }

  async function handleSubmit() {
    if (submittingLock.current) return;
    if (!canSubmit) return;
    if (!validateDetails()) {
      goTo("details");
      return;
    }

    submittingLock.current = true;
    setSubmitting(true);
    setSubmitError(null);

    const result = await submitConsultationAction({
      practitioner,
      clinicId: clinic?.id ?? null,
      dateIso: date?.toISOString() ?? null,
      time,
      patient,
    });

    setSubmitting(false);
    submittingLock.current = false;

    if (result.outcome === "contact_fallback") {
      clearBookingDraft();
      setContactFallback(true);
      setSuccess(false);
      setReferenceId(undefined);
      setIsMockConfirmation(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (result.outcome === "mock_confirmation") {
      clearBookingDraft();
      setReferenceId(result.referenceId);
      setIsMockConfirmation(true);
      setSuccess(true);
      setContactFallback(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitError(mapSubmitError(result.error));
    if (result.error === "stale_slot") {
      setTime(null);
      if (clinic && date) void loadSlots(clinic.id, date);
      goTo("schedule");
    }
  }

  function handleBookAnother() {
    clearBookingDraft();
    setPractitioner(null);
    setClinic(null);
    setDate(null);
    setTime(null);
    setPatient(INITIAL_PATIENT);
    setErrors({});
    setSlots([]);
    setAvailability("idle");
    setSubmitError(null);
    setSuccess(false);
    setContactFallback(false);
    setReferenceId(undefined);
    setIsMockConfirmation(false);
    setStep("practitioner");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (contactFallback) {
    return (
      <BookingContactFallback
        practitioner={practitioner}
        clinicName={clinic?.name ?? null}
        clinicCountry={clinic?.country ?? null}
        date={date}
        time={time}
        onStartAgain={handleBookAnother}
      />
    );
  }

  if (success) {
    return (
      <BookingSuccess
        referenceId={referenceId}
        isMockConfirmation={isMockConfirmation}
        practitioner={practitioner}
        clinicName={clinic?.name ?? null}
        clinicCountry={clinic?.country ?? null}
        date={date}
        time={time}
        duration={duration}
        price={price}
        onBookAnother={handleBookAnother}
      />
    );
  }

  return (
    <>
      <BookingHero />

      <div className="booking-shell">
        <BookingProgress current={step} />
        <p className="booking-refresh-note">{t("refreshNote")}</p>
        <p className="booking-summary-jump">
          <a href="#booking-appointment-summary">{t("viewSummary")}</a>
        </p>

        <div className="booking-layout">
          <div
            className="booking-card"
            ref={panelRef}
            tabIndex={-1}
            aria-labelledby="booking-step-live"
          >
            <p id="booking-step-live" className="sr-only" aria-live="polite">
              {t("progress.status", {
                current: stepIndex(step) + 1,
                total: BOOKING_STEPS.length,
                name: t(`progress.steps.${step}`),
              })}
            </p>

            {step === "practitioner" ? (
              <>
                <PractitionerSelector
                  value={practitioner}
                  onChange={handlePractitionerChange}
                />
                <BookingStepNav
                  showBack={false}
                  onContinue={handleContinue}
                  continueDisabled={!canContinuePractitioner}
                />
              </>
            ) : null}

            {step === "clinic" ? (
              <>
                <ClinicSelector
                  clinics={CLINICS}
                  value={clinic}
                  onChange={handleClinicChange}
                />
                <BookingStepNav
                  onBack={handleBack}
                  onContinue={handleContinue}
                  continueDisabled={!canContinueClinic}
                />
              </>
            ) : null}

            {step === "schedule" ? (
              <>
                <ScheduleStep
                  dates={dates}
                  date={date}
                  onDateChange={handleDateChange}
                  slots={slots}
                  time={time}
                  onTimeChange={setTime}
                  availability={availability}
                  onRetry={() => {
                    if (clinic && date) void loadSlots(clinic.id, date);
                  }}
                />
                <BookingStepNav
                  onBack={handleBack}
                  onContinue={handleContinue}
                  continueDisabled={!canContinueSchedule}
                />
              </>
            ) : null}

            {step === "details" ? (
              <>
                <PatientForm
                  value={patient}
                  onChange={setPatient}
                  errors={errors}
                />
                <BookingStepNav
                  onBack={handleBack}
                  onContinue={handleContinue}
                  continueLabel={t("nav.review")}
                />
              </>
            ) : null}

            {step === "review" ? (
              <>
                <div className="booking-step">
                  <p className="booking-step__label">{t("progress.steps.review")}</p>
                  <h2 className="booking-step__title">{t("review.title")}</h2>
                  <p className="booking-step__lede">{t("review.lede")}</p>
                  {mockFlowEnabled ? (
                    <p className="booking-step__lede" role="status">
                      {t("success.testBanner")}
                    </p>
                  ) : null}
                </div>
                <BookingStepNav
                  onBack={handleBack}
                  showContinue={false}
                />
              </>
            ) : null}
          </div>

          <BookingSummary
            data={summaryData}
            canSubmit={canSubmit && step === "review"}
            submitting={submitting}
            submitError={submitError}
            onSubmit={handleSubmit}
            showSubmit={step === "review"}
          />
        </div>

        {step === "review" && canSubmit ? (
          <div className="booking-mobile-cta">
            <button
              type="button"
              className={`booking-cta ${submitting ? "booking-cta--loading" : ""}`}
              disabled={submitting}
              aria-busy={submitting}
              onClick={handleSubmit}
            >
              {submitting ? t("summary.submitting") : t("summary.submit")}
            </button>
            {submitError ? (
              <p className="booking-summary__error" role="alert">
                {submitError}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
