/**
 * Phase 8 — HubSpot CRM Sync (One-Way, Non-Clinical Only)
 *
 * Syncs non-clinical contacts from the canonical app DB to HubSpot
 * for marketing automation and pipeline management.
 *
 * Clinical/patient data NEVER leaves the controlled store.
 * Patient records are NEVER mirrored to HubSpot.
 */

import { db, schema } from "../../db";
import { eq, and, ne } from "drizzle-orm";
import { logger } from "../../logging";
import { checkRateLimit, rateLimits } from "../../queue";

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY ?? "";
const HUBSPOT_API_URL = "https://api.hubapi.com";

export async function syncContactToHubSpot(personId: string): Promise<boolean> {
  if (!HUBSPOT_API_KEY) {
    logger.warn("HubSpot API key not configured — skipping sync");
    return false;
  }

  const person = await db
    .select()
    .from(schema.people)
    .where(eq(schema.people.id, personId))
    .limit(1);

  if (!person[0]) return false;

  const roles = await db
    .select()
    .from(schema.personRoles)
    .where(eq(schema.personRoles.personId, personId));

  const hasPatientRole = roles.some((r) => r.role === "patient");
  if (hasPatientRole) {
    logger.info("Skipping HubSpot sync — contact has patient role (clinical partition)", {
      personId,
    });
    return false;
  }

  const rateCheck = await checkRateLimit(rateLimits.hubspot);
  if (!rateCheck.allowed) {
    logger.warn("HubSpot rate limit reached — deferring sync", { personId });
    return false;
  }

  try {
    const contact = person[0];
    const hubspotData = {
      properties: {
        email: contact.email,
        firstname: contact.displayName.split(" ")[0] ?? "",
        lastname: contact.displayName.split(" ").slice(1).join(" ") ?? "",
        phone: contact.phone ?? "",
        hs_lead_status: "NEW",
        source_system: "sunnah-remedies-app",
        contact_roles: roles.map((r) => r.role).join(", "),
      },
    };

    if (contact.hubspotContactId) {
      await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts/${contact.hubspotContactId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hubspotData),
      });
    } else {
      const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/contacts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUBSPOT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hubspotData),
      });

      if (response.ok) {
        const result = await response.json();
        await db
          .update(schema.people)
          .set({
            hubspotContactId: result.id,
            updatedAt: new Date(),
          })
          .where(eq(schema.people.id, personId));
      }
    }

    logger.info("Contact synced to HubSpot", { personId, email: contact.email });
    return true;
  } catch (error) {
    logger.error("HubSpot sync failed", {
      personId,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return false;
  }
}

export async function syncAllNonClinicalContacts(): Promise<{ synced: number; skipped: number }> {
  let synced = 0;
  let skipped = 0;

  const allPeople = await db.select().from(schema.people).limit(1000);

  for (const person of allPeople) {
    const result = await syncContactToHubSpot(person.id);
    if (result) synced++;
    else skipped++;
  }

  return { synced, skipped };
}
