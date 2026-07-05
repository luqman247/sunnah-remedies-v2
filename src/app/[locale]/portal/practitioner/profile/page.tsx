import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { setRequestLocale } from "next-intl/server";
import { PractitionerSectionPage } from "@/components/portal/PractitionerSectionPage";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";
import { getPractitionerProfile } from "@/modules/practitioner/profile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.practitioner.profile", "/portal/practitioner/profile");
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await requirePractitionerPortal("/portal/practitioner/profile");
  const data = await getPractitionerProfile(session.accountId);

  if (!data) {
    return null;
  }

  const pp = data.practitionerProfile;

  return (
    <PractitionerSectionPage
      folio="ix"
      title="Professional profile"
      lede="Registration, scope of practice, and directory preferences"
      currentHref="/portal/practitioner/profile"
      breadcrumbLabel="Professional profile"
    >
      <dl className="specimen__dl">
        <div>
          <dt className="type-micro specimen__dt">Display name</dt>
          <dd className="type-body specimen__dd">{data.account.displayName}</dd>
        </div>
        <div>
          <dt className="type-micro specimen__dt">Email</dt>
          <dd className="type-body specimen__dd">{data.account.email}</dd>
        </div>
        {pp?.registrationBody && (
          <div>
            <dt className="type-micro specimen__dt">Registration body</dt>
            <dd className="type-body specimen__dd">{pp.registrationBody}</dd>
          </div>
        )}
        {pp?.registrationNumber && (
          <div>
            <dt className="type-micro specimen__dt">Registration number</dt>
            <dd className="type-body specimen__dd">{pp.registrationNumber}</dd>
          </div>
        )}
        {pp?.scopeOfPractice && (
          <div>
            <dt className="type-micro specimen__dt">Scope of practice</dt>
            <dd className="type-body specimen__dd">{pp.scopeOfPractice}</dd>
          </div>
        )}
        {pp?.specialisations && pp.specialisations.length > 0 && (
          <div>
            <dt className="type-micro specimen__dt">Specialisations</dt>
            <dd className="type-body specimen__dd">{pp.specialisations.join(", ")}</dd>
          </div>
        )}
      </dl>

      <p className="type-micro" style={{ color: "var(--muted)", marginTop: "var(--s5)" }}>
        Directory listing requires explicit consent and is managed separately — forthcoming in the alumni network
      </p>
    </PractitionerSectionPage>
  );
}
