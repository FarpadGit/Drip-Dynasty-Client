import { Component, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { FiltersComponent } from './filters/filters.component';
import { ProductCardComponent } from '../../UI/product-card/product-card.component';
import { SectionHeadComponent } from '../../UI/section-head.component';
import { BigSpinnerComponent } from '../../UI/spinner/spinner.component';
import { NgPluralizeService, NgPluralizeModule } from 'ng-pluralize';
import { ButtonDirective } from '../../../directives/UI/button.directive';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    NgPluralizeModule,
    ProductCardComponent,
    SectionHeadComponent,
    BigSpinnerComponent,
    FiltersComponent,
    ButtonDirective,
  ],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnDestroy {
  activeProducts: asyncType<productType[]> | null = null;

  category: string | null = null;
  page: number = 0;
  pages: number[] = [];

  sortingOptions: {
    label: string;
    value: string;
    default: boolean;
    sort: productFiltersType['sort'];
  }[] = [
    {
      label: 'Sort by Date (Newest)',
      value: 'date.desc',
      default: true,
      sort: {
        by: 'date',
        order: 'DESC',
      },
    },
    {
      label: 'Sort by Date (Oldest)',
      value: 'date.asc',
      default: false,
      sort: {
        by: 'date',
        order: 'ASC',
      },
    },
    {
      label: 'Sort by Price (Highest)',
      value: 'price.desc',
      default: false,
      sort: {
        by: 'price',
        order: 'DESC',
      },
    },
    {
      label: 'Sort by Price (Lowest)',
      value: 'price.asc',
      default: false,
      sort: {
        by: 'price',
        order: 'ASC',
      },
    },
  ];
  activeSort = this.sortingOptions.find((o) => o.default)?.sort;

  routeParamSub: Subscription | null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private pluralize: NgPluralizeService,
  ) {
    this.routeParamSub = this.route.paramMap.subscribe(async (params) => {
      this.category = params.get('category');
      this.productService.setProductFilters({ category: this.category ?? '' });

      await this.fetchProducts(0);
    });

    effect(() => {
      this.activeProducts = this.productService.getProducts();
    });
  }

  ngOnDestroy(): void {
    this.routeParamSub?.unsubscribe();
  }

  async fetchProducts(page: number) {
    let productFilters = {
      ...this.productService.getProductFilters(),
      sort: this.activeSort,
      page,
    };

    await this.productService.fetchProducts(productFilters ?? 'all');
    this.page = page;
    this.pages = this.calculatePages();
  }

  get isLoading() {
    return this.activeProducts?.isLoading ?? false;
  }

  get hasError() {
    return this.activeProducts?.hasError ?? false;
  }

  get products() {
    return this.activeProducts?.value || [];
  }

  get hasPrev() {
    return this.productService.paginationInfo?.hasPrev;
  }

  get hasNext() {
    return this.productService.paginationInfo?.hasNext;
  }

  get isMobile() {
    return window.screen.width <= 768;
  }

  // page buttons for the paginator
  // positive numbers are rendered as buttons for that page, negatives are ellipses (...) between buttons
  // (for tracking reasons every numbers should be different, meaning 2 ellipses should be represented as -1 and -2)
  calculatePages() {
    const totalPages = this.productService.paginationInfo?.totalPages;
    if (totalPages == undefined) return [];
    const pageLabels = Array(totalPages)
      .fill(0)
      .map((_, i) => i);
    if (totalPages < 6) return pageLabels;

    let _pages = [
      ...new Set([
        0,
        this.page - 2,
        this.page - 1,
        this.page,
        this.page + 1,
        this.page + 2,
        totalPages - 1,
      ]),
    ].filter((p) => p >= 0 && p <= totalPages - 1);

    if (this.page > 3) _pages = [0, -1, ..._pages.slice(1)];
    if (this.page < totalPages - 4)
      _pages = [..._pages.slice(0, -1), -2, totalPages - 1];

    return _pages;
  }

  async loadNextPage() {
    if (!this.hasNext) return;
    await this.fetchProducts(this.page + 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  async loadPrevPage() {
    if (!this.hasPrev) return;
    await this.fetchProducts(this.page - 1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  async gotoPage(page: number) {
    await this.fetchProducts(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  async handleFiltersChanged() {
    await this.fetchProducts(0);
  }

  async handleSortChanged(e: Event) {
    this.activeSort = this.sortingOptions.find(
      (o) => o.value === (e.target as HTMLSelectElement).value,
    )?.sort;
    this.fetchProducts(0);
  }

  plural(noun: string | null | undefined) {
    if (!noun) return null;
    if (noun === 'men' || noun === 'women') return noun + "'s selection";
    if (this.pluralize.isPlural(noun)) return noun;
    return this.pluralize.pluralize(noun);
  }
}
