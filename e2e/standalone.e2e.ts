describe('Standalone bundle test', function() {
  describe('OAS3 mode', () => {
    before(() => {
      cy.visit('e2e/standalone.html');
    });

    it('Render and check no errors', function() {
      cy.get('.api-info').should('exist');
    });

    it('Render and click all the menu items', function() {
      cy.get('.menu-content li').click({ multiple: true, force: true });
    });
  });

  describe('OAS2 compatibility mode', () => {
    before(() => {
      cy.visit('e2e/standalone.html');
    });

    it('Render and check no errors', function() {
      cy.get('.api-info').should('exist');
    });

    it('Render and click all the menu items', function() {
      cy.get('.menu-content li').click({ multiple: true, force: true });
    });
  });
});
