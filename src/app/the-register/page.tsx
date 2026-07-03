"use client";

import { useState } from "react";
import { Leaf } from "@/components/ui/Leaf";
import { ListingRow } from "@/components/ui/Attestation";
import { PageIntro } from "@/components/ui/PageIntro";
import { remedies } from "@/lib/content/remedies";

const corpus = [
  ...remedies.map((r) => {
    const ref = r.propheticReferences[0];
    return {
      title: `${r.name} — ${r.transliteration}`,
      provenance: `Apothecary · ${ref?.grade ?? "Classical"}`,
      href: `/the-apothecary/${r.slug}`,
      subtitle: r.nature,
    };
  }),
  {
    title: "Foundations of Prophetic Medicine",
    provenance: "Academy · Essential",
    href: "/the-academy/foundations",
    subtitle: "The essential texts and terms of Tibb al-Nabawī.",
  },
  {
    title: "Ṣaḥīḥ al-Bukhārī — Kitāb al-Ṭibb",
    provenance: "Source · Canonical",
    href: "/the-academy/materia-medica",
    subtitle: "The book of medicine in the canonical collection.",
  },
];

export default function RegisterPage() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const results = searched
    ? corpus.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        (item.subtitle?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : [];

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="The Register"
            folio="i"
            title="Search the institution"
            lede="Texts, remedies, and sources — indexed with grade and department."
          >
            <p>
              A reading room for the institution&apos;s corpus. Results carry
              provenance and department, as the cabinet and the Academy do.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure" style={{ margin: "0 auto" }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(true);
            }}
            className="form-field register-search"
          >
            <label htmlFor="register-search">Search term</label>
            <input
              id="register-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
