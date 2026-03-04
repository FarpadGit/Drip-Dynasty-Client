import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../../../services/product.service';
import {
  mockProductWithDiscount,
  mockProductWithoutDiscount,
  mockProductWithVariantsAndTags,
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

  async function setMockRouteSlugParameter(param: string | null) {
    const mockActivatedRoute = getMockActivatedRoute('slug', param);

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
      'getProductBySlug',
      'updateProduct',
      'addNewProduct',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    productSpy.getProductBySlug
      .withArgs('discountedProductSlug')
      .and.resolveTo(mockProductWithDiscount);
    productSpy.getProductBySlug
      .withArgs('fullPriceProductSlug')
      .and.resolveTo(mockProductWithoutDiscount);
    productSpy.getProductBySlug
      .withArgs('variantsProductSlug')
      .and.resolveTo(mockProductWithVariantsAndTags);
    productSpy.getProductBySlug.and.resolveTo(null);

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
    await setMockRouteSlugParameter(null);

    expect(component).toBeTruthy();
  });

  it('should load product data if route parameter is a product slug', async () => {
    await setMockRouteSlugParameter('variantsProductSlug');
    await component.ngOnInit();
    const {
      name,
      slug,
      description,
      categories,
      price,
      emailMessage,
      defaultStock,
      variants,
      searchTags,
    } = component.productForm.controls.productInfo.controls;
    const { on, discountValue, discountPercent } =
      component.productForm.controls.discount.controls;
    const images = component.images;

    //
    expect(component.product).toBeTruthy();

    expect(name.value)
      .withContext('name mismatch')
      .toBe(mockProductWithVariantsAndTags.name);

    expect(slug.value)
      .withContext('slug mismatch')
      .toBe(mockProductWithVariantsAndTags.slug);

    expect(description.value)
      .withContext('description mismatch')
      .toBe(mockProductWithVariantsAndTags.description);

    expect(categories.value)
      .withContext('categories mismatch')
      .toEqual(mockProductWithVariantsAndTags.categories || []);

    expect(price.value)
      .withContext('price mismatch')
      .toBe(mockProductWithVariantsAndTags.price);

    expect(emailMessage.value)
      .withContext('emailMessage mismatch')
      .toBe(mockProductWithVariantsAndTags.emailMessage || null);

    expect(defaultStock.value)
      .withContext('stock mismatch')
      .toBe(mockProductWithVariantsAndTags.defaultStock || 0);

    expect(variants.value)
      .withContext('variants mismatch')
      .toEqual(mockProductWithVariantsAndTags.variants || []);

    expect(searchTags.value)
      .withContext('searchtags mismatch')
      .toEqual(mockProductWithVariantsAndTags.searchTags || []);

    expect(on.value)
      .withContext('discount mismatch')
      .toBe(mockProductWithVariantsAndTags.discount > 0);

    expect(discountValue.value)
      .withContext('discount value mismatch')
      .toBe(mockProductWithVariantsAndTags.discount);

    expect(discountPercent.value)
      .withContext('discount percent mismatch')
      .toBeCloseTo(
        mockProductWithVariantsAndTags.discount === 0
          ? 0
          : (100 * mockProductWithVariantsAndTags.discount) /
              mockProductWithVariantsAndTags.price,
      );

    expect(images.length)
      .withContext('images mismatch')
      .toBe(mockProductWithVariantsAndTags.imagePaths.length);

    expect(images[0]?.name)
      .withContext('images mismatch')
      .toBe(mockProductWithVariantsAndTags.imagePaths[0]);
  });

  it('should display product data in template if route parameter is a product slug', async () => {
    await setMockRouteSlugParameter('variantsProductSlug');
    await component.ngOnInit();
    fixture.detectChanges();
    const h1InnerText = rootElement.querySelector('h1')!.innerHTML as string;
    const nameInput = rootElement.querySelector('#name') as HTMLInputElement;
    const slugInput = rootElement.querySelector('#slug') as HTMLInputElement;
    const descriptionInputChildren = rootElement.querySelectorAll(
      '#description *',
    ) as NodeList;
    const descriptionElement = Array.from(descriptionInputChildren).find(
      (el) => el.textContent === mockProductWithVariantsAndTags.description,
    );
    const categoryInputs = [] as HTMLInputElement[];
    mockProductWithVariantsAndTags.categories?.forEach((_, i) =>
      categoryInputs.push(
        rootElement.querySelector('#categories_' + i) as HTMLInputElement,
      ),
    );
    const emailMessageInput = rootElement.querySelector(
      '#emailMessage',
    ) as HTMLTextAreaElement;
    const stockInput = rootElement.querySelector('#stock') as HTMLInputElement;
    const variantNameInputs = [] as HTMLInputElement[];
    const variantTypeInputs = [] as HTMLInputElement[];
    const variantValueInputs = [] as HTMLInputElement[][];
    const variantStockInputs = [] as HTMLInputElement[][];
    mockProductWithVariantsAndTags.variants?.forEach((variantGroup, i) => {
      variantNameInputs.push(
        rootElement.querySelector('#variants_name_' + i) as HTMLInputElement,
      );
      variantTypeInputs.push(
        rootElement.querySelector('#variants_type_' + i) as HTMLInputElement,
      );
      variantGroup.variants.forEach((_, j) => {
        variantValueInputs.push([]);
        variantStockInputs.push([]);
        variantValueInputs[i].push(
          rootElement.querySelector(
            '#variants_value_' + i + j,
          ) as HTMLInputElement,
        );
        variantStockInputs[i].push(
          rootElement.querySelector(
            '#variants_stock_' + i + j,
          ) as HTMLInputElement,
        );
      });
    });
    const searchTagNameInputs = [] as HTMLInputElement[];
    const searchTagValueInputs = [] as HTMLInputElement[];
    mockProductWithVariantsAndTags.searchTags?.forEach((_, i) => {
      searchTagNameInputs.push(
        rootElement.querySelector('#tags_name_' + i) as HTMLInputElement,
      );
      searchTagValueInputs.push(
        rootElement.querySelector('#tags_value_' + i) as HTMLInputElement,
      );
    });
    const priceInput = rootElement.querySelector(
      '#numberInput_price',
    ) as HTMLInputElement;
    const img = rootElement.querySelector(
      `img[src='${mockProductWithVariantsAndTags.imagePaths[0]}']`,
    ) as HTMLImageElement;

    //
    expect(h1InnerText.toLowerCase().includes('update')).toBeTrue();

    expect(nameInput.value)
      .withContext('name field mismatch')
      .toBe(mockProductWithVariantsAndTags.name);

    expect(slugInput.value)
      .withContext('slug field mismatch')
      .toBe(mockProductWithVariantsAndTags.slug);

    expect(descriptionElement)
      .withContext('description field mismatch')
      .toBeTruthy();

    categoryInputs.forEach((categoryInput, i) =>
      expect(categoryInput.value)
        .withContext('categories field mismatch')
        .toBe(mockProductWithVariantsAndTags.categories![i]),
    );

    expect(emailMessageInput.value)
      .withContext('emailMessage field mismatch')
      .toBe(mockProductWithVariantsAndTags.emailMessage || '');

    expect(stockInput).withContext('stock field mismatch').toBeNull();

    mockProductWithVariantsAndTags.variants?.forEach((variantGroup, i) => {
      expect(variantNameInputs[i].value)
        .withContext('variant field mismatch')
        .toBe(variantGroup.groupName || '');

      expect(variantTypeInputs[i].value)
        .withContext('variant field mismatch')
        .toBe(variantGroup.type || '');

      variantGroup.variants.forEach((variant, j) => {
        expect(variantValueInputs[i][j].value)
          .withContext('variant field mismatch')
          .toBe(variant.name || '');

        expect(variantStockInputs[i][j].value)
          .withContext('variant field mismatch')
          .toBe(variant.stock.toString() || '');
      });
    });

    searchTagNameInputs.forEach((searchTagNameInput, i) => {
      expect(searchTagNameInput.value)
        .withContext('searchtag field mismatch')
        .toBe(mockProductWithVariantsAndTags.searchTags?.[i].name || '');
    });

    searchTagValueInputs.forEach((searchTagValueInput, i) => {
      expect(searchTagValueInput.value)
        .withContext('searchtag field mismatch')
        .toBe(mockProductWithVariantsAndTags.searchTags?.[i].value || '');
    });

    expect(getNumberValueFromText(priceInput.value))
      .withContext('price field mismatch')
      .toBe(mockProductWithVariantsAndTags.price);

    expect(img).withContext("image doesn't render").toBeTruthy();
  });

  it('should display an input for product stock if no variants are present and populate it with appropriate data', async () => {
    await setMockRouteSlugParameter('fullPriceProductSlug');
    await component.ngOnInit();
    fixture.detectChanges();
    const stockInput = rootElement.querySelector('#stock') as HTMLInputElement;

    expect(stockInput.value).toBe(
      mockProductWithoutDiscount.defaultStock?.toString() || '',
    );
  });

  it('should not display an input for product stock if variants are present', async () => {
    await setMockRouteSlugParameter('variantsProductSlug');
    await component.ngOnInit();
    fixture.detectChanges();
    const stockInput = rootElement.querySelector('#stock');

    expect(stockInput).toBeNull();
  });

  it('should not display discount related fields if discount is 0', async () => {
    await setMockRouteSlugParameter('fullPriceProductSlug');
    await component.ngOnInit();
    fixture.detectChanges();
    const discountSwitch = rootElement.querySelector(
      '#discount',
    ) as HTMLElement;
    const discountInput = rootElement.querySelector(
      '#numberInput_Discount',
    ) as HTMLInputElement;
    const discountPercentInput = rootElement.querySelector(
      '#discountPercent',
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
    await setMockRouteSlugParameter('discountedProductSlug');
    await component.ngOnInit();
    fixture.detectChanges();
    const discountSwitch = rootElement.querySelector(
      '#discount',
    ) as HTMLElement;
    const discountInput = rootElement.querySelector(
      '#numberInput_discount',
    ) as HTMLInputElement;
    const discountPercentInput = rootElement.querySelector(
      '#discountPercent',
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
    await setMockRouteSlugParameter(null);
    await component.ngOnInit();
    fixture.detectChanges();
    const h1InnerText = rootElement.querySelector('h1')!.innerHTML as string;

    expect(h1InnerText.toLowerCase().includes('update')).toBeFalse();
    expect(component.product).toBeFalsy();
  });

  it('should navigate back if route parameter exists but is an invalid product slug', async () => {
    await setMockRouteSlugParameter('BadProductSlug');
    await component.ngOnInit();
    fixture.detectChanges();

    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should call updateProduct if a valid update form is submitted', async () => {
    await setMockRouteSlugParameter('fullPriceProductSlug');
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
    await setMockRouteSlugParameter(null);
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
    await setMockRouteSlugParameter('fullPriceProductSlug');
    await component.ngOnInit();
    fixture.detectChanges();

    component.onCancel();

    expect(locationSpy.back).toHaveBeenCalled();
  });
});
