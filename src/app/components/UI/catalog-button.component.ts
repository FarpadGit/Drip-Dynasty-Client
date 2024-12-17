import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'ui-catalog-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `<a [routerLink]="href" tabindex="-1">
    <button
      class="relative w-full uppercase"
      tabindex="0"
      (mouseenter)="handleHover()"
      (mouseleave)="isHover = false"
    >
      <div
        class="absolute top-0 flex justify-center items-center w-[25.3px] h-12 bg-orange rounded-bl-md clippath-small"
        [style]="{ '--clipstart': '10px' }"
      >
        <div
          class="relative -bottom-[1px] -left-[1px] w-[calc(100%-4px)] h-[calc(100%-4px)] {{
            hoverClasses
          }} rounded-bl-md clippath-small"
          [style]="{ '--clipstart': '11px' }"
        ></div>
      </div>
      <div
        class="flex justify-center items-center h-12 bg-orange rounded-r-md clippath"
        [style]="{ '--clipstart': '10px' }"
      >
        <div
          class="flex items-center w-[calc(100%-2px)] h-[calc(100%-2px)] p-4 pl-20 {{
            hoverClasses
          }} rounded-r-md font-semibold clippath"
          [style]="{ '--clipstart': '11px' }"
        >
          <ng-content />
        </div>
      </div>
    </button>
  </a>`,
  styles: `.clippath { clip-path: polygon(var(--clipstart) 0, 42.2px 100%, 100% 100%, 100% 0%); } .clippath-small { clip-path: polygon(0 var(--clipstart), 0 100%, 100% 100%); }`,
})
export class CatalogButtonComponent {
  @Input() href: string = '';
  @Output() onHover = new EventEmitter<void>();
  isHover: boolean = false;
  get hoverClasses() {
    return this.isHover
      ? 'bg-transparent text-background'
      : 'bg-background text-foreground';
  }

  handleHover() {
    this.isHover = true;
    this.onHover.emit();
  }
}
