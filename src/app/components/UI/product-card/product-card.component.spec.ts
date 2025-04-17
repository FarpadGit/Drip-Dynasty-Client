import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from './product-card.component';
import {
  mockNewProduct,
  mockOldProduct,
  mockProductWithDiscount,
  mockProductWithoutDiscount,
} from '../../../../test/mocks';
import { getNumberValueFromText } from '../../../../test/test-utils';
import { NavButtonComponent } from '../nav-button.component';
import { MockNavButtonComponent } from '../../../../test/mockComponents';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  function getAllBadgeElements() {
    const badgeNodes = fixture.debugElement.nativeElement.querySelectorAll(
      '[data-test-badge-content]'
    ) as NodeList;
    return Array.from(badgeNodes);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    })
      .overrideComponent(ProductCardComponent, {
        remove: {
          imports: [NavButtonComponent],
        },
        add: {
          imports: [MockNavButtonComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockNewProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  function shouldDisplayProductInfo() {
    const nameElement = fixture.debugElement.nativeElement.querySelector(
      '[data-test-name]'
    ) as HTMLElement;
    const categoryElements =
      fixture.debugElement.nativeElement.querySelectorAll(
        '[data-test-category]'
      ) as NodeList;
    const priceElement = fixture.debugElement.nativeElement.querySelector(
      '[data-test-price]'
    ) as HTMLElement;
    const oldPriceElement = fixture.debugElement.nativeElement.querySelector(
      '[data-test-old-price]'
    ) as HTMLElement;
    const imageElement = fixture.debugElement.nativeElement.querySelector(
      'img'
    ) as HTMLImageElement;

    //
    expect(nameElement.textContent)
      .withContext('name mismatch')
      .toBe(component.product.name);

    if (categoryElements.length === 0) {
      expect(component.product.categories)
        .withContext('categories mismatch')
        .toBeFalsy();
    } else {
      const categories = Array.from(categoryElements).map(
        (category) => category.textContent as string
      );
      expect(categories)
        .withContext('categories mismatch')
        .toEqual(component.product.categories!);
    }

    if (component.product.discount === 0) {
      expect(getNumberValueFromText(priceElement.textContent!))
        .withContext('price mismatch')
        .toBe(component.product.price);
    } else {
      expect(getNumberValueFromText(priceElement.textContent!))
        .withContext('price mismatch')
        .toBe(component.product.price - component.product.discount);
    }

    if (oldPriceElement == undefined) {
      expect(component.product.discount)
        .withContext('old price mismatch')
        .toBe(0);
    } else {
      expect(component.product.discount)
        .withContext('old price mismatch')
        .not.toBe(0);
      expect(getNumberValueFromText(oldPriceElement.textContent!))
        .withContext('old price mismatch')
        .toBe(component.product.price);
    }

    expect(
      imageElement.src.includes(component.product.imagePaths[0])
    ).toBeTrue();
  }

  it('should display product info (vertical)', shouldDisplayProductInfo);

  it('should display product info (horizontal)', () => {
    component.variant = 'horizontal';
    fixture.detectChanges();
    shouldDisplayProductInfo();
  });

  it('should diplay a "New" badge if product is younger than 7 days', () => {
    const badges = getAllBadgeElements();
    const newBadgeExists = badges.some(
      (badge) => badge.textContent?.toLowerCase() === 'new'
    );

    expect(newBadgeExists).toBeTrue();
  });

  it('should not diplay a "New" badge if product is older than 7 days', () => {
    component.product = mockOldProduct;
    fixture.detectChanges();
    const badges = getAllBadgeElements();
    const newBadgeExists = badges.some(
      (badge) => badge.textContent?.toLowerCase() === 'new'
    );

    expect(newBadgeExists).toBeFalse();
  });

  it('should diplay a "Sale" badge if product has a discount', () => {
    component.product = mockProductWithDiscount;
    fixture.detectChanges();
    const badges = getAllBadgeElements();
    const saleBadgeExists = badges.some(
      (badge) => badge.textContent?.toLowerCase() === 'sale'
    );

    expect(saleBadgeExists).toBeTrue();
  });

  it('should not diplay a "Sale" badge if product does not have a discount', () => {
    component.product = mockProductWithoutDiscount;
    fixture.detectChanges();
    const badges = getAllBadgeElements();
    const saleBadgeExists = badges.some(
      (badge) => badge.textContent?.toLowerCase() === 'sale'
    );

    expect(saleBadgeExists).toBeFalse();
  });
});
