describe('Register', () => {
  it('should display a register page', () => {
    cy.visit('/register');

    const loginInput = () => cy.get('input').first();
    const passwordInput = () => cy.get('input[type=password]').first();
    const birthYearInput = () => cy.get('input[type=number]');
    const errorMessage = () => cy.get('.mb-3 div');

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

    birthYearInput().type('1');
    birthYearInput().clear();
    errorMessage().should('be.visible').and('contain', 'Birth year is required');
    birthYearInput().type('1986');
    errorMessage().should('not.exist');

    cy.get('form > button').click();
  });
});
