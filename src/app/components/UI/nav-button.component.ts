import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Params, RouterLink } from '@angular/router';
import { StyledButtonComponent } from './styled-button.component';
import { ButtonDirective } from '../../directives/UI/button.directive';

@Component({
  selector: 'ui-nav-button',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonDirective, StyledButtonComponent],
  template: `<ng-template #content><ng-content /></ng-template>
    <a
      [ngClass]="{
        'flex justify-center items-center w-full h-full': type === 'link',
      }"
      [routerLink]="disabled ? undefined : href"
      [queryParams]="queryParams"
      [tabIndex]="type === 'link' ? tabindex : -1"
    >
      @switch (type) {
        @case ('link') {
          <ng-container *ngTemplateOutlet="content"></ng-container>
        }
        @case ('button') {
          <button
            class="ui-button w-full"
            [variant]="variant"
            [disabled]="disabled"
            [tabindex]="tabindex"
          >
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </button>
        }
        @case ('syledButton') {
          <ui-styled-button
            class="w-full"
            [variant]="variant"
            [disabled]="disabled"
            [tabindex]="tabindex"
          >
            <ng-container *ngTemplateOutlet="content"></ng-container>
          </ui-styled-button>
        }
      }
    </a>`,
})
export class NavButtonComponent {
  @Input() href: string = '';
  @Input() queryParams?: Params;
  @Input() variant: 'leading' | 'primary' | 'secondary' = 'leading';
  @Input() disabled: boolean = false;
  @Input() tabindex: 0 | -1 = 0;
  type: 'link' | 'button' | 'syledButton' = 'link';
  @Input() set asButton(value: string | undefined) {
    if (value !== undefined) this.type = 'button';
  }
  @Input() set asStyledButton(value: string | undefined) {
    if (value !== undefined) this.type = 'syledButton';
  }
}
