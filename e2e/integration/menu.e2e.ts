describe('Menu', () => {
  beforeEach(() => {
    cy.visit('e2e/standalone.html');
  });

  it('should have valid items count', function() {
    cy
      .get('.menu-content')
      .find('li')
      .should('have.length', 6 + (2 + 8 + 4) + (1 + 8));
  });

  it('should sync active menu items while scroll', function() {
    cy
      .contains('h1', 'Introduction')
      .scrollIntoView()
      .get('[role=menuitem].active:not(.-depth0)')
      .should('have.text', 'Introduction');

    cy
      .contains('h2', 'Add a new pet to the store')
      .scrollIntoView()
      .get('[role=menuitem].active:not(.-depth0)')
      .should('have.length', 2)
      .last()
      .should('have.text', 'Add a new pet to the store')
      .should('be.visible');
  });

  // for some reason fails in cypress headless. Works fine in all browsers and cypress interactive
  xit('should update URL hash on clicking on menu items', function() {
    cy.contains('[role=menuitem].-depth1', 'pet').click({ force: true });
    cy.location('hash').should('equal', '#tag/pet');

    cy.contains('[role=menuitem]', 'Find pet by ID').click({ force: true });
    cy.location('hash').should('equal', '#operation/getPetById');

    cy.contains('[role=menuitem]', 'OpenAPI Specification').click({ force: true });
    cy.location('hash').should('equal', '#section/OpenAPI-Specification');
  });

  it('should deactivate tag when other is activated', function() {
    const petItem = () => cy.contains('[role=menuitem].-depth1', 'pet');

    petItem()
      .click({ force: true })
      .should('have.class', 'active');
    cy.contains('[role=menuitem].-depth1', 'store').click({ force: true });
    petItem().should('not.have.class', 'active');
  });
});
