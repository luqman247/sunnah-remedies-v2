/**
 * Central Brand Configuration — Sunnah Remedies
 *
 * Every logo reference in the application imports from this file.
 * To change branding, replace assets in Logo/ and public/brand/ —
 * never edit paths or code to alter the visual identity.
 */

/* ── Asset catalogue ───────────────────────────────────────────── */

export const brand = {
  /* Emblem / Icon — standalone mark without wordmark */
  icon: {
    primary: "/brand/icon-primary.svg",
    emerald: "/brand/icon-emerald.svg",
    emeraldGold: "/brand/icon-emerald-gold.svg",
    ivoryReversed: "/brand/icon-ivory-reversed.svg",
    monoBlack: "/brand/icon-mono-black.svg",
    monoWhite: "/brand/icon-mono-white.svg",
    appRounded: "/brand/icon-app-rounded.svg",
  },

  /* Lockup — emblem + wordmark together */
  lockup: {
    horizontalPrimary: "/brand/lockup-horizontal-primary.svg",
    horizontalDescriptor: "/brand/lockup-horizontal-descriptor.svg",
    horizontalReversed: "/brand/lockup-horizontal-reversed.svg",
    stackedPrimary: "/brand/lockup-stacked-primary.svg",
    stackedDescriptor: "/brand/lockup-stacked-descriptor.svg",
    stackedReversed: "/brand/lockup-stacked-reversed.svg",
  },

  /* Wordmark — name only, no emblem */
  wordmark: {
    black: "/brand/wordmark-black.svg",
    emerald: "/brand/wordmark-emerald.svg",
    ivory: "/brand/wordmark-ivory.svg",
  },

  /* Favicon & meta */
  favicon: {
    svg: "/brand/favicon.svg",
    png16: "/brand/favicon-16.png",
    png32: "/brand/favicon-32.png",
    png48: "/brand/favicon-48.png",
  },

  /* App icon — rounded for PWA, manifest, Apple Touch */
  appIcon: {
    png180: "/brand/icon-app-rounded-180.png",
    png512: "/brand/icon-app-rounded-512.png",
    png1024: "/brand/icon-app-rounded-1024.png",
  },

  /* OpenGraph / social sharing — raster for platform compatibility */
  og: {
    horizontal: "/brand/lockup-horizontal-primary@1024.png",
    stacked: "/brand/lockup-stacked-primary@1024.png",
  },
} as const;

/* ── Context map ───────────────────────────────────────────────── */

export const brandContext = {
  navigation: brand.lockup.horizontalPrimary,
  footer: brand.lockup.stackedReversed,
  homepageHero: brand.lockup.stackedReversed,
  academy: brand.icon.primary,
  apothecary: brand.icon.primary,
  sacredJourneys: brand.icon.primary,
  knowledgeLibrary: brand.icon.primary,
  login: brand.lockup.stackedPrimary,
  email: brand.lockup.horizontalPrimary,
  openGraph: brand.og.horizontal,
  socialSharing: brand.appIcon.png512,
  manifest: brand.appIcon.png512,
  appleTouchIcon: brand.appIcon.png180,
  favicon: brand.favicon.svg,
  pwa: brand.appIcon.png512,
} as const;

/* ── Brand colours (from guidelines) ───────────────────────────── */

export { brandColors } from "@/config/theme";

/* ── Alt text ──────────────────────────────────────────────────── */

export const brandAlt = "Sunnah Remedies — Institute of Prophetic Medicine";
