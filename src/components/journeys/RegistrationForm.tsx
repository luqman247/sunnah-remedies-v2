"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SolidAction } from "@/components/ui/Links";
import { journeyCatalogue } from "@/lib/content/journeys";

interface RegistrationFormProps {
  journeyName?: string;
}

export function RegistrationForm({ journeyName }: RegistrationFormProps) {
  const t = useTranslations("journeys.registrationForm");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const programmeLabel = journeyName ?? t("yourSelectedJourney");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    if (!data.get("name")) next.name = t("errors.name");
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = t("errors.email");
    }
    if (!journeyName && !data.get("programme")) {
      next.programme = t("errors.programme");
    }
    if (!data.get("experience")) {
      next.experience = t("errors.experience");
    }
    if (!data.get("acknowledge")) {
      next.acknowledge = t("errors.acknowledge");
    }

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="type-body-l" role="status">
        {t("successMessage")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack enrolment-form">
      <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
        <label htmlFor="reg-name">{t("labelName")}</label>
        <input id="reg-name" name="name" type="text" autoComplete="name" />
        {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
      </div>

      <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
        <label htmlFor="reg-email">{t("labelEmail")}</label>
        <input id="reg-email" name="email" type="email" autoComplete="email" />
        {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
      </div>

      {!journeyName && (
        <div className={`form-field ${errors.programme ? "form-field--error" : ""}`}>
          <label htmlFor="reg-programme">{t("labelProgramme")}</label>
          <select id="reg-programme" name="programme" defaultValue="">
            <option value="" disabled>
              {t("selectJourney")}
            </option>
            <option value="undecided">{t("undecided")}</option>
            {journeyCatalogue.map((j) => (
              <option key={j.slug} value={j.slug}>
                {j.name}
              </option>
            ))}
          </select>
          {errors.programme && (
            <span className="form-error" role="alert">{errors.programme}</span>
          )}
        </div>
      )}

      {journeyName && <input type="hidden" name="programme" value={journeyName} />}

      <div className={`form-field ${errors.experience ? "form-field--error" : ""}`}>
        <label htmlFor="reg-experience">
          {t("labelExperience")}
        </label>
        <textarea id="reg-experience" name="experience" rows={6} />
        {errors.experience && (
          <span className="form-error" role="alert">{errors.experience}</span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="reg-health">{t("labelHealth")}</label>
        <textarea id="reg-health" name="health" rows={3} />
      </div>

      <div className={`form-field ${errors.acknowledge ? "form-field--error" : ""}`}>
        <label className="enrolment-form__checkbox">
          <input id="reg-acknowledge" name="acknowledge" type="checkbox" value="yes" />
          <span className="type-body">
            {t("acknowledgeText", { programme: programmeLabel })}
          </span>
        </label>
        {errors.acknowledge && (
          <span className="form-error" role="alert">{errors.acknowledge}</span>
        )}
      </div>

      <p className="type-small enrolment-form__note">
        {t("note")}
      </p>

      <SolidAction type="submit">{t("submit")}</SolidAction>
    </form>
  );
}
