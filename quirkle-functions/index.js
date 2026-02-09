/**
 * Cloud Functions for Quirkle Subscription Management
 * 
 * This file contains Firebase Cloud Functions for handling Stripe subscriptions:
 * - createCheckoutSession: Creates a Stripe Checkout session
 * - createPortalSession: Creates a Stripe Customer Portal session
 * - stripeWebhook: Handles Stripe webhook events (subscription updates, cancellations, etc.)
 * 
 * SETUP INSTRUCTIONS:
 * 1. Install dependencies: cd quirkle-functions && npm install
 * 2. Copy .env.example to .env and set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
 * 3. For deployment: set the same env vars in Google Cloud Console
 *    (Cloud Functions → your function → Edit → Environment variables)
 * 4. Deploy: firebase deploy --only functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

admin.initializeApp();

const db = admin.firestore();
const USER_SETTING_DOC_ID = 'settings';
const SUBSCRIPTION_FIELD = 'subscription status';

/**
 * Map Stripe price IDs to subscription statuses
 * TODO: Update these with your actual Stripe Price IDs
 */
const PRICE_TO_STATUS_MAP = {
  'price_pseudo_basic_monthly': 'basic',
  'price_pseudo_pro_monthly': 'pro',
  // Add your actual Stripe Price IDs here after setup
};

/**
 * Map Stripe subscription status to our subscription status
 */
const STRIPE_STATUS_TO_STATUS = {
  'active': null, // Keep current status
  'canceled': 'free',
  'past_due': null, // Keep current status but could add warning
  'unpaid': 'free',
  'trialing': null, // Keep current status
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
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, priceId, successUrl, cancelUrl } = req.body;

    if (!email || !priceId) {
      return res.status(400).json({ error: 'Missing required fields: email, priceId' });
    }

    // Verify user exists in Firestore
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email, // Pre-fill checkout form; Stripe creates/links customer
      payment_method_types: ['card'], // Accept card payments only
      line_items: [
        {
          price: priceId, // Stripe Price ID for the plan (e.g. basic, pro)
          quantity: 1, // One subscription per checkout
        },
      ],
      mode: 'subscription', // Recurring billing (not one-time payment)
      success_url: successUrl, // Where to redirect after successful payment
      cancel_url: cancelUrl, // Where to redirect if user abandons checkout
      metadata: {
        email: email, // Stored with session for webhook/customer lookup
        priceId: priceId, // Track which plan was selected
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
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
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, returnUrl } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing required field: email' });
    }

    // Find Stripe customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ error: 'No Stripe customer found for this email' });
    }

    const customer = customers.data[0];

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
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
 * Handle Stripe Webhook Events
 * POST /stripeWebhook
 *
 * Role: Keeps Firestore in sync with Stripe subscription state. Stripe calls this
 * endpoint when subscriptions are created, updated, cancelled, or when payments
 * succeed/fail. Updates the user's subscription status in Firestore so the app
 * can enforce access (e.g. basic vs pro features). Must be configured in Stripe.
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
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      await handleSubscriptionCancellation(subscription);
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
  const email = subscription.metadata?.email || subscription.customer_email;
  if (!email) {
    // Try to get email from customer object
    const customer = await stripe.customers.retrieve(subscription.customer);
    email = customer.email;
  }

  if (!email) {
    console.error('No email found in subscription:', subscription.id);
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id;
  const status = PRICE_TO_STATUS_MAP[priceId] || 'basic'; // Default to basic if not mapped

  // Update Firestore
  const userRef = db.collection('users').doc(email);
  const settingsRef = userRef.collection('userSetting').doc(USER_SETTING_DOC_ID);
  
  await settingsRef.set(
    { [SUBSCRIPTION_FIELD]: status },
    { merge: true }
  );

  console.log(`Updated subscription for ${email} to ${status}`);
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(subscription) {
  const email = subscription.metadata?.email || subscription.customer_email;
  if (!email) {
    const customer = await stripe.customers.retrieve(subscription.customer);
    email = customer.email;
  }

  if (!email) {
    console.error('No email found in subscription:', subscription.id);
    return;
  }

  // Update Firestore to free
  const userRef = db.collection('users').doc(email);
  const settingsRef = userRef.collection('userSetting').doc(USER_SETTING_DOC_ID);
  
  await settingsRef.set(
    { [SUBSCRIPTION_FIELD]: 'free' },
    { merge: true }
  );

  console.log(`Cancelled subscription for ${email}`);
}

/**
 * Handle successful payment
 */
async function handlePaymentSucceeded(invoice) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  await handleSubscriptionUpdate(subscription);
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(invoice) {
  // You might want to send an email notification here
  console.log('Payment failed for invoice:', invoice.id);
  // Optionally downgrade to free after multiple failures
}
