import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import "@/components/booking/booking.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("consultations", "/consultations");
}

export default function ConsultationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
