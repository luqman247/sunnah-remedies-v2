import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { Link } from "@/i18n/navigation";
import { getPractitionerAnnouncements } from "@/sanity/lib/practitioner-fetch";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.practitioner.updates", "/portal/practitioner/updates");
}

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const announcements = await getPractitionerAnnouncements();

  return (
    <PractitionerSectionPage
      folio="v"
      title="Practice updates"
      lede="Clinical announcements and faculty notices — practitioner access only"
      currentHref="/portal/practitioner/updates"
      breadcrumbLabel="Practice updates"
    >
      {announcements.length === 0 ? (
        <p className="type-body">No active announcements at this time</p>
      ) : (
        announcements.map((a) => (
          <article key={a._id} className="policy-block">
            <p className="type-body">{a.message}</p>
            {a.link?.href && (
              <Link href={a.link.href} className="go-link">
                {a.link.label ?? "Read more"}
                <span aria-hidden="true">→</span>
              </Link>
            )}
          </article>
        ))
      )}
    </PractitionerSectionPage>
  );
}
