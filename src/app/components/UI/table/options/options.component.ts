import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tableOptionType } from '../table.component';
import { ButtonDirective } from '../../../../directives/UI/button.directive';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { featherMoreVertical } from '@ng-icons/feather-icons';

@Component({
  selector: 'ui-options',
  standalone: true,
  imports: [CommonModule, NgIconComponent, ButtonDirective],
  providers: [provideIcons({ featherMoreVertical })],
  templateUrl: './options.component.html',
})
export class OptionsComponent {
  @Input() options: tableOptionType[] = [];
  @Input() side: 'top' | 'bottom' = 'top';
  @Input() set isOpen(value: boolean) {
    this._isOpen = value;
    this.dialogOpen = false;
  }
  @Input() disabled: boolean = false;
  @Output('onToggle') _onToggle = new EventEmitter<void>();
  @Output() onDialogOpened = new EventEmitter<boolean>();
  @Output() onUserSelect = new EventEmitter<tableOptionType>();

  dialogOpen: string | false = false;
  _isOpen: boolean = false;
  get isOpen() {
    return this._isOpen;
  }

  onSelect(option: tableOptionType, e: Event) {
    e.stopPropagation();
    if (option.dialog) {
      this.dialogOpen = option.id;
      this.onDialogOpened.emit(true);
    } else this.onUserSelect.emit(option);
  }

  onDialogConfirm(optionId: string) {
    const option = this.options.find((o) => o.id === optionId);
    this.onUserSelect.emit(option);
    this.onDialogOpened.emit(false);
  }

  onDialogCancel() {
    this.dialogOpen = false;
    this.onDialogOpened.emit(false);
  }

  onToggle(e: Event) {
    e.stopPropagation();
    this._onToggle.emit();
  }

  getErrorMessage() {
    return this.options.find((o) => o.error != undefined)?.error;
  }

  getDialogMessage(id: string) {
    return this.options.find((o) => o.id === id)?.dialog;
  }

  trackby(index: number, item: tableOptionType) {
    return item.error;
  }
}
