describe('Book details', () => {
  beforeEach(() => {
    cy.visit('/en/books/details/478'); // TODO: consider how to do this (test-data? api? need book that has both epub nd pdf)
  });

  it('Clicking read book should open readable book', () => {
    cy.get('[data-cy="read-book-button"]').click();

    cy.url().should('include', '/en/books/read/478');
  });

  it('Should be able to download book', () => {
    cy.get('[data-cy="download-book-button"]').click();

    cy.get('[data-cy="download-book-menu"]')
      .children()
      .first()
      .click(); // TODO: fix with a should or in some other way?
  });
});
