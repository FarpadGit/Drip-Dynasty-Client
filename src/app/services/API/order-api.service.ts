import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { parseProductJSON } from '../../utils/converters';

@Injectable({
  providedIn: 'root',
})
export class OrderAPIService {
  constructor(private APIService: APIService) {}

  async getOrders() {
    return this.APIService.makeRequest('/orders').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps
    );
  }

  DeleteOrder(id: string) {
    return this.APIService.makeRequest(`/orders/${id}`, { method: 'DELETE' });
  }
}
