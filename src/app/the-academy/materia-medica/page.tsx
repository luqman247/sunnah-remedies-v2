import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { ListingRow } from "@/components/ui/Attestation";
import { remedies as staticRemedies } from "@/lib/content/remedies";
import { getAllProducts } from "@/sanity/lib/fetch";
import { productToRemedy } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "The Materia Medica",
};

export default async function MateriaMedicaPage() {
  const products = await getAllProducts();
  const remedies = products.length ? products.map(productToRemedy) : staticRemedies;
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <Breadcrumb
            items={[
              { label: "The Academy", href: "/the-academy" },
              { label: "The Materia Medica" },
            ]}
          />
          <PageIntro
            section="The Academy"
            folio="iv"
            title="The Materia Medica"
            lede="Remedies of the tradition, graded, sourced, and studied as texts"
          >
            <p>
              Eight weeks, in-person teaching, and assigned reading. Each module
              pairs classical citations with Apothecary monographs. Assessment is
              by written paper and oral examination on provenance
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <SectionLabel>Cabinet texts studied in this course</SectionLabel>
          {remedies.map((r) => (
            <ListingRow
              key={r.slug}
              title={r.name}
              subtitle={r.transliteration}
              provenance={r.propheticReferences[0]?.grade ?? "Classical"}
              href={`/the-apothecary/${r.slug}`}
            />
          ))}
          <p className="type-body" style={{ marginTop: "var(--s5)" }}>
            <GoLink href="/correspondence">Write to us regarding enrolment</GoLink>
          </p>
        </div>
      </Leaf>
    </>
  );
}
