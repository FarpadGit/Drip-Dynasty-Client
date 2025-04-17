import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersComponent } from './orders.component';
import { EnvService } from '../../../services/env.service';
import { EmailService } from '../../../services/email.service';

describe('OrdersComponent (Customer facing)', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let emailSpy: jasmine.SpyObj<EmailService>;

  beforeEach(async () => {
    emailSpy = jasmine.createSpyObj('EmailService', ['sendOrderHistory']);
    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    await TestBed.configureTestingModule({
      imports: [OrdersComponent],
      providers: [
        { provide: EmailService, useValue: emailSpy },
        { provide: EnvService, useValue: envSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendOrderHistory from service', () => {
    const inputElement = fixture.debugElement.nativeElement.querySelector(
      '#email'
    ) as HTMLInputElement;
    const submitButton = fixture.debugElement.nativeElement.querySelector(
      'button'
    ) as HTMLButtonElement;

    inputElement.value = 'user@email.com';
    inputElement.dispatchEvent(new Event('input'));
    submitButton.click();

    expect(emailSpy.sendOrderHistory).toHaveBeenCalledWith('user@email.com');
    expect(component.sent).toBeTrue();
  });
});
