import type { Remedy } from "../types";

export const honey: Remedy = {
  slug: "honey",
  name: "Honey",
  transliteration: "al-ʿasal",
  botanicalName: "Apis mellifera",
  nature:
    "Raw, unprocessed honey from mountain apiaries — named in revelation and repeatedly praised in the Prophetic tradition as nourishment and means.",
  folio: "iii",
  figure: "honey",
  figureAlt:
    "Raw honey in a glass jar beside a wooden dipper, warm side-light and deep margin.",

  historicalContext: [
    "Honey is among the oldest foods of civilisation and among the most clearly named in the Qur'an. Sūrat al-Naḥl links the bee, the hive, and a drink in which the revelation itself places shifāʾ — a word the institution renders with the caution the tafsīr tradition teaches.",
    "The Prophetic household used honey routinely. Reports describe it at the table, in simple preparations, and in the care of the unwell — always as part of a broader ethic of means and trust in Allah, not as a magical substitute for treatment.",
    "Islamic medical writers — from al-Rāzī to Ibn Sīnā to the authors of Tibb al-Nabawī — catalogued honey's place in compound remedies and diet. The institution offers it unblended so that the person knows precisely what they receive.",
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

  traditionalUsage: [
    "Taken by the spoonful, dissolved in warm water, or combined with other simples — notably black seed and olive oil in combinations the classical texts record.",
    "The tradition associates honey with soothing the throat, supporting appetite, and restoring strength after illness — associations, not prescriptions.",
    "Used externally in some classical preparations for the skin; this dispensation is food-grade and intended chiefly for oral use.",
  ],

  evidenceInformed: [
    "Honey is recognised in modern wound-care literature in specific clinical contexts — not interchangeable with table use. The institution does not transfer hospital evidence to kitchen use.",
    "As a sweetener, honey affects blood glucose; persons with diabetes or insulin resistance should consult a physician.",
    "Infants under twelve months must not receive honey, due to the established risk of infant botulism — a limit the institution states plainly.",
  ],

  sourcing: [
    "Mountain apiaries in the Rif region, northern Morocco — single-origin, not blended across continents.",
    "Harvested once annually at the end of the spring flow. No supplemental feeding during the harvest period.",
    "Extracted by centrifuge without heat beyond ambient hive temperature. Coarse straining only; pollen and enzymatic activity retained.",
  ],

  qualityAssurance: [
    "Pollen analysis confirms predominant botanical origin for each lot.",
    "Moisture content below 18%. HMF and diastase activity monitored as markers of freshness and heat exposure.",
    "Adulteration screen for syrups and added sugars — zero tolerance.",
    "Jarred in glass with tamper-evident seal. Lot number on base.",
  ],

  storage: [
    "Store at room temperature in a dry cupboard, away from direct sun.",
    "Crystallisation is natural and does not indicate spoilage. Warm gently in a water bath if liquid consistency is preferred.",
    "Keep the lid sealed to limit moisture uptake.",
    "Best within twenty-four months of harvest; best-before date on label.",
  ],

  preparation: [
    "May be taken alone by the spoonful or stirred into warm — not boiling — water.",
    "Traditionally combined with black seed oil; add oil to honey, not honey to very hot liquids.",
    "Do not give to infants under twelve months.",
  ],

  honestLimits: [
    "It is a means, not a cure. Healing is from Allah.",
    "Not suitable for infants under twelve months.",
    "A caloric sweetener — moderation is part of responsible use.",
    "A remedy is not a substitute for a physician.",
  ],

  faq: [
    {
      question: "Why raw rather than filtered supermarket honey?",
      answer:
        "Fine filtration removes pollen that helps confirm origin and is part of the natural food. Our standard prioritises traceability and minimal processing over uniform appearance.",
    },
    {
      question: "Does revelation guarantee healing for every person?",
      answer:
        "The institution does not interpret revelation as a promise of individual outcome. We present honey as a named means within faith, diet, and tradition — with the limits honest speech requires.",
    },
    {
      question: "Can honey be used with black seed oil?",
      answer:
        "The tradition often pairs them. Many take a measure of oil with honey as a carrier. Both monographs should be read before combining means.",
    },
    {
      question: "Is this honey pasteurised?",
      answer:
        "No. It is not heated for shelf stability. Freshness is managed through sourcing, moisture control, and rotation — not sterilisation that alters character.",
    },
  ],

  relatedRemedies: ["black-seed-oil", "olive-oil"],
  suggestedReading: [
    {
      title: "Sūrat al-Naḥl — the bee in tafsīr",
      href: "/the-academy/foundations/surat-al-nahl",
      note: "The Academy lecture on the revelatory context of honey.",
    },
    {
      title: "The Materia Medica — Honey",
      href: "/the-academy/materia-medica",
      note: "Classical compound preparations and simple use.",
    },
  ],
  pathways: [
    {
      label: "The Materia Medica",
      href: "/the-academy/materia-medica",
      department: "Academy",
    },
    {
      label: "The Desert Way",
      href: "/sacred-journeys/desert-way",
      department: "Sacred Journeys",
    },
  ],

  volume: "340g",
  price: 18,
  priceNote: "incl. delivery within the United Kingdom",
  inStock: true,
};
