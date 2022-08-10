const user = {
  id: 1,
  login: 'cedric',
  money: 1000,
  registrationInstant: '2015-12-01T11:00:00Z',
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
};

const race = {
  id: 12,
  name: 'Paris',
  ponies: [
    { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
    { id: 2, name: 'Big Soda', color: 'ORANGE' },
    { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
    { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
    { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
  ],
  startInstant: '2020-02-18T08:02:00Z'
};

function startBackend(): void {
  cy.intercept('POST', 'api/users/authentication', user).as('authenticateUser');

  cy.intercept('GET', 'api/races?status=PENDING', [
    race,
    {
      id: 13,
      name: 'Tokyo',
      ponies: [
        { id: 6, name: 'Fast Rainbow', color: 'BLUE' },
        { id: 7, name: 'Gentle Castle', color: 'GREEN' },
        { id: 8, name: 'Awesome Rock', color: 'PURPLE' },
        { id: 9, name: 'Little Rainbow', color: 'YELLOW' },
        { id: 10, name: 'Great Soda', color: 'ORANGE' }
      ],
      startInstant: '2020-02-18T08:03:00Z'
    }
  ]).as('getRaces');
}

function storeUserInLocalStorage(): void {
  localStorage.setItem('rememberMe', JSON.stringify(user));
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
    storeUserInLocalStorage();
    cy.viewport('iphone-6+');
    cy.visit('/');
    cy.contains(navbarBrand, 'PonyRacer');
    cy.get(navbarLink).should('not.be.visible');

    // toggle the navbar
    cy.get('.navbar-toggler').click();
    cy.get(navbarLink).should('exist');
  });

  it('should display the logged in user in navbar', () => {
    storeUserInLocalStorage();
    cy.visit('/races');
    cy.wait('@getRaces');

    // user stored should be displayed
    cy.get('#current-user').should('contain', 'cedric').and('contain', '1000');
  });
});
