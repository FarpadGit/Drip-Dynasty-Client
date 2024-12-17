import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'img[app-fallback]',
  standalone: true,
  host: {
    '(error)': 'fallbackToDefault()',
    '[src]': 'src',
  },
})
export class ImageFallbackDirective {
  @Input() src!: string;
  @Input() default: string = 'assets/fallback.jpg';

  fallbackToDefault() {
    this.src = this.default;
  }
}
