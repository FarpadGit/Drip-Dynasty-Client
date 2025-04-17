import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseProcessedComponent } from './purchase-processed.component';
import { Navigation, Router } from '@angular/router';

describe('PurchaseProcessedComponent (Customer facing)', () => {
  let component: PurchaseProcessedComponent;
  let fixture: ComponentFixture<PurchaseProcessedComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  async function setMockRouterInfo(info: string | { error: any }) {
    routerSpy.getCurrentNavigation.and.returnValue({
      extras: { info },
    } as unknown as Navigation);

    await TestBed.overrideProvider(Router, {
      useValue: routerSpy,
    }).compileComponents();

    fixture = TestBed.createComponent(PurchaseProcessedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation']);

    TestBed.configureTestingModule({
      imports: [PurchaseProcessedComponent],
      providers: [{ provide: Router, useValue: null }],
    });
  });

  it('should create', async () => {
    await setMockRouterInfo('Order ID 12345');

    expect(component).toBeTruthy();
  });

  it('should recieve order ID from router navigation info', async () => {
    await setMockRouterInfo('Order ID 12345');
    const messageString = fixture.debugElement.nativeElement.querySelector(
      '#message'
    ).innerText as string;

    expect(component.orderId).toBe('Order ID 12345');
    expect(messageString.includes('Order ID 12345')).toBeTrue();
  });

  it('should display error message if router navigation info has no order ID', async () => {
    await setMockRouterInfo({ error: 'error' });
    const messageString = fixture.debugElement.nativeElement.querySelector(
      '#message'
    ).innerText as string;

    expect(component.error).toBeTrue();
    expect(messageString.includes('error')).toBeTrue();
  });
});
