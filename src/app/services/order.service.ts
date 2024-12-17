import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { asyncType, orderType } from '../types';
import { OrderAPIService } from './API/order-api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<asyncType<orderType[]>>({
    isLoading: false,
    hasError: false,
    value: null,
  });

  constructor(private APIService: OrderAPIService) {}

  async fetchOrders() {
    this.ordersSubject.next({
      ...this.ordersSubject.value,
      isLoading: true,
    });

    const response = await this.APIService.getOrders();

    if (!response.error) {
      this.ordersSubject.next({
        isLoading: false,
        hasError: false,
        value: response as orderType[],
      });
    } else {
      this.ordersSubject.next({
        isLoading: false,
        hasError: true,
        value: null,
      });
    }
  }

  getOrders() {
    this.fetchOrders();
    return this.ordersSubject;
  }

  async deleteOrder(id: string) {
    await this.APIService.DeleteOrder(id);
    await this.fetchOrders();
  }
}
