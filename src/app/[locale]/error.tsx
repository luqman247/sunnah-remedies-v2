"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="leaf" style={{ minHeight: "50vh", display: "flex", alignItems: "center" }}>
      <div
        className="measure-wide"
        style={{ textAlign: "center", maxWidth: "var(--measure-reading)", margin: "0 auto" }}
        role="alert"
      >
        <h1 className="type-display-l" style={{ marginBottom: "var(--s4)" }}>
          {t("errorTitle")}
        </h1>
        <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s6)" }}>
          {t("errorBody")}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s5)", justifyContent: "center" }}>
          <button type="button" className="quiet-link" onClick={reset}>
            {t("retry")}
          </button>
          <Link href="/" className="quiet-link">
            {t("returnHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}
