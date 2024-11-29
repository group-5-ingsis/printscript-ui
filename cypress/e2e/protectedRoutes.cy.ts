import {AUTH0_USERNAME, AUTH0_PASSWORD, AUTH0_DOMAIN} from "../../src/utils/constants";

describe('Protected routes test', () => {
  it('should redirect to login when accessing a protected route unauthenticated', () => {
      cy.visit('/');
      cy.wait(10000);
      cy.url().then((currentUrl) => {
          cy.log(`Current URL: ${currentUrl}`);
      });
      cy.url().should('include', AUTH0_DOMAIN);
  });

  it('should display login content', () => {
    cy.visit('AUTH0_DOMAIN');

    cy.contains('Username').should('exist');
    cy.contains('Password').should('exist');
  });

  it('should not redirect to login when the user is already authenticated', () => {
    cy.loginToAuth0(
        AUTH0_USERNAME,
        AUTH0_PASSWORD
    )

    cy.visit('/');

    cy.wait(1000)

    cy.url().should('not.include', 'AUTH0_DOMAIN');
  });

})
