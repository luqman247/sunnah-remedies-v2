import type { Metadata } from "next";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { GoLink, QuietLink } from "@/components/ui/Links";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";

export const metadata: Metadata = {
  title: "Foundations of Prophetic Medicine",
};

const faq = [
  {
    question: "Is this programme truly free?",
    answer:
      "The essential foundations are a right of the community. There is no fee, no account wall, and no upsell within the material. Optional donation is neither requested nor expected.",
  },
  {
    question: "Does completion qualify me for the Hijāma Programme?",
    answer:
      "Foundations with distinction satisfies one pathway toward Hijāma entry. Healthcare qualification is the other. Read the Hijāma entry requirements in full.",
  },
];

export default function FoundationsPage() {
  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <Breadcrumb
            items={[
              { label: "The Academy", href: "/the-academy" },
              { label: "Foundations of Prophetic Medicine" },
            ]}
          />
          <PageIntro
            section="The Academy"
            folio="iii"
            title="Foundations of Prophetic Medicine"
            lede="Terms, grades, and method — the essential introduction to Tibb al-Nabawī."
          >
            <p>
              A free, structured introduction offered as a right of the community. Eight
              modules covering terminology, the three grades of evidence, isnād discipline,
              and the editorial standard of the institution.
            </p>
          </PageIntro>
        </div>
      </Leaf>

      <Leaf variant="inset">
        <article className="measure" style={{ margin: "0 auto" }}>
          <SectionLabel>Modules</SectionLabel>
          {[
            "The definition of Tibb al-Nabawī",
            "Established, Reported, and Tried — the three grades",
            "How to read a Prophetic report on medicine",
            "The classical authors — Ibn al-Qayyim and others",
            "Means, not cure — the ethics of speech",
            "The Apothecary and the Academy — one institution",
            "When to refer to a physician",
            "The institution's editorial standard",
          ].map((mod, i) => (
            <div key={mod} className="ruled-row" style={{ pointerEvents: "none" }}>
              <span className="type-title">{mod}</span>
              <span className="type-micro ruled-row__provenance">Module {i + 1}</span>
            </div>
          ))}

          <p className="type-body" style={{ marginTop: "var(--s6)" }}>
            <GoLink href="/the-academy/foundations/enrol">Begin in the Academy</GoLink>
          </p>
        </article>
      </Leaf>

      <Leaf>
        <div className="measure" style={{ margin: "0 auto" }}>
          <FaqSection items={faq} />
        </div>
      </Leaf>
    </>
  );
}
