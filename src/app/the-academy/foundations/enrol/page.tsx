"use client";

import { useState } from "react";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { SolidAction } from "@/components/ui/Links";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";

export default function FoundationsEnrolPage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!data.get("name")) next.name = "Name is required.";
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "A valid email address is required.";
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setSubmitted(true);
  }

  return (
    <Leaf>
      <div className="measure" style={{ margin: "0 auto" }}>
        <Breadcrumb
          items={[
            { label: "The Academy", href: "/the-academy" },
            { label: "Foundations", href: "/the-academy/foundations" },
            { label: "Registration" },
          ]}
        />
        <PageIntro
          section="The Academy"
          folio="—"
          title="Register for Foundations"
          lede="No fee. Offered as a right of the community"
        />
        {submitted ? (
          <p className="type-body-l">
            Registration is complete. Materials will be sent to your email
            address within three days. No fee or further step is required
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="form-stack">
            <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
              <label htmlFor="found-name">Name</label>
              <input id="found-name" name="name" type="text" autoComplete="name" />
              {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
            </div>
            <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
              <label htmlFor="found-email">Email address</label>
              <input id="found-email" name="email" type="email" autoComplete="email" />
              {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
            </div>
            <SolidAction type="submit">Register your interest</SolidAction>
          </form>
        )}
      </div>
    </Leaf>
  );
}
