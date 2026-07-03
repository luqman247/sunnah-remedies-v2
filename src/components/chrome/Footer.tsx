import Link from "next/link";
import Image from "next/image";
import { brandContext, brandAlt } from "@/lib/brand";

interface PreFooterProps {
  statement?: string;
  action?: { label: string; href: string };
}

export function PreFooter({ statement, action }: PreFooterProps) {
  return (
    <section className="pre-footer" aria-label="Institutional closing">
      <div className="pre-footer__image">
        <Image
          src="/photography/institution-hero.jpg"
          alt="Scholarly hands examining an illuminated manuscript of Prophetic medicine"
          fill
          sizes="100vw"
          quality={75}
        />
      </div>
      <div className="pre-footer__content">
        <p className="pre-footer__statement">
          {statement || "Begin where you are. Whether you seek a remedy, wish to study, or are preparing for pilgrimage — the institution is open."}
        </p>
        <div className="pre-footer__action">
          <Link href={action?.href || "/consultations"} className="quiet-link quiet-link--dark">
            {action?.label || "Request a consultation"}
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
}

export function Footer({ columns, closingStatement, colophon }: FooterProps) {
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
            Institute of Prophetic Medicine
          </p>
          <p className="type-small footer__founding">
            Scholarship, clinical practice, and natural therapeutics under one
            house — structured for continuity, governed by restraint.
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
            {closingStatement || "Knowledge before commerce. Service before profit. Trust before growth."}
          </p>
          <p className="type-folio footer__colophon">
            {colophon || "Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means"}
          </p>
        </div>
      </div>
    </footer>
  );
}
