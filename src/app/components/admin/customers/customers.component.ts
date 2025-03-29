import { Component, effect, ViewChild } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import {
  TableComponent,
  tableOptionType,
  tableRowType,
} from '../../UI/table/table.component';
import { HeaderDirective } from '../../../directives/UI/header.directive';
import { formatCurrency } from '../../../utils/formatters';
import { asyncType, customerType } from '../../../types';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [HeaderDirective, TableComponent],
  templateUrl: './customers.component.html',
})
export class CustomersComponent {
  @ViewChild('table') table!: TableComponent;
  private customers: asyncType<customerType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };

  constructor(private customerService: CustomerService) {
    customerService.fetchCustomers();

    effect(() => {
      this.customers = this.customerService.getCustomers();
    });
  }

  get isLoading() {
    return this.customers.isLoading;
  }

  get hasError() {
    return this.customers.hasError;
  }

  get headers() {
    return [{ label: 'Email', width: 20 }, 'Orders', 'Value'];
  }

  get userTableCells() {
    return this.customers.value?.map((customer) => {
      return {
        id: customer.id,
        cells: [
          customer.email,
          customer.orders?.length,
          formatCurrency(customer.totalOrderValue || 0),
        ],
        options: [
          {
            id: 'delete',
            label: 'delete',
            styles: 'text-destructive',
            dialog:
              'Deleting this customer will also delete all of their existing orders too. Proceed?',
          },
        ],
      };
    }) as tableRowType[];
  }

  handleSelectedOption({
    itemId: customerId,
    option,
  }: {
    itemId: string;
    option: tableOptionType;
  }) {
    if (option.id === 'delete') {
      this.table.actionResponse.set('ok');
      this.customerService.deleteCustomer(customerId);
    }
  }
}
