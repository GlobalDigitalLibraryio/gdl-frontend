describe('Book details', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="book-link"]')
      .first()
      .click();
  });

  it('Clicking "Read book" should open readable book', () => {
    cy.get('[data-cy="read-book-tablet-button"]').click();

    cy.url().should('include', `/en/books/read`);
  });

  it('Clicking "Translate this book" should ask for authentication', () => {
    cy.get('[data-cy="translate-book-button"]').click();

    cy.url().should('include', '/auth/sign-in');
  });

  it('Should be able favorite a book', () => {
    cy.get('[data-cy="save-favorite-tablet"]')
      .click()
      .should(() => {
        // eslint-disable-next-line jest/valid-expect
        expect(localStorage.getItem('lscache-favorites')).to.exist;
      });

    // turns red
    cy.get('[data-cy="save-favorite-tablet"]').should($el => {
      // eslint-disable-next-line jest/valid-expect
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
      // eslint-disable-next-line jest/valid-expect
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
