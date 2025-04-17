import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { ProductDetailsComponent } from './details.component';
import { ImageComponent } from './image.component';
import { PaypalButtonComponent } from '../../../UI/paypal-button/paypal-button.component';
import { ProductService } from '../../../../services/product.service';
import { mockProducts } from '../../../../../test/mocks';
import {
  MockImageComponent,
  MockPaypalButtonComponent,
} from '../../../../../test/mockComponents';
import { basicComponentTestFor } from '../../../../../test/test-utils';

basicComponentTestFor(ImageComponent, { withAnimations: true });

describe('DetailsComponent (Customer facing)', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  let productSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const mockProduct = mockProducts[0];

  beforeEach(async () => {
    productSpy = jasmine.createSpyObj('ProductService', [
      'getProduct',
      'buyProduct',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    productSpy.getProduct.withArgs(mockProduct.id).and.resolveTo(mockProduct);
    productSpy.getProduct.and.resolveTo(null);
    productSpy.buyProduct.and.resolveTo('buyProduct called');

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: Router, useValue: routerSpy },
      ],
    })
      .overrideComponent(ProductDetailsComponent, {
        remove: {
          imports: [PaypalButtonComponent, ImageComponent],
        },
        add: {
          imports: [MockPaypalButtonComponent, MockImageComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    component.id = mockProduct.id;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct product info', () => {
    const discountPercent = (100 * mockProduct.discount) / mockProduct.price;
    const descriptionText = fixture.debugElement.nativeElement.querySelector(
      '.description'
    ).innerText as string;
    const h1Text = fixture.debugElement.nativeElement.querySelector('h1')
      .innerText as string;

    expect(component.product).toEqual(mockProduct);
    expect(component.currentPrice).toBe(mockProduct.price);
    expect(
      component.discountPercent.includes(discountPercent.toString())
    ).toBeTrue();
    expect(component.images).toBe(mockProduct.imagePaths);
    expect(h1Text).toBe(mockProduct.name);
    expect(descriptionText).toBe(mockProduct.description);
  });

  it('should navigate away if incorrect product ID was suplied', async () => {
    component.id = 'BadProductID';
    await component.ngOnInit();
    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should call buyProduct and navigate to acknowledgement page on purchase', async () => {
    await component.buyProduct({
      email: 'user@email.com',
      transactionId: 'fakeTransactionID',
    });

    expect(productSpy.buyProduct).toHaveBeenCalledWith(
      component.product!,
      'user@email.com',
      'fakeTransactionID'
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/products/purchase-processed'],
      { info: 'buyProduct called' }
    );
  });

  it('should navigate to acknowledgement page with an error if purchase failed', () => {
    component.handlePaypalError();

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/products/purchase-processed'],
      { info: jasmine.objectContaining({ error: jasmine.anything() }) }
    );
  });
});
