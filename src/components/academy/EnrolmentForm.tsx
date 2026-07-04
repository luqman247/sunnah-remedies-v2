"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { SolidAction } from "@/components/ui/Links";

interface EnrolmentFormProps {
  programmeName: string;
}

export function EnrolmentForm({ programmeName }: EnrolmentFormProps) {
  const t = useTranslations("academy.enrolmentForm");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};

    if (!data.get("name")) next.name = t("errors.name");
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = t("errors.email");
    }
    if (!data.get("qualification")) {
      next.qualification = t("errors.qualification");
    }
    if (!data.get("statement")) {
      next.statement = t("errors.statement");
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
        <label htmlFor="enrol-name">{t("labelName")}</label>
        <input id="enrol-name" name="name" type="text" autoComplete="name" />
        {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
      </div>

      <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
        <label htmlFor="enrol-email">{t("labelEmail")}</label>
        <input id="enrol-email" name="email" type="email" autoComplete="email" />
        {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
      </div>

      <div className={`form-field ${errors.qualification ? "form-field--error" : ""}`}>
        <label htmlFor="enrol-qualification">{t("labelQualification")}</label>
        <input id="enrol-qualification" name="qualification" type="text" />
        {errors.qualification && <span className="form-error" role="alert">{errors.qualification}</span>}
      </div>

      <div className={`form-field ${errors.statement ? "form-field--error" : ""}`}>
        <label htmlFor="enrol-statement">
          {t("labelStatement")}
        </label>
        <textarea id="enrol-statement" name="statement" rows={8} />
        {errors.statement && <span className="form-error" role="alert">{errors.statement}</span>}
      </div>

      <div className={`form-field ${errors.acknowledge ? "form-field--error" : ""}`}>
        <label className="enrolment-form__checkbox">
          <input id="enrol-acknowledge" name="acknowledge" type="checkbox" value="yes" />
          <span className="type-body">
            {t("acknowledgeText", { programme: programmeName })}
          </span>
        </label>
        {errors.acknowledge && <span className="form-error" role="alert">{errors.acknowledge}</span>}
      </div>

      <p className="type-small enrolment-form__note">
        {t("note")}
      </p>

      <SolidAction type="submit">{t("submit")}</SolidAction>
    </form>
  );
}
