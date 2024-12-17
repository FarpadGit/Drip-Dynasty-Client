import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '.ui-header',
  standalone: true,
})
export class HeaderDirective {
  constructor(eleRef: ElementRef) {
    const hostClasses = (eleRef.nativeElement as HTMLElement).className;
    (eleRef.nativeElement as HTMLElement).className =
      'text-xl sm:text-4xl mb-4 ' + hostClasses;
  }
}
