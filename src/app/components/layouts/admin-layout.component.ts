import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../UI/navbar/navbar.component';
import { NavlinkComponent } from '../UI/navbar/navlink.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NavlinkComponent],
  template: `<ui-navbar variant="simple">
      <ui-navlink href="/admin">Dashboard</ui-navlink>
      <ui-navlink href="/admin/products">Products</ui-navlink>
      <ui-navlink href="/admin/customers">Customers</ui-navlink>
      <ui-navlink href="/admin/orders">Sales</ui-navlink>
      <ui-navlink href="/" (click)="logOut()">Log out</ui-navlink>
    </ui-navbar>
    <main class="container my-6"><router-outlet /></main> `,
})
export class AdminLayoutComponent {
  constructor(private authService: AuthService) {}

  logOut() {
    this.authService.logout();
  }
}
