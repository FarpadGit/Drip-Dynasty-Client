import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { ProductAPIService } from './API/product-api.service';
import {
  mockNewestProducts,
  mockPopularProducts,
  mockProducts,
  mockPaginatedProductsPage1,
  mockPaginatedProductsPage2,
  mockOrderWithVariant,
  mockSearchTags,
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
      'getProductBySlug',
      'getNewestProducts',
      'getMostPopularProducts',
      'addNewProduct',
      'updateProduct',
      'buyProduct',
      'deleteProduct',
      'getAllSearchTags',
    ]);

    apiSpy.getProducts.withArgs().and.resolveTo(paginatedResponsePage1);
    apiSpy.getProducts
      .withArgs({ page: 2 })
      .and.resolveTo(paginatedResponsePage2);
    apiSpy.getProducts
      .withArgs({ category: 'some category' })
      .and.resolveTo(paginatedResponseforCategory);
    apiSpy.getProduct.withArgs('productID1').and.resolveTo({ ...mockProduct });
    apiSpy.getProduct
      .withArgs('badProductID')
      .and.resolveTo({ error: 'error' });
    apiSpy.getProductBySlug.withArgs('productSlug1').and.resolveTo(mockProduct);
    apiSpy.getNewestProducts.and.resolveTo(mockNewestProducts);
    apiSpy.getMostPopularProducts.and.resolveTo(mockPopularProducts);
    apiSpy.getAllSearchTags.and.resolveTo(mockSearchTags);

    TestBed.configureTestingModule({
      providers: [{ provide: ProductAPIService, useValue: apiSpy }],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should return a list of products after fetching from service', () => {
    it('if no filters are provided', async () => {
      await service.fetchProducts();

      expect(service.getProducts()).toEqual({
        value: paginatedResponsePage1.products,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getProducts).toHaveBeenCalled();
    });

    it('if "page" is 2', async () => {
      await service.fetchProducts({ page: 2 });

      expect(service.getProducts()).toEqual({
        value: paginatedResponsePage2.products,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getProducts).toHaveBeenCalled();
    });

    it('if query is "newest"', async () => {
      await service.fetchProducts('newest');

      expect(service.getProducts()).toEqual({
        value: mockNewestProducts,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getNewestProducts).toHaveBeenCalled();
    });

    it('if query is "popular"', async () => {
      await service.fetchProducts('popular');

      expect(service.getProducts()).toEqual({
        value: mockPopularProducts,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getMostPopularProducts).toHaveBeenCalled();
    });

    it('if filter has a category string', async () => {
      await service.fetchProducts({ category: 'some category' });

      expect(service.getProducts()).toEqual({
        value: paginatedResponseforCategory.products,
        isLoading: false,
        hasError: false,
      });
      expect(apiSpy.getProducts).toHaveBeenCalled();
    });
  });

  it('should return a single product by ID', async () => {
    const response = await service.getProduct('productID1');

    expect(response).toEqual(mockProduct);
    expect(apiSpy.getProduct).toHaveBeenCalled();
  });

  it('should return a single product by slug', async () => {
    const response = await service.getProductBySlug('productSlug1');

    expect(response).toEqual(mockProduct);
    expect(apiSpy.getProductBySlug).toHaveBeenCalled();
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
      [mockProduct.imagePaths[0]],
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
      [mockProduct.imagePaths[0]],
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
      'transactionID',
      mockOrderWithVariant.variants,
    );

    expect(apiSpy.buyProduct).toHaveBeenCalledOnceWith(
      'transactionID',
      mockProduct.id,
      mockProduct.name,
      'customer@email.com',
      mockProduct.price,
      mockOrderWithVariant.variants,
    );
  });

  it('should call deleteProduct if product is being deleted', async () => {
    await service.deleteProduct('some ID');

    expect(apiSpy.deleteProduct).toHaveBeenCalledOnceWith('some ID');
  });

  it('should call getAllSearchTags if product search tags are being requested', async () => {
    const response = await service.getAllSearchTags();

    expect(response).toEqual({
      searchTags: jasmine.any(Array<productType['searchTags']>),
      maxPrice: jasmine.any(Number),
    });
    expect(apiSpy.getAllSearchTags).toHaveBeenCalled();
  });

  it('should correctly calculate if a given product is out of stock', () => {
    const response1 = ProductService.isOutOfStock({
      ...mockProduct,
      defaultStock: 0,
    });
    const response2 = ProductService.isOutOfStock({
      ...mockProduct,
      defaultStock: 10,
    });
    const response3 = ProductService.isOutOfStock({
      ...mockProduct,
      defaultStock: 10,
      variants: [
        { groupName: '', type: 'text', variants: [{ name: '', stock: 0 }] },
      ],
    });
    const response4 = ProductService.isOutOfStock({
      ...mockProduct,
      defaultStock: 0,
      variants: [
        { groupName: '', type: 'text', variants: [{ name: '', stock: 10 }] },
      ],
    });

    expect(response1).toBeTrue();
    expect(response2).toBeFalse();
    expect(response3).toBeTrue();
    expect(response4).toBeFalse();
  });
});
