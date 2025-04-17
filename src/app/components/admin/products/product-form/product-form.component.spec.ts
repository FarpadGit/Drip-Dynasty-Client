import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../../services/product.service';
import {
  mockProductWithDiscount,
  mockProductWithoutDiscount,
  getMockActivatedRoute,
} from '../../../../../test/mocks';
import { getNumberValueFromText } from '../../../../../test/test-utils';

describe('ProductFormComponent (Admin facing)', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  let rootElement: HTMLElement;

  async function setMockRouteIdParameter(param: any) {
    const mockActivatedRoute = getMockActivatedRoute('id', param);

    await TestBed.overrideProvider(ActivatedRoute, {
      useValue: mockActivatedRoute,
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    rootElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  }

  beforeEach(() => {
    productSpy = jasmine.createSpyObj('ProductService', [
      'getProduct',
      'updateProduct',
      'addNewProduct',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    productSpy.getProduct
      .withArgs('discountedProductID')
      .and.resolveTo(mockProductWithDiscount);
    productSpy.getProduct
      .withArgs('fullPriceProductID')
      .and.resolveTo(mockProductWithoutDiscount);
    productSpy.getProduct.and.resolveTo(null);

    TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: null },
        { provide: Location, useValue: locationSpy },
      ],
    });
  });

  it('should create', async () => {
    await setMockRouteIdParameter(null);

    expect(component).toBeTruthy();
  });

  it('should load product data if route parameter is a product ID', async () => {
    await setMockRouteIdParameter('discountedProductID');
    await component.ngOnInit();
    const { name, description, categories, price, extra } =
      component.productForm.controls.productInfo.controls;
    const { on, discountValue, discountPercent } =
      component.productForm.controls.discount.controls;
    const images = component.images;

    //
    expect(component.product).toBeTruthy();

    expect(name.value)
      .withContext('name mismatch')
      .toBe(mockProductWithDiscount.name);

    expect(description.value)
      .withContext('description mismatch')
      .toBe(mockProductWithDiscount.description);

    expect(categories.value)
      .withContext('categories mismatch')
      .toBe(mockProductWithDiscount.categories?.join(', ') || null);

    expect(price.value)
      .withContext('price mismatch')
      .toBe(mockProductWithDiscount.price);

    expect(extra.value)
      .withContext('extra mismatch')
      .toBe(mockProductWithDiscount.extra || null);

    expect(on.value)
      .withContext('discount mismatch')
      .toBe(mockProductWithDiscount.discount > 0);

    expect(discountValue.value)
      .withContext('discount value mismatch')
      .toBe(mockProductWithDiscount.discount);

    expect(discountPercent.value)
      .withContext('discount percent mismatch')
      .toBeCloseTo(
        mockProductWithDiscount.discount === 0
          ? 0
          : (100 * mockProductWithDiscount.discount) /
              mockProductWithDiscount.price
      );

    expect(images.length)
      .withContext('images mismatch')
      .toBe(mockProductWithDiscount.imagePaths.length);

    expect(images[0]?.name)
      .withContext('images mismatch')
      .toBe(mockProductWithDiscount.imagePaths[0]);
  });

  it('should display product data in template if route parameter is a product ID', async () => {
    await setMockRouteIdParameter('discountedProductID');
    await component.ngOnInit();
    fixture.detectChanges();
    const h1InnerText = rootElement.querySelector('h1')!.innerHTML as string;
    const nameInput = rootElement.querySelector('#name') as HTMLInputElement;
    const descriptionInputChildren = rootElement.querySelectorAll(
      '#description *'
    ) as NodeList;
    const descriptionElement = Array.from(descriptionInputChildren).find(
      (el) => el.textContent === mockProductWithDiscount.description
    );
    const categoriesInput = rootElement.querySelector(
      '#categories'
    ) as HTMLTextAreaElement;
    const extrasInput = rootElement.querySelector(
      '#extra'
    ) as HTMLTextAreaElement;
    const priceInput = rootElement.querySelector(
      '#numberInput_Price'
    ) as HTMLInputElement;
    const img = rootElement.querySelector(
      `img[src='${mockProductWithDiscount.imagePaths[0]}']`
    ) as HTMLImageElement;

    //
    expect(h1InnerText.toLowerCase().includes('update')).toBeTrue();

    expect(nameInput.value)
      .withContext('name field mismatch')
      .toBe(mockProductWithDiscount.name);

    expect(descriptionElement)
      .withContext('description field mismatch')
      .toBeTruthy();

    expect(categoriesInput.value)
      .withContext('categories field mismatch')
      .toBe(mockProductWithDiscount.categories?.join(', ') || '');

    expect(extrasInput.value)
      .withContext('extras field mismatch')
      .toBe(mockProductWithDiscount.extra || '');

    expect(getNumberValueFromText(priceInput.value))
      .withContext('price field mismatch')
      .toBe(mockProductWithDiscount.price);

    expect(img).withContext("image doesn't render").toBeTruthy();
  });

  it('should not display discount related fields if discount is 0', async () => {
    await setMockRouteIdParameter('fullPriceProductID');
    await component.ngOnInit();
    fixture.detectChanges();
    const discountSwitch = rootElement.querySelector(
      '#discount'
    ) as HTMLElement;
    const discountInput = rootElement.querySelector(
      '#numberInput_Discount'
    ) as HTMLInputElement;
    const discountPercentInput = rootElement.querySelector(
      '#discountPercent'
    ) as HTMLInputElement;

    expect(discountSwitch)
      .withContext("discount switch doesn't render")
      .toBeTruthy();
    expect(discountInput).withContext('discount input rendered').toBeFalsy();
    expect(discountPercentInput)
      .withContext('discount percentage input rendered')
      .toBeFalsy();
  });

  it('should display discount related fields if discount is > 0', async () => {
    await setMockRouteIdParameter('discountedProductID');
    await component.ngOnInit();
    fixture.detectChanges();
    const discountSwitch = rootElement.querySelector(
      '#discount'
    ) as HTMLElement;
    const discountInput = rootElement.querySelector(
      '#numberInput_Discount'
    ) as HTMLInputElement;
    const discountPercentInput = rootElement.querySelector(
      '#discountPercent'
    ) as HTMLInputElement;
    const discountPercent =
      (100 * mockProductWithDiscount.discount) / mockProductWithDiscount.price;

    //
    expect(discountSwitch)
      .withContext("discount switch doesn't render")
      .toBeTruthy();

    expect(discountInput.value)
      .withContext('discount input mismatch')
      .toBe(mockProductWithDiscount.discount.toString());

    expect(Number.parseFloat(discountPercentInput.value))
      .withContext('discount percentage input mismatch')
      .toBeCloseTo(discountPercent);
  });

  it("should display no data if route parameter doesn't exist", async () => {
    await setMockRouteIdParameter(null);
    await component.ngOnInit();
    fixture.detectChanges();
    const h1InnerText = rootElement.querySelector('h1')!.innerHTML as string;

    expect(h1InnerText.toLowerCase().includes('update')).toBeFalse();
    expect(component.product).toBeFalsy();
  });

  it('should navigate back if route parameter exists but is an invalid product ID', async () => {
    await setMockRouteIdParameter('BadProductID');
    await component.ngOnInit();
    fixture.detectChanges();

    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should call updateProduct if a valid update form is submitted', async () => {
    await setMockRouteIdParameter('fullPriceProductID');
    await component.ngOnInit();
    fixture.detectChanges();
    component.validSubmit = true;
    component.images = [
      { id: '', name: '', shouldDelete: false, image: { src: '' } },
    ];

    await component.addOrUpdateProduct();

    expect(productSpy.updateProduct).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/products']);
  });

  it('should call addNewProduct if a valid creation form is submitted', async () => {
    await setMockRouteIdParameter(null);
    await component.ngOnInit();
    fixture.detectChanges();
    component.validSubmit = true;
    component.images = [
      { id: '', name: '', shouldDelete: false, image: { src: '' } },
    ];

    await component.addOrUpdateProduct();

    expect(productSpy.addNewProduct).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/products']);
  });

  it('should navigate back if canceled', async () => {
    await setMockRouteIdParameter('fullPriceProductID');
    await component.ngOnInit();
    fixture.detectChanges();

    component.onCancel();

    expect(locationSpy.back).toHaveBeenCalled();
  });
});
