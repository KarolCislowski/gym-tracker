/// <reference types="cypress" />

/**
 * Returns an input-like control by its accessible label.
 * This keeps tests close to how users actually discover fields.
 */
Cypress.Commands.add('findByLabel', (label: string) => {
  return cy.contains('label', label)
    .closest('.MuiFormControl-root')
    .find('input, textarea')
    .first();
});

/**
 * Returns a checkbox-like control by its accessible label.
 * Useful for MUI switches and checkboxes rendered through FormControlLabel.
 */
Cypress.Commands.add('findCheckboxByLabel', (label: string) => {
  return cy.contains('label', label)
    .find('input[type="checkbox"]')
    .first();
});

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Finds a form control through its visible label text.
       */
      findByLabel(label: string): Chainable<JQuery<HTMLElement>>;

      /**
       * Finds a checkbox or switch through its visible label text.
       */
      findCheckboxByLabel(label: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

export {};
