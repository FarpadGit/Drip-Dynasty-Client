import { TestBed } from '@angular/core/testing';

import { CustomerAPIService } from './customer-api.service';
import { EnvService } from '../env.service';
import { customerType } from '../../types';
import { mockCustomers } from '../../../test/mocks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('CustomerAPIService', () => {
  let service: CustomerAPIService;
  let mockAxios: MockAdapter;

  const mapToServer = (customer: customerType) => ({
    ...customer,
  });

  const customersResponse = mockCustomers.map(mapToServer);

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();
    mockAxios
      .onGet('/customers')
      .reply(200, customersResponse)
      .onDelete('/customers/customer1ID')
      .reply(204, 'delete called');

    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    TestBed.configureTestingModule({
      providers: [{ provide: EnvService, useValue: envSpy }],
    });
    service = TestBed.inject(CustomerAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all customers', async () => {
    const response = await service.getCustomers();

    expect(response).toEqual(mockCustomers);
  });

  it('should delete customer with id', async () => {
    const response = await service.DeleteCustomer('customer1ID');

    expect(response).toBe('delete called');
  });
});
