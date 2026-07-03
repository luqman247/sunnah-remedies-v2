import type { Remedy } from "../types";
import {
  photographyGrammar,
  standardCustomerSupport,
  standardReturns,
  standardShipping,
} from "./defaults";

export const blackSeedOil: Remedy = {
  slug: "black-seed-oil",
  name: "Black Seed Oil",
  transliteration: "al-ḥabba al-sawdāʾ",
  botanicalName: "Nigella sativa",
  nature:
    "Cold-pressed oil from Nigella sativa seeds, presented as a traced botanical preparation and traditional means.",
  institutionalSummary:
    "Cold-pressed Nigella sativa oil from a traceable highland harvest. Prophetic references are graded and interpreted within explicit limits before dispensation. Laboratory verification and controlled packaging are used to preserve material quality.",
  folio: "ii",
  figure: "black-seed",
  figureAlt:
    "Black seeds in a shallow ceramic dish, side-lit with restrained natural light.",

  historicalContext: [
    "Black seed, ḥabbah sawdāʾ, holds a notable place in Tibb al-Nabawī. Ibn al-Qayyim discusses it extensively and records sustained use in Islamic medical literature.",
    "Nigella was also known in earlier medical traditions, then integrated into Arabic pharmacopoeias under names later linked to Prophetic terminology.",
    "It appears in both simple and compound preparations in historical practice. This dispensation preserves the simple form so provenance and identity remain clear.",
  ],

  propheticReferences: [
    {
      statement: "In black seed is healing for every disease, except death.",
      transliteration: "fī al-ḥabbati al-sawdāʾi shifāʾun min kulli dāʾin illā al-sam",
      grade: "Established",
      source: "Ṣaḥīḥ al-Bukhārī · Kitāb al-Ṭibb",
      standing: "Canonical narration · agreed upon among the scholars of ḥadīth",
      siglum: "B1",
      attribution: "hadith",
    },
    {
      statement: "Use black seed, for indeed it contains a cure for every disease except death.",
      transliteration: "ʿalāykum bi-l-ḥabbati al-sawdāʾ fa-innahā taḥtajiru ʿalā kulli dāʾin illā al-sam",
      grade: "Reported",
      source: "Ṣaḥīḥ Muslim · Kitāb al-Ṭibb",
      standing: "Reported narration · widely cited in works of Prophetic Medicine",
      siglum: "M1",
      attribution: "hadith",
    },
  ],

  traditionalScholarship: [
    "Ibn al-Qayyim records use as whole seed, crushed seed, and oil, often with honey. He also warns against exaggeration beyond transmitted evidence.",
    "Later authors place black seed among oils of general support while maintaining limits and clinical judgement.",
    "Commentators identify ḥabbah sawdāʾ as Nigella sativa rather than cumin; labels follow that identification.",
  ],

  traditionalUsage: [
    "Traditionally used as whole seed, crushed seed, or expressed oil, including combination with honey.",
    "Classical texts associate it with general support and comfort in several systems; these are associations, not clinical claims.",
    "Topical use appears in some reports; this preparation is offered primarily for oral dietary use.",
  ],

  evidence: {
    established: [
      "Nigella sativa oil is a dietary fat; those on anticoagulant medication should disclose use to their clinician.",
      "Not advised in pregnancy or while nursing without qualified guidance.",
    ],
    emerging: [
      "Research continues on thymoquinone and related compounds, with varied design and applicability to dietary use.",
      "Reviews report metabolic and respiratory investigation; these findings are treated as emerging and not product promises.",
    ],
  },

  provenance: {
    origin: [
      "Seeds from smallholder farms in the Harar highlands of Ethiopia, with traceable harvest records.",
    ],
    cultivation: [
      "Open-field Nigella sativa cultivation at altitude, with separation that protects botanical identity.",
      "Seeds are cleaned and dried on estate before pressing.",
    ],
    harvesting: [
      "Cold-pressed at source within forty-eight hours of cleaning.",
      "No solvent extraction and no refinement beyond natural settling.",
      "Lot records link harvest date, pressing date, and botanical identification.",
    ],
  },

  laboratoryVerification: [
    "Identity is confirmed against Nigella sativa reference material.",
    "Independent laboratories screen for heavy metals and pesticide residues per lot.",
    "Moisture and free fatty acid levels must meet institutional thresholds before release.",
  ],

  qualityAssurance: [
    "Dispensed in dark glass, with nitrogen management where batch conditions allow.",
    "Oxidation is monitored and best-before is set from pressing date.",
    "Labels include botanical identity, origin, lot traceability, storage, and limits.",
  ],

  storage: [
    "Store in a cool, dark place, ideally below 18°C after opening.",
    "Keep upright and tightly closed to limit air and light exposure.",
    "Use within six months of opening and within labelled best-before if unopened.",
    "Discontinue use if pronounced rancid odour develops.",
  ],

  preparation: [
    "Traditionally taken in small measure, directly or with food.",
    "May be mixed with honey at room temperature; avoid prolonged high heat.",
    "Preparation guidance is enclosed with each dispensation.",
  ],

  suggestedUse: [
    "Use as a dietary oil in modest measure, alone or with food, traditionally with honey.",
    "Begin with a smaller measure if unfamiliar.",
    "Topical use should follow practitioner guidance, with patch testing for sensitive skin.",
  ],

  contraindications: [
    "Healing is from Allah; this remedy is a means, and no cure claim is made for named diseases.",
    "Not advised in pregnancy or while nursing without qualified guidance.",
    "May interact with anticoagulant medicines; disclose use to your clinician.",
    "Persistent symptoms require medical consultation; this is not a substitute for a physician.",
  ],

  photographyDirection: [
    ...photographyGrammar,
    "Subject: black seeds in a shallow ceramic dish with restrained side light and clear negative space.",
    "Mood: herbarium still life; texture should be shown without theatrical arrangement.",
  ],

  packaging: [
    "100ml dark amber glass with screw cap and tamper band.",
    "Lot and best-before are labelled, with origin recorded on inner label.",
    "Shipped upright in fitted protective packaging.",
  ],

  shipping: standardShipping,
  returns: standardReturns,
  customerSupport: standardCustomerSupport,

  faq: [
    {
      question: "Why is the narration translated as 'healing' rather than 'cure'?",
      answer:
        "The Arabic term shifāʾ carries a range discussed in the scholarly tradition. It is presented here as support and means, not guaranteed outcome.",
    },
    {
      question: "Is this the same as cumin or black cumin?",
      answer:
        "No. The Prophetic ḥabbah sawdāʾ is identified as Nigella sativa, not Cuminum cyminum. The botanical name on the label is the reference.",
    },
    {
      question: "Can this be taken daily?",
      answer:
        "Some traditions describe regular moderate use. Daily use remains an individual decision informed by tolerance, health status, and medical advice where needed.",
    },
    {
      question: "Why Harar?",
      answer:
        "This origin is selected for traceability and cultivar consistency. Lot records identify cooperative and harvest season.",
    },
  ],

  relatedRemedies: ["honey", "olive-oil"],
  academyLessons: [
    {
      title: "Foundations of Prophetic Medicine",
      href: "/the-academy/foundations",
      note: "Terminology, grading, and method in Tibb al-Nabawī.",
    },
    {
      title: "The Materia Medica",
      href: "/the-academy/materia-medica",
      note: "Black seed in classical simple and compound use.",
    },
  ],
  knowledgeLibrary: [
    {
      title: "Black Seed",
      href: "/knowledge-library/black-seed",
      note: "Graded reports and traditional standing in the sources.",
    },
    {
      title: "Prophetic Medicine",
      href: "/knowledge-library/prophetic-medicine",
      note: "Institutional method for grading claims.",
    },
  ],
  pathways: [
    { label: "Foundations", href: "/the-academy/foundations", department: "Academy" },
    { label: "The Materia Medica", href: "/the-academy/materia-medica", department: "Academy" },
    { label: "The Olive Grove retreat", href: "/sacred-journeys/olive-grove", department: "Sacred Journeys" },
    { label: "Black Seed — Knowledge Library", href: "/knowledge-library/black-seed", department: "Knowledge Library" },
  ],

  volume: "100ml",
  price: 24,
  priceNote: "includes delivery within the United Kingdom",
  inStock: true,
};
