describe('Read book', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="book-link"]')
      .first()
      .click();
    cy.get('[data-cy="read-book-tablet-button"]').click();
  });

  it('Should be able to navigate forward and backwards', () => {
    // forward
    cy.get('[data-cy="read-book-next-button"]').click();
    cy.get('[data-cy="read-book-chapter-index"]').contains('2 /');
    cy.get('[data-cy="read-book-next-button"]').click();
    cy.get('[data-cy="read-book-chapter-index"]').contains('3 /');
    //backwards
    cy.get('[data-cy="read-book-previous-button"]').click();
    cy.get('[data-cy="read-book-chapter-index"]').contains('2 /');
    cy.get('[data-cy="read-book-previous-button"]').click();
    cy.get('[data-cy="read-book-chapter-index"]').contains('1 /');
  });

  it('Should be able to favorite a book', () => {
    cy.get('[data-cy="read-book-favorite-button"]')
      .click()
      .should(() => {
        // eslint-disable-next-line jest/valid-expect
        expect(localStorage.getItem('lscache-favorites')).to.exist;
      });

    // turns red
    cy.get('[data-cy="read-book-favorite-button"]').should($el => {
      // eslint-disable-next-line jest/valid-expect
      expect($el).to.have.css('color', 'rgb(255, 0, 0)');
    });
  });

  it('Should be able to close reading a book', () => {
    cy.get('[data-cy="read-book-close-button"]').click();
    cy.url().should('include', '/en/books/details');
  });
});
