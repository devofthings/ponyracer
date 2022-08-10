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

describe('Login', () => {
  const loginInput = () => cy.get('input').first();
  const passwordInput = () => cy.get('input[type=password]');
  const errorMessage = () => cy.get('.mb-3 div');
  const submitButton = () => cy.get('form > button');

  beforeEach(() => startBackend());

  it('should display a login page', () => {
    cy.visit('/login');

    cy.get('button').should('be.visible').and('be.disabled');
    loginInput().type('c');
    loginInput().clear();
    errorMessage().should('be.visible').and('contain', 'Login is required');
    loginInput().type('ced');
    errorMessage().should('not.exist');

    passwordInput().type('p');
    passwordInput().clear();
    errorMessage().should('be.visible').and('contain', 'Password is required');

    passwordInput().type('pa');
    errorMessage().should('not.exist');

    submitButton().click();
    cy.wait('@authenticateUser');

    cy.location('pathname').should('eq', '/');
  });

  it('should display an alert if login fails', () => {
    cy.visit('/login');

    cy.intercept('POST', 'api/users/authentication', {
      statusCode: 404
    }).as('failedAuthenticateUser');

    loginInput().type('ced');
    passwordInput().type('pa');

    submitButton().click();
    cy.wait('@failedAuthenticateUser');

    cy.location('pathname').should('eq', '/login');

    cy.get('.alert-danger').should('contain', 'Nope, try again');
  });
});
