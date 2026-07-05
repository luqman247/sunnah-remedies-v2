import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";
import { requireStudentPortal } from "@/lib/auth/portal-guard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("portal.student.layout", "/portal/student");
}

export default async function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStudentPortal();
  return children;
}
