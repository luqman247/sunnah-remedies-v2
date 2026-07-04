import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { JourneySectionPage } from "@/components/journeys/JourneySectionPage";
import { SectionLabel } from "@/components/ui/PageIntro";
import { GoLink } from "@/components/ui/Links";
import { getJourneyBySlug } from "@/sanity/lib/fetch";
import { journeyInstitution } from "@/lib/content/journeys";

export const metadata: Metadata = {
  title: "Reading list",
  description: "Assigned texts to be completed before departure.",
};

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getJourneyBySlug("umrah", locale);
  const readingList = journeyInstitution.readingList;
  return (
    <JourneySectionPage
      folio="v"
      title="Reading list"
      lede="Texts are assigned at registration and completed before departure"
      currentHref="/sacred-journeys/reading"
      breadcrumbLabel="Reading list"
      intro={
        <p>
          Reading precedes travel. Journey-specific modules are issued after
          placement confirmation. Required texts are compulsory
        </p>
      }
    >
      <SectionLabel>Institutional reading list</SectionLabel>
      <ul className="reading-list">
        {readingList.map((item) => (
          <li key={item.href} className="reading-list__item">
            <p className="type-body" style={{ margin: 0 }}>
              <GoLink href={item.href}>{item.title}</GoLink>
              {item.required && (
                <span className="type-micro" style={{ marginLeft: "var(--s2)" }}>
                  Required reading
                </span>
              )}
            </p>
            <p className="type-small reading-list__note">{item.note}</p>
          </li>
        ))}
      </ul>
    </JourneySectionPage>
  );
}
