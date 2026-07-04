import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/locales";
import { getConsultationsPage } from "@/sanity/lib/fetch";
import ConsultationsClient from "./ConsultationsClient";
import type { ConsultationsPageData } from "./ConsultationsClient";

export default async function ConsultationsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const cmsData = (await getConsultationsPage(locale)) as ConsultationsPageData | null;

  return <ConsultationsClient cmsData={cmsData} />;
}
