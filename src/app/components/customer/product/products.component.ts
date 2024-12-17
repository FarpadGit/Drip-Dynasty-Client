import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from '../../UI/product-card/product-card.component';
import { SectionHeadComponent } from '../../UI/section-head.component';
import { BigSpinnerComponent } from '../../UI/spinner/spinner.component';
import { NavButtonComponent } from '../../UI/nav-button.component';
import { debounce } from '../../../utils/debounce';
import { asyncType, productType } from '../../../types';
import { NgPluralizeService, NgPluralizeModule } from 'ng-pluralize';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    NgPluralizeModule,
    ProductCardComponent,
    SectionHeadComponent,
    BigSpinnerComponent,
    NavButtonComponent,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnDestroy {
  activeProducts: asyncType<productType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };
  currentUrl!: string;
  category: string | null = null;
  page: number = 0;

  routeParamSub: Subscription | null;
  queryParamSub: Subscription | null;
  productSub: Subscription | null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private pluralize: NgPluralizeService
  ) {
    let firstRun = true;

    this.routeParamSub = this.route.paramMap.subscribe((params) => {
      this.currentUrl = this.router.url.split('?')[0];
      this.category = params.get('category');
      // route params and query params are in a race condition to update the product list as both can change independently
      // debouncing the update with a delay of 0 (basically delaying it to the next change detection cycle) seems to remedy this.
      debounce(() => this.fetchProducts(), 0);
    });

    this.queryParamSub = this.route.queryParamMap.subscribe((query) => {
      this.currentUrl = this.router.url.split('?')[0];
      this.page = parseInt(query.get('page') || '0');

      debounce(() => this.fetchProducts(), 0);
    });

    this.productSub = this.productService.productsSubject.subscribe(
      (products) => {
        if (firstRun) return;

        this.activeProducts = {
          isLoading: products.isLoading,
          hasError: products.hasError,
          value: products.value?.filter((p) => p.isActive) ?? null,
        };
        if (this.activeProducts.value?.length === 0)
          this.router.navigate([], { queryParams: null });
      }
    );

    firstRun = false;
  }

  fetchProducts() {
    this.productService.getProducts(this.category ?? 'all', this.page);
  }

  ngOnDestroy(): void {
    this.routeParamSub?.unsubscribe();
    this.queryParamSub?.unsubscribe();
    this.productSub?.unsubscribe();
  }

  get isLoading() {
    return this.activeProducts.isLoading;
  }

  get hasError() {
    return this.activeProducts.hasError;
  }

  get hasPrev() {
    return this.productService.paginationInfo?.hasPrev;
  }

  get hasNext() {
    return this.productService.paginationInfo?.hasNext;
  }

  get pages() {
    const totalPages = this.productService.paginationInfo?.totalPages;
    if (totalPages == undefined) return [];
    return Array(totalPages)
      .fill(0)
      .map((_, i) => i);
  }

  plural(noun: string | null | undefined) {
    if (!noun) return null;
    if (noun === 'men' || noun === 'women') return noun + "'s selection";
    if (this.pluralize.isPlural(noun)) return noun;
    return this.pluralize.pluralize(noun);
  }
}
