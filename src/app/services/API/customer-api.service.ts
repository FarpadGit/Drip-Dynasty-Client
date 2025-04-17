import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { parseProductJSON } from '../../utils/converters';

@Injectable({
  providedIn: 'root',
})
export class CustomerAPIService extends APIService {
  async getCustomers() {
    return this.makeRequest('/customers').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps
    );
  }

  DeleteCustomer(id: string) {
    return this.makeRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}
