import { CounterProvider } from "@/context/CounterContext";
import { Masthead } from "@/components/chrome/Masthead";
import { PreFooter, Footer } from "@/components/chrome/Footer";
import {
  Cormorant_Garamond,
  EB_Garamond,
  Inter,
  Amiri,
} from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";

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
      className={`${cormorant.variable} ${ebGaramond.variable} ${inter.variable} ${amiri.variable}`}
    >
      <body>
        <CounterProvider>
          <Masthead />
          <main>{children}</main>
          <PreFooter />
          <Footer />
        </CounterProvider>
      </body>
    </html>
  );
}
