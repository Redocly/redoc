describe('Supporting both operation/* and parent/*/operation* urls', () => {
  beforeEach(() => {
    cy.visit('e2e/standalone.html');
  });

  it('should supporting operation/* url', () => {
    cy.url().then(loc => {
      cy.visit(loc + '#operation/updatePet');
      cy.get('li[data-item-id="tag/pet/operation/updatePet"]').should('be.visible');
    });
  });

  it('should supporting parent/*/operation url', () => {
    cy.url().then(loc => {
      cy.visit(loc + '#tag/pet/operation/addPet');
      cy.get('li[data-item-id="tag/pet/operation/addPet"]').should('be.visible');
    });
  });
});
