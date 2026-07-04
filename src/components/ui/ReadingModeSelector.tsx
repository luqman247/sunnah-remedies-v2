"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

type ReadingMode = "standard" | "focused" | "evening";

const MODES: ReadingMode[] = ["standard", "focused", "evening"];

export function ReadingModeSelector() {
  const t = useTranslations("readingMode");
  const [mode, setMode] = useState<ReadingMode>("standard");

  useEffect(() => {
    const saved = localStorage.getItem("reading-mode") as ReadingMode | null;
    if (saved && MODES.includes(saved)) {
      setMode(saved);
    }
  }, []);

  useEffect(() => {
    const article = document.querySelector("[data-reading-mode]");
    if (article) {
      article.setAttribute("data-reading-mode", mode);
    }
    localStorage.setItem("reading-mode", mode);
  }, [mode]);

  return (
    <fieldset className="reading-mode-selector" aria-label={t("ariaLabel")}>
      <legend className="sr-only">{t("legend")}</legend>
      {MODES.map((key) => (
        <button
          key={key}
          type="button"
          className={`reading-mode-selector__btn ${mode === key ? "reading-mode-selector__btn--active" : ""}`}
          onClick={() => setMode(key)}
          aria-pressed={mode === key}
        >
          {t(key)}
        </button>
      ))}
    </fieldset>
  );
}
