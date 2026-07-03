import type { Remedy } from "../types";

export const oliveOil: Remedy = {
  slug: "olive-oil",
  name: "Olive Oil",
  transliteration: "zayt",
  botanicalName: "Olea europaea",
  nature:
    "First cold-pressed extra virgin oil from ancient groves — the blessed tree of revelation, a daily nourishment of the Prophetic tradition.",
  folio: "v",
  figure: "olive",
  figureAlt:
    "Green olive oil in a dark glass bottle beside fresh olive branches, side-lit with generous margin.",

  historicalContext: [
    "The olive is named in the Qur'an as a blessed tree — shajarah mubārakah — and its oil was the fat of the Mediterranean Islamic world: lamp, food, anointing, medicine.",
    "The Prophetic reports on olive oil appear in the chapters of medicine across the collections. The household of the Prophet ﷺ consumed oil and used it on the body — a double use the tradition preserves without collapsing food into pharmacy.",
    "Andalusian and Levantine groves supplied the hospitals and the kitchens alike. The institution sources from Nablus not for romance but because estate pressing allows a single chain from tree to bottle.",
  ],

  propheticReferences: [
    {
      statement:
        "Eat olive oil and anoint yourselves with it, for it comes from a blessed tree.",
      transliteration: "kullū al-zayta wa-dahtanū bihi fa-innahu min shajara mubāraka",
      grade: "Established",
      source: "Sunan al-Tirmidhī · Kitāb al-Ṭibb",
      standing: "Established narration · graded ṣaḥīḥ by al-Tirmidhī",
      siglum: "T1",
      attribution: "hadith",
    },
    {
      statement:
        "It is blessed tree oil.",
      transliteration: "huwa zaytu shajara mubāraka",
      grade: "Reported",
      source: "Sunan al-Tirmidhī · Kitāb al-Ṭibb",
      standing: "Supporting narration in the same chapter",
      siglum: "T2",
      attribution: "hadith",
    },
  ],

  traditionalUsage: [
    "Taken by the spoonful on rising, used in cooking, and applied to the skin and hair in moderate measure — the tradition does not sharply separate nourishment from anointing.",
    "Ibn al-Qayyim discusses olive oil among the oils of general fortification. It is diet first; any medicinal association is secondary and bounded.",
    "The institution recommends this oil primarily as food. External use should avoid broken or infected skin unless a practitioner directs otherwise.",
  ],

  evidenceInformed: [
    "Extra virgin olive oil is among the most studied dietary fats — associated in population research with Mediterranean dietary patterns. The institution does not reduce revelation to epidemiology.",
    "As a fat, it is calorically dense. It is offered as a wholesome food, not a supplement for targeted disease modification.",
    "Persons with gallbladder disease or fat malabsorption should consult a physician before increasing fat intake.",
  ],

  sourcing: [
    "Estate groves in the hills above Nablus, Palestine — cultivar Nabali Baladi, hand-harvested.",
    "Pressed within hours of harvest. First extraction only. Acidity below 0.3%.",
    "Unfiltered by choice; slight sediment is natural and not a defect.",
  ],

  qualityAssurance: [
    "Sensory evaluation and chemical panel per IOC extra virgin standard.",
    "Storage in dark glass from pressing to dispensation — no plastic contact with oil.",
    "Lot linked to harvest week and pressing run.",
    "No blending with oils from other regions or seasons.",
  ],

  storage: [
    "Store away from light and heat — a cool pantry, not above the stove.",
    "Use within eighteen months of pressing; harvest year on label.",
    "Close cap firmly after use. Oxygen and light are the enemies of quality.",
    "Refrigeration is unnecessary; clouding at cool temperatures reverses on warming.",
  ],

  preparation: [
    "Use raw for fullest character — on bread, salads, and finished dishes.",
    "May be warmed gently; avoid smoking point if cooking, though the institution prefers raw use for this grade.",
    "For traditional oral measure, a tablespoon with breakfast is commonly cited in folk practice; adjust to your diet and counsel.",
  ],

  honestLimits: [
    "It is a means, not a cure. Healing is from Allah.",
    "A food first — not a clinical intervention.",
    "Calorically dense; moderation is part of responsible use.",
    "A remedy is not a substitute for a physician.",
  ],

  faq: [
    {
      question: "Why unfiltered?",
      answer:
        "Filtration clarifies appearance but removes particulate that carries flavour and tradition. Slight sediment is expected and safe.",
    },
    {
      question: "Can I use this oil on the skin as the ḥadīth mentions?",
      answer:
        "Food-grade olive oil has long been used topically in modest measure. Avoid open wounds unless directed by a practitioner. Patch-test if you have sensitive skin.",
    },
    {
      question: "How does this relate to the blessed tree in the Qur'an?",
      answer:
        "The revelation and the Prophetic reports use the language of blessing — barakah — which the scholars distinguish from guaranteed medical outcome. We honour the text without exploiting it for sales.",
    },
    {
      question: "Why Nablus?",
      answer:
        "Estate traceability from a grove with documented cultivar and pressing on site. Origin is disclosed; it is not a marketing story.",
    },
  ],

  relatedRemedies: ["honey", "black-seed-oil"],
  suggestedReading: [
    {
      title: "Foundations of Prophetic Medicine",
      href: "/the-academy/foundations",
      note: "The olive in revelation and report — an introductory lecture.",
    },
    {
      title: "The Olive Grove retreat",
      href: "/sacred-journeys/olive-grove",
      note: "Sacred Journeys — embodiment among the groves.",
    },
  ],
  pathways: [
    {
      label: "Foundations of Prophetic Medicine",
      href: "/the-academy/foundations",
      department: "Academy",
    },
    {
      label: "The Olive Grove retreat",
      href: "/sacred-journeys/olive-grove",
      department: "Sacred Journeys",
    },
  ],

  volume: "500ml",
  price: 22,
  priceNote: "incl. delivery within the United Kingdom",
  inStock: true,
};
