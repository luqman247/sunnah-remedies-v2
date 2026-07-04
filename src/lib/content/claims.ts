/**
 * Claims governance helpers (Ch. 7.6).
 *
 * Product pages that assert health effects must link at least one reference.
 * This module provides validation helpers for content enforcement.
 */

export interface ClaimBlock {
  text: string;
  references?: { id: string; text: string }[];
}

/**
 * Validates that a claim block has at least one linked reference.
 * Returns true if the claim is properly supported.
 */
export function isClaimSupported(claim: ClaimBlock): boolean {
  return Boolean(claim.references && claim.references.length > 0);
}

/**
 * Validates all claims in a body and returns unsupported ones.
 * Used by CI/build validation and Studio custom validators.
 */
export function findUnsupportedClaims(claims: ClaimBlock[]): ClaimBlock[] {
  return claims.filter((claim) => !isClaimSupported(claim));
}

/**
 * The standing non-diagnostic disclaimer rendered on every product page.
 * Content is institution-authored but the mechanic is engineering-owned.
 */
export const PRODUCT_DISCLAIMER =
  "This information is presented within the framework of traditional medicine and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Always seek the guidance of a qualified health practitioner";
