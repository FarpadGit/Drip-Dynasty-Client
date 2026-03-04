import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '.ui-select',
  standalone: true,
})
export class SelectDirective {
  constructor(eleRef: ElementRef) {
    const hostClasses = (eleRef.nativeElement as HTMLElement).className;
    (eleRef.nativeElement as HTMLElement).className =
      'block w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
      hostClasses;
  }
}
