import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { productType } from '../../types';
import {
  parseProductJSON,
  productToFormData,
  orderToFormData,
  parsePaginatedProductJSON,
} from '../../utils/converters';

@Injectable({
  providedIn: 'root',
})
export class ProductAPIService {
  constructor(private APIService: APIService) {}

  async getProducts(category?: string, page?: number) {
    const q1 = category !== undefined ? `category=${category}` : null;
    const q2 = page !== undefined ? `page=${page}` : null;
    let query = '?' + [q1, q2].filter((q) => q).join('&');
    if (query === '?') query = '';

    return this.APIService.makeRequest(`/products` + query).then((ps) =>
      !ps.error ? parsePaginatedProductJSON(ps) : ps
    );
  }

  async getNewestProducts() {
    return this.APIService.makeRequest('/products/newest').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps
    );
  }

  async getMostPopularProducts() {
    return this.APIService.makeRequest('/products/mostPopular').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps
    );
  }

  async getProduct(id: string) {
    return this.APIService.makeRequest(`/products/${id}`).then((p) =>
      !p.error ? parseProductJSON(p) : p
    );
  }

  addNewProduct(
    newProduct: Omit<productType, 'id' | 'isActive' | 'createdSince'>,
    newImages: File[]
  ) {
    const formData = productToFormData({
      ...newProduct,
      id: '',
      isActive: false,
      orders: [],
      createdSince: 0,
    });

    newImages.forEach((img) => formData.append('imageFiles[]', img));

    return this.APIService.makeFormRequest('/products', 'POST', formData);
  }

  updateProduct(
    id: string,
    product: productType,
    newImages?: File[],
    imagesToDelete?: string[]
  ) {
    const formData = productToFormData(product);

    newImages?.forEach((img) => formData.append('imageFiles[]', img));
    imagesToDelete?.forEach((img) => formData.append('imagesToDelete[]', img));

    return this.APIService.makeFormRequest(`/products/${id}`, 'PUT', formData);
  }

  buyProduct(
    transactionId: string,
    productId: string,
    email: string,
    pricePaid: number
  ) {
    const formData = orderToFormData({
      productId,
      customerEmail: email,
      pricePaid,
    });

    return this.APIService.makeFormRequest(
      `/paypal/purchase/${transactionId}`,
      'POST',
      formData
    );
  }

  deleteProduct(id: string) {
    return this.APIService.makeRequest(`/products/${id}`, { method: 'DELETE' });
  }
}
