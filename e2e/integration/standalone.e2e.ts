describe('Standalone bundle test', () => {
  function baseCheck(name: string, url: string) {
    describe(name, () => {
      beforeEach(() => {
        cy.visit(url);
      });

      it('Render and check no errors', () => {
        cy.get('.api-info').should('exist');
      });

      it('Render and click all the menu items', () => {
        cy.get('.menu-content li').click({ multiple: true, force: true });
      });
    });
  }

  baseCheck('OAS3 mode', 'e2e/standalone.html');
  baseCheck('OAS3.1 mode', 'e2e/standalone-3-1.html');
  baseCheck('OAS2 compatibility mode', 'e2e/standalone-compatibility.html');
});
