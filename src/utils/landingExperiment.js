/** Set to "a" or "b" when the test is over. null keeps the 50/50 split. */
export const LANDING_WINNER = null;

export const LANDING_EXPERIMENT = "landing";

const VARIANT_KEY = "quirkle.landing_variant";
const LANDING_KEY = "quirkle.landing";

function readStoredVariant() {
  try {
    const value = localStorage.getItem(VARIANT_KEY);
    if (value === "a" || value === "b") return value;
  } catch {
    // Storage can be blocked. The visit still sees a page.
  }
  return null;
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
 * People who arrive on / are assigned once and keep that page.
 * ?lp=a or ?lp=b previews a page without entering the test.
 */
export function resolveLandingVariant() {
  if (typeof window === "undefined") {
    return { variant: LANDING_WINNER || "a", enrolled: false };
  }

  const preview = new URLSearchParams(window.location.search).get("lp");
  if (preview === "a" || preview === "b") {
    return { variant: preview, enrolled: false };
  }

  if (LANDING_WINNER === "a" || LANDING_WINNER === "b") {
    return { variant: LANDING_WINNER, enrolled: false };
  }

  if (sessionEntryPath() !== "/") {
    return { variant: "a", enrolled: false };
  }

  let variant = readStoredVariant();
  if (!variant) {
    variant = Math.random() < 0.5 ? "a" : "b";
    try {
      localStorage.setItem(VARIANT_KEY, variant);
    } catch {
      // This visit can still render. The next visit may be assigned again.
    }
  }

  return { variant, enrolled: true };
}

/** Attached to analytics events for visitors who are in the split. */
export function landingExperimentParams() {
  if (LANDING_WINNER === "a" || LANDING_WINNER === "b") return {};
  const variant = readStoredVariant();
  if (!variant) return {};
  if (sessionEntryPath() !== "/") return {};
  return {
    experiment_id: LANDING_EXPERIMENT,
    landing_variant: variant,
  };
}
