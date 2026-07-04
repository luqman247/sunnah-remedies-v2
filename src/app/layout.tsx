import { getGlobalSeo, getInstitutionSettings } from "@/sanity/lib/fetch";
import type { Metadata } from "next";
import "./globals.css";
import "@/components/institutional/revelation.css";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, institution] = await Promise.all([getGlobalSeo(), getInstitutionSettings()]);

  const siteName = seo?.siteName || institution.name || "Sunnah Remedies";
  const description = seo?.siteDescription || "An institute of Prophetic Medicine for scholarship, clinical care, and natural therapeutics under one house.";

  return {
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    description,
    keywords: seo?.keywords,
    openGraph: {
      siteName,
      description,
      type: "website",
      images: seo?.defaultOgImage?.asset?.url ? [{ url: seo.defaultOgImage.asset.url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      site: seo?.twitterHandle,
    },
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: "/brand/icon-app-rounded-180.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
