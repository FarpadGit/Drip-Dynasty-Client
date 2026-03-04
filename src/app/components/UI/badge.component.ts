import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    class="relative px-[0.6rem] py-1 sm:px-4 sm:py-2 flex justify-center items-center pointer-events-none z-10 clippath {{
      fontSize
    }}"
    [ngClass]="{
      'bg-leading-light': color === 'red',
      'bg-secondary': color === 'orange',
      'bg-primary': color === 'green',
    }"
  >
    <div
      class="absolute flex items-center justify-center w-[calc(100%-4px)] h-[calc(100%-2px)] text-leading-foreground bg-background clippath"
    ></div>
    <span class="relative z-10" data-testid="badge-content"
      ><ng-content
    /></span>
  </div>`,
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
export class BadgeComponent {
  @Input() color: 'red' | 'orange' | 'green' = 'red';
  @Input() fontSize: string = 'text-2xs sm:text-xs';
}
