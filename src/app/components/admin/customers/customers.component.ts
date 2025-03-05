import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomerService } from '../../../services/customer.service';
import {
  responseObjectType,
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
  private customers: asyncType<customerType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };

  constructor(private customerService: CustomerService) {
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
    });
  }

  get isLoading() {
    return false;
  }

  get hasError() {
    return false;
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
    response,
  }: {
    itemId: string;
    option: tableOptionType;
    response: BehaviorSubject<responseObjectType | null>;
  }) {
    if (option.id === 'delete') {
      response.next('ok');
      this.customerService.deleteCustomer(customerId);
    }
  }
}
