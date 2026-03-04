import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ui-styled-button',
  standalone: true,
  imports: [CommonModule],
  template: `<button
    [attr.id]="name ?? null"
    class="relative group w-full h-full min-h-9 min-w-9 px-[0.6rem] py-1 sm:px-4 sm:py-2 flex justify-center items-center focus-visible:outline-none disabled:grayscale z-10 clippath"
    [ngClass]="{
      'bg-primary': variant === 'primary',
      'bg-secondary': variant === 'secondary',
      'min-h-10': color !== undefined,
    }"
    [disabled]="disabled"
    (click)="onClick.emit()"
  >
    <div
      class="absolute flex items-center justify-center w-[calc(100%-4px)] h-[calc(100%-2px)] group-enabled:group-hover:opacity-35 group-focus-visible:opacity-35 transition-opacity duration-500 clippath"
      [ngClass]="{
        'bg-background': color === undefined,
        'opacity-35': checked,
      }"
      [ngStyle]="{ background: color }"
    ></div>
    <span class="z-10" data-testid="button-content"><ng-content /></span>
  </button>`,
  styles: `
    .clippath {
      clip-path: polygon(
        16.1px 0,
        0 50%,
        0 100%,
        calc(100% - 16.1px) 100%,
        100% 50%,
        100% 0%
      );
    }
  `,
})
export class StyledButtonComponent {
  @Input() name: string | undefined;
  @Input() variant: 'primary' | 'secondary' | 'leading' = 'primary';
  @Input() color: string | undefined;
  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter<void>();
}
