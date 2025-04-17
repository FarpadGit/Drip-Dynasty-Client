import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { parseProductJSON } from '../../utils/converters';

@Injectable({
  providedIn: 'root',
})
export class OrderAPIService extends APIService {
  async getOrders() {
    return this.makeRequest('/orders').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps
    );
  }

  DeleteOrder(id: string) {
    return this.makeRequest(`/orders/${id}`, { method: 'DELETE' });
  }
}
