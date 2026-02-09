/**
 * Subscription Test Helpers
 * 
 * Helper functions for subscription-related tests
 */

/**
 * Wait for subscription status to load
 */
export const waitForSubscriptionStatus = (expectedStatus = 'free') => {
  cy.get('.popup').within(() => {
    cy.contains('Current Plan:').should('be.visible');
    cy.contains(expectedStatus === 'free' ? 'Free' : expectedStatus.charAt(0).toUpperCase() + expectedStatus.slice(1))
      .should('be.visible');
  });
};

/**
 * Verify plan features are displayed
 */
export const verifyPlanFeatures = (planName, features) => {
  cy.get('.popup').within(() => {
    cy.contains(planName).parent().within(() => {
      features.forEach(feature => {
        cy.contains(feature).should('be.visible');
      });
    });
  });
};

/**
 * Click upgrade button for a specific plan
 */
export const clickUpgradePlan = (planName) => {
  cy.get('.popup').within(() => {
    cy.contains('button', `Upgrade to ${planName}`).click();
  });
};

/**
 * Verify error message is displayed
 */
export const verifyErrorMessage = () => {
  cy.get('.popup').within(() => {
    cy.get('[style*="color: #b91c1c"], [style*="color: #c33"], [style*="background: #fee"]')
      .should('be.visible')
      .and('contain', /error|failed/i);
  });
};

/**
 * Verify loading state
 */
export const verifyLoadingState = () => {
  cy.contains(/loading|processing/i).should('be.visible');
};

/**
 * Mock subscription status in Firestore
 */
export const mockSubscriptionStatus = (email, status) => {
  cy.intercept('GET', '**/firestore.googleapis.com/**', (req) => {
    if (req.url.includes('userSetting') && req.url.includes('settings')) {
      req.reply({
        statusCode: 200,
        body: {
          documents: [{
            name: `projects/test/databases/(default)/documents/users/${email}/userSetting/settings`,
            fields: {
              'subscription status': { stringValue: status }
            }
          }]
        }
      });
    }
  }).as(`getSubscriptionStatus_${status}`);
};
