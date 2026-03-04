import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { ImageComponent } from './image.component';
import { SliderComponent } from '../../../UI/slider.component';
import { StyledButtonComponent } from '../../../UI/styled-button.component';
import { NavButtonComponent } from '../../../UI/nav-button.component';
import { PaypalButtonComponent } from '../../../UI/paypal-button/paypal-button.component';
import { ButtonDirective } from '../../../../directives/UI/button.directive';
import { formatCurrency } from '../../../../utils/formatters';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  featherArrowLeft,
  featherArrowRight,
  featherCheck,
} from '@ng-icons/feather-icons';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ImageComponent,
    SliderComponent,
    ButtonDirective,
    NgIconComponent,
    PaypalButtonComponent,
    StyledButtonComponent,
    NavButtonComponent,
  ],
  providers: [
    provideIcons({ featherArrowLeft, featherArrowRight, featherCheck }),
  ],
  templateUrl: './details.component.html',
  styles: `
    .description {
      scrollbar-width: thin;
    }
    .icon-outline {
      filter: drop-shadow(1px 1px 0 black) drop-shadow(-1px -1px 0 black)
        drop-shadow(1px -1px 0 black) drop-shadow(-1px 1px 0 black);
    }
  `,
})
export class ProductDetailsComponent implements OnInit {
  @Input() slug!: string;
  product!: productType;
  selectedImageIndex: number = 1;
  isLoading: boolean = true;
  ispurchaseLoading: boolean = false;
  isHintOpen: boolean = false;
  _variants:
    | (NonNullable<productType['variants']>[number] & {
        selectedIndex: number;
      })[]
    | undefined;

  constructor(
    private productService: ProductService,
    private router: Router,
  ) {}

  async ngOnInit() {
    const _product = await this.productService.getProductBySlug(this.slug);
    if (_product == null) this.router.navigate(['/products']);
    else {
      this.product = _product;
      this._variants = this.product.variants?.map((variant) => ({
        ...variant,
        selectedIndex: variant.variants.findIndex((v) => v.stock > 0),
      }));
      this.isLoading = false;
    }
  }

  setDisplayedImage(index: number | '-' | '+') {
    let newIndex: number;
    if (index === '+') newIndex = this.selectedImageIndex + 1;
    else if (index === '-') newIndex = this.selectedImageIndex - 1;
    else newIndex = index;

    if (newIndex < 1) newIndex = this.product.imagePaths.length;
    if (newIndex > this.product.imagePaths.length) newIndex = 1;
    this.selectedImageIndex = newIndex;
  }

  get variants() {
    return this._variants;
  }

  get currentPrice() {
    return this.product.discount === 0
      ? this.product.price
      : this.product.price - this.product.discount;
  }

  get discountPercent() {
    return ((this.product.discount / this.product.price) * 100).toFixed(0);
  }

  get images() {
    return this.product.imagePaths;
  }

  get displayedImgSrc() {
    return this.product.imagePaths[this.selectedImageIndex - 1];
  }

  get isOutOfStock() {
    return ProductService.isOutOfStock(this.product);
  }

  get formatCurrency() {
    return formatCurrency;
  }

  async buyProduct({
    transactionId,
    email,
  }: {
    transactionId: string;
    email: string;
  }) {
    if (ProductService.isOutOfStock(this.product)) return;

    const orderedVariants: orderType['variants'] = this._variants?.map(
      (variant) => ({
        name: variant.groupName,
        value: variant.variants[variant.selectedIndex].name,
      }),
    );
    const orderId = await this.productService.buyProduct(
      this.product,
      email,
      transactionId,
      orderedVariants,
    );

    this.router.navigate(['/products/purchase-processed'], { info: orderId });
  }

  handlePaypalError() {
    this.router.navigate(['/products/purchase-processed'], {
      info: { error: 'paypal error' },
    });
  }
}
