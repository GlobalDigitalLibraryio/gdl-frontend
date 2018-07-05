describe('Featured content (frontpage)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should be able to see featured content', () => {
    cy.get('[data-cy="featured-banner"]')
      .should('be.visible')
      .and('contain', 'Featured')
      .children()
      .should('have.attr', 'src');
    cy.get('[data-cy="card-title"]').should('be.visible');
    cy.get('[data-cy="card-description"]').should('be.visible');
    cy.get('[data-cy="card-link"]')
      .should('be.visible')
      .and('have.attr', 'href');
  });
});
