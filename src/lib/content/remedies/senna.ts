import type { Remedy } from "../types";
import {
  photographyGrammar,
  standardCustomerSupport,
  standardReturns,
  standardShipping,
} from "./defaults";

export const senna: Remedy = {
  slug: "senna",
  name: "Senna",
  transliteration: "al-sanā makkī",
  botanicalName: "Senna alexandrina",
  nature:
    "Whole dried pods of Senna alexandrina, a botanical named in transmitted report and classical materia medica, offered with explicit bounds.",
  institutionalSummary:
    "Whole dried pods of Senna alexandrina, identified to species, shade-dried, and traced from Wadi Hadramawt. The Prophetic reference is graded as Reported, pharmacology is acknowledged, and duration of use is clearly limited. This is not a daily food and no detox claim is made.",
  folio: "iv",
  figure: "senna",
  figureAlt:
    "Dried senna pods in a linen pouch, arranged as a restrained still life.",

  historicalContext: [
    "Senna appears in pre-Islamic Mediterranean pharmacopoeia and was later integrated into Arabic medical writing under related names.",
    "Ibn al-Qayyim lists senna among laxative simples and records caution regarding excess use.",
    "Historical institutions used senna in decoction, often with moderating agents. This dispensation is provided as pod only for deliberate preparation.",
  ],

  propheticReferences: [
    {
      statement: "If anything is good for this, it is senna.",
      transliteration: "wa-hal min shayʾin khayrun min al-sanā makkī",
      grade: "Reported",
      source: "Sunan Abī Dāwūd · Kitāb al-Ṭibb",
      standing: "Reported narration · graded ḥasan by the scholars of ḥadīth",
      siglum: "D1",
      attribution: "hadith",
    },
  ],

  traditionalScholarship: [
    "Commentators distinguish sanā makkī from related species, and botanical identity remains central to safe practice.",
    "Ibn al-Qayyim and later writers classify senna among purgative simples for occasional support rather than routine daily use.",
    "Where isnād discipline requires, the grade is stated as Reported and not elevated beyond that grade.",
  ],

  traditionalUsage: [
    "Traditionally prepared as a decoction from whole or lightly crushed pods, then strained and taken in modest measure.",
    "Classical authors discuss cleansing actions; this monograph frames use as occasional support rather than daily habit.",
    "Some historical texts combine senna with moderating simples.",
  ],

  evidence: {
    established: [
      "Senna contains anthraquinone glycosides with established laxative action documented in pharmacopoeias.",
      "Prolonged unsupervised use can lead to dependence and electrolyte disturbance.",
      "Not appropriate during pregnancy, lactation, or for children under twelve except under direct medical supervision.",
    ],
    emerging: [
      "Research on gut motility and short-term use continues; duration limits remain institutional policy.",
    ],
  },

  provenance: {
    origin: [
      "Cultivated in Wadi Hadramawt, Yemen, with field and drying batch traceability.",
    ],
    cultivation: [
      "Senna alexandrina is grown as a field crop with rotation records that reduce adulterant risk.",
    ],
    harvesting: [
      "Whole pods are hand-sorted to remove stem fragments and foreign matter.",
      "Pods are shade-dried rather than oven-dried to preserve colour and constituent profile.",
    ],
  },

  laboratoryVerification: [
    "Botanical identity is verified as Senna alexandrina against pharmacopoeial description.",
    "Moisture content is controlled to reduce mould risk in storage and transit.",
    "Release lots undergo microbiological screening.",
  ],

  qualityAssurance: [
    "Light-protective packaging is used, with desiccant where humidity risk warrants.",
    "Decoction instructions and limits are printed on the inner label.",
    "Species name appears on each vessel rather than generic labelling.",
  ],

  storage: [
    "Store in sealed pouch in a cool, dry place.",
    "Reseal after opening and use within three months.",
    "Discard if mould, mustiness, or unexpected odour develops.",
  ],

  preparation: [
    "Lightly crush one to two pods, steep in approximately 200ml freshly boiled water for ten to fifteen minutes, then strain.",
    "Begin with the lower measure; first use in the evening is often practical.",
    "Use for short periods only, typically not more than several consecutive days without professional guidance.",
  ],

  suggestedUse: [
    "Use as an occasional decoction with modest measure and bounded duration.",
    "Read enclosed instructions before first use.",
    "Do not combine with other purgatives without competent advice.",
  ],

  contraindications: [
    "Healing is from Allah; this remedy is a means.",
    "For occasional use only and not as a daily food; no detox claim is made.",
    "Not during pregnancy, while nursing, or for children under twelve.",
    "Persistent change in bowel habit requires medical assessment.",
    "Not a substitute for medical care.",
  ],

  photographyDirection: [
    ...photographyGrammar,
    "Subject: dried pods in linen pouch with restrained side light and no decorative scatter.",
    "Mood: herbarium specimen with clear pod texture and material fidelity.",
  ],

  packaging: [
    "100g net in light-protective pouch with reseal strip and instruction leaflet.",
    "Label includes lot, species name, and harvest batch.",
  ],

  shipping: standardShipping,
  returns: standardReturns,
  customerSupport: standardCustomerSupport,

  faq: [
    {
      question: "Why is the Prophetic reference graded Reported?",
      answer:
        "Every claim is graded. This narration is cited in Tibb al-Nabawī, and its grade is stated according to isnād discipline.",
    },
    {
      question: "Can senna be taken daily for detox?",
      answer:
        "No. Daily purgative use is not responsible practice. Senna is intended for occasional and bounded use.",
    },
    {
      question: "Is this the same as leaves sold in shops?",
      answer:
        "This dispensation provides whole pods of Senna alexandrina identified to species. Generic senna tea may differ by species and age.",
    },
    {
      question: "Should I combine senna with other remedies?",
      answer:
        "Read all relevant monographs and consider consultation. Combination decisions should be made with competent advice.",
    },
  ],

  relatedRemedies: ["honey"],
  academyLessons: [
    {
      title: "The Materia Medica",
      href: "/the-academy/materia-medica",
      note: "Purgative simples and their classical limits.",
    },
    {
      title: "Clinical Standards",
      href: "/the-academy/clinical-standards",
      note: "Referral thresholds and limits of practice.",
    },
  ],
  knowledgeLibrary: [
    {
      title: "Prophetic Medicine",
      href: "/knowledge-library/prophetic-medicine",
      note: "Grades of transmission and method.",
    },
    {
      title: "Patient Guides",
      href: "/knowledge-library/patient-guides",
      note: "Guidance before requesting a remedy.",
    },
  ],
  pathways: [
    { label: "The Materia Medica", href: "/the-academy/materia-medica", department: "Academy" },
    { label: "Clinical Standards", href: "/the-academy/clinical-standards", department: "Academy" },
  ],

  volume: "100g",
  price: 12,
  priceNote: "includes delivery within the United Kingdom",
  inStock: true,
};
