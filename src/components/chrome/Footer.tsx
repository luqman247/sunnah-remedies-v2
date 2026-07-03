import Link from "next/link";
import Image from "next/image";
import { brandContext, brandAlt } from "@/lib/brand";

export function PreFooter() {
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
          Begin where you are. Whether you seek a remedy, wish to study, or are
          preparing for pilgrimage — the institution is open.
        </p>
        <div className="pre-footer__action">
          <Link href="/consultations" className="quiet-link quiet-link--dark">
            Request a consultation
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
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

        {/* ——— Navigation (reduced ~80%) ——— */}
        <div className="footer__columns">
          <div>
            <p className="type-eyebrow footer__column-label">The Pillars</p>
            <ul className="footer__links">
              <li>
                <Link href="/the-apothecary" className="quiet-link quiet-link--dark">
                  The Apothecary
                </Link>
              </li>
              <li>
                <Link href="/the-academy" className="quiet-link quiet-link--dark">
                  The Academy
                </Link>
              </li>
              <li>
                <Link href="/sacred-journeys" className="quiet-link quiet-link--dark">
                  Sacred Journeys
                </Link>
              </li>
              <li>
                <Link href="/knowledge-library" className="quiet-link quiet-link--dark">
                  Knowledge Library
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="type-eyebrow footer__column-label">Institution</p>
            <ul className="footer__links">
              <li>
                <Link href="/charter" className="quiet-link quiet-link--dark">
                  Founding Charter
                </Link>
              </li>
              <li>
                <Link href="/the-apothecary/quality-standards" className="quiet-link quiet-link--dark">
                  Quality Standards
                </Link>
              </li>
              <li>
                <Link href="/consultations" className="quiet-link quiet-link--dark">
                  Consultations
                </Link>
              </li>
              <li>
                <Link href="/the-register" className="quiet-link quiet-link--dark">
                  The Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="type-eyebrow footer__column-label">Connect</p>
            <ul className="footer__links">
              <li>
                <Link href="/correspondence" className="quiet-link quiet-link--dark">
                  Correspondence
                </Link>
              </li>
              <li>
                <Link href="/the-academy/enrolment" className="quiet-link quiet-link--dark">
                  Academy Enrolment
                </Link>
              </li>
              <li>
                <Link href="/sacred-journeys/registration" className="quiet-link quiet-link--dark">
                  Journey Registration
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="type-eyebrow footer__column-label">Legal</p>
            <ul className="footer__links">
              <li>
                <Link href="/charter" className="quiet-link quiet-link--dark">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/charter" className="quiet-link quiet-link--dark">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/charter" className="quiet-link quiet-link--dark">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="hairline hairline--dark" />

        {/* ——— Closing ——— */}
        <div className="footer__closing">
          <p className="footer__closing-text">
            Knowledge before commerce. Service before profit. Trust before growth.
          </p>
          <p className="type-folio footer__colophon">
            Sunnah Remedies · Est. MMXXV · Healing is from Allah · the remedy is a means
          </p>
        </div>
      </div>
    </footer>
  );
}
