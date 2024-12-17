import { Component, Input } from '@angular/core';
import { SeparatorComponent } from './separator.component';

@Component({
  selector: 'ui-section-head',
  standalone: true,
  imports: [SeparatorComponent],
  template: `<div class="relative flex justify-center items-center gap-4 my-12">
    <ui-separator
      [color]="color"
      class="absolute w-screen sm:w-full h-2 -left-8 sm:left-0"
      brightness="dim"
    />
    <div
      class="absolute top-0 {{
        left
      }} -translate-y-1/3 flex justify-center items-center w-full sm:w-1/2 md:w-1/3 xl:w-1/5 h-14 {{
        bgColor
      }} {{ clippath }}"
    >
      <div
        class="flex {{
          justify
        }} items-center text-center w-[calc(100%-2px)] h-[calc(100%-2px)] bg-card uppercase font-semibold text-xs lg:text-base {{
          clippath
        }}"
      >
        <ng-content />
      </div>
    </div>
  </div>`,
  styles: `.clippath-center { clip-path: polygon(0% 0%, 100% 0, 100% 50%, 90% 100%, 10% 100%, 0% 50%, 0% 0%); }
           .clippath-left { clip-path: polygon(0% 0%, 100% 0, 100% 50%, 90% 100%, 40% 100%, 35% 75%, 0% 75%, 0% 0%); }
           .clippath-right { clip-path: polygon(0% 0%, 100% 0, 100% 75%, 75% 75%, 70% 100%, 10% 100%, 0% 50%, 0% 0%); }`,
})
export class SectionHeadComponent {
  @Input() side: 'left' | 'center' | 'right' = 'center';
  @Input() color: 'green' | 'orange' = 'green';

  get left() {
    if (this.side === 'center') return 'left-1/2 -translate-x-1/2';
    if (this.side === 'left') return 'left-0';
    if (this.side === 'right') return 'right-0';
    return '';
  }

  get justify() {
    if (this.side === 'center') return 'justify-center';
    if (this.side === 'left')
      return 'justify-center xl:justify-end p-[0_10%_0_35%]';
    if (this.side === 'right')
      return 'justify-center xl:justify-start p-[0_30%_0_10%]';
    return '';
  }

  get clippath() {
    if (this.side === 'center') return 'clippath-center';
    if (this.side === 'left') return 'clippath-left';
    if (this.side === 'right') return 'clippath-right';
    return '';
  }

  get bgColor() {
    if (this.color === 'orange') return 'bg-orange';
    return 'bg-green';
  }
}
