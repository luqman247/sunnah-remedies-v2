import { CounterProvider } from "@/context/CounterContext";
import { MastheadServer } from "@/components/chrome/MastheadServer";
import { FooterServer } from "@/components/chrome/FooterServer";
import {
  Cormorant_Garamond,
  EB_Garamond,
  Inter,
  Amiri,
  Fraunces,
  Newsreader,
  IBM_Plex_Mono,
} from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "@/components/institutional/revelation.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

const inter = Inter({
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

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-display-v2",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-body-v2",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sunnah Remedies",
    template: "%s · Sunnah Remedies",
  },
  description:
    "An institute of Prophetic Medicine for scholarship, clinical care, and natural therapeutics under one house.",
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/brand/icon-app-rounded-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${ebGaramond.variable} ${inter.variable} ${amiri.variable} ${fraunces.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body>
        <CounterProvider>
          <MastheadServer />
          <main>{children}</main>
          <FooterServer />
        </CounterProvider>
      </body>
    </html>
  );
}
