describe('Menu', () => {
  describe('3.0 spec', () => {
    beforeEach(() => {
      cy.visit('e2e/standalone.html');
    });
    it('should have valid items count', () => {
      cy.get('.menu-content').find('li').should('have.length', 35);
    });

    it('should sync active menu items while scroll', () => {
      cy.contains('h2', 'Introduction')
        .scrollIntoView()
        .get('[role=menuitem] > label.active')
        .should('have.text', 'Introduction');

      cy.contains('h2', 'Add a new pet to the store')
        .scrollIntoView()
        .wait(100)
        .get('[role=menuitem] > label.active')
        .children()
        .last()
        .should('have.text', 'Add a new pet to the store')
        .should('be.visible');
    });

    it('should sync active menu items while scroll back and scroll again', () => {
      cy.contains('h2', 'Add a new pet to the store')
        .scrollIntoView()
        .wait(100)
        .get('[role=menuitem] > label.active')
        .children()
        .last()
        .should('have.text', 'Add a new pet to the store')
        .should('be.visible');

      cy.contains('h1', 'Swagger Petstore').scrollIntoView().wait(100);

      cy.contains('h2', 'Introduction')
        .scrollIntoView()
        .wait(100)
        .get('[role=menuitem] > label.active')
        .should('have.text', 'Introduction');

      cy.url().should('include', '#section/Introduction');
    });

    it('should update URL hash when clicking on menu items', () => {
      cy.contains('[role=menuitem] > label.-depth1', 'pet').click({ force: true });
      cy.get('li[data-item-id="schema/Cat"]')
        .should('have.text', 'schemaCat')
        .click({ force: true });
      cy.location('hash').should('equal', '#schema/Cat');
    });

    it('should contains badge schema from x-badges', () => {
      cy.contains('h2', 'Add a new pet to the store').scrollIntoView();

      cy.contains('h2 > span', 'Beta')
        .scrollIntoView()
        .wait(100)
        .get('[role=menuitem] > label.active')
        .children('span[type="badge"]')
        .should('have.text', 'Beta');

      cy.contains('h2 > span', 'Alpha')
        .scrollIntoView()
        .wait(100)
        .get('[role=menuitem] > label.active')
        .children('span[type="badge"]')
        .should('have.text', 'Alpha');

      cy.contains('h2 > span', 'Gamma')
        .scrollIntoView()
        .wait(100)
        .get('[role=menuitem] > label.active')
        .children('span[type="badge"]')
        .should('have.text', 'Gamma');
    });

    it('should contains Cat schema in Pet using x-tags', () => {
      cy.contains('[role=menuitem] > label.-depth1', 'pet').click({ force: true });
      cy.location('hash').should('equal', '#tag/pet');

      cy.contains('[role=menuitem]', 'Find pet by ID').click({ force: true });
      cy.location('hash').should('equal', '#tag/pet/operation/getPetById');
    });

    it('should deactivate tag when other is activated', () => {
      const petItem = () => cy.contains('[role=menuitem] > label.-depth1', 'pet');

      petItem().click({ force: true }).should('have.class', 'active');
      cy.contains('[role=menuitem] > label.-depth1', 'store').click({ force: true });
      petItem().should('not.have.class', 'active');
    });

    it('should be able to open a response object to see more details', () => {
      cy.contains('h2', 'Find pet by ID')
        .scrollIntoView()
        .wait(100)
        .parent()
        .find('div h3')
        .should('have.text', 'Responses')
        .parent()
        .find('div:first button')
        .click()
        .should('have.attr', 'aria-expanded', 'true')
        .parent()
        .find('div h5')
        .then($h5 => $h5[0].firstChild!.nodeValue!.trim())
        .should('eq', 'Response Schema:');
    });
  });

  it('should be able to open the operation details when the operation IDs have quotes', () => {
    cy.visit('e2e/standalone-3-1.html');
    cy.get('label span[title="pet"]').click({ multiple: true, force: true });
    cy.get('li').contains('OperationId with quotes').click({ multiple: true, force: true });
    cy.get('h2').contains('OperationId with quotes').should('be.visible');
    cy.url().should('include', 'deletePetBy%22Id');
  });

  it('should encode URL when the operation IDs have backslashes', () => {
    cy.visit('e2e/standalone-3-1.html');
    cy.get('label span[title="pet"]').click({ multiple: true, force: true });
    cy.get('li').contains('OperationId with backslash').click({ multiple: true, force: true });
    cy.get('h2').contains('OperationId with backslash').should('be.visible');
    cy.url().should('include', 'delete%5CPetById');
  });
});
