import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { ListingRow } from "@/components/ui/Attestation";
import { getPractitionerResources } from "@/sanity/lib/practitioner-fetch";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Templates, patient resources, and treatment guides",
};

export default async function DownloadsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const resources = await getPractitionerResources(locale);

  return (
    <PractitionerSectionPage
      folio="iii"
      title="Downloads"
      lede="Templates, patient resources, and treatment guides — versioned and access-controlled"
      currentHref="/portal/practitioner/downloads"
      breadcrumbLabel="Downloads"
    >
      {resources.length === 0 ? (
        <p className="type-body">No downloads are published to the portal yet</p>
      ) : (
        resources.map((r) => (
          <article key={r._id} id={r.slug} className="policy-block">
            <ListingRow
              title={r.title}
              provenance={r.resourceType.replace(/-/g, " ")}
              href={r.downloadFile?.url ?? `#${r.slug}`}
              subtitle={r.description}
            />
            {r.reviewedByName && (
              <p className="type-micro" style={{ color: "var(--muted)", marginTop: "var(--s2)" }}>
                Reviewed by {r.reviewedByName}
                {r.version && ` · Version ${r.version}`}
              </p>
            )}
          </article>
        ))
      )}
    </PractitionerSectionPage>
  );
}
