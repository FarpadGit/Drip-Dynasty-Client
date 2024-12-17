import { Component } from '@angular/core';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [],
  template: `<div
    class="relative px-[0.6rem] py-1 sm:px-4 sm:py-2 flex justify-center items-center text-2xs sm:text-xs bg-leading-light pointer-events-none z-10 clippath"
  >
    <div
      class="absolute flex items-center justify-center w-[calc(100%-4px)] h-[calc(100%-2px)] text-leading-foreground bg-background clippath"
    ></div>
    <span class="relative z-10"><ng-content /></span>
  </div>`,
  styles: `.clippath { clip-path: polygon(16.1px 0, 0 50%, 0 100%, calc(100% - 16.1px) 100%, 100% 50%, 100% 0%); }`,
})
export class BadgeComponent {}
