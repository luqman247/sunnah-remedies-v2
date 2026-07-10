// ── Objects ──
import { seo } from "./objects/seo";
import { relationship } from "./objects/relationship";
import { institutionalImage, institutionalVideo, downloadFile } from "./objects/media";
import { editorialWorkflow } from "./objects/editorial-workflow";
import { propheticReference } from "./objects/prophetic-reference";
import { boardApproval } from "./objects/board-approval";
import { translationStatus } from "./objects/translation-status";
import { commerceReference } from "./objects/commerce-reference";
import { variantReference } from "./objects/variant-reference";
import { traditionLayers } from "./objects/tradition-layers";
import { sourceReference } from "./objects/source-reference";
import { productClinicalNote } from "./objects/product-clinical-note";
import { provenanceNote } from "./objects/provenance-note";
import { seasonWindow } from "./objects/season-window";
import { faqItem } from "./objects/faq-item";
import { productImage } from "./objects/product-image";
import { productVideo } from "./objects/product-video";
import { productVariant } from "./objects/product-variant";
import { cloudinaryRef } from "./objects/cloudinary-ref";
import {
  richContent,
  arabicText,
  quranReference,
  hadithReference,
  footnote,
  academicCitation,
  evidencePanel,
  clinicalNote,
  scholarNote,
  calloutBox,
  warningBlock,
  internalLink,
} from "./objects/rich-content";

// ── Documents: Global ──
import { institutionSettings } from "./documents/global/institution-settings";
import { navigation } from "./documents/global/navigation";
import { footerSettings } from "./documents/global/footer";
import { globalSeo } from "./documents/global/global-seo";
import { announcement } from "./documents/global/announcement";
import { testimonial } from "./documents/global/testimonial";
import { faq } from "./documents/global/faq";
import mediaAsset from "./documents/global/media-asset";
import videoAsset from "./documents/global/video-asset";
import audioAsset from "./documents/global/audio-asset";
import person from "./documents/global/person";
import departmentCard from "./documents/global/department-card";

// ── Documents: Apothecary ──
import { product } from "./documents/apothecary/product";
import { collection } from "./documents/apothecary/collection";
import { category } from "./documents/apothecary/category";
import { ingredient } from "./documents/apothecary/ingredient";
import { brand } from "./documents/apothecary/brand";
import { certification } from "./documents/apothecary/certification";

// ── Documents: Academy ──
import { programme } from "./documents/academy/programme";
import { faculty } from "./documents/academy/faculty";
import { campusCourse } from "./documents/academy/campus-course";
import { campusLesson } from "./documents/academy/campus-lesson";

// ── Documents: Sacred Journeys ──
import { journey } from "./documents/journeys/journey";

// ── Documents: Knowledge Library ──
import { article } from "./documents/knowledge/article";
import { author } from "./documents/knowledge/author";
import { topic } from "./documents/knowledge/topic";

// ── Documents: Clinical ──
import { consultationsPage } from "./documents/clinical/consultations-page";
import { clinicalProtocol } from "./documents/clinical/clinical-protocol";
import { practitionerResource } from "./documents/clinical/practitioner-resource";
import { researchPublication } from "./documents/clinical/research-publication";

// ── Documents: Institution ──
import { charter } from "./documents/institution/charter";

// ── Documents: Knowledge Graph (Phase 5 SEO) ──
import { condition, bodySystem } from "./documents/knowledge-entities";
import { hadith, quranReferenceDoc, researchPaper, scholar, citation } from "./documents/reference-entities";

// ── Documents: Operations (Phase 4) ──
import {
  batchRecord,
  operationalLog,
  decisionRecord,
  complianceEntry,
  auditFinding,
} from "./documents/operations";

// ── Documents: Pages ──
import { homepage } from "./documents/pages/homepage";

export const schemaTypes = [
  // Objects
  seo,
  relationship,
  institutionalImage,
  institutionalVideo,
  downloadFile,
  editorialWorkflow,
  propheticReference,
  boardApproval,
  translationStatus,
  commerceReference,
  variantReference,
  traditionLayers,
  sourceReference,
  productClinicalNote,
  provenanceNote,
  seasonWindow,
  faqItem,
  productImage,
  productVideo,
  productVariant,
  cloudinaryRef,
  richContent,
  arabicText,
  quranReference,
  hadithReference,
  footnote,
  academicCitation,
  evidencePanel,
  clinicalNote,
  scholarNote,
  calloutBox,
  warningBlock,
  internalLink,

  // Global
  institutionSettings,
  navigation,
  footerSettings,
  globalSeo,
  announcement,
  testimonial,
  faq,
  mediaAsset,
  videoAsset,
  audioAsset,
  person,
  departmentCard,

  // Apothecary
  product,
  collection,
  category,
  ingredient,
  brand,
  certification,

  // Academy
  programme,
  faculty,
  campusCourse,
  campusLesson,

  // Sacred Journeys
  journey,

  // Knowledge Library
  article,
  author,
  topic,

  // Clinical
  consultationsPage,
  clinicalProtocol,
  practitionerResource,
  researchPublication,

  // Institution
  charter,

  // Knowledge Graph (Phase 5 SEO)
  condition,
  bodySystem,
  hadith,
  quranReferenceDoc,
  researchPaper,
  scholar,
  citation,

  // Operations (Phase 4)
  batchRecord,
  operationalLog,
  decisionRecord,
  complianceEntry,
  auditFinding,

  // Pages
  homepage,
];
