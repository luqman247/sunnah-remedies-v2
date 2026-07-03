"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Seal } from "./Seal";
import { departments as siteDepartments } from "@/lib/navigation/site-structure";

const departments = siteDepartments.map((d) => ({
  href: d.href,
  label: d.label,
}));

export function Masthead() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const firstLink = panelRef.current?.querySelector("a") as HTMLElement | null;
    firstLink?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner measure-wide">
          <Link href="/" className="masthead__brand">
            <Seal size="small" linked={false} />
            <span>
              <span className="masthead__wordmark">Sunnah Remedies</span>
              <span className="masthead__arabic type-arabic">الطب النبوي</span>
            </span>
          </Link>

          <nav className="masthead-nav" aria-label="Primary">
            {departments.map((dept) => (
              <Link key={dept.href} href={dept.href} className="nav-link">
                {dept.label}
              </Link>
            ))}
            <span className="masthead-nav__divider" aria-hidden="true" />
            <Link href="/consultations" className="nav-link nav-link--accent">
              Clinical consultations
            </Link>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="masthead-menu-btn"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            Navigation
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={panelRef}
        className={`mobile-nav-panel ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        hidden={!menuOpen}
      >
        <button
          type="button"
          className="mobile-nav-panel__close"
          onClick={() => {
            setMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
        >
          Close navigation
        </button>
        <Link
          href="/"
          className="quiet-link quiet-link--dark"
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        {departments.map((dept) => (
          <Link
            key={dept.href}
            href={dept.href}
            className="quiet-link quiet-link--dark"
            onClick={() => setMenuOpen(false)}
          >
            {dept.label}
          </Link>
        ))}
        <Link
          href="/consultations"
          className="quiet-link quiet-link--dark"
          onClick={() => setMenuOpen(false)}
          style={{ color: "var(--gilt-soft)" }}
        >
          Clinical consultations
        </Link>
      </div>
    </>
  );
}
