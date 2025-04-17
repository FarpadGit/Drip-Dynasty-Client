import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductsComponent } from './products.component';
import { NavButtonComponent } from '../../UI/nav-button.component';
import { ProductService } from '../../../services/product.service';
import { mockProducts } from '../../../../test/mocks';
import { getNumberValueFromText } from '../../../../test/test-utils';
import { asyncType, productType } from '../../../types';
import { MockNavButtonComponent } from '../../../../test/mockComponents';

describe('ProductsComponent (Admin facing)', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    productSpy = jasmine.createSpyObj('ProductService', [
      'getProducts',
      'fetchProducts',
      'deleteProduct',
      'toggleProductActivation',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    productSpy.getProducts.and.returnValue({
      value: mockProducts,
      isLoading: false,
      hasError: false,
    } as asyncType<productType[]>);

    productSpy.toggleProductActivation.and.resolveTo(true);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: null },
      ],
    })
      .overrideComponent(ProductsComponent, {
        remove: {
          imports: [NavButtonComponent],
        },
        add: {
          imports: [MockNavButtonComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have headers for activation status, product name, price, discount and number of orders', () => {
    const headers = component.headers
      .map((header) => (typeof header === 'string' ? header : header.label))
      .map((header) => header.toLowerCase());

    expect(headers.find((h) => h.match(/active/))).toBeTruthy();
    expect(headers.find((h) => h.match(/name/))).toBeTruthy();
    expect(headers.find((h) => h.match(/price/))).toBeTruthy();
    expect(headers.find((h) => h.match(/discount/))).toBeTruthy();
    expect(headers.find((h) => h.match(/orders/))).toBeTruthy();
  });

  it('should prepare product data for table to display', () => {
    const cellsOfImportance = component.productTableCells.map((row) => ({
      active: row.cells[0],
      name: row.cells[1],
      price:
        row.cells[2] === ''
          ? 0
          : getNumberValueFromText(row.cells[2] as string),
      discount:
        row.cells[3] === ''
          ? 0
          : getNumberValueFromText(row.cells[3] as string),
      orders: row.cells[4],
      options: row.options?.map((option) =>
        typeof option === 'string' ? option : option.id
      ),
    }));

    const sortedMockProducts = [...mockProducts].sort(
      (a, b) => a.createdSince - b.createdSince
    );
    const expectedCells = sortedMockProducts.map((product) => ({
      active: jasmine.stringContaining('ICON'),
      name: product.name,
      price: product.price,
      discount: product.discount,
      orders: product.orders?.length || 0,
      options: jasmine.arrayContaining(['edit', 'toggleActivate', 'delete']),
    }));

    expect(cellsOfImportance).toEqual(expectedCells);
  });

  it('should navigate to edit page if edit option was selected', () => {
    component.handleSelectedOption({
      itemId: 'fakeCustomerID',
      option: { id: 'edit', label: '' },
    });

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      'admin/products/fakeCustomerID/edit',
    ]);
  });

  it('should call toggleProductActivation if toggle option was selected', () => {
    component.handleSelectedOption({
      itemId: 'fakeCustomerID',
      option: { id: 'toggleActivate', label: '' },
    });

    expect(productSpy.toggleProductActivation).toHaveBeenCalledWith(
      'fakeCustomerID'
    );
  });

  it('should call deleteProduct if delete option was selected', () => {
    component.handleSelectedOption({
      itemId: 'fakeCustomerID',
      option: { id: 'delete', label: '' },
    });

    expect(productSpy.deleteProduct).toHaveBeenCalledWith('fakeCustomerID');
  });
});
