describe('Front page', () => {
  beforeEach(() => {
    cy.visit('/en/books/details/49'); // should get lang and id in some way
  });

  it('Clicking read book should open readable book', () => {
    cy.get('[role="button"]')
      .contains('Read book')
      .click();

    cy.url().should('include', '/en/books/read/49');
  });

  it('Downloading a book shoul do something ...', () => {
    cy.get('[type="button"]')
      .contains('Download book')
      .click();
  }); // om epub og pdf sjekkat et kommer en liste
});
