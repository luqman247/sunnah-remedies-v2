/**
 * Staff Route Matcher Test — static source inspection only.
 *
 * Confirms that every intended staff-only route is present in
 * middleware.ts's auth-protected pathname block. This is a STATIC check —
 * it reads and pattern-matches the source text. It does not start a server,
 * make an HTTP request, or prove the middleware executes at runtime.
 *
 * Runtime behaviour (does the gate actually block/allow requests) was
 * verified separately via live curl/browser requests against a running
 * `next start` production server — see docs/dhikr/21-decision-log.md for
 * that evidence, including the confirmed Turbopack `next dev` discrepancy
 * this static test cannot detect (a static text match cannot tell you
 * whether the dev server actually invokes the function body).
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const EXPECTED_STAFF_ROUTES = ["/handbook", "/ops", "/intelligence", "/dhikr-review"];

function testAllStaffRoutesInAuthProtectedBlock() {
  const middlewareSource = readFileSync(join(__dirname, "../../middleware.ts"), "utf-8");
  const authBlockMatch = middlewareSource.match(/if \(([\s\S]*?)\)\s*\{\s*return \(authMiddleware/);
  assert(!!authBlockMatch, "[static source-inspection check] could not locate the auth-protected pathname block in middleware.ts");

  const blockText = authBlockMatch![1];
  for (const route of EXPECTED_STAFF_ROUTES) {
    assert(
      blockText.includes(`pathname.startsWith("${route}")`),
      `[static source-inspection check] middleware.ts's auth-protected block must include "${route}"`,
    );
  }
  console.log(
    `✓ [static check] all ${EXPECTED_STAFF_ROUTES.length} intended staff routes (${EXPECTED_STAFF_ROUTES.join(", ")}) are present in middleware.ts's auth-protected block`,
  );
}

function testAuthProtectedBlockUsesSameMiddlewareForEveryRoute() {
  const middlewareSource = readFileSync(join(__dirname, "../../middleware.ts"), "utf-8");
  // All four routes must share one `if (...) { return authMiddleware(...) }`
  // block, not four separate ad-hoc checks that could silently diverge.
  const ifBlockCount = (middlewareSource.match(/return \(authMiddleware/g) ?? []).length;
  assert(
    ifBlockCount === 1,
    `[static source-inspection check] expected exactly one authMiddleware invocation shared by all staff routes, found ${ifBlockCount}`,
  );
  console.log("✓ [static check] all staff routes are gated through a single shared authMiddleware invocation, not duplicated per-route logic");
}

function testSignInPageIsExemptFromLocaleRewrite() {
  const middlewareSource = readFileSync(join(__dirname, "../../middleware.ts"), "utf-8");
  const authBlockMatch = middlewareSource.match(/if \(([\s\S]*?)\)\s*\{\s*return \(authMiddleware/);
  assert(!!authBlockMatch, "[static source-inspection check] could not locate the auth-protected pathname block in middleware.ts");
  assert(
    authBlockMatch![1].includes('pathname.startsWith("/sign-in")'),
    '[static source-inspection check] /sign-in must be routed through authMiddleware (whose own pages.signIn exemption passes it through untouched) so it never falls through to intlMiddleware, which would otherwise rewrite it to a non-existent /en/sign-in and 404',
  );
  console.log("✓ [static check] /sign-in is exempted from the locale-rewrite fallthrough (regression guard for the confirmed 404 fix)");
}

function testAuthBlockReturnsBeforeIntlFallback() {
  const middlewareSource = readFileSync(join(__dirname, "../../middleware.ts"), "utf-8");
  const authReturnIndex = middlewareSource.indexOf("return (authMiddleware");
  const intlFallbackIndex = middlewareSource.indexOf("return intlMiddleware(req);");
  assert(authReturnIndex !== -1, "[static source-inspection check] could not find the authMiddleware return statement");
  assert(intlFallbackIndex !== -1, "[static source-inspection check] could not find the intlMiddleware fallback return statement");
  assert(
    authReturnIndex < intlFallbackIndex,
    "[static source-inspection check] the authMiddleware branch must return before the function reaches the intlMiddleware fallback — otherwise /sign-in and staff routes could still fall through to the locale rewrite",
  );
  console.log("✓ [static check] the auth-routed branch (including /sign-in) returns early, before the intlMiddleware fallback is ever reached");
}

function testKnownPublicPathsAreNotInAuthBlock() {
  const middlewareSource = readFileSync(join(__dirname, "../../middleware.ts"), "utf-8");
  const authBlockMatch = middlewareSource.match(/if \(([\s\S]*?)\)\s*\{\s*return \(authMiddleware/);
  assert(!!authBlockMatch, "[static source-inspection check] could not locate the auth-protected pathname block in middleware.ts");
  const blockText = authBlockMatch![1];

  // Sample of real public [locale]-tree paths — none of these should ever be
  // added to the auth block; by elimination they must fall through to
  // intlMiddleware, exactly like every other public route.
  const knownPublicPaths = ["/the-apothecary", "/the-academy", "/sacred-journeys", "/knowledge-library"];
  for (const path of knownPublicPaths) {
    assert(
      !blockText.includes(`pathname.startsWith("${path}")`),
      `[static source-inspection check] public route "${path}" must NOT be present in the auth-protected block — it must reach intlMiddleware`,
    );
  }
  console.log("✓ [static check] known public locale routes are absent from the auth-protected block, so they still fall through to intlMiddleware");
}

function testUrlNormalisationAndTrackingParamStrippingUnchanged() {
  const middlewareSource = readFileSync(join(__dirname, "../../middleware.ts"), "utf-8");

  const expectedTrackingParams = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "ref", "mc_cid", "mc_eid"];
  for (const param of expectedTrackingParams) {
    assert(
      middlewareSource.includes(`"${param}"`),
      `[static source-inspection check] STRIP_PARAMS must still include "${param}" — the sign-in fix must not disturb existing tracking-parameter stripping`,
    );
  }

  // The normalisation/tracking-param-stripping block (which redirects via
  // NextResponse.redirect(url, 301) before anything else runs) must still
  // precede the auth-routing block, so it still applies uniformly to every
  // path, including /sign-in and staff routes.
  const redirectIndex = middlewareSource.indexOf("NextResponse.redirect(url, 301)");
  const authIfIndex = middlewareSource.indexOf('pathname.startsWith("/handbook")');
  assert(redirectIndex !== -1, "[static source-inspection check] could not find the URL-normalisation redirect");
  assert(authIfIndex !== -1, "[static source-inspection check] could not find the auth-protected pathname block");
  assert(
    redirectIndex < authIfIndex,
    "[static source-inspection check] URL normalisation and tracking-parameter stripping must still run before the auth-routing block",
  );
  console.log("✓ [static check] URL normalisation and tracking-parameter stripping are unchanged and still run before auth routing");
}

function runAll() {
  testAllStaffRoutesInAuthProtectedBlock();
  testAuthProtectedBlockUsesSameMiddlewareForEveryRoute();
  testSignInPageIsExemptFromLocaleRewrite();
  testAuthBlockReturnsBeforeIntlFallback();
  testKnownPublicPathsAreNotInAuthBlock();
  testUrlNormalisationAndTrackingParamStrippingUnchanged();
  console.log("\nAll staff route matcher tests passed.");
}

runAll();
