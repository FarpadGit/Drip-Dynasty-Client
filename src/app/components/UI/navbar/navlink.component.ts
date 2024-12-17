import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'ui-navlink',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `<a
    class="flex justify-center px-2 py-3 sm:p-4 text-sm sm:text-base cursor-pointer bg-[var(--navlink-bg)] text-[var(--navlink-text)] hover:bg-[var(--navlink-hover-bg)] hover:text-[var(--navlink-hover-text)] focus-visible:bg-[var(--navlink-hover-bg)] focus-visible:text-[var(--navlink-hover-text)]"
    [ngClass]="{
      '!bg-[var(--navlink-active-bg)] !text-[var(--navlink-active-text)]': isCurrentPathActive,
    }"
    [routerLink]="href"
    (click)="click.emit()"
  >
    <ng-content />
  </a>`,
})
export class NavlinkComponent {
  @Input() href: string | undefined;
  @Output() click = new EventEmitter<void>();

  constructor(private router: Router) {}

  get isCurrentPathActive() {
    return this.router.url === this.href;
  }
}
