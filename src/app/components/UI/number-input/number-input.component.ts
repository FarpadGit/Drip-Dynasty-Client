import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputDirective } from '../../../directives/UI/input.directive';
import { LabelDirective } from '../../../directives/UI/label.directive';

@Component({
  selector: 'ui-number-input',
  standalone: true,
  imports: [CommonModule, InputDirective, LabelDirective],
  templateUrl: './number-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NumberInputComponent,
      multi: true,
    },
  ],
})
export class NumberInputComponent implements ControlValueAccessor {
  @Input() title: string = '';
  @Input() maxValue: bigint | number = 2000000000n;
  @Input() labelHidden: boolean = false;

  numericValue: bigint = 1n;
  maskedValue: string = '1';

  caretOffset: number | null = null;
  isTextSelected: boolean = false;
  onInputChanged: Function | null = null;

  // This is used for calculating the currency symbol distance.
  // Unlike maskedValue or input.value, this is always up to date with the actual contents of the input.
  currentInputValue: string = this.maskedValue;

  formatToCurrency(numberText: string) {
    try {
      const parsedBigInt = BigInt(numberText);
      this.numericValue = parsedBigInt;
      if (this.numericValue > this.maxValue)
        this.numericValue = BigInt(this.maxValue);
      this.maskedValue = this.numericValue
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } catch (ignored) {
      // the user typed in something non-numeric, just ignore it and don't set
    } finally {
      this.currentInputValue = this.maskedValue;
    }
  }

  onInput(e: Event) {
    this.currentInputValue = (e.target as HTMLInputElement).value;
  }

  onKeyUp(e: KeyboardEvent) {
    if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      return;
    }

    const input = e.target as HTMLInputElement;
    // save caret position
    const caretPos = input.selectionStart;

    this.formatToCurrency(input.value.replace(/\s/g, ''));

    // this will jump the caret to the end of text as a side effect and will need to be repositioned
    input.value = this.maskedValue;

    // place the caret back where it's expected to be - which depends on the keys pressed...
    this.setInputCaret(
      input,
      e.key === 'Delete' || this.isTextSelected ? 'start' : 'end',
      caretPos
    );

    //callback for reactive forms
    this.onInputChanged?.(this.numericValue);
  }

  onKeyDown(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement;

    if (input.selectionStart !== input.selectionEnd) {
      // the user selected a substring to overwrite, caret should go to the beginning
      this.caretOffset = Math.min(input.selectionStart!, input.selectionEnd!);
      this.isTextSelected = true;
    } else {
      this.caretOffset = input.value.length - input.selectionStart!;
    }
  }

  // When deleting with the Del key the caret position will be calculated from the start, otherwise from the end of the string.
  // This is because when deleting with the Backspace key the user expects the trailing characters after the caret to stay and the caret itself stays fixed relative to the end,
  // but when using the Delete key this order is flipped and the caret should stay put relative to the start.
  // Overwriting selections of text also have similar expectations as using the Delete key.
  setInputCaret(
    input: HTMLInputElement,
    positionFrom: 'start' | 'end',
    caretPosition: number | null = null
  ) {
    if (positionFrom === 'end') {
      input.setSelectionRange(
        this.maskedValue.length - this.caretOffset!,
        this.maskedValue.length - this.caretOffset!
      );
    } else {
      input.setSelectionRange(caretPosition, caretPosition);
    }
    this.isTextSelected = false;
  }

  // functions for bridging component with reactive forms
  writeValue(value: number): void {
    this.numericValue = BigInt(value);
    this.formatToCurrency(this.numericValue.toString());
  }
  registerOnChange(fn: Function): void {
    this.onInputChanged = fn;
  }
  registerOnTouched(fn: Function): void {}
}
