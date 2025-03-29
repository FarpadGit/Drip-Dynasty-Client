import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { ImageComponent } from './image.component';
import { SliderComponent } from '../../../UI/slider.component';
import { PaypalButtonComponent } from '../../../UI/paypal-button/paypal-button.component';
import { ButtonDirective } from '../../../../directives/UI/button.directive';
import { formatCurrency } from '../../../../utils/formatters';
import { productType } from '../../../../types';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherArrowLeft, featherArrowRight } from '@ng-icons/feather-icons';

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
  ],
  providers: [provideIcons({ featherArrowLeft, featherArrowRight })],
  templateUrl: './details.component.html',
  styles: `.description { scrollbar-width: thin; }`,
})
export class ProductDetailsComponent implements OnInit {
  @Input() id!: string;
  product: productType | undefined;
  selectedImageIndex: number = 1;
  ispurchaseLoading: boolean = false;
  isHintOpen: boolean = false;

  constructor(private productService: ProductService, private router: Router) {}

  get isLoading() {
    return this.product == undefined;
  }

  async ngOnInit() {
    this.product = (await this.productService.getProduct(this.id)) ?? undefined;
    if (this.product == undefined) this.router.navigate(['/products']);
  }

  setDisplayedImage(index: number | '-' | '+') {
    if (!this.product) return;
    let newIndex: number;
    if (index === '+') newIndex = this.selectedImageIndex + 1;
    else if (index === '-') newIndex = this.selectedImageIndex - 1;
    else newIndex = index;

    if (newIndex < 1) newIndex = this.product.imagePaths.length;
    if (newIndex > this.product.imagePaths.length) newIndex = 1;
    this.selectedImageIndex = newIndex;
  }

  get currentPrice() {
    if (!this.product) return 0;
    return this.product.discount === 0
      ? this.product.price
      : this.product.price - this.product.discount;
  }

  get discountPercent() {
    return ((this.product!.discount / this.product!.price) * 100).toFixed(0);
  }

  get images() {
    if (!this.product) return [];
    return this.product.imagePaths;
  }

  get displayedImgSrc() {
    if (!this.product) return '';
    return this.product.imagePaths[this.selectedImageIndex - 1];
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
    if (this.product == undefined) return;
    const orderId = await this.productService.buyProduct(
      this.product,
      email,
      transactionId
    );

    this.router.navigate(['/products/purchase-processed'], { info: orderId });
  }

  handlePaypalError() {
    this.router.navigate(['/products/purchase-processed'], {
      info: { error: 'paypal error' },
    });
  }
}
