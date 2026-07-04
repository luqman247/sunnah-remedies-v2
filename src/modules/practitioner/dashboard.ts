/**
 * Phase 9 — Practitioner Dashboard Service
 */

import { getAccountById } from "@/modules/identity/service";
import { getCpdSummary } from "@/modules/practitioner/cpd";
import { getSavedResources } from "@/modules/practitioner/resources";
import { getDigitalCredentials } from "@/modules/practitioner/credentials";
import { getPractitionerProfile } from "@/modules/practitioner/profile";
import {
  getClinicalProtocols,
  getPractitionerAnnouncements,
  getPractitionerResources,
} from "@/sanity/lib/practitioner-fetch";

export async function getPractitionerDashboard(
  accountId: string,
  locale: string
) {
  const [
    account,
    cpd,
    saved,
    credentials,
    profile,
    protocols,
    announcements,
    resources,
  ] = await Promise.all([
    getAccountById(accountId),
    getCpdSummary(accountId),
    getSavedResources(accountId),
    getDigitalCredentials(accountId),
    getPractitionerProfile(accountId),
    getClinicalProtocols(locale),
    getPractitionerAnnouncements(),
    getPractitionerResources(locale),
  ]);

  return {
    account,
    cpd,
    savedCount: saved.length,
    credentials,
    profile,
    recentProtocols: protocols.slice(0, 3),
    announcements: announcements.slice(0, 5),
    recentResources: resources.slice(0, 3),
  };
}
