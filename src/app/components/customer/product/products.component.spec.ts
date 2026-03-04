import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsComponent } from './products.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { mockProducts, getMockActivatedRoute } from '../../../../test/mocks';
import { ProductCardComponent } from '../../UI/product-card/product-card.component';
import {
  MockFiltersComponent,
  MockProductCardComponent,
} from '../../../../test/mockComponents';
import { FiltersComponent } from './filters/filters.component';

describe('ProductsComponent (Customer facing)', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productSpy: jasmine.SpyObj<ProductService>;
  let rootElement: HTMLElement;
  const mockActiveProducts = mockProducts.filter((product) => product.isActive);

  const mockActivatedRoute = getMockActivatedRoute('category', 'test category');

  beforeEach(async () => {
    productSpy = jasmine.createSpyObj(
      'ProductsService',
      ['getProducts', 'getProductFilters', 'fetchProducts'],
      {
        paginationInfo: { totalPages: 10 },
      },
    );

    productSpy.getProducts.and.returnValue({
      value: mockActiveProducts,
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
          imports: [ProductCardComponent, FiltersComponent],
        },
        add: {
          imports: [MockProductCardComponent, MockFiltersComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    rootElement = fixture.debugElement.nativeElement;

    fixture.detectChanges();
    await component.fetchProducts(0);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read route params for a given category slug', () => {
    expect(component.activeProducts?.value).toEqual(mockActiveProducts);
    expect(component.category).toBe('test category');
  });

  it('should display a section head with the provided category name', () => {
    const sectionHeadComponent = fixture.debugElement.query(
      (e) => e.name === 'ui-section-head',
    );

    expect(sectionHeadComponent.nativeElement.innerText).toMatch(
      /test categories/i,
    );
  });

  it('should display the corrent number of product cards', () => {
    const productCards = fixture.debugElement.queryAll(
      (e) => e.name === 'ui-product-card',
    );

    expect(productCards.length).toBe(mockActiveProducts.length);
  });

  it('should a filtering component', () => {
    const filtersComponent = fixture.debugElement.query(
      (e) => e.name === 'app-filters',
    );

    expect(filtersComponent).toBeTruthy();
  });

  it('should a sorting element', () => {
    const sortingElement = fixture.debugElement.query(
      (e) => e.name === 'select' && e.attributes['id'] === 'sort',
    );

    expect(sortingElement).toBeTruthy();
  });

  it('should display a loading element if isLoading is true', () => {
    component.activeProducts!.isLoading = true;
    fixture.detectChanges();
    const loader = fixture.debugElement.query((e) => e.name === 'ui-spinner');

    expect(loader).toBeTruthy();
  });

  it('should display an error message if hasError is true', () => {
    component.activeProducts!.hasError = true;
    fixture.detectChanges();
    const errorMessage = rootElement.querySelector('[data-testid="error-msg"]');

    expect(errorMessage).toBeTruthy();
  });

  it('should display a message if no products are active', () => {
    component.activeProducts!.value = [];
    fixture.detectChanges();
    const message = rootElement.querySelector('[data-testid="empty-msg"]');

    expect(message).toBeTruthy();
  });

  describe('page buttons', () => {
    it('should display no page buttons if there is only 1 page', async () => {
      (
        Object.getOwnPropertyDescriptor(productSpy, 'paginationInfo')!
          .get as jasmine.Spy
      ).and.returnValue({ totalPages: 1 });
      await component.fetchProducts(0);
      fixture.detectChanges();

      const paginator = fixture.debugElement.query(
        (e) => e.attributes['data-testid'] === '"paginator',
      );

      expect(paginator).toBeNull();
    });

    it('should display all page buttons (prev, next and one for every page) if there are less than 6 pages', async () => {
      (
        Object.getOwnPropertyDescriptor(productSpy, 'paginationInfo')!
          .get as jasmine.Spy
      ).and.returnValue({ totalPages: 3 });
      await component.fetchProducts(0);
      fixture.detectChanges();

      const paginator = fixture.debugElement.query(
        (e) => e.attributes['data-testid'] === 'paginator',
      );
      const pageButtons = paginator.queryAll((e) => e.name === 'button');

      expect(component.page).toBe(0);
      expect(component.pages.length).toBe(3);
      expect(pageButtons.length).toBe(5);
    });

    it('should display no more than 9 page buttons (prev, next and up to 7 page buttons) if there are more than 6 pages', async () => {
      await component.fetchProducts(5);
      fixture.detectChanges();

      const paginator = fixture.debugElement.query(
        (e) => e.attributes['data-testid'] === 'paginator',
      );
      const pageButtons = paginator.queryAll((e) => e.name === 'button');

      expect(component.page).toBe(5);
      expect(component.pages.length).toBeLessThanOrEqual(9);
      expect(pageButtons.length).toBeLessThanOrEqual(9);
    });
  });
});
