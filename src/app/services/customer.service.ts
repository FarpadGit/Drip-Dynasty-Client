import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { asyncType, customerType } from '../types';
import { CustomerAPIService } from './API/customer-api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersSubject = new BehaviorSubject<asyncType<customerType[]>>({
    isLoading: false,
    hasError: false,
    value: null,
  });

  constructor(private APIService: CustomerAPIService) {}

  async fetchCustomers() {
    this.customersSubject.next({
      ...this.customersSubject.value,
      isLoading: true,
    });

    const response = await this.APIService.getCustomers();

    if (!response.error) {
      this.customersSubject.next({
        isLoading: false,
        hasError: false,
        value: response as customerType[],
      });
    } else {
      this.customersSubject.next({
        isLoading: false,
        hasError: true,
        value: null,
      });
    }
  }

  getCustomers() {
    this.fetchCustomers();
    return this.customersSubject;
  }

  async deleteCustomer(id: string) {
    await this.APIService.DeleteCustomer(id);
    await this.fetchCustomers();
  }
}
