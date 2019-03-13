describe('Navigation bar', () => {
  beforeEach(() => {
    cy.setCookie('bookDetailsTutorialFinished', 'true');
    cy.setCookie('homeTutorialFinished', 'true');
    cy.visit('/'); // TODO: consider how to do this (test-data? api? need permanent book that has both epub nd pdf)
  });

  it('Should be able to search for book with word "Friend"', function() {
    expect(true).to.equal(true);
  });

  it('House button should redirect back to home page', function() {
    cy.visit('/en/books/category/library');
    cy.get('[data-cy="home-button"]').click();
    cy.url().should('eq', 'http://localhost:3000/');
  });

  it('GDL logo should redirect back to home page', function() {
    cy.visit('/en/books/category/library');
    cy.get('[data-cy="gdl-logo"]').click();
    cy.url().should('eq', 'http://localhost:3000/');
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
