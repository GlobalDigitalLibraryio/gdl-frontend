describe('Read book', () => {
  beforeEach(() => {
    cy.visit('/en/books/read/27/428'); //TODO: consider how to do this (test-data? api? need to know the book and chapters exist)
  });

  it('Should be possible to see book content, page cound and exit book', () => {
    cy.get('[data-cy="book-reader"]').should('be.visible');
    // TODO: add page count and exit book
  });

  it('Should be possible to read through book using arrow buttons (or swipe?)', () => {
    cy.get('[data-cy="book-reader-left-arrow"]')
      .should('be.visible')
      .click();
    cy.url().should('include', '/en/books/read/27/427');

    cy.get('[data-cy="book-reader-right-arrow"]')
      .should('be.visible')
      .click();
    cy.url().should('include', '/en/books/read/27/428');
  });

  it('Should be possible to navigate using left and right arrow key', () => {
    // cy.get('[data-cy="book-reader"]').type('{rightarrow}');
    // TODO: check if possible to test for .type() right and left arrow .
  });

/*  it('Should be possible to navigate by swiping left and right', () => {
    // TODO: check if possible to test for swipe left and right.
  });*/
});
