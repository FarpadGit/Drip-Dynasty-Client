// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
declare namespace Cypress {
  interface Chainable<Subject = any> {
    getPaypalButtons(selector: any): ReturnType<typeof getPaypalButtons>;
    getInnerIframe(
      selector: any,
      levels?: number[]
    ): ReturnType<typeof getPaypalButtons> | ReturnType<typeof getInnerIframe>;
  }
}

// Paypal buttons are IFrames which are challenging for cypress to access
const getPaypalButtons = (selector: any) => {
  return cy
    .get(selector)
    .get('iframe')
    .first()
    .then((iframe) => {
      const body = iframe.contents().find('body');
      cy.wrap(body);
    });
};

// When a paypal button is clicked the resulting data form is also an IFrame within an IFrame.
// this command should recursively get any nested levels of IFrames
const getInnerIframe = (
  iframe: ReturnType<typeof getPaypalButtons>,
  levels: number[]
) => {
  const innerFrame = (
    iframe.find('iframe').eq(levels[0] - 1) as Cypress.Chainable<
      JQuery<HTMLIFrameElement>
    >
  ).then((iframe) => {
    const body = iframe.contents().find('body');
    cy.wrap(body);
  });

  if (levels.length === 1) return innerFrame;
  return getInnerIframe(innerFrame, levels.slice(1));
};

Cypress.Commands.add('getPaypalButtons', getPaypalButtons);

// usage: cy.getInnerIframe('my-component', [1, 2, 2]);
// to get the first iframe within my-component, then the second nested iframe inside that frame and than the second nested one inside that
Cypress.Commands.add('getInnerIframe', (selector, levels?) => {
  if (levels == undefined || levels.length === 0)
    return getPaypalButtons(selector);
  return getInnerIframe(getPaypalButtons(selector), levels);
});
