/**
 * Google Search Console connector — SEO intelligence.
 *
 * Pulls keyword rankings, CTR, impressions, and indexation data
 * into the warehouse nightly. Joined with on-site behaviour for
 * full SEO intelligence.
 */

interface SearchConsoleQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface SearchConsoleResponse {
  rows?: Array<{
    keys: string[];
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
}

const SEARCH_CONSOLE_API = "https://searchconsole.googleapis.com/webmasters/v3";

/**
 * Fetch search analytics from Google Search Console.
 */
export async function fetchSearchAnalytics(
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[] = ["query"]
): Promise<SearchConsoleQuery[]> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.warn("[Connector/SearchConsole] No access token available");
    return [];
  }

  try {
    const response = await fetch(
      `${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          startDate,
          endDate,
          dimensions,
          rowLimit: 5000,
        }),
      }
    );

    if (!response.ok) {
      console.error(`[Connector/SearchConsole] HTTP ${response.status}`);
      return [];
    }

    const data: SearchConsoleResponse = await response.json();
    return (data.rows || []).map((row) => ({
      query: row.keys[0] || "",
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position,
    }));
  } catch (error) {
    console.error("[Connector/SearchConsole] Error:", error);
    return [];
  }
}

/**
 * Fetch indexation coverage status.
 */
export async function fetchIndexationStatus(
  siteUrl: string
): Promise<{
  indexed: number;
  excluded: number;
  errors: number;
} | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const response = await fetch(
      `${SEARCH_CONSOLE_API}/sites/${encodeURIComponent(siteUrl)}/urlInspection/index:inspect`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inspectionUrl: siteUrl,
          siteUrl,
        }),
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return {
      indexed: data.inspectionResult?.indexStatusResult?.indexingState === "INDEXED" ? 1 : 0,
      excluded: 0,
      errors: 0,
    };
  } catch {
    return null;
  }
}

async function getAccessToken(): Promise<string | null> {
  return process.env.GOOGLE_SEARCH_CONSOLE_TOKEN || null;
}
