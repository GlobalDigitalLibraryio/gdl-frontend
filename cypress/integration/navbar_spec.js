describe('Navigation Bar', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should have visible Menu button, GDL logo and Search bar', () => {
    cy.get('[data-cy="menu-button"]').should('be.visible');
    cy.get('[data-cy="gdl-logo"]').should('be.visible');
    cy.get('[data-cy="search-button"]')
      .should('be.visible')
      .and('have.attr', 'href', '/search');
  });
});
