import { NextResponse } from "next/server";

/**
 * POST /api/subscribe — Correspondence subscription endpoint.
 *
 * Placeholder: logs the request. Wire to the institution's email
 * service provider when chosen (Ch. 18.5).
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // TODO: Wire to email service provider when selected
    console.log(`[Correspondence] Subscription requested: ${email}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid request." },
      { status: 400 }
    );
  }
}
