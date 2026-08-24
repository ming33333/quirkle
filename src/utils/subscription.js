import { loadStripe } from "@stripe/stripe-js";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

const USER_SETTING_DOC_ID = "settings";
const SUBSCRIPTION_FIELD = "subscription status";

export const FREE_PLAN_MAX_DECKS = 6;
export const MAX_QUESTIONS_PER_DECK = 200;

const env = (key) =>
  import.meta.env[key] || (typeof process !== "undefined" ? process.env[key] : "");

const getCloudFunctionsBaseUrl = () => {
  const override = env("REACT_APP_CLOUD_FUNCTIONS_URL");
  if (override) return override.replace(/\/$/, "");
  const projectId = env("REACT_APP_FIREBASE_PROJECT_ID") || "quirkle-db";
  return `https://us-central1-${projectId}.cloudfunctions.net`;
};

export const getStripePriceId = () => env("REACT_APP_STRIPE_PRICE_ID") || "";

const getPublishableKey = () => env("REACT_APP_STRIPE_PUBLISHABLE_KEY") || "";

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
  if (exact !== normalized) {
    await markFreeInFirestore(normalized);
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

export const startCheckout = async (email) => {
  if (!email) throw new Error("You must be signed in to subscribe.");
  const priceId = getStripePriceId();
  if (!priceId || !priceId.startsWith("price_")) {
    throw new Error(
      "Missing Stripe Price ID. Set REACT_APP_STRIPE_PRICE_ID in .env.",
    );
  }

  await ensureUserDoc(email);

  const response = await fetch(
    `${getCloudFunctionsBaseUrl()}/createCheckoutSession`,
    {
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
    },
  );

  if (!response.ok) {
    throw new Error(await parseFunctionError(response));
  }

  const { sessionId } = await response.json();
  const stripe = await getStripe();
  if (!stripe) throw new Error("Could not load Stripe.");
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
