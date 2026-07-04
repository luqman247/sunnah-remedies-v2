import { getLocale } from "next-intl/server";
import { getFooter } from "@/sanity/lib/fetch";
import { getTranslations } from "next-intl/server";
import { PreFooter, Footer } from "./Footer";
import { SeasonalMark } from "@/components/institutional/SeasonalMark";

export async function FooterServer() {
  const locale = await getLocale();
  const [footer, t] = await Promise.all([
    getFooter(locale),
    getTranslations("footer"),
  ]);

  return (
    <>
      <PreFooter
        action={footer.preFooterAction || { label: t("requestConsultation"), href: "/consultations" }}
      />
      <Footer
        columns={footer.columns}
        closingStatement={footer.closingStatement || t("closing")}
        colophon={footer.colophon || t("colophon")}
        tagline={t("tagline")}
        foundingStatement={t("foundingStatement")}
      />
      <SeasonalMark />
    </>
  );
}
