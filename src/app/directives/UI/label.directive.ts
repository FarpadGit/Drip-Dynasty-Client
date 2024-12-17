import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '.ui-label',
  standalone: true,
})
export class LabelDirective {
  constructor(eleRef: ElementRef) {
    const hostClasses = (eleRef.nativeElement as HTMLElement).className;
    (eleRef.nativeElement as HTMLElement).className =
      'text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ' +
      hostClasses;
  }
}
