/**
 * Server-side validation of Sanity Studio editor credentials.
 *
 * Studio clients send the current user's Sanity session token.
 * Optionally, the server-only SANITY_API_TOKEN may authenticate service
 * callers — it is never inlined into browser bundles.
 * Do not log tokens or Authorization headers.
 */

import { timingSafeEqual } from "node:crypto";
import { getSanityProjectId } from "@/sanity/env";

export type StudioAuthSuccess = {
  ok: true;
  userId: string;
  displayName?: string;
  roles: string[];
};

export type StudioAuthFailure = {
  ok: false;
  status: 401 | 403;
  error: string;
};

export type StudioAuthResult = StudioAuthSuccess | StudioAuthFailure;

const EDITOR_ROLES = new Set([
  "administrator",
  "editor",
  "developer",
  "contributor",
  "admin",
]);

function bearerFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  const token = match?.[1]?.trim();
  return token || null;
}

function matchesServerApiToken(token: string): boolean {
  const expected = process.env.SANITY_API_TOKEN;
  if (!expected || !token) return false;
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/**
 * Validate that the request carries a live Sanity user token with
 * edit-capable access to this project, or the server-only API token.
 */
export async function authorizeSanityStudioEditor(
  request: Request,
): Promise<StudioAuthResult> {
  const token = bearerFromRequest(request);
  if (!token) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  // Server-held dataset token — never shipped to the browser.
  if (matchesServerApiToken(token)) {
    return {
      ok: true,
      userId: "sanity-api-token",
      displayName: "Sanity API token",
      roles: ["administrator"],
    };
  }

  let userId = "";
  let displayName: string | undefined;

  try {
    const meRes = await fetch("https://api.sanity.io/v2021-06-07/users/me", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (meRes.status === 401 || meRes.status === 403) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }
    if (!meRes.ok) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }

    const me = (await meRes.json()) as {
      id?: string;
      name?: string;
      email?: string;
    };
    if (!me.id) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }
    userId = me.id;
    displayName = me.name || me.email;
  } catch {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  const projectId = getSanityProjectId();

  try {
    const projectRes = await fetch(
      `https://api.sanity.io/v2021-06-07/projects/${projectId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (projectRes.status === 401) {
      return { ok: false, status: 401, error: "Unauthorized" };
    }
    if (projectRes.status === 403 || projectRes.status === 404) {
      return { ok: false, status: 403, error: "Forbidden" };
    }
    if (!projectRes.ok) {
      return { ok: false, status: 403, error: "Forbidden" };
    }

    const project = (await projectRes.json()) as {
      members?: Array<{
        id?: string;
        role?: string;
        roles?: Array<{ name?: string } | string>;
      }>;
    };

    const member = (project.members || []).find((m) => m.id === userId);
    if (!member) {
      return { ok: false, status: 403, error: "Forbidden" };
    }

    const roles = [
      ...(member.role ? [member.role] : []),
      ...(member.roles || []).map((role) =>
        typeof role === "string" ? role : role.name || "",
      ),
    ].filter(Boolean);

    const permitted =
      roles.length === 0
        ? false
        : roles.some((role) => EDITOR_ROLES.has(role.toLowerCase()));
    if (!permitted) {
      return { ok: false, status: 403, error: "Forbidden" };
    }

    return { ok: true, userId, displayName, roles };
  } catch {
    return { ok: false, status: 403, error: "Forbidden" };
  }
}
