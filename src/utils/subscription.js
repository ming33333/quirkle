import { loadStripe } from "@stripe/stripe-js";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

const USER_SETTING_DOC_ID = "settings";
const SUBSCRIPTION_FIELD = "subscription status";

export const FREE_PLAN_MAX_DECKS = 6;
export const MAX_QUESTIONS_PER_DECK = 200;
export const MONTHLY_PRICE_USD = 5;
export const YEARLY_PRICE_USD = 50;
export const YEARLY_BILLED_MONTHLY_USD = MONTHLY_PRICE_USD * 12;
export const YEARLY_SAVINGS_USD = YEARLY_BILLED_MONTHLY_USD - YEARLY_PRICE_USD;
export const YEARLY_SAVINGS_PERCENT = Math.round(
  (YEARLY_SAVINGS_USD / YEARLY_BILLED_MONTHLY_USD) * 100,
);

const env = (key) =>
  import.meta.env[key] || (typeof process !== "undefined" ? process.env[key] : "");

const isLocalTesting = () =>
  String(env("LOCAL_TESTING") || "").toLowerCase() === "true";

const getCloudFunctionsBaseUrl = () => {
  const override = env("REACT_APP_CLOUD_FUNCTIONS_URL");
  if (override) return override.replace(/\/$/, "");
  const projectId = env("REACT_APP_FIREBASE_PROJECT_ID") || "quirkle-db";
  return `https://us-central1-${projectId}.cloudfunctions.net`;
};

export const getStripePriceId = (interval = "month") => {
  const yearly = String(interval || "").toLowerCase() === "year";
  if (isLocalTesting()) {
    if (yearly) {
      return env("REACT_APP_STRIPE_TEST_YEARLY_PRICE_ID") || "";
    }
    return (
      env("REACT_APP_STRIPE_TEST_PRICE_ID") ||
      env("REACT_APP_STRIPE_PRICE_ID") ||
      ""
    );
  }
  if (yearly) {
    return env("REACT_APP_STRIPE_LIVE_YEARLY_PRICE_ID") || "";
  }
  return env("REACT_APP_STRIPE_LIVE_PRICE_ID") || "";
};

const getPublishableKey = () => {
  if (isLocalTesting()) {
    return (
      env("REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY") ||
      env("REACT_APP_STRIPE_PUBLISHABLE_KEY") ||
      ""
    );
  }
  return env("REACT_APP_STRIPE_LIVE_PUBLISHABLE_KEY") || "";
};

const appHashUrl = (hashPath) => {
  const origin = `${window.location.origin}${window.location.pathname}`.replace(
    /\/$/,
    "",
  );
  return `${origin}/#${hashPath}`;
};

export const isSubscribed = (status) => {
  const value = String(status || "free").toLowerCase();
  return value === "subscribed" || value === "basic" || value === "pro";
};

export const isFreePlan = (status) => !isSubscribed(status);

export const planLabel = (status) => (isSubscribed(status) ? "Subscribed" : "Free");

const emptyDetails = {
  status: "free",
  nextRenewalAt: null,
  cancelAtPeriodEnd: false,
  interval: null,
};

const DETAILS_TTL_MS = 2 * 60 * 1000;
const detailsByEmail = new Map();
const inflightByEmail = new Map();

const rememberDetails = (email, details) => {
  if (!email) return;
  detailsByEmail.set(email, { details, at: Date.now() });
};

export const invalidateSubscriptionDetails = (email) => {
  if (email) {
    detailsByEmail.delete(email);
    inflightByEmail.delete(email);
    return;
  }
  detailsByEmail.clear();
  inflightByEmail.clear();
};

export const peekSubscriptionDetails = (email, { allowStale = false } = {}) => {
  const entry = detailsByEmail.get(email);
  if (!entry?.details) return null;
  if (!allowStale && Date.now() - entry.at > DETAILS_TTL_MS) return null;
  return entry.details;
};

const fetchStripeDetails = async (email) => {
  const response = await fetch(
    `${getCloudFunctionsBaseUrl()}/getSubscriptionDetails`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    },
  );
  if (!response.ok) return null;
  return response.json();
};

const stripeConfirmedPaid = (details) =>
  isSubscribed(details?.status) &&
  Boolean(details?.interval || details?.nextRenewalAt);

const detailsFromStripe = (data, firestoreStatus) => {
  const details = {
    status: data.status || firestoreStatus || "free",
    nextRenewalAt: data.nextRenewalAt || null,
    cancelAtPeriodEnd: Boolean(data.cancelAtPeriodEnd),
    interval: data.interval || null,
  };
  if (isSubscribed(details.status) && !stripeConfirmedPaid(details)) {
    return { ...details, status: "free" };
  }
  return details;
};

export const getSubscriptionStatus = async (email) => {
  if (!email) return "free";
  try {
    const snapshot = await getDoc(
      doc(db, "users", email, "userSetting", USER_SETTING_DOC_ID),
    );
    const data = snapshot.exists() ? snapshot.data() : {};
    return data[SUBSCRIPTION_FIELD] || "free";
  } catch (error) {
    console.error("Error getting subscription status:", error);
    return "free";
  }
};

export const getSubscriptionDetails = async (email, { force = false } = {}) => {
  if (!email) return { ...emptyDetails };

  if (!force) {
    const cached = peekSubscriptionDetails(email);
    if (cached) return cached;
    const inflight = inflightByEmail.get(email);
    if (inflight) return inflight;
  }

  const request = (async () => {
    try {
      const [firestoreStatus, stripeData] = await Promise.all([
        getSubscriptionStatus(email),
        fetchStripeDetails(email),
      ]);
      if (!stripeData) return { ...emptyDetails, status: firestoreStatus };
      return detailsFromStripe(stripeData, firestoreStatus);
    } catch (error) {
      console.error("Error getting subscription details:", error);
      return { ...emptyDetails, status: await getSubscriptionStatus(email) };
    }
  })();

  inflightByEmail.set(email, request);
  try {
    const details = await request;
    rememberDetails(email, details);
    return details;
  } finally {
    if (inflightByEmail.get(email) === request) {
      inflightByEmail.delete(email);
    }
  }
};

export const getVerifiedSubscriptionStatus = async (email) => {
  const details = await getSubscriptionDetails(email);
  return details.status;
};

export const cancelSubscriptionAtPeriodEnd = async (email) => {
  if (!email) throw new Error("You must be signed in.");
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("You must be signed in.");

  const response = await fetch(
    `${getCloudFunctionsBaseUrl()}/cancelSubscription`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseFunctionError(response));
  }

  const result = await response.json();
  const previous = peekSubscriptionDetails(email, { allowStale: true });
  rememberDetails(email, {
    status: result.status || "subscribed",
    nextRenewalAt: result.nextRenewalAt || previous?.nextRenewalAt || null,
    cancelAtPeriodEnd: true,
    interval: result.interval || previous?.interval || null,
  });
  return result;
};

export const listUsersWithPlans = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  const users = await Promise.all(
    snapshot.docs.map(async (userDoc) => {
      const email = userDoc.id;
      const status = await getSubscriptionStatus(email);
      return {
        email,
        status,
        plan: planLabel(status),
      };
    }),
  );
  return users.sort((a, b) => a.email.localeCompare(b.email));
};

export const setPlanToFree = async (email) => {
  const exact = String(email || "").trim();
  const normalized = exact.toLowerCase();
  if (!normalized) throw new Error("Missing user email.");

  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("You must be signed in.");

  const markFreeInFirestore = async (userId) => {
    await setDoc(
      doc(db, "users", userId, "userSetting", USER_SETTING_DOC_ID),
      { [SUBSCRIPTION_FIELD]: "free" },
      { merge: true },
    );
  };

  // Write both casings so the admin list (doc id) and Stripe-normalized path stay in sync.
  await markFreeInFirestore(exact);
  invalidateSubscriptionDetails(exact);
  if (exact !== normalized) {
    await markFreeInFirestore(normalized);
    invalidateSubscriptionDetails(normalized);
  }

  let response;
  try {
    response = await fetch(
      `${getCloudFunctionsBaseUrl()}/adminCancelSubscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: exact }),
      },
    );
  } catch (networkError) {
    return {
      status: "free",
      stripeCancelled: false,
      warning:
        "Could not reach adminCancelSubscription. Plan is Free in the app. Allow public invoke on the function (see README). Stripe may still be charging.",
    };
  }

  if (response.ok) {
    return response.json();
  }

  return {
    status: "free",
    stripeCancelled: false,
    warning: `${await parseFunctionError(response)} Plan is Free in the app; Stripe may still be charging.`,
  };
};

export const assertQuestionLimit = (count) => {
  if (Number(count) > MAX_QUESTIONS_PER_DECK) {
    throw new Error(
      `A deck can have at most ${MAX_QUESTIONS_PER_DECK} questions.`,
    );
  }
};

export const canCreateDeck = (status, deckCount) =>
  isSubscribed(status) || deckCount < FREE_PLAN_MAX_DECKS;

const parseFunctionError = async (response) => {
  try {
    const body = await response.json();
    return body.error || body.message || "Request failed.";
  } catch {
    return "Request failed.";
  }
};

const ensureUserDoc = async (email) => {
  const userRef = doc(db, "users", email);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    await setDoc(userRef, {});
  }
};

let stripePromise = null;
const getStripe = () => {
  const key = getPublishableKey();
  if (!key) {
    throw new Error("Missing Stripe publishable key.");
  }
  if (!stripePromise) {
    stripePromise = loadStripe(key);
  }
  return stripePromise;
};

const warmupCheckoutFunction = () => {
  void fetch(`${getCloudFunctionsBaseUrl()}/createCheckoutSession`, {
    method: "OPTIONS",
  }).catch(() => {});
};

export const prefetchCheckout = (email) => {
  warmupCheckoutFunction();
  try {
    void getStripe();
  } catch {
    // Publishable key may be missing in local setups.
  }
  if (email) void ensureUserDoc(email);
};

export const prefetchSubscriptionDetails = (email) => {
  if (!email) return;
  void getSubscriptionDetails(email).then((details) => {
    if (!isSubscribed(details.status)) prefetchCheckout(email);
  });
};

export const startCheckout = async (email, { interval = "month" } = {}) => {
  if (!email) throw new Error("You must be signed in to subscribe.");
  const yearly = String(interval).toLowerCase() === "year";
  const priceId = getStripePriceId(yearly ? "year" : "month");
  if (!priceId || !priceId.startsWith("price_")) {
    throw new Error(
      yearly
        ? isLocalTesting()
          ? "Missing test yearly Price ID. Set REACT_APP_STRIPE_TEST_YEARLY_PRICE_ID."
          : "Missing live yearly Price ID. Set REACT_APP_STRIPE_LIVE_YEARLY_PRICE_ID."
        : isLocalTesting()
          ? "Missing test Stripe Price ID. Set REACT_APP_STRIPE_TEST_PRICE_ID and LOCAL_TESTING=true."
          : "Missing live Stripe Price ID. Set REACT_APP_STRIPE_LIVE_PRICE_ID and LOCAL_TESTING=false.",
    );
  }

  prefetchCheckout(email);

  const [, response, stripe] = await Promise.all([
    ensureUserDoc(email),
    fetch(`${getCloudFunctionsBaseUrl()}/createCheckoutSession`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        priceId,
        successUrl: appHashUrl(
          "/subscription-success?session_id={CHECKOUT_SESSION_ID}",
        ),
        cancelUrl: appHashUrl("/subscription-cancel"),
      }),
    }),
    getStripe().catch(() => null),
  ]);

  if (!response.ok) {
    throw new Error(await parseFunctionError(response));
  }

  const { sessionId, url } = await response.json();
  if (url) {
    window.location.assign(url);
    return;
  }
  if (!stripe) throw new Error("Could not load Stripe.");
  if (!sessionId) throw new Error("Missing Stripe checkout session.");
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw error;
};

export const confirmCheckoutSession = async (email, sessionId) => {
  if (!email || !sessionId) {
    throw new Error("Missing checkout session.");
  }

  const response = await fetch(
    `${getCloudFunctionsBaseUrl()}/confirmCheckoutSession`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, sessionId }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseFunctionError(response));
  }

  invalidateSubscriptionDetails(email);
  return response.json();
};

export const openCustomerPortal = async (email) => {
  if (!email) throw new Error("You must be signed in.");

  const response = await fetch(
    `${getCloudFunctionsBaseUrl()}/createPortalSession`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        returnUrl: appHashUrl("/profile"),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await parseFunctionError(response));
  }

  const { url } = await response.json();
  window.location.href = url;
};
