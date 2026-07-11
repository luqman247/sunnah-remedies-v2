import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { presentationTool } from "sanity/presentation";
import { documentInternationalization } from "@sanity/document-internationalization";
import { languageFilter } from "@sanity/language-filter";
import { schemaTypes } from "./src/sanity/schemas";
import { structure } from "./src/sanity/structure";
import { OperationsOverview } from "./src/sanity/tools/operations-overview";
import { ApothecaryOverview } from "./src/sanity/tools/apothecary-overview";
import { MediaLibraryOverview } from "./src/sanity/tools/media-library-overview";
import {
  resolveProductActions,
  resolveProductBadges,
  resolveProductProductionUrl,
  resolveProductTemplates,
} from "./src/sanity/lib/product-studio";
import { resolveMediaActions } from "./src/sanity/actions/mediaActions";
import { getSanityDataset, getSanityProjectId } from "./src/sanity/env";
import { productPresentationLocations } from "./src/sanity/lib/presentation";

const projectId = getSanityProjectId();
const dataset = getSanityDataset();

const previewOrigin = (
  process.env.SANITY_STUDIO_SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const studioPreviewSecret =
  process.env.SANITY_STUDIO_PREVIEW_SECRET || process.env.SANITY_PREVIEW_SECRET || "";

const draftModeEnablePath = studioPreviewSecret
  ? `/api/draft?secret=${encodeURIComponent(studioPreviewSecret)}`
  : "/api/draft";

const SUPPORTED_LANGUAGES = [
  { id: "en", title: "English" },
  { id: "da", title: "Dansk" },
];

const TRANSLATABLE_TYPES = [
  "homepage",
  "article",
  "product",
  "collection",
  "category",
  "ingredient",
  "brand",
  "certification",
  "programme",
  "faculty",
  "journey",
  "consultationsPage",
  "charter",
  "testimonial",
  "faq",
  "departmentCard",
  "announcement",
  "navigation",
  "footerSettings",
  "institutionSettings",
  "globalSeo",
  "author",
  "topic",
];

export default defineConfig({
  name: "sunnah-remedies",
  title: "Sunnah Remedies — Editorial Studio",
  projectId,
  dataset,
  basePath: "/studio",

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        initial: previewOrigin,
        previewMode: {
          enable: draftModeEnablePath,
          shareAccess: true,
        },
      },
      resolve: {
        locations: {
          product: productPresentationLocations,
        },
      },
    }),
    documentInternationalization({
      supportedLanguages: SUPPORTED_LANGUAGES,
      schemaTypes: TRANSLATABLE_TYPES,
      weakReferences: true,
    }),
    languageFilter({
      supportedLanguages: SUPPORTED_LANGUAGES,
      defaultLanguages: ["en"],
      documentTypes: TRANSLATABLE_TYPES,
      filterField: (enclosingType, member, selectedLanguageIds) =>
        !enclosingType.name.startsWith("locale") ||
        selectedLanguageIds.includes(member.name),
    }),
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema: {
    types: schemaTypes,
    templates: (prev) => resolveProductTemplates(prev),
  },

  document: {
    actions: (prev, context) => {
      const withProducts = resolveProductActions(prev, context);
      return resolveMediaActions(withProducts, context.schemaType);
    },
    badges: (prev, context) => resolveProductBadges(prev, context),
    productionUrl: async (prev, context) =>
      resolveProductProductionUrl(prev, context),
  },

  tools: (prev) => [
    ...prev,
    {
      name: "apothecary",
      title: "Apothecary",
      component: ApothecaryOverview,
    },
    {
      name: "media-library",
      title: "Media Library",
      component: MediaLibraryOverview,
    },
    {
      name: "operations",
      title: "Operations",
      component: OperationsOverview,
    },
  ],
});
