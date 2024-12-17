import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { parseProductJSON } from '../../utils/converters';

@Injectable({
  providedIn: 'root',
})
export class CustomerAPIService {
  constructor(private APIService: APIService) {}

  async getCustomers() {
    return this.APIService.makeRequest('/customers').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps
    );
  }

  DeleteCustomer(id: string) {
    return this.APIService.makeRequest(`/customers/${id}`, {
      method: 'DELETE',
    });
  }
}
