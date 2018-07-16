describe('Search', () => {
  const getSearchInput = () => cy.get('[role="search"] input');
  const getSearchResults = () => cy.get('[data-role="search:results"]');
  const getResult = i => cy.get('[role=search] [role=menuitem]').eq(i);

  beforeEach(() => {
    cy.visit('e2e/standalone.html');
  });

  it('should correctly show and hide search results box', () => {
    getSearchResults().should('not.exist');

    // should not open for less than 3 symbols
    getSearchInput().type('in');
    getSearchResults().should('not.exist');

    getSearchInput().type('t');
    cy.get('[role=search] [role=menuitem]')
      .should('have.length', 3)
      .first()
      .should('contain', 'Introduction');

    getSearchInput().type('{esc}');
    getSearchResults().should('not.exist');
  });

  it('should support arrow navigation', () => {
    getSearchInput().type('int');

    getSearchInput().type('{downarrow}');
    getResult(0).should('have.class', 'active');

    getSearchInput().type('{downarrow}');
    getResult(1).should('have.class', 'active');
    getResult(0).should('not.have.class', 'active');

    getSearchInput().type('{uparrow}');
    getResult(1).should('not.have.class', 'active');
    getResult(0).should('have.class', 'active');

    getSearchInput().type('{uparrow}');
    getResult(0).should('have.class', 'active');

    getSearchInput().type('{enter}');

    cy.contains('[role=navigation] [role=menuitem]', 'Introduction').should('have.class', 'active');
  });

  it('should mark search results', () => {
    cy.get('[data-markjs]').should('not.exist');
    getSearchInput().type('int');
    cy.get('[data-markjs]').should('exist');
  });
});
