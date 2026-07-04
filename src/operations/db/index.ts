/**
 * Phase 8 — Database Connection (Neon Postgres via Drizzle ORM)
 *
 * Lazy-initialised so build succeeds without DATABASE_URL at compile time.
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

export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_target, prop) {
    const instance = getDbInstance();
    const value = Reflect.get(instance, prop, instance);
    return typeof value === "function" ? value.bind(instance) : value;
  },
});

export { schema };
export type DB = NeonHttpDatabase<typeof schema>;
