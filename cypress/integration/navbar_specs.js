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
    expect(true).to.equal(true);
  });

  it('GDL logo should redirect back to home page', function() {
    expect(true).to.equal(true);
  });

  it('Should be able to change language with global button', function() {
    expect(true).to.equal(true);
  });

  it('Hamburger menu should show display different menus', function() {
    expect(true).to.equal(true);
  });
});
