import type { Remedy } from "../types";
import {
  photographyGrammar,
  standardCustomerSupport,
  standardReturns,
  standardShipping,
} from "./defaults";

export const honey: Remedy = {
  slug: "honey",
  name: "Honey",
  transliteration: "al-ʿasal",
  botanicalName: "Apis mellifera",
  nature:
    "Raw, unprocessed honey from mountain apiaries, presented as nourishment and a traditional means.",
  institutionalSummary:
    "A monograph record of single-origin mountain honey, minimally processed and traced from apiary to vessel. It is named in revelation and dispensed with documented sourcing and quality controls. It is offered as a means within diet and tradition, with limits stated clearly.",
  folio: "iii",
  figure: "honey",
  figureAlt:
    "Raw honey in a glass vessel beside a wooden dipper, lit from one side.",

  historicalContext: [
    "Honey is one of the oldest human foods and is explicitly named in the Qur'an. Sūrat al-Naḥl links the bee and its drink, using language that scholars discuss with care.",
    "Reports place honey within daily diet and household use, including periods of illness. These reports are treated as guidance on means, with trust in Allah and without replacing appropriate medical care.",
    "Classical medical writing records honey in both simple and compound preparations. This dispensation remains unblended so its material identity is clear.",
  ],

  propheticReferences: [
    {
      statement:
        "There comes forth from their bellies a drink of varying colours, wherein is healing for people.",
      transliteration:
        "yakhruju min buṭūnihi sharābun mukhtalifun alwānuhu fīhi shifāʾun lil-nās",
      grade: "Established",
      source: "Qurʾan · Sūrat al-Naḥl · 69",
      standing: "Revelatory text · recited and preserved without alteration",
      siglum: "Q1",
      attribution: "revelation",
    },
    {
      statement: "Honey is a remedy for every illness.",
      transliteration: "al-ʿasalu dawāʾun li-kulli dāʾin",
      grade: "Reported",
      source: "Sunan Ibn Mājah · Kitāb al-Ṭibb",
      standing: "Reported narration · discussed with varying grading among scholars",
      siglum: "J1",
      attribution: "hadith",
    },
  ],

  traditionalScholarship: [
    "Ibn al-Qayyim discusses honey as nourishment and as a carrier for other simples. He distinguishes transmitted evidence from exaggeration in popular practice.",
    "Al-Rāzī, Ibn Sīnā, and later pharmacopoeias include honey in compound formulations and note the importance of authenticity and origin.",
    "Exegetes caution against treating shifāʾ as a guarantee of individual outcome. The same caution is maintained in this monograph.",
  ],

  traditionalUsage: [
    "Traditionally taken by spoon, dissolved in warm water, or combined with other simples such as black seed and olive oil.",
    "Traditional literature associates honey with throat comfort, appetite support, and convalescent nourishment. These are associations rather than prescriptions.",
    "Some texts mention topical preparation. This dispensation is food-grade and intended primarily for oral use.",
  ],

  evidence: {
    established: [
      "Infants under twelve months must not receive honey due to established risk of infant botulism.",
      "Honey influences blood glucose; those with diabetes or insulin resistance should seek medical advice before regular use.",
      "Medical-grade honey used in clinical wound care is not interchangeable with table honey.",
    ],
    emerging: [
      "Nutritional and microbiological study of raw honey continues, including pollen profile and enzyme activity.",
      "Study design and population vary; findings are noted as emerging and not presented as product claims.",
    ],
  },

  provenance: {
    origin: [
      "Mountain apiaries in the Rif region of northern Morocco, single-origin and not cross-region blended.",
    ],
    cultivation: [
      "Apis mellifera is managed at altitude in traditional and modern hives, with forage from regional wild flora.",
      "No supplemental feeding is used during harvest flow; only the stated estate harvest is collected.",
    ],
    harvesting: [
      "Harvested annually at the end of spring flow.",
      "Extracted by centrifuge without heat above ambient hive conditions.",
      "Coarsely strained to retain natural particulate and enzyme activity.",
    ],
  },

  laboratoryVerification: [
    "Pollen analysis confirms predominant botanical profile for each lot.",
    "Moisture, HMF, and diastase are monitored as indicators of freshness and heat exposure.",
    "Lots are screened for syrup or added sugar adulteration.",
    "Certificates are held on file and linked to lot number.",
  ],

  qualityAssurance: [
    "Each lot undergoes sensory review for aroma, clarity, and mouthfeel.",
    "Dispensed in glass with tamper-evident seal and lot traceability.",
    "Stock rotation follows harvest date and institutional best-before standards.",
  ],

  storage: [
    "Store at room temperature in a dry place away from direct light.",
    "Crystallisation is natural and does not indicate spoilage; warm gently if a liquid texture is preferred.",
    "Keep tightly sealed to reduce moisture uptake.",
    "Best used within twenty-four months of harvest; see label date.",
  ],

  preparation: [
    "May be taken by spoon or stirred into warm, not boiling, water.",
    "Traditionally combined with black seed oil; avoid adding to very hot liquids.",
  ],

  suggestedUse: [
    "Use as a food and traditional simple in moderate measure.",
    "May serve as a carrier for other simples when both monographs are reviewed.",
    "Topical food-grade use is recorded in folk practice; patch-test sensitive skin.",
  ],

  contraindications: [
    "Not suitable for infants under twelve months.",
    "A caloric sweetener, requiring moderation.",
    "Healing is from Allah; this remedy is a means and not a substitute for medical care.",
    "Avoid in severe bee-product allergy.",
  ],

  photographyDirection: [
    ...photographyGrammar,
    "Subject: raw honey in glass vessel with wooden dipper and restrained side light.",
    "Mood: quiet still life; material qualities should remain natural and unforced.",
    "Imagery must not imply guaranteed therapeutic outcome.",
  ],

  packaging: [
    "340g net in amber glass with metal lid and tamper band.",
    "Label includes botanical name, origin, harvest year, lot, best-before, and storage guidance.",
    "Shipped in protective, discreet outer packaging with lot reference.",
  ],

  shipping: standardShipping,
  returns: standardReturns,
  customerSupport: standardCustomerSupport,

  faq: [
    {
      question: "Why raw rather than filtered supermarket honey?",
      answer:
        "Fine filtration can remove pollen that supports origin verification and alters the natural profile. The standard here prioritises traceability and minimal processing over uniform appearance.",
    },
    {
      question: "Does revelation guarantee healing for every person?",
      answer:
        "No. Revelation is not presented here as a guarantee of individual outcome. Honey is presented as a named means within faith, diet, and tradition, with explicit limits.",
    },
    {
      question: "Can honey be used with black seed oil?",
      answer:
        "Yes, the tradition records this pairing. Read both monographs before combining remedies and adjust use responsibly.",
    },
    {
      question: "Is this honey pasteurised?",
      answer:
        "No. Freshness is managed through sourcing controls, moisture limits, and stock rotation rather than pasteurisation.",
    },
  ],

  relatedRemedies: ["black-seed-oil", "olive-oil"],
  academyLessons: [
    {
      title: "Foundations of Prophetic Medicine",
      href: "/the-academy/foundations",
      note: "The bee in revelation and report, including terminology and grading.",
    },
    {
      title: "The Materia Medica",
      href: "/the-academy/materia-medica",
      note: "Classical use of simples and compound preparations.",
    },
  ],
  knowledgeLibrary: [
    {
      title: "Honey",
      href: "/knowledge-library/honey",
      note: "Institutional note on revelation, transmission, and traditional standing.",
    },
    {
      title: "Nutrition in the Sunnah",
      href: "/knowledge-library/nutrition",
      note: "Food, discipline, and moderation in the Sunnah.",
    },
  ],
  pathways: [
    { label: "The Materia Medica", href: "/the-academy/materia-medica", department: "Academy" },
    { label: "The Desert Way", href: "/sacred-journeys/desert-way", department: "Sacred Journeys" },
    { label: "Honey — Knowledge Library", href: "/knowledge-library/honey", department: "Knowledge Library" },
  ],

  volume: "340g",
  price: 18,
  priceNote: "includes delivery within the United Kingdom",
  inStock: true,
};
