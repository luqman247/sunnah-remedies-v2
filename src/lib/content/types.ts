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
  department: "Academy" | "Sacred Journeys" | "Knowledge Library";
}

export interface RemedyProvenance {
  origin: string[];
  cultivation: string[];
  harvesting: string[];
}

export interface RemedyEvidence {
  established: string[];
  emerging: string[];
}

export interface Remedy {
  slug: string;
  name: string;
  transliteration: string;
  botanicalName: string;
  /** Short catalogue line */
  nature: string;
  /** Museum-label summary — institutional voice */
  institutionalSummary: string;
  folio: string;
  figure: "black-seed" | "honey" | "senna" | "olive";
  figureAlt: string;

  historicalContext: string[];
  propheticReferences: PropheticReference[];
  traditionalScholarship: string[];
  traditionalUsage: string[];
  evidence: RemedyEvidence;

  provenance: RemedyProvenance;
  laboratoryVerification: string[];
  qualityAssurance: string[];
  storage: string[];
  preparation: string[];
  suggestedUse: string[];
  contraindications: string[];

  photographyDirection: string[];
  packaging: string[];
  shipping: string[];
  returns: string[];
  customerSupport: string[];

  faq: FaqItem[];
  relatedRemedies: string[];
  academyLessons: ReadingItem[];
  knowledgeLibrary: ReadingItem[];
  pathways: PathwayLink[];

  volume: string;
  price: number;
  salePrice?: number;
  currency?: "GBP" | "DKK";
  priceNote: string;
  inStock: boolean;

  /** CMS-resolved primary / editorial image for public pages */
  imageSrc?: string | null;
  imageAlt?: string;
  videoUrl?: string | null;
  featured?: boolean;
  featuredPriority?: number;
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
