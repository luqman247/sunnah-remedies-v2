export type Grade = "Established" | "Reported" | "Tried";

export type PropheticAttribution = "revelation" | "hadith" | "classical";

export interface PropheticReference {
  statement: string;
  transliteration?: string;
  grade: Grade;
  source: string;
  standing: string;
  siglum: string;
  attribution: PropheticAttribution;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ReadingItem {
  title: string;
  href: string;
  note: string;
}

export interface PathwayLink {
  label: string;
  href: string;
  department: "Academy" | "Sacred Journeys";
}

export interface Remedy {
  slug: string;
  name: string;
  transliteration: string;
  botanicalName: string;
  nature: string;
  folio: string;
  figure: "black-seed" | "honey" | "senna" | "olive";
  figureAlt: string;

  historicalContext: string[];
  propheticReferences: PropheticReference[];
  traditionalUsage: string[];
  evidenceInformed: string[];
  sourcing: string[];
  qualityAssurance: string[];
  storage: string[];
  preparation: string[];
  honestLimits: string[];
  faq: FaqItem[];

  relatedRemedies: string[];
  suggestedReading: ReadingItem[];
  pathways: PathwayLink[];

  volume: string;
  price: number;
  priceNote: string;
  inStock: boolean;
}

export interface CounterItem {
  slug: string;
  quantity: number;
}

export interface AcquisitionDetails {
  name: string;
  email: string;
  address: string;
  city: string;
  postcode: string;
  notes: string;
}
