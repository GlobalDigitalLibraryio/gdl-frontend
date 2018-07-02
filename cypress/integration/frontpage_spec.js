describe('Front page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Check for correct url when changing language', () => {
    cy.get('[data-cy="change-language-button"]')
      .contains('Change')
      .click();

    cy.pause();

    cy.get('[data-cy="language-list"]')
      .contains('isiZulu')
      .click();

    cy.url().should('include', '/zu');

    // fails when testing for languages higher up on the list (e.g. .first()), as 'change language' blocks the view of the languages
  });

  /*
  it('Should have several book lists which contain books', () => {
    cy.get('[data-cy="book-list"]').each(el => {});
  });
*/

  it('Clicking on a book should yield a page with book details', () => {
    cy.get('[data-cy="book-cover-div"]')
      .first()
      .click();

    cy.url().should('include', '/en/books/details/');
  });
});
