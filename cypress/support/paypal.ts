// Paypal has a strict security measure on its UI which means we have to generate a real transaction request through API calls even while testing,
// otherwise clicking on the button will throw an error event as it sends the request ID to its servers for comparison.
// This code is similar to what the Drip server side services do when initiating payment request. The transaction however will never go through to PayPal (only the request).

export function getBearer() {
  try {
    const auth =
      Cypress.env('PAYPAL_CLIENT_ID') +
      ':' +
      Cypress.env('PAYPAL_CLIENT_SECRET');
    const authHeaderValue = 'Basic ' + btoa(auth);

    const response = fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: [
        ['Content-Type', 'application/x-www-form-urlencoded'],
        ['Authorization', authHeaderValue],
        ['PayPal-Request-Id', 'DRIP-DYNASTY-BEARER'],
      ],
    });

    return response.then((res) => res.json()).then((res) => res.access_token);
  } catch (ignored) {
    return '';
  }
}

export async function createOrder(refId: string, price: string) {
  try {
    const bearer = await getBearer();
    const response = fetch(
      'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      {
        method: 'POST',
        body: `{ 
        "intent": "CAPTURE", 
        "purchase_units": [ 
            { 
                "reference_id": "${refId}", 
                "amount": { 
                    "currency_code": "HUF", 
                    "value": "${price}" 
                } 
            }
        ] 
        }`,
        headers: [
          ['Content-Type', 'application/json'],
          ['Authorization', 'Bearer ' + bearer],
        ],
      }
    );

    return response.then((res) => res.json()).then((res) => res.id);
  } catch (ignored) {
    return '';
  }
}
