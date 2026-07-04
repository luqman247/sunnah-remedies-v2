import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo/metadata";
import { SearchInterface } from "@/components/search/SearchInterface";

export const metadata: Metadata = buildMetadata({
  path: "/search",
  type: "search",
  document: { title: "Search" },
});

export default function SearchPage() {
  return (
    <div className="leaf" style={{ minHeight: "60vh" }}>
      <div className="measure-wide" style={{ maxWidth: "var(--measure-reading)" }}>
        <h1 className="type-display-l" style={{ marginBottom: "var(--s5)" }}>
          Search the institution
        </h1>
        <p className="type-body" style={{ color: "var(--muted)", marginBottom: "var(--s6)" }}>
          Find remedies, conditions, research, courses, hadith, and scholarly articles across the entire institution
        </p>

        <Suspense fallback={<div style={{ height: "200px" }} />}>
          <SearchInterface />
        </Suspense>

        {/* Popular searches / editorial suggestions */}
        <div style={{ marginTop: "var(--s8)" }}>
          <h2 className="type-eyebrow" style={{ marginBottom: "var(--s4)" }}>
            POPULAR SEARCHES
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--s3)" }}>
            {[
              "Black seed",
              "Honey",
              "Hijama",
              "Senna",
              "Digestive health",
              "Prophetic fasting",
              "Olive oil",
              "Immune support",
            ].map((term) => (
              <a
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="quiet-link"
              >
                {term}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
