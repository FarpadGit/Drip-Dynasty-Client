import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductDetailsComponent } from './details.component';
import { ImageComponent } from './image.component';
import { PaypalButtonComponent } from '../../../UI/paypal-button/paypal-button.component';
import { ProductService } from '../../../../services/product.service';
import {
  getMockActivatedRoute,
  mockProductWithVariantsAndTags,
} from '../../../../../test/mocks';
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
  const mockProduct = mockProductWithVariantsAndTags;
  const mockActivatedRoute = getMockActivatedRoute('slug', mockProduct.slug);

  beforeEach(async () => {
    productSpy = jasmine.createSpyObj('ProductService', [
      'getProductBySlug',
      'buyProduct',
    ]);
    routerSpy = jasmine.createSpyObj(
      'Router',
      ['navigate', 'createUrlTree', 'serializeUrl'],
      {
        events: { subscribe: jasmine.createSpy() },
      },
    );

    productSpy.getProductBySlug
      .withArgs(mockProduct.slug)
      .and.resolveTo(mockProduct);
    productSpy.getProductBySlug.and.resolveTo(null);
    productSpy.buyProduct.and.resolveTo('buyProduct called');

    await TestBed.configureTestingModule({
      imports: [ProductDetailsComponent],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
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
    component.slug = mockProduct.slug;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct product info', () => {
    const h1Text = fixture.debugElement.nativeElement.querySelector('h1')
      .innerText as string;
    const discountPercent = (100 * mockProduct.discount) / mockProduct.price;
    const categoriesButtons =
      fixture.debugElement.nativeElement.querySelectorAll(
        '[data-testid="categories"] ui-nav-button',
      ) as Element[];
    const variantButtons = fixture.debugElement.nativeElement.querySelectorAll(
      '[data-testid="variants"] ui-styled-button',
    ) as Element[];
    const descriptionText = fixture.debugElement.nativeElement.querySelector(
      '.description',
    ).innerText as string;

    expect(component.product).toEqual(mockProduct);
    expect(component.currentPrice).toBe(
      mockProduct.price - mockProduct.discount,
    );
    expect(
      component.discountPercent.includes(discountPercent.toString()),
    ).toBeTrue();
    expect(categoriesButtons.length).toBe(mockProduct.categories?.length || 0);
    expect(variantButtons.length).toBe(
      mockProduct.variants?.flatMap((variant) => variant.variants).length || 0,
    );
    expect(component.images).toBe(mockProduct.imagePaths);
    expect(h1Text).toBe(mockProduct.name);
    expect(descriptionText).toBe(mockProduct.description);
  });

  it('should navigate away if incorrect product ID was suplied', async () => {
    component.slug = 'BadProductID';
    await component.ngOnInit();
    fixture.detectChanges();

    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should call buyProduct and navigate to acknowledgement page on purchase', async () => {
    const orderedVariants: orderType['variants'] = [
      { name: 'size', value: 'M' },
    ];
    await component.buyProduct({
      email: 'user@email.com',
      transactionId: 'fakeTransactionID',
    });

    expect(productSpy.buyProduct).toHaveBeenCalledWith(
      component.product,
      'user@email.com',
      'fakeTransactionID',
      orderedVariants,
    );
    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/products/purchase-processed'],
      { info: 'buyProduct called' },
    );
  });

  it('should navigate to acknowledgement page with an error if purchase failed', () => {
    component.handlePaypalError();

    expect(routerSpy.navigate).toHaveBeenCalledWith(
      ['/products/purchase-processed'],
      { info: jasmine.objectContaining({ error: jasmine.anything() }) },
    );
  });
});
