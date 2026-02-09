/**
 * Subscription Plans Configuration
 * 
 * This file defines all available subscription plans and their limits.
 * Plans are used across the app to enforce feature limits.
 */

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null, // Stripe Price ID (set in .env)
    maxQuestions: 10,
    maxChars: 500,
    features: [
      '10 questions per quiz',
      '500 characters per question/answer',
      'Basic features'
    ]
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 9.99, // Monthly price in USD
    priceId: process.env.REACT_APP_STRIPE_BASIC_PRICE_ID || 'price_pseudo_basic_monthly', // Stripe Price ID
    maxQuestions: 50,
    maxChars: 500,
    features: [
      '50 questions per quiz',
      '500 characters per question/answer',
      'All basic features',
      'Priority support'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99, // Monthly price in USD
    priceId: process.env.REACT_APP_STRIPE_PRO_PRICE_ID || 'price_pseudo_pro_monthly', // Stripe Price ID
    maxQuestions: 200,
    maxChars: 2000,
    features: [
      '200 questions per quiz',
      '2000 characters per question/answer',
      'All features',
      'Priority support',
      'Advanced analytics'
    ]
  }
};

/**
 * Get plan limits for a given subscription status
 */
export const getPlanLimits = (subscriptionStatus) => {
  return SUBSCRIPTION_PLANS[subscriptionStatus]?.maxQuestions 
    ? {
        maxQuestions: SUBSCRIPTION_PLANS[subscriptionStatus].maxQuestions,
        maxChars: SUBSCRIPTION_PLANS[subscriptionStatus].maxChars
      }
    : SUBSCRIPTION_PLANS.free;
};

/**
 * Get all paid plans (excludes free)
 */
export const getPaidPlans = () => {
  return Object.values(SUBSCRIPTION_PLANS).filter(plan => plan.id !== 'free');
};
