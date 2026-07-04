import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { PortableBody } from "@/components/editorial/PortableBody";
import { getClinicalProtocolBySlug } from "@/sanity/lib/practitioner-fetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const protocol = await getClinicalProtocolBySlug(slug, locale);
  return { title: protocol?.title ?? "Protocol" };
}

export default async function ProtocolDetailPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const protocol = await getClinicalProtocolBySlug(slug, locale);
  if (!protocol) notFound();

  return (
    <PractitionerSectionPage
      folio="ii"
      title={protocol.title}
      lede={protocol.summary}
      currentHref="/portal/practitioner/protocols"
      breadcrumbLabel={protocol.title}
      intro={
        protocol.reviewedByName && (
          <p className="type-micro" style={{ color: "var(--muted)" }}>
            Last reviewed by {protocol.reviewedByName}
            {protocol.reviewedAt &&
              ` · ${new Date(protocol.reviewedAt).toLocaleDateString(locale)}`}
            {protocol.version && ` · Version ${protocol.version}`}
          </p>
        )
      }
    >
      {protocol.body && Array.isArray(protocol.body) ? (
        <PortableBody value={protocol.body} />
      ) : (
        protocol.summary && <p className="type-body">{protocol.summary}</p>
      )}

      {protocol.downloadFile?.url && (
        <p className="type-body" style={{ marginTop: "var(--s5)" }}>
          <a href={protocol.downloadFile.url} className="quiet-link">
            Download PDF
            {protocol.downloadFile.fileName
              ? ` (${protocol.downloadFile.fileName})`
              : ""}
          </a>
        </p>
      )}

      <aside className="specimen" aria-label="Duty of care notice" style={{ marginTop: "var(--s6)" }}>
        <span className="specimen__tab">Duty of care</span>
        <p className="type-body">
          This protocol is institutional guidance. It does not replace your professional
          judgement, registration obligations, or duty to refer when limits of practice apply
        </p>
      </aside>
    </PractitionerSectionPage>
  );
}
