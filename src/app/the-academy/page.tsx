import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { RunningHead } from "@/components/ui/Links";
import { ListingRow } from "@/components/ui/Attestation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "The Academy",
};

const subjects = [
  {
    title: "Foundations of Prophetic Medicine",
    provenance: "Essential · Free to the community",
    href: "/the-academy/foundations",
  },
  {
    title: "The Materia Medica",
    provenance: "Intermediate · Sourced modules",
    href: "/the-academy/materia-medica",
  },
  {
    title: "Clinical Practice & Ethics",
    provenance: "Advanced · Licensed study",
    href: "/the-academy/clinical-ethics",
  },
];

export default function AcademyPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <RunningHead section="The Academy" folio="i" />
          <ScrollReveal>
            <h1 className="type-display-l" style={{ margin: "0 0 var(--s4)" }}>
              The reading room
            </h1>
            <p className="type-lede measure" style={{ color: "var(--muted)", fontStyle: "italic", margin: "0 0 var(--s6)" }}>
              Held to the standard of scholarship — never the standard of the marketplace.
            </p>
            <p className="type-body-l measure" style={{ marginBottom: "var(--s6)" }}>
              The Academy transmits the tradition with patience and citation. Every
              text carries its grade and source; every course names its teacher and
              chain. The essentials are a right of the community.
            </p>
          </ScrollReveal>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <div className="measure-wide">
          <p className="type-eyebrow" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
            Subjects
          </p>
          {subjects.map((subject) => (
            <ListingRow key={subject.href} {...subject} />
          ))}
        </div>
      </Leaf>
    </>
  );
}
