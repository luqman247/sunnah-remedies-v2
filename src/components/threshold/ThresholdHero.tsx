"use client";

import { useEffect, useRef } from "react";
import { Emblem, Wordmark } from "@/components/chrome/Wordmark";

export function ThresholdSequence({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => el.classList.add("is-ready"));
  }, []);

  return (
    <div ref={ref} className="threshold-sequence">
      {children}
    </div>
  );
}

export function ThresholdHero() {
  return (
    <section
      className="leaf leaf--grave"
      style={{
        textAlign: "center",
        minHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ThresholdSequence>
        <p className="type-folio" style={{ color: "var(--paper-dim)", marginBottom: "var(--s5)" }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <div style={{ marginBottom: "var(--s5)" }}>
          <Emblem size={140} />
        </div>

        <Wordmark variant="light" />

        <p
          className="type-lede measure"
          style={{
            color: "var(--paper-dim)",
            fontStyle: "italic",
            margin: "var(--s6) auto",
          }}
        >
          An institution for the revival of Prophetic Medicine
        </p>

        <nav
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "var(--s5)",
          }}
          aria-label="Threshold directions"
        >
          <a href="/the-academy" className="quiet-link quiet-link--dark">
            Begin in the Academy
          </a>
          <a href="/the-apothecary" className="quiet-link quiet-link--dark">
            Enter the Apothecary
          </a>
          <a href="/sacred-journeys" className="quiet-link quiet-link--dark">
            Sacred Journeys
          </a>
        </nav>
      </ThresholdSequence>
    </section>
  );
}
