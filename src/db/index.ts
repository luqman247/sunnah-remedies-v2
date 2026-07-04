/**
 * Phase 9 — Database Connection
 *
 * Unified access to Phase 8 operations tables and Phase 9 community tables.
 * Re-uses the Neon Postgres connection from Phase 8.
 */

import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

let dbInstance: NeonHttpDatabase<typeof schema> | null = null;

function getDbInstance(): NeonHttpDatabase<typeof schema> {
  if (!dbInstance) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is not configured");
    }
    dbInstance = drizzle(neon(url), { schema });
  }
  return dbInstance;
}

export const communityDb = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    const instance = getDbInstance();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
export type CommunityDB = NeonHttpDatabase<typeof schema>;
