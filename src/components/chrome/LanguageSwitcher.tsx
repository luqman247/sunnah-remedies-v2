"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type AppLocale } from "@/i18n/locales";

export function LanguageSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const other = LOCALES.find((l) => l.id !== locale)!;

  function switchTo() {
    startTransition(() => {
      router.replace(pathname, { locale: other.id as AppLocale });
    });
  }

  return (
    <div className="ls" role="group" aria-label={t("ariaLanguage")}>
      {LOCALES.map((l, i) => {
        const active = l.id === locale;
        return (
          <span key={l.id} className="ls__pair">
            {i > 0 && <span className="ls__sep" aria-hidden="true" />}
            {active ? (
              <span className="ls__code is-active" aria-current="true" lang={l.htmlLang}>
                {l.short}
              </span>
            ) : (
              <button
                type="button"
                className="ls__code"
                lang={l.htmlLang}
                disabled={isPending}
                onClick={switchTo}
                aria-label={l.label}
              >
                {l.short}
              </button>
            )}
          </span>
        );
      })}
    </div>
  );
}
