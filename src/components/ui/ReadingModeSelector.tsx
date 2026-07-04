"use client";

import { useState, useEffect } from "react";

type ReadingMode = "standard" | "focused" | "evening";

const labels: Record<ReadingMode, string> = {
  standard: "Day",
  focused: "Focus",
  evening: "Evening",
};

export function ReadingModeSelector() {
  const [mode, setMode] = useState<ReadingMode>("standard");

  useEffect(() => {
    const saved = localStorage.getItem("reading-mode") as ReadingMode | null;
    if (saved && labels[saved]) {
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
    <fieldset className="reading-mode-selector" aria-label="Reading mode">
      <legend className="sr-only">Choose reading mode</legend>
      {(Object.keys(labels) as ReadingMode[]).map((key) => (
        <button
          key={key}
          type="button"
          className={`reading-mode-selector__btn ${mode === key ? "reading-mode-selector__btn--active" : ""}`}
          onClick={() => setMode(key)}
          aria-pressed={mode === key}
        >
          {labels[key]}
        </button>
      ))}
    </fieldset>
  );
}
