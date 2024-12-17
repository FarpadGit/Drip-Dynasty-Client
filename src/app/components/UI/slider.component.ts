import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'ui-slider',
  standalone: true,
  imports: [CommonModule],
  template: `<div
    class="flex overflow-hidden"
    [ngClass]="{
      'justify-center -translate-x-[calc(var(--slideShift)*15px)]':
        shouldCenterItems
    }"
    #slider
  >
    <ng-content />
  </div>`,
})
export class SliderComponent implements AfterViewChecked, OnDestroy {
  @Input() itemsPerView: number | 'auto' = 'auto';
  @Input() itemsPerMobileView: number | undefined;
  @Input() animSpeed: number = 0;
  @Input() shouldCenterItems: boolean = false;
  @Input() set activeItem(value: number) {
    this.keenSlider?.moveToIdx(value);

    // bugfix for keenSlider not animating when looping back from index 0 to last item
    // if not a concern then skip this part
    if (
      this.animSpeed !== 0 ||
      this.shouldCenterItems ||
      this.itemsPerView === 'auto'
    )
      return;

    if (
      this.keenSlider?.track.details.rel === 0 &&
      value + 1 === this.keenSlider?.slides.length
    ) {
      const currentItemsPerView = (this.keenSlider.options.slides as any)
        .perView;

      // if itemPerView == 1 then target should be the last slide, if == 3 then the 3rd last
      const targetSlide =
        this.keenSlider.track.details.slides.length - currentItemsPerView;

      this.keenSlider.animator.start([
        {
          distance: this.keenSlider.track.details.slides[targetSlide].distance,
          // the default duration & easing KeenSlider uses
          duration: 500,
          easing: (t) => 1 + --t * t * t * t * t,
        },
      ]);
    }
  }

  @ViewChild('slider') sliderElement: ElementRef<HTMLElement> | undefined;
  keenSlider: KeenSliderInstance | null = null;

  // default easeless animation style if animSpeed == 1
  animation = { duration: 5000, easing: (t: number) => t };

  ngAfterViewChecked(): void {
    if (this.keenSlider || !this.sliderElement) return;

    const defaultAnimDuration = this.animSpeed === 0 ? 0 : 5000;
    this.keenSlider = new KeenSlider(this.sliderElement.nativeElement, {
      slides: {
        perView: this.itemsPerMobileView ?? this.itemsPerView,
        spacing: 15,
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: {
            perView: this.itemsPerView,
            spacing: 15,
          },
        },
      },
      loop: this.animSpeed !== 0, // dont loop if not animated
      drag: this.animSpeed !== 0, // dont allow drag if not animated
      renderMode: 'performance',
      dragEnded: () => {
        // slow down after user drags, then speed back after 3s
        this.animation.duration = defaultAnimDuration;
        setTimeout(() => {
          this.animation.duration =
            defaultAnimDuration / Math.abs(this.animSpeed);
        }, 3000);
      },
      created: (s) => {
        // if shouldCenterItems is true then shift back slides by the n * 15px gap KeenSlider adds to its slides
        // (minor beauty fix)
        this.sliderElement?.nativeElement.style.setProperty(
          '--slideShift',
          (s.slides.length - 1).toString()
        );

        // change animation duration based on animSpeed - the higher the speed the less time it takes
        this.animation.duration =
          defaultAnimDuration / Math.abs(this.animSpeed);
        // Math.sign converts animSpeed to 1 or -1 (which as an index will move to next or prev item)
        s.moveToIdx(Math.sign(this.animSpeed), true, this.animation);
      },
      updated: (s) => {
        // same as animationEnded callback but for resizing events
        s.moveToIdx(
          s.track.details.rel + Math.sign(this.animSpeed),
          false,
          this.animation
        );
      },
      animationEnded: (s) => {
        // bugfix attempt? KeenSlider doesn't like infinite looping marquees that go on for too long
        if (s.track.details.abs % s.slides.length === 0) {
          s.update(0);
        }
        // infinite slide animation - if track finished moving to a slide move again to the next one
        // again, Math.sign converts animSpeed to 1 or -1
        s.moveToIdx(
          s.track.details.rel + Math.sign(this.animSpeed),
          false,
          this.animation
        );
      },
    });
  }

  ngOnDestroy(): void {
    if (this.keenSlider) this.keenSlider.destroy();
  }
}
