describe('Standalone bundle test', function() {
  describe('OAS3 mode', () => {
    it('Render and check no errors', function() {
      cy
        .visit('e2e/standalone.html')
        .get('.api-info')
        .should('exist');
    });

    it('Render and click all the menu items', function() {
      cy
        .visit('e2e/standalone.html')
        .get('.menu-content li')
        .click({ multiple: true, force: true });
    });
  });

  describe('OAS2 compatibility mode', () => {
    it('Render and check no errors', function() {
      cy
        .visit('e2e/standalone.html')
        .get('.api-info')
        .should('exist');
    });

    it('Render and click all the menu items', function() {
      cy
        .visit('e2e/standalone.html')
        .get('.menu-content li')
        .click({ multiple: true, force: true });
    });
  });
});
