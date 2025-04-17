import { TestBed } from '@angular/core/testing';

import { EnvService } from './env.service';

describe('EnvService', () => {
  let service: EnvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(Object.hasOwn(service.env, 'NG_APP_PAYPAL_CLIENT_ID')).toBeTrue();
    expect(
      Object.hasOwn(service.env, 'NG_APP_PAYPAL_CLIENT_SECRET')
    ).toBeTrue();
    expect(Object.hasOwn(service.env, 'NG_APP_SERVER_URL')).toBeTrue();
  });
});
