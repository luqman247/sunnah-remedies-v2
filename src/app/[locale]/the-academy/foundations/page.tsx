import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro, SectionLabel } from "@/components/ui/PageIntro";
import { GoLink, QuietLink } from "@/components/ui/Links";
import { FaqSection } from "@/components/apothecary/MonographExtras";
import { Breadcrumb } from "@/components/apothecary/Breadcrumb";
import { getProgrammeBySlug } from "@/sanity/lib/fetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theAcademy.foundations", "/the-academy/foundations");
}

const staticFaq = [
  {
    question: "Is this programme truly free?",
    answer:
      "The essential foundations are offered as a right of the community. There is no fee, no account wall, and no marketing path within the material. Optional donation is neither requested nor expected.",
  },
  {
    question: "Does completion qualify me for the Hijāma Programme?",
    answer:
      "Foundations with distinction satisfies one pathway toward Hijāma entry. Healthcare qualification is the other. Read the Hijāma entry requirements in full.",
  },
];

export default async function FoundationsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const programme = await getProgrammeBySlug("foundations", locale);
  const faq =
    programme?.faq?.length
      ? programme.faq.map((f) => ({ question: f.question, answer: f.answer }))
      : staticFaq;
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
            lede="Terms, grades, and method: an essential introduction to Tibb al-Nabawī"
          >
            <p>
              A free, structured introduction offered as a right of the
              community. Eight modules cover terminology, the three grades of
              evidence, isnād discipline, and the institution&apos;s editorial
              standard
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
            <GoLink href="/the-academy/foundations/enrol">Enrol in Foundations</GoLink>
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
