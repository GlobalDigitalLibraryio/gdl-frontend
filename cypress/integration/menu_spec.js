describe('Menu', () => {
  beforeEach(() => {
    cy.visit('/');

    // TODO: Find out if it is possible to open the menu before tests starts in a more time efficient manner
    cy.get('[data-cy="menu-button"]').click();
  });

  it('Changing language should provide the correct link', () => {
    cy.get('[data-cy="select-language-list-item"]').click();

    cy.get('[data-cy="language-menu"]')
      .should('be.visible')
      .contains('isiZulu')
      .should('have.attr', 'href', '/zu');
  });

  /*  it('Change language should change the language', () => {
    cy.get('[data-cy="change-language-button"]').click();
    cy.get('[data-cy="language-list"]')
      .first()
      .click();
    // TODO: fix? fails when testing for languages higher up on the list (e.g. .first()), as 'change language' blocks the view of the languages
  });*/

  it('Clicking on categories should provide a list of categories', () => {
    cy.get('[data-cy="select-category-list-item"]').click();
    cy.get('[data-cy="categories-menu"]').should('be.visible');
  });

  it('Links should be visible in menu', () => {
    cy.get('[href*="/books/translations"]').should('be.visible');
    cy.get('[href*="/auth/sign-in"]').should('be.visible');
  });
});
