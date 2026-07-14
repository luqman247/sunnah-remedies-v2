import { groq } from "next-sanity";
import { DHIKR_ELIGIBILITY_GROQ } from "./dhikr-publication-gate";

/**
 * Translation siblings projection — reusable fragment for hreflang.
 * Resolves all linked translations via the metadata document.
 */
const translationSiblings = `
  "translations": *[_type == "translation.metadata" && references(^._id)][0]
    .translations[].value->{ "lang": language, "slug": slug.current }
`;

/* ── Global ─────────────────────────────────────────────────────── */

export const institutionSettingsQuery = groq`
  *[_type == "institutionSettings" && language == $language][0] {
    name,
    descriptor,
    tagline,
    foundingYear,
    contactEmail,
    contactPhone,
    address,
    socialLinks[] { platform, url }
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation" && language == $language][0] {
    mainNavigation[] {
      label,
      href,
      highlighted,
      hidden,
      children[] {
        label,
        href,
        description
      }
    },
    announcementBar
  }
`;

export const footerQuery = groq`
  *[_type == "footerSettings" && language == $language][0] {
    columns[] {
      title,
      links[] { label, href }
    },
    closingStatement,
    colophon,
    socialLinks[] { platform, url }
  }
`;

/* ── Homepage ───────────────────────────────────────────────────── */

export const homepageQuery = groq`
  *[_type == "homepage" && language == $language][0] {
    eyebrow,
    foundingYear,
    arrivalArabic,
    arrivalEnglish,
    "standfirst": arrivalStandfirst,
    enterLabel,
    enterHref,
    tradition {
      stamp,
      arabicEpigraph,
      standfirst,
      body,
      pullQuote { text, attribution, source }
    },
    "departmentCards": departmentCards[]-> {
      order,
      nameEn,
      nameAr,
      standfirst,
      href,
      size,
      "plate": plate-> {
        status,
        purpose,
        composition,
        lens,
        lighting,
        grade,
        mood,
        image { ..., asset-> },
        alt,
        caption,
        decorative,
        credit
      }
    },
    authoritySignals[] { label, value, note },
    correspondence {
      heading,
      body,
      placeholder,
      consentText,
      successText
    },
    institutionStatement,
    hero {
      image { ..., asset-> },
      imageAlt,
      statement,
      qualifier
    },
    institutionSection {
      numeral,
      title,
      body
    },
    pillars[] {
      eyebrow,
      title,
      body,
      image { ..., asset-> },
      imageAlt,
      caption,
      link { label, href }
    },
    trustSection {
      numeral,
      label,
      heading,
      items[] { numeral, title, text }
    },
    featuredRemedies[] {
      eyebrow,
      title,
      body,
      image { ..., asset-> },
      imageAlt,
      link { label, href }
    },
    academySection {
      numeral,
      label,
      title,
      body,
      pullQuote,
      link { label, href }
    },
    knowledgeSection {
      numeral,
      label,
      title,
      body,
      link { label, href }
    },
    journeysSection {
      numeral,
      label,
      title,
      body,
      pullQuote,
      link { label, href }
    },
    foundingStatement {
      numeral,
      eyebrow,
      title,
      body,
      link { label, href }
    },
    invitation {
      title,
      body,
      actions[] { label, href, primary }
    },
    seo
  }
`;

/* ── Apothecary ─────────────────────────────────────────────────── */

export const allProductsQuery = groq`
  *[_type == "product" && language == $language && !(_id in path("drafts.**"))] | order(orderRank) {
    _id,
    slug,
    name,
    transliteration,
    botanicalName,
    nature,
    institutionalSummary,
    folio,
    "mainImage": mainImage { ..., asset-> },
    volume,
    price,
    priceNote,
    inStock,
    futureShopifyProductId
  }
`;

export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug && language == $language][0] {
    ...,
    mainImage { ..., asset-> },
    gallery[] { ..., asset-> },
    propheticReferences[],
    "relatedProducts": relatedProducts[]->{ _id, slug, name, nature, mainImage { ..., asset-> } },
    "ingredients": ingredients[]->{ _id, slug, name, botanicalName },
    seo,
    ${translationSiblings}
  }
`;

/* ── Academy ────────────────────────────────────────────────────── */

export const allProgrammesQuery = groq`
  *[_type == "programme" && language == $language && !(_id in path("drafts.**"))] | order(orderRank) {
    _id,
    slug,
    name,
    subtitle,
    tier,
    duration,
    fee,
    feeNote,
    nextCohort
  }
`;

export const programmeBySlugQuery = groq`
  *[_type == "programme" && slug.current == $slug && language == $language][0] {
    ...,
    curriculum[],
    faculty[]->{ _id, name, title, licence, chain, biography, portrait { ..., asset-> } },
    learningOutcomes[],
    testimonials[],
    seo,
    ${translationSiblings}
  }
`;

/* ── Sacred Journeys ────────────────────────────────────────────── */

export const allJourneysQuery = groq`
  *[_type == "journey" && language == $language && !(_id in path("drafts.**"))] | order(nextDeparture asc) {
    _id,
    slug,
    name,
    subtitle,
    season,
    duration,
    location,
    fee,
    nextDeparture,
    "heroImage": heroImage { ..., asset-> }
  }
`;

export const journeyBySlugQuery = groq`
  *[_type == "journey" && slug.current == $slug && language == $language][0] {
    ...,
    heroImage { ..., asset-> },
    gallery[] { ..., asset-> },
    itinerary[],
    scholars[],
    educationalSessions[],
    seo,
    ${translationSiblings}
  }
`;

/* ── Knowledge Library ──────────────────────────────────────────── */

export const allArticlesQuery = groq`
  *[_type == "article" && language == $language && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    slug,
    title,
    excerpt,
    "author": author->{ name, portrait { ..., asset-> } },
    topics[]->{ _id, slug, title },
    publishedAt,
    readingTime,
    featured,
    "mainImage": mainImage { ..., asset-> },
    seo
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug && language == $language][0] {
    ...,
    mainImage { ..., asset-> },
    body[] {
      ...,
      _type == "image" => { ..., asset-> }
    },
    "author": author->{ name, title, biography, portrait { ..., asset-> } },
    topics[]->{ _id, slug, title },
    "relatedArticles": relatedArticles[]->{ _id, slug, title, excerpt, publishedAt },
    seo,
    ${translationSiblings}
  }
`;

/* ── Faculty ────────────────────────────────────────────────────── */

export const allFacultyQuery = groq`
  *[_type == "faculty" && language == $language && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    slug,
    name,
    title,
    licence,
    chain,
    biography,
    portrait { ..., asset-> },
    departments
  }
`;

/* ── Testimonials ───────────────────────────────────────────────── */

export const testimonialsByDepartmentQuery = groq`
  *[_type == "testimonial" && department == $department && language == $language && !(_id in path("drafts.**"))] | order(year desc) {
    _id,
    statement,
    name,
    context,
    year,
    department
  }
`;

/* ── FAQs ───────────────────────────────────────────────────────── */

export const faqsByDepartmentQuery = groq`
  *[_type == "faq" && department == $department && language == $language && !(_id in path("drafts.**"))] | order(orderRank) {
    _id,
    question,
    answer,
    department
  }
`;

/* ── Clinical Consultations ─────────────────────────────────────── */

export const consultationsPageQuery = groq`
  *[_type == "consultationsPage" && language == $language][0] {
    ...,
    consultationTypes[],
    practitioners[]->{ _id, name, title, specialisms, portrait { ..., asset-> } },
    seo
  }
`;

/* ── Institution / Charter ──────────────────────────────────────── */

export const charterQuery = groq`
  *[_type == "charter" && language == $language][0] {
    ...,
    body[] {
      ...,
      _type == "image" => { ..., asset-> }
    },
    seo
  }
`;

/* ── Global SEO ─────────────────────────────────────────────────── */

export const globalSeoQuery = groq`
  *[_type == "globalSeo" && language == $language][0] {
    siteName,
    siteDescription,
    defaultOgImage { ..., asset-> },
    twitterHandle,
    keywords
  }
`;

/* ── Slugs (all languages, for generateStaticParams) ────────────── */

export const productSlugsQuery = groq`
  *[_type == "product" && defined(slug.current) && !(_id in path("drafts.**"))]
    { "slug": slug.current, language }
`;

export const programmeSlugsQuery = groq`
  *[_type == "programme" && defined(slug.current) && !(_id in path("drafts.**"))]
    { "slug": slug.current, language }
`;

export const journeySlugsQuery = groq`
  *[_type == "journey" && defined(slug.current) && !(_id in path("drafts.**"))]
    { "slug": slug.current, language }
`;

export const articleSlugsQuery = groq`
  *[_type == "article" && defined(slug.current) && !(_id in path("drafts.**"))]
    { "slug": slug.current, language }
`;

/* ── Practitioner Portal ─────────────────────────────────────────── */

export const clinicalProtocolsQuery = groq`
  *[_type == "clinicalProtocol"
    && reviewStatus == "approved"
    && accessLevel == "practitioner"
    && language == $language
  ] | order(reviewedAt desc) {
    _id,
    title,
    "slug": slug.current,
    version,
    category,
    summary,
    reviewedAt,
    "reviewedByName": reviewedBy->name
  }
`;

export const clinicalProtocolBySlugQuery = groq`
  *[_type == "clinicalProtocol"
    && slug.current == $slug
    && reviewStatus == "approved"
    && language == $language
  ][0] {
    _id,
    title,
    "slug": slug.current,
    version,
    category,
    summary,
    body,
    sourceReferences,
    reviewedAt,
    "reviewedByName": reviewedBy->name,
    downloadFile
  }
`;

export const practitionerResourcesQuery = groq`
  *[_type == "practitionerResource"
    && reviewStatus == "approved"
    && language == $language
  ] | order(_updatedAt desc) {
    _id,
    title,
    "slug": slug.current,
    resourceType,
    description,
    version,
    reviewedAt,
    "reviewedByName": reviewedBy->name,
    downloadFile
  }
`;

export const researchPublicationsQuery = groq`
  *[_type == "researchPublication"
    && accessLevel in ["practitioner", "researcher"]
    && language == $language
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    authors,
    abstract,
    publishedAt,
    journal,
    externalUrl,
    downloadFile
  }
`;

export const practitionerAnnouncementsQuery = groq`
  *[_type == "announcement"
    && active == true
    && department == "practitioner"
    && (!defined(startDate) || startDate <= now())
    && (!defined(endDate) || endDate >= now())
  ] | order(_updatedAt desc) {
    _id,
    message,
    link,
    startDate,
    endDate
  }
`;

/* ── Dhikr (prototype — see docs/dhikr/) ───────────────────────────
 *
 * dhikrItemsPublicEligibleQuery is the ONLY query any public route may
 * ever use for Dhikr content. It applies DHIKR_ELIGIBILITY_GROQ, the
 * single canonical rule defined in ./dhikr-publication-gate.ts — not a
 * hand-repeated filter. No public route consumes it yet (see
 * docs/dhikr/11-route-and-component-map.md); it exists now so the gate
 * itself can be proven correct and tested (docs/dhikr/17, R-01).
 *
 * dhikrItemsInternalPreviewQuery and dhikrCategoriesInternalQuery apply
 * NO eligibility filter and must never be imported by a route under
 * src/app/[locale]/. They exist only for src/sanity/lib/dhikr-fetch.ts,
 * consumed by the staff-only src/app/(staff)/dhikr-review page.
 */

// Projection is deliberately explicit and limited to what a public reader
// view/index needs. No reviewStatus, boardApprovals, reviewer identity,
// editorial/internal notes, draft metadata, or workflow timestamp is ever
// projected here — even though the filter guarantees reviewStatus ==
// "published" for every row, that is workflow state, not public content,
// and has no rendering purpose (see Stage 2, docs/dhikr/21-decision-log.md).
//
// sourceReferences is projected field-by-field (not `...`) against the
// sourceReference object (src/sanity/schemas/objects/source-reference.ts).
// That object has no reviewer/internal-note fields of its own — every field
// listed below is its full field set — but naming them explicitly means a
// future field added to sourceReference is excluded by default until
// deliberately added here, rather than leaking through an implicit spread.
//
// category is dereferenced only for its public-identity fields (name, slug)
// — never the raw dhikrCategory document — so a category becomes visible
// here only by virtue of an eligible item referencing it (see
// getDhikrCategoriesPublic in dhikr-public-fetch.ts, which derives category
// listings from this query's results and never queries dhikrCategory
// directly).
export const dhikrItemsPublicEligibleQuery = groq`
  *[_type == "dhikrItem" && ${DHIKR_ELIGIBILITY_GROQ}] | order(order asc) {
    _id,
    "slug": slug.current,
    titleEn,
    titleDa,
    order,
    arabicText,
    transliteration,
    translationEn,
    translationDa,
    "categoryName": category->nameEn,
    "categoryNameDa": category->nameDa,
    "categorySlug": category->slug.current,
    "sourceReferences": sourceReferences[]{
      type,
      citation,
      hadithCollection,
      hadithNumber,
      hadithGrading,
      surah,
      ayah,
      sourceUrl,
      verifiedStatus
    }
  }
`;

/** Staff-only. Applies no eligibility filter — do not expose these results publicly. */
export const dhikrItemsInternalPreviewQuery = groq`
  *[_type == "dhikrItem"] | order(order asc) {
    _id,
    titleEn,
    titleDa,
    "categoryName": category->nameEn,
    order,
    reviewStatus,
    "hasArabicText": defined(arabicText) && arabicText != "",
    "hasTranslationEn": defined(translationEn) && translationEn != "",
    "hasTranslationDa": defined(translationDa) && translationDa != "",
    "sourceReferenceCount": count(sourceReferences),
    "hasScholarlyApproval": count(boardApprovals[board == "scholarly" && approved == true]) > 0,
    "hasEditorialApproval": count(boardApprovals[board == "editorial" && approved == true]) > 0
  }
`;

/** Staff-only. Category labels are organisational, not gated (see docs/dhikr/05, dhikr-category.ts). */
export const dhikrCategoriesInternalQuery = groq`
  *[_type == "dhikrCategory"] | order(order asc) {
    _id,
    nameEn,
    nameDa,
    order
  }
`;
