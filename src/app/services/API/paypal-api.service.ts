import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PaypalApiService {
  constructor(private APIService: APIService) {}

  async createOrder(productId: string) {
    return this.APIService.makeRequest('/paypal/create-order', {
      method: 'POST',
      data: { productId },
    });
  }
}
