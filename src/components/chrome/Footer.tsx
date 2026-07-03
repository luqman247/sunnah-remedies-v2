import Link from "next/link";
import { Emblem } from "./Wordmark";
import {
  institution,
  departments,
} from "@/lib/navigation/site-structure";

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
            The world&apos;s leading institute of Prophetic Medicine — measured in
            trust, built to be inherited.
          </p>
        </div>

        <div className="footer__columns footer__columns--wide">
          {departments.map((dept) => (
            <div key={dept.id}>
              <p className="type-eyebrow footer__column-label">
                <Link href={dept.href} className="quiet-link quiet-link--dark">
                  {dept.label}
                </Link>
              </p>
              <ul className="footer__links">
                {dept.sections.map((section) => (
                  <li key={section.href}>
                    <Link href={section.href} className="quiet-link quiet-link--dark">
                      {section.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="type-eyebrow footer__column-label">Institution</p>
            <ul className="footer__links">
              {institution.sections.map((section) => (
                <li key={section.href}>
                  <Link href={section.href} className="quiet-link quiet-link--dark">
                    {section.label}
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
