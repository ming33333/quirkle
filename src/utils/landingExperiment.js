/** Set to "original" or "interactive" when the test is over. null keeps the 50/50 split. */
export const LANDING_WINNER = null;

export const LANDING_EXPERIMENT = "landing";

const VARIANT_KEY = "quirkle.landing_variant";
const LANDING_KEY = "quirkle.landing";
const LIVE_VARIANTS = ["original", "interactive"];

function readStoredVariant() {
  try {
    const value = localStorage.getItem(VARIANT_KEY);
    if (LIVE_VARIANTS.includes(value)) return value;
  } catch {
    // Storage can be blocked. The visit still sees a page.
  }
  return null;
}

function writeStoredVariant(variant) {
  try {
    localStorage.setItem(VARIANT_KEY, variant);
  } catch {
    // This visit can still render. The next visit may be assigned again.
  }
}

function sessionEntryPath() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(LANDING_KEY) || "null");
    if (saved?.path) return String(saved.path).split("?")[0];
  } catch {
    // Fall through to the current URL.
  }
  if (typeof window === "undefined") return null;
  return window.location.pathname;
}

/**
 * People who arrive on / are assigned original or interactive once and keep that page.
 * ?lp=original, ?lp=a, ?lp=b, or ?lp=interactive previews a page without entering the test.
 */
export function resolveLandingVariant() {
  if (typeof window === "undefined") {
    return { variant: LANDING_WINNER || "original", enrolled: false };
  }

  const preview = new URLSearchParams(window.location.search).get("lp");
  if (preview === "a" || preview === "original") {
    return { variant: "original", enrolled: false };
  }
  if (preview === "b" || preview === "interactive") {
    return { variant: preview, enrolled: false };
  }

  if (LIVE_VARIANTS.includes(LANDING_WINNER)) {
    return { variant: LANDING_WINNER, enrolled: false };
  }

  if (sessionEntryPath() !== "/") {
    return { variant: "original", enrolled: false };
  }

  let variant = readStoredVariant();
  if (!variant) {
    variant = Math.random() < 0.5 ? "original" : "interactive";
    writeStoredVariant(variant);
  }

  return { variant, enrolled: true };
}

/** Attached to analytics events for visitors who are in the split. */
export function landingExperimentParams() {
  if (LIVE_VARIANTS.includes(LANDING_WINNER)) return {};
  const variant = readStoredVariant();
  if (!variant) return {};
  if (sessionEntryPath() !== "/") return {};
  return {
    experiment_id: LANDING_EXPERIMENT,
    landing_variant: variant,
  };
}
