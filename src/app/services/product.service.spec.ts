import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { ProductAPIService } from './API/product-api.service';
import {
  mockNewestProducts,
  mockPopularProducts,
  mockProducts,
  mockPaginatedProductsPage1,
  mockPaginatedProductsPage2,
} from '../../test/mocks';

describe('ProductService', () => {
  let service: ProductService;
  let apiSpy: jasmine.SpyObj<ProductAPIService>;
  const paginatedResponsePage1 = {
    hasNext: true,
    hasPrev: false,
    totalPages: 2,
    products: mockPaginatedProductsPage1,
  };
  const paginatedResponsePage2 = {
    hasNext: false,
    hasPrev: true,
    totalPages: 2,
    products: mockPaginatedProductsPage2,
  };
  const paginatedResponseforCategory = {
    hasNext: false,
    hasPrev: false,
    totalPages: 1,
    products: mockProducts,
  };
  const mockProduct = mockProducts[0];

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('ProductAPIService', [
      'getProducts',
      'getProduct',
      'getNewestProducts',
      'getMostPopularProducts',
      'addNewProduct',
      'updateProduct',
      'buyProduct',
      'deleteProduct',
    ]);

    apiSpy.getProducts
      .withArgs(undefined, undefined)
      .and.resolveTo(paginatedResponsePage1);
    apiSpy.getProducts
      .withArgs(undefined, 2)
      .and.resolveTo(paginatedResponsePage2);
    apiSpy.getProducts
      .withArgs('some category', undefined)
      .and.resolveTo(paginatedResponseforCategory);
    apiSpy.getProduct.withArgs('productID1').and.resolveTo({ ...mockProduct });
    apiSpy.getProduct
      .withArgs('badProductID')
      .and.resolveTo({ error: 'error' });
    apiSpy.getNewestProducts.and.resolveTo(mockNewestProducts);
    apiSpy.getMostPopularProducts.and.resolveTo(mockPopularProducts);

    TestBed.configureTestingModule({
      providers: [{ provide: ProductAPIService, useValue: apiSpy }],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should return list of products after fetching from service', () => {
    it('if "page" is undefined', async () => {
      await service.fetchProducts();

      expect(service.getProducts()).toEqual({
        value: paginatedResponsePage1.products,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getProducts).toHaveBeenCalled();
    });

    it('if "page" is 2', async () => {
      await service.fetchProducts(undefined, 2);

      expect(service.getProducts()).toEqual({
        value: paginatedResponsePage2.products,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getProducts).toHaveBeenCalled();
    });

    it('if "query" is "newest"', async () => {
      await service.fetchProducts('newest');

      expect(service.getProducts()).toEqual({
        value: mockNewestProducts,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getNewestProducts).toHaveBeenCalled();
    });

    it('if "query" is "popular"', async () => {
      await service.fetchProducts('popular');

      expect(service.getProducts()).toEqual({
        value: mockPopularProducts,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getMostPopularProducts).toHaveBeenCalled();
    });

    it('if "query" is a category string', async () => {
      await service.fetchProducts('some category');

      expect(service.getProducts()).toEqual({
        value: paginatedResponseforCategory.products,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getProducts).toHaveBeenCalled();
    });
  });

  it('should return single product after fetching from service', async () => {
    const response = await service.getProduct('productID1');

    expect(response).toEqual(mockProduct);
    expect(apiSpy.getProduct).toHaveBeenCalled();
  });

  it('should call addProduct if new product is added', async () => {
    await service.addNewProduct(mockProduct, []);

    expect(apiSpy.addNewProduct).toHaveBeenCalled();
  });

  it('should call updateProduct with updated values if a product is being updated', async () => {
    const newFile = new File([], 'newFile.jpg');
    await service.updateProduct(
      'productID1',
      {
        name: 'New Name',
        discount: 999,
      },
      [{ file: newFile, path: 'newFile.jpg' }],
      [mockProduct.imagePaths[0]]
    );

    expect(apiSpy.updateProduct).toHaveBeenCalledOnceWith(
      'productID1',
      {
        ...mockProduct,
        name: 'New Name',
        discount: 999,
        imagePaths: ['newFile.jpg'],
      },
      [newFile],
      [mockProduct.imagePaths[0]]
    );
  });

  it('should call updateProduct with new isActive state if a valid product is being toggled', async () => {
    const oldIsActive = mockProduct.isActive;
    await service.toggleProductActivation('productID1');

    expect(apiSpy.updateProduct).toHaveBeenCalledOnceWith('productID1', {
      ...mockProduct,
      isActive: !oldIsActive,
    });
  });

  it('should not call updateProduct if an invalid product is being toggled', async () => {
    await service.toggleProductActivation('badProductID');

    expect(apiSpy.updateProduct).not.toHaveBeenCalled();
  });

  it('should call buyProduct if product is being purchased', async () => {
    await service.buyProduct(
      mockProduct,
      'customer@email.com',
      'transactionID'
    );

    expect(apiSpy.buyProduct).toHaveBeenCalledOnceWith(
      'transactionID',
      mockProduct.id,
      'customer@email.com',
      mockProduct.price
    );
  });

  it('should call deleteProduct if product is being deleted', async () => {
    await service.deleteProduct('some ID');

    expect(apiSpy.deleteProduct).toHaveBeenCalledOnceWith('some ID');
  });
});
