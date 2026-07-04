import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Access not granted",
  robots: { index: false, follow: false },
};

export default async function AccessDeniedPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Membership"
            folio="—"
            title="Access not granted"
            lede="This area requires a role or membership tier your account does not currently hold"
          >
            <p>
              If you believe this is an error, write to{" "}
              <Link href="/correspondence" className="quiet-link">
                Correspondence
              </Link>
            </p>
          </PageIntro>
        </div>
      </Leaf>
    </>
  );
}
