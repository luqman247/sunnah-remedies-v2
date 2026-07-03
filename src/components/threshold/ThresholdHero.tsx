"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Emblem, Wordmark } from "@/components/chrome/Wordmark";

function ThresholdSequence({ children }: { children: React.ReactNode }) {
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
    <section className="leaf leaf--grave threshold">
      <ThresholdSequence>
        <p className="type-folio threshold__bismillah">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <div className="threshold__emblem">
          <Emblem size={128} />
        </div>

        <Wordmark variant="light" />

        <h1 className="type-display-xl threshold__standing">
          The world&apos;s leading institute of Prophetic Medicine
        </h1>

        <p className="type-lede threshold__declaration">
          Scholarship, clinical care, and natural therapeutics — one house,
          three departments. Measured in trust, built to be inherited.
        </p>

        <nav className="threshold__nav" aria-label="Threshold directions">
          <Link href="/the-academy" className="quiet-link quiet-link--dark">
            Begin in the Academy
          </Link>
          <Link href="/the-apothecary" className="quiet-link quiet-link--dark">
            Enter the Apothecary
          </Link>
          <Link href="/sacred-journeys" className="quiet-link quiet-link--dark">
            Sacred Journeys
          </Link>
        </nav>
      </ThresholdSequence>
    </section>
  );
}
