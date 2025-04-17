import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { asyncType, orderType } from '../../../types';
import { OrderService } from '../../../services/order.service';
import { mockOrders } from '../../../../test/mocks';
import { getNumberValueFromText } from '../../../../test/test-utils';

describe('OrdersComponent (Admin facing)', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let orderSpy: jasmine.SpyObj<OrderService>;

  beforeEach(async () => {
    orderSpy = jasmine.createSpyObj('OrderService', [
      'getOrders',
      'fetchOrders',
      'deleteOrder',
    ]);

    orderSpy.getOrders.and.returnValue({
      value: mockOrders,
      isLoading: false,
      hasError: false,
    } as asyncType<orderType[]>);

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [{ provide: OrderService, useValue: orderSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have headers for order ID, ordered product name, customer email and price paid', () => {
    const headers = component.headers.map((header) => header.toLowerCase());

    expect(headers.find((h) => h.match(/id/))).toBeTruthy();
    expect(headers.find((h) => h.match(/product/))).toBeTruthy();
    expect(headers.find((h) => h.match(/customer/))).toBeTruthy();
    expect(headers.find((h) => h.match(/price/))).toBeTruthy();
  });

  it('should prepare order data for table to display', () => {
    const cellsOfImportance = component.orderTableCells.map((row) => ({
      id: row.cells[0],
      product: row.cells[1],
      email: row.cells[2],
      pricePaid: getNumberValueFromText(row.cells[3] as string),
      options: row.options?.map((option) =>
        typeof option === 'string' ? option : option.id
      ),
    }));
    const expectedCells = mockOrders.map((order) => ({
      id: order.id,
      product: order.productName,
      email: order.customerEmail,
      pricePaid: order.pricePaid,
      options: jasmine.arrayContaining(['delete']),
    }));

    expect(cellsOfImportance).toEqual(expectedCells);
  });

  it('should call deleteOrder if delete option was selected', () => {
    component.handleSelectedOption({
      itemId: 'fakeCustomerID',
      option: { id: 'delete', label: '' },
    });

    expect(orderSpy.deleteOrder).toHaveBeenCalledWith('fakeCustomerID');
  });
});
