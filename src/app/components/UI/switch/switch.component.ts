import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ui-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './switch.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SwitchComponent,
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() name: string = '';
  checked: boolean = false;
  onInputChanged: Function | null = null;

  onClick() {
    this.checked = !this.checked;
    this.onInputChanged?.(this.checked);
  }

  // functions for bridging component with reactive forms
  writeValue(value: boolean): void {
    this.checked = value;
  }
  registerOnChange(fn: Function): void {
    this.onInputChanged = fn;
  }
  registerOnTouched(fn: Function): void {}
}
