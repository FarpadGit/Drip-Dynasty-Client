import { TestBed } from '@angular/core/testing';

import { CustomerService } from './customer.service';
import { CustomerAPIService } from './API/customer-api.service';
import { mockCustomers } from '../../test/mocks';

describe('CustomerService', () => {
  let service: CustomerService;
  let apiSpy: jasmine.SpyObj<CustomerAPIService>;

  const mockCustomersResponse = {
    value: mockCustomers,
    isLoading: false,
    hasError: false,
  };

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('CustomerAPIService', [
      'getCustomers',
      'DeleteCustomer',
    ]);

    apiSpy.getCustomers.and.resolveTo(mockCustomers);

    TestBed.configureTestingModule({
      providers: [{ provide: CustomerAPIService, useValue: apiSpy }],
    });
    service = TestBed.inject(CustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of customers from service', async () => {
    await service.fetchCustomers();

    expect(service.getCustomers()).toEqual(mockCustomersResponse);
  });

  it('should call deleteCustomer if customer is being deleted', async () => {
    await service.deleteCustomer('some ID');

    expect(apiSpy.DeleteCustomer).toHaveBeenCalledOnceWith('some ID');
  });
});
