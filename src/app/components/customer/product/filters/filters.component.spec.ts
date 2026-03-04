import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FiltersComponent } from './filters.component';
import { ProductService } from '../../../../services/product.service';
import { mockSearchTags } from '../../../../../test/mocks';

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;
  let rootElement: HTMLElement;
  let productSpy: jasmine.SpyObj<ProductService>;

  beforeEach(async () => {
    productSpy = jasmine.createSpyObj('ProductService', [
      'getAllSearchTags',
      'setProductFilters',
    ]);

    productSpy.getAllSearchTags.and.resolveTo(mockSearchTags);

    await TestBed.configureTestingModule({
      imports: [FiltersComponent],
      providers: [{ provide: ProductService, useValue: productSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    rootElement = fixture.debugElement.nativeElement;
    await component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a price slider, list of search tags and a Clear All button', () => {
    const clearAllButton = fixture.debugElement.query(
      (e) => e.attributes['data-testid'] === 'clearall',
    );
    const priceSlider = fixture.debugElement.query(
      (e) => e.name === 'ngx-slider',
    );
    const searchTagGroups = fixture.debugElement.queryAll(
      (e) => e.attributes['data-testid'] === 'searchtag-group',
    );
    const searchTags = fixture.debugElement.queryAll(
      (e) => e.attributes['data-testid'] === 'searchtag',
    );

    expect(clearAllButton).toBeTruthy();
    expect(priceSlider).toBeTruthy();
    expect(searchTagGroups.length).toBe(
      [...new Set(mockSearchTags.searchTags.map((tag) => tag.name))].length,
    );
    expect(searchTags.length).toBe(mockSearchTags.searchTags.length);
    expect(component.priceFilter.max).toBe(mockSearchTags.maxPrice);
  });

  it('should set product filters if a tag button was clicked', () => {
    const searchTagButton = fixture.debugElement
      .query((e) => e.attributes['data-testid'] === 'searchtag')
      .query((e) => e.name === 'ui-styled-button')
      .query((e) => e.name === 'button').nativeElement;

    searchTagButton.click();
    fixture.detectChanges();

    expect(productSpy.setProductFilters).toHaveBeenCalledWith(
      jasmine.objectContaining({
        tags: [mockSearchTags.searchTags[0]],
      }),
    );
  });

  it('should set product filters if price slider has changed', () => {
    const mockPriceMin = 10;
    const mockPriceMax = 900;
    component.priceFilter.min = mockPriceMin;
    component.priceFilter.max = mockPriceMax;
    component.handlePriceFilterChange();

    expect(productSpy.setProductFilters).toHaveBeenCalledWith(
      jasmine.objectContaining({
        priceMin: mockPriceMin,
        priceMax: mockPriceMax,
      }),
    );
  });

  it('should reset product filters if Clear All button was pressed', () => {
    const clearAllButton = fixture.debugElement
      .query((e) => e.attributes['data-testid'] === 'clearall')
      .query((e) => e.name === 'button').nativeElement;
    clearAllButton.click();

    expect(productSpy.setProductFilters).toHaveBeenCalledWith(
      jasmine.objectContaining({
        priceMin: undefined,
        priceMax: undefined,
        tags: undefined,
      }),
    );
  });
});
