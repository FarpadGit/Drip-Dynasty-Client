import { TestBed } from '@angular/core/testing';

import { OrderAPIService } from './order-api.service';
import { EnvService } from '../env.service';
import { orderType } from '../../types';
import { mockOrders } from '../../../test/mocks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('OrderAPIService', () => {
  let service: OrderAPIService;
  let mockAxios: MockAdapter;

  const mapToServer = (order: orderType) => ({
    ...order,
    pricePaid: order.pricePaid.toString(),
  });

  const ordersResponse = mockOrders.map(mapToServer);

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();
    mockAxios
      .onGet('/orders')
      .reply(200, ordersResponse)
      .onDelete('/orders/order1ID')
      .reply(204, 'delete called');

    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    TestBed.configureTestingModule({
      providers: [{ provide: EnvService, useValue: envSpy }],
    });
    service = TestBed.inject(OrderAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all orders', async () => {
    const response = await service.getOrders();

    expect(response).toEqual(mockOrders);
  });

  it('should delete order with id', async () => {
    const response = await service.DeleteOrder('order1ID');

    expect(response).toBe('delete called');
  });
});
