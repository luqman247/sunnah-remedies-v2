"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { AppLocale } from "@/i18n/locales";
import type { DuaDhikrEntryPublic } from "@/sanity/lib/dua-dhikr-public-fetch";
import type { CanonicalSubcategory } from "@/lib/dua-dhikr/taxonomy";
import { DuaDhikrEntryCard } from "./DuaDhikrEntryCard";
import "./dua-dhikr.css";

interface DuaDhikrEntryCollectionProps {
  entries: DuaDhikrEntryPublic[];
  subcategories: CanonicalSubcategory[];
  locale: AppLocale;
}

/**
 * Collection-page reading list with in-collection search and subcategory
 * filters. Operates only over the entries already fetched server-side for
 * this one collection (never a cross-collection dataset) — filtering is
 * client-side only and never changes what was fetched.
 */
export function DuaDhikrEntryCollection({ entries, subcategories, locale }: DuaDhikrEntryCollectionProps) {
  const t = useTranslations("duaDhikr.collection");
  const [query, setQuery] = useState("");
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(null);

  const visibleEntries = useMemo(() => {
    const term = query.trim().toLowerCase();
    return entries.filter((entry) => {
      if (subcategoryFilter && !entry.subcategorySlugs?.includes(subcategoryFilter)) return false;
      if (!term) return true;
      const haystacks = [entry.titleEn, entry.titleDa ?? "", entry.whatItIsFor ?? "", ...(entry.searchAliases ?? [])];
      return haystacks.some((value) => value.toLowerCase().includes(term));
    });
  }, [entries, query, subcategoryFilter]);

  return (
    <div>
      <div className="dua-dhikr-search">
        <label htmlFor="dua-dhikr-collection-search" className="sr-only">
          {t("searchWithinLabel")}
        </label>
        <input
          id="dua-dhikr-collection-search"
          type="search"
          className="dua-dhikr-search__input"
          placeholder={t("searchWithinPlaceholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
        />
      </div>

      {subcategories.length > 0 && (
        <div className="dua-dhikr-entry-card__badges" role="group" aria-label={t("subcategoryFilterLabel")}>
          <button
            type="button"
            className="dua-dhikr-entry-card__action"
            aria-pressed={subcategoryFilter === null}
            onClick={() => setSubcategoryFilter(null)}
          >
            {t("allSubcategories")}
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.slug}
              type="button"
              className="dua-dhikr-entry-card__action"
              aria-pressed={subcategoryFilter === sub.slug}
              onClick={() => setSubcategoryFilter(sub.slug)}
            >
              {sub.titleEn}
            </button>
          ))}
        </div>
      )}

      <p className="dua-dhikr-entry-card__what-for" role="status">
        {t("entryCount", { count: visibleEntries.length })}
      </p>

      {visibleEntries.length === 0 ? (
        <div className="dua-dhikr-empty-state">
          <h3 className="dua-dhikr-empty-state__heading">{t("emptyState.heading")}</h3>
          <p className="type-body">{t("emptyState.body")}</p>
        </div>
      ) : (
        <div className="dua-dhikr-entry-list">
          {visibleEntries.map((entry) => (
            <DuaDhikrEntryCard key={entry._id} entry={entry} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
