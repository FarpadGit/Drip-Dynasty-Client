import { Injectable, signal } from '@angular/core';
import { asyncType, orderType } from '../types';
import { OrderAPIService } from './API/order-api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSignal = signal<asyncType<orderType[]>>({
    isLoading: false,
    hasError: false,
    value: null,
  });

  constructor(private APIService: OrderAPIService) {}

  async fetchOrders() {
    this.ordersSignal.update((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const response = await this.APIService.getOrders();

    if (!response.error) {
      this.ordersSignal.set({
        isLoading: false,
        hasError: false,
        value: response as orderType[],
      });
    } else {
      this.ordersSignal.set({
        isLoading: false,
        hasError: true,
        value: null,
      });
    }
  }

  getOrders() {
    return this.ordersSignal();
  }

  async deleteOrder(id: string) {
    await this.APIService.DeleteOrder(id);
    await this.fetchOrders();
  }
}
