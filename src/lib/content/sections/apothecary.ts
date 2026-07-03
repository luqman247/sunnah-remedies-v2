import type { FaqItem } from "@/lib/content/types";

export const apothecaryFaqs: FaqItem[] = [
  {
    question: "Is the Apothecary a shop?",
    answer:
      "No. It is the institution's dispensary, where each remedy is accompanied by a monograph for review before request.",
  },
  {
    question: "How do I request a remedy?",
    answer:
      "Read the monograph in full, add the remedy to the counter when you understand the request, and complete the dispensation sequence. Guest dispensation is available without account creation.",
  },
  {
    question: "Do you claim cures?",
    answer:
      "No. The institution offers remedies as means within the evidence of the tradition. Healing is from Allah, and each monograph states its limits plainly.",
  },
  {
    question: "How is quality assured?",
    answer:
      "Every batch is held to institutional quality standards. Selected lines undergo independent laboratory verification, with certificates available on request.",
  },
  {
    question: "Can I speak to someone before ordering?",
    answer:
      "Yes. Correspondence is answered in a considered and timely manner. For clinical questions, request a consultation; the Apothecary does not diagnose.",
  },
];

export const qualityStandards = [
  {
    title: "Sourcing",
    body: [
      "Each supplier is reviewed for traceability, harvest practice, and documentation. Origin, harvest date, and chain of custody are recorded before entry to the cabinet.",
      "Stock that cannot be adequately traced is not accepted for dispensation.",
    ],
  },
  {
    title: "Storage & handling",
    body: [
      "Simples are stored under controlled light, humidity, and temperature conditions. Cold-pressed oils are rotated by batch date, and honey and dried simples are sealed and dated.",
      "Staff handling follows institutional protocol ICS-AP1. Dedicated equipment is used where required to reduce cross-batch contamination risk.",
    ],
  },
  {
    title: "Dispensation",
    body: [
      "Each order is prepared against the monograph record for grade, measure, and labelling accuracy. Requesters review tradition, benefits, limits, and sourcing before fee confirmation.",
      "Dispatch is handled in a considered and timely manner without urgency-based sales language.",
    ],
  },
];

export const laboratoryVerification = [
  {
    title: "What is verified",
    body: [
      "Independent laboratories test selected batches for identity, purity, and class-relevant contaminants, including heavy metals in oils, honey adulteration, and microbiological parameters where applicable.",
      "Verification supports sourcing discipline and does not replace it. Material without traceable origin is not accepted.",
    ],
  },
  {
    title: "Batch records",
    body: [
      "Each verified batch carries a lot number linked to a certificate on file. Certificates may be requested by lot through correspondence.",
      "Batches that fail standards are not dispensed. Supplier performance is reviewed and records are corrected as needed.",
    ],
  },
  {
    title: "Limits of analysis",
    body: [
      "Laboratory verification confirms material identity and safety within stated parameters. It does not establish therapeutic outcome, and no cure claim is made.",
      "Traditional standing and Prophetic references are graded separately within the monograph framework.",
    ],
  },
];

export const ingredientLibraryIntro =
  "The ingredient library identifies each simple and preparation in botanical and traditional terms before product form. Cross-reference the monograph before requesting dispensation.";

export const ingredients = [
  {
    name: "Black seed",
    latin: "Nigella sativa",
    arabic: "al-ḥabbah al-sawdāʾ",
    note: "Named in transmitted report and offered as cold-pressed oil or whole seed.",
    href: "/the-apothecary/black-seed-oil",
  },
  {
    name: "Honey",
    latin: "Apis mellifera",
    arabic: "al-ʿasal",
    note: "Named in revelation and dispensed as raw, unprocessed mountain honey.",
    href: "/the-apothecary/honey",
  },
  {
    name: "Senna",
    latin: "Senna alexandrina",
    arabic: "al-sanā",
    note: "Classical simple for occasional use, with limits stated in the monograph.",
    href: "/the-apothecary/senna",
  },
  {
    name: "Olive oil",
    latin: "Olea europaea",
    arabic: "al-zayt",
    note: "Cold-pressed, single-origin oil associated with the blessed tree in revelation.",
    href: "/the-apothecary/olive-oil",
  },
];
