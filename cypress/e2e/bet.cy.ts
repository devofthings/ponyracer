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

const user = {
  id: 1,
  login: 'cedric',
  money: 1000,
  registrationInstant: '2015-12-01T11:00:00Z',
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
};

function startBackend(): void {
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

  cy.intercept('GET', 'api/races/12', race).as('getRace');

  cy.intercept('POST', 'api/races/12/bets', { ...race, betPonyId: 1 }).as('betRace');
}

function storeUserInLocalStorage(): void {
  localStorage.setItem('rememberMe', JSON.stringify(user));
}

describe('Bet', () => {
  beforeEach(() => startBackend());

  it('should bet on ponies', () => {
    storeUserInLocalStorage();
    cy.visit('/races');
    cy.wait('@getRaces');

    // go to bet page for the first race
    cy.get('.btn-primary').first().click();
    cy.wait('@getRace').its('request.headers').should('have.property', 'authorization', `Bearer ${user.token}`);
    cy.location('pathname').should('eq', '/races/12');

    // race detail should be displayed
    cy.get('h1').should('contain', 'Paris');
    cy.get('p').should('contain', 'ago');
    cy.get('img').should('have.length', 5);

    // no pony is selected
    cy.get('.selected').should('have.length', 0);

    // bet on first pony
    cy.get('img').first().click();
    cy.wait('@betRace').its('request.body').should('contain', { ponyId: 1 });

    // a pony is now selected
    cy.get('.selected').should('have.length', 1);

    // bet on the second one
    cy.intercept('POST', 'api/races/12/bets', { ...race, betPonyId: 2 }).as('secondBetRace');
    cy.get('img').eq(1).click();
    cy.wait('@secondBetRace').its('request.body').should('contain', { ponyId: 2 });

    // a pony is still selected
    cy.get('.selected').should('have.length', 1);

    // bet fails
    cy.intercept('POST', 'api/races/12/bets', {
      statusCode: 404
    }).as('failedBetRace');

    // bet on first pony
    cy.get('img').first().click();
    cy.wait('@failedBetRace');

    // alert should be displayed
    cy.get('.alert').should('contain', 'The race is already started or finished');

    // close alert
    cy.get('.alert button').click();
    cy.get('.alert').should('not.exist');
  });
});
