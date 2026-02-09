# Subscription Setup Guide

This guide will help you set up Stripe subscriptions for Quirkle, with instructions for adding RevenueCat later.

## Architecture Overview

- **Frontend**: React app with subscription management UI in profile overlay
- **Backend**: Firebase Cloud Functions handle Stripe integration
- **Database**: Firestore stores subscription status at `users/{email}/userSetting/settings`
- **Future**: RevenueCat support for mobile subscriptions (structure ready)

## Part 1: Stripe Setup

### 1. Create Stripe Account

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/register)
2. Complete account setup
3. Switch to **Test Mode** for development

### 2. Get Stripe API Keys

1. Navigate to [API Keys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 3. Create Subscription Products and Prices

1. Go to [Products](https://dashboard.stripe.com/test/products)
2. Create products for each plan:
   - **Basic Plan**
     - Name: "Basic"
     - Price: $9.99/month (recurring)
     - Copy the Price ID (starts with `price_`)
   - **Pro Plan**
     - Name: "Pro"
     - Price: $19.99/month (recurring)
     - Copy the Price ID (starts with `price_`)

### 4. Configure Environment Variables

#### Frontend (.env file in project root)

Create a `.env` file in the project root:

```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
REACT_APP_STRIPE_BASIC_PRICE_ID=price_your_basic_price_id_here
REACT_APP_STRIPE_PRO_PRICE_ID=price_your_pro_price_id_here
REACT_APP_CLOUD_FUNCTIONS_URL=https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net
```

#### Backend (Firebase Functions)

1. Install Firebase CLI if not already installed:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Set Firebase Functions config:
   ```bash
   cd quirkle-functions
   firebase functions:config:set stripe.secret_key="sk_test_your_actual_key_here"
   firebase functions:config:set stripe.webhook_secret="whsec_your_webhook_secret_here"
   ```

   **Note**: You'll get the webhook secret after setting up the webhook endpoint (step 6).

### 5. Deploy Cloud Functions

1. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

2. Deploy functions:
   ```bash
   cd quirkle-functions
   firebase deploy --only quirkle-functions
   ```

3. Note the function URLs from the deployment output. You'll need:
   - `createCheckoutSession` URL
   - `createPortalSession` URL
   - `stripeWebhook` URL

### 6. Configure Stripe Webhook

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Update Firebase config with the webhook secret:
   ```bash
   firebase functions:config:set stripe.webhook_secret="whsec_your_actual_secret_here"
   firebase deploy --only functions
   ```

### 7. Update Price ID Mappings

Edit `functions/index.js` and update the `PRICE_TO_STATUS_MAP`:

```javascript
const PRICE_TO_STATUS_MAP = {
  'price_your_actual_basic_price_id': 'basic',
  'price_your_actual_pro_price_id': 'pro',
};
```

Redeploy functions:
```bash
firebase deploy --only functions
```

### 8. Update Frontend Configuration

1. Update `src/config/subscriptionPlans.js` with your actual Stripe Price IDs (or use environment variables)
2. Update `.env` with your Cloud Functions URL
3. Restart your React app

### 9. Test the Integration

1. Start your app: `npm start`
2. Log in and open the profile overlay
3. Click "View Upgrade Options"
4. Click "Upgrade to Basic" or "Upgrade to Pro"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Complete checkout
7. Verify subscription status updates in Firestore

## Part 2: Production Setup

### 1. Switch to Live Mode

1. In Stripe Dashboard, toggle to **Live Mode**
2. Get your live API keys
3. Update environment variables with live keys
4. Create live products and prices
5. Update webhook endpoint for live mode
6. Redeploy Cloud Functions

### 2. Security Considerations

- Never commit `.env` files or API keys to git
- Use Firebase Functions config for backend secrets
- Enable CORS restrictions in production
- Add rate limiting to Cloud Functions
- Monitor webhook events in Stripe Dashboard

## Part 3: Adding RevenueCat (Future)

The codebase is structured to easily add RevenueCat for mobile subscriptions:

### 1. Install RevenueCat SDK

```bash
npm install react-native-purchases
```

### 2. Update Subscription Service

The `subscriptionService.js` already has a `RevenueCatProvider` class placeholder. You'll need to:

1. Initialize RevenueCat in your mobile app
2. Implement `checkout()` method
3. Implement `manageSubscription()` method
4. Update `getCurrentProvider()` to detect mobile platform

### 3. RevenueCat Setup Steps

1. Create account at [RevenueCat](https://www.revenuecat.com/)
2. Create a project and configure iOS/Android apps
3. Set up products in RevenueCat dashboard
4. Configure webhooks to sync with Firestore
5. Update `subscriptionService.js` with RevenueCat implementation

### 4. Platform Detection

Update `getCurrentProvider()` in `subscriptionService.js`:

```javascript
const getCurrentProvider = () => {
  // Detect if running in React Native mobile app
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return PROVIDER_REVENUECAT;
  }
  // Web platform uses Stripe
  return PROVIDER_STRIPE;
};
```

## File Structure

```
quirkle/
├── src/
│   ├── config/
│   │   └── subscriptionPlans.js      # Plan configurations
│   ├── services/
│   │   └── subscriptionService.js     # Subscription service (Stripe/RevenueCat abstraction)
│   └── components/
│       └── profileOverlay.js          # Subscription management UI
├── functions/
│   ├── index.js                       # Cloud Functions for Stripe
│   ├── package.json
│   └── .env.example
└── SUBSCRIPTION_SETUP.md              # This file
```

## Troubleshooting

### Checkout not working
- Verify Stripe keys are correct
- Check Cloud Functions are deployed
- Check browser console for errors
- Verify CORS is enabled in Cloud Functions

### Webhook not updating subscription
- Verify webhook secret is correct
- Check Cloud Functions logs: `firebase functions:log`
- Verify webhook events are being received in Stripe Dashboard
- Check Firestore security rules allow writes

### Subscription status not updating
- Check Firestore security rules
- Verify webhook is configured correctly
- Check Cloud Functions logs for errors
- Verify price ID mappings are correct

## Support

For issues:
1. Check Cloud Functions logs: `firebase functions:log`
2. Check Stripe Dashboard webhook events
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
