import { Injectable } from '@angular/core';

// centralizing all environment variables into an injectable service allows them to be mocked out in testing

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  constructor() {}

  get env() {
    return {
      NG_APP_SERVER_URL: import.meta?.env?.['NG_APP_SERVER_URL'] ?? '',
      NG_APP_PAYPAL_CLIENT_ID:
        import.meta?.env?.['NG_APP_PAYPAL_CLIENT_ID'] ?? '',
      NG_APP_PAYPAL_CLIENT_SECRET:
        import.meta?.env?.['NG_APP_PAYPAL_CLIENT_SECRET'] ?? '',
    };
  }
}
