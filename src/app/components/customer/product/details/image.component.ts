import { Component, Input } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'ui-image',
  standalone: true,
  imports: [],
  template: `<img
    class="h-full rounded-md object-contain sm:object-cover"
    [src]="_src"
    alt=""
    [@fade]="{ value: isImageFading ? 'out' : 'in', params: { delay: delay } }"
  />`,
  animations: [
    trigger('fade', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in <=> out', animate(`{{delay}}ms ease-in-out`)),
    ]),
  ],
})
export class ImageComponent {
  _src: string = '';
  @Input() delay: number = 200;
  @Input() set src(value: string) {
    this.isImageFading = true;
    setTimeout(() => {
      this._src = value;
      this.isImageFading = false;
    }, this.delay);
  }

  isImageFading: boolean = false;
}
