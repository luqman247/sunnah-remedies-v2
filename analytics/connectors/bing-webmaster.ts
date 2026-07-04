/**
 * Bing Webmaster Tools connector — supplementary search intelligence.
 *
 * Pulls Bing-specific search data into the warehouse alongside
 * Google Search Console data for complete search visibility.
 */

interface BingSearchQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

const BING_API = "https://ssl.bing.com/webmaster/api.svc/json";

/**
 * Fetch search query data from Bing Webmaster Tools.
 */
export async function fetchBingSearchData(
  siteUrl: string,
  startDate: string,
  endDate: string
): Promise<BingSearchQuery[]> {
  const apiKey = process.env.BING_WEBMASTER_API_KEY;
  if (!apiKey) {
    console.warn("[Connector/Bing] No API key configured");
    return [];
  }

  try {
    const response = await fetch(
      `${BING_API}/GetQueryStats?siteUrl=${encodeURIComponent(siteUrl)}&apikey=${apiKey}`,
      { headers: { "Content-Type": "application/json" } }
    );

    if (!response.ok) {
      console.error(`[Connector/Bing] HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.d || []).map(
      (row: { Query: string; Clicks: number; Impressions: number; AvgClickPosition: number }) => ({
        query: row.Query,
        clicks: row.Clicks,
        impressions: row.Impressions,
        ctr: row.Impressions > 0 ? row.Clicks / row.Impressions : 0,
        position: row.AvgClickPosition,
      })
    );
  } catch (error) {
    console.error("[Connector/Bing] Error:", error);
    return [];
  }
}
