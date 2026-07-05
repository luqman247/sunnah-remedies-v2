"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface LessonCompleteButtonProps {
  enrolmentId: string;
  lessonRef: string;
  lessonSlug: string;
  totalLessons: number;
  initiallyCompleted?: boolean;
}

export function LessonCompleteButton({
  enrolmentId,
  lessonRef,
  lessonSlug,
  totalLessons,
  initiallyCompleted = false,
}: LessonCompleteButtonProps) {
  const t = useTranslations("portal.lesson");
  const [completed, setCompleted] = useState(initiallyCompleted);
  const [loading, setLoading] = useState(false);

  async function markComplete() {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrolmentId,
          lessonRef,
          lessonSlug,
          completed: true,
          totalLessons,
        }),
      });
      if (res.ok) setCompleted(true);
    } finally {
      setLoading(false);
    }
  }

  if (completed) {
    return (
      <p className="type-micro" style={{ color: "var(--muted)" }}>
        {t("markedComplete")}
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={markComplete}
      disabled={loading}
      className="solid-action"
    >
      {loading ? t("recording") : t("complete")}
    </button>
  );
}
