import type { Metadata } from "next";
import { requireStudentPortal } from "@/lib/auth/portal-guard";

export const metadata: Metadata = {
  title: "Digital Campus",
  robots: { index: false, follow: false },
};

export default async function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStudentPortal();
  return children;
}
