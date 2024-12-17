import { Routes } from '@angular/router';
import { ProductFormComponent } from './components/admin/products/product-form/product-form.component';
import { AdminLayoutComponent } from './components/layouts/admin-layout.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ProductsComponent as AdminProductsComponent } from './components/admin/products/products.component';
import { ProductsComponent as CustomerProductsComponent } from './components/customer/product/products.component';
import { customerLayoutComponent } from './components/layouts/customer-layout.component';
import { authGuard, authGuardChildren } from './guards/auth.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { CustomersComponent } from './components/admin/customers/customers.component';
import { OrdersComponent as AdminOrdersComponent } from './components/admin/orders/orders.component';
import { OrdersComponent as CustomerOrdersComponent } from './components/customer/orders/orders.component';
import { ProductDetailsComponent } from './components/customer/product/details/details.component';
import { PurchaseProcessedComponent } from './components/customer/purchase-processed/purchase-processed.component';
import { purchaseGuard } from './guards/purchase.guard';
import { HomeComponent } from './components/customer/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: customerLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'products',
        title: 'Drip Dynasty - Browse our catalog',
        component: CustomerProductsComponent,
      },
      {
        path: 'products/purchase-processed',
        title: 'Drip Dynasty - Thank you for your purchase',
        component: PurchaseProcessedComponent,
        canActivate: [purchaseGuard],
      },
      { path: 'products/:id', component: ProductDetailsComponent },
      {
        path: 'collections/:category',
        title: 'Drip Dynasty - Browse our collections',
        component: CustomerProductsComponent,
      },
      {
        path: 'orders',
        title: 'Drip Dynasty - My Order History',
        component: CustomerOrdersComponent,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuardChildren],
    children: [
      { path: '', component: DashboardComponent },
      {
        path: 'customers',
        component: CustomersComponent,
      },
      {
        path: 'products',
        component: AdminProductsComponent,
      },
      {
        path: 'products/new',
        component: ProductFormComponent,
      },
      {
        path: 'products/:id/edit',
        component: ProductFormComponent,
      },
      {
        path: 'orders',
        component: AdminOrdersComponent,
      },
    ],
  },
  {
    path: 'login',
    title: 'Drip Dynasty - Admin Panel Login',
    component: LoginComponent,
  },
];
