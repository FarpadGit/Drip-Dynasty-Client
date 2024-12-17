import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../UI/navbar/navbar.component';
import { NavlinkComponent } from '../UI/navbar/navlink.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, NavlinkComponent],
  template: `<ui-navbar [variant]="navbarStyle">
      <ui-navlink href="/">Home</ui-navlink>
      <ui-navlink href="/products">Products</ui-navlink>
      <ui-navlink href="/orders">My orders</ui-navlink>
    </ui-navbar>
    <main class="container 2xl:max-w-screen-2xl my-6">
      <router-outlet />
    </main>
    <footer class="relative bg-primary text-primary-foreground p-8">
      <div>
        Copyright
        <a
          href="https://fabokarpad.hu"
          target="_blank"
          rel="noreferrer noopener"
        >
          Fabók Árpád ©2024-2025
        </a>
      </div>
    </footer>`,
})
export class customerLayoutComponent {
  constructor(private router: Router) {}
  get navbarStyle() {
    return this.router.url === '/' ? 'transparent' : 'drip';
  }
}
