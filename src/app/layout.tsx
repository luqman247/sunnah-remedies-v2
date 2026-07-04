import { CounterProvider } from "@/context/CounterContext";
import { MastheadServer } from "@/components/chrome/MastheadServer";
import { FooterServer } from "@/components/chrome/FooterServer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SeasonalGreeting } from "@/components/institutional/SeasonalGreeting";
import { getCurrentSeason } from "@/lib/calendar/seasons";
import { getGlobalSeo, getInstitutionSettings } from "@/sanity/lib/fetch";
import {
  Amiri,
  Fraunces,
  Newsreader,
  IBM_Plex_Mono,
} from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "@/components/institutional/revelation.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-display",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-utility",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-arabic",
  display: "swap",
});

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { season } = getCurrentSeason();
  const { draftMode } = await import("next/headers");
  const isDraft = (await draftMode()).isEnabled;

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable} ${amiri.variable}`}
      data-season={season !== "standard" ? season : undefined}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {isDraft && (
          <div style={{ background: "#1a1a2e", color: "#e8d5b7", padding: "8px 16px", fontSize: "12px", fontFamily: "monospace", textAlign: "center" }}>
            Draft Preview Active — <a href="/api/draft/disable" style={{ color: "#c9a961", textDecoration: "underline" }}>Exit preview</a>
          </div>
        )}
        <CounterProvider>
          <MastheadServer />
          <Breadcrumb />
          <SeasonalGreeting />
          <main>{children}</main>
          <FooterServer />
        </CounterProvider>
      </body>
    </html>
  );
}
