import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  TableComponent,
  tableIconsType,
  tableRowType,
} from './table.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const mockHeaders = [
    'header1',
    { label: 'header2', width: 10 },
    'header3',
    null,
  ];

  const mockData: tableRowType[] = [
    { id: 'ID1', cells: ['data11', 'data12', 'data13'], options: ['option1'] },
    { id: 'ID2', cells: ['data21', 'data22', 'data23'], options: ['option2'] },
    { id: 'ID3', cells: ['data31', 'data32', 'data33'], options: ['option3'] },
  ];

  const mockDataWithIcons: tableRowType[] = [
    ...mockData,
    { id: 'ID4', cells: ['ICON0', 'data42', 'ICON1'], options: ['option4'] },
  ];

  const mockIcons: tableIconsType[] = [
    {
      svg: '<svg><circle></circle></svg>',
    },
    {
      svg: '<svg><rect></rect></svg>',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.headers = mockHeaders;
    component.data = mockData;
    component.icons = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display headers', () => {
    const headerElements = fixture.debugElement.nativeElement.querySelectorAll(
      'th'
    ) as NodeList;
    const headerLabels = Array.from(headerElements).map(
      (header) => header.textContent
    );
    const mockHeaderLabels = mockHeaders.map((header) => {
      if (typeof header === 'string') return header;
      if (header == null) return '';
      return header.label;
    });

    expect(headerLabels).toEqual(mockHeaderLabels);
  });

  it('should have only 1 cell if input data is empty', () => {
    component.data = [];
    fixture.detectChanges();
    const cells = fixture.debugElement.nativeElement.querySelectorAll(
      'td'
    ) as NodeList;

    expect(cells.length).toBe(1);
    expect((cells.item(0) as HTMLTableCellElement).colSpan).toBe(
      mockHeaders.length
    );
  });

  it('should display input data as table cells', () => {
    const rows = fixture.debugElement.nativeElement.querySelectorAll(
      'tr'
    ) as NodeList;
    rows.forEach((row, rowIndex) => {
      const cells = (row as HTMLTableRowElement).querySelectorAll(
        'td'
      ) as NodeList;
      Array.from(cells).forEach((cell, cellIndex) => {
        expect((cell as HTMLTableCellElement).textContent?.trim()).toBe(
          mockData[rowIndex - 1].cells[cellIndex]?.toString() || ''
        );
      });
    });
  });

  it('should display icons if input data includes icon info', () => {
    component.data = mockDataWithIcons;
    component.icons = mockIcons;
    fixture.detectChanges();
    const rows = fixture.debugElement.nativeElement.querySelectorAll(
      'tr'
    ) as NodeList;
    rows.forEach((row, rowIndex) => {
      const cells = (row as HTMLTableRowElement).querySelectorAll(
        'td'
      ) as NodeList;
      Array.from(cells).forEach((cell, cellIndex) => {
        const svgs = (cell as HTMLTableCellElement).querySelectorAll(
          'svg'
        ) as NodeList;

        const testedCell = component.data[rowIndex - 1].cells[cellIndex];

        if (testedCell) {
          if (testedCell.toString().startsWith('ICON')) {
            const index = parseInt(testedCell.toString().slice(4));

            expect((svgs.item(0) as HTMLElement)?.outerHTML).toBe(
              mockIcons[index].svg
            );
          } else expect(svgs.length).toBe(0);
        } else expect(testedCell).toBeUndefined();
      });
    });
  });

  it('should display loading spinner if loading state is true', () => {
    component.isLoading = true;
    fixture.detectChanges();
    const spinners = fixture.debugElement.nativeElement.querySelectorAll(
      '.spinner'
    ) as NodeList;

    expect(spinners.length).not.toBe(0);
  });
});
