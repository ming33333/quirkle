# Quick Start: Subscription Setup

## Prerequisites

1. Firebase project set up
2. Stripe account (test mode for development)

## Quick Setup Steps

### 1. Install Dependencies

```bash
# Frontend dependencies (already in package.json)
npm install

# Cloud Functions dependencies
cd functions
npm install
cd ..
```

### 2. Configure Stripe

1. Get your Stripe API keys from [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Create products and prices in Stripe Dashboard
3. Copy the Price IDs

### 3. Set Environment Variables

**Frontend** (create `.env` file in project root):
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
REACT_APP_STRIPE_BASIC_PRICE_ID=price_...
REACT_APP_STRIPE_PRO_PRICE_ID=price_...
REACT_APP_CLOUD_FUNCTIONS_URL=http://localhost:5001/YOUR_PROJECT/us-central1
```

**Backend** (Firebase Functions config):
```bash
firebase functions:config:set stripe.secret_key="sk_test_..."
firebase functions:config:set stripe.webhook_secret="whsec_..."
```
using .env now

### 4. Deploy Cloud Functions

```bash
cd quirkle-functions
firebase deploy 
```

### 5. Configure Stripe Webhook

1. In Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/stripeWebhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret and update Firebase config

### 6. Update Price Mappings

Edit `functions/index.js` → `PRICE_TO_STATUS_MAP` with your actual Price IDs

### 7. Test

1. Start app: `npm start`
2. Log in and open profile overlay
3. Click "View Upgrade Options"
4. Test checkout with card: `4242 4242 4242 4242`

## Files Created

- `src/config/subscriptionPlans.js` - Plan configurations
- `src/services/subscriptionService.js` - Subscription service (Stripe/RevenueCat abstraction)
- `src/components/profileOverlay.js` - Updated with subscription UI
- `src/pages/subscriptionSuccess.js` - Success page
- `src/pages/subscriptionCancel.js` - Cancel page
- `functions/index.js` - Cloud Functions for Stripe
- `SUBSCRIPTION_SETUP.md` - Detailed setup guide

## Adding RevenueCat Later

The codebase is structured to easily add RevenueCat:

1. Install: `npm install react-native-purchases`
2. Implement `RevenueCatProvider` class in `subscriptionService.js`
3. Update `getCurrentProvider()` to detect mobile platform
4. Configure RevenueCat webhooks to sync with Firestore

See `SUBSCRIPTION_SETUP.md` for detailed RevenueCat instructions.
