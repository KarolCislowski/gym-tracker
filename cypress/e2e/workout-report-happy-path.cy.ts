import { getTranslations } from '../../shared/i18n/application/i18n.service';

describe('Workout report happy path', () => {
  it('creates, reviews, edits, and deletes a workout report', () => {
    const runId = Date.now();
    const createdWorkoutName = `Cypress workout report ${runId}`;
    const updatedWorkoutName = `Cypress workout report updated ${runId}`;
    const createdNotes = 'Cypress workout session notes';
    const updatedNotes = 'Cypress workout session notes updated';

    cy.loginAsCypressUser();

    cy.request('/api/auth/session').then(({ body }) => {
      const translations = getTranslations(body?.user?.language);
      const t = translations.workouts;
      const dashboard = translations.dashboard;

      cy.contains('h1', dashboard.welcomeBack).should('be.visible');
      cy.contains('a', dashboard.workoutReports).click();

      cy.contains('h1', t.title).should('be.visible');
      cy.contains('button', t.openComposerLabel).click();

      cy.contains('h2', t.addReportTitle).should('be.visible');

      cy.findByLabel(t.workoutNameLabel).clear().type(createdWorkoutName);
      cy.findByLabel(t.workoutNotesLabel).clear().type(createdNotes);

      cy.contains('button', t.saveReport).click();

      cy.contains(t.reportCreated).should('be.visible');
      cy.contains(`table[aria-label="${t.title}"] tbody tr`, createdWorkoutName)
        .should('exist')
        .within(() => {
          cy.get('a[aria-label],button[aria-label]')
            .filter((_, element) =>
              element.getAttribute('aria-label')?.startsWith(t.viewDetailsLabel) ?? false,
            )
            .first()
            .click();
        });

      cy.contains('h1', t.detailsTitle).should('exist');
      cy.contains(createdWorkoutName).should('exist');
      cy.contains(createdNotes).should('exist');

      cy.contains('button', t.openEditLabel).click();
      cy.findByLabel(t.workoutNameLabel).clear().type(updatedWorkoutName);
      cy.findByLabel(t.workoutNotesLabel).clear().type(updatedNotes);
      cy.contains('button', t.updateReport).click();

      cy.contains(t.reportUpdated).should('be.visible');
      cy.contains(updatedWorkoutName).should('exist');
      cy.contains(updatedNotes).should('exist');

      cy.get('button[aria-label],a[aria-label]')
        .filter((_, element) =>
          element.getAttribute('aria-label')?.startsWith(t.deleteReportLabel) ?? false,
        )
        .first()
        .click();
      cy.contains('[role="dialog"]', t.deleteReportTitle).should('be.visible');
      cy.contains('[role="dialog"]', t.deleteReportDescription).should('be.visible');
      cy.contains('[role="dialog"] button', t.confirmDeleteLabel).click();

      cy.contains('h1', t.title).should('exist');
      cy.contains(t.reportDeleted).should('be.visible');
      cy.get(`table[aria-label="${t.title}"] tbody`).should(
        'not.contain',
        updatedWorkoutName,
      );
    });
  });
});
