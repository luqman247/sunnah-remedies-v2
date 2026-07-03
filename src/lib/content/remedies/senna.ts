import type { Remedy } from "../types";

export const senna: Remedy = {
  slug: "senna",
  name: "Senna",
  transliteration: "al-sanā makkī",
  botanicalName: "Senna alexandrina",
  nature:
    "Whole dried pods of Senna alexandrina — a botanical named in Prophetic report and recorded across the classical materia medica, offered with explicit bounds on use.",
  folio: "iv",
  figure: "senna",
  figureAlt:
    "Dried senna pods in a linen pouch, composed still-life with warm natural light.",

  historicalContext: [
    "Senna entered the Mediterranean pharmacopoeia before Islam and was integrated into Arabic medicine under names that the Prophetic literature later associated with sanā makkī — Meccan senna — distinguished by the commentators from related species.",
    "Ibn al-Qayyim lists senna among the laxative simples, with warnings about excess that the institution repeats without softening. A strong simple demands strong honesty.",
    "The hospitals of the Islamic world used senna in decoction, often with tamarind or other moderating agents. This dispensation is the pod alone, so the person prepares deliberately rather than receiving an opaque compound.",
  ],

  propheticReferences: [
    {
      statement:
        "If anything is good for this, it is senna.",
      transliteration:
        "wa-hal min shayʾin khayrun min al-sanā makkī",
      grade: "Reported",
      source: "Sunan Abī Dāwūd · Kitāb al-Ṭibb",
      standing: "Reported narration · graded ḥasan by the scholars of ḥadīth",
      siglum: "D1",
      attribution: "hadith",
    },
  ],

  traditionalUsage: [
    "Prepared as a decoction from crushed or whole pods, steeped in hot water, strained, and taken in modest measure — typically for short periods when the body needs gentle support.",
    "Classical authors class senna among the purgatives. The tradition speaks of cleansing the stomach; the institution states plainly that this is occasional support, not daily habit.",
    "Often combined in historical texts with other simples to moderate effect. We advise reading the preparation section before use and consulting a practitioner if symptoms persist.",
  ],

  evidenceInformed: [
    "Senna is recognised in pharmacopoeias as a source of anthraquinone glycosides with laxative action. Effect and onset are documented; so are limits on duration of use.",
    "Prolonged use without supervision may cause dependence on laxatives and electrolyte disturbance. The institution advises occasional use only.",
    "Not appropriate during pregnancy, lactation, or for children under twelve except under direct medical supervision.",
  ],

  sourcing: [
    "Cultivated in the Wadi Hadramawt, Yemen — harvest traced to field and drying batch.",
    "Whole pods, hand-sorted to remove stem fragments and foreign matter.",
    "Dried under shade cloth to preserve colour and constituent profile; not oven-dried.",
  ],

  qualityAssurance: [
    "Botanical identity verified as Senna alexandrina against pharmacopoeial description.",
    "Moisture content controlled to prevent mould in transit.",
    "Light-protective packaging with desiccant sachet where humidity risk warrants.",
    "Decoction instructions and limits printed on the inner label — not merely on a website.",
  ],

  storage: [
    "Store in the sealed pouch in a cool, dry place.",
    "Reseal after opening. Use within three months of opening.",
    "Discard if mould, must, or unexpected odour appears.",
  ],

  preparation: [
    "Crush one to two pods lightly. Steep in approximately 200ml freshly boiled water for ten to fifteen minutes. Strain before taking.",
    "Begin with the lower measure. Take in the evening if using for the first time.",
    "Use for a short period only — typically not more than several consecutive days without professional guidance.",
    "Full instructions enclosed with dispensation. Do not exceed the measure on the label.",
  ],

  honestLimits: [
    "It is a means, not a cure. Healing is from Allah.",
    "For occasional use only. Not a daily food.",
    "Not suitable during pregnancy, while nursing, or for children under twelve.",
    "Persistent change in bowel habit requires medical assessment — do not self-treat indefinitely.",
    "A remedy is not a substitute for a physician.",
  ],

  faq: [
    {
      question: "Why is the Prophetic reference graded Reported?",
      answer:
        "The institution grades every claim. This narration is accepted and cited in Tibb al-Nabawī, but we name its grade as the isnād discipline requires — never dressing Reported as Established.",
    },
    {
      question: "Can senna be taken daily for detox?",
      answer:
        "The institution does not use the word detox. Daily purgative use is not responsible practice. Senna is offered for occasional, bounded use — not regimen or cleanse.",
    },
    {
      question: "Is this the same as leaves sold in shops?",
      answer:
        "We dispense whole pods of Senna alexandrina identified to species. Generic 'senna tea' may differ in species, leaf-to-pod ratio, and age. Traceability is the difference.",
    },
    {
      question: "Should I combine senna with other remedies?",
      answer:
        "Classical texts sometimes combine it with moderating agents. If you use other means from this cabinet, read both monographs and consider consultation — interaction is your responsibility to judge with competent advice.",
    },
  ],

  relatedRemedies: ["honey"],
  suggestedReading: [
    {
      title: "The Materia Medica — Purgative Simples",
      href: "/the-academy/materia-medica",
      note: "Classical bounds on senna and related botanicals.",
    },
    {
      title: "Clinical Practice & Ethics",
      href: "/the-academy/clinical-ethics",
      note: "When to refer — the practitioner's duty of limits.",
    },
  ],
  pathways: [
    {
      label: "The Materia Medica",
      href: "/the-academy/materia-medica",
      department: "Academy",
    },
  ],

  volume: "100g",
  price: 12,
  priceNote: "incl. delivery within the United Kingdom",
  inStock: true,
};
