import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";

const p = getHijamaDiploma();

export const metadata: Metadata = {
  title: "Graduate attestations",
  description: "Graduate attestations published with consent.",
};

export default function TestimonialsPage() {
  return (
    <AcademySectionPage
      folio="xii"
      title="Graduate attestations"
      lede="Published with consent, using initials unless otherwise requested."
      currentHref="/the-academy/testimonials"
      breadcrumbLabel="Graduate attestations"
    >
      {p.testimonials.map((t) => (
        <blockquote key={t.name + t.year} className="testimonial">
          <p className="type-body-l testimonial__statement">&ldquo;{t.statement}&rdquo;</p>
          <footer className="type-small testimonial__footer">
            {t.name} · {t.context} · {t.year}
          </footer>
        </blockquote>
      ))}
    </AcademySectionPage>
  );
}
