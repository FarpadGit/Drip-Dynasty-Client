import { Component, effect, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import {
  TableComponent,
  tableIconsType,
  tableOptionType,
  tableRowType,
} from '../../UI/table/table.component';
import { NavButtonComponent } from '../../UI/nav-button.component';
import { HeaderDirective } from '../../../directives/UI/header.directive';
import { formatCurrency } from '../../../utils/formatters';
import { asyncType, productType } from '../../../types';
import { featherCheck, featherSlash } from '@ng-icons/feather-icons';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [HeaderDirective, NavButtonComponent, TableComponent],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  @ViewChild('table') table!: TableComponent;
  private products: asyncType<productType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };

  productTableCells: tableRowType[] = [];

  constructor(private productService: ProductService, private router: Router) {
    this.productService.fetchProducts('all');

    effect(() => {
      const products = productService.getProducts();
      this.products.hasError = products.hasError;
      this.products.isLoading = products.isLoading;
      this.products.value = products.value ? [...products.value] : [];
      this.products.value?.sort((a, b) => a.createdSince - b.createdSince);

      this.productTableCells = this.calculateProductTableCells();
    });
  }

  get isLoading() {
    return this.products.isLoading;
  }

  get hasError() {
    return this.products.hasError;
  }

  get headers() {
    return [
      { label: 'Active', width: 15 },
      { label: 'Name', width: 45 },
      { label: 'Price', width: 15 },
      { label: 'Discount', width: 5 },
      { label: 'Orders', width: 15 },
    ];
  }

  get icons() {
    const icon1: tableIconsType = {
      svg: featherCheck,
      color: 'green',
    };
    const icon2: tableIconsType = {
      svg: featherSlash,
      color: 'red',
    };
    return [icon1, icon2];
  }

  calculateProductTableCells() {
    if (!this.products.value) return [];
    return this.products.value.map((product) => {
      return {
        id: product.id,
        cells: [
          product.isActive ? 'ICON0' : 'ICON1',
          product.name,
          formatCurrency(product.price),
          product.discount > 0 ? formatCurrency(product.discount) : '',
          product.orders?.length || 0,
        ],
        options: this.getProductOptions(product),
      } as tableRowType;
    });
  }

  getProductOptions(product: productType) {
    if (!product) return [];
    const options = [
      'edit',
      {
        id: 'toggleActivate',
        label: product.isActive ? 'deactivate' : 'activate',
      },
      {
        id: 'delete',
        label: 'delete',
        styles: 'text-destructive',
      },
    ] as tableOptionType[];
    return options.filter((o) => o);
  }

  handleSelectedOption({
    itemId: productId,
    option,
  }: {
    itemId: string;
    option: tableOptionType;
  }) {
    if (option.id === 'edit') {
      this.table.actionResponse.set('ok');
      this.router.navigate([`admin/products/${productId}/edit`]);
    }
    if (option.id === 'toggleActivate') {
      this.tryToggleProduct(productId, option);
    }
    if (option.id === 'delete') {
      this.table.actionResponse.set('ok');
      this.productService.deleteProduct(productId);
    }
  }

  async tryToggleProduct(productId: string, option: tableOptionType) {
    const canToggle = await this.productService.toggleProductActivation(
      productId
    );
    if (canToggle) this.table.actionResponse.set('ok');
    else option.error = 'You cannot activate a product with no images';
  }
}
