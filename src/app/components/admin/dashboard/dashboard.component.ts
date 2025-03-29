import { Component, effect } from '@angular/core';
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
  imports: [CardComponent, ConfirmModalComponent, ButtonDirective],
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
    this.productService.fetchProducts('all');
    this.customerService.fetchCustomers();
    this.orderService.fetchOrders();

    effect(() => {
      this.products = this.productService.getProducts();
      this.countActiveProducts();
    });
    effect(() => {
      this.customers = this.customerService.getCustomers();
    });
    effect(() => {
      this.sales = this.orderService.getOrders();
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
    if (this.sales.isLoading) return 'fetching';
    return formatNumber(this.sales.value?.length || 0);
  }

  get salesAmount() {
    if (this.sales.isLoading) return 'Retrieving data...';
    return formatCurrency(this.totalSales || 0);
  }

  get averageValuePerCustomer() {
    if (this.customers.isLoading) return 'fetching';
    if (!this.customers.value || this.customers.value?.length === 0)
      return formatCurrency(0);
    return formatCurrency(this.avarageSalesValue);
  }

  get customerCount() {
    if (this.customers.isLoading) return 'Retrieving data...';
    return formatNumber(this.customers.value?.length || 0);
  }

  get inactiveCount() {
    if (this.products.isLoading) return 'fetching';
    return formatNumber(this.inactiveProducts);
  }

  get activeCount() {
    if (this.products.isLoading) return 'Retrieving data...';
    return formatNumber(this.activeProducts);
  }

  private resetDB() {
    this.APIService.resetDB();
  }
}
