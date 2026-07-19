"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import { searchFeelingStates } from "@/lib/feeling/search";
import "./feeling.css";

interface FeelingSearchProps {
  locale: AppLocale;
}

/**
 * Landing-page feeling search (SPEC §9). Mirrors DuaDhikrSearch's simple,
 * accessible pattern: a plain text input plus an `aria-live="polite"`
 * results region — no client-side dependency beyond the pure
 * searchFeelingStates function, which itself checks crisis-interception
 * before any taxonomy match (SPEC §8).
 */
export function FeelingSearch({ locale }: FeelingSearchProps) {
  const t = useTranslations("feeling.landing");
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchFeelingStates(query), [query]);

  return (
    <div className="feeling-search">
      <label htmlFor="feeling-search-input" className="sr-only">
        {t("searchLabel")}
      </label>
      <input
        id="feeling-search-input"
        type="search"
        className="feeling-search__input"
        placeholder={t("searchPlaceholder")}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />

      {query.trim() !== "" && (
        <div role="status" aria-live="polite">
          {results.length === 0 ? (
            <p className="feeling-search__empty">{t("searchNoResults")}</p>
          ) : results[0].type === "crisis" ? (
            <div className="feeling-search__crisis">
              <p className="feeling-search__crisis-text">{t("searchCrisisNotice")}</p>
              <Link href="/i-am-feeling/urgent-support" className="feeling-search__crisis-link">
                {t("searchCrisisLinkLabel")}
              </Link>
            </div>
          ) : (
            <ul className="feeling-search__results">
              {results.map((result) => {
                if (result.type === "crisis") return null;
                const label = locale === "da" && result.state.labelDa ? result.state.labelDa : result.state.labelEn;
                const titleLang = locale === "da" && !result.state.labelDa ? "en" : undefined;
                return (
                  <li key={result.state.slug}>
                    <Link href={`/i-am-feeling/${result.state.slug}`} className="feeling-search__result">
                      <span className="feeling-search__result-label" lang={titleLang}>
                        {label}
                      </span>
                      {result.type === "deferred-redirect" && (
                        <span className="feeling-search__result-note">{t("searchDeferredRedirectNotice")}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
