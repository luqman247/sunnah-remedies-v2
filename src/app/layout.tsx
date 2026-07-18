import { getGlobalSeo, getInstitutionSettings } from "@/sanity/lib/fetch";
import type { Metadata } from "next";
import { seoConfig } from "@/lib/seo/config";
import "./globals.css";
import "@/components/institutional/revelation.css";

export async function generateMetadata(): Promise<Metadata> {
  const [seo, institution] = await Promise.all([getGlobalSeo(), getInstitutionSettings()]);

  const siteName = seo?.siteName || institution.name || seoConfig.siteName;
  const description = seo?.siteDescription || seoConfig.defaultDescription;

  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: {
      default: seoConfig.defaultTitle,
      template: `%s · ${siteName}`,
    },
    description,
    keywords: seo?.keywords,
    openGraph: {
      siteName,
      locale: seoConfig.locale,
      type: "website",
      title: seoConfig.homeOgTitle,
      description: seoConfig.homeOgDescription,
      url: seoConfig.siteUrl,
      // Images come from app/opengraph-image.tsx unless a page sets a custom image.
      // Do not inject Sanity defaultOgImage here — it previously resolved to the
      // square logo and conflicted with the file-based institutional preview.
    },
    twitter: {
      card: "summary_large_image",
      site: seo?.twitterHandle || seoConfig.twitterHandle,
      title: seoConfig.homeOgTitle,
      description: seoConfig.homeOgDescription,
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
