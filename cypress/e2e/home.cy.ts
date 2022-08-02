describe('Ponyracer', () => {
  it('should display title on home page', () => {
    cy.visit('/');
    cy.contains('h1', 'Ponyracer');
  });

  const navbarBrand = '.navbar-brand';
  const navbarLink = '.nav-link';

  it('should display a navbar', () => {
    cy.visit('/');
    cy.contains(navbarBrand, 'PonyRacer');
    cy.contains(navbarLink, 'Races');
  });

  it('should display a navbar collapsed on small screen', () => {
    cy.viewport('iphone-6+');
    cy.visit('/');
    cy.contains(navbarBrand, 'PonyRacer');
    cy.get(navbarLink).should('not.be.visible');

    // toggle the navbar
    cy.get('.navbar-toggler').click();
    cy.get(navbarLink).should('be.visible');
  });

  it('should display a race list', () => {
    cy.visit('/');
    cy.get('h2').should('have.length', 2);
    cy.get('p').should('have.length', 2);
  });

  it('should display ponies', () => {
    cy.visit('/');
    cy.get('figure').should('have.length', 10);
    cy.get('img').should('have.length', 10);
    cy.get('figcaption').should('have.length', 10);
  });
});
