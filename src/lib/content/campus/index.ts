/**
 * Phase 9 — Static campus course content (fallback when Sanity LMS empty)
 */

import { hijamaDiploma } from "@/lib/content/academy/hijama-diploma";

export interface CampusLesson {
  ref: string;
  slug: string;
  title: string;
  moduleNumber: string;
  description: string;
  sources: string[];
  practical?: string;
  order: number;
  videoPublicId?: string;
  readingList?: string[];
}

export interface CampusCourse {
  ref: string;
  slug: string;
  name: string;
  subtitle: string;
  programmeSlug: string;
  lessons: CampusLesson[];
  readingList: string[];
}

export function getStaticCampusCourse(slug: string): CampusCourse | null {
  if (slug !== "hijama-diploma" && slug !== "hijama") return null;

  const programme = hijamaDiploma;
  const courseSlug = "hijama-diploma";

  const lessons: CampusLesson[] = programme.curriculum.map((mod, i) => ({
    ref: `static-lesson-${mod.number}`,
    slug: `module-${mod.number.toLowerCase()}`,
    title: mod.title,
    moduleNumber: mod.number,
    description: mod.description,
    sources: mod.sources,
    practical: mod.practical,
    order: i + 1,
    readingList: mod.sources,
  }));

  return {
    ref: "static-course-hijama-diploma",
    slug: courseSlug,
    name: programme.name,
    subtitle: programme.subtitle,
    programmeSlug: programme.slug,
    lessons,
    readingList: programme.curriculum.flatMap((m) => m.sources),
  };
}

export function getAllStaticCampusCourses(): CampusCourse[] {
  const course = getStaticCampusCourse("hijama-diploma");
  return course ? [course] : [];
}
