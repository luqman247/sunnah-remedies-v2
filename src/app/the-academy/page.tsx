import type { Metadata } from "next";
import { DepartmentHub } from "@/components/ui/SectionPage";
import { Leaf } from "@/components/ui/Leaf";
import { GoLink } from "@/components/ui/Links";
import { SectionLabel } from "@/components/ui/PageIntro";
import { academy } from "@/lib/navigation/site-structure";
import { getHijamaDiploma } from "@/lib/content/academy";

const diploma = getHijamaDiploma();

export const metadata: Metadata = {
  title: "The Academy",
  description:
    "In-person education in Prophetic Medicine and the Hijāma Diploma, delivered with citation and supervision.",
};

export default function AcademyPage() {
  return (
    <>
      <DepartmentHub
        department={academy}
        folio="i"
        title="The reading room"
        lede="In-person education with citation, supervision, and clear standards."
        intro={
          <p>
            The Academy transmits Tibb al-Nabawī through close reading,
            citation, and supervised practice. The Hijāma Diploma is the
            flagship professional programme: twelve weeks, forty supervised
            sessions, and published assessment standards.
          </p>
        }
        grave="Held to the standard of scholarship and clinical responsibility."
      />

      <Leaf variant="inset">
        <div className="measure-wide programme-feature">
          <SectionLabel>Flagship programme</SectionLabel>
          <p className="type-micro programme-feature__tier">{diploma.tier}</p>
          <h2 className="type-display-l programme-feature__title">{diploma.name}</h2>
          <p className="type-body-l programme-feature__desc">{diploma.subtitle}</p>
          <p className="type-small" style={{ color: "var(--muted)", marginBottom: "var(--s4)" }}>
            {diploma.fee} · {diploma.nextCohort}
          </p>
          <GoLink href="/the-academy/hijama-diploma">Read the full programme</GoLink>
        </div>
      </Leaf>
    </>
  );
}
