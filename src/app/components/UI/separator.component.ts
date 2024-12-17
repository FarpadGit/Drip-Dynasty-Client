import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-separator',
  standalone: true,
  imports: [],
  template: `<div
    class="relative {{ bgColor }} bg-contain bg-center bg-repeat-x {{
      _brightness
    }} w-full h-full"
  ></div>`,
})
export class SeparatorComponent {
  @Input() color: 'green' | 'orange' = 'green';
  @Input() brightness: 'normal' | 'dim' = 'normal';
  get bgColor() {
    if (this.color === 'orange')
      return 'bg-[url(./assets/separator-orange.png)]';
    else return 'bg-[url(./assets/separator-green.png)]';
  }
  get _brightness() {
    if (this.brightness === 'dim') return 'brightness-50';
    else return 'brightness-100';
  }
}
