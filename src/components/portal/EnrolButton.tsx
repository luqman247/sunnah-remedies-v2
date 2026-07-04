"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";

interface EnrolButtonProps {
  courseRef: string;
  courseSlug: string;
  courseName: string;
}

export function EnrolButton({ courseRef, courseSlug, courseName }: EnrolButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleEnrol() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portal/student/enrolments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseRef, courseSlug, courseName }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Enrolment failed");
        return;
      }
      router.refresh();
    } catch {
      setError("Unable to complete enrolment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleEnrol} disabled={loading} className="solid-action">
        {loading ? "Enrolling…" : "Enrol on this course"}
      </button>
      {error && (
        <p className="type-small" role="alert" style={{ marginTop: "var(--s2)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
