import type { Remedy } from "../types";
import {
  photographyGrammar,
  standardCustomerSupport,
  standardReturns,
  standardShipping,
} from "./defaults";

export const oliveOil: Remedy = {
  slug: "olive-oil",
  name: "Olive Oil",
  transliteration: "zayt",
  botanicalName: "Olea europaea",
  nature:
    "First cold-pressed extra virgin oil from established groves, presented as nourishment and a traditional means.",
  institutionalSummary:
    "First cold-pressed extra virgin oil from Nabali Baladi groves above Nablus, with traceability from tree to vessel. It is named as a blessed tree in revelation and report and is presented first as food. Traditional associations are stated with clear limits and without cure claims.",
  folio: "v",
  figure: "olive",
  figureAlt:
    "Olive oil in dark glass beside fresh branches, side-lit with restrained composition.",

  historicalContext: [
    "The olive is named in the Qur'an as a blessed tree, shajarah mubārakah, and its oil has long served as food and daily utility across Muslim societies.",
    "Prophetic reports place olive oil in both dietary and topical contexts. The tradition preserves both without confusing nourishment with formal treatment.",
    "Levantine and Andalusian sources document olive oil in household and institutional settings. This lot is sourced from estate pressing in Nablus with a single traceable chain.",
  ],

  propheticReferences: [
    {
      statement: "Eat olive oil and anoint yourselves with it, for it comes from a blessed tree.",
      transliteration: "kullū al-zayta wa-dahtanū bihi fa-innahu min shajara mubāraka",
      grade: "Established",
      source: "Sunan al-Tirmidhī · Kitāb al-Ṭibb",
      standing: "Established narration · graded ṣaḥīḥ by al-Tirmidhī",
      siglum: "T1",
      attribution: "hadith",
    },
    {
      statement: "It is blessed tree oil.",
      transliteration: "huwa zaytu shajara mubāraka",
      grade: "Reported",
      source: "Sunan al-Tirmidhī · Kitāb al-Ṭibb",
      standing: "Supporting narration in the same chapter",
      siglum: "T2",
      attribution: "hadith",
    },
  ],

  traditionalScholarship: [
    "Ibn al-Qayyim discusses olive oil among oils of general support, with diet primary and medicinal association secondary.",
    "Exegetes describe barakah as blessing and do not treat it as a guaranteed medical outcome for each person.",
    "Classical pharmacopoeias distinguish press grades; this monograph limits dispensation to first extraction.",
  ],

  traditionalUsage: [
    "Traditionally taken in small measure, used in food preparation, and applied topically in moderation.",
    "The tradition records both nourishment and anointing; this oil is recommended primarily as food.",
    "Topical use should avoid broken or infected skin unless advised by a qualified practitioner.",
  ],

  evidence: {
    established: [
      "Extra virgin olive oil is a calorically dense dietary fat.",
      "Those with gallbladder disease or fat-malabsorption conditions should seek medical advice before increasing fat intake.",
    ],
    emerging: [
      "Population research on Mediterranean dietary patterns continues; revelation is not reduced here to epidemiology.",
      "Sensory and chemical markers of extra virgin grade are applied at release and are not health claims.",
    ],
  },

  provenance: {
    origin: [
      "Estate groves in the hills above Nablus, Palestine, cultivar Nabali Baladi.",
    ],
    cultivation: [
      "Dry-farmed terraced groves with rainfall-led cultivation, with drought protocol recorded at estate level.",
      "No pesticide application within six months of harvest for dispensed lots.",
    ],
    harvesting: [
      "Hand-harvested at green-gold maturity for this pressing run.",
      "Pressed within hours of harvest, first extraction only, with release acidity below 0.3%.",
      "Unfiltered by design; slight sediment is natural.",
    ],
  },

  laboratoryVerification: [
    "Chemical panel is performed to extra virgin standards, including acidity, peroxide, and UV parameters.",
    "Sensory evaluation is conducted by certified panel where available.",
    "Lot records link harvest week and pressing run, with no cross-season blending.",
  ],

  qualityAssurance: [
    "Dark glass is used from pressing to dispensation to minimise light exposure.",
    "Harvest year is labelled and stock rotation is enforced.",
    "Lots that fail institutional thresholds are not released.",
  ],

  storage: [
    "Store away from light and heat in a cool pantry.",
    "Use within eighteen months of pressing; see harvest year on label.",
    "Close cap firmly after each use.",
    "Clouding at cool temperature is reversible on gentle warming.",
  ],

  preparation: [
    "Use raw for full character, including bread, salads, and finished dishes.",
    "May be warmed gently; avoid reaching smoking point during cooking.",
  ],

  suggestedUse: [
    "Use as food, with raw use preferred for this grade.",
    "A small spoonful with breakfast appears in folk practice; adjust to diet and professional counsel.",
    "Topical food-grade use may be undertaken in modest measure with patch testing.",
  ],

  contraindications: [
    "Healing is from Allah; this remedy is a means.",
    "This is presented as a food first and not as a clinical intervention.",
    "It is calorically dense, so moderation is part of responsible use.",
    "It is not a substitute for medical care.",
  ],

  photographyDirection: [
    ...photographyGrammar,
    "Subject: dark glass bottle with olive branch and controlled side light.",
    "Mood: restrained estate still life; colour should remain natural and subdued.",
  ],

  packaging: [
    "500ml dark green glass bottle, metal pour cap, tamper band.",
    "Inner label records harvest year, lot number, and release acidity.",
  ],

  shipping: standardShipping,
  returns: standardReturns,
  customerSupport: standardCustomerSupport,

  faq: [
    {
      question: "Why unfiltered?",
      answer:
        "Filtration can improve visual clarity but may remove particulate associated with flavour and character. Slight sediment is expected.",
    },
    {
      question: "Can I use this oil on the skin as the ḥadīth mentions?",
      answer:
        "Food-grade olive oil has a long history of modest topical use. Avoid open wounds unless directed by a practitioner.",
    },
    {
      question: "How does this relate to the blessed tree in the Qur'an?",
      answer:
        "Revelation and report describe the olive with the language of blessing, barakah. Scholars distinguish this from guaranteed individual medical outcome.",
    },
    {
      question: "Why Nablus?",
      answer:
        "Nablus is used for documented cultivar continuity and estate traceability with on-site pressing.",
    },
  ],

  relatedRemedies: ["honey", "black-seed-oil"],
  academyLessons: [
    {
      title: "Foundations of Prophetic Medicine",
      href: "/the-academy/foundations",
      note: "The olive in revelation and transmitted report.",
    },
    {
      title: "The Materia Medica",
      href: "/the-academy/materia-medica",
      note: "Oils and simples in classical medical texts.",
    },
  ],
  knowledgeLibrary: [
    {
      title: "Olive Oil",
      href: "/knowledge-library/olive-oil",
      note: "Institutional note on the blessed tree.",
    },
    {
      title: "Nutrition in the Sunnah",
      href: "/knowledge-library/nutrition",
      note: "Food and discipline in the Sunnah.",
    },
  ],
  pathways: [
    { label: "Foundations", href: "/the-academy/foundations", department: "Academy" },
    { label: "The Olive Grove retreat", href: "/sacred-journeys/olive-grove", department: "Sacred Journeys" },
    { label: "Olive Oil — Knowledge Library", href: "/knowledge-library/olive-oil", department: "Knowledge Library" },
  ],

  volume: "500ml",
  price: 22,
  priceNote: "includes delivery within the United Kingdom",
  inStock: true,
};
