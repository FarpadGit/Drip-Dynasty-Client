import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PaypalApiService extends APIService {
  async createOrder(productId: string) {
    return this.makeRequest('/paypal/create-order', {
      method: 'POST',
      data: { productId },
    });
  }
}
