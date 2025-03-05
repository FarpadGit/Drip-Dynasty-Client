import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class BigSpinnerComponent implements OnInit {
  protected showLabel: boolean = false;

  ngOnInit(): void {
    setTimeout(() => {
      this.showLabel = true;
    }, 5000);
  }
}
