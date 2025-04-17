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
} from '../../../test/mocks';
import { productType } from '../../types';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('ProductAPIService', () => {
  let service: ProductAPIService;
  let mockAxios: MockAdapter;

  const mapToServer = (product: productType) => ({
    ...product,
    discount: product.discount.toString(),
    isActive: product.isActive ? 'true' : 'false',
    price: product.price.toString(),
  });

  const productsResponsePage1 = mockPaginatedProductsPage1.map(mapToServer);
  const productsResponsePage2 = mockPaginatedProductsPage2.map(mapToServer);
  const productsResponseWithCategory = mockProducts.map(mapToServer);

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
      .reply(200, mockPaginatedProductsResponse(productsResponsePage1))
      .onGet('/products?page=2')
      .reply(200, mockPaginatedProductsResponse(productsResponsePage2))
      .onGet('/products?category=category1')
      .reply(200, mockPaginatedProductsResponse(productsResponseWithCategory))
      .onGet('/products/newest')
      .reply(200, mockProductsResponse(mockNewestProducts))
      .onGet('/products/mostPopular')
      .reply(200, mockProductsResponse(mockPopularProducts))
      .onGet('/products/product1ID')
      .reply(200, mockProductResponse)
      .onPost('/products')
      .reply(201, 'create called')
      .onPut('/products/product1ID')
      .reply(200, 'update called')
      .onDelete('/products/product1ID')
      .reply(204, 'delete called')
      .onPost('/paypal/purchase/transactionID')
      .reply(200, 'paypal purchase called');

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

    expect(response.products).toEqual(mockPaginatedProductsPage1);
  });

  it('should get all products on page 2', async () => {
    const response = await service.getProducts(undefined, 2);

    expect(response.products).toEqual(mockPaginatedProductsPage2);
  });

  it('should get all products with given category', async () => {
    const response = await service.getProducts('category1');

    expect(response.products).toEqual(mockProducts);
  });

  it('should get newest products', async () => {
    const response = await service.getNewestProducts();

    expect(response).toEqual(mockNewestProducts);
  });

  it('should get most popular products', async () => {
    const response = await service.getMostPopularProducts();

    expect(response).toEqual(mockPopularProducts);
  });

  it('should get product with id', async () => {
    const response = await service.getProduct('product1ID');

    expect(response).toEqual(mockNewProduct);
  });

  it('should make a call to add new product', async () => {
    const mockNewProduct = {
      name: 'New Product',
      description: 'description',
      discount: 0,
      imagePaths: [],
      price: 100,
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
      mockUpdatedProduct
    );

    expect(response).toBe('update called');
  });

  it('should make a call to buy product', async () => {
    const response = await service.buyProduct(
      'transactionID',
      'product1ID',
      'customer@email.com',
      1
    );

    expect(response).toBe('paypal purchase called');
  });

  it('should make a call to delete product', async () => {
    const response = await service.deleteProduct('product1ID');

    expect(response).toBe('delete called');
  });
});
