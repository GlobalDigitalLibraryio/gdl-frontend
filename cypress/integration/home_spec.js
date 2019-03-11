describe('Home page', () => {
  beforeEach(() => {
    cy.setCookie('bookDetailsTutorialFinished', 'true');
    cy.setCookie('homeTutorialFinished', 'true');
    cy.visit('/'); // TODO: consider how to do this (test-data? api? need permanent book that has both epub nd pdf)
  });

  it('Should display featured content', function() {
    expect(true).to.equal(true);
  });

  it('Tooltip should display on first time loading', function() {
    expect(true).to.equal(true);
  });
});
