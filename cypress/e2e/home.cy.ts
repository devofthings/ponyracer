const user = {
  id: 1,
  login: 'cedric',
  money: 1000,
  registrationInstant: '2015-12-01T11:00:00Z',
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
};

function startBackend(): void {
  cy.intercept('POST', 'api/users/authentication', user).as('authenticateUser');
}

describe('Ponyracer', () => {
  beforeEach(() => startBackend());

  it('should display title on home page', () => {
    cy.visit('/');
    cy.contains('h1', 'Ponyracer');
    cy.contains('small', 'Always a pleasure to bet on ponies');
    cy.get('.btn-primary').contains('Login').should('have.attr', 'href', '/login');
    cy.get('.btn-primary').contains('Register').should('have.attr', 'href', '/register');
  });

  const navbarBrand = '.navbar-brand';
  const navbarLink = '.nav-link';

  it('should display a navbar', () => {
    cy.visit('/');
    cy.get(navbarBrand).contains('PonyRacer').should('have.attr', 'href', '/');
    cy.get(navbarLink).should('not.exist');
  });

  it('should display a navbar collapsed on small screen', () => {
    cy.viewport('iphone-6+');
    cy.visit('/login');

    cy.get('input').first().type('cedric');
    cy.get('input[type=password]').type('password');
    cy.get('form > button').click();
    cy.wait('@authenticateUser');

    cy.contains(navbarBrand, 'PonyRacer');
    cy.get(navbarLink).should('not.be.visible');

    // toggle the navbar
    cy.get('.navbar-toggler').click();
    cy.get(navbarLink).should('be.visible');
  });

  it('should display the logged in user in navbar and a different home', () => {
    cy.visit('/login');

    cy.get('input').first().type('cedric');
    cy.get('input[type=password]').type('password');
    cy.get('form > button').click();
    cy.wait('@authenticateUser');

    cy.location('pathname').should('eq', '/');
    cy.get(navbarLink).contains('Races').should('have.attr', 'href', '/races');

    cy.get('#current-user').should('contain', 'cedric').and('contain', '1000');

    cy.get('.btn-primary').contains('Races').should('have.attr', 'href', '/races');
  });
});
