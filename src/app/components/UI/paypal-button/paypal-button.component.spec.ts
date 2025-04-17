import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalButtonComponent } from './paypal-button.component';
import { EnvService } from '../../../services/env.service';

describe('PaypalButtonComponent', () => {
  let component: PaypalButtonComponent;
  let fixture: ComponentFixture<PaypalButtonComponent>;

  beforeEach(async () => {
    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_PAYPAL_CLIENT_ID: '' },
    });
    await TestBed.configureTestingModule({
      imports: [PaypalButtonComponent],
      providers: [{ provide: EnvService, useValue: envSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalButtonComponent);
    component = fixture.componentInstance;

    // for ngx-paypal
    setTimeout(() => {
      fixture.detectChanges();
    }, 2000);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
