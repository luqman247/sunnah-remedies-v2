import { getConsultationsPage } from "@/sanity/lib/fetch";
import ConsultationsClient from "./ConsultationsClient";
import type { ConsultationsPageData } from "./ConsultationsClient";

export default async function ConsultationsPage() {
  const cmsData = (await getConsultationsPage()) as ConsultationsPageData | null;

  return <ConsultationsClient cmsData={cmsData} />;
}
