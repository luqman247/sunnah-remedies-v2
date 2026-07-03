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
    if (!data.get("name")) next.name = "We'll need your name to reply.";
    const email = data.get("email") as string;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = "We'll need a way to reach you — an address like name@example.com.";
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
            { label: "Enrol" },
          ]}
        />
        <PageIntro
          section="The Academy"
          folio="—"
          title="Enrol in Foundations"
          lede="Free · a right of the community."
        />
        {submitted ? (
          <p className="type-body-l">
            You are enrolled. Materials will arrive at your correspondence address within
            three days. There is no fee and no further step required.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="form-stack">
            <div className={`form-field ${errors.name ? "form-field--error" : ""}`}>
              <label htmlFor="found-name">Your name</label>
              <input id="found-name" name="name" type="text" autoComplete="name" />
              {errors.name && <span className="form-error" role="alert">{errors.name}</span>}
            </div>
            <div className={`form-field ${errors.email ? "form-field--error" : ""}`}>
              <label htmlFor="found-email">Correspondence address</label>
              <input id="found-email" name="email" type="email" autoComplete="email" />
              {errors.email && <span className="form-error" role="alert">{errors.email}</span>}
            </div>
            <SolidAction type="submit">Enrol</SolidAction>
          </form>
        )}
      </div>
    </Leaf>
  );
}
