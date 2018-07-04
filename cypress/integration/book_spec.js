describe('Book details', () => {
  beforeEach(() => {
    /*
    cy.server();
    cy.route(
      'GET',
      'https://api.test.digitallibrary.io/book-api/v1/books/en/478'
    ).as('getBook'); // find out how/ where do use this, also replace url with const from config
*/
    cy.visit('/en/books/details/478'); // TODO: fix this
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
      .click();
  });
});
