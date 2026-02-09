// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Logout helper command
 * Usage: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  // Visit home page first to check if logged in
  cy.visit('/#/login', { failOnStatusCode: false });
  cy.get('form').should('be.visible');
  
  // Check if user is logged in by looking for "Logged in as:" text
  cy.get('body', { timeout: 5000 }).then(($body) => {
    const bodyText = $body.text();
    if (bodyText.includes('Logged in as:')) {
      // User is logged in, logout via UI
      cy.contains('Logged in as:', { timeout: 5000 }).click();
      cy.get('.popup', { timeout: 5000 }).should('be.visible');
      cy.contains('button', 'Logout', { timeout: 5000 }).click();
      // Wait for redirect to login page
      cy.url({ timeout: 10000 }).should('include', '/login');
    } 
  });
});

/**
 * Login helper command
 * Usage: cy.login('test@example.com', 'password123')
 * Note: Assumes user is already logged out (logout is called in beforeEach)
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/#/login', { failOnStatusCode: false });
  
  // Wait for page to be fully loaded
  cy.window().should('have.property', 'document');
  
  // Wait for React to render - check for either login form or home redirect
  cy.get('body', { timeout: 10000 }).should('be.visible').then(() => {
    // Check current URL to see if we're still on login page
    cy.url().then((url) => {
      if (url.includes('/login')) {
        // Wait for form to be visible (with longer timeout)
        cy.get('form', { timeout: 10000 }).should('exist').then(($form) => {
          // Ensure form is actually visible
          cy.wrap($form).should('be.visible');
          console.log('Logging in with email:', email);
          console.log('cy.get("input[type="email"]"):', cy.get('input[type="email"]'));
          // Get email input
          cy.get('input[type="email"]')
            .type(email);
          
          console.log('cy.get("input[type="password"]"):', cy.get('input[type="password"]'));
          // Get password input
          cy.get('input[type="password"]', { timeout: 5000 })
            .should('exist')
            .should('be.visible')
            .clear({ force: true })
            .type(password, { force: true });
          
          // Click submit button
          cy.get('button[type="submit"]', { timeout: 5000 })
            .should('be.visible')
            .should('not.be.disabled')
            .click();
          
          // Wait for navigation to home
          cy.url({ timeout: 10000 }).should('include', '/home');
        });
      } else {
        // Already redirected (user was already logged in)
        cy.log('User already logged in - redirected to: ' + url);
      }
    });
  });
});

/**
 * Open profile overlay
 * Usage: cy.openProfileOverlay()
 */
Cypress.Commands.add('openProfileOverlay', () => {
  // Click on "Logged in as: email" text in header
  cy.contains('Logged in as:').click();
  cy.get('.overlay').should('be.visible');
  cy.get('.popup').should('be.visible');
});

/**
 * Mock Stripe checkout redirect
 * Usage: cy.mockStripeCheckout()
 */
Cypress.Commands.add('mockStripeCheckout', () => {
  // Intercept checkout session creation
  cy.intercept('POST', '**/createCheckoutSession', {
    statusCode: 200,
    body: { sessionId: 'cs_test_mock_session_id' }
  }).as('createCheckoutSession');
  
  // Create mock Stripe instance with stubbed redirectToCheckout
  cy.window().then((win) => {
    const mockStripeInstance = {
      redirectToCheckout: cy.stub().resolves({ error: null }).as('redirectToCheckout')
    };
    
    // Mock window.Stripe constructor (for CDN fallback)
    // This will be used if @stripe/stripe-js import fails
    win.Stripe = cy.stub().returns(mockStripeInstance).as('StripeConstructor');
    
    // To make the dynamic import of @stripe/stripe-js fail and use window.Stripe instead,
    // we can intercept the module. However, since ES6 imports are handled by the bundler,
    // we'll set up the mock so that if the service tries to use window.Stripe, it gets our mock.
    // The service will try: const { loadStripe } = await import('@stripe/stripe-js')
    // If that succeeds, it will call loadStripe(). We can't easily intercept that.
    // So we'll ensure window.Stripe is available as a fallback and properly mocked.
    
    // Store mock instance for potential access
    win.__cypressMockStripe = mockStripeInstance;
  });
});

/**
 * Mock Stripe portal redirect
 * Usage: cy.mockStripePortal()
 */
Cypress.Commands.add('mockStripePortal', () => {
  // Intercept portal session creation
  cy.intercept('POST', '**/createPortalSession', {
    statusCode: 200,
    body: { url: 'https://billing.stripe.com/p/session/test' }
  }).as('createPortalSession');
  
  // Note: Portal redirect uses window.location.href = url
  // We intercept the API call, and the redirect will happen but won't affect tests
  // since Cypress handles navigation. If you need to prevent redirects, you can
  // add additional logic here, but it's not necessary for testing the API call.
});

/**
 * Set subscription status in Firestore (via admin or direct)
 * Note: This assumes you have a way to set subscription status
 * In real tests, you might use Firebase Admin SDK or a test API
 */
Cypress.Commands.add('setSubscriptionStatus', (email, status) => {
  // This would typically call a test API endpoint or use Firebase Admin
  // For now, we'll document that this needs to be implemented
  cy.log(`Setting subscription status for ${email} to ${status}`);
  // TODO: Implement actual Firestore update via test API
});
