import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { ListingRow } from "@/components/ui/Attestation";
import { getClinicalProtocols } from "@/sanity/lib/practitioner-fetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.practitioner.protocols", "/portal/practitioner/protocols");
}

function formatCategory(category?: string) {
  if (!category) return "Clinical";
  return category.replace(/-/g, " ");
}

export default async function ProtocolsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const protocols = await getClinicalProtocols(locale);

  return (
    <PractitionerSectionPage
      folio="ii"
      title="Clinical protocols"
      lede="Institutional guidance — reviewed by faculty, versioned, and authoritative"
      currentHref="/portal/practitioner/protocols"
      breadcrumbLabel="Clinical protocols"
      intro={
        <p>
          These protocols reference Phase 4 clinical governance. Peer discussion
          elsewhere is not a substitute for this guidance
        </p>
      }
    >
      <p className="type-body" style={{ marginBottom: "var(--s5)" }}>
        Each protocol carries source integrity and a faculty review stamp. Hijama
        practitioners should consult the wet-cupping scope of practice before treatment
      </p>

      {protocols.map((p) => (
        <ListingRow
          key={p._id}
          title={p.title}
          provenance={p.reviewedByName ?? "Faculty reviewed"}
          href={`/portal/practitioner/protocols/${p.slug}`}
          subtitle={[formatCategory(p.category), p.version ? `v${p.version}` : null]
            .filter(Boolean)
            .join(" · ")}
        />
      ))}
    </PractitionerSectionPage>
  );
}
