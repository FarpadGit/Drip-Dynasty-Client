import { Component, effect, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ProductCardComponent } from '../../UI/product-card/product-card.component';
import { SectionHeadComponent } from '../../UI/section-head.component';
import { SeparatorComponent } from '../../UI/separator.component';
import { SliderComponent } from '../../UI/slider.component';
import { BigSpinnerComponent } from '../../UI/spinner/spinner.component';
import { CatalogButtonComponent } from '../../UI/catalog-button.component';
import { NavButtonComponent } from '../../UI/nav-button.component';
import { FaderComponent } from '../../UI/fader.component';
import { asyncType, productType } from '../../../types';
import { EnvService } from '../../../services/env.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ProductCardComponent,
    SectionHeadComponent,
    SliderComponent,
    SeparatorComponent,
    BigSpinnerComponent,
    CatalogButtonComponent,
    NavButtonComponent,
    FaderComponent,
  ],
  providers: [
    { provide: 'instance1', useClass: ProductService },
    { provide: 'instance2', useClass: ProductService },
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  titleGlitchEffect: boolean = true;
  newestProducts: asyncType<productType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };
  mostPopularProducts: asyncType<productType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };
  categoryImages = [
    this.process.env['NG_APP_SERVER_URL'] + '/images/collections/all.jpg',
    this.process.env['NG_APP_SERVER_URL'] + '/images/collections/jackets.jpg',
    this.process.env['NG_APP_SERVER_URL'] + '/images/collections/shirts.jpg',
    this.process.env['NG_APP_SERVER_URL'] + '/images/collections/tops.jpg',
    this.process.env['NG_APP_SERVER_URL'] + '/images/collections/legwear.jpg',
    this.process.env['NG_APP_SERVER_URL'] +
      '/images/collections/accessories.jpg',
  ];
  categoryIndex: number = 0;
  setCategoryImage(category: string) {
    this.categoryIndex = this.categoryImages.findIndex((i) =>
      i.toLowerCase().includes(category.toLowerCase())
    );
  }

  constructor(
    @Inject('instance1') private newestProductsService: ProductService,
    @Inject('instance2') private mostPopularProductsService: ProductService,
    private process: EnvService
  ) {
    this.newestProductsService.fetchProducts('newest');
    this.mostPopularProductsService.fetchProducts('popular');

    effect(() => {
      this.newestProducts = this.newestProductsService.getProducts();
    });

    effect(() => {
      this.mostPopularProducts = this.mostPopularProductsService.getProducts();
    });
  }
}
