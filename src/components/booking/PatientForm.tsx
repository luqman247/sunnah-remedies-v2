"use client";

import { useTranslations } from "next-intl";
import type { PatientDetails } from "@/lib/booking/types";

interface PatientFormProps {
  value: PatientDetails;
  onChange: (details: PatientDetails) => void;
  errors: Record<string, string>;
  errorSummaryId?: string;
}

export function PatientForm({
  value,
  onChange,
  errors,
  errorSummaryId = "booking-error-summary",
}: PatientFormProps) {
  const t = useTranslations("booking.patientForm");
  const errorEntries = Object.entries(errors);

  function update(field: keyof PatientDetails, val: string | boolean) {
    onChange({ ...value, [field]: val });
  }

  return (
    <div className="booking-step">
      <p className="booking-step__label">{t("stepLabel")}</p>
      <h2 className="booking-step__title" id="patient-heading">
        {t("title")}
      </h2>

      {errorEntries.length > 0 ? (
        <div
          id={errorSummaryId}
          className="booking-error-summary"
          role="alert"
          tabIndex={-1}
        >
          <p className="booking-error-summary__title">{t("errorSummary")}</p>
          <ul>
            {errorEntries.map(([key, message]) => (
              <li key={key}>
                <a href={`#booking-${key === "consent" ? "consent" : key}`}>{message}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="patient-form" aria-labelledby="patient-heading">
        <div className="patient-form__row">
          <div className={`form-field ${errors.firstName ? "form-field--error" : ""}`}>
            <label htmlFor="booking-firstName">
              {t("firstName")} <span className="form-field__req">{t("required")}</span>
            </label>
            <input
              id="booking-firstName"
              type="text"
              autoComplete="given-name"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.firstName)}
              aria-describedby={errors.firstName ? "err-firstName" : undefined}
              value={value.firstName}
              onChange={(e) => update("firstName", e.target.value)}
            />
            {errors.firstName ? (
              <span id="err-firstName" className="form-error" role="alert">
                {errors.firstName}
              </span>
            ) : null}
          </div>

          <div className={`form-field ${errors.surname ? "form-field--error" : ""}`}>
            <label htmlFor="booking-surname">
              {t("surname")} <span className="form-field__req">{t("required")}</span>
            </label>
            <input
              id="booking-surname"
              type="text"
              autoComplete="family-name"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.surname)}
              aria-describedby={errors.surname ? "err-surname" : undefined}
              value={value.surname}
              onChange={(e) => update("surname", e.target.value)}
            />
            {errors.surname ? (
              <span id="err-surname" className="form-error" role="alert">
                {errors.surname}
              </span>
            ) : null}
          </div>
        </div>

        <div className="patient-form__row">
          <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
            <label htmlFor="booking-email">
              {t("email")} <span className="form-field__req">{t("required")}</span>
            </label>
            <input
              id="booking-email"
              type="email"
              autoComplete="email"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "err-email" : undefined}
              value={value.email}
              onChange={(e) => update("email", e.target.value)}
            />
            {errors.email ? (
              <span id="err-email" className="form-error" role="alert">
                {errors.email}
              </span>
            ) : null}
          </div>

          <div className={`form-field ${errors.telephone ? "form-field--error" : ""}`}>
            <label htmlFor="booking-telephone">
              {t("telephone")} <span className="form-field__req">{t("required")}</span>
            </label>
            <input
              id="booking-telephone"
              type="tel"
              autoComplete="tel"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.telephone)}
              aria-describedby={errors.telephone ? "err-telephone" : undefined}
              value={value.telephone}
              onChange={(e) => update("telephone", e.target.value)}
            />
            {errors.telephone ? (
              <span id="err-telephone" className="form-error" role="alert">
                {errors.telephone}
              </span>
            ) : null}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="booking-reason">
            {t("reason")}{" "}
            <span className="form-field__opt">({t("optional")})</span>
          </label>
          <input
            id="booking-reason"
            type="text"
            value={value.reason || ""}
            onChange={(e) => update("reason", e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="booking-medical">
            {t("medicalConditions")}{" "}
            <span className="form-field__opt">({t("optional")})</span>
          </label>
          <textarea
            id="booking-medical"
            rows={3}
            value={value.medicalConditions || ""}
            onChange={(e) => update("medicalConditions", e.target.value)}
          />
          <p className="form-field__hint">{t("medicalHint")}</p>
        </div>

        <div
          className={`patient-form__consent-wrap ${errors.consent ? "form-field--error" : ""}`}
        >
          <label className="patient-form__consent" htmlFor="booking-consent">
            <input
              id="booking-consent"
              type="checkbox"
              checked={value.consentGiven}
              onChange={(e) => update("consentGiven", e.target.checked)}
              aria-required="true"
              aria-invalid={Boolean(errors.consent)}
              aria-describedby="consent-description"
            />
            <span className="patient-form__consent-text" id="consent-description">
              {t("consentText")}{" "}
              <span className="form-field__req">{t("required")}</span>
            </span>
          </label>
          {errors.consent ? (
            <span id="err-consent" className="form-error" role="alert">
              {errors.consent}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
