/**
 * Phase 9 — Student Portal Navigation
 */

import type { Department } from "@/lib/navigation/site-structure";

export const studentPortal: Department = {
  id: "student-portal",
  label: "Digital Campus",
  href: "/portal/student",
  sections: [
    {
      label: "Dashboard",
      href: "/portal/student",
      description: "Current courses, next lesson, and announcements",
    },
    {
      label: "My courses",
      href: "/portal/student/courses",
      description: "Enrolled programmes and progress",
    },
    {
      label: "Revision",
      href: "/portal/student/revision",
      description: "Flashcards and revision notes",
    },
    {
      label: "Assignments",
      href: "/portal/student/assignments",
      description: "Submissions and faculty feedback",
    },
    {
      label: "AI Tutor",
      href: "/portal/student/tutor",
      description: "Course-context guidance grounded in institutional sources",
    },
    {
      label: "Calendar",
      href: "/portal/student/calendar",
      description: "Office hours, study circles, and events",
    },
    {
      label: "Certificates",
      href: "/portal/student/certificates",
      description: "Credentials issued on completion",
    },
    {
      label: "Saved resources",
      href: "/portal/student/saved",
      description: "Private bookmarks across the campus",
    },
  ],
};
