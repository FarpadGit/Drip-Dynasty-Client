import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { APIService } from '../../../services/API/api.service';
import { ProductService } from '../../../services/product.service';
import { CustomerService } from '../../../services/customer.service';
import { OrderService } from '../../../services/order.service';
import { CardComponent } from './card.component';
import { ConfirmModalComponent } from './confirm-modal.component';
import { ButtonDirective } from '../../../directives/UI/button.directive';
import { formatCurrency, formatNumber } from '../../../utils/formatters';
import {
  asyncType,
  customerType,
  orderType,
  productType,
} from '../../../types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    ConfirmModalComponent,
    ButtonDirective,
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private products: asyncType<productType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };
  private customers: asyncType<customerType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };
  private sales: asyncType<orderType[]> = {
    isLoading: false,
    hasError: false,
    value: null,
  };

  totalSales: number = 0;
  avarageSalesValue: number = 0;
  activeProducts: number = 0;
  get inactiveProducts() {
    return (this.products.value || []).length - this.activeProducts;
  }

  isConfirmModalOpen = false;
  openConfirmModal() {
    this.isConfirmModalOpen = true;
  }
  closeConfirmModal(response: boolean) {
    this.isConfirmModalOpen = false;
    if (response) this.resetDB();
  }

  constructor(
    private productService: ProductService,
    private customerService: CustomerService,
    private orderService: OrderService,
    private APIService: APIService
  ) {
    this.productService.getProducts('all').subscribe((products) => {
      this.products = products;
      this.countActiveProducts();
    });
    this.customerService.getCustomers().subscribe((customers) => {
      this.customers = customers;
    });
    this.orderService.getOrders().subscribe((sales) => {
      this.sales = sales;
      this.calculateSales();
    });
  }

  private calculateSales() {
    if (!this.sales.value || this.sales.value.length === 0) {
      this.totalSales = 0;
      return;
    }
    this.totalSales = this.sales.value
      .map((s) => s.pricePaid)
      .reduce((sum, s) => (sum += s));
    this.avarageSalesValue =
      this.totalSales / (this.customers.value?.length || 1);
  }

  private countActiveProducts() {
    if (!this.products.value || this.products.value.length === 0) {
      this.activeProducts = 0;
      return;
    }
    this.activeProducts = (
      this.products.value.map((p) => (p.isActive ? 1 : 0)) as number[]
    ).reduce((sum, p) => (sum += p));
  }

  get numberOfSales() {
    return formatNumber(this.sales.value?.length || 0);
  }

  get salesAmount() {
    return formatCurrency(this.totalSales || 0);
  }

  get averageValuePerUser() {
    if (!this.customers.value || this.customers.value?.length === 0)
      return formatCurrency(0);
    return formatCurrency(this.avarageSalesValue);
  }

  get userCount() {
    return formatNumber(this.customers.value?.length || 0);
  }

  get inactiveCount() {
    return formatNumber(this.inactiveProducts);
  }

  get activeCount() {
    return formatNumber(this.activeProducts);
  }

  private resetDB() {
    this.APIService.resetDB();
  }
}