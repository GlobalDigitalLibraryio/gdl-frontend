describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('More button on booklist should navigate you to /browse', function() {
    cy.get('[data-cy="book-list-more-button"]')
      .first()
      .click();

    cy.url().should('include', '/en/books/browse');
  });

  it('Selecting a book should navigate you to /book/details', function() {
    cy.get('[data-cy="book-link"]')
      .first()
      .click();

    cy.url().should('include', '/en/books/details');
  });
});
