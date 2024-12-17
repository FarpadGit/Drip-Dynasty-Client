import { Component, Input } from '@angular/core';
import { BadgeComponent } from '../badge.component';
import { NavButtonComponent } from '../nav-button.component';
import { CommonModule } from '@angular/common';
import { productType } from '../../../types';
import { formatCurrency } from '../../../utils/formatters';
import { FaderComponent } from '../fader.component';

@Component({
  selector: 'ui-product-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent, NavButtonComponent, FaderComponent],
  templateUrl: './product-card.component.html',
  styles: `.clippath2 { clip-path: polygon(var(--card-bevel) 0, 0 var(--card-bevel), 0 50%, .75% 51%, .75% 79%, 0 80%, 0% 100%, calc(100% - var(--card-bevel)) 100%, 100% calc(100% - var(--card-bevel)), 100% 50%, 99.25% 49%, 99.25% 21%, 100% 20%, 100% 0%); }
           .clippath1 { clip-path: polygon(var(--card-bevel) 0, 0 var(--card-bevel), 0% 100%, calc(100% - var(--card-bevel)) 100%, 100% calc(100% - var(--card-bevel)), 100% 0%); }`,
})
export class ProductCardComponent {
  @Input() product!: productType;
  @Input() animDelay: number = 0;
  @Input() variant: 'default' | 'small' | 'horizontal' = 'default';
  currentThumbIndex: number = 0;

  get width() {
    if (this.variant === 'horizontal')
      return 'w-[300px] sm:w-[500px] lg:w-[550px] 2xl:w-[600px]';
    return 'w-[136px] sm:w-[250px] md:w-[220px] lg:w-[280px] xl:w-[300px] 2xl:w-[322px]';
  }

  get height() {
    if (this.variant === 'small') return 'h-[200px] sm:h-[320px] lg:h-[400px]';
    if (this.variant === 'horizontal')
      return 'h-[200px] sm:h-[300px] lg:h-[400px]';
    return 'h-[240px] sm:h-[360px] lg:h-[480px]';
  }

  get imgHeight() {
    if (this.variant === 'small') return 'h-[100px] sm:h-[160px] lg:h-[200px]';
    if (this.variant === 'horizontal') return 'h-full';
    return 'h-[120px] sm:h-[180px] lg:h-[280px]';
  }

  get titleSize() {
    if (this.variant === 'small') return 'text-sm sm:text-base lg:text-lg';
    if (this.variant === 'horizontal') return 'text-sm sm:text-lg lg:text-2xl';
    return 'text-sm sm:text-base lg:text-xl';
  }

  get currentPrice() {
    if (!this.product) return 0;
    return this.product.discount === 0
      ? this.product.price
      : this.product.price - this.product.discount;
  }

  get formatCurrency() {
    return formatCurrency;
  }

  get imagePaths() {
    return this.product.imagePaths.slice(0, 2);
  }

  isNew(product: productType) {
    return product.createdSince < 7 * 24 * 60 * 60 * 1000;
  }
}
