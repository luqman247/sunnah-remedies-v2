/**
 * Shopify Admin API connector — commerce intelligence.
 *
 * Pulls inventory, order, and product performance data into the
 * warehouse for commerce analytics and stock alerts.
 */

interface ShopifyInventoryLevel {
  inventoryItemId: string;
  available: number;
  productTitle: string;
  variantTitle: string;
}

interface ShopifyOrderSummary {
  ordersCount: number;
  totalRevenue: number;
  averageOrderValue: number;
  currency: string;
}

/**
 * Fetch current inventory levels from Shopify.
 */
export async function fetchInventoryLevels(): Promise<ShopifyInventoryLevel[]> {
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!shopDomain || !accessToken) {
    console.warn("[Connector/Shopify] Missing store domain or access token");
    return [];
  }

  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-10/inventory_levels.json?limit=250`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(`[Connector/Shopify] HTTP ${response.status}`);
      return [];
    }

    const data = await response.json();
    return (data.inventory_levels || []).map(
      (level: { inventory_item_id: number; available: number }) => ({
        inventoryItemId: String(level.inventory_item_id),
        available: level.available,
        productTitle: "",
        variantTitle: "",
      })
    );
  } catch (error) {
    console.error("[Connector/Shopify] Error:", error);
    return [];
  }
}

/**
 * Fetch order summary for a date range.
 */
export async function fetchOrderSummary(
  startDate: string,
  endDate: string
): Promise<ShopifyOrderSummary | null> {
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  if (!shopDomain || !accessToken) return null;

  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-10/orders.json?status=any&created_at_min=${startDate}&created_at_max=${endDate}&limit=250`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const orders = data.orders || [];
    const totalRevenue = orders.reduce(
      (sum: number, o: { total_price: string }) => sum + parseFloat(o.total_price || "0"),
      0
    );

    return {
      ordersCount: orders.length,
      totalRevenue,
      averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
      currency: orders[0]?.currency || "GBP",
    };
  } catch (error) {
    console.error("[Connector/Shopify] Error:", error);
    return null;
  }
}

/**
 * Fetch low-stock products (below threshold).
 */
export async function fetchLowStockProducts(
  threshold: number = 5
): Promise<ShopifyInventoryLevel[]> {
  const levels = await fetchInventoryLevels();
  return levels.filter((level) => level.available <= threshold);
}
