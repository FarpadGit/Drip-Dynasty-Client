import { Injectable } from '@angular/core';
import { EmailApiService } from './API/email-api.service';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private APIService: EmailApiService) {}

  async sendOrderHistory(to: string) {
    await this.APIService.sendOrderHistory(to);
  }
}
