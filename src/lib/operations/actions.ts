"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { redirect } from "next/navigation";

/**
 * Server actions for operational forms.
 *
 * These actions write operational records to Sanity from staff forms.
 * Every action verifies the session before writing — defence in depth
 * beyond the middleware (which already protects the routes).
 *
 * @see Phase 4, Chapter 05 — Temperature logging, Goods-in
 * @see Phase 4, Chapter 03 — Opening/Closing SOPs
 * @see Phase 4, Chapter 11.7 — Action-boundary rule (humans only)
 */

async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/sign-in");
  }
  return session;
}

// ── Temperature Log ──

export interface TemperatureReading {
  location: string;
  temperature: number;
  withinRange: boolean;
}

export async function submitTemperatureLog(formData: FormData) {
  const session = await requireSession();

  const readingsRaw = formData.get("readings") as string;
  const notes = formData.get("notes") as string;
  let readings: TemperatureReading[] = [];

  try {
    readings = JSON.parse(readingsRaw);
  } catch {
    return { success: false, error: "Invalid readings data." };
  }

  if (readings.length === 0) {
    return { success: false, error: "At least one reading is required." };
  }

  const now = new Date();

  try {
    await writeClient.create({
      _type: "operationalLog",
      logType: "temperature",
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      signedBy: session.user.name || session.user.email || "Unknown",
      confirmed: true,
      temperatureReadings: readings.map((r) => ({
        _type: "object",
        _key: crypto.randomUUID(),
        location: r.location,
        temperature: r.temperature,
        withinRange: r.withinRange,
      })),
      notes: notes || undefined,
    });
  } catch {
    return { success: false, error: "Failed to save. Please try again or contact Systems." };
  }

  return { success: true };
}

// ── Goods-In ──

export async function submitGoodsIn(formData: FormData) {
  const session = await requireSession();

  const productRef = formData.get("productRef") as string;
  const batchNumber = formData.get("batchNumber") as string;
  const supplier = formData.get("supplier") as string;
  const quantity = Number(formData.get("quantity"));
  const expiryDate = formData.get("expiryDate") as string;
  const storageLocation = formData.get("storageLocation") as string;
  const provenanceDocumentation = formData.get("provenanceDocumentation") === "true";
  const conditionOnReceipt = formData.get("conditionOnReceipt") as string;
  const notes = formData.get("notes") as string;

  if (!batchNumber || !supplier || !quantity || !expiryDate) {
    return { success: false, error: "Required fields are missing." };
  }

  const now = new Date();

  const doc = {
    _type: "batchRecord" as const,
    batchNumber,
    supplier,
    receivedDate: now.toISOString().split("T")[0],
    quantity,
    expiryDate,
    storageLocation: storageLocation || undefined,
    verificationStatus: "awaiting",
    provenanceDocumentation,
    receivedBy: session.user.name || session.user.email || "Unknown",
    conditionOnReceipt: conditionOnReceipt || "good",
    notes: notes || undefined,
    ...(productRef ? { product: { _type: "reference", _ref: productRef } } : {}),
  };

  try {
    await writeClient.create(doc);
  } catch {
    return { success: false, error: "Failed to save. Please try again or contact Systems." };
  }

  return { success: true };
}

// ── Daily Sign-Off ──

export async function submitDailySignOff(formData: FormData) {
  const session = await requireSession();

  const logType = formData.get("logType") as string;
  const confirmed = formData.get("confirmed") === "true";
  const exceptions = formData.get("exceptions") as string;
  const notes = formData.get("notes") as string;

  if (!logType) {
    return { success: false, error: "Log type is required." };
  }

  const now = new Date();

  try {
    await writeClient.create({
      _type: "operationalLog",
      logType,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      signedBy: session.user.name || session.user.email || "Unknown",
      confirmed,
      exceptions: exceptions || undefined,
      notes: notes || undefined,
    });
  } catch {
    return { success: false, error: "Failed to save. Please try again or contact Systems." };
  }

  return { success: true };
}
