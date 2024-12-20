import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  styleUrl: './not-found.component.scss',
  template: `<div class="h-[70vh] md:h-full flex justify-center items-center">
    <div
      class="relative flex bg-background text-card-foreground bg-product-grid bg-no-repeat bg-center bg-cover bg-blend-soft-light p-4 gap-4 rounded-2xl overflow-hidden font-sans before:border-gradient-green before:absolute before:top-0 before:left-0 before:w-full before:h-full before:pointer-events-none md:before:content-none"
    >
      <div class="flex flex-col text-justify grow">
        <div class="my-4 md:my-32 flex justify-center">
          <h1
            class="relative font-Steps text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl select-none text-center text-foreground text-outline-glitch"
            data-title="Page Not Found"
            [ngClass]="{ glitch: glitchCounter % 4 === 0 }"
          >
            Page Not Found
          </h1>
        </div>
      </div>
    </div>
  </div>`,
})
export class NotFoundComponent {
  glitchCounter: number = 0;

  constructor() {
    setInterval(() => {
      this.glitchCounter++;
    }, 1000);
  }
}
