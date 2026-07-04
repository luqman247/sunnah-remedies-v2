/**
 * Volume I — Foundations of Revelation
 *
 * The inaugural volume of the Sunnah Remedies Digital Library.
 * A broad collection across the foundational themes of healing,
 * provision, patience, gratitude, knowledge, reflection, mercy,
 * trust, supplication, creation, and purification.
 */

import type { RevelationEntry, Volume, Category } from "../../schema";
import { healingCollection } from "./healing";
import { provisionCollection } from "./provision";
import { patienceCollection } from "./patience";
import { gratitudeCollection } from "./gratitude";
import { knowledgeCollection } from "./knowledge";
import { reflectionCollection } from "./reflection";
import { mercyCollection } from "./mercy";
import { trustCollection } from "./trust";
import { supplicationCollection } from "./supplication";
import { creationCollection } from "./creation";
import { purificationCollection } from "./purification";

const allEntries: RevelationEntry[] = [
  ...healingCollection,
  ...provisionCollection,
  ...patienceCollection,
  ...gratitudeCollection,
  ...knowledgeCollection,
  ...reflectionCollection,
  ...mercyCollection,
  ...trustCollection,
  ...supplicationCollection,
  ...creationCollection,
  ...purificationCollection,
];

const seen = new Set<string>();
const deduped: RevelationEntry[] = [];
for (const entry of allEntries) {
  if (!seen.has(entry.id)) {
    seen.add(entry.id);
    deduped.push(entry);
  }
}

/** Volume I manifest. */
export const volumeI: Volume = {
  id: "volume-i",
  number: 1,
  numeral: "I",
  title: "Foundations of Revelation",
  subtitle: "Authentic Qurʼanic verses and Prophetic traditions across the foundational themes of Islamic wellbeing",
  description:
    "The inaugural volume of the Sunnah Remedies Digital Library. " +
    "A carefully curated collection of authentic Qurʼanic verses and " +
    "Sahih/Hasan hadith, spanning the foundational themes upon which " +
    "the institution is built: healing, provision, patience, gratitude, " +
    "knowledge, reflection, mercy, trust, supplication, creation, " +
    "and purification.",
  subjects: [
    "healing", "provision", "patience", "gratitude",
    "knowledge", "reflection", "mercy", "trust",
    "supplication", "creation", "purification",
  ],
  publishedDate: "2026-07-04",
  editorialStatus: "published",
  entries: deduped,
};

export default volumeI;
