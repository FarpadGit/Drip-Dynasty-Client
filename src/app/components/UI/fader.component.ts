import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageFallbackDirective } from '../../directives/image-fallback.directive';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'ui-fader',
  standalone: true,
  imports: [CommonModule, ImageFallbackDirective],
  template: `<div class="overflow-hidden w-full h-full" #slider>
    <div
      *ngFor="let imgSrc of images; index as i"
      class="absolute top-0 left-0 w-full h-full flex justify-center"
      [ngStyle]="{ opacity: opacities[i] || 0 }"
    >
      <img
        class="absolute w-full xl:w-3/4 h-full {{ objectFit }}"
        [src]="imgSrc"
        [alt]="alt"
        app-fallback
      />
    </div>
  </div>`,
})
export class FaderComponent implements AfterViewInit, OnDestroy {
  @Input() images: string[] = [];
  @Input() alt: string = '';
  @Input() fit: 'contain' | 'cover' = 'contain';
  @Input() set activeIndex(value: number) {
    if (this.newIndex === value) return;
    this.oldIndex = this.newIndex;
    this.newIndex = value;
    this.keenSlider?.next();
  }

  oldIndex: number = 0;
  newIndex: number = 0;
  opacities: number[] = [1];

  get objectFit() {
    if (this.fit === 'cover') return 'object-cover';
    return 'object-contain';
  }

  @ViewChild('slider') sliderElement: ElementRef<HTMLElement> | undefined;
  keenSlider: KeenSliderInstance | null = null;

  ngAfterViewInit(): void {
    if (!this.keenSlider && this.sliderElement)
      this.keenSlider = new KeenSlider(this.sliderElement.nativeElement, {
        slides: 2,
        defaultAnimation: {
          duration: 750,
        },
        drag: false,
        loop: true,
        detailsChanged: (s) => {
          // setTimeout with delay of 0 will update opacities on the next change detection cycle and avoids ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            if (this.images.length < 2 || s.animator.targetIdx == null) return;
            this.opacities = this.images.map(() => 0);
            if (s.animator.targetIdx % 2 === 1) {
              this.opacities[this.oldIndex] = s.track.details.slides[0].portion;
              this.opacities[this.newIndex] = s.track.details.slides[1].portion;
            } else {
              this.opacities[this.newIndex] = s.track.details.slides[0].portion;
              this.opacities[this.oldIndex] = s.track.details.slides[1].portion;
            }
          }, 0);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.keenSlider) this.keenSlider.destroy();
  }
}
