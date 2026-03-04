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
          'bg-button-primary text-button-primary-foreground hover:bg-button-primary hover:opacity-80';
        break;
      case 'secondary':
        this.variantClasses =
          'bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary hover:opacity-80 hover:brightness-50';
        break;
      case 'leading':
      default:
        this.variantClasses =
          'bg-button-leading text-button-leading-foreground enabled:shadow-button-leading hover:bg-button-leading hover:opacity-80';
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
