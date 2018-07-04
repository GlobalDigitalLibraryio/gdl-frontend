describe('Front page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Changing language should have the correct link', () => {
    cy.get('[data-cy="change-language-button"]').click();

    cy.get('[data-cy="language-list"]')
      .contains('isiZulu')
      .should('have.attr', 'href', '/zu');
  });

  /*  it('Change language should change the language', () => {
    cy.get('[data-cy="change-language-button"]').click();
    cy.get('[data-cy="language-list"]')
      .first()
      .click();
    // fails when testing for languages higher up on the list (e.g. .first()), as 'change language' blocks the view of the languages
  });*/

  it('Clicking on a book should yield a page with book details', () => {
    cy.get('[data-cy="book-cover-div"]')
      .first()
      .click();

    cy.url().should('include', '/en/books/details/');
  });
});
