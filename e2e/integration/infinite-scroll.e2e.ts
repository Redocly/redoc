describe('Infinite scroll disabling', () => {
  beforeEach(() => {
    cy.visit('disable-infinite-scroll-index.html');
  });

  it('should initially have only info component', () => {
    cy.get('.api-content')
      .children()
      .should('have.length', 2)
      .first()
      .should('have.text', 'Swagger Petstore')
      .last()
      .should('have.text', 'Introduction');
  });

  it('should render only 1 component after menu item click', () => {
    cy.contains('pet')
      .click()
      .contains('Add a new pet to the store')
      .click()
      .window().then($window => {
                  expect($window.scrollY).to.be.closeTo(300, 20); })
      .get('#operation/addPet')
      .should(' have.text', 'Add new pet to the store inventory.');
  });

  it('should test group menu item click', () => {
    cy.contains('pet')
      .click()
      .children()
      .should('have.length', 2)
      .first()
      .should('have.text', 'pet')
      .last()
      .should('have.text', 'Everything about your Pets');
  });
});
