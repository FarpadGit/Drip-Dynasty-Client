import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase-processed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-processed.component.html',
})
export class PurchaseProcessedComponent {
  orderId: string | undefined;
  error: boolean = false;

  constructor(private router: Router) {
    const extrainfo: any = this.router.getCurrentNavigation()?.extras.info;
    if (extrainfo.error) this.error = true;
    else
      this.orderId = this.router.getCurrentNavigation()?.extras.info as string;
  }
}
