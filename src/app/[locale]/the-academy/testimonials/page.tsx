import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { AcademySectionPage } from "@/components/academy/AcademySectionPage";
import { getHijamaDiploma } from "@/lib/content/academy";
import { getProgrammeBySlug, getTestimonials } from "@/sanity/lib/fetch";
import { programmeToAcademyProgramme } from "@/sanity/lib/adapters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theAcademy.testimonials", "/the-academy/testimonials");
}

export default async function TestimonialsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [programme, sanityTestimonials] = await Promise.all([
    getProgrammeBySlug("hijama-diploma", locale),
    getTestimonials("academy", locale),
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
