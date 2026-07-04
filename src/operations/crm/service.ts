/**
 * Phase 8 — CRM Service
 *
 * Canonical relationship operations. The app DB is the single source
 * of truth for people and their ties to the institution.
 */

import { db, schema } from "../db";
import { eq, and, desc } from "drizzle-orm";

export interface CreatePersonInput {
  displayName: string;
  email: string;
  phone?: string;
  locale?: string;
  source?: string;
  roles?: string[];
  marketingConsent?: "granted" | "denied" | "withdrawn";
  tags?: string[];
}

export async function createPerson(input: CreatePersonInput): Promise<string> {
  const existing = await db
    .select()
    .from(schema.people)
    .where(eq(schema.people.email, input.email))
    .limit(1);

  if (existing[0]) {
    return existing[0].id;
  }

  const result = await db
    .insert(schema.people)
    .values({
      displayName: input.displayName,
      email: input.email,
      phone: input.phone,
      locale: input.locale ?? "en",
      source: input.source ?? "website",
      marketingConsent: input.marketingConsent ?? "denied",
      tags: input.tags ?? [],
    })
    .returning({ id: schema.people.id });

  const personId = result[0].id;

  if (input.roles) {
    for (const role of input.roles) {
      await db.insert(schema.personRoles).values({
        personId,
        role: role as "customer" | "student" | "patient" | "lead" | "practitioner" | "faculty" | "researcher" | "partner" | "affiliate" | "volunteer" | "supplier",
      });
    }
  }

  return personId;
}

export async function getPersonById(personId: string) {
  const person = await db
    .select()
    .from(schema.people)
    .where(eq(schema.people.id, personId))
    .limit(1);

  if (!person[0]) return null;

  const roles = await db
    .select()
    .from(schema.personRoles)
    .where(eq(schema.personRoles.personId, personId));

  const interactions = await db
    .select()
    .from(schema.interactions)
    .where(eq(schema.interactions.personId, personId))
    .orderBy(desc(schema.interactions.occurredAt))
    .limit(50);

  return {
    ...person[0],
    roles: roles.map((r) => ({ role: r.role, isActive: r.isActive, attributes: r.attributes })),
    interactions,
  };
}

export async function getPersonByEmail(email: string) {
  const person = await db
    .select()
    .from(schema.people)
    .where(eq(schema.people.email, email))
    .limit(1);
  return person[0] ?? null;
}

export async function updatePerson(personId: string, updates: Partial<{
  displayName: string;
  phone: string;
  locale: string;
  marketingConsent: "granted" | "denied" | "withdrawn";
  tags: string[];
  preferences: Record<string, unknown>;
}>) {
  await db
    .update(schema.people)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(schema.people.id, personId));
}

export async function addInteraction(personId: string, interaction: {
  type: string;
  entityType?: string;
  entityId?: string;
  summary?: string;
  metadata?: Record<string, unknown>;
}) {
  await db.insert(schema.interactions).values({
    personId,
    type: interaction.type,
    entityType: interaction.entityType,
    entityId: interaction.entityId,
    summary: interaction.summary,
    metadata: interaction.metadata ?? {},
  });
}

export async function getPersonOrders(personId: string) {
  return db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.personId, personId))
    .orderBy(desc(schema.orders.createdAt));
}

export async function getPersonEnrolments(personId: string) {
  return db
    .select()
    .from(schema.enrolments)
    .where(eq(schema.enrolments.personId, personId))
    .orderBy(desc(schema.enrolments.enrolledAt));
}

export async function getPersonBookings(personId: string) {
  return db
    .select()
    .from(schema.bookings)
    .where(eq(schema.bookings.personId, personId))
    .orderBy(desc(schema.bookings.scheduledAt));
}

export async function getPersonCommunications(personId: string) {
  return db
    .select()
    .from(schema.communications)
    .where(eq(schema.communications.personId, personId))
    .orderBy(desc(schema.communications.sentAt))
    .limit(50);
}

export async function getPersonCertificates(personId: string) {
  return db
    .select()
    .from(schema.certificates)
    .where(eq(schema.certificates.personId, personId))
    .orderBy(desc(schema.certificates.issuedAt));
}
