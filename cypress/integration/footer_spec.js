describe('Footer', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Links should be visible in footer', () => {
    cy.get('[href*="home.digitallibrary.io/about/"]').should('be.visible');
    cy.get(
      '[href*="home.digitallibrary.io/the-global-digital-library-uses-cookies/"]'
    ).should('be.visible');
    cy.get('[href*="home.digitallibrary.io/privacy/"]').should('be.visible');
    cy.get('[href*="digitallibrary.zendesk.com/hc/en-us/requests/new"]').should(
      'be.visible'
    );
    cy.get('[href*="home.digitallibrary.io/cc/"]').should('be.visible');
    cy.get('[href*="creativecommons.org/"]').should('be.visible');
    cy.get('[href*="blog.digitallibrary.io/"]').should('be.visible');
  });
});
