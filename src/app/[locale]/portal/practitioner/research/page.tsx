import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { ListingRow } from "@/components/ui/Attestation";
import { getResearchPublications } from "@/sanity/lib/practitioner-fetch";

export const metadata: Metadata = {
  title: "Research library",
  description: "Publications and institutional research briefings",
};

export default async function ResearchPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const publications = await getResearchPublications(locale);

  return (
    <PractitionerSectionPage
      folio="iv"
      title="Research library"
      lede="Evidence-informed publications selected for practitioner continuing development"
      currentHref="/portal/practitioner/research"
      breadcrumbLabel="Research library"
    >
      {publications.length === 0 ? (
        <p className="type-body">No research publications are available yet</p>
      ) : (
        publications.map((pub) => (
          <article key={pub._id} className="policy-block">
            <ListingRow
              title={pub.title}
              provenance={pub.journal ?? "Research"}
              href={pub.externalUrl ?? pub.downloadFile?.url ?? "#"}
              subtitle={
                pub.authors?.length
                  ? pub.authors.join(", ")
                  : pub.abstract?.slice(0, 120)
              }
            />
            {pub.publishedAt && (
              <p className="type-micro" style={{ color: "var(--muted)", marginTop: "var(--s2)" }}>
                {new Date(pub.publishedAt).toLocaleDateString(locale)}
              </p>
            )}
          </article>
        ))
      )}
    </PractitionerSectionPage>
  );
}
