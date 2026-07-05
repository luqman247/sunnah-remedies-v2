import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/locales";
import { pageMetadata } from "@/lib/i18n/page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  return pageMetadata("theApothecary.counter", "/the-apothecary/counter");
}

export default function CounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
