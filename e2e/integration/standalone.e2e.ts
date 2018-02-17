describe('Standalone bundle test', function() {
  function baseCheck(name: string, url: string) {
    describe(name, () => {
      before(() => {
        cy.visit(url);
      });

      it('Render and check no errors', function() {
        cy.get('.api-info').should('exist');
      });

      it('Render and click all the menu items', function() {
        cy.get('.menu-content li').click({ multiple: true, force: true });
      });
    });
  }

  baseCheck('OAS3 mode', 'e2e/standalone.html');
  baseCheck('OAS2 compatibility mode', 'e2e/standalone-compatibility.html');
});
