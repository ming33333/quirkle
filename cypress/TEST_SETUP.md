# Cypress Test Setup Guide

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start your app**:
   ```bash
   npm start
   ```
   App should run on `http://localhost:3000`

3. **Open Cypress**:
   ```bash
   npm run cypress:subscription
   ```

4. **Watch the tests run!** 🎬

## Test User Setup

Before running tests, you need to create a test user in Firebase Auth:

1. Go to Firebase Console → Authentication
2. Create a user with:
   - Email: `test@quirkle.test`
   - Password: `testpassword123`

Or update the test credentials in `cypress/e2e/subscription.cy.js`:

```javascript
const testUser = {
  email: 'your-test-email@example.com',
  password: 'your-test-password'
};
```

## What You'll See

When you run `npm run cypress:subscription`, Cypress will:

1. **Open Test Runner** - Visual interface showing all tests
2. **Show Browser Preview** - See tests execute in real browser
3. **Highlight Elements** - Watch as Cypress finds and interacts with elements
4. **Show Network Requests** - See API calls being made/mocked
5. **Display Assertions** - See what's being verified

## Test Scenarios Covered

### ✅ Profile Overlay Tests
- Viewing subscription status
- Displaying plan features
- Showing upgrade button

### ✅ Upgrade Flow Tests
- Viewing available plans
- Plan details display
- Clicking upgrade buttons

### ✅ Checkout Tests
- Initiating Stripe checkout
- Handling checkout errors
- Loading states

### ✅ Subscription Management
- Viewing active subscription
- Managing subscription via portal
- Error handling

### ✅ Limits Enforcement
- Character limits
- Question limits
- Warning messages

### ✅ Success/Cancel Pages
- Success page display
- Cancel page display
- Redirects

## Customizing Tests

### Update Selectors

If your UI changes, update selectors in:
- `cypress/e2e/subscription.cy.js` - Main test file
- `cypress/support/commands.js` - Custom commands

### Add New Tests

Add new test cases in `cypress/e2e/subscription.cy.js`:

```javascript
it('should test new feature', () => {
  cy.login(testUser.email, testUser.password);
  cy.openProfileOverlay();
  // Your test steps here
});
```

### Mock Different Scenarios

Update mocks in `beforeEach`:

```javascript
beforeEach(() => {
  // Mock different subscription status
  mockSubscriptionStatus(testUser.email, 'pro');
  
  // Mock different API responses
  cy.intercept('POST', '**/createCheckoutSession', {
    statusCode: 200,
    body: { sessionId: 'custom_session_id' }
  });
});
```

## Troubleshooting

### Tests Can't Find Elements

1. Check that your app is running: `npm start`
2. Verify URL matches: `http://localhost:3000`
3. Use Cypress selector playground (click element in test runner)
4. Check browser console for errors

### Login Fails

1. Verify test user exists in Firebase Auth
2. Check Firebase Auth configuration
3. Verify email/password in test file
4. Check network tab for auth errors

### Stripe Mocks Not Working

1. Verify `mockStripeCheckout()` is called
2. Check intercept URLs match your API
3. Verify Cloud Functions URL in `.env`
4. Check browser console for errors

### Firestore Mocks Not Working

1. Verify intercept pattern matches your Firestore calls
2. Check Firestore security rules allow reads
3. Verify document structure matches mock response
4. Check network tab for actual Firestore requests

## Tips for Watching Tests

1. **Slow Down Execution**: Add `cy.wait(1000)` between steps to watch carefully
2. **Use `.debug()`**: Add `cy.get('.element').debug()` to pause and inspect
3. **Check Network Tab**: See what API calls are being made
4. **Inspect Elements**: Right-click elements in test runner to inspect
5. **Read Console**: Check browser console for errors/warnings

## Next Steps

- Add more test scenarios
- Add visual regression tests (with `cypress-image-diff`)
- Add performance tests
- Add accessibility tests
- Integrate with CI/CD
