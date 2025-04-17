import { TestBed } from '@angular/core/testing';

import { PaypalApiService } from './paypal-api.service';
import { EnvService } from '../env.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('PaypalApiService', () => {
  let service: PaypalApiService;
  let mockAxios: MockAdapter;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();
    mockAxios.onPost('/paypal/create-order').reply(200, 'createOrder called');

    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    TestBed.configureTestingModule({
      providers: [{ provide: EnvService, useValue: envSpy }],
    });
    service = TestBed.inject(PaypalApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should forward call to create order', async () => {
    const response = await service.createOrder('product1ID');

    expect(response).toBe('createOrder called');
  });
});
