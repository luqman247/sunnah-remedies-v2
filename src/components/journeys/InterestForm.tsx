"use client";

import { useState } from "react";

export function InterestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    if (!data.get("name")) next.name = "Name is required";
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "A valid email address is required";
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
      <p className="type-body-l interest-form__confirmation" role="status">
        Your interest has been noted. We will be in touch within fourteen days
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="interest-form">
      <div className="interest-form__fields">
        <div className={`interest-form__field ${errors.name ? "interest-form__field--error" : ""}`}>
          <label htmlFor="interest-name" className="interest-form__label">
            Name
          </label>
          <input
            id="interest-name"
            name="name"
            type="text"
            autoComplete="name"
            className="interest-form__input"
          />
          {errors.name && (
            <span className="form-error" role="alert">{errors.name}</span>
          )}
        </div>

        <div className={`interest-form__field ${errors.email ? "interest-form__field--error" : ""}`}>
          <label htmlFor="interest-email" className="interest-form__label">
            Email address
          </label>
          <input
            id="interest-email"
            name="email"
            type="email"
            autoComplete="email"
            className="interest-form__input"
          />
          {errors.email && (
            <span className="form-error" role="alert">{errors.email}</span>
          )}
        </div>
      </div>

      <button type="submit" className="interest-form__submit">
        Register interest
      </button>
    </form>
  );
}
