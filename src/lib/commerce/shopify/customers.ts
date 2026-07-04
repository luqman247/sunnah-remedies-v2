/**
 * Customer accounts — Shopify customer API integration.
 *
 * Links Shopify customer accounts to the institutional experience.
 * Customers can view order history in SR-styled pages.
 *
 * @see Phase 4 Part 2, Spec 05 §5.6
 */

import { adminQuery } from "./admin-client";

export interface CustomerOrder {
  id: string;
  orderNumber: number;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
  lineItems: Array<{
    title: string;
    quantity: number;
    variant?: { title: string };
  }>;
}

export interface CustomerProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  orders: CustomerOrder[];
  totalOrderCount: number;
}

const CUSTOMER_ORDERS_QUERY = `
  query CustomerOrders($customerId: ID!, $first: Int!) {
    customer(id: $customerId) {
      id
      email
      firstName
      lastName
      ordersCount
      orders(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney { amount currencyCode }
            }
            lineItems(first: 20) {
              edges {
                node {
                  title
                  quantity
                  variant { title }
                }
              }
            }
          }
        }
      }
    }
  }
`;

interface CustomerOrdersResponse {
  customer: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    ordersCount: number;
    orders: {
      edges: Array<{
        node: {
          id: string;
          name: string;
          createdAt: string;
          displayFinancialStatus: string;
          displayFulfillmentStatus: string;
          totalPriceSet: {
            shopMoney: { amount: string; currencyCode: string };
          };
          lineItems: {
            edges: Array<{
              node: {
                title: string;
                quantity: number;
                variant: { title: string } | null;
              };
            }>;
          };
        };
      }>;
    };
  } | null;
}

export async function getCustomerProfile(
  customerId: string,
  orderLimit = 10
): Promise<CustomerProfile | null> {
  const data = await adminQuery<CustomerOrdersResponse>(CUSTOMER_ORDERS_QUERY, {
    customerId,
    first: orderLimit,
  });

  if (!data.customer) return null;

  const { customer } = data;
  return {
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName ?? undefined,
    lastName: customer.lastName ?? undefined,
    totalOrderCount: customer.ordersCount,
    orders: customer.orders.edges.map(({ node }) => ({
      id: node.id,
      orderNumber: parseInt(node.name.replace("#", ""), 10),
      createdAt: node.createdAt,
      financialStatus: node.displayFinancialStatus,
      fulfillmentStatus: node.displayFulfillmentStatus,
      totalPrice: node.totalPriceSet.shopMoney,
      lineItems: node.lineItems.edges.map(({ node: li }) => ({
        title: li.title,
        quantity: li.quantity,
        variant: li.variant ?? undefined,
      })),
    })),
  };
}
