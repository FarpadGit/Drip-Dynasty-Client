import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputDirective } from '../../../directives/UI/input.directive';
import { ButtonDirective } from '../../../directives/UI/button.directive';
import { EmailService } from '../../../services/email.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, InputDirective, ButtonDirective],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements AfterViewInit {
  email: string = '';
  @ViewChild('emailField') emailField: ElementRef<HTMLInputElement> | undefined;
  sent = false;

  constructor(private emailService: EmailService) {}

  ngAfterViewInit(): void {
    if (this.emailField) {
      this.emailField.nativeElement.focus();
    }
  }

  handleSubmit() {
    this.emailService.sendOrderHistory(this.email);
    this.sent = true;
  }
}
