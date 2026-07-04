"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { brandContext, brandAlt } from "@/lib/brand";
import { ThemeToggle } from "./ThemeToggle";

interface NavItem {
  label: string;
  href: string;
  highlighted?: boolean;
}

interface MastheadProps {
  navItems?: NavItem[];
}

export function Masthead({ navItems }: MastheadProps) {
  const pathname = usePathname();
  const departments = (navItems || []).filter(i => !i.highlighted);
  const highlighted = (navItems || []).find(i => i.highlighted);
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

  function isActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="masthead">
        <div className="masthead__inner measure-wide">
          <Link href="/" className="masthead__brand" aria-label={brandAlt}>
            <Image
              src={brandContext.navigation}
              alt={brandAlt}
              width={180}
              height={52}
              priority
              style={{ height: "clamp(28px, 4vw, 40px)", width: "auto", display: "block" }}
            />
          </Link>

          <nav className="masthead-nav" aria-label="Primary">
            {departments.map((dept) => (
              <Link
                key={dept.href}
                href={dept.href}
                className={`nav-link ${isActive(dept.href) ? "nav-link--current" : ""}`}
                aria-current={isActive(dept.href) ? "page" : undefined}
              >
                {dept.label}
              </Link>
            ))}
            <span className="masthead-nav__divider" aria-hidden="true" />
            <Link
              href={highlighted?.href || "/consultations"}
              className={`nav-link nav-link--accent ${isActive(highlighted?.href || "/consultations") ? "nav-link--current" : ""}`}
              aria-current={isActive(highlighted?.href || "/consultations") ? "page" : undefined}
            >
              {highlighted?.label || "Clinical consultations"}
            </Link>
          </nav>

          <div className="masthead__actions">
            <ThemeToggle />
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
            className={`quiet-link quiet-link--dark ${isActive(dept.href) ? "quiet-link--current" : ""}`}
            aria-current={isActive(dept.href) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {dept.label}
          </Link>
        ))}
        <Link
          href={highlighted?.href || "/consultations"}
          className="quiet-link quiet-link--dark"
          onClick={() => setMenuOpen(false)}
          style={{ color: "var(--gilt-soft)" }}
        >
          {highlighted?.label || "Clinical consultations"}
        </Link>
      </div>
    </>
  );
}
