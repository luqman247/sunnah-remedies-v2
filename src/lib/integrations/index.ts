/**
 * Future integrations barrel export.
 *
 * Phase 2: Architecture prepared, no implementations active.
 * Phase 3: Cloudinary (media delivery)
 * Phase 4: Shopify (commerce) + Stripe (payments)
 */

export { resolveCloudinaryUrl, generateCloudinarySrcSet } from "./cloudinary";
export type { CloudinaryAsset, CloudinaryTransform } from "./cloudinary";

export { getShopifyProduct, createCart, addToCart, getCheckoutUrl } from "./shopify";
export type { ShopifyProduct, ShopifyCart, ShopifyVariant } from "./shopify";

export { createPaymentIntent, createCheckoutSession, createRefund } from "./stripe";
export type { PaymentIntent, CheckoutSession, PaymentPurpose } from "./stripe";
