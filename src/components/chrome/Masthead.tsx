"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { brandContext, brandAlt } from "@/lib/brand";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
  label: string;
  href: string;
  highlighted?: boolean;
}

interface MastheadProps {
  navItems?: NavItem[];
}

const TASK_SHORTCUTS = [
  { href: "/consultations", labelKey: "bookConsultation" as const },
  { href: "/the-apothecary", labelKey: "theApothecary" as const },
  { href: "/the-academy", labelKey: "theAcademy" as const },
  { href: "/knowledge-library/dua-dhikr", labelKey: "duaDhikr" as const },
  { href: "/institute", labelKey: "theInstitute" as const },
] as const;

export function Masthead({ navItems }: MastheadProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const departments = (navItems || []).filter((i) => !i.highlighted);
  const highlighted = (navItems || []).find((i) => i.highlighted);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    const panel = panelRef.current;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (e.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    const firstLink = panel?.querySelector("a, button") as HTMLElement | null;
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

  function closeMenu() {
    setMenuOpen(false);
    menuButtonRef.current?.focus();
  }

  const consultationHref = highlighted?.href || "/consultations";
  const consultationLabel = highlighted?.label || t("bookConsultation");

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

          <nav className="masthead-nav" aria-label={t("ariaPrimary")}>
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
              href={consultationHref}
              className={`nav-link nav-link--accent ${isActive(consultationHref) ? "nav-link--current" : ""}`}
              aria-current={isActive(consultationHref) ? "page" : undefined}
            >
              {consultationLabel}
            </Link>
          </nav>

          <div className="masthead__actions">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              className="masthead-menu-btn"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {t("navigation")}
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
        aria-label={t("ariaMenu")}
        hidden={!menuOpen}
      >
        <button
          type="button"
          className="mobile-nav-panel__close"
          onClick={closeMenu}
        >
          {t("closeNavigation")}
        </button>

        <Link
          href={consultationHref}
          className={`mobile-nav-panel__primary ${isActive(consultationHref) ? "quiet-link--current" : ""}`}
          aria-current={isActive(consultationHref) ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          {consultationLabel}
        </Link>

        <p className="mobile-nav-panel__group-label" id="mobile-nav-institutional">
          {t("ariaInstitutional")}
        </p>
        <nav aria-labelledby="mobile-nav-institutional">
          <Link
            href="/"
            className={`quiet-link quiet-link--dark mobile-nav-panel__link ${isActive("/") ? "quiet-link--current" : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {t("home")}
          </Link>
          {departments.map((dept) => (
            <Link
              key={dept.href}
              href={dept.href}
              className={`quiet-link quiet-link--dark mobile-nav-panel__link ${isActive(dept.href) ? "quiet-link--current" : ""}`}
              aria-current={isActive(dept.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {dept.label}
            </Link>
          ))}
        </nav>

        <p className="mobile-nav-panel__group-label" id="mobile-nav-tasks">
          {t("tasksHeading")}
        </p>
        <nav aria-labelledby="mobile-nav-tasks">
          {TASK_SHORTCUTS.map((task) => (
            <Link
              key={task.href}
              href={task.href}
              className={`quiet-link quiet-link--dark mobile-nav-panel__link ${isActive(task.href) ? "quiet-link--current" : ""}`}
              aria-current={isActive(task.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {t(task.labelKey)}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
