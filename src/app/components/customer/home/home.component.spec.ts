import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { ProductService } from '../../../services/product.service';
import { EnvService } from '../../../services/env.service';
import {
  mockNewestProducts,
  mockPopularProducts,
} from '../../../../test/mocks';
import { ProductCardComponent } from '../../UI/product-card/product-card.component';
import { CatalogButtonComponent } from '../../UI/catalog-button.component';
import { NavButtonComponent } from '../../UI/nav-button.component';
import {
  MockCatalogButtonComponent,
  MockNavButtonComponent,
  MockProductCardComponent,
} from '../../../../test/mockComponents';

describe('HomeComponent (Customer facing)', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    const newestProductSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'fetchProducts',
    ]) as jasmine.SpyObj<ProductService>;
    const popularProductSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'fetchProducts',
    ]) as jasmine.SpyObj<ProductService>;
    const envSpy = jasmine.createSpyObj('EnvService', [], {
      env: { NG_APP_SERVER_URL: '' },
    });

    newestProductSpy.getProducts.and.returnValue({
      value: mockNewestProducts,
      isLoading: false,
      hasError: false,
    });
    popularProductSpy.getProducts.and.returnValue({
      value: mockPopularProducts,
      isLoading: false,
      hasError: false,
    });

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [{ provide: EnvService, useValue: envSpy }],
    })
      .overrideComponent(HomeComponent, {
        remove: {
          imports: [
            ProductCardComponent,
            CatalogButtonComponent,
            NavButtonComponent,
          ],
          providers: [
            { provide: 'instance1', useClass: ProductService },
            { provide: 'instance2', useClass: ProductService },
          ],
        },
        add: {
          imports: [
            MockProductCardComponent,
            MockNavButtonComponent,
            MockCatalogButtonComponent,
          ],
          providers: [
            {
              provide: 'instance1',
              useValue: newestProductSpy,
            },
            {
              provide: 'instance2',
              useValue: popularProductSpy,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display newest products', () => {
    expect(component.newestProducts.value).toEqual(mockNewestProducts);
  });

  it('should display most popular products', () => {
    expect(component.mostPopularProducts.value).toEqual(mockPopularProducts);
  });
});
