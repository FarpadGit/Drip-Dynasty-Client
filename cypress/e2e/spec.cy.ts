import paypalForm from '../fixtures/paypalForm.json';
import mockProducts from '../fixtures/mockProducts.json';
import mockPaginatedProducts from '../fixtures/mockPaginatedProducts.json';
import { createOrder } from '../support/paypal.ts';

describe('Buying a product with Paypal', () => {
  beforeEach(() => {
    cy.viewport(1280, 1024);
    cy.intercept('GET', /products$/g, {
      ...mockPaginatedProducts,
      products: mockProducts,
    });
    cy.intercept('GET', /products\/newest/g, {
      fixture: 'mockProducts.json',
    });
    cy.intercept('GET', /products\/mostPopular/g, {
      fixture: 'mockProducts.json',
    });

    cy.visit('/');
    cy.get('h1').contains('drip dynasty', { matchCase: false });
  });

  it('clicks on a product on Home page, then fills out Paypal form to purchase it', () => {
    cy.intercept('POST', /sandbox.paypal.com/g);
    cy.intercept('GET', /products\/product1ID/g, mockProducts[0]);
    cy.intercept('POST', /paypal\/create-order/g, async (req) => {
      const productName = mockProducts[0].name;
      const productPrice = mockProducts[0].price.toString();
      const response = await createOrder(productName, productPrice);
      req.reply(response);
    });
    cy.intercept('POST', /paypal\/purchase\//g, 'fake_new_order_ID');

    cy.get('ui-product-card').find('button').first().click();

    cy.url().should('match', /\/products\/.*/);
    cy.wait(2000);
    cy.getPaypalButtons('ui-paypal-button')
      .find('.paypal-button-number-1')
      .eq(1)
      .click();
    cy.wait(4000);

    cy.getInnerIframe('ui-paypal-button', [1]).as('credit-card-form');
    cy.get('@credit-card-form')
      .find('#credit-card-number')
      .type(paypalForm['credit-card-number']);
    cy.get('@credit-card-form')
      .find('#expiry-date')
      .type(paypalForm['expiry-date']);
    cy.get('@credit-card-form')
      .find('#credit-card-security')
      .type(paypalForm['credit-card-security']);
    cy.get('@credit-card-form').find('select').select('HU');
    cy.get('@credit-card-form')
      .find('[name="familyName"]')
      .type(paypalForm.familyName);
    cy.get('@credit-card-form')
      .find('[name="givenName"]')
      .type(paypalForm.givenName);
    cy.get('@credit-card-form').find('[name="city"]').type(paypalForm.city);
    cy.get('@credit-card-form').find('[name="line1"]').type(paypalForm.address);
    cy.get('@credit-card-form')
      .find('[name="postcode"]')
      .type(paypalForm.postcode);
    cy.get('@credit-card-form').find('#phone').type(paypalForm.phone);
    cy.get('@credit-card-form').find('#email').type(paypalForm.email);

    cy.get('@credit-card-form').find('#submit-button').click();
    cy.wait(10000);

    cy.url().should('match', /purchase-processed/g);
    cy.get('h1').contains('successful', { matchCase: false });
    cy.get('#message').contains('order id', { matchCase: false });
  });

  it('logs in to admin dashboard', () => {
    let authenticated = false;
    cy.intercept('GET', /auth\/enticate/g, (req) => {
      if (authenticated) req.reply({ statusCode: 200 });
      else req.reply({ statusCode: 400 });
    });
    cy.intercept('POST', /auth\/login/g, 'fake_bearer_token');
    cy.intercept('GET', /orders/g, []);
    cy.intercept('GET', /customers/g, []);

    cy.visit('/admin');

    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input#username').type(Cypress.env('DASHBOARD_USERNAME'));
    cy.get('input#password').type(Cypress.env('DASHBOARD_PASSWORD'));
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.then(() => (authenticated = true));
    cy.get('button[type="submit"]').click();
    cy.url().should('match', /\/admin/);

    cy.get('ui-navlink[href="/admin/products"]').click();
    cy.url().should('match', /\/admin\/products/);

    cy.get('ui-navlink[href="/admin/customers"]').click();
    cy.url().should('match', /\/admin\/customers/);

    cy.get('ui-navlink[href="/admin/orders"]').click();
    cy.url().should('match', /\/admin\/orders/);

    cy.get('nav').contains('Log out').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('fails to log in to admin dashboard', () => {
    cy.intercept('GET', /auth\/enticate/g, { statusCode: 400 });
    cy.intercept('POST', /auth\/login/g, { error: true });

    cy.visit('/admin');

    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input#username').type(Cypress.env('DASHBOARD_USERNAME'));
    cy.get('input#password').type(Cypress.env('DASHBOARD_PASSWORD'));
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();
    cy.url().should('match', /\/login/);
    cy.get('div').contains('error').should('exist');
  });
});
