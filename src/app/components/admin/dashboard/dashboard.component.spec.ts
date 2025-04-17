import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { CardComponent } from './card.component';
import { ConfirmModalComponent } from './confirm-modal.component';
import { CustomerService } from '../../../services/customer.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { APIService } from '../../../services/API/api.service';
import {
  asyncType,
  customerType,
  orderType,
  productType,
} from '../../../types';
import {
  mockProducts,
  mockCustomers,
  mockOrders,
} from '../../../../test/mocks';
import {
  basicComponentTestFor,
  getNumberValueFromText,
} from '../../../../test/test-utils';

basicComponentTestFor(CardComponent);
basicComponentTestFor(ConfirmModalComponent);

describe('DashboardComponent (Admin facing)', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let APISpy: jasmine.SpyObj<APIService>;
  let rootElement: HTMLElement;

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'fetchProducts',
    ]);
    const customerSpy = jasmine.createSpyObj('CustomerService', [
      'getCustomers',
      'fetchCustomers',
    ]);
    const orderSpy = jasmine.createSpyObj('OrderService', [
      'getOrders',
      'fetchOrders',
    ]);

    APISpy = jasmine.createSpyObj('APIService', ['resetDB']);

    productSpy.getProducts.and.returnValue({
      value: mockProducts,
      isLoading: false,
      hasError: false,
    } as asyncType<productType[]>);

    customerSpy.getCustomers.and.returnValue({
      value: mockCustomers,
      isLoading: false,
      hasError: false,
    } as asyncType<customerType[]>);

    orderSpy.getOrders.and.returnValue({
      value: mockOrders,
      isLoading: false,
      hasError: false,
    } as asyncType<orderType[]>);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: CustomerService, useValue: customerSpy },
        { provide: OrderService, useValue: orderSpy },
        { provide: APIService, useValue: APISpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    rootElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display aggregated data from products, customers and orders', () => {
    const totalSales = mockOrders
      .map((order) => order.pricePaid)
      .reduce((sum, p) => (sum += p));
    const avarageFlooredSalesValue = Math.floor(
      totalSales / mockCustomers.length
    );
    const activeProducts = mockProducts
      .map((product) => (product.isActive ? 1 : 0))
      .reduce<number>((sum, p) => (sum += p), 0);
    const inactiveProducts = mockProducts.length - activeProducts;

    expect(getNumberValueFromText(component.numberOfSales))
      .withContext("number of orders don't add up")
      .toBe(mockOrders.length);

    expect(getNumberValueFromText(component.salesAmount))
      .withContext("total sales amount don't add up")
      .toBe(totalSales);

    expect(getNumberValueFromText(component.averageValuePerCustomer))
      .withContext("avarage sales value don't add up")
      .toBe(avarageFlooredSalesValue);

    expect(getNumberValueFromText(component.customerCount))
      .withContext("number of customers don't add up")
      .toBe(mockCustomers.length);

    expect(getNumberValueFromText(component.activeCount))
      .withContext("number of active products don't add up")
      .toBe(activeProducts);

    expect(getNumberValueFromText(component.inactiveCount))
      .withContext("number of inactive products don't add up")
      .toBe(inactiveProducts);
  });

  it('should call resetDB from service if reset button is pressed and confirmed', () => {
    const resetButton = rootElement.querySelector(
      '[data-test-reset-btn]'
    ) as HTMLButtonElement;
    resetButton.click();
    fixture.detectChanges();
    const confirmButton = rootElement.querySelector(
      '[data-test-confirm-btn]'
    ) as HTMLButtonElement;

    confirmButton.click();
    fixture.detectChanges();

    expect(APISpy.resetDB).toHaveBeenCalled();
  });

  it('should not call resetDB from service if reset button is pressed but canceled', () => {
    const resetButton = rootElement.querySelector(
      '[data-test-reset-btn]'
    ) as HTMLButtonElement;
    resetButton.click();
    fixture.detectChanges();
    const confirmButton = rootElement.querySelector(
      '[data-test-cancel-btn]'
    ) as HTMLButtonElement;

    confirmButton.click();
    fixture.detectChanges();

    expect(APISpy.resetDB).not.toHaveBeenCalled();
  });
});
