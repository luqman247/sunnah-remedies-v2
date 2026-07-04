"use client";

import type { PatientDetails } from "@/lib/booking/types";

interface PatientFormProps {
  value: PatientDetails;
  onChange: (details: PatientDetails) => void;
  errors: Record<string, string>;
}

export function PatientForm({ value, onChange, errors }: PatientFormProps) {
  function update(field: keyof PatientDetails, val: string | boolean) {
    onChange({ ...value, [field]: val });
  }

  return (
    <div className="booking-step">
      <p className="booking-step__label">Step 5</p>
      <h2 className="booking-step__title">Patient Information</h2>

      <div className="patient-form">
        <div className="patient-form__row">
          <div className={`form-field ${errors.firstName ? "form-field--error" : ""}`}>
            <label htmlFor="booking-first-name">First Name</label>
            <input
              id="booking-first-name"
              type="text"
              autoComplete="given-name"
              value={value.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
            {errors.firstName && <span className="form-error" role="alert">{errors.firstName}</span>}
          </div>

          <div className={`form-field ${errors.surname ? "form-field--error" : ""}`}>
            <label htmlFor="booking-surname">Surname</label>
            <input
              id="booking-surname"
              type="text"
              autoComplete="family-name"
              value={value.surname}
              onChange={(e) => update("surname", e.target.value)}
            />
            {errors.surname && <span className="form-error" role="alert">{errors.surname}</span>}
          </div>
        </div>

        <div className="patient-form__row">
          <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
            <label htmlFor="booking-email">Email</label>
            <input
              id="booking-email"
              type="email"
              autoComplete="email"
              value={value.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
          </div>

          <div className={`form-field ${errors.telephone ? "form-field--error" : ""}`}>
            <label htmlFor="booking-telephone">Telephone</label>
            <input
              id="booking-telephone"
              type="tel"
              autoComplete="tel"
              value={value.telephone}
              onChange={(e) => update("telephone", e.target.value)}
            />
            {errors.telephone && <span className="form-error" role="alert">{errors.telephone}</span>}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="booking-reason">Reason for appointment <span style={{ color: "var(--muted-light)" }}>(optional)</span></label>
          <input
            id="booking-reason"
            type="text"
            value={value.reason || ""}
            onChange={(e) => update("reason", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="booking-medical">Any medical conditions? <span style={{ color: "var(--muted-light)" }}>(optional)</span></label>
          <textarea
            id="booking-medical"
            rows={3}
            value={value.medicalConditions || ""}
            onChange={(e) => update("medicalConditions", e.target.value)}
          />
        </div>

        <label className="patient-form__consent">
          <input
            type="checkbox"
            checked={value.consentGiven}
            onChange={(e) => update("consentGiven", e.target.checked)}
            aria-describedby="consent-description"
          />
          <span className="patient-form__consent-text" id="consent-description">
            I understand Hijama may not be suitable for everyone and agree to the
            consultation process
          </span>
        </label>
        {errors.consent && <span className="form-error" role="alert">{errors.consent}</span>}
      </div>
    </div>
  );
}
