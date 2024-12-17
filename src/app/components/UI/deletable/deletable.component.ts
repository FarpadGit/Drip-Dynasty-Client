import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '[ui-deletable]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './deletable.component.html',
})
export class DeletableComponent {
  @Input('ui-deletable') deleteState: boolean = false;
  @Output() onDelete = new EventEmitter<boolean>();

  onRevert(e: Event) {
    e.stopPropagation();
    this.onDelete.emit(false);
  }
}
