import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class EmailApiService extends APIService {
  async sendOrderHistory(email: string) {
    return this.makeRequest('/email/orderHistory', {
      method: 'POST',
      data: { id: '', email, orders: [] },
    });
  }
}
