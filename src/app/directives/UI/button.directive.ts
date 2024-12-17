import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: 'button.ui-button',
  standalone: true,
  providers: [],
})
export class ButtonDirective implements AfterContentInit {
  variantClasses: string = '';
  @Input() set variant(value: 'leading' | 'primary' | 'secondary') {
    switch (value) {
      case 'primary':
        this.variantClasses =
          'bg-primary text-primary-foreground hover:bg-primary/80';
        break;
      case 'secondary':
        this.variantClasses =
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:brightness-50';
        break;
      case 'leading':
      default:
        this.variantClasses =
          'bg-leading text-leading-foreground enabled:shadow-leading hover:bg-leading/80';
        break;
    }
  }

  constructor(private eleRef: ElementRef) {}

  ngAfterContentInit(): void {
    if (this.variantClasses === '') this.variant = 'leading';
    const hostClasses = (this.eleRef.nativeElement as HTMLElement).className;
    (this.eleRef.nativeElement as HTMLElement).className =
      'inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs sm:text-sm font-medium ring-offset-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ' +
      this.variantClasses +
      ' ' +
      hostClasses;
  }
}
