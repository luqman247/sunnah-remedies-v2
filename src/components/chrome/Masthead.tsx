"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Seal } from "./Seal";

const departments = [
  { href: "/the-apothecary", label: "The Apothecary" },
  { href: "/the-academy", label: "The Academy" },
  { href: "/sacred-journeys", label: "Sacred Journeys" },
];

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
    const firstLink = panelRef.current?.querySelector("a") as HTMLElement | null;
    firstLink?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--paper)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <div
          className="measure-wide"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--s4)",
            padding: "var(--s3) var(--margin-mobile)",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--s2)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Seal size="small" linked={false} />
            <span>
              <span
                style={{
                  fontFamily: "var(--font-display), Georgia, serif",
                  fontSize: "1.1rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                Sunnah Remedies
              </span>
              <span
                className="type-arabic"
                style={{
                  fontSize: "0.85rem",
                  color: "var(--muted)",
                  display: "block",
                }}
              >
                الطب النبوي
              </span>
            </span>
          </Link>

          <nav className="type-nav masthead-nav" aria-label="Primary">
            {departments.map((dept) => (
              <Link
                key={dept.href}
                href={dept.href}
                className="quiet-link"
                style={{ backgroundImage: "none", paddingBottom: 0 }}
              >
                {dept.label}
              </Link>
            ))}
            <span
              style={{
                width: "1px",
                height: "1rem",
                background: "var(--rule)",
              }}
              aria-hidden="true"
            />
            <Link
              href="/consultations"
              style={{ color: "var(--gilt)", textDecoration: "none" }}
            >
              Consultations
            </Link>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className="type-nav masthead-menu-btn"
            onClick={() => setMenuOpen(true)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink)",
              minHeight: "44px",
              minWidth: "44px",
            }}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            Menu
          </button>
        </div>
      </header>

      <div
        id="mobile-nav"
        ref={panelRef}
        className={`mobile-nav-panel ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        hidden={!menuOpen}
      >
        <button
          type="button"
          className="type-nav quiet-link--dark"
          onClick={() => {
            setMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
          style={{
            alignSelf: "flex-end",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--paper)",
            minHeight: "44px",
          }}
        >
          Close
        </button>
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
          Consultations
        </Link>
      </div>

      {menuOpen && (
        <div
          role="presentation"
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
            background: "rgba(30, 42, 34, 0.4)",
          }}
        />
      )}
    </>
  );
}
