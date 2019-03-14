describe('Navigation bar', () => {
  beforeEach(() => {
    cy.setCookie('bookDetailsTutorialFinished', 'true');
    cy.setCookie('homeTutorialFinished', 'true');
    cy.visit('/'); // TODO: consider how to do this (test-data? api? need permanent book that has both epub nd pdf)
  });

  it('Should be able to search for book with word "Friend"', function() {
    cy.get('[data-cy="search-book-field"]')
      .clear()
      .type('friend')
      .type('{enter}');

    cy.url().should('include', '/search?q=friend');
  });

  it('House button should redirect back to home page', function() {
    cy.visit('/en/books/category/library');
    cy.get('[data-cy="home-button"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('GDL logo should redirect back to home page', function() {
    cy.visit('/en/books/category/library');
    cy.get('[data-cy="gdl-logo"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('Should be able to change language with global button', function() {
    // open the language menu
    cy.get('[data-cy="global-language-button"]').click();

    // Choose the first language available
    cy.get('[data-cy="choose-language-field"]')
      .first()
      .click()
      .then(xhr => {
        // xhr[0] is what we asked for: https://docs.cypress.io/api/commands/wait.html#Aliases
        cy.location('href').should('eq', xhr[0].baseURI);
      });
  });

  it('Select Favorites from global menu should navigate you to offline library page', function() {
    cy.get('[data-cy="hamburger-menu"]').click();

    cy.get('[data-cy="global-menu-offline-button"').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/offline');
  });

  it('Select Login from global menu should navigate you to login page', function() {
    cy.get('[data-cy="hamburger-menu"]').click();

    cy.get('[data-cy="global-menu-login-button"').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/auth/sign-in');
  });

  it('Select My translation from global menu should navigate you to login page with next params', function() {
    cy.get('[data-cy="hamburger-menu"]').click();

    cy.get('[data-cy="global-menu-translation-button"').click();
    cy.wait(1000);
    cy.url().should('include', '/auth/sign-in?next=%2Fbooks%2Ftranslations');
  });

  it('Select Offline library from global menu should navigate you to favorites', function() {
    cy.get('[data-cy="hamburger-menu"]').click();

    cy.get('[data-cy="global-menu-favorite-button"').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/favorites');
  });

  it('Hamburger menu should show display different menus', function() {
    // Open menu
    cy.get('[data-cy="hamburger-menu"]').click();

    // Check that we have expected menu items
    cy.get('[data-cy="global-menu"]').should($list => {
      expect(
        $list
          .eq(0)
          .children()
          .eq(0),
        'menu item'
      ).to.contain('Book language');
      expect(
        $list
          .eq(0)
          .children()
          .eq(1),
        'menu item'
      ).to.contain('Categories');
      expect(
        $list
          .eq(0)
          .children()
          .eq(3),
        'menu item'
      ).to.contain('Favorites');
      expect(
        $list
          .eq(0)
          .children()
          .eq(4),
        'menu item'
      ).to.contain('Offline library');
      expect(
        $list
          .eq(0)
          .children()
          .eq(5),
        'menu item'
      ).to.contain('Tooltip');
      expect(
        $list
          .eq(0)
          .children()
          .eq(6),
        'menu item'
      ).to.contain('My translations');
      expect(
        $list
          .eq(0)
          .children()
          .eq(7),
        'menu item'
      ).to.contain('Log in');
    });
  });
});
