const BOOK_ID = 478;

describe('Book details', () => {
  beforeEach(() => {
    cy.setCookie('bookDetailsTutorialFinished', 'true');
    cy.setCookie('homeTutorialFinished', 'true');
    cy.visit(`/en/books/details/${BOOK_ID}`); // TODO: consider how to do this (test-data? api? need permanent book that has both epub nd pdf)
  });

  it('Clicking "Read book" should open readable book', () => {
    cy.get('[data-cy="read-book-tablet-button"]').click();

    cy.url().should('include', `/en/books/read/${BOOK_ID}`);
  });

  it('Clicking "Translate this book" should ask for authentication', () => {
    cy.get('[data-cy="translate-book-button"]').click();

    cy.url().should(
      'include',
      '/auth/sign-in?next=%2Fen%2Fbooks%2Ftranslate%2F478'
    );
  });

  it('Should be able favorite a book', () => {
    cy.get('[data-cy="save-favorite-tablet"]')
      .click()
      .should(() => {
        expect(localStorage.getItem('lscache-favorites')).to.eq(
          `[{"id":${BOOK_ID},"language":"en"}]`
        );
      });

    // turns red
    cy.get('[data-cy="save-favorite-tablet"]').should($el => {
      expect($el).to.have.css('color', 'rgb(255, 0, 0)');
    });
  });

  it('Should be able to download book', () => {
    cy.get('[data-cy="download-book-button"]').click();

    cy.get('[data-cy="download-book-menu"]')
      .children()
      .first()
      .click(); // TODO: fix with a should or in some other way?
  });

  it('Should be able save and remove book offline', () => {
    cy.get('[data-cy="save-book-tablet"]').click();
    // turns green
    cy.get('[data-cy="save-book-tablet"]').should($el => {
      expect($el).to.have.css('color', 'rgb(0, 128, 0)');
    });
    cy.get('[data-cy="save-offline-snackbar"]').contains(
      'Added book to your offline library.'
    );
    cy.get('[data-cy="save-book-tablet"]').click();
    cy.get('[data-cy="save-offline-snackbar"]').contains(
      'Removed book from your offline library.'
    );
  });
});