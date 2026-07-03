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
    <footer
      style={{
        background: "var(--myrtle-deep)",
        color: "var(--paper)",
        padding: "var(--s7) var(--margin-mobile)",
      }}
    >
      <div
        className="measure-wide"
        style={{
          display: "grid",
          gap: "var(--s6)",
          gridTemplateColumns: "1fr",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "var(--s3)",
          }}
        >
          <Emblem size={80} />
          <p
            style={{
              fontFamily: "var(--font-display), Georgia, serif",
              fontSize: "1.25rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Sunnah Remedies
          </p>
          <p className="type-arabic" style={{ color: "var(--paper-dim)", margin: 0 }}>
            الطب النبوي
          </p>
          <p className="type-small" style={{ color: "var(--paper-dim)", margin: 0, maxWidth: "28rem" }}>
            An institution for the revival of Prophetic Medicine — scholarship,
            clinical excellence, and carefully curated natural therapeutics.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "var(--s5)",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          <div>
            <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s3)" }}>
              Departments
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
              {departmentLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="quiet-link quiet-link--dark" style={{ fontSize: "0.72rem" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s3)" }}>
              The Institution
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
              {institutionLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="quiet-link quiet-link--dark" style={{ fontSize: "0.72rem" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-eyebrow" style={{ color: "var(--gilt-soft)", marginBottom: "var(--s3)" }}>
              Correspond
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "var(--s2)" }}>
              {correspondLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="quiet-link quiet-link--dark" style={{ fontSize: "0.72rem" }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="hairline hairline--dark" />

        <p
          className="type-folio"
          style={{ color: "var(--paper-dim)", margin: 0, textAlign: "center" }}
        >
          MMXXV · Healing is from Allah · the remedy is a means
        </p>
      </div>
    </footer>
  );
}
