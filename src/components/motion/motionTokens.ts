/**
 * Motion tokens (Ch. 10.3).
 *
 * Extends v2 CSS custom property tokens with JS-accessible values
 * for components that need runtime motion control (e.g. parallax).
 */

export const motionTokens = {
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  duration: 200,
  durationReveal: 600,
  parallaxMaxDesktop: 0.08,
  staggerMax: 80,
  revealThreshold: 0.2,
  revealRootMargin: "0px 0px -10% 0px",
} as const;
