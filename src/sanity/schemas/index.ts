// ── Objects ──
import { seo } from "./objects/seo";
import { institutionalImage, institutionalVideo, downloadFile } from "./objects/media";
import { editorialWorkflow } from "./objects/editorial-workflow";
import { propheticReference } from "./objects/prophetic-reference";
import { boardApproval } from "./objects/board-approval";
import { translationStatus } from "./objects/translation-status";
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

// ── Documents: Academy ──
import { programme } from "./documents/academy/programme";
import { faculty } from "./documents/academy/faculty";

// ── Documents: Sacred Journeys ──
import { journey } from "./documents/journeys/journey";

// ── Documents: Knowledge Library ──
import { article } from "./documents/knowledge/article";
import { author } from "./documents/knowledge/author";
import { topic } from "./documents/knowledge/topic";

// ── Documents: Clinical ──
import { consultationsPage } from "./documents/clinical/consultations-page";

// ── Documents: Institution ──
import { charter } from "./documents/institution/charter";

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
  institutionalImage,
  institutionalVideo,
  downloadFile,
  editorialWorkflow,
  propheticReference,
  boardApproval,
  translationStatus,
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

  // Academy
  programme,
  faculty,

  // Sacred Journeys
  journey,

  // Knowledge Library
  article,
  author,
  topic,

  // Clinical
  consultationsPage,

  // Institution
  charter,

  // Operations (Phase 4)
  batchRecord,
  operationalLog,
  decisionRecord,
  complianceEntry,
  auditFinding,

  // Pages
  homepage,
];
