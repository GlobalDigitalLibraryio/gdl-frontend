describe('Home page', () => {
  beforeEach(() => {
    cy.setCookie('bookDetailsTutorialFinished', 'true');
    cy.setCookie('homeTutorialFinished', 'true');
    cy.visit('/'); // TODO: consider how to do this (test-data? api? need permanent book that has both epub nd pdf)
  });

  it('Tooltip should trigger for first time users', function() {
    cy.clearCookies();
    cy.visit('/');
    cy.get('[data-cy="home-tooltip-title"]').contains('Welcome');

    cy.get('[data-cy="home-tooltip-button"]').click();

    cy.get('[data-cy="home-tooltip-content"]').contains(
      'Choose your preferred language here!'
    );

    cy.get('[data-cy="home-tooltip-button"]').click();

    cy.getCookie('homeTutorialFinished').should(
      'have.property',
      'value',
      'true'
    );
  });

  it('More button on booklist should navigate you to /browse', function() {
    cy.get('[data-cy="book-list-more-button"]')
      .first()
      .click();

    cy.url().should('include', '/en/books/browse');
  });

  it('Selecting a book should navigate you to /book/details', function() {
    cy.get('[data-cy="book-link"]')
      .first()
      .click();

    cy.url().should('include', '/en/books/details');
  });
});
