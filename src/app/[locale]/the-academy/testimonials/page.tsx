import type { Metadata } from "next";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug, getTestimonials } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export const metadata: Metadata = {
  title: "Graduate attestations",
  description: "Graduate attestations published with consent.",
};

export default async function TestimonialsPage() {
  const [programme, sanityTestimonials] = await Promise.all([
    getProgrammeBySlug("hijama-diploma"),
    getTestimonials("academy"),
  ]);

  const testimonials = sanityTestimonials.length > 0
    ? sanityTestimonials.map((t) => ({
        name: t.name,
        statement: t.statement,
        context: t.context || "",
        year: t.year || "",
      }))
    : (programme ? programmeToAcademyProgramme(programme) : getHijamaDiploma()).testimonials;

  return (
    <AcademySectionPage
      folio="xii"
      title="Graduate attestations"
      lede="Published with consent, using initials unless otherwise requested"
      currentHref="/the-academy/testimonials"
      breadcrumbLabel="Graduate attestations"
    >
      {testimonials.map((t) => (
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
