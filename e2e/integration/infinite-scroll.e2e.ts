describe('Infinite scroll disabling', () => {
  beforeEach(() => {
    cy.visit('e2e/disable-infinite-scroll-index.html');
  });

  it('should initially have only info component', () => {
    cy.get('.api-content')
      .children()
      .should('have.length', 2)
      .first()
      .find('h1')
      .should('include.text', 'Swagger Petstore');
    cy.get('.api-content')
      .children()
      .last()
      .find('h1')
      .should('include.text', 'Introduction');
  });

  it('should test group menu item click', () => {
    cy.contains('pet')
      .click();
    cy.get('[id="tag/pet"]')
      .children()
      .should('have.length', 2)
      .first()
      .should('have.text', 'pet');
    cy.get('[id="tag/pet"]')
      .children()
      .last()
      .should('have.text', 'Everything about your Pets\n');
  });

  it('should render only 1 component after menu item click', () => {
    cy.contains('pet')
      .click();
    cy.contains('Add a new pet to the store')
      .click()
      .window().then($window => {
      expect($window.scrollY).to.be.closeTo(350, 20);
    });
    cy.contains('Add a new pet to the store');
    cy.contains('Add new pet to the store inventory.');
  });
});
