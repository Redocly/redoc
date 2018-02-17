describe('Search', () => {
  before(() => {
    cy.visit('e2e/standalone.html');
  });

  it('should be closed by default', function() {
    cy
      .get('.menu-content div')
      .filter('.search-box')
      .should('have.length', 0);
  });

  it('should not open for less than 3 symbols', function() {
    cy.get('.search-input').type('in', { force: true });
    cy
      .get('.menu-content div')
      .filter('.search-box')
      .should('have.length', 0);
  });

  it('should find 3 results when typed int', function() {
    cy.get('.search-input').type('t', { force: true });
    cy
      .get('.search-results')
      .find('li')
      .should('have.length', 3)
      .first()
      .should('contain', 'Introduction');
  });

  it('should clear when ESQ is pressed', function() {
    cy.get('.search-input').type('{esc}', { force: true });
    cy
      .get('.menu-content div')
      .filter('.search-box')
      .should('have.length', 0);
  });
});
