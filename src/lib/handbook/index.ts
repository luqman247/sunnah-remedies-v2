import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Handbook chapter loader.
 *
 * Reads the Phase 4 Institutional Operations Handbook markdown files
 * from the docs directory and provides them to the staff handbook pages.
 *
 * Architectural decision: chapters are read from the filesystem at build time
 * (or request time in dev) rather than stored in a database. This means:
 * - The handbook is version-controlled alongside the codebase
 * - Changes go through code review (matching the Handbook's own doc-control process)
 * - No additional infrastructure required
 * - Plain markdown is readable by anything, forever
 *
 * @see Phase 4, Chapter 14.5 — Document control
 */

const HANDBOOK_DIR = join(process.cwd(), "docs", "phase 4");

export interface HandbookChapter {
  slug: string;
  filename: string;
  title: string;
  number: string;
  content: string;
}

const CHAPTER_META: Record<string, string> = {
  "00": "Welcome & How to Use This Handbook",
  "01": "The Institution: Mission, Values & Adab",
  "02": "People Operations: Roles, Onboarding, Conduct & Development",
  "03": "The Headquarters: Spaces, Opening & Front of House",
  "04": "Health, Safety, Compliance & Safeguarding",
  "05": "The Dispensary & Apothecary",
  "06": "The Clinic: Consultations, Hijama & Clinical Governance",
  "07": "The Academy: Teaching Operations",
  "08": "Sacred Journeys: Office Operations & Duty of Care",
  "09": "The Editorial Desk & Reading Room",
  "10": "The Photography Studio & Media Operations",
  "11": "Technology & Systems: The Developer Handbook",
  "12": "Governance, Approvals & Escalation",
  "13": "Quality Standards & the QA Library",
  "14": "Reference: Master Checklists, Forms, Glossary & Document Control",
};

export function getChapterList(): Omit<HandbookChapter, "content">[] {
  return Object.entries(CHAPTER_META).map(([number, title]) => ({
    slug: number,
    filename: getFilenameForChapter(number),
    title,
    number,
  }));
}

export function getChapter(slug: string): HandbookChapter | null {
  const number = slug.padStart(2, "0");
  const title = CHAPTER_META[number];
  if (!title) return null;

  const filename = getFilenameForChapter(number);
  const filepath = join(HANDBOOK_DIR, filename);

  try {
    const content = readFileSync(filepath, "utf-8");
    return { slug: number, filename, title, number, content };
  } catch {
    return null;
  }
}

export function getAllChapters(): HandbookChapter[] {
  return Object.keys(CHAPTER_META)
    .map((number) => getChapter(number))
    .filter((ch): ch is HandbookChapter => ch !== null);
}

function getFilenameForChapter(number: string): string {
  try {
    const files = readdirSync(HANDBOOK_DIR);
    const match = files.find((f) => f.startsWith(number) && f.endsWith(".md"));
    return match || `${number}.md`;
  } catch {
    return `${number}.md`;
  }
}
