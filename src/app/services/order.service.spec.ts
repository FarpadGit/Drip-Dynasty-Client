import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { OrderAPIService } from './API/order-api.service';
import { mockOrders } from '../../test/mocks';

describe('OrderService', () => {
  let service: OrderService;
  let apiSpy: jasmine.SpyObj<OrderAPIService>;

  const mockOrdersResponse = {
    value: mockOrders,
    isLoading: false,
    hasError: false,
  };

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('OrderAPIService', [
      'getOrders',
      'DeleteOrder',
    ]);

    apiSpy.getOrders.and.resolveTo(mockOrders);

    TestBed.configureTestingModule({
      providers: [{ provide: OrderAPIService, useValue: apiSpy }],
    });
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of orders from service', async () => {
    await service.fetchOrders();

    expect(service.getOrders()).toEqual(mockOrdersResponse);
  });

  it('should call deleteOrder if order is being deleted', async () => {
    await service.deleteOrder('some ID');

    expect(apiSpy.DeleteOrder).toHaveBeenCalledOnceWith('some ID');
  });
});
