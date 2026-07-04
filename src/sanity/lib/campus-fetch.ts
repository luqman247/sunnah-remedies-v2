/**
 * Phase 9 — Campus Sanity Fetch
 */

import { safeFetch } from "@/sanity/lib/fetch";
import { groq } from "next-sanity";
import {
  getStaticCampusCourse,
  getAllStaticCampusCourses,
  type CampusCourse,
  type CampusLesson,
} from "@/lib/content/campus";

const campusCoursesQuery = groq`
  *[_type == "campusCourse" && language == $language] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    readingList,
    "programmeSlug": programme->slug.current
  }
`;

const campusCourseBySlugQuery = groq`
  *[_type == "campusCourse" && slug.current == $slug && language == $language][0] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    readingList,
    "programmeSlug": programme->slug.current
  }
`;

const campusLessonsQuery = groq`
  *[_type == "campusLesson" && course._ref == $courseId && language == $language]
    | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    order,
    description,
    readingList,
    "videoPublicId": video->cloudinaryAssetId,
    downloads
  }
`;

const campusLessonBySlugQuery = groq`
  *[_type == "campusLesson" && slug.current == $slug && course->slug.current == $courseSlug
    && language == $language][0] {
    _id,
    title,
    "slug": slug.current,
    order,
    description,
    body,
    readingList,
    "videoPublicId": video->cloudinaryAssetId,
    "courseRef": course._ref,
    downloads
  }
`;

const studentAnnouncementsQuery = groq`
  *[_type == "announcement"
    && active == true
    && department == "student"
    && (!defined(startDate) || startDate <= now())
    && (!defined(endDate) || endDate >= now())
  ] | order(_updatedAt desc) {
    _id,
    message,
    link,
    startDate
  }
`;

export async function getCampusCourses(locale: string): Promise<CampusCourse[]> {
  const sanity = await safeFetch<Array<{
    _id: string;
    title: string;
    slug: string;
    subtitle?: string;
    readingList?: string[];
    programmeSlug?: string;
  }>>(campusCoursesQuery, {}, locale);

  if (sanity?.length) {
    const courses: CampusCourse[] = [];
    for (const c of sanity) {
      const lessons = await getCampusLessons(c._id, locale);
      courses.push({
        ref: c._id,
        slug: c.slug,
        name: c.title,
        subtitle: c.subtitle ?? "",
        programmeSlug: c.programmeSlug ?? c.slug,
        lessons,
        readingList: c.readingList ?? [],
      });
    }
    return courses;
  }

  return getAllStaticCampusCourses();
}

export async function getCampusCourseBySlug(
  slug: string,
  locale: string
): Promise<CampusCourse | null> {
  const sanity = await safeFetch<{
    _id: string;
    title: string;
    slug: string;
    subtitle?: string;
    readingList?: string[];
    programmeSlug?: string;
  }>(campusCourseBySlugQuery, { slug }, locale);

  if (sanity) {
    const lessons = await getCampusLessons(sanity._id, locale);
    return {
      ref: sanity._id,
      slug: sanity.slug,
      name: sanity.title,
      subtitle: sanity.subtitle ?? "",
      programmeSlug: sanity.programmeSlug ?? sanity.slug,
      lessons,
      readingList: sanity.readingList ?? [],
    };
  }

  return getStaticCampusCourse(slug);
}

async function getCampusLessons(
  courseId: string,
  locale: string
): Promise<CampusLesson[]> {
  const rows = await safeFetch<Array<{
    _id: string;
    title: string;
    slug: string;
    order: number;
    description?: string;
    readingList?: string[];
    videoPublicId?: string;
  }>>(campusLessonsQuery, { courseId }, locale);

  if (!rows?.length) return [];

  return rows.map((l) => ({
    ref: l._id,
    slug: l.slug,
    title: l.title,
    moduleNumber: String(l.order),
    description: l.description ?? "",
    sources: l.readingList ?? [],
    order: l.order,
    videoPublicId: l.videoPublicId,
    readingList: l.readingList,
  }));
}

export async function getCampusLesson(
  courseSlug: string,
  lessonSlug: string,
  locale: string
) {
  const sanity = await safeFetch<{
    _id: string;
    title: string;
    slug: string;
    order: number;
    description?: string;
    body?: unknown[];
    readingList?: string[];
    videoPublicId?: string;
    courseRef: string;
    downloads?: Array<{ fileName?: string; url?: string }>;
  }>(campusLessonBySlugQuery, { courseSlug, slug: lessonSlug }, locale);

  if (sanity) {
    return {
      ref: sanity._id,
      slug: sanity.slug,
      title: sanity.title,
      order: sanity.order,
      description: sanity.description ?? "",
      body: sanity.body,
      readingList: sanity.readingList ?? [],
      videoPublicId: sanity.videoPublicId,
      courseRef: sanity.courseRef,
      downloads: sanity.downloads ?? [],
    };
  }

  const course = getStaticCampusCourse(courseSlug);
  const lesson = course?.lessons.find((l) => l.slug === lessonSlug);
  if (!course || !lesson) return null;

  return {
    ref: lesson.ref,
    slug: lesson.slug,
    title: lesson.title,
    order: lesson.order,
    description: lesson.description,
    body: null,
    readingList: lesson.readingList ?? lesson.sources,
    videoPublicId: lesson.videoPublicId,
    courseRef: course.ref,
    downloads: [],
  };
}

export async function getStudentAnnouncements() {
  return (
    (await safeFetch<Array<{ _id: string; message: string; link?: { label?: string; href?: string } }>>(
      studentAnnouncementsQuery,
      {},
      "en"
    )) ?? []
  );
}
