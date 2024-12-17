import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, Subscription } from 'rxjs';
import { OptionsComponent } from './options/options.component';
import { NgIconComponent } from '@ng-icons/core';

export type tableRowType = {
  id: string;
  cells: (string | number)[];
  options?: (string | tableOptionType)[];
};

export type tableOptionType = {
  id: string;
  label: string | false;
  styles?: string;
  error?: string;
  dialog?: string;
};

export type tableIconsType = {
  svg: string;
  size?: string;
  color?: string;
  strokeWidth?: string | number;
};

export type responseObjectType =
  | 'ok'
  | { id: string; optionId: string; errorMessage: string };

@Component({
  selector: 'ui-table',
  standalone: true,
  imports: [CommonModule, OptionsComponent, NgIconComponent],
  templateUrl: './table.component.html',
})
export class TableComponent implements OnInit, OnDestroy {
  @Input('headers') _headers: (
    | string
    | { label: string; width: number }
    | null
  )[] = [];
  @Input() data: tableRowType[] = [];
  @Input() icons: tableIconsType[] = [];
  @Input() isLoading: boolean = false;
  @Output() onUserAction = new EventEmitter<{
    itemId: string;
    option: tableOptionType;
    response: BehaviorSubject<responseObjectType | null>;
  }>();

  private optionsOpen: string | false = false;
  openDialogId: string | false = false;
  private actionResponse = new BehaviorSubject<responseObjectType | null>(null);
  private responseSub = new Subscription();

  get headers() {
    return this._headers.map((header) =>
      header == null || typeof header === 'string' ? header : header.label
    );
  }

  headerWidth(index: number) {
    const header = this._headers[index];
    const className =
      header == null || typeof header === 'string'
        ? undefined
        : `${header.width}%`;
    return className;
  }

  // if datacell contains the format 'ICON#' then extract the number after 'ICON' and replace with the appropriate icon from input
  getIconFor(cell: string) {
    try {
      const index = parseInt(cell.slice(4));
      return this.icons[index];
    } catch (_) {
      return undefined;
    }
  }

  @HostListener('document:click', ['$event'])
  documentClick(e: Event): void {
    function bubbleUp(element: HTMLElement) {
      if (element.classList.contains('option')) return true;
      if (element.parentElement == null) return false;
      return bubbleUp(element.parentElement);
    }
    if (!bubbleUp(e.target as HTMLElement)) {
      this.optionsOpen = false;
      this.openDialogId = false;
    }
  }

  ngOnInit(): void {
    this.responseSub = this.actionResponse.subscribe((res) => {
      if (!res) return;
      if (res === 'ok') {
        this.optionsOpen = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.responseSub.unsubscribe();
  }

  // gets the list of options for given row, mapping simple string shorthand values to the canonical tableOptionType form
  getOptions(id: string) {
    const options = this.data.find((data) => data.id === id)?.options || [];
    return options.map((o) =>
      typeof o === 'string' ? ({ id: o, label: o } as tableOptionType) : o
    );
  }

  isOptionOpen(id: string) {
    return this.optionsOpen === id;
  }

  isOptionLast(id: string) {
    if (this.data.length <= 0) return false;
    return id === this.data[this.data.length - 1].id;
  }

  handleToggle(id: string) {
    this.optionsOpen = this.optionsOpen === id ? false : id;
  }

  handleSelectedOption(itemId: string, option: tableOptionType) {
    this.onUserAction.emit({
      itemId,
      option,
      response: this.actionResponse,
    });
  }

  trackby(index: number, item: tableRowType) {
    return item.id;
  }
}
