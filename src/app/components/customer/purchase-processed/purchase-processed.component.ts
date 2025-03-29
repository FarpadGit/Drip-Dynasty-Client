import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-processed',
  standalone: true,
  imports: [],
  templateUrl: './purchase-processed.component.html',
})
export class PurchaseProcessedComponent {
  orderId: string | undefined;
  error: boolean = false;

  constructor(private router: Router) {
    const extrainfo: any = this.router.getCurrentNavigation()?.extras.info;
    if (!extrainfo || extrainfo.error) this.error = true;
    else this.orderId = extrainfo as string;
  }
}
