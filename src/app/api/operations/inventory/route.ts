/**
 * Phase 8 — Inventory API
 *
 * Stock levels, batches, purchase orders, low-stock alerts.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getStockLevel,
  getLowStockProducts,
  getExpiringBatches,
  getPendingPurchaseOrders,
  recordIncomingDelivery,
  approvePurchaseOrder,
} from "@/operations/inventory/service";
import { writeAuditLog } from "@/operations/permissions/audit";

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action") ?? "stock";
  const productId = request.nextUrl.searchParams.get("productId");

  switch (action) {
    case "stock": {
      if (!productId) {
        return NextResponse.json({ error: "productId required" }, { status: 400 });
      }
      const stock = await getStockLevel(productId);
      return NextResponse.json(stock);
    }

    case "low-stock": {
      const lowStock = await getLowStockProducts();
      return NextResponse.json({ products: lowStock });
    }

    case "expiring": {
      const days = parseInt(request.nextUrl.searchParams.get("days") ?? "90");
      const expiring = await getExpiringBatches(days);
      return NextResponse.json({ batches: expiring });
    }

    case "purchase-orders": {
      const orders = await getPendingPurchaseOrders();
      return NextResponse.json({ orders });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  switch (action) {
    case "receive-delivery": {
      const batchId = await recordIncomingDelivery(body);
      return NextResponse.json({ batchId }, { status: 201 });
    }

    case "approve-po": {
      const { orderId, staffUserId } = body;
      if (!orderId || !staffUserId) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      }
      await approvePurchaseOrder(orderId, staffUserId);
      await writeAuditLog({
        staffUserId,
        action: "purchase_order_approved",
        resource: "purchase_order",
        resourceId: orderId,
      });
      return NextResponse.json({ status: "approved" });
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
