"use client";

/**
 * SearchInterface — client-side search component.
 *
 * Hydrates on interaction (lazy), debounces input, and renders
 * results from the search engine abstraction.
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { SearchResult, SearchHit } from "@/lib/search/engine";

const DEBOUNCE_MS = 300;

export function SearchInterface() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("search");
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = useCallback(
    (value: string) => {
      setQuery(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        router.replace(`/search?q=${encodeURIComponent(value)}`, { scroll: false });
        performSearch(value);
      }, DEBOUNCE_MS);
    },
    [performSearch, router]
  );

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
  }, [initialQuery, performSearch]);

  return (
    <div role="search" aria-label={t("ariaLabel")}>
      <div style={{ position: "relative" }}>
        <input
          type="search"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("inputAriaLabel")}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "var(--s4) var(--s5)",
            fontSize: "var(--step-0)",
            fontFamily: "var(--font-body)",
            border: "1px solid var(--rule)",
            background: "var(--paper)",
            color: "var(--ink)",
            borderRadius: "var(--radius, 4px)",
          }}
        />
        {loading && (
          <span
            aria-live="polite"
            style={{
              position: "absolute",
              right: "var(--s4)",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
              fontSize: "var(--step--1)",
            }}
          >
            {t("searching")}
          </span>
        )}
      </div>

      {results && (
        <div aria-live="polite" style={{ marginTop: "var(--s5)" }}>
          <p className="type-small" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
            {t("resultsSummary", { count: results.totalHits, ms: results.processingTimeMs })}
          </p>

          {results.hits.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--s4)" }}>
              {results.hits.map((hit: SearchHit) => (
                <a
                  key={hit.objectID}
                  href={hit.url}
                  className="quiet-link"
                  style={{
                    display: "block",
                    padding: "var(--s4)",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  <span className="type-eyebrow" style={{ color: "var(--gilt-soft)", fontSize: "var(--step--2)" }}>
                    {hit.type}
                  </span>
                  <h3 className="type-body" style={{ fontWeight: 600, marginTop: "var(--s1)" }}>
                    {hit.title}
                  </h3>
                  {hit.excerpt && (
                    <p className="type-small" style={{ color: "var(--muted)", marginTop: "var(--s2)" }}>
                      {hit.excerpt.slice(0, 160)}
                    </p>
                  )}
                </a>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--s7) 0" }}>
              <p className="type-body" style={{ marginBottom: "var(--s4)" }}>
                {t("noResults", { query: results.query })}
              </p>
              <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s5)" }}>
                {t("tryDifferent")}
              </p>
              <Link href="/correspondence" className="quiet-link">
                {t("askDirectly")} →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
