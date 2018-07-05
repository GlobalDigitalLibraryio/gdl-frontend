describe('Search', () => {
  beforeEach(() => {
    cy.visit('/search'); // should get lang and id in some way
  });

  it('Should enter text in  input field', () => {
    cy.get('[data-cy="book-search"]')
      .type('Friend{enter}')
      .should('have.value', 'Friend');

    cy.url().should('include', '/search?q=Friend'); // TODO: fix to best practice
  });

  it('Should not do anything if input is empty string', () => {
    cy.get('[data-cy="book-search"]')
      .type('{enter}')
      .should('have.value', '');
  });

  it('A search without hits should return no results message', () => {
    cy.get('[data-cy="book-search"]').type('aaabbbccd{enter}');
    cy.get('[data-cy="search-result-response"]').contains('No results');
  });
});
