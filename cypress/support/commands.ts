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
  cy.visit(`/login?lang=${cypressUser.language}`);
  cy.get('#email').type(cypressUser.email);
  cy.get('#password').type(cypressUser.password);
  cy.get('form').find('button[type="submit"]').first().click();
  cy.location('pathname', { timeout: 10000 }).should('not.eq', '/login');
  cy.request('/api/auth/session')
    .its('body.user.email')
    .should('eq', cypressUser.email);
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
