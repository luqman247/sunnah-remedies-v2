import type { Metadata } from "next";
import { requirePractitionerPortal } from "@/lib/auth/portal-guard";

export const metadata: Metadata = {
  title: "Practitioner Portal",
  robots: { index: false, follow: false },
};

export default async function PractitionerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePractitionerPortal();
  return children;
}
