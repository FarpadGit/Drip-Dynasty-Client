import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class EmailApiService {
  constructor(private APIService: APIService) {}

  async sendOrderHistory(email: string) {
    return this.APIService.makeRequest('/email/orderHistory', {
      method: 'POST',
      data: { id: '', email, orders: [] },
    });
  }
}
