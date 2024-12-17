import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { asyncType, paginatedProductType, productType } from '../types';
import { ProductAPIService } from './API/product-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsSubject = new BehaviorSubject<asyncType<productType[]>>({
    isLoading: false,
    hasError: false,
    value: null,
  });

  paginationInfo: Omit<paginatedProductType, 'products'> | undefined;

  constructor(private APIService: ProductAPIService) {}

  async fetchProducts(
    query: 'all' | 'newest' | 'popular' | string = 'all',
    page?: number
  ) {
    this.productsSubject.next({
      isLoading: true,
      hasError: false,
      value: this.productsSubject.value.value,
    });

    let response,
      paginated = false;
    switch (query) {
      case 'all':
        {
          response = await this.APIService.getProducts(undefined, page);
          paginated = true;
        }
        break;
      case 'newest':
        response = await this.APIService.getNewestProducts();
        break;
      case 'popular':
        response = await this.APIService.getMostPopularProducts();
        break;
      default:
        {
          response = await this.APIService.getProducts(query, page);
          paginated = true;
        }
        break;
    }

    if (response.error) {
      this.productsSubject.next({
        isLoading: false,
        hasError: true,
        value: null,
      });
      return;
    }

    if (!paginated) {
      this.productsSubject.next({
        isLoading: false,
        hasError: false,
        value: response as productType[],
      });
    } else {
      this.paginationInfo = {
        hasNext: response.hasNext,
        hasPrev: response.hasPrev,
        totalPages: response.totalPages,
      };
      this.productsSubject.next({
        isLoading: false,
        hasError: false,
        value: response.products,
      });
    }
  }

  getProducts(query: 'all' | 'newest' | 'popular' | string, page?: number) {
    this.fetchProducts(query, page);
    return this.productsSubject;
  }

  async getProduct(id: string) {
    const response = await this.APIService.getProduct(id);
    if (response.error) return null;
    return response as productType;
  }

  async addNewProduct(
    newProduct: Omit<productType, 'id' | 'isActive' | 'createdSince'>,
    newImageFiles: File[]
  ) {
    await this.APIService.addNewProduct(newProduct, newImageFiles);
    await this.fetchProducts();
  }

  async updateProduct(
    id: string,
    newProperties: Partial<productType>,
    newImages?: { file: File; path: string }[],
    imagesToDelete?: string[]
  ) {
    // in update context images and imagePaths are for newly added files only, if they're empty then don't overwrite existing
    const shouldSaveImages = newImages != undefined && newImages.length > 0;

    const product = await this.getProduct(id);
    if (product == null) return;

    // leave out images and imagePaths from update if they're empty
    const _newProperties = {
      ...newProperties,
      imagePaths: shouldSaveImages
        ? newImages.map((img) => img.path)
        : product.imagePaths,
    };
    await this.APIService.updateProduct(
      id,
      { ...product, ..._newProperties },
      newImages?.map((img) => img.file),
      imagesToDelete
    );

    await this.fetchProducts();
  }

  async toggleProductActivation(id: string) {
    let product = await this.getProduct(id);
    if (product == null) return false;
    if (product.imagePaths.length === 0 && !product.isActive) return false;
    product.isActive = !product.isActive;
    await this.APIService.updateProduct(id, product);
    await this.fetchProducts();
    return true;
  }

  async buyProduct(product: productType, email: string, transactionId: string) {
    return await this.APIService.buyProduct(
      transactionId,
      product.id,
      email,
      product.price
    );
  }

  async deleteProduct(id: string) {
    await this.APIService.deleteProduct(id);
    await this.fetchProducts();
  }
}
