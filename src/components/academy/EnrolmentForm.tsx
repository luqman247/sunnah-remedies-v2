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

    if (!data.get("name")) next.name = "Full name is required.";
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "Enter a valid email address, for example name@example.com.";
    }
    if (!data.get("qualification")) {
      next.qualification = "State your healthcare qualification or prerequisite pathway.";
    }
    if (!data.get("statement")) {
      next.statement = "Application statement is required (approximately 500 words).";
    }
    if (!data.get("acknowledge")) {
      next.acknowledge = "Confirmation is required before submission.";
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
        Your application has been received. Faculty review is completed within
        fourteen days, and you will be contacted by email.
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
        <label htmlFor="enrol-email">Email address</label>
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
            I confirm that I have read the entry requirements, assessment
            standards, and policies for{" "}
            {programmeName}. I understand that acceptance is not guaranteed.
          </span>
        </label>
        {errors.acknowledge && <span className="form-error" role="alert">{errors.acknowledge}</span>}
      </div>

      <p className="type-small enrolment-form__note">
        Submission records your interest. Admission is determined after academic
        and clinical review.
      </p>

      <SolidAction type="submit">Send application</SolidAction>
    </form>
  );
}
