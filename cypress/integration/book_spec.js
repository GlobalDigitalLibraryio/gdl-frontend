describe('Book details', () => {
  beforeEach(() => {
    cy.visit('/en/books/details/478'); // should get lang and id in some way
  });

  it('Clicking read book should open readable book', () => {
    cy.get('[data-cy="read-book-button"]')
      .contains('Read book')
      .click();

    cy.url().should('include', '/en/books/read/478');
  });
});
