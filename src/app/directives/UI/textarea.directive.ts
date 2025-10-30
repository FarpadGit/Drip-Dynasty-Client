import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '.ui-textarea',
  standalone: true,
})
export class TextareaDirective {
  constructor(eleRef: ElementRef) {
    const hostClasses = (eleRef.nativeElement as HTMLElement).className;
    (eleRef.nativeElement as HTMLElement).className =
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ' +
      hostClasses;
    (eleRef.nativeElement as HTMLTextAreaElement).spellcheck = false;
  }
}
