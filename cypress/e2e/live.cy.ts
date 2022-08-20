import * as Webstomp from 'webstomp-client';

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

  cy.intercept('POST', 'api/races/12/boosts', {}).as('boostPony');
}

function storeUserInLocalStorage(): void {
  localStorage.setItem('rememberMe', JSON.stringify(user));
}

function buildFakeWS() {
  const fakeWS: any = {
    close: () => ({}),
    send: (message: string) => {
      const unmarshalled = Webstomp.Frame.unmarshallSingle(message);
      if (unmarshalled.command === 'CONNECT') {
        fakeWS.onmessage({ data: Webstomp.Frame.marshall('CONNECTED') });
      } else if (unmarshalled.command === 'SUBSCRIBE' && unmarshalled.headers.destination === '/race/12') {
        fakeWS.id = unmarshalled.headers.id;
      }
    },
    emulateRace: (liveRaceModel: any) => {
      const headers = {
        destination: '/race/12',
        subscription: fakeWS.id
      };
      const data = Webstomp.Frame.marshall('MESSAGE', headers, JSON.stringify(liveRaceModel));
      fakeWS.onmessage({ data });
    }
  };
  const wsOptions = {
    onBeforeLoad(win: any) {
      cy.stub(win, 'WebSocket').as('ws').returns(fakeWS);
    }
  };
  return { fakeWS, wsOptions };
}

describe('Live', () => {
  beforeEach(() => startBackend());

  it('should display a pending live race', () => {
    storeUserInLocalStorage();

    const { wsOptions } = buildFakeWS();
    cy.visit('/races', wsOptions);
    cy.wait('@getRaces');
    cy.wait(1000);

    // go to bet page for the first race
    cy.get('.btn-primary').first().click();
    cy.wait('@getRace');
    cy.wait(1000);

    // bet on first pony
    cy.get('img').first().click();
    cy.wait('@betRace');

    // emulate a pending race
    cy.intercept('GET', 'api/races/12', {
      ...race,
      betPonyId: 2,
      status: 'PENDING'
    }).as('getPendingRace');
    cy.wait(1000);

    // go to live
    cy.get('.btn-primary').first().click();
    cy.location('pathname').should('eq', '/races/12/live');
    cy.wait('@getPendingRace');

    // race detail should be displayed
    cy.get('h1').should('contain', 'Paris');
    cy.get('div').should('contain', 'ago');
    cy.get('img').should('have.length', 5);
    cy.get('.selected').should('have.length', 1);
  });

  it('should display a running live race and boost a pony', () => {
    storeUserInLocalStorage();
    const { fakeWS, wsOptions } = buildFakeWS();

    cy.visit('/races', wsOptions);
    cy.wait('@getRaces');
    cy.wait(1000);

    // go to bet page for the first race
    cy.get('.btn-primary').first().click();
    cy.wait('@getRace');
    cy.wait(1000);

    // bet on first pony
    cy.get('img').first().click();
    cy.wait('@betRace');
    cy.wait(1000);

    // emulate a running race
    cy.intercept('GET', 'api/races/12', {
      ...race,
      betPonyId: 2,
      status: 'RUNNING'
    }).as('getRunningRace');

    let angular: any;
    cy.window().then((win: Window) => (angular = (win as any).ng));
    let document: Document;
    cy.document().then(doc => (document = doc));

    // go to live
    cy.get('.btn-primary').first().click();
    cy.location('pathname').should('eq', '/races/12/live');
    cy.wait('@getRunningRace');
    cy.wait(1000);

    // WebSocket connection created
    cy.get('@ws')
      .should('be.called')
      .then(() => {
        fakeWS.emulateRace({
          ponies: [
            { id: 1, name: 'Gentle Pie', color: 'YELLOW', position: 30 },
            { id: 2, name: 'Big Soda', color: 'ORANGE', position: 80 },
            { id: 3, name: 'Gentle Bottle', color: 'PURPLE', position: 70 },
            { id: 4, name: 'Superb Whiskey', color: 'GREEN', position: 60 },
            { id: 5, name: 'Fast Rainbow', color: 'BLUE', position: 30 }
          ],
          status: 'RUNNING'
        });
        // the component can be inside ng-component if it has no selector
        const element = document.querySelector('pr-live') || document.querySelector('ng-component');
        const liveComponent = angular.getComponent(element);
        angular.applyChanges(liveComponent);
      });

    // running ponies should be displayed
    cy.get('h1').should('contain', 'Paris');
    cy.get('img').should('have.length', 5);
    cy.get('div.pony-wrapper').should('have.attr', 'style').and('include', 'margin-left: 25%;');
    cy.get('.selected')
      .should('have.length', 1)
      .then(() => {
        fakeWS.emulateRace({
          ponies: [
            { id: 1, name: 'Gentle Pie', color: 'YELLOW', position: 50 },
            { id: 2, name: 'Big Soda', color: 'ORANGE', position: 90 },
            { id: 3, name: 'Gentle Bottle', color: 'PURPLE', position: 70 },
            { id: 4, name: 'Superb Whiskey', color: 'GREEN', position: 65 },
            { id: 5, name: 'Fast Rainbow', color: 'BLUE', position: 30 }
          ],
          status: 'RUNNING'
        });
        // the component can be inside ng-component if it has no selector
        const element = document.querySelector('pr-live') || document.querySelector('ng-component');
        const liveComponent = angular.getComponent(element);
        angular.applyChanges(liveComponent);
      });
    cy.get('img').should('have.length', 5);
    cy.get('div.pony-wrapper')
      .should('have.attr', 'style')
      .and('include', 'margin-left: 45%;')
      .then(() =>
        fakeWS.emulateRace({
          ponies: [
            { id: 1, name: 'Gentle Pie', color: 'YELLOW', position: 60, boosted: true },
            { id: 2, name: 'Big Soda', color: 'ORANGE', position: 90 },
            { id: 3, name: 'Gentle Bottle', color: 'PURPLE', position: 70 },
            { id: 4, name: 'Superb Whiskey', color: 'GREEN', position: 65 },
            { id: 5, name: 'Fast Rainbow', color: 'BLUE', position: 30 }
          ],
          status: 'RUNNING'
        })
      );
    // boost the first pony
    cy.wait(1000);
    cy.get('img').first().click().click().click().click().click();
    cy.wait('@boostPony').its('request.body').should('contain', { ponyId: 1 });
    cy.get('img').should('have.attr', 'src').and('include', '-rainbow.gif');
  });

  it('should display a finished live race', () => {
    storeUserInLocalStorage();
    const { fakeWS, wsOptions } = buildFakeWS();

    cy.visit('/races', wsOptions);
    cy.wait('@getRaces');
    cy.wait(1000);

    // go to bet page for the first race
    cy.get('.btn-primary').first().click();
    cy.wait('@getRace');
    cy.wait(1000);

    // bet on first pony
    cy.get('img').first().click();
    cy.wait('@betRace');
    cy.wait(1000);

    // emulate a finished race
    cy.intercept('GET', 'api/races/12', {
      ...race,
      betPonyId: 2,
      status: 'RUNNING'
    }).as('getRunningRace');

    // go to live
    cy.get('.btn-primary').first().click();
    cy.location('pathname').should('eq', '/races/12/live');
    cy.wait('@getRunningRace');
    cy.wait(1000);

    let angular: any;
    cy.window().then((win: Window) => (angular = (win as any).ng));
    let document: Document;
    cy.document().then(doc => (document = doc));

    // WebSocket connection created
    cy.get('@ws')
      .should('be.called')
      // and emulate a finished race
      .then(() => {
        fakeWS.emulateRace({
          ponies: [
            { id: 1, name: 'Gentle Pie', color: 'YELLOW', position: 30 },
            { id: 2, name: 'Big Soda', color: 'ORANGE', position: 100 },
            { id: 3, name: 'Gentle Bottle', color: 'PURPLE', position: 70 },
            { id: 4, name: 'Superb Whiskey', color: 'GREEN', position: 60 },
            { id: 5, name: 'Fast Rainbow', color: 'BLUE', position: 30 }
          ],
          status: 'RUNNING'
        });
        fakeWS.emulateRace({
          ponies: [
            { id: 1, name: 'Gentle Pie', color: 'YELLOW', position: 30 },
            { id: 2, name: 'Big Soda', color: 'ORANGE', position: 100 },
            { id: 3, name: 'Gentle Bottle', color: 'PURPLE', position: 70 },
            { id: 4, name: 'Superb Whiskey', color: 'GREEN', position: 60 },
            { id: 5, name: 'Fast Rainbow', color: 'BLUE', position: 30 }
          ],
          status: 'FINISHED'
        });
        // the component can be inside ng-component if it has no selector
        const element = document.querySelector('pr-live') || document.querySelector('ng-component');
        const liveComponent = angular.getComponent(element);
        angular.applyChanges(liveComponent);
      });

    // victorious pony should be displayed
    cy.get('h1').should('contain', 'Paris');
    cy.get('img').should('have.length', 1);
    cy.get('.selected').should('have.length', 1);
    cy.get('.alert.alert-success').should('have.text', 'You won your bet!');
  });
});
