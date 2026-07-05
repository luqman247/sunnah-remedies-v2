import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { ListingRow } from "@/components/ui/Attestation";
import { getPractitionerResources } from "@/sanity/lib/practitioner-fetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.practitioner.downloads", "/portal/practitioner/downloads");
}

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
