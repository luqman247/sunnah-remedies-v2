import { fontVariables } from "@/app/fonts";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { localeById } from "@/i18n/locales";
import { CounterProvider } from "@/context/CounterContext";
import { MastheadServer } from "@/components/chrome/MastheadServer";
import { FooterServer } from "@/components/chrome/FooterServer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SeasonalGreeting } from "@/components/institutional/SeasonalGreeting";
import { getCurrentSeason } from "@/lib/calendar/seasons";
import { composeGraph, organizationNode, websiteNode } from "@/lib/seo/schema";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AnalyticsProvider } from "../../../analytics/lib/provider";
import { ConsentBanner } from "../../../analytics/lib/consent-banner";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const cfg = localeById(locale);
  const { season } = getCurrentSeason();
  const { draftMode } = await import("next/headers");
  const isDraft = (await draftMode()).isEnabled;
  const tDraft = isDraft ? await getTranslations({ locale, namespace: "draft" }) : null;

  return (
    <html
      lang={cfg.htmlLang}
      dir={cfg.dir}
      className={fontVariables}
      data-season={season !== "standard" ? season : undefined}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: composeGraph(organizationNode(), websiteNode()),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {isDraft && tDraft && (
          <div style={{ background: "#1a1a2e", color: "#e8d5b7", padding: "8px 16px", fontSize: "12px", fontFamily: "monospace", textAlign: "center" }}>
            {tDraft("active")} &mdash;{" "}
            <a href="/api/draft/disable" style={{ color: "#c9a961", textDecoration: "underline" }}>
              {tDraft("exit")}
            </a>
          </div>
        )}
        <NextIntlClientProvider>
          <CounterProvider>
            <AnalyticsProvider />
            <MastheadServer />
            <Breadcrumb />
            <SeasonalGreeting />
            <main>{children}</main>
            <FooterServer />
            <ConsentBanner />
            <Analytics />
            <SpeedInsights />
          </CounterProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
