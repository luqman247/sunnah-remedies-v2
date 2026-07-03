export interface KnowledgeTopic {
  slug: string;
  title: string;
  lede: string;
  sections: { title: string; body: string[] }[];
  related: { label: string; href: string }[];
}

export const knowledgeTopics: Record<string, KnowledgeTopic> = {
  "prophetic-medicine": {
    slug: "prophetic-medicine",
    title: "Prophetic Medicine",
    lede: "Tibb al-Nabawi presented through clear terms, graded reports, and accountable citation.",
    sections: [
      {
        title: "Definition",
        body: [
          "Prophetic Medicine refers to teachings related to health and conduct associated with the Prophet and the early Muslim community, preserved in revelation, authenticated report, and classical commentary.",
          "This institution presents the subject as a formal discipline. Each claim is graded as Established, Reported, or Tried.",
        ],
      },
      {
        title: "Method",
        body: [
          "Sources are cited before application. Claims without traceable sources are not published.",
          "The Academy teaches method, the Apothecary provides preparations, and Sacred Journeys supports embodied study under one standard of evidence.",
        ],
      },
    ],
    related: [
      { label: "Foundations of Prophetic Medicine", href: "/the-academy/foundations" },
      { label: "The Founding Charter", href: "/charter" },
    ],
  },
  hijama: {
    slug: "hijama",
    title: "Hijama",
    lede: "Hijama in the Sunnah, taught with graded reports and explicit clinical limits.",
    sections: [
      {
        title: "Traditional context",
        body: [
          "Cupping appears in Prophetic reports and classical medical literature as a treatment used within defined limits, rather than as a universal cure.",
          "Narrations are graded, and practical technique is taught only in supervised professional training.",
        ],
      },
      {
        title: "Clinical guidance",
        body: [
          "Contraindications include bleeding disorders, anticoagulation, pregnancy, and acute infection, and these are stated directly.",
          "Clinical referral is a routine part of safe practice when medical oversight is needed.",
        ],
      },
    ],
    related: [
      { label: "Hijama Diploma", href: "/the-academy/hijama-diploma" },
      { label: "Clinical Standards", href: "/the-academy/clinical-standards" },
    ],
  },
  "black-seed": {
    slug: "black-seed",
    title: "Black Seed",
    lede: "Nigella sativa in Prophetic reports and the wider tradition of classical use.",
    sections: [
      {
        title: "Traditional standing",
        body: [
          "Black seed is among the most frequently discussed simples in Prophetic reports. Narrations are graded and limits are stated in each monograph.",
          "Preparations include cold-pressed oil and whole seed with traceable sourcing and selected laboratory verification.",
        ],
      },
    ],
    related: [
      { label: "Apothecary monograph", href: "/the-apothecary/black-seed-oil" },
      { label: "Ingredient Library", href: "/the-apothecary/ingredients" },
    ],
  },
  honey: {
    slug: "honey",
    title: "Honey",
    lede: "Named in revelation and discussed as nourishment and therapeutic means.",
    sections: [
      {
        title: "Scriptural context",
        body: [
          "Surat al-Nahl names honey among the signs, and relevant passages are interpreted with the caution found in the tafsir tradition.",
          "Honey is presented in raw, unprocessed form from named apiaries according to institutional handling standards.",
        ],
      },
    ],
    related: [
      { label: "Apothecary monograph", href: "/the-apothecary/honey" },
      { label: "Nutrition in the Sunnah", href: "/knowledge-library/nutrition" },
    ],
  },
  "olive-oil": {
    slug: "olive-oil",
    title: "Olive Oil",
    lede: "Olive oil in revelation, Prophetic report, and classical household practice.",
    sections: [
      {
        title: "Traditional context",
        body: [
          "Olive and olive oil appear in revelation and Prophetic reports as nourishment and therapeutic means, with monographs documenting grade and use.",
          "Study of olive traditions is also included in the Olive Grove journey as part of integrated learning.",
        ],
      },
    ],
    related: [
      { label: "Apothecary monograph", href: "/the-apothecary/olive-oil" },
      { label: "The Olive Grove Retreat", href: "/sacred-journeys/olive-grove" },
    ],
  },
  saffron: {
    slug: "saffron",
    title: "Saffron",
    lede: "Saffron as a classical simple within the tradition of materia medica.",
    sections: [
      {
        title: "Classical record",
        body: [
          "Saffron appears in Islamic medical writing with traditional associations that include digestion, mood, and compound formulations.",
          "A formal monograph and sourcing line are in preparation, and no product is offered before traceability is complete.",
        ],
      },
    ],
    related: [
      { label: "The Materia Medica programme", href: "/the-academy/materia-medica" },
      { label: "Research notes", href: "/knowledge-library/research" },
    ],
  },
  nutrition: {
    slug: "nutrition",
    title: "Nutrition",
    lede: "Food in the Sunnah taught through adab, moderation, and gratitude.",
    sections: [
      {
        title: "Principle",
        body: [
          "The tradition emphasizes moderation, gratitude, and named foods such as honey, olive, dates, and barley.",
          "Nutrition is taught as part of Prophetic conduct rather than as a weight-loss or detox framework.",
        ],
      },
    ],
    related: [
      { label: "Foundations", href: "/the-academy/foundations" },
      { label: "Honey", href: "/knowledge-library/honey" },
    ],
  },
  research: {
    slug: "research",
    title: "Research",
    lede: "Evidence-informed notes that remain bounded, cited, and explicit about limits.",
    sections: [
      {
        title: "Institutional approach",
        body: [
          "Modern studies may inform traditional usage when methodology and context are cited carefully.",
          "Research notes are presented under an evidence-informed heading and remain distinct from Prophetic grading and traditional standing.",
        ],
      },
    ],
    related: [
      { label: "On Authenticity", href: "/charter#authenticity" },
      { label: "Quality Standards", href: "/the-apothecary/quality-standards" },
    ],
  },
  "patient-guides": {
    slug: "patient-guides",
    title: "Patient Guides",
    lede: "Practical guidance for those seeking treatment with informed understanding.",
    sections: [
      {
        title: "Before requesting a remedy",
        body: [
          "Read the monograph first and review contraindications and limits.",
          "The Apothecary does not diagnose; clinical questions should be directed to consultation or a qualified physician.",
        ],
      },
      {
        title: "Before enrolment or travel",
        body: [
          "Academy programmes list prerequisites and assessment requirements, and journeys include required reading and interview.",
          "Applicants are encouraged to decide with deliberation and adequate preparation.",
        ],
      },
      {
        title: "When to seek a physician",
        body: [
          "Acute illness, pregnancy, chronic conditions, and medication changes require medical oversight.",
          "Referral to physicians is a normal and necessary part of responsible care.",
        ],
      },
    ],
    related: [
      { label: "Request a consultation", href: "/consultations" },
      { label: "Apothecary FAQs", href: "/the-apothecary/faqs" },
    ],
  },
};

export function getKnowledgeTopic(slug: string): KnowledgeTopic | undefined {
  return knowledgeTopics[slug];
}

export function getAllKnowledgeSlugs(): string[] {
  return Object.keys(knowledgeTopics);
}
