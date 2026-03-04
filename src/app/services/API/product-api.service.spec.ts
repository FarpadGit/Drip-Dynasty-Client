import { TestBed } from '@angular/core/testing';

import { ProductAPIService } from './product-api.service';
import { EnvService } from '../env.service';
import {
  mockNewestProducts,
  mockNewProduct,
  mockPopularProducts,
  mockProducts,
  mockPaginatedProductsPage1,
  mockPaginatedProductsPage2,
  mockSearchTags,
} from '../../../test/mocks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('ProductAPIService', () => {
  let service: ProductAPIService;
  let mockAxios: MockAdapter;

  const mapToServer = (product: productType) => ({
    ...product,
    variants: product.variants?.map((variant) => JSON.stringify(variant)) || [],
    searchTags: product.searchTags?.map((tag) => JSON.stringify(tag)) || [],
    discount: product.discount.toString(),
    isActive: product.isActive ? 'true' : 'false',
    price: product.price.toString(),
  });

  const withAllFields = (product: productType) => ({
    ...product,
    variants: product.variants ?? [],
    searchTags: product.searchTags ?? [],
  });

  const mockProductsResponse1 = mockPaginatedProductsPage1.map(mapToServer);
  const mockProductsResponse2 = mockPaginatedProductsPage2.map(mapToServer);
  const mockProductsResponse3 = mockProducts.map(mapToServer);

  const mockPaginatedProductsResponse = (response: any[]) => ({
    products: response,
    hasNext: true,
    hasPrev: false,
    totalPages: 2,
  });
  const mockProductsResponse = (response: productType[]) =>
    response.map((product) => mapToServer(product));
  const mockProductResponse = mapToServer(mockNewProduct);

  beforeAll(() => {
    mockAxios = new MockAdapter(axios);
  });

  beforeEach(() => {
    mockAxios.reset();
    mockAxios
      .onGet('/products')
      .reply(200, mockPaginatedProductsResponse(mockProductsResponse1))
      .onGet('/products?category=category1&priceMax=1000&page=2')
      .reply(200, mockPaginatedProductsResponse(mockProductsResponse2))
      .onGet(
        '/products?' +
          encodeURI('tags[]=') +
          encodeURIComponent('{"name":"mockTag1","value":"mockValue"}') +
          encodeURI('&tags[]=&sortBy=date.ASC'),
      )
      .reply(200, mockPaginatedProductsResponse(mockProductsResponse3))
      .onGet('/products/newest')
      .reply(200, mockProductsResponse(mockNewestProducts))
      .onGet('/products/most-popular')
      .reply(200, mockProductsResponse(mockPopularProducts))
      .onGet('/products/product1ID')
      .reply(200, mockProductResponse)
      .onGet('/products/by-slug/product1Slug')
      .reply(200, mockProductResponse)
      .onPost('/products')
      .reply(201, 'create called')
      .onPut('/products/product1ID')
      .reply(200, 'update called')
      .onDelete('/products/product1ID')
      .reply(204, 'delete called')
      .onPost('/paypal/purchase/transactionID')
      .reply(200, 'paypal purchase called')
      .onGet('/products/searchtags')
      .reply(200, mockSearchTags.searchTags);

    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    TestBed.configureTestingModule({
      providers: [{ provide: EnvService, useValue: envSpy }],
    });
    service = TestBed.inject(ProductAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', async () => {
    const response = await service.getProducts();

    expect(response.products).toEqual(
      mockPaginatedProductsPage1.map(withAllFields),
    );
  });

  it('should get all products with a given set of filters', async () => {
    const response = await service.getProducts({
      category: 'category1',
      priceMax: 1000,
      page: 2,
    });

    expect(response.products).toEqual(
      mockPaginatedProductsPage2.map(withAllFields),
    );
  });

  it('should get all products with a given set of filters in JSON format', async () => {
    const response = await service.getProducts({
      tags: [{ name: 'mockTag1', value: 'mockValue' }],
      sort: { by: 'date', order: 'ASC' },
    });

    expect(response.products).toEqual(mockProducts.map(withAllFields));
  });

  it('should get newest products', async () => {
    const response = await service.getNewestProducts();

    expect(response).toEqual(mockNewestProducts.map(withAllFields));
  });

  it('should get most popular products', async () => {
    const response = await service.getMostPopularProducts();

    expect(response).toEqual(mockPopularProducts.map(withAllFields));
  });

  it('should get product with id', async () => {
    const response = await service.getProduct('product1ID');

    expect(response).toEqual(withAllFields(mockNewProduct));
  });

  it('should get product with slug', async () => {
    const response = await service.getProductBySlug('product1Slug');

    expect(response).toEqual(withAllFields(mockNewProduct));
  });

  it('should make a call to add new product', async () => {
    const mockNewProduct = {
      name: 'New Product',
      slug: 'new-product',
      description: 'description',
      discount: 0,
      imagePaths: [],
      price: 100,
      stock: 10,
    };

    const response = await service.addNewProduct(mockNewProduct, []);

    expect(response).toBe('create called');
  });

  it('should make a call to update existing product', async () => {
    const mockUpdatedProduct = {
      ...mockProducts[0],
      name: 'updated Name',
    };

    const response = await service.updateProduct(
      'product1ID',
      mockUpdatedProduct,
    );

    expect(response).toBe('update called');
  });

  it('should make a call to buy product', async () => {
    const response = await service.buyProduct(
      'transactionID',
      'product1ID',
      'Product 1',
      'customer@email.com',
      1,
    );

    expect(response).toBe('paypal purchase called');
  });

  it('should make a call to delete product', async () => {
    const response = await service.deleteProduct('product1ID');

    expect(response).toBe('delete called');
  });

  it('should get all product search tags', async () => {
    const response = await service.getAllSearchTags();

    expect(response).toEqual(mockSearchTags.searchTags);
  });
});
