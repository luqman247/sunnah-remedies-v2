"use client";

import { useState } from "react";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead } from "@/components/ui/Links";
import { ListingRow } from "@/components/ui/Attestation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const corpus = [
  {
    title: "Black Seed — al-ḥabba al-sawdāʾ",
    provenance: "Apothecary · Established",
    href: "/the-apothecary/black-seed-oil",
  },
  {
    title: "Foundations of Prophetic Medicine",
    provenance: "Academy · Essential",
    href: "/the-academy/foundations",
  },
  {
    title: "Ṣaḥīḥ al-Bukhārī — Kitāb al-Ṭibb",
    provenance: "Source · Canonical",
    href: "/the-academy/materia-medica",
  },
];

export default function RegisterPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = searched
    ? corpus.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="The Register" folio="i" />
          <ScrollReveal>
            <h1 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
              Search the institution
            </h1>
            <p className="type-body-l measure" style={{ marginBottom: "var(--s6)" }}>
              A reading room for the institution&apos;s texts, remedies, and sources.
            </p>
          </ScrollReveal>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure" style={{ margin: "0 auto" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(true);
            }}
            className="form-field"
          >
            <label htmlFor="register-search" className="sr-only">
              Search the institution
            </label>
            <input
              id="register-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the institution's texts, remedies, and sources."
              style={{ fontSize: "1.2rem", padding: "var(--s3) var(--s4)" }}
            />
          </form>

          {searched && results.length === 0 && (
            <p className="type-body" style={{ marginTop: "var(--s5)" }}>
              The Register holds no entry under that term. Try a broader one, search
              within a single department, or write to us and we will look ourselves.
            </p>
          )}

          {results.length > 0 && (
            <div style={{ marginTop: "var(--s5)" }}>
              {results.map((item) => (
                <ListingRow key={item.href} {...item} />
              ))}
            </div>
          )}
        </div>
      </Leaf>
    </>
  );
}
