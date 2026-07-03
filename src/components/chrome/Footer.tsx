import Link from "next/link";
import { Emblem } from "./Wordmark";

const departmentLinks = [
  { href: "/the-apothecary", label: "The Apothecary" },
  { href: "/the-academy", label: "The Academy" },
  { href: "/sacred-journeys", label: "Sacred Journeys" },
];

const institutionLinks = [
  { href: "/charter", label: "The Founding Charter" },
  { href: "/charter#covenant", label: "Our Covenant" },
  { href: "/charter#authenticity", label: "On Authenticity" },
  { href: "/charter#sources", label: "Sources" },
];

const correspondLinks = [
  { href: "/correspondence", label: "Enquiries" },
  { href: "/correspondence#practitioners", label: "For Practitioners" },
  { href: "/the-register", label: "The Register" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="measure-wide footer__grid">
        <div className="footer__identity">
          <Emblem size={72} />
          <p className="footer__name">Sunnah Remedies</p>
          <p className="type-arabic footer__charter" style={{ color: "var(--paper-dim)" }}>
            الطب النبوي
          </p>
          <p className="type-small footer__charter">
            An institution for the revival of Prophetic Medicine — scholarship,
            clinical excellence, and carefully curated natural therapeutics.
          </p>
        </div>

        <div className="footer__columns">
          <div>
            <p className="type-eyebrow footer__column-label">Departments</p>
            <ul className="footer__links">
              {departmentLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="quiet-link quiet-link--dark">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-eyebrow footer__column-label">The Institution</p>
            <ul className="footer__links">
              {institutionLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="quiet-link quiet-link--dark">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-eyebrow footer__column-label">Correspond</p>
            <ul className="footer__links">
              {correspondLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="quiet-link quiet-link--dark">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="hairline hairline--dark" />

        <p className="type-folio footer__colophon">
          MMXXV · Healing is from Allah · the remedy is a means
        </p>
      </div>
    </footer>
  );
}
