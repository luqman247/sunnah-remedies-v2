"use client";

import { useState } from "react";
import { SolidAction } from "@/components/ui/Links";

interface EnrolmentFormProps {
  programmeName: string;
}

export function EnrolmentForm({ programmeName }: EnrolmentFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next: Record<string, string> = {};

    if (!data.get("name")) next.name = "We'll need your name to reply.";
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "We'll need a way to reach you — an address like name@example.com.";
    }
    if (!data.get("qualification")) {
      next.qualification = "Please state your healthcare qualification or prerequisite pathway.";
    }
    if (!data.get("statement")) {
      next.statement = "The application statement is required — approximately 500 words.";
    }
    if (!data.get("acknowledge")) {
      next.acknowledge = "Please confirm you have read the entry requirements and policies.";
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
        Your application is received. The faculty will review it and write to you within
        fourteen days. There is no need to follow up — the institution answers in time.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-stack enrolment-form">
      <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
        <label htmlFor="enrol-name">Full name</label>
        <input id="enrol-name" name="name" type="text" autoComplete="name" />
        {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
      </div>

      <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
        <label htmlFor="enrol-email">Correspondence address</label>
        <input id="enrol-email" name="email" type="email" autoComplete="email" />
        {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
      </div>

      <div className={`form-field ${errors.qualification ? "form-field--error" : ""}`}>
        <label htmlFor="enrol-qualification">Healthcare qualification or prerequisite pathway</label>
        <input id="enrol-qualification" name="qualification" type="text" />
        {errors.qualification && <span className="form-error" role="alert">{errors.qualification}</span>}
      </div>

      <div className={`form-field ${errors.statement ? "form-field--error" : ""}`}>
        <label htmlFor="enrol-statement">
          Application statement (prior study, motivation, understanding of limits)
        </label>
        <textarea id="enrol-statement" name="statement" rows={8} />
        {errors.statement && <span className="form-error" role="alert">{errors.statement}</span>}
      </div>

      <div className={`form-field ${errors.acknowledge ? "form-field--error" : ""}`}>
        <label className="enrolment-form__checkbox">
          <input id="enrol-acknowledge" name="acknowledge" type="checkbox" value="yes" />
          <span className="type-body">
            I have read the entry requirements, assessment standard, and policies for{" "}
            {programmeName}. I understand that acceptance is not guaranteed.
          </span>
        </label>
        {errors.acknowledge && <span className="form-error" role="alert">{errors.acknowledge}</span>}
      </div>

      <p className="type-small enrolment-form__note">
        There is no need to decide today. The tradition keeps. Enrolment confirms interest;
        the faculty decides admission.
      </p>

      <SolidAction type="submit">Submit application</SolidAction>
    </form>
  );
}
