import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params, RouterLink } from '@angular/router';
import { ButtonDirective } from '../../directives/UI/button.directive';

@Component({
  selector: 'ui-nav-button',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonDirective],
  template: `<ng-template #content><ng-content /></ng-template>
    @if(asButton) {
    <a
      [routerLink]="disabled ? undefined : href"
      [queryParams]="queryParams"
      tabindex="-1"
    >
      <button
        class="ui-button w-full"
        [variant]="variant"
        [disabled]="disabled"
        tabindex="0"
      >
        <ng-container *ngTemplateOutlet="content"></ng-container>
      </button>
    </a>
    } @else {
    <a
      class="flex justify-center items-center w-full h-full"
      [routerLink]="disabled ? undefined : href"
      [queryParams]="queryParams"
    >
      <ng-container *ngTemplateOutlet="content"></ng-container>
    </a>
    }`,
})
export class NavButtonComponent {
  @Input() href: string = '';
  @Input() queryParams?: Params;
  @Input() variant: 'leading' | 'primary' | 'secondary' = 'leading';
  @Input() disabled: boolean = false;
  asButton: boolean = false;
  @Input() set button(value: string | undefined) {
    if (value == undefined) this.asButton = false;
    else this.asButton = true;
  }
}
