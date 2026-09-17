/**
 * Cloud Functions for Quirkle Subscription Management
 * 
 * This file contains Firebase Cloud Functions for handling Stripe subscriptions:
 * - createCheckoutSession: Creates a Stripe Checkout session
 * - createPortalSession: Creates a Stripe Customer Portal session
 * - getSubscriptionDetails: Returns plan status + next renewal date from Stripe
 * - cancelSubscription: User schedules cancel at period end (no renew; stays subscribed until then)
 * - stripeWebhook: Handles Stripe webhook events (subscription updates, cancellations, etc.)
 * - adminCancelSubscription: Admin cancels a user's Stripe subscription and sets Free
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install dependencies: cd quirkle-functions && npm install
 * 2. Copy .env.example to .env and set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 * 3. For deployment: set the same env vars in Google Cloud Console
 *    (Cloud Functions → your function → Edit → Environment variables)
 * 4. Deploy: firebase deploy --only functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

const getDb = () => {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin.firestore();
};
const USER_SETTING_DOC_ID = 'settings';
const SUBSCRIPTION_FIELD = 'subscription status';

const isLocalTesting = () =>
  String(process.env.LOCAL_TESTING || "").toLowerCase() === "true";

const stripeSecretKey = () => {
  const key = isLocalTesting()
    ? process.env.STRIPE_TEST_SECRET_KEY || process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_LIVE_SECRET_KEY;
  if (!key) {
    throw new Error(
      isLocalTesting()
        ? "Missing STRIPE_TEST_SECRET_KEY (LOCAL_TESTING=true)."
        : "Missing STRIPE_LIVE_SECRET_KEY (LOCAL_TESTING=false).",
    );
  }
  return key;
};

const stripeWebhookSecret = () =>
  isLocalTesting()
    ? process.env.STRIPE_TEST_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET
    : process.env.STRIPE_LIVE_WEBHOOK_SECRET;

let stripeClient = null;
let stripeClientMode = null;
const getStripe = () => {
  const mode = isLocalTesting() ? "test" : "live";
  if (!stripeClient || stripeClientMode !== mode) {
    stripeClient = require("stripe")(stripeSecretKey());
    stripeClientMode = mode;
  }
  return stripeClient;
};

/**
 * Map Stripe price IDs to subscription statuses.
 * Include both test and live Price IDs so either mode still marks subscribed.
 */
const PRICE_TO_STATUS_MAP = {
  ...(process.env.STRIPE_TEST_PRICE_ID
    ? { [process.env.STRIPE_TEST_PRICE_ID]: "subscribed" }
    : {}),
  ...(process.env.STRIPE_TEST_YEARLY_PRICE_ID
    ? { [process.env.STRIPE_TEST_YEARLY_PRICE_ID]: "subscribed" }
    : {}),
  ...(process.env.STRIPE_LIVE_PRICE_ID
    ? { [process.env.STRIPE_LIVE_PRICE_ID]: "subscribed" }
    : {}),
  ...(process.env.STRIPE_LIVE_YEARLY_PRICE_ID
    ? { [process.env.STRIPE_LIVE_YEARLY_PRICE_ID]: "subscribed" }
    : {}),
  ...(process.env.STRIPE_PRICE_ID
    ? { [process.env.STRIPE_PRICE_ID]: "subscribed" }
    : {}),
  price_pseudo_basic_monthly: "subscribed",
  price_pseudo_pro_monthly: "subscribed",
};

const ACCESS_SUBSCRIPTION_STATUSES = new Set([
  "active",
  "trialing",
  "past_due",
]);

const isAccessGrantingStatus = (status) =>
  ACCESS_SUBSCRIPTION_STATUSES.has(String(status || "").toLowerCase());

const planStatusFromSubscription = (subscription) => {
  if (!isAccessGrantingStatus(subscription?.status)) {
    return "free";
  }
  const priceId = subscription.items?.data?.[0]?.price?.id;
  return PRICE_TO_STATUS_MAP[priceId] || "subscribed";
};

const isCheckoutPaid = (session) => session?.payment_status === "paid";

const looksSubscribed = (status) => {
  const value = String(status || "free").toLowerCase();
  return value === "subscribed" || value === "basic" || value === "pro";
};

const emailFromSubscription = async (subscription) => {
  let email = subscription.metadata?.email || subscription.customer_email;
  if (!email) {
    const customer = await getStripe().customers.retrieve(subscription.customer);
    email = customer.email;
  }
  return email;
};

const findPaidSubscription = async (email, extraCustomerId) => {
  const customers = await getStripe().customers.list({
    email: String(email || "").trim().toLowerCase(),
    limit: 10,
  });
  const customerIds = customers.data.map((customer) => customer.id);
  if (extraCustomerId && !customerIds.includes(extraCustomerId)) {
    customerIds.push(extraCustomerId);
  }

  for (const customerId of customerIds) {
    const subscriptions = await getStripe().subscriptions.list({
      customer: customerId,
      status: "all",
      limit: 20,
    });
    const withAccess = subscriptions.data.find((sub) =>
      isAccessGrantingStatus(sub.status),
    );
    if (withAccess) return withAccess;
  }
  return null;
};

const syncPlanFromEmail = async (email, extraCustomerId) => {
  const withAccess = await findPaidSubscription(email, extraCustomerId);
  await setSubscriptionStatus(
    email,
    withAccess ? planStatusFromSubscription(withAccess) : "free",
  );
};

/**
 * Create a Stripe Checkout Session
 * POST /createCheckoutSession
 *
 * Role: Enables new users to subscribe. Creates a Stripe Checkout session and returns
 * a session ID; the frontend redirects the user to Stripe's hosted payment page where
 * they enter card details and complete the first subscription payment. Use this when
 * a user clicks "Subscribe" or selects a plan for the first time.
 */
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, priceId, successUrl, cancelUrl } = req.body;

    if (!email || !priceId) {
      return res.status(400).json({ error: 'Missing required fields: email, priceId' });
    }

    // Stripe Checkout requires a Price ID (price_...), not a Product ID (prod_...)
    if (typeof priceId === 'string' && priceId.startsWith('prod_')) {
      return res.status(400).json({
        error: 'Invalid priceId: use a Stripe Price ID (starts with price_), not a Product ID (prod_). In Stripe Dashboard: Products → your product → Pricing section → copy the Price ID.',
      });
    }

    // Verify user exists in Firestore
    const userRef = getDb().collection('users').doc(email);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const customers = await getStripe().customers.list({
      email: String(email).trim().toLowerCase(),
      limit: 1,
    });
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        email,
        priceId,
      },
      subscription_data: {
        metadata: { email },
      },
    };
    if (customers.data[0]) {
      sessionParams.customer = customers.data[0].id;
    } else {
      sessionParams.customer_email = email;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    const message =
      error.type === "StripeInvalidRequestError" &&
      error.param === "line_items[0][price]"
        ? `${error.message} Use a recurring Price ID (price_...) from the same Stripe mode as LOCAL_TESTING (test vs live).`
        : error.message;
    res.status(500).json({ error: message });
  }
});

/**
 * Create a Stripe Customer Portal Session
 * POST /createPortalSession
 *
 * Role: Enables existing subscribers to manage their subscription. Creates a session
 * and returns a URL to Stripe's Customer Portal where users can update payment methods,
 * cancel, change plans, or view invoices. Use this when a user clicks "Manage subscription"
 * or "Billing" in their profile.
 */
exports.createPortalSession = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, returnUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing required field: email' });
    }

    // Find Stripe customer by email
    const customers = await getStripe().customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ error: 'No Stripe customer found for this email' });
    }

    const customer = customers.data[0];

    // Create portal session
    const session = await getStripe().billingPortal.sessions.create({
      customer: customer.id, // Stripe Customer ID; must already exist (from prior checkout)
      return_url: returnUrl || 'https://quirkle.io/profile', // Where to redirect when user exits portal
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Return subscription status + next renewal date from Stripe.
 * POST /getSubscriptionDetails { email }
 */
exports.getSubscriptionDetails = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Missing required field: email" });
    }

    const firestoreStatus = await (async () => {
      const settingsRef = getDb()
        .collection("users")
        .doc(email)
        .collection("userSetting")
        .doc(USER_SETTING_DOC_ID);
      const snap = await settingsRef.get();
      return snap.exists ? snap.data()?.[SUBSCRIPTION_FIELD] || "free" : "free";
    })();

    const withAccess = await findPaidSubscription(email);

    if (!withAccess) {
      if (looksSubscribed(firestoreStatus)) {
        await setSubscriptionStatus(email, "free");
      }
      return res.json({
        status: "free",
        nextRenewalAt: null,
        cancelAtPeriodEnd: false,
        interval: null,
      });
    }

    const status = planStatusFromSubscription(withAccess);
    if (status !== firestoreStatus) {
      await setSubscriptionStatus(email, status);
    }

    const nextRenewalAt = withAccess.current_period_end
      ? new Date(withAccess.current_period_end * 1000).toISOString()
      : null;
    const interval = withAccess.items?.data?.[0]?.price?.recurring?.interval || null;

    res.json({
      status,
      nextRenewalAt,
      cancelAtPeriodEnd: Boolean(withAccess.cancel_at_period_end),
      interval,
    });
  } catch (error) {
    console.error("Error getting subscription details:", error);
    res.status(500).json({ error: error.message });
  }
});

async function setSubscriptionStatus(email, status) {
  const exact = String(email || "").trim();
  const normalized = exact.toLowerCase();
  if (!normalized) {
    throw new Error("Missing email for subscription update.");
  }

  const writeStatus = async (userId) => {
    const userRef = getDb().collection("users").doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({});
    }
    const settingsRef = userRef.collection("userSetting").doc(USER_SETTING_DOC_ID);
    await settingsRef.set({ [SUBSCRIPTION_FIELD]: status }, { merge: true });
  };

  await writeStatus(normalized);
  if (exact && exact !== normalized) {
    await writeStatus(exact);
  }
  console.log(`Updated subscription for ${normalized} to ${status}`);
}

/**
 * Confirm a completed Checkout Session and mark the user subscribed.
 * POST /confirmCheckoutSession { sessionId, email }
 */
exports.confirmCheckoutSession = functions.https.onRequest(async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId, email } = req.body;
    if (!sessionId || !email) {
      return res.status(400).json({ error: "Missing required fields: sessionId, email" });
    }

    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    const sessionEmail = (
      session.customer_email ||
      session.customer_details?.email ||
      session.metadata?.email ||
      ""
    ).toLowerCase();
    const expected = String(email).trim().toLowerCase();

    if (!sessionEmail || sessionEmail !== expected) {
      return res.status(403).json({ error: "Checkout session does not match this account." });
    }

    if (!isCheckoutPaid(session)) {
      return res.status(400).json({ error: "Checkout is not complete yet." });
    }

    if (session.subscription) {
      const subscription = await getStripe().subscriptions.retrieve(
        session.subscription,
      );
      if (!isAccessGrantingStatus(subscription.status)) {
        return res.status(400).json({
          error: "Payment did not go through. You have not been subscribed.",
        });
      }
    }

    await setSubscriptionStatus(expected, "subscribed");
    res.json({ status: "subscribed" });
  } catch (error) {
    console.error("Error confirming checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle Stripe Webhook Events
 * POST /stripeWebhook
 *
 * Role: Keeps Firestore in sync with Stripe subscription state. Stripe calls this
 * endpoint when subscriptions are created, updated, cancelled, or when payments
 * succeed/fail. Updates the user's subscription status in Firestore so the app
 * can enforce access (free vs subscribed). Must be configured in Stripe.
 *
 * Stripe Dashboard setup:
 * - Webhook URL: https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/stripeWebhook
 * - Events to listen for:
 *   - customer.subscription.created
 *   - customer.subscription.updated
 *   - customer.subscription.deleted
 *   - invoice.payment_succeeded
 *   - invoice.payment_failed
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = stripeWebhookSecret();
  const payload = req.rawBody || req.body;

  let event;

  try {
    event = getStripe().webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email =
        session.metadata?.email ||
        session.customer_email ||
        session.customer_details?.email;
      if (email && isCheckoutPaid(session)) {
        if (session.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription,
          );
          if (!isAccessGrantingStatus(subscription.status)) {
            await syncPlanFromEmail(email, session.customer);
            break;
          }
        }
        await setSubscriptionStatus(email, "subscribed");
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      await handlePaymentSucceeded(invoice);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      await handlePaymentFailed(invoice);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Handle subscription creation/update
 */
async function handleSubscriptionUpdate(subscription) {
  const email = await emailFromSubscription(subscription);
  if (!email) {
    console.error("No email found in subscription:", subscription.id);
    return;
  }
  await syncPlanFromEmail(email, subscription.customer);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdate(subscription);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  console.log("Payment failed for invoice:", invoice.id);
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdate(subscription);
}

const applyCors = (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

const requireAdmin = async (req) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    const error = new Error("Missing auth token.");
    error.status = 401;
    throw error;
  }
  const decoded = await admin.auth().verifyIdToken(token);
  const adminEmail = String(decoded.email || "").trim().toLowerCase();
  if (!adminEmail) {
    const error = new Error("Token has no email.");
    error.status = 403;
    throw error;
  }
  const adminDoc = await getDb().collection("admins").doc(adminEmail).get();
  if (!adminDoc.exists) {
    const error = new Error("Only admins can cancel subscriptions.");
    error.status = 403;
    throw error;
  }
  return adminEmail;
};

const requireSignedInUser = async (req, expectedEmail) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    const error = new Error("Missing auth token.");
    error.status = 401;
    throw error;
  }
  const decoded = await admin.auth().verifyIdToken(token);
  const authEmail = String(decoded.email || "").trim().toLowerCase();
  const target = String(expectedEmail || "").trim().toLowerCase();
  if (!authEmail) {
    const error = new Error("Token has no email.");
    error.status = 403;
    throw error;
  }
  if (!target || authEmail !== target) {
    const error = new Error("You can only cancel your own subscription.");
    error.status = 403;
    throw error;
  }
  return authEmail;
};

/**
 * User: stop renewal at period end. Stays subscribed until then; webhook sets free.
 * POST /cancelSubscription { email }
 * Authorization: Bearer <Firebase ID token> (must match email)
 */
exports.cancelSubscription = functions.https.onRequest(async (req, res) => {
  applyCors(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = String(req.body?.email || "").trim();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Missing user email." });
    }
    await requireSignedInUser(req, email);

    const customers = await getStripe().customers.list({
      email: email.toLowerCase(),
      limit: 10,
    });
    if (customers.data.length === 0) {
      return res.status(404).json({ error: "No Stripe customer found." });
    }

    let updated = null;
    for (const customer of customers.data) {
      const subscriptions = await getStripe().subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 20,
      });
      for (const subscription of subscriptions.data) {
        if (subscription.status !== "active" && subscription.status !== "trialing") {
          continue;
        }
        updated = await getStripe().subscriptions.update(subscription.id, {
          cancel_at_period_end: true,
        });
        break;
      }
      if (updated) break;
    }

    if (!updated) {
      return res.status(404).json({ error: "No active subscription to cancel." });
    }

    // Keep Firestore as subscribed until period ends (customer.subscription.deleted).
    res.json({
      status: "subscribed",
      cancelAtPeriodEnd: true,
      nextRenewalAt: updated.current_period_end
        ? new Date(updated.current_period_end * 1000).toISOString()
        : null,
    });
  } catch (error) {
    console.error("Error scheduling subscription cancel:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
});

/**
 * Admin: cancel a user's Stripe subscription(s) and set plan to free.
 * POST /adminCancelSubscription { email }
 * Authorization: Bearer <Firebase ID token of an admin>
 */
exports.adminCancelSubscription = functions.https.onRequest(async (req, res) => {
  applyCors(req, res);
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await requireAdmin(req);
    const email = String(req.body?.email || "").trim();
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Missing user email." });
    }

    let cancelled = 0;
    const customers = await getStripe().customers.list({
      email: email.toLowerCase(),
      limit: 10,
    });
    for (const customer of customers.data) {
      const subscriptions = await getStripe().subscriptions.list({
        customer: customer.id,
        status: "all",
        limit: 20,
      });
      for (const subscription of subscriptions.data) {
        if (subscription.status === "canceled") continue;
        await getStripe().subscriptions.cancel(subscription.id);
        cancelled += 1;
      }
    }

    await setSubscriptionStatus(email, "free");
    res.json({ status: "free", stripeCancelled: cancelled });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(error.status || 500).json({ error: error.message });
  }
});
