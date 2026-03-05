import { Component, effect, ViewChild } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import {
  TableComponent,
  tableOptionType,
  tableRowType,
} from '../../UI/table/table.component';
import { HeaderDirective } from '../../../directives/UI/header.directive';
import { formatCurrency } from '../../../utils/formatters';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [HeaderDirective, TableComponent],
  templateUrl: './orders.component.html',
})
export class OrdersComponent {
  @ViewChild('table') table!: TableComponent;
  private orders: asyncType<orderType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };

  constructor(private orderService: OrderService) {
    this.orderService.fetchOrders();

    effect(() => {
      this.orders = this.orderService.getOrders();
    });
  }

  get isLoading() {
    return this.orders.isLoading;
  }

  get hasError() {
    return this.orders.hasError;
  }

  get headers() {
    return ['ID', 'Product', 'Customer', 'Price Paid', 'Variants'];
  }

  get orderTableCells() {
    return this.orders.value?.map((order) => ({
      id: order.id,
      cells: [
        order.id,
        order.productName,
        order.customerEmail,
        formatCurrency(order.pricePaid),
        order.variants?.map((v) => `${v.name}: ${v.value}`).join(', '),
      ],
      options: [
        {
          id: 'delete',
          label: 'delete',
          styles: 'text-destructive',
        },
      ],
    })) as tableRowType[];
  }

  handleSelectedOption({
    itemId: orderId,
    option,
  }: {
    itemId: string;
    option: tableOptionType;
  }) {
    if (option.id === 'delete') {
      this.table.actionResponse.set('ok');
      this.orderService.deleteOrder(orderId);
    }
  }
}
