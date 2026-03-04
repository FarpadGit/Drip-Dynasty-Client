import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../services/product.service';
import {
  NgxSliderModule,
  Options as SliderOptions,
} from '@angular-slider/ngx-slider';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  featherChevronLeft,
  featherChevronRight,
  featherChevronUp,
  featherChevronDown,
  featherCheck,
} from '@ng-icons/feather-icons';
import { StyledButtonComponent } from '../../../UI/styled-button.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  templateUrl: './filters.component.html',
  imports: [
    CommonModule,
    NgxSliderModule,
    NgIconComponent,
    StyledButtonComponent,
  ],
  providers: [
    provideIcons({
      featherChevronLeft,
      featherChevronRight,
      featherChevronUp,
      featherChevronDown,
      featherCheck,
    }),
  ],
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  @Input() defaultOpen: boolean = true;
  @Input() collapse: 'vertical' | 'horizontal' = 'horizontal';
  @Output() onChange = new EventEmitter<void>();
  hasLoaded: boolean = false;

  showFilters: boolean = false;
  priceFilter = {
    min: 0,
    max: 0,
  };
  priceSliderOptions: SliderOptions = {
    floor: 0,
    ceil: 0,
    translate: (v) => v + ' Ft',
    showOuterSelectionBars: true,
  };
  groupedSearchFilters: {
    groupLabel: string;
    collapsed: boolean;
    filters: { label: string; on: boolean }[];
  }[] = [];

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    await this.fetchSearchTags();
    this.hasLoaded = true;
    this.showFilters = this.defaultOpen;
  }

  async fetchSearchTags() {
    const { searchTags, maxPrice } =
      (await this.productService.getAllSearchTags()) ?? {};

    if (searchTags == undefined || maxPrice == undefined) return;

    this.priceSliderOptions = {
      ...this.priceSliderOptions,
      ceil: maxPrice,
    };
    this.priceFilter.max = maxPrice;

    const groupedLabels = {} as { [key: string]: string[] };

    // sort groups by label
    searchTags.sort((a, b) => a.name.localeCompare(b.name));

    // sort tags within group by label
    searchTags.forEach((tag) => {
      const rest = groupedLabels[tag.name] ?? [];
      groupedLabels[tag.name] = [...new Set([...rest, tag.value])].sort();
    });

    Object.keys(groupedLabels).forEach((groupLabel) => {
      this.groupedSearchFilters.push({
        groupLabel,
        collapsed: false,
        filters: groupedLabels[groupLabel].map((l) => ({
          label: l,
          on: false,
        })),
      });
    });
  }

  toggleFilterSidebar() {
    if (!this.hasLoaded) return;
    this.showFilters = !this.showFilters;
  }

  toggleFilter(groupIndex: number, FilterIndex: number) {
    const on = this.groupedSearchFilters[groupIndex].filters[FilterIndex].on;
    this.groupedSearchFilters[groupIndex].filters[FilterIndex].on = !on;
    this.emitChanges();
  }

  handlePriceFilterChange() {
    this.emitChanges();
  }

  clearFilters() {
    this.priceFilter.min = 0;
    this.priceFilter.max = this.priceSliderOptions.ceil!;
    this.groupedSearchFilters.forEach((group) => {
      group.filters.forEach((tag) => (tag.on = false));
    });
    this.emitChanges();
  }

  emitChanges() {
    const newPriceMin =
      this.priceFilter.min === 0 ? undefined : this.priceFilter.min;
    const newPriceMax =
      this.priceFilter.max === this.priceSliderOptions.ceil
        ? undefined
        : this.priceFilter.max;

    const activeTagFilters: NonNullable<productFiltersType['tags']> =
      this.groupedSearchFilters.reduce(
        (acc, group) => {
          const activeFilters = group.filters.filter((f) => f.on);

          if (activeFilters.length === 0) return acc;
          const mappedFilters = activeFilters.map((f) => ({
            name: group.groupLabel,
            value: f.label,
          }));
          return [...acc, ...mappedFilters];
        },
        [] as NonNullable<productFiltersType['tags']>,
      );

    const newTagFilters =
      activeTagFilters.length === 0 ? undefined : activeTagFilters;

    this.productService.setProductFilters({
      priceMin: newPriceMin,
      priceMax: newPriceMax,
      tags: newTagFilters,
    });

    this.onChange.emit();
  }

  get collapseButtonIconName() {
    if (this.collapse === 'horizontal' && this.showFilters)
      return 'featherChevronLeft';
    if (this.collapse === 'horizontal' && !this.showFilters)
      return 'featherChevronRight';
    if (this.collapse === 'vertical' && this.showFilters)
      return 'featherChevronUp';
    if (this.collapse === 'vertical' && !this.showFilters)
      return 'featherChevronDown';
    return '';
  }
}
