describe('Schemas', () => {
  it('expandSchemas != true', () => {
    cy.visit('e2e/standalone.html');

    cy.get('.api-content')
      .find('.expanded')
      .should('have.length', 0);
  });

  it('expandSchemas == true', () => {
    cy.visit('e2e/expandSchemas.html');

    cy.get('.api-content')
      .find('.expanded')
      .should('have.length', 146);
  });
});
