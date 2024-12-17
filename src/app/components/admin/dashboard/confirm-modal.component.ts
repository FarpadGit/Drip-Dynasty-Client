import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonDirective } from '../../../directives/UI/button.directive';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [ButtonDirective],
  template: `<div
    class="fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center z-30"
    (click)="closeModal(false)"
  >
    <div
      class="relative bg-background p-8 rounded-lg text-center max-w-lg w-full shadow-[0_5px_15px_rgba(0,0,0,0.3)] animate-entry mx-4 sm:m-0"
      (click)="$event.stopPropagation()"
    >
      <h2 class="text-2xl font-semibold leading-none tracking-tight mb-4">
        Resetting Database
      </h2>
      <p class="text-xs mb-4">
        This will delete everything from the server side database and repopulate
        it with starter products. Are you sure you want to proceed?
      </p>
      <p class="text-xs text-muted-foreground">
        This feature is mainly for the case of a visitor who came before you got
        a little too carried away with playing with the site.
      </p>
      <div class="flex justify-between mt-4">
        <button class="ui-button" variant="primary" (click)="closeModal(true)">
          Yes, reset it
        </button>
        <button
          class="ui-button"
          variant="secondary"
          (click)="closeModal(false)"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>`,
})
export class ConfirmModalComponent {
  @Output() close = new EventEmitter<boolean>();

  closeModal(response: boolean): void {
    this.close.emit(response);
  }
}
