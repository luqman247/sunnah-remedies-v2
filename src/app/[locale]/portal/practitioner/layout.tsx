import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.practitioner.layout", "/portal/practitioner");
}

export default async function PractitionerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePractitionerPortal();
  return children;
}
