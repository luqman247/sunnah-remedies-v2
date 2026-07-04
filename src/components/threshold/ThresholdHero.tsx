"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("threshold");

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
          {t("standing")}
        </h1>

        <p className="type-lede threshold__declaration">
          {t("declaration")}
        </p>

        <nav className="threshold__nav" aria-label={t("departmentNav")}>
          <Link href="/the-academy" className="quiet-link quiet-link--dark">
            {t("visitAcademy")}
          </Link>
          <Link href="/the-apothecary" className="quiet-link quiet-link--dark">
            {t("visitApothecary")}
          </Link>
          <Link href="/sacred-journeys" className="quiet-link quiet-link--dark">
            {t("visitJourneys")}
          </Link>
          <Link href="/knowledge-library" className="quiet-link quiet-link--dark">
            {t("visitLibrary")}
          </Link>
        </nav>
      </ThresholdSequence>
    </section>
  );
}
