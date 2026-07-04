import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Disables Draft Mode and redirects to homepage.
 * Called when an editor wants to exit preview.
 */
export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}
