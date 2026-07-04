import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { Leaf } from "@/components/ui/Leaf";
import { PageIntro } from "@/components/ui/PageIntro";
import { MemberSignInFormWrapper } from "@/components/portal/MemberSignInForm";
import { MemberSessionProvider } from "@/components/portal/MemberSessionProvider";

export const metadata: Metadata = {
  title: "Member sign in",
  robots: { index: false, follow: false },
};

export default async function MemberSignInPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <MemberSessionProvider>
      <Leaf>
        <div className="measure-wide">
          <PageIntro
            section="Membership"
            folio="i"
            title="Sign in"
            lede="Access your portal, campus, and institutional membership"
          />
        </div>
      </Leaf>
      <Leaf variant="inset">
        <MemberSignInFormWrapper />
      </Leaf>
    </MemberSessionProvider>
  );
}
