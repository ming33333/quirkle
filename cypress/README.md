# Cypress Tests for Subscription Service

This directory contains end-to-end tests for the subscription service, simulating real user interactions.

## Running Tests

### Open Cypress Test Runner (Interactive Mode)
```bash
npm run cypress:open
```

### Run Subscription Tests Only (Interactive)
```bash
npm run cypress:subscription
```

### Run All Tests Headlessly
```bash
npm run cypress:run
```

## Test Structure

### `cypress/e2e/subscription.cy.js`
Main test file covering:
- **Profile Overlay - Subscription Display**: Tests viewing subscription status
- **Upgrade Options**: Tests viewing and interacting with plan options
- **Checkout Flow**: Tests initiating Stripe checkout
- **Subscription Management**: Tests managing active subscriptions
- **Subscription Limits**: Tests character/question limits enforcement
- **Success/Cancel Pages**: Tests post-checkout pages
- **Error Handling**: Tests error scenarios

## Test Data

Test fixtures are in `cypress/fixtures/subscription.json`:
- Test user credentials
- Plan details
- Stripe test data

## Custom Commands

Located in `cypress/support/commands.js`:
- `cy.login(email, password)` - Login helper
- `cy.openProfileOverlay()` - Opens profile overlay
- `cy.mockStripeCheckout()` - Mocks Stripe checkout
- `cy.mockStripePortal()` - Mocks Stripe portal
- `cy.setSubscriptionStatus(email, status)` - Sets subscription status (needs implementation)

## Mocking

Tests mock:
- Stripe checkout redirects
- Stripe portal redirects
- Firestore subscription status reads
- Cloud Functions API calls

## Watching Tests

When you run `npm run cypress:subscription`, you'll see:
1. **Test Runner UI** - Visual test execution
2. **Browser Preview** - See tests run in real browser
3. **Step-by-step execution** - Watch each command execute
4. **DOM snapshots** - See page state at each step
5. **Network requests** - Monitor API calls

## Prerequisites

1. **Start your app**: `npm start` (should run on http://localhost:3000)
2. **Have test user**: Create a test user in Firebase Auth
3. **Mock Firestore**: Tests intercept Firestore calls, but you may need to set up test data

## Notes

- Tests use mocked Stripe redirects (no real Stripe calls)
- Firestore reads are intercepted and mocked
- You may need to adjust selectors based on your actual UI
- Some commands (like `setSubscriptionStatus`) need implementation based on your test setup

## Troubleshooting

**Tests fail to find elements:**
- Check that your app is running on `http://localhost:3000`
- Verify selectors match your actual UI
- Use Cypress selector playground to find correct selectors

**Login fails:**
- Ensure test user exists in Firebase Auth
- Check Firebase Auth configuration
- Verify login page selectors

**Stripe mocks not working:**
- Check that `mockStripeCheckout()` is called in `beforeEach`
- Verify intercepts are set up correctly
- Check browser console for errors
