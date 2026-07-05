"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { brandContext, brandAlt } from "@/lib/brand";
import {
  getRevelationForDay,
  publishedCollection,
} from "@/lib/content/library";
import { Revelation } from "@/components/institutional/Revelation";

interface PreFooterProps {
  action?: { label: string; href: string };
}

export function PreFooter({ action }: PreFooterProps) {
  const t = useTranslations("footer");
  const entry = getRevelationForDay();

  return (
    <section className="pre-footer" aria-label={t("dailyReflectionAria")}>
      <div className="pre-footer__image">
        <Image
          src="/photography/prophetic-medicine-research-table.jpg"
          alt={t("preFooterImageAlt")}
          fill
          sizes="100vw"
          quality={75}
        />
      </div>

      <div className="pre-footer__content">
        <Revelation
          entry={entry}
          entries={publishedCollection}
          interval={15000}
          variant="dark"
        />

        <div className="pre-footer__action">
          <Link
            href={action?.href || "/consultations"}
            className="quiet-link quiet-link--dark"
          >
            {action?.label || t("requestConsultation")}
          </Link>
        </div>
      </div>
    </section>
  );
}

interface FooterProps {
  columns?: { title: string; links: { label: string; href: string }[] }[];
  closingStatement?: string;
  colophon?: string;
  tagline?: string;
  foundingStatement?: string;
}

export function Footer({ columns, closingStatement, colophon, tagline, foundingStatement }: FooterProps) {
  const t = useTranslations("footer");

  return (
    <footer className="footer">
      <div className="measure-wide footer__grid">
        {/* ——— Identity ——— */}
        <div className="footer__identity">
          <Image
            src={brandContext.footer}
            alt={brandAlt}
            width={200}
            height={112}
            style={{
              height: "clamp(64px, 10vw, 96px)",
              width: "auto",
              display: "block",
            }}
          />
          <p className="footer__tagline">
            {tagline || t("tagline")}
          </p>
          <p className="type-small footer__founding">
            {foundingStatement || t("foundingStatement")}
          </p>
        </div>

        <hr className="hairline hairline--dark" />

        {/* ——— Navigation ——— */}
        <div className="footer__columns">
          {(columns || []).map((col) => (
            <div key={col.title}>
              <p className="type-eyebrow footer__column-label">{col.title}</p>
              <ul className="footer__links">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="quiet-link quiet-link--dark">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr className="hairline hairline--dark" />

        {/* ——— Closing ——— */}
        <div className="footer__closing">
          <p className="footer__closing-text">
            {closingStatement || t("closing")}
          </p>
          <p className="type-folio footer__colophon">
            {colophon || t("colophon")}
          </p>
        </div>
      </div>
    </footer>
  );
}
