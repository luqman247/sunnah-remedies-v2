/**
 * GET /api/draft-mode/enable
 *
 * Sanity Presentation Tool entry — validates short-lived preview-url secrets
 * via next-sanity (no long-lived secret embedded in Studio client config).
 */

import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/sanity/lib/client";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({
    token: process.env.SANITY_API_TOKEN,
  }),
});
