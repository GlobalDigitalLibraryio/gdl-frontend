describe('Front page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Click change language button', () => {
    cy.get('[type="button"]')
      .contains('Change')
      .click();

    cy.pause();

    cy.get('hr').each(el => {
      cy.get('a').should('have.attr', 'href')
      
    });
  });
});
