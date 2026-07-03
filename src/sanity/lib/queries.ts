import { groq } from "next-sanity";

/* ── Global ─────────────────────────────────────────────────────── */

export const institutionSettingsQuery = groq`
  *[_type == "institutionSettings"][0] {
    ...,
    "navigation": *[_type == "navigation"][0] {
      mainNavigation[] {
        ...,
        "items": items[] {
          ...,
          reference->{ _type, slug, title }
        }
      }
    },
    "footer": *[_type == "footerSettings"][0]
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation"][0] {
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
  *[_type == "footerSettings"][0] {
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
  *[_type == "homepage"][0] {
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
  *[_type == "product" && !(_id in path("drafts.**"))] | order(orderRank) {
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
  *[_type == "product" && slug.current == $slug][0] {
    ...,
    mainImage { ..., asset-> },
    gallery[] { ..., asset-> },
    propheticReferences[],
    "relatedProducts": relatedProducts[]->{ _id, slug, name, nature, mainImage { ..., asset-> } },
    "ingredients": ingredients[]->{ _id, slug, name, botanicalName },
    seo
  }
`;

/* ── Academy ────────────────────────────────────────────────────── */

export const allProgrammesQuery = groq`
  *[_type == "programme" && !(_id in path("drafts.**"))] | order(orderRank) {
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
  *[_type == "programme" && slug.current == $slug][0] {
    ...,
    curriculum[],
    faculty[]->{ _id, name, title, licence, chain, biography, portrait { ..., asset-> } },
    learningOutcomes[],
    testimonials[],
    seo
  }
`;

/* ── Sacred Journeys ────────────────────────────────────────────── */

export const allJourneysQuery = groq`
  *[_type == "journey" && !(_id in path("drafts.**"))] | order(nextDeparture asc) {
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
  *[_type == "journey" && slug.current == $slug][0] {
    ...,
    heroImage { ..., asset-> },
    gallery[] { ..., asset-> },
    itinerary[],
    scholars[],
    educationalSessions[],
    seo
  }
`;

/* ── Knowledge Library ──────────────────────────────────────────── */

export const allArticlesQuery = groq`
  *[_type == "article" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
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
  *[_type == "article" && slug.current == $slug][0] {
    ...,
    mainImage { ..., asset-> },
    body[] {
      ...,
      _type == "image" => { ..., asset-> }
    },
    "author": author->{ name, title, biography, portrait { ..., asset-> } },
    topics[]->{ _id, slug, title },
    "relatedArticles": relatedArticles[]->{ _id, slug, title, excerpt, publishedAt },
    seo
  }
`;

/* ── Faculty ────────────────────────────────────────────────────── */

export const allFacultyQuery = groq`
  *[_type == "faculty" && !(_id in path("drafts.**"))] | order(name asc) {
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
  *[_type == "testimonial" && department == $department && !(_id in path("drafts.**"))] | order(year desc) {
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
  *[_type == "faq" && department == $department && !(_id in path("drafts.**"))] | order(orderRank) {
    _id,
    question,
    answer,
    department
  }
`;

/* ── Clinical Consultations ─────────────────────────────────────── */

export const consultationsPageQuery = groq`
  *[_type == "consultationsPage"][0] {
    ...,
    consultationTypes[],
    practitioners[]->{ _id, name, title, specialisms, portrait { ..., asset-> } },
    seo
  }
`;

/* ── Institution / Charter ──────────────────────────────────────── */

export const charterQuery = groq`
  *[_type == "charter"][0] {
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
  *[_type == "globalSeo"][0] {
    siteName,
    siteDescription,
    defaultOgImage { ..., asset-> },
    twitterHandle,
    keywords
  }
`;
