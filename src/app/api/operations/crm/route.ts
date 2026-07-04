/**
 * Phase 8 — CRM API
 *
 * CRUD operations for the canonical CRM.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createPerson,
  getPersonById,
  getPersonByEmail,
  updatePerson,
  getPersonOrders,
  getPersonEnrolments,
  getPersonBookings,
  getPersonCommunications,
  getPersonCertificates,
} from "@/operations/crm/service";
import { emitEvent } from "@/operations/events/emit";

export async function GET(request: NextRequest) {
  const personId = request.nextUrl.searchParams.get("id");
  const email = request.nextUrl.searchParams.get("email");

  if (personId) {
    const person = await getPersonById(personId);
    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }

    const [orders, enrolments, bookings, communications, certificates] = await Promise.all([
      getPersonOrders(personId),
      getPersonEnrolments(personId),
      getPersonBookings(personId),
      getPersonCommunications(personId),
      getPersonCertificates(personId),
    ]);

    return NextResponse.json({ person, orders, enrolments, bookings, communications, certificates });
  }

  if (email) {
    const person = await getPersonByEmail(email);
    if (!person) {
      return NextResponse.json({ error: "Person not found" }, { status: 404 });
    }
    return NextResponse.json({ person });
  }

  return NextResponse.json({ error: "Provide id or email parameter" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { displayName, email, phone, locale, source, roles, marketingConsent } = body;

  if (!displayName || !email) {
    return NextResponse.json({ error: "displayName and email are required" }, { status: 400 });
  }

  const personId = await createPerson({
    displayName,
    email,
    phone,
    locale,
    source,
    roles,
    marketingConsent,
  });

  await emitEvent("contact.created", {
    personId,
    email,
    source: source ?? "api",
    roles: roles ?? ["customer"],
  });

  return NextResponse.json({ personId }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { personId, ...updates } = body;

  if (!personId) {
    return NextResponse.json({ error: "personId is required" }, { status: 400 });
  }

  await updatePerson(personId, updates);
  return NextResponse.json({ status: "updated" });
}
