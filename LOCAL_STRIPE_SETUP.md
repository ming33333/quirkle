# Stripe provider – local setup

Get the Stripe provider (checkout + customer portal) working on your machine using the Firebase Functions emulator.

## 1. Stripe test keys and prices

1. Open [Stripe Dashboard → API keys (test mode)](https://dashboard.stripe.com/test/apikeys).
2. Copy:
   - **Publishable key** (e.g. `pk_test_...`) → frontend
   - **Secret key** (e.g. `sk_test_...`) → backend
3. In [Products](https://dashboard.stripe.com/test/products), create at least one product and price, then copy the **Price ID** (e.g. `price_...`).

## 2. Backend (Cloud Functions emulator)

The emulator loads env vars from a `.env` file in the **functions source** directory.

1. **Create `quirkle-functions/.env`** (copy from `.env.example`):

```bash
cd quirkle-functions
cp .env.example .env
```

2. **Edit `quirkle-functions/.env`** and set:

```env
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
# Optional for local checkout/portal; needed only if you test webhooks locally
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **Optional – real Price IDs in the function**

If you use real Stripe Price IDs from the dashboard, add them to `quirkle-functions/index.js` in `PRICE_TO_STATUS_MAP`, for example:

```js
const PRICE_TO_STATUS_MAP = {
  'price_1ABC...': 'basic',
  'price_1XYZ...': 'pro',
};
```

4. **Install and run the emulator** (from repo root):

```bash
cd quirkle-functions && npm install && cd ..
firebase emulators:start --only functions
```

Leave this running. Your functions will be at:

`http://localhost:5001/quirkle-db/us-central1`

(Replace `quirkle-db` with your project ID if different; see `.firebaserc`.)

## 3. Frontend (React app)

1. **Create `.env` in the project root** (copy from `.env.example`):

```bash
cp .env.example .env
```

2. **Edit `.env`** and set:

```env
# Stripe test publishable key (from Stripe Dashboard)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key

# Price IDs from Stripe Dashboard (Products → your product → Price ID)
REACT_APP_STRIPE_BASIC_PRICE_ID=price_...
REACT_APP_STRIPE_PRO_PRICE_ID=price_...

# Must point at the Functions emulator when running locally
REACT_APP_CLOUD_FUNCTIONS_URL=http://localhost:5001/quirkle-db/us-central1
```

Use your real project ID if it’s not `quirkle-db` (see `.firebaserc`).

3. **Restart the React dev server** after changing `.env`:

```bash
npm start
```

## 4. Run everything locally

1. **Terminal 1 – Functions emulator**

```bash
firebase emulators:start --only functions
```

2. **Terminal 2 – React app**

```bash
npm start
```

3. In the app: sign in → Profile → “View Upgrade Options” → choose a plan. You should be sent to Stripe Checkout. Use test card `4242 4242 4242 4242`.

## 5. Troubleshooting

| Issue | What to check |
|-------|----------------|
| “Failed to create checkout session” / network error | Is the emulator running? Is `REACT_APP_CLOUD_FUNCTIONS_URL` exactly `http://localhost:5001/<project-id>/us-central1`? |
| “Stripe not initialized” | Is `REACT_APP_STRIPE_PUBLISHABLE_KEY` set in `.env` and did you restart `npm start`? |
| Invalid price / plan errors | Do `REACT_APP_STRIPE_*_PRICE_ID` and `PRICE_TO_STATUS_MAP` in `quirkle-functions/index.js` match your Stripe Price IDs? |
| Emulator doesn’t see Stripe key | Is `STRIPE_SECRET_KEY` in `quirkle-functions/.env`? The emulator loads `.env` from the **functions** directory. |

## 6. Webhooks (optional, for local testing)

To test subscription lifecycle (e.g. status in Firestore after payment):

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli).
2. Run: `stripe listen --forward-to localhost:5001/quirkle-db/us-central1/stripeWebhook`
3. Put the printed webhook signing secret in `quirkle-functions/.env` as `STRIPE_WEBHOOK_SECRET` and restart the emulator.

Checkout and customer portal work locally without webhooks; webhooks are only needed to sync subscription status to Firestore.
