describe('New arrivals (frontpage)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should have new arrivals', () => {
    cy.get('[data-cy="new-arrivals"]')
      .should('be.visible')
      .contains('New arrivals');
  });
});
