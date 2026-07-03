"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { brandContext, brandAlt } from "@/lib/brand";

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

        <div className="threshold__emblem" style={{ display: "flex", justifyContent: "center" }}>
          <Image
            src={brandContext.homepageHero}
            alt={brandAlt}
            width={674}
            height={374}
            priority
            style={{
              width: "clamp(240px, 40vw, 480px)",
              height: "auto",
              display: "block",
            }}
          />
        </div>

        <h1 className="type-display-xl threshold__standing">
          The world&apos;s leading institute of Prophetic Medicine
        </h1>

        <p className="type-lede threshold__declaration">
          A house for scholarship, clinical practice, and natural therapeutics
          across four departments. Built for careful study, patient service, and
          long stewardship.
        </p>

        <nav className="threshold__nav" aria-label="Department navigation">
          <Link href="/the-academy" className="quiet-link quiet-link--dark">
            Visit the Academy
          </Link>
          <Link href="/the-apothecary" className="quiet-link quiet-link--dark">
            Visit the Apothecary
          </Link>
          <Link href="/sacred-journeys" className="quiet-link quiet-link--dark">
            Visit Sacred Journeys
          </Link>
          <Link href="/knowledge-library" className="quiet-link quiet-link--dark">
            Visit the Knowledge Library
          </Link>
        </nav>
      </ThresholdSequence>
    </section>
  );
}
