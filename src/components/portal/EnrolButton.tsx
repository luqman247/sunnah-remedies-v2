"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

interface EnrolButtonProps {
  courseRef: string;
  courseSlug: string;
  courseName: string;
}

export function EnrolButton({ courseRef, courseSlug, courseName }: EnrolButtonProps) {
  const t = useTranslations("portal.enrol");
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
        setError(data.error ?? t("failed"));
        return;
      }
      router.refresh();
    } catch {
      setError(t("unable"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" onClick={handleEnrol} disabled={loading} className="solid-action">
        {loading ? t("enrolling") : t("button")}
      </button>
      {error && (
        <p className="type-small" role="alert" style={{ marginTop: "var(--s2)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
