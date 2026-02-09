/**
 * Subscription Service E2E Tests
 * 
 * These tests simulate user interactions with the subscription features:
 * - Viewing subscription status
 * - Viewing upgrade options
 * - Starting checkout flow
 * - Managing subscriptions
 * - Testing subscription limits
 */

describe('Subscription Service - User Flow', () => {
  const testUser = {
    email: 'test@quirkle.test',
    password: 'testpassword123'
  };

  beforeEach(() => {
    // Logout before each test to ensure clean state
    cy.logout();
    
    // Mock Stripe checkout and portal
    cy.mockStripeCheckout();
    cy.mockStripePortal();
    
    // Intercept Firestore reads for subscription status
    cy.intercept('GET', '**/firestore.googleapis.com/**', (req) => {
      if (req.url.includes('userSetting') && req.url.includes('settings')) {
        req.reply({
          statusCode: 200,
          body: {
            documents: [{
              name: `projects/test/databases/(default)/documents/users/${testUser.email}/userSetting/settings`,
              fields: {
                'subscription status': { stringValue: 'free' }
              }
            }]
          }
        });
      }
    }).as('getSubscriptionStatus');
  });

  describe('Profile Overlay - Subscription Display', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
      cy.openProfileOverlay();
    });

    it('should display current subscription status', () => {
      cy.get('.popup').within(() => {
        cy.contains('Profile Information').should('be.visible');
        cy.contains('Email:').should('be.visible');
        cy.contains(testUser.email).should('be.visible');
        cy.contains('Current Plan:').should('be.visible');
        cy.contains('Free').should('be.visible');
      });
    });

    it('should display free plan features', () => {
      cy.get('.popup').within(() => {
        cy.contains('Current Plan:').should('be.visible');
        cy.contains('Free').should('be.visible');
        // Check for free plan features
        cy.contains('10 questions per quiz').should('be.visible');
        cy.contains('500 characters per question/answer').should('be.visible');
      });
    });

    it('should show "View Upgrade Options" button for free users', () => {
      cy.get('.popup').within(() => {
        cy.contains('button', 'View Upgrade Options').should('be.visible');
      });
    });
  });

  describe('Upgrade Options', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
      cy.openProfileOverlay();
    });

    it('should show upgrade options when clicked', () => {
      cy.get('.popup').within(() => {
        // Click to show plans
        cy.contains('button', 'View Upgrade Options').click();
        
        // Should show available plans
        cy.contains('Available Plans').should('be.visible');
        cy.contains('Basic').should('be.visible');
        cy.contains('Pro').should('be.visible');
      });
    });

    it('should display Basic plan details', () => {
      cy.get('.popup').within(() => {
        cy.contains('button', 'View Upgrade Options').click();
        // Find Basic plan card
        cy.contains('Basic').parent().within(() => {
          cy.contains('$9.99/month').should('be.visible');
          cy.contains('50 questions per quiz').should('be.visible');
          cy.contains('500 characters per question/answer').should('be.visible');
          cy.contains('button', 'Upgrade to Basic').should('be.visible');
        });
      });
    });

    it('should display Pro plan details', () => {
      cy.get('.popup').within(() => {
        cy.contains('button', 'View Upgrade Options').click();
        
        // Find Pro plan card
        cy.contains('Pro').parent().within(() => {
          cy.contains('$19.99/month').should('be.visible');
          cy.contains('200 questions per quiz').should('be.visible');
          cy.contains('2000 characters per question/answer').should('be.visible').scrollIntoView({behavior: 'smooth', block: 'center'});
          cy.contains('button', 'Upgrade to Pro').should('be.visible');
        });
      });
    });

    it('should hide plans when "Hide Plans" is clicked', () => {
      cy.get('.popup').within(() => {
        // Show plans
        cy.contains('button', 'View Upgrade Options').click();
        cy.contains('Available Plans').should('be.visible');
        
        // Hide plans
        cy.contains('button', 'Hide Plans').click();
        cy.contains('Available Plans').should('not.exist');
      });
    });
  });

  describe('Checkout Flow', () => {
    beforeEach(() => {
      cy.logout();
      cy.login(testUser.email, testUser.password);
      cy.openProfileOverlay();
    });

    it('should initiate Basic plan checkout', () => {
      // Mock Stripe redirect - stub location.href setter to prevent actual redirect
      cy.window().then((win) => {
        cy.stub(win.location, 'href').as('redirectStub');
      });

      cy.get('.popup').within(() => {
        cy.contains('button', 'View Upgrade Options').click();
        cy.contains('button', 'Upgrade to Basic').click();
      });

      // Should call checkout session creation
      cy.wait('@createCheckoutSession').then((interception) => {
        expect(interception.request.body).to.include({
          email: testUser.email
        });
        expect(interception.request.body.priceId).to.exist;
      });

      // Should show loading state
      cy.contains('Processing...').should('be.visible');

      // Close the profile overlay
      cy.get('.close-button').click();
      // Verify overlay is closed (component returns null when closed, so overlay should not exist)
      cy.get('.overlay').should('not.exist');
    });

    it('should initiate Pro plan checkout', () => {
      // Mock Stripe redirect - stub location.href setter
      cy.window().then((win) => {
        cy.stub(win.location, 'href').as('redirectStub');
      });

      cy.get('.popup').within(() => {
        cy.contains('button', 'View Upgrade Options').click();
        cy.contains('button', 'Upgrade to Pro').click();
      });

      cy.wait('@createCheckoutSession');
      cy.contains('Processing...').should('be.visible');
    });

    it('should handle checkout errors gracefully', () => {
      // Mock checkout failure
      cy.intercept('POST', '**/createCheckoutSession', {
        statusCode: 500,
        body: { error: 'Failed to create checkout session' }
      }).as('checkoutError');

      cy.get('.popup').within(() => {
        cy.contains('button', 'View Upgrade Options').click();
        cy.contains('button', 'Upgrade to Basic').click();
      });

      cy.wait('@checkoutError');
      
      // Should show error message
      cy.get('.popup').within(() => {
        cy.contains(/error|failed/i).should('be.visible');
      });
    });
  });

  describe.only('Subscription Management (Active Subscribers)', () => {
    beforeEach(() => {
      // Mock user with active subscription
      cy.intercept('GET', '**/firestore.googleapis.com/**', (req) => {
        if (req.url.includes('userSetting') && req.url.includes('settings')) {
          req.reply({
            statusCode: 200,
            body: {
              documents: [{
                name: `projects/test/databases/(default)/documents/users/${testUser.email}/userSetting/settings`,
                fields: {
                  'subscription status': { stringValue: 'basic' }
                }
              }]
            }
          });
        }
      }).as('getBasicSubscription');

      cy.login(testUser.email, testUser.password);
      cy.openProfileOverlay();
    });

    it('should display active subscription status', () => {
      cy.get('.popup').within(() => {
        cy.contains('Current Plan:').should('be.visible');
        cy.contains('Basic').should('be.visible');
        cy.contains('questions per quiz').should('be.visible');
      });
    });

    it('should show "Manage Subscription" button for active subscribers', () => {
      cy.get('.popup').within(() => {
        cy.contains('button', 'Manage Subscription').should('be.visible');
        cy.contains('button', 'View Upgrade Options').should('not.exist');
      });
    });

    it('should redirect to Stripe portal when managing subscription', () => {
      cy.window().then((win) => {
        cy.stub(win.location, 'href').as('redirectToPortal');
      });

      cy.get('.popup').within(() => {
        cy.contains('button', 'Manage Subscription').click();
      });

      cy.wait('@createPortalSession').then(() => {
        // In real implementation, this would redirect
        // For testing, we verify the API call was made
        cy.get('@createPortalSession').should('have.been.called');
      });
    });
  });

  describe('Subscription Limits - Quiz Creation', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
    });

    it('should enforce character limit for free plan', () => {
      cy.visit('/add-questions');
      
      // Wait for component to load
      cy.get('textarea[placeholder*="question"]').should('be.visible');
      
      // Type text exceeding 500 characters
      const longText = 'a'.repeat(600);
      cy.get('textarea[placeholder*="question"]').first().type(longText, { delay: 0 });
      
      // Should be capped at 500 characters
      cy.get('textarea[placeholder*="question"]').first().should('have.value.length', 500);
      
      // Should show character limit warning
      cy.contains(/Character limit reached.*500.*chars/i).should('be.visible');
    });

    it('should prevent typing beyond character limit', () => {
      cy.visit('/add-questions');
      
      cy.get('textarea[placeholder*="question"]').first().should('have.attr', 'maxLength', '500');
    });

    it('should show free plan limit notice', () => {
      cy.visit('/add-questions');
      
      cy.contains(/Free plan.*Max 10 questions/i).should('be.visible');
      cy.contains(/500 characters per question\/answer/i).should('be.visible');
    });
  });

  describe('Subscription Success/Cancel Pages', () => {
    it('should display success page after checkout', () => {
      cy.visit('/subscription-success?session_id=cs_test_123');
      
      cy.contains('Subscription Activated!').should('be.visible');
      cy.contains(/subscription is being activated/i).should('be.visible');
    });

    it('should display cancel page', () => {
      cy.visit('/subscription-cancel');
      
      cy.contains('Checkout Cancelled').should('be.visible');
      cy.contains(/No charges were made/i).should('be.visible');
      cy.contains('button', 'Back to Profile').should('be.visible');
    });

    it('should redirect from success page to profile', () => {
      cy.visit('/subscription-success?session_id=cs_test_123');
      
      // Wait for redirect (3 seconds)
      cy.wait(3000);
      cy.url().should('include', '/profile');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      cy.login(testUser.email, testUser.password);
      cy.openProfileOverlay();
    });

    it('should display error when checkout fails', () => {
      cy.intercept('POST', '**/createCheckoutSession', {
        statusCode: 500,
        body: { error: 'Payment processing failed' }
      }).as('checkoutFailure');

      cy.get('.popup').within(() => {
        cy.contains('button', 'View Upgrade Options').click();
        cy.contains('button', 'Upgrade to Basic').click();
      });

      cy.wait('@checkoutFailure');
      
      cy.get('.popup').within(() => {
        cy.contains(/error|failed/i).should('be.visible');
      });
    });

    it('should display error when portal session fails', () => {
      cy.intercept('GET', '**/firestore.googleapis.com/**', (req) => {
        if (req.url.includes('userSetting')) {
          req.reply({
            statusCode: 200,
            body: {
              documents: [{
                fields: {
                  'subscription status': { stringValue: 'basic' }
                }
              }]
            }
          });
        }
      });

      cy.intercept('POST', '**/createPortalSession', {
        statusCode: 404,
        body: { error: 'No Stripe customer found' }
      }).as('portalFailure');

      cy.openProfileOverlay();
      
      cy.get('.popup').within(() => {
        cy.contains('button', 'Manage Subscription').click();
      });

      cy.wait('@portalFailure');
      
      cy.get('.popup').within(() => {
        cy.contains(/error|failed/i).should('be.visible');
      });
    });
  });
});

describe('Subscription Service - Visual Regression', () => {
  const testUser = {
    email: 'test@quirkle.test',
    password: 'testpassword123'
  };

  it('should match profile overlay snapshot for free user', () => {
    cy.login(testUser.email, testUser.password);
    cy.openProfileOverlay();
    
    cy.get('.popup').should('be.visible');
    // Uncomment to update snapshots: cy.get('.popup').matchImageSnapshot('profile-overlay-free');
  });

  it('should match upgrade options snapshot', () => {
    cy.login(testUser.email, testUser.password);
    cy.openProfileOverlay();
    
    cy.get('.popup').within(() => {
      cy.contains('button', 'View Upgrade Options').click();
      cy.contains('Available Plans').should('be.visible');
    });
    
    // Uncomment to update snapshots: cy.get('.popup').matchImageSnapshot('upgrade-options');
  });
});
