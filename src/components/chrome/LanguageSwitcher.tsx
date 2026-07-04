"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type AppLocale } from "@/i18n/locales";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const current = LOCALES.find((l) => l.id === locale)!;

  function switchTo(nextLocale: string) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as AppLocale });
    });
  }

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={menuRef} className="ls">
      <button
        ref={btnRef}
        type="button"
        className="ls__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("ariaLanguage")}
        disabled={isPending}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="ls__label">{current.short}</span>
        <svg
          className={`ls__chev ${open ? "is-open" : ""}`}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden
        >
          <path
            d="M1 3l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className={`ls__menu ${open ? "is-open" : ""}`}
        role="listbox"
        aria-label={t("ariaLanguage")}
      >
        {LOCALES.map((l) => {
          const active = l.id === locale;
          return (
            <button
              key={l.id}
              role="option"
              aria-selected={active}
              lang={l.htmlLang}
              className={`ls__item ${active ? "is-active" : ""}`}
              onClick={() => switchTo(l.id)}
            >
              <span>{l.label}</span>
              {active && (
                <svg
                  className="ls__check"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  aria-hidden
                >
                  <path
                    d="M2 7l3.5 3.5L12 3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
