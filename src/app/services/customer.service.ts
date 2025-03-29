import { Injectable, signal } from '@angular/core';
import { asyncType, customerType } from '../types';
import { CustomerAPIService } from './API/customer-api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private customersSignal = signal<asyncType<customerType[]>>({
    isLoading: false,
    hasError: false,
    value: null,
  });

  constructor(private APIService: CustomerAPIService) {}

  async fetchCustomers() {
    this.customersSignal.update((prev) => ({
      ...prev,
      isLoading: true,
    }));

    const response = await this.APIService.getCustomers();

    if (!response.error) {
      this.customersSignal.set({
        isLoading: false,
        hasError: false,
        value: response as customerType[],
      });
    } else {
      this.customersSignal.set({
        isLoading: false,
        hasError: true,
        value: null,
      });
    }
  }

  getCustomers() {
    return this.customersSignal();
  }

  async deleteCustomer(id: string) {
    await this.APIService.DeleteCustomer(id);
    await this.fetchCustomers();
  }
}
