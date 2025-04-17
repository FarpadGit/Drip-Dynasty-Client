import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { mockProducts, getMockActivatedRoute } from '../../../../test/mocks';
import { ProductCardComponent } from '../../UI/product-card/product-card.component';
import { NavButtonComponent } from '../../UI/nav-button.component';
import {
  MockNavButtonComponent,
  MockProductCardComponent,
} from '../../../../test/mockComponents';

describe('ProductsComponent (Customer facing)', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productSpy: jasmine.SpyObj<ProductService>;
  let rootElement: HTMLElement;
  const activeProducts = mockProducts.filter((product) => product.isActive);

  const mockActivatedRoute = getMockActivatedRoute(
    'category',
    'test category',
    'page',
    '5'
  );

  beforeEach(async () => {
    productSpy = jasmine.createSpyObj(
      'ProductsService',
      ['getProducts', 'fetchProducts'],
      {
        paginationInfo: { totalPages: 10 },
      }
    );

    productSpy.getProducts.and.returnValue({
      value: activeProducts,
      isLoading: false,
      hasError: false,
    });

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: Router, useValue: { url: '/products' } },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    })
      .overrideComponent(ProductsComponent, {
        remove: {
          imports: [ProductCardComponent, NavButtonComponent],
        },
        add: {
          imports: [MockProductCardComponent, MockNavButtonComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    rootElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read params and query params for the correct product ID and page value', () => {
    expect(component.activeProducts.value).toEqual(activeProducts);
    expect(component.category).toBe('test category');
    expect(component.page).toBe(5);
    expect(component.pages.length).toBe(10);
  });

  it('should display the corrent number of product cards', () => {
    const productCards = fixture.debugElement.queryAll(
      (e) => e.name === 'ui-product-card'
    );

    expect(productCards.length).toBe(activeProducts.length);
  });

  it('should display the correct number of page buttons', () => {
    const pageButtons = fixture.debugElement.queryAll(
      (e) => e.name === 'ui-nav-button'
    );

    expect(pageButtons.length).toBe(2 + component.pages.length);
  });

  it('should display no page buttons if there is only 1 page', () => {
    (
      Object.getOwnPropertyDescriptor(productSpy, 'paginationInfo')!
        .get as jasmine.Spy
    ).and.returnValue({ totalPages: 1 });
    fixture.detectChanges();

    const pageButtons = fixture.debugElement.queryAll(
      (e) => e.name === 'ui-nav-button'
    );

    expect(pageButtons.length).toBe(0);
  });

  it('should display a loading element if isLoading is true', () => {
    component.activeProducts.isLoading = true;
    fixture.detectChanges();
    const loader = fixture.debugElement.query((e) => e.name === 'ui-spinner');

    expect(loader).toBeTruthy();
  });

  it('should display an error message if hasError is true', () => {
    component.activeProducts.hasError = true;
    fixture.detectChanges();
    const errorMessage = rootElement.querySelector('[data-test-error-msg]');

    expect(errorMessage).toBeTruthy();
  });

  it('should display a message if no products are active', () => {
    component.activeProducts.value = [];
    fixture.detectChanges();
    const message = rootElement.querySelector('[data-test-empty-msg]');

    expect(message).toBeTruthy();
  });
});
