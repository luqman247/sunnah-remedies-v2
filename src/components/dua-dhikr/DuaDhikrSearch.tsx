"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/locales";
import type { DuaDhikrCollectionPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import { DuaDhikrIcon } from "./icons";
import "./dua-dhikr.css";

interface DuaDhikrSearchProps {
  collections: DuaDhikrCollectionPublic[];
  locale: AppLocale;
}

/**
 * Client-side search over the fixed, small (≈35-item) canonical collection
 * list — never a large dataset fetch, per docs/dua-dhikr/README.md's
 * performance note. Matches against title, description, and every declared
 * alias/subcategory (see src/lib/dua-dhikr/taxonomy.ts), so overlapping
 * terms like "eating", "travelling", or "before wudu" all resolve to their
 * one canonical collection instead of returning nothing or a duplicate.
 */
export function DuaDhikrSearch({ collections, locale }: DuaDhikrSearchProps) {
  const t = useTranslations("duaDhikr.landing");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return collections.filter((collection) => {
      const haystacks = [
        collection.titleEn,
        collection.titleDa ?? "",
        collection.descriptionEn,
        ...collection.aliases,
        ...(collection.subcategories?.flatMap((s) => [s.titleEn, ...(s.aliases ?? [])]) ?? []),
      ];
      return haystacks.some((value) => value.toLowerCase().includes(term));
    });
  }, [collections, query]);

  return (
    <div className="dua-dhikr-search">
      <label htmlFor="dua-dhikr-search-input" className="sr-only">
        {t("searchLabel")}
      </label>
      <input
        id="dua-dhikr-search-input"
        type="search"
        className="dua-dhikr-search__input"
        placeholder={t("searchPlaceholder")}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        autoComplete="off"
      />

      {query.trim() !== "" && (
        <div role="status" aria-live="polite">
          {results.length === 0 ? (
            <p className="dua-dhikr-search__empty">{t("searchNoResults", { query })}</p>
          ) : (
            <ul className="dua-dhikr-search__results">
              {results.map((collection) => {
                const title = locale === "da" && collection.titleDa ? collection.titleDa : collection.titleEn;
                const href = collection.externalHref ?? `/knowledge-library/dua-dhikr/${collection.slug}`;
                return (
                  <li key={collection.slug}>
                    <Link href={href} className="dua-dhikr-search__result">
                      <DuaDhikrIcon iconKey={collection.iconKey} size={20} />
                      <span>{title}</span>
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
