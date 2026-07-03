import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  EB_Garamond,
  Inter,
  Amiri,
} from "next/font/google";
import { Masthead } from "@/components/chrome/Masthead";
import { Footer } from "@/components/chrome/Footer";
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
    "An institution for the revival of Prophetic Medicine — scholarship, clinical excellence, and carefully curated natural therapeutics.",
  icons: {
    icon: "/brand/favicon.png",
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
        <Masthead />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
