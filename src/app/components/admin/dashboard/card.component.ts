import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [],
  template: `<div
    class="rounded-lg border bg-card text-card-foreground shadow-sm"
  >
    <div class="flex flex-col space-y-1.5 p-6">
      <h3 class="text-lg sm:text-2xl font-semibold leading-none tracking-tight">
        {{ title }}
      </h3>
      <p class="text-xs sm:text-sm text-muted-foreground">{{ subtitle }}</p>
    </div>
    <div class="p-6 pt-0 text-sm sm:text-base">
      <p>{{ body }}</p>
    </div>
  </div>`,
})
export class CardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() body: string = '';
}
