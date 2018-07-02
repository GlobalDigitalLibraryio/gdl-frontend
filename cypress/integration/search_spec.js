describe('Search', () => {
  beforeEach(() => {
    cy.visit('/search'); // should get lang and id in some way
  });

  it('Should enter text in  input field', () => {
    cy.visit('/');

    cy.get('[data-cy="search-button"]').click();
    cy.url().should('include', '/search');

    cy.get('[id="booksearch"]')
      .type('Friend')
      .should('have.value', 'Friend')
      .type('{enter}');

    cy.url().should('include', '/search?q=Friend');
  });

  it('Should not do anything if input is empty string', () => {
    cy.get('[id="booksearch"]')
      .type('{enter}')
      .should('have.value', '');
  });

  it('A search without hits should return no results message', () => {
    cy.get('[id="booksearch"]')
      .type('aaabbbccc ddd')
      .type('{enter}');
    cy.get('[data-cy="search-result-response"]').contains('No results');
  });
});
