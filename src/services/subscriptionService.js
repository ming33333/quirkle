/**
 * Subscription Service
 * 
 * This service abstracts subscription management to support multiple providers:
 * - Stripe (web subscriptions)
 * - RevenueCat (mobile subscriptions - to be added)
 * 
 * The service automatically detects the platform and uses the appropriate provider.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase/firebaseDB';
import { getAuth } from 'firebase/auth';

const USER_SETTING_DOC_ID = 'settings';
const SUBSCRIPTION_FIELD = 'subscription status';

// Cloud Functions base URL: use env override, otherwise deployed Firebase Cloud Functions
const getCloudFunctionsBaseUrl = () => {
  if (process.env.REACT_APP_CLOUD_FUNCTIONS_URL) {
    return process.env.REACT_APP_CLOUD_FUNCTIONS_URL.replace(/\/$/, '');
  }
  const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID || 'quirkle-db';
  return `https://us-central1-${projectId}.cloudfunctions.net`;
};

// Provider types
const PROVIDER_STRIPE = 'stripe';
const PROVIDER_REVENUECAT = 'revenuecat';

/**
 * Detect the current platform/provider
 * TODO: Add RevenueCat detection when mobile app is ready
 */
const getCurrentProvider = () => {
  // For now, always use Stripe for web
  // When RevenueCat is added, detect mobile platform here
  // if (isMobileApp()) return PROVIDER_REVENUECAT;
  return PROVIDER_STRIPE;
};

/**
 * Stripe Subscription Provider
 * Handles Stripe checkout and subscription management
 */
class StripeProvider {
  constructor() {
    // Pseudo Stripe keys - replace with real keys from .env
    this.publishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_pseudo_key_replace_with_real';
    this.stripe = null;
    this.init();
  }

  async init() {
    // Use @stripe/stripe-js if available, otherwise load from CDN
    if (typeof window !== 'undefined') {
      try {
        // Try to use @stripe/stripe-js if installed
        const { loadStripe } = await import('@stripe/stripe-js');
        this.stripe = await loadStripe(this.publishableKey);
      } catch (e) {
        // Fallback to CDN if @stripe/stripe-js not available
        if (window.Stripe) {
          this.stripe = window.Stripe(this.publishableKey);
        } else {
          // Load Stripe.js script from CDN
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            script.onload = () => {
              if (window.Stripe) {
                this.stripe = window.Stripe(this.publishableKey);
                resolve();
              } else {
                reject(new Error('Failed to load Stripe'));
              }
            };
            script.onerror = () => reject(new Error('Failed to load Stripe script'));
            document.head.appendChild(script);
          });
        }
      }
    }
  }

  /**
   * Create a checkout session for a subscription plan
   */
  async createCheckoutSession(email, priceId, successUrl, cancelUrl) {
    try {
      // Call Cloud Function to create checkout session
      const response = await fetch(
        `${getCloudFunctionsBaseUrl()}/createCheckoutSession`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            priceId,
            successUrl,
            cancelUrl,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      return sessionId;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Redirect to Stripe Checkout
   */
  async checkout(email, priceId) {
    try {
      await this.init(); // Ensure Stripe is loaded

      const successUrl = `${window.location.origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/subscription-cancel`;

      const sessionId = await this.createCheckoutSession(email, priceId, successUrl, cancelUrl);

      // Redirect to Stripe Checkout
      if (this.stripe) {
        const { error } = await this.stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      } else {
        throw new Error('Stripe not initialized');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  }

  /**
   * Create a portal session for managing subscription
   */
  async createPortalSession(email, returnUrl) {
    try {
      const response = await fetch(
        `${getCloudFunctionsBaseUrl()}/createPortalSession`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            returnUrl,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create portal session');
      }

      const { url } = await response.json();
      return url;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  /**
   * Redirect to Stripe Customer Portal
   */
  async manageSubscription(email) {
    try {
      const returnUrl = `${window.location.origin}/profile`;
      const portalUrl = await this.createPortalSession(email, returnUrl);
      window.location.href = portalUrl;
    } catch (error) {
      console.error('Error managing subscription:', error);
      throw error;
    }
  }
}

/**
 * RevenueCat Provider (Placeholder for future mobile support)
 * TODO: Implement when mobile app is ready
 */
class RevenueCatProvider {
  constructor() {
    // RevenueCat will be initialized here when mobile app is added
    this.apiKey = process.env.REACT_APP_REVENUECAT_API_KEY || 'rc_pseudo_key_replace_with_real';
  }

  async checkout(email, productId) {
    // TODO: Implement RevenueCat checkout
    throw new Error('RevenueCat provider not yet implemented');
  }

  async manageSubscription(email) {
    // TODO: Implement RevenueCat subscription management
    throw new Error('RevenueCat provider not yet implemented');
  }
}

/**
 * Subscription Service
 * Main service that routes to the appropriate provider
 */
class SubscriptionService {
  constructor() {
    this.provider = getCurrentProvider();
    this.stripeProvider = new StripeProvider();
    this.revenueCatProvider = new RevenueCatProvider();
  }

  /**
   * Get current subscription status from Firestore
   */
  async getSubscriptionStatus(email) {
    try {
      const ref = doc(db, 'users', email, 'userSetting', USER_SETTING_DOC_ID);
      const snapshot = await getDoc(ref);
      const data = snapshot.exists() ? snapshot.data() : {};
      return data[SUBSCRIPTION_FIELD] || 'free';
    } catch (error) {
      console.error('Error getting subscription status:', error);
      return 'free';
    }
  }

  /**
   * Update subscription status in Firestore
   * Note: This is typically called by Cloud Functions after webhook events
   */
  async updateSubscriptionStatus(email, status) {
    try {
      const ref = doc(db, 'users', email, 'userSetting', USER_SETTING_DOC_ID);
      await setDoc(ref, { [SUBSCRIPTION_FIELD]: status }, { merge: true });
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  /**
   * Start checkout for a subscription plan
   */
  async checkout(email, planId) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || user.email !== email) {
      throw new Error('User not authenticated');
    }

    if (this.provider === PROVIDER_STRIPE) {
      // Get price ID from plan configuration
      const { SUBSCRIPTION_PLANS } = await import('../config/subscriptionPlans');
      const plan = SUBSCRIPTION_PLANS[planId];
      
      if (!plan || !plan.priceId) {
        throw new Error(`Invalid plan: ${planId}`);
      }

      return await this.stripeProvider.checkout(email, plan.priceId);
    } else if (this.provider === PROVIDER_REVENUECAT) {
      return await this.revenueCatProvider.checkout(email, planId);
    } else {
      throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  /**
   * Manage existing subscription (cancel, update, etc.)
   */
  async manageSubscription(email) {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user || user.email !== email) {
      throw new Error('User not authenticated');
    }

    if (this.provider === PROVIDER_STRIPE) {
      return await this.stripeProvider.manageSubscription(email);
    } else if (this.provider === PROVIDER_REVENUECAT) {
      return await this.revenueCatProvider.manageSubscription(email);
    } else {
      throw new Error(`Unknown provider: ${this.provider}`);
    }
  }

  /**
   * Check if user has an active paid subscription
   */
  async hasActiveSubscription(email) {
    const status = await this.getSubscriptionStatus(email);
    return status !== 'free';
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
export default subscriptionService;

// Expose service on window for testing (only in test environments)
if (typeof window !== 'undefined' && (process.env.NODE_ENV === 'test' || window.Cypress)) {
  window.__subscriptionService = subscriptionService;
}
