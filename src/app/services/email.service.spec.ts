import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import { EmailApiService } from './API/email-api.service';

describe('EmailService', () => {
  let service: EmailService;
  let emailSpy: jasmine.SpyObj<EmailApiService>;

  beforeEach(() => {
    emailSpy = jasmine.createSpyObj('EmailApiService', ['sendOrderHistory']);
    TestBed.configureTestingModule({
      providers: [{ provide: EmailApiService, useValue: emailSpy }],
    });
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call sendOrderHistory when user request an order history', () => {
    service.sendOrderHistory('customer@email.com');

    expect(emailSpy.sendOrderHistory).toHaveBeenCalledOnceWith(
      'customer@email.com'
    );
  });
});
