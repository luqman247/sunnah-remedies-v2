import type { FaqItem } from "../types";

export interface JourneyScholar {
  name: string;
  role: string;
  grounding: string;
  biography: string[];
}

export interface ItineraryDay {
  day: string;
  title: string;
  focus: string;
  activities: string[];
}

export interface GalleryItem {
  id: string;
  caption: string;
  alt: string;
}

export interface PolicyItem {
  title: string;
  body: string[];
}

export interface ReadingItem {
  title: string;
  note: string;
}

export interface EducationalSession {
  title: string;
  format: string;
  description: string;
}

export interface SacredJourney {
  slug: string;
  name: string;
  subtitle: string;
  folio: string;
  meaning: string[];

  season: string;
  duration: string;
  location: string;
  groupSize: string;
  fee: string;
  feeNote: string;
  nextDeparture: string;

  forWhom: string[];
  whatItAsks: string[];

  preparation: string[];
  flightGuidance: string[];
  accommodationPhilosophy: string[];
  learning: string[];
  educationalSessions: EducationalSession[];
  companionship: string[];
  guidance: string[];
  spiritualGrowth: string[];
  reflection: string[];
  reflectionJournals: string[];
  healthGuidance: string[];
  safety: string[];
  organisation: string[];

  itinerary: ItineraryDay[];
  scholars: JourneyScholar[];
  reading: ReadingItem[];
  packing: string[];

  faq: FaqItem[];
  gallery: GalleryItem[];
  policies: PolicyItem[];

  pathways: { label: string; href: string }[];
}
