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
  startInstant: '2020-02-18T08:02:00Z',
  status: 'PENDING'
};

const user = {
  id: 1,
  login: 'cedric',
  money: 1000,
  registrationInstant: '2015-12-01T11:00:00Z',
  token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjF9.5cAW816GUAg3OWKWlsYyXI4w3fDrS5BpnmbyBjVM7lo'
};

function startBackend(): void {
  cy.intercept('GET', 'api/races/12', race).as('getPendingRace');
}

function storeUserInLocalStorage(): void {
  localStorage.setItem('rememberMe', JSON.stringify(user));
}

describe('Live', () => {
  beforeEach(() => startBackend());

  it('should display a live race', () => {
    storeUserInLocalStorage();
    cy.visit('/races/12/live');
    cy.wait('@getPendingRace');

    cy.get('h1').should('contain', 'Paris');
  });
});
