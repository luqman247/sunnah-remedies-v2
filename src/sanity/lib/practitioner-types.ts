/**
 * Phase 9 — Practitioner Portal Sanity Types
 */

export interface ClinicalProtocolSummary {
  _id: string;
  title: string;
  slug: string;
  version?: string;
  category?: string;
  summary?: string;
  reviewedAt?: string;
  reviewedByName?: string;
}

export interface ClinicalProtocolDetail extends ClinicalProtocolSummary {
  body?: unknown[];
  sourceReferences?: unknown[];
  downloadFile?: {
    fileName?: string;
    url?: string;
  };
}

export interface PractitionerResource {
  _id: string;
  title: string;
  slug: string;
  resourceType: string;
  description?: string;
  version?: string;
  reviewedAt?: string;
  reviewedByName?: string;
  downloadFile?: {
    fileName?: string;
    url?: string;
  };
}

export interface ResearchPublication {
  _id: string;
  title: string;
  slug: string;
  authors?: string[];
  abstract?: string;
  publishedAt?: string;
  journal?: string;
  externalUrl?: string;
  downloadFile?: {
    fileName?: string;
    url?: string;
  };
}

export interface PractitionerAnnouncement {
  _id: string;
  message: string;
  link?: { label?: string; href?: string };
  startDate?: string;
  endDate?: string;
}
