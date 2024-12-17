import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { OrderService } from '../../../services/order.service';
import {
  responseObjectType,
  TableComponent,
  tableOptionType,
  tableRowType,
} from '../../UI/table/table.component';
import { HeaderDirective } from '../../../directives/UI/header.directive';
import { formatCurrency } from '../../../utils/formatters';
import { asyncType, orderType } from '../../../types';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, HeaderDirective, TableComponent],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  private orders: asyncType<orderType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };

  constructor(private orderService: OrderService) {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  get isLoading() {
    return false;
  }

  get hasError() {
    return false;
  }

  get headers() {
    return ['ID', 'Product', 'Customer', 'Price Paid'];
  }

  get orderTableCells() {
    return this.orders.value?.map((order) => {
      return {
        id: order.id,
        cells: [
          order.id,
          order.productName,
          order.customerEmail,
          formatCurrency(order.pricePaid),
        ],
        options: [
          {
            id: 'delete',
            label: 'delete',
            styles: 'text-destructive',
          },
        ],
      };
    }) as tableRowType[];
  }

  handleSelectedOption({
    itemId: orderId,
    option,
    response,
  }: {
    itemId: string;
    option: tableOptionType;
    response: BehaviorSubject<responseObjectType | null>;
  }) {
    if (option.id === 'delete') {
      response.next('ok');
      this.orderService.deleteOrder(orderId);
    }
  }
}
