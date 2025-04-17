import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersComponent } from './customers.component';
import { CustomerService } from '../../../services/customer.service';
import { asyncType, customerType } from '../../../types';
import { mockCustomers } from '../../../../test/mocks';
import { getNumberValueFromText } from '../../../../test/test-utils';

describe('CustomersComponent (Admin facing)', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let customerSpy: jasmine.SpyObj<CustomerService>;

  beforeEach(async () => {
    customerSpy = jasmine.createSpyObj('CustomerService', [
      'getCustomers',
      'fetchCustomers',
      'deleteCustomer',
    ]);

    customerSpy.getCustomers.and.returnValue({
      value: mockCustomers,
      isLoading: false,
      hasError: false,
    } as asyncType<customerType[]>);

    await TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [{ provide: CustomerService, useValue: customerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have headers for email, number of orders and total value', () => {
    const headers = component.headers
      .map((header) => (typeof header === 'string' ? header : header.label))
      .map((header) => header.toLowerCase());

    expect(headers.find((h) => h.match(/email/))).toBeTruthy();
    expect(headers.find((h) => h.match(/orders/))).toBeTruthy();
    expect(headers.find((h) => h.match(/value/))).toBeTruthy();
  });

  it('should prepare customer data for table to display', () => {
    const cellsOfImportance = component.userTableCells.map((row) => ({
      id: row.id,
      email: row.cells[0],
      orders: row.cells[1],
      value: getNumberValueFromText(row.cells[2] as string),
      options: row.options?.map((option) =>
        typeof option === 'string' ? option : option.id
      ),
    }));
    const expectedCells = mockCustomers.map((customer) => ({
      id: customer.id,
      email: customer.email,
      orders: customer.orders?.length || 0,
      value: customer.totalOrderValue || 0,
      options: jasmine.arrayContaining(['delete']),
    }));

    expect(cellsOfImportance).toEqual(expectedCells);
  });

  it('should call deleteCustomer if delete option was selected', () => {
    component.handleSelectedOption({
      itemId: 'fakeCustomerID',
      option: { id: 'delete', label: '' },
    });

    expect(customerSpy.deleteCustomer).toHaveBeenCalledWith('fakeCustomerID');
  });
});
