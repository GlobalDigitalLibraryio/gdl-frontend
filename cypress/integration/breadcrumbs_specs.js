describe('Breadcrumbs', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Change language button should be visible on frontpage', () => {
    cy.get('[data-cy="change-language-button"]').should('be.visible');
  });

  // it('Should have Home > Level > Book title in breadcrumbs', () => {});

  //  it ('Should have the option to chose between library and classroom books', () => {}); //https://test.digitallibrary.io/ti-et
});
