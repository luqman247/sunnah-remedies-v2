/**
 * Phase 9 — Practitioner Portal Navigation
 */

import type { Department } from "@/lib/navigation/site-structure";

export const practitionerPortal: Department = {
  id: "practitioner-portal",
  label: "Practitioner Portal",
  href: "/portal/practitioner",
  sections: [
    {
      label: "Dashboard",
      href: "/portal/practitioner",
      description: "Overview, announcements, and next actions",
    },
    {
      label: "Clinical protocols",
      href: "/portal/practitioner/protocols",
      description: "Versioned guidance reviewed by faculty",
    },
    {
      label: "Downloads",
      href: "/portal/practitioner/downloads",
      description: "Templates, patient resources, and treatment guides",
    },
    {
      label: "Research library",
      href: "/portal/practitioner/research",
      description: "Publications and institutional research briefings",
    },
    {
      label: "Practice updates",
      href: "/portal/practitioner/updates",
      description: "Clinical announcements and faculty notices",
    },
    {
      label: "CPD ledger",
      href: "/portal/practitioner/cpd",
      description: "Continuing professional development record",
    },
    {
      label: "Certificates",
      href: "/portal/practitioner/certificates",
      description: "Course and event credentials held",
    },
    {
      label: "Digital credentials",
      href: "/portal/practitioner/credentials",
      description: "Verifiable badges and verification status",
    },
    {
      label: "Professional profile",
      href: "/portal/practitioner/profile",
      description: "Scope of practice and registration details",
    },
    {
      label: "Saved resources",
      href: "/portal/practitioner/saved",
      description: "Private bookmarks across the portal",
    },
  ],
};
