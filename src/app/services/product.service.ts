import { Injectable, signal } from '@angular/core';
import { ProductAPIService } from './API/product-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsSignal = signal<asyncType<productType[]>>({
    isLoading: false,
    hasError: false,
    value: null,
  });
  private filtersSignal = signal<productFiltersType>({
    priceMin: undefined,
    priceMax: undefined,
    category: undefined,
    tags: undefined,
  });

  paginationInfo: Omit<paginatedProductType, 'products'> | undefined;

  constructor(private APIService: ProductAPIService) {}

  async fetchProducts(
    filter: 'all' | 'newest' | 'popular' | productFiltersType = 'all',
  ) {
    this.productsSignal.update((prev) => ({
      ...prev,
      isLoading: true,
      hasError: false,
    }));

    let response,
      paginated = false;
    switch (filter) {
      case 'all':
        {
          response = await this.APIService.getProducts();
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
          response = await this.APIService.getProducts(filter);
          paginated = true;
        }
        break;
    }

    if (response.error) {
      this.productsSignal.set({
        isLoading: false,
        hasError: true,
        value: null,
      });
      return;
    }

    if (!paginated) {
      this.productsSignal.set({
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
      this.productsSignal.set({
        isLoading: false,
        hasError: false,
        value: response.products,
      });
    }
  }

  getProducts() {
    return this.productsSignal();
  }

  async getProduct(id: string) {
    const response = await this.APIService.getProduct(id);
    if (response.error) return null;
    return response as productType;
  }

  async getProductBySlug(slug: string) {
    const response = await this.APIService.getProductBySlug(slug);
    if (response.error) return null;
    return response as productType;
  }

  async addNewProduct(
    newProduct: Omit<productType, 'id' | 'isActive' | 'createdSince'>,
    newImageFiles: File[],
  ) {
    await this.APIService.addNewProduct(newProduct, newImageFiles);
    await this.fetchProducts();
  }

  async updateProduct(
    id: string,
    newProperties: Partial<productType>,
    newImages?: { file: File; path: string }[],
    imagesToDelete?: string[],
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
      imagesToDelete,
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

  async buyProduct(
    product: productType,
    email: string,
    transactionId: string,
    variants?: orderType['variants'],
  ) {
    return await this.APIService.buyProduct(
      transactionId,
      product.id,
      product.name,
      email,
      product.price,
      variants,
    );
  }

  async deleteProduct(id: string) {
    await this.APIService.deleteProduct(id);
    await this.fetchProducts();
  }

  getProductFilters() {
    if (Object.values(this.filtersSignal()).filter((f) => f).length === 0)
      return undefined;
    return this.filtersSignal();
  }

  setProductFilters(newFilters: Partial<productFiltersType>) {
    this.filtersSignal.update((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }

  async getAllSearchTags() {
    const response = await this.APIService.getAllSearchTags();
    if (response.error) return null;
    return response as {
      searchTags: NonNullable<productType['searchTags']>;
      maxPrice: number;
    };
  }

  static isOutOfStock(product: productType) {
    if (!product.variants || product.variants.length === 0)
      return product.defaultStock === 0;
    else {
      for (let variantGroup of product.variants) {
        for (let variant of variantGroup.variants) {
          if (variant.stock > 0) return false;
        }
      }
      return true;
    }
  }
}
