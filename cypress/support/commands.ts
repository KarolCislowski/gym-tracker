/// <reference types="cypress" />
import { cypressUser } from '../../shared/testing/cypress-user';
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add('loginAsCypressUser', () => {
  cy.request('/api/auth/csrf')
    .its('body.csrfToken')
    .then((csrfToken) => {
      cy.request({
        url: '/api/auth/callback/credentials',
        method: 'POST',
        form: true,
        body: {
          email: cypressUser.email,
          password: cypressUser.password,
          csrfToken,
          callbackUrl: '/',
          json: 'true',
        },
      });
    });

  cy.request({
    url: '/api/auth/session',
    timeout: 30000,
  })
    .its('body.user.email')
    .should('eq', cypressUser.email);
  cy.visit('/');
  cy.location('pathname', { timeout: 30000 }).should('eq', '/');
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Signs in using the seeded Cypress account.
       */
      loginAsCypressUser(): Chainable<void>;
    }
  }
}

export {};
