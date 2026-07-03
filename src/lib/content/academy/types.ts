import type { FaqItem } from "../types";

export interface FacultyMember {
  name: string;
  title: string;
  licence: string;
  chain: string;
  biography: string[];
}

export interface CurriculumModule {
  number: string;
  title: string;
  hours: number;
  description: string;
  sources: string[];
  practical?: string;
}

export interface LearningOutcome {
  outcome: string;
  assessed: boolean;
}

export interface Testimonial {
  statement: string;
  name: string;
  context: string;
  year: string;
}

export interface Facility {
  name: string;
  description: string;
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

export interface PracticalSession {
  title: string;
  schedule: string;
  hours: number;
  description: string;
  supervision: string;
}

export interface EquipmentItem {
  item: string;
  specification: string;
  supplied: "Academy" | "Student" | "Shared";
}

export interface EnrolmentStep {
  step: string;
  title: string;
  description: string;
  duration?: string;
}

export interface GraduatePathway {
  title: string;
  body: string[];
  href?: string;
}

export interface AcademyProgramme {
  slug: string;
  name: string;
  subtitle: string;
  folio: string;
  tier: "Essential" | "Professional" | "Advanced" | "Licensed";
  duration: string;
  format: string;
  fee: string;
  feeNote: string;
  nextCohort: string;

  whatItIs: string[];
  forWhom: string[];
  whatItAsks: string[];

  learningOutcomes: LearningOutcome[];
  curriculum: CurriculumModule[];
  faculty: FacultyMember[];

  certification: string[];
  entryRequirements: string[];
  assessment: string[];
  clinicalPractice: string[];
  clinicalStandards: PolicyItem[];

  courseHandbook: PolicyItem[];
  studentGuide: PolicyItem[];
  practicalSessions: PracticalSession[];
  equipmentList: EquipmentItem[];
  graduatePathways: GraduatePathway[];
  enrolmentJourney: EnrolmentStep[];

  faq: FaqItem[];
  testimonials: Testimonial[];
  facilities: Facility[];
  gallery: GalleryItem[];
  policies: PolicyItem[];

  pathways: { label: string; href: string }[];
}
