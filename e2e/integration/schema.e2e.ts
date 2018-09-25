describe('Schema View', () => {
  beforeEach(() => {
    cy.visit('e2e/standalone.html');
  });

  it('Pet schema view should match screenshot', () => {
    cy.get('[data-section-id="operation/addPet"] table')
      .last()
      .scrollIntoView()
      .matchImageSnapshot('pet-schema-view');
  });
});
