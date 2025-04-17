import { TestBed } from '@angular/core/testing';

import { EmailApiService } from './email-api.service';
import { EnvService } from '../env.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('EmailApiService', () => {
  let service: EmailApiService;
  let mockAxios: MockAdapter;

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();
    mockAxios.onPost('/email/orderHistory').reply(200, 'orderHistory called');

    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    TestBed.configureTestingModule({
      providers: [{ provide: EnvService, useValue: envSpy }],
    });
    service = TestBed.inject(EmailApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should forward call to send order history', async () => {
    const response = await service.sendOrderHistory('customer@email.com');

    expect(response).toBe('orderHistory called');
  });
});
