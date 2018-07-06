describe('Book lists (frontpage)', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('All book lists should be visible, have title and more button', () => {
    cy.get('[data-cy="book-list"]').should('be.visible');
    cy.get('[data-cy="book-list-more-button"]')  // TODO: consider using .each() and .contains('More')
      .and('be.visible')
      .and('have.attr', 'href');
    cy.get('[data-cy="book-list-header"]').should('be.visible');
  });

  it('Book links should be visible and have a link to book details', () => {
    cy.get('[data-cy="book-list-book-link"]')
      .children()
      .first()
      .should('be.visible')
      .and('have.attr', 'href')
      .and('contain', '/en/books/details/');
  });

  it('It should be possible to scroll in booklist on mobile', () => {
    cy.get('[data-cy="book-list-book-link"]').last().scrollIntoView()
  });

  // it('Should contain at least one child', () => {});
});
