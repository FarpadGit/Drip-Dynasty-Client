import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import {
  parseProductJSON,
  productToFormData,
  orderToFormData,
  parsePaginatedProductJSON,
} from '../../utils/converters';

@Injectable({
  providedIn: 'root',
})
export class ProductAPIService extends APIService {
  async getProducts(filters?: productFiltersType) {
    let queryParams = [];
    if (filters?.category) queryParams.push(`category=${filters.category}`);
    if (filters?.priceMin) queryParams.push(`priceMin=${filters.priceMin}`);
    if (filters?.priceMax) queryParams.push(`priceMax=${filters.priceMax}`);
    if (filters?.tags) {
      filters.tags.forEach((tag) =>
        queryParams.push(
          encodeURI('tags[]=') + encodeURIComponent(JSON.stringify(tag)),
        ),
      );

      // arrays can be passed as query parameters but single item arrays are parsed incorrectly if they contain a comma (as in JSON strings)
      // adding a second empty value to the param list forces the server to parse correctly and manually filter out the empty
      if (filters.tags.length === 1) queryParams.push(encodeURI('tags[]='));
    }
    if (filters?.sort)
      queryParams.push(`sortBy=${filters.sort.by}.${filters.sort.order}`);
    if (filters?.page) queryParams.push(`page=${filters.page}`);

    const query = queryParams.length === 0 ? '' : '?' + queryParams.join('&');

    return this.makeRequest(`/products` + query).then((ps) =>
      !ps.error ? parsePaginatedProductJSON(ps) : ps,
    );
  }

  async getNewestProducts() {
    return this.makeRequest('/products/newest').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps,
    );
  }

  async getMostPopularProducts() {
    return this.makeRequest('/products/most-popular').then((ps) =>
      !ps.error ? ps.map((p: any) => parseProductJSON(p)) : ps,
    );
  }

  async getProduct(id: string) {
    return this.makeRequest(`/products/${id}`).then((p) =>
      !p.error ? parseProductJSON(p) : p,
    );
  }

  async getProductBySlug(slug: string) {
    return this.makeRequest(`/products/by-slug/${slug}`).then((p) =>
      !p.error ? parseProductJSON(p) : p,
    );
  }

  addNewProduct(
    newProduct: Omit<productType, 'id' | 'isActive' | 'createdSince'>,
    newImages: File[],
  ) {
    const formData = productToFormData({
      ...newProduct,
      id: '',
      isActive: false,
      orders: [],
      createdSince: 0,
    });

    newImages.forEach((img) => formData.append('imageFiles[]', img));

    return this.makeFormRequest('/products', 'POST', formData);
  }

  updateProduct(
    id: string,
    product: productType,
    newImages?: File[],
    imagesToDelete?: string[],
  ) {
    const formData = productToFormData(product);

    newImages?.forEach((img) => formData.append('imageFiles[]', img));
    imagesToDelete?.forEach((img) => formData.append('imagesToDelete[]', img));

    return this.makeFormRequest(`/products/${id}`, 'PUT', formData);
  }

  buyProduct(
    transactionId: string,
    productId: string,
    productName: string,
    email: string,
    pricePaid: number,
    variants?: orderType['variants'],
  ) {
    const formData = orderToFormData({
      productId,
      productName,
      customerEmail: email,
      pricePaid,
      variants,
    });

    return this.makeFormRequest(
      `/paypal/purchase/${transactionId}`,
      'POST',
      formData,
    );
  }

  deleteProduct(id: string) {
    return this.makeRequest(`/products/${id}`, { method: 'DELETE' });
  }

  getAllSearchTags() {
    return this.makeRequest('/products/searchtags');
  }
}
