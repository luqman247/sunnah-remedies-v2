"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type AppLocale } from "@/i18n/locales";

/**
 * Language switcher — route-resolution strategy
 *
 * 1. Pathname from next-intl is locale-stripped (e.g. `/the-academy/curriculum`).
 * 2. `router.replace(pathname, { locale })` remaps to the peer locale using
 *    as-needed prefixes: English unprefixed, Danish under `/dk`.
 * 3. Equivalent routes share the same path after the locale prefix; if a DA
 *    CMS body is missing, English fallback may still render on `/dk` without
 *    404ing the chrome route itself.
 * 4. Query parameters are intentionally not forwarded: deep booking/form
 *    state must not travel through the URL across locales. Pagination and
 *    public filters can be re-added later via an allowlist if needed.
 * 5. NEXT_LOCALE cookie is updated by next-intl; document language follows
 *    the destination locale layout (`lang` / `dir` on `<html>`).
 */
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
                aria-label={t("switchTo", { language: l.label })}
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
