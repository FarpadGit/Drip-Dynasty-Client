import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { parseCustomerJSON } from '../../utils/converters';

@Injectable({
  providedIn: 'root',
})
export class CustomerAPIService extends APIService {
  async getCustomers() {
    return this.makeRequest('/customers').then((ps) =>
      !ps.error ? ps.map((p: any) => parseCustomerJSON(p)) : ps,
    );
  }

  DeleteCustomer(id: string) {
    return this.makeRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}
